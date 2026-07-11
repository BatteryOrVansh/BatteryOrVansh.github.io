import { supabase } from "@/lib/supabase/client";
import { BlobBackground } from "@/components/blobs/BlobBackground";
import { Container } from "@/components/ui/Container";

const FALLBACK_INTERESTS =
  "Building AI-driven products that sit at the intersection of generative AI and full-stack engineering — adaptive learning systems, GenAI-powered analysis tools, and applications where LLMs do real work.";

async function getHeroInterests(): Promise<string> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_interests")
    .maybeSingle();

  return data?.value ?? FALLBACK_INTERESTS;
}

export default async function HeroPage() {
  const interests = await getHeroInterests();

  return (
    <main className="relative flex min-h-screen items-center overflow-hidden">
      <BlobBackground variant="hero" />
      <Container className="animate-reveal-up py-32">
        <p className="font-headline text-sm font-medium uppercase tracking-[0.3em] text-red">
          Vansh Dixit
        </p>
        <h1 className="font-headline mt-6 max-w-3xl text-5xl font-extrabold leading-[1.05] tracking-tight sm:text-6xl md:text-7xl">
          Co-Founder &amp; Tech Lead,{" "}
          <span className="text-red">building with AI.</span>
        </h1>

        <section className="mt-14 max-w-xl">
          <h2 className="font-headline text-lg font-semibold text-fg">
            What I&apos;m interested in
          </h2>
          <p className="mt-3 text-base leading-relaxed text-fg-muted sm:text-lg">
            {interests}
          </p>
        </section>

        <div className="mt-14">
          <a
            href="mailto:officialvanshdixit@gmail.com"
            className="font-headline inline-flex items-center gap-3 rounded-full bg-red px-7 py-3.5 text-base font-semibold text-bg transition-transform duration-300 ease-[var(--ease-google)] hover:scale-[1.03]"
          >
            officialvanshdixit@gmail.com
          </a>
        </div>
      </Container>
    </main>
  );
}
