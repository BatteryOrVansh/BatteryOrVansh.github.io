import { NextRequest, NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type ProjectPatchInput = {
  title?: unknown;
  status?: unknown;
  tech?: unknown;
  description?: unknown;
  link?: unknown;
  sort_order?: unknown;
};

type ProjectUpdate = {
  title?: string;
  status?: string | null;
  tech?: string[];
  description?: string | null;
  link?: string | null;
  sort_order?: number;
};

type BuildUpdateResult = { ok: true; value: ProjectUpdate } | { ok: false; error: string };

function buildUpdate(body: ProjectPatchInput): BuildUpdateResult {
  const update: ProjectUpdate = {};

  if (body.title !== undefined) {
    if (typeof body.title !== "string" || !body.title.trim()) {
      return { ok: false, error: "Title cannot be empty." };
    }
    update.title = body.title.trim();
  }

  if (body.status !== undefined) {
    update.status = typeof body.status === "string" && body.status.trim() ? body.status.trim() : null;
  }

  if (body.tech !== undefined) {
    update.tech = Array.isArray(body.tech)
      ? body.tech
          .filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
          .map((tag) => tag.trim())
      : [];
  }

  if (body.description !== undefined) {
    update.description =
      typeof body.description === "string" && body.description.trim()
        ? body.description.trim()
        : null;
  }

  if (body.link !== undefined) {
    update.link = typeof body.link === "string" && body.link.trim() ? body.link.trim() : null;
  }

  if (body.sort_order !== undefined) {
    update.sort_order =
      typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
        ? body.sort_order
        : 0;
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
  const body = (await request.json().catch(() => null)) as ProjectPatchInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const result = buildUpdate(body);
  if (!result.ok) return jsonError(result.error, 400);

  if (Object.keys(result.value).length === 0) {
    return jsonError("No fields to update.", 400);
  }

  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .update(result.value)
    .eq("id", id)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  revalidatePath("/projects");
  return NextResponse.json({ project: data });
}

export async function DELETE(request: NextRequest, context: { params: Promise<{ id: string }> }) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const { id } = await context.params;

  const { error } = await getSupabaseAdmin().from("projects").delete().eq("id", id);
  if (error) return jsonError(error.message, 500);

  revalidatePath("/projects");
  return NextResponse.json({ success: true });
}
