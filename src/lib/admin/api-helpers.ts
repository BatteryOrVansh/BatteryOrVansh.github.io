import "server-only";
import { NextResponse } from "next/server";
import { AdminAuthError } from "@/lib/admin/verify-request";

/**
 * Uniform handler for anything thrown while authenticating/authorizing an
 * admin API request. Always returns the same generic message/shape so we
 * never leak whether a token was merely invalid vs. the email was simply
 * not on the allowlist.
 */
export function adminAuthErrorResponse(error: unknown) {
  const status = error instanceof AdminAuthError ? error.status : 401;
  return NextResponse.json({ error: "Access denied." }, { status });
}

export function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status });
}
