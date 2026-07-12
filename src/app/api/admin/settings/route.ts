import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

const ALLOWED_SETTING_KEYS = ["hero_interests"] as const;

async function upsertSetting(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as { key?: unknown; value?: unknown } | null;
  if (!body || typeof body.key !== "string") {
    return jsonError("A setting key is required.", 400);
  }

  if (!ALLOWED_SETTING_KEYS.includes(body.key as (typeof ALLOWED_SETTING_KEYS)[number])) {
    return jsonError("Unknown setting key.", 400);
  }

  if (body.value !== null && typeof body.value !== "string") {
    return jsonError("Value must be a string or null.", 400);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("site_settings")
    .upsert({ key: body.key, value: body.value }, { onConflict: "key" })
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/");
  return NextResponse.json({ setting: data });
}

export async function PUT(request: NextRequest) {
  return upsertSetting(request);
}

export async function POST(request: NextRequest) {
  return upsertSetting(request);
}
