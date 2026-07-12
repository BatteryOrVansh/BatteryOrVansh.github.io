import { getSocialLinks } from "@/lib/supabase/queries";
import { SocialLinks } from "@/components/social/SocialLinks";
import { Container } from "@/components/ui/Container";

const CONTACT_EMAIL = "officialvanshdixit@gmail.com";

export async function Footer() {
  const links = await getSocialLinks();

  return (
    <footer className="relative z-10 border-t border-border py-10">
      <Container className="flex flex-col items-center gap-5 sm:flex-row sm:justify-between">
        <a
          href={`mailto:${CONTACT_EMAIL}`}
          className="font-headline text-sm font-medium text-fg-muted transition-colors duration-300 hover:text-red"
        >
          {CONTACT_EMAIL}
        </a>
        <SocialLinks links={links} />
      </Container>
    </footer>
  );
}
