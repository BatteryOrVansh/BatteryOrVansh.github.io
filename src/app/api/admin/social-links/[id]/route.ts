import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type SocialLinkPatchInput = {
  platform?: unknown;
  label?: unknown;
  url?: unknown;
  sort_order?: unknown;
  is_active?: unknown;
};

type SocialLinkUpdate = {
  platform?: string;
  label?: string | null;
  url?: string;
  sort_order?: number;
  is_active?: boolean;
};

type BuildUpdateResult = { ok: true; value: SocialLinkUpdate } | { ok: false; error: string };

function buildUpdate(body: SocialLinkPatchInput): BuildUpdateResult {
  const update: SocialLinkUpdate = {};

  if (body.platform !== undefined) {
    if (typeof body.platform !== "string" || !body.platform.trim()) {
      return { ok: false, error: "Platform cannot be empty." };
    }
    update.platform = body.platform.trim().toLowerCase();
  }

  if (body.label !== undefined) {
    update.label = typeof body.label === "string" && body.label.trim() ? body.label.trim() : null;
  }

  if (body.url !== undefined) {
    if (typeof body.url !== "string" || !body.url.trim()) {
      return { ok: false, error: "URL cannot be empty." };
    }
    update.url = body.url.trim();
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

export async function PATCH(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { id } = await context.params;
  const body = (await request.json().catch(() => null)) as SocialLinkPatchInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const result = buildUpdate(body);
  if (!result.ok) return jsonError(result.error, 400);

  if (Object.keys(result.value).length === 0) {
    return jsonError("No fields to update.", 400);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("social_links")
    .update(result.value)
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ socialLink: data });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { id } = await context.params;

  const { error } = await getSupabaseAdmin().from("social_links").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ success: true });
}
