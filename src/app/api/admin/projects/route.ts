import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse, jsonError } from "@/lib/admin/api-helpers";
import { getSupabaseAdmin } from "@/lib/supabase/server";

type ProjectInput = {
  title?: unknown;
  status?: unknown;
  tech?: unknown;
  description?: unknown;
  link?: unknown;
  sort_order?: unknown;
};

type ProjectInsert = {
  title: string;
  status: string | null;
  tech: string[];
  description: string | null;
  link: string | null;
  sort_order: number;
};

type NormalizeResult = { ok: true; value: ProjectInsert } | { ok: false; error: string };

function normalizeProjectInput(body: ProjectInput): NormalizeResult {
  if (typeof body.title !== "string" || !body.title.trim()) {
    return { ok: false, error: "Title is required." };
  }

  const tech = Array.isArray(body.tech)
    ? body.tech.filter((tag): tag is string => typeof tag === "string" && tag.trim().length > 0)
        .map((tag) => tag.trim())
    : [];

  const sortOrder =
    typeof body.sort_order === "number" && Number.isFinite(body.sort_order)
      ? body.sort_order
      : 0;

  return {
    ok: true,
    value: {
      title: body.title.trim(),
      status: typeof body.status === "string" && body.status.trim() ? body.status.trim() : null,
      tech,
      description:
        typeof body.description === "string" && body.description.trim()
          ? body.description.trim()
          : null,
      link: typeof body.link === "string" && body.link.trim() ? body.link.trim() : null,
      sort_order: sortOrder,
    },
  };
}

export async function POST(request: NextRequest) {
  try {
    await requireAdmin(request);
  } catch (error) {
    return adminAuthErrorResponse(error);
  }

  const body = (await request.json().catch(() => null)) as ProjectInput | null;
  if (!body) return jsonError("Invalid request body.", 400);

  const normalized = normalizeProjectInput(body);
  if (!normalized.ok) return jsonError(normalized.error, 400);

  const { data, error } = await getSupabaseAdmin()
    .from("projects")
    .insert(normalized.value)
    .select()
    .single();

  if (error) return jsonError(error.message, 500);

  return NextResponse.json({ project: data }, { status: 201 });
}
