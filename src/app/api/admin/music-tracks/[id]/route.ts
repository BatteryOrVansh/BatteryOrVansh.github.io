import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type MusicTrackPatchInput = {
  title?: unknown;
  is_active?: unknown;
  sort_order?: unknown;
};

type MusicTrackUpdate = {
  title?: string;
  is_active?: boolean;
  sort_order?: number;
};

type BuildUpdateResult = { ok: true; value: MusicTrackUpdate } | { ok: false; error: string };

function buildUpdate(body: MusicTrackPatchInput): BuildUpdateResult {
  const update: MusicTrackUpdate = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { ok: false, error: "Title cannot be empty." };
    }
    update.title = body.title.trim();
  }

  if (body.sort_order !== undefined) {
    update.sort_order =
      typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
        ? body.sort_order
        : 0;
  }

  if (body.is_active !== undefined) {
    update.is_active = typeof body.is_active === "boolean" ? body.is_active : true;
  }

  return { ok: true, value: update };
}

/**
 * The upload route (`POST /api/admin/upload`) stores objects flat in the
 * `music` bucket with no subfolders, so the storage path is simply
 * everything after `/storage/v1/object/public/music/` in the public URL.
 */
function storagePathFromPublicUrl(publicUrl: string): string | null {
  const marker = "/storage/v1/object/public/music/";
  const index = publicUrl.indexOf(marker);
  if (index === -1) return null;
  const path = publicUrl.slice(index + marker.length);
  return path || null;
}

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as MusicTrackPatchInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const result = buildUpdate(body);
  if (!result.ok) return jsonError(result.error, 400);

  if (Object.keys(result.value).length === 0) {
    return jsonError("No fields to update.", 400);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("music_tracks")
    .update(result.value)
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ track: data });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { id } = await context.params;
  const supabaseAdmin = getSupabaseAdmin();

  const { data: existing, error: fetchError } = await supabaseAdmin
    .from("music_tracks")
    .select("file_url")
    .eq("id", id)
    .maybeSingle();

  if (fetchError) return jsonError(fetchError.message, 500);

  const { error: deleteError } = await supabaseAdmin.from("music_tracks").delete().eq("id", id);
  if (deleteError) return jsonError(deleteError.message, 500);

  if (existing?.file_url) {
    const storagePath = storagePathFromPublicUrl(existing.file_url);
    if (storagePath) {
      // Best-effort: the DB row is already gone, so don't fail the request
      // over an orphaned storage object.
      await supabaseAdmin.storage.from("music").remove([storagePath]);
    }
  }

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
