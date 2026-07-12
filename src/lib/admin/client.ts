import { getFirebaseAuth } from "@/lib/firebase/client";

/**
 * Browser-side fetch helper for admin API routes. Attaches the current
 * Firebase user's ID token as a Bearer token — the server independently
 * re-verifies this on every request via requireAdmin, so this file carries
 * no authorization logic of its own, only plumbing.
 */
export async function adminFetch(path: string, init: RequestInit = {}): Promise<Response> {
  const user = getFirebaseAuth().currentUser;
  if (!user) {
    throw new Error("Not signed in.");
  }

  const idToken = await user.getIdToken();
  const isFormData = init.body instanceof FormData;

  const headers = new Headers(init.headers);
  headers.set("Authorization", `Bearer ${idToken}`);
  if (!isFormData && init.body && !headers.has("Content-Type")) {
    headers.set("Content-Type", "application/json");
  }

  return fetch(path, { ...init, headers });
}

/** Convenience wrapper that JSON-encodes a body and parses a JSON response. */
export async function adminFetchJson<T>(path: string, init: RequestInit = {}): Promise<T> {
  const res = await adminFetch(path, init);
  const body = await res.json().catch(() => null);
  if (!res.ok) {
    const message = (body && typeof body.error === "string" ? body.error : null) ?? "Request failed.";
    throw new Error(message);
  }
  return body as T;
}
