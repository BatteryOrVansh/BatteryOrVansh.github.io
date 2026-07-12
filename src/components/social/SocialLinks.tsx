import type { SocialLink } from "@/types/database";
import { SocialIcon } from "@/components/social/SocialIcon";

function labelFor(link: SocialLink): string {
  if (link.label) return link.label;
  const platform = link.platform.toLowerCase();
  return platform.charAt(0).toUpperCase() + platform.slice(1);
}

export function SocialLinks({
  links,
  className = "",
}: {
  links: SocialLink[];
  className?: string;
}) {
  if (links.length === 0) return null;

  return (
    <ul className={`flex flex-wrap items-center gap-3 ${className}`}>
      {links.map((link) => (
        <li key={link.id}>
          <a
            href={link.url}
            target={link.platform === "email" ? undefined : "_blank"}
            rel="noopener noreferrer"
            aria-label={labelFor(link)}
            title={labelFor(link)}
            className="flex h-10 w-10 items-center justify-center rounded-full border border-border text-fg-muted transition-all duration-300 ease-[var(--ease-google)] hover:-translate-y-0.5 hover:border-red hover:text-red"
          >
            <SocialIcon platform={link.platform} className="h-4 w-4" />
          </a>
        </li>
      ))}
    </ul>
  );
}
