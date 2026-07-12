import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_BUCKETS = ["photos", "music"] as const;
type AllowedBucket = (typeof ALLOWED_BUCKETS)[number];

function isAllowedBucket(value: unknown): value is AllowedBucket {
  return typeof value === "string" && (ALLOWED_BUCKETS as readonly string[]).includes(value);
}

function sanitizeFileName(name: string): string {
  const lastDot = name.lastIndexOf(".");
  const ext = lastDot >= 0 ? name.slice(lastDot + 1).toLowerCase().replace(/[^a-z0-9]/g, "") : "";
  const base = (lastDot >= 0 ? name.slice(0, lastDot) : name)
    .toLowerCase()
    .replace(/[^a-z0-9-_]+/g, "-")
    .replace(/^-+|-+$/g, "")
    .slice(0, 60);
  return `${base || "file"}${ext ? `.${ext}` : ""}`;
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const formData = await request.formData().catch(() => null);
  if (!formData) return jsonError("Invalid form data.", 400);

  const bucket = formData.get("bucket");
  const file = formData.get("file");

  if (!isAllowedBucket(bucket)) {
    return jsonError("Bucket must be 'photos' or 'music'.", 400);
  }

  if (!(file instanceof File)) {
    return jsonError("A file is required.", 400);
  }

  const path = `${crypto.randomUUID()}-${sanitizeFileName(file.name)}`;
  const arrayBuffer = await file.arrayBuffer();
  const supabaseAdmin = getSupabaseAdmin();

  const { error: uploadError } = await supabaseAdmin.storage
    .from(bucket)
    .upload(path, arrayBuffer, {
      contentType: file.type || undefined,
      upsert: false,
    });

  if (uploadError) return jsonError(uploadError.message, 500);

  const { data: publicUrlData } = supabaseAdmin.storage.from(bucket).getPublicUrl(path);

  return NextResponse.json(
    { path, publicUrl: publicUrlData.publicUrl, bucket },
    { status: 201 }
  );
}
