import "server-only";
import { cert, getApps, initializeApp, type App } from "firebase-admin/app";
import { getAuth } from "firebase-admin/auth";

function getFirebaseAdminApp(): App {
  if (getApps().length) return getApps()[0];

  return initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      // Escaped newlines are required when the key is stored as a single-line env var.
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, "\n"),
    }),
  });
}

/**
 * Verifies a Firebase ID token sent from the client. Throws if the token is
 * invalid/expired. Callers must separately check the returned email against
 * the admin allowlist before permitting any write.
 */
export async function verifyFirebaseIdToken(idToken: string) {
  const app = getFirebaseAdminApp();
  return getAuth(app).verifyIdToken(idToken);
}
