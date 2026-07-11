import "server-only";
import { NextRequest } from "next/server";
import { verifyFirebaseIdToken } from "@/lib/firebase/admin";
import { isAllowedAdminEmail } from "@/lib/admin/allowlist";

export class AdminAuthError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

/**
 * Verifies the Firebase ID token on an admin API request and checks it
 * against the allowlist. Throws AdminAuthError on any failure — callers
 * should catch it and return a generic access-denied response so we never
 * leak whether a given email exists in the allowlist.
 */
export async function requireAdmin(request: NextRequest) {
  const authHeader = request.headers.get("authorization") ?? "";
  const idToken = authHeader.startsWith("Bearer ") ? authHeader.slice(7) : null;

  if (!idToken) {
    throw new AdminAuthError(401, "Access denied.");
  }

  let decoded;
  try {
    decoded = await verifyFirebaseIdToken(idToken);
  } catch {
    throw new AdminAuthError(401, "Access denied.");
  }

  if (!isAllowedAdminEmail(decoded.email)) {
    throw new AdminAuthError(403, "Access denied.");
  }

  return decoded;
}
