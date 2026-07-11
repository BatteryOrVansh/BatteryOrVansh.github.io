"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  { href: "/", label: "Hero" },
  { href: "/projects", label: "Projects" },
  { href: "/bio", label: "Bio" },
] as const;

export function RightNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Primary"
      className="fixed right-4 top-1/2 z-40 hidden -translate-y-1/2 flex-col items-end gap-3 sm:flex md:right-8"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`group relative flex items-center overflow-hidden rounded-full border px-4 py-2 text-sm font-headline font-medium transition-all duration-300 ease-[var(--ease-google)] ${
              isActive
                ? "border-transparent text-bg"
                : "border-border text-fg-muted hover:text-fg"
            }`}
          >
            {isActive && (
              <span
                aria-hidden
                className="absolute inset-0 -z-10 animate-blob-drift rounded-full bg-red"
              />
            )}
            {item.label}
          </Link>
        );
      })}
    </nav>
  );
}
