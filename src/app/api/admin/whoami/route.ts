import { NextRequest, NextResponse } from "next/server";
import { requireAdmin } from "@/lib/admin/verify-request";
import { adminAuthErrorResponse } from "@/lib/admin/api-helpers";

/**
 * Used by the /admin client page right after Firebase sign-in to determine
 * whether to show the dashboard or an access-denied screen. This is the
 * single source of truth for allowlist membership (requireAdmin) — the
 * client never re-implements the allowlist check itself.
 */
export async function GET(request: NextRequest) {
  try {
    const decoded = await requireAdmin(request);
    return NextResponse.json({ email: decoded.email });
  } catch (error) {
    return adminAuthErrorResponse(error);
  }
}
