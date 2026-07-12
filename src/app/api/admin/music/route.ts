import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

export type MusicTrack = {
  name: string;
  publicUrl: string;
  size: number | null;
  updatedAt: string | null;
};

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const supabaseAdmin = getSupabaseAdmin();
  const { data, error } = await supabaseAdmin.storage.from("music").list("", {
    sortBy: { column: "created_at", order: "desc" },
  });

  if (error) return jsonError(error.message, 500);

  const tracks: MusicTrack[] = (data ?? [])
    // Storage returns a placeholder entry for "empty" folders — skip anything without an id.
    .filter((object) => object.id)
    .map((object) => {
      const { data: publicUrlData } = supabaseAdmin.storage.from("music").getPublicUrl(object.name);
      return {
        name: object.name,
        publicUrl: publicUrlData.publicUrl,
        size: object.metadata?.size ?? null,
        updatedAt: object.updated_at ?? null,
      };
    });

  return NextResponse.json({ tracks });
}

export async function DELETE(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as { name?: unknown } | null;
  if (!body || typeof body.name !== "string" || !body.name.trim()) {
    return jsonError("A track name is required.", 400);
  }

  const { error } = await getSupabaseAdmin().storage.from("music").remove([body.name]);
  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ success: true });
}
