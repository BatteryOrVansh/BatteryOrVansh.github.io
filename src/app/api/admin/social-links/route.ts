import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type SocialLinkInput = {
  platform?: unknown;
  label?: unknown;
  url?: unknown;
  sort_order?: unknown;
  is_active?: unknown;
};

type SocialLinkInsert = {
  platform: string;
  label: string | null;
  url: string;
  sort_order: number;
  is_active: boolean;
};

type NormalizeResult = { ok: true; value: SocialLinkInsert } | { ok: false; error: string };

function normalizeInput(body: SocialLinkInput): NormalizeResult {
  if (typeof body.platform !== "string" || !body.platform.trim()) {
    return { ok: false, error: "Platform is required." };
  }
  if (typeof body.url !== "string" || !body.url.trim()) {
    return { ok: false, error: "URL is required." };
  }

  return {
    ok: true,
    value: {
      platform: body.platform.trim().toLowerCase(),
      label: typeof body.label === "string" && body.label.trim() ? body.label.trim() : null,
      url: body.url.trim(),
      sort_order:
        typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
          ? body.sort_order
          : 0,
      is_active: typeof body.is_active === "boolean" ? body.is_active : true,
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
    .from("social_links")
    .select("*")
    .order("sort_order", { ascending: true });

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ socialLinks: data });
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as SocialLinkInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const normalized = normalizeInput(body);
  if (!normalized.ok) return jsonError(normalized.error, 400);

  const { data, error } = await getSupabaseAdmin()
    .from("social_links")
    .insert(normalized.value)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ socialLink: data }, { status: 201 });
}
