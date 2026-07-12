"use client";

import Link from "next/link";
import { usePathname } from "next/navigation";

const NAV_ITEMS = [
  {
    href: "/",
    label: "Hero",
    icon: (
      <path d="M3.5 11.5 12 4.5l8.5 7M5.5 10v9a1 1 0 0 0 1 1h3v-6h5v6h3a1 1 0 0 0 1-1v-9" />
    ),
  },
  {
    href: "/projects",
    label: "Projects",
    icon: (
      <>
        <rect x="3.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="3.5" width="7" height="7" rx="1.5" />
        <rect x="3.5" y="13.5" width="7" height="7" rx="1.5" />
        <rect x="13.5" y="13.5" width="7" height="7" rx="1.5" />
      </>
    ),
  },
  {
    href: "/bio",
    label: "Bio",
    icon: (
      <>
        <circle cx="12" cy="8.5" r="3.5" />
        <path d="M5 20c0-4.2 3.13-6.5 7-6.5s7 2.3 7 6.5" />
      </>
    ),
  },
] as const;

export function RightNav() {
  const pathname = usePathname();

  if (pathname.startsWith("/admin")) return null;

  return (
    <nav
      aria-label="Primary"
      className="group fixed right-4 top-1/2 z-40 hidden w-14 -translate-y-1/2 flex-col gap-1 rounded-[2rem] border border-border bg-bg/85 p-2 shadow-[0_8px_30px_rgba(10,10,10,0.08)] backdrop-blur transition-[width] duration-500 ease-[var(--ease-spring)] hover:w-[168px] sm:flex md:right-8"
    >
      {NAV_ITEMS.map((item) => {
        const isActive = pathname === item.href;
        return (
          <Link
            key={item.href}
            href={item.href}
            className={`relative flex items-center gap-3 overflow-hidden rounded-full px-2.5 py-2.5 text-sm font-headline font-medium transition-colors duration-300 ${
              isActive ? "text-fg" : "text-fg-muted hover:text-fg"
            }`}
          >
            <span className="relative flex h-6 w-6 shrink-0 items-center justify-center">
              {isActive && (
                <span
                  aria-hidden
                  className="animate-blob-drift absolute -inset-2 -z-10 rounded-full bg-red-dim"
                />
              )}
              <svg
                width="20"
                height="20"
                viewBox="0 0 24 24"
                fill="none"
                stroke={isActive ? "var(--red)" : "currentColor"}
                strokeWidth="1.8"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                {item.icon}
              </svg>
            </span>
            <span className="max-w-0 overflow-hidden whitespace-nowrap opacity-0 transition-all duration-500 ease-[var(--ease-spring)] group-hover:max-w-[100px] group-hover:opacity-100">
              {item.label}
            </span>
          </Link>
        );
      })}
    </nav>
  );
}
