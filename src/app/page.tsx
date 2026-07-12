import { supabase } from "@/lib/supabase/client";
import { getSocialLinks } from "@/lib/supabase/queries";
import { BlobBackground } from "@/components/blobs/BlobBackground";
import { SocialLinks } from "@/components/social/SocialLinks";
import { Container } from "@/components/ui/Container";

export const revalidate = 0;

const FALLBACK_INTERESTS = "Software development and generative AI.";

async function getHeroInterests(): Promise<string> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_interests")
    .maybeSingle();

  return data?.value ?? FALLBACK_INTERESTS;
}

export default async function HeroPage() {
  const [interests, socialLinks] = await Promise.all([getHeroInterests(), getSocialLinks()]);

  return (
    <main className="relative flex min-h-screen flex-col overflow-hidden">
      <BlobBackground variant="hero" />
      <div className="flex flex-1 items-center">
        <Container className="animate-reveal-up py-32">
          <h1 className="font-headline max-w-3xl text-6xl font-extrabold leading-[1.02] tracking-tight sm:text-7xl md:text-8xl">
            Vansh <span className="text-red">Dixit</span>
          </h1>

          <p className="mt-8 max-w-md text-lg leading-relaxed text-fg-muted">{interests}</p>
        </Container>
      </div>

      <div className="animate-reveal-up pb-16" style={{ animationDelay: "150ms" }}>
        <Container>
          <SocialLinks links={socialLinks} />
        </Container>
      </div>
    </main>
  );
}
