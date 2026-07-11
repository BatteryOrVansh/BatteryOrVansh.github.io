import "server-only";

// Every /admin write must be verified server-side against this list — never
// trust client-side gating alone. Keep case-insensitive since Google emails
// are not case sensitive.
const ADMIN_EMAIL_ALLOWLIST = [
  "officialvanshdixit@gmail.com",
  "tech.harshit.tiwari@gmail.com",
];

export function isAllowedAdminEmail(email: string | null | undefined): boolean {
  if (!email) return false;
  return ADMIN_EMAIL_ALLOWLIST.includes(email.toLowerCase());
}
