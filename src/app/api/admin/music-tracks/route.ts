import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type MusicTrackInput = {
  title?: unknown;
  file_url?: unknown;
  sort_order?: unknown;
};

type MusicTrackInsert = {
  title: string;
  file_url: string;
  sort_order: number;
};

type NormalizeResult = { ok: true; value: MusicTrackInsert } | { ok: false; error: string };

function normalizeInput(body: MusicTrackInput): NormalizeResult {
  if (typeof body.title !== "string" || !body.title.trim()) {
    return { ok: false, error: "Title is required." };
  }
  if (typeof body.file_url !== "string" || !body.file_url.trim()) {
    return { ok: false, error: "file_url is required." };
  }

  return {
    ok: true,
    value: {
      title: body.title.trim(),
      file_url: body.file_url.trim(),
      sort_order:
        typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
          ? body.sort_order
          : 0,
    },
  };
}

export async function GET(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("music_tracks")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ tracks: data });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as MusicTrackInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const normalized = normalizeInput(body);
  if (!normalized.ok) return jsonError(normalized.error, 400);

  const { data, error } = await getSupabaseAdmin()
    .from("music_tracks")
    .insert(normalized.value)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ track: data }, { status: 201 });
}
