import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { supabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_BIO_KEYS = [
  "photo_url",
  "summary",
  "education",
  "experience",
  "contact",
  "links",
  "certifications",
] as const;

async function upsertBio(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as { key?: unknown; value?: unknown } | null;
  if (!body || typeof body.key !== "string") {
    return jsonError("A bio content key is required.", 400);
  }

  if (!ALLOWED_BIO_KEYS.includes(body.key as (typeof ALLOWED_BIO_KEYS)[number])) {
    return jsonError("Unknown bio content key.", 400);
  }

  if (body.value !== null && typeof body.value !== "string") {
    return jsonError("Value must be a string or null.", 400);
  }

  const { data, error } = await supabaseAdmin
    .from("bio_content")
    .upsert({ key: body.key, value: body.value }, { onConflict: "key" })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ bio: data });
}

export async function PUT(request: NextRequest) {
  return upsertBio(request);
}

export async function POST(request: NextRequest) {
  return upsertBio(request);
}
