import { supabase } from "@/lib/supabase/client";
import { getSocialLinks } from "@/lib/supabase/queries";
import { BlobBackground } from "@/components/blobs/BlobBackground";
import { BackgroundShapes } from "@/components/ui/background-shapes";
import { TechStackBuilder } from "@/components/ui/interactive-tech-stack-builder";
import { StreakCards } from "@/components/skills/StreakCards";
import { MouseTrail } from "@/components/effects/MouseTrail";
import { Reveal } from "@/components/motion/Reveal";
import { ScrollCue } from "@/components/hero/ScrollCue";
import { AnimatedGradientBackground } from "@/components/hero/AnimatedGradientBackground";
import { SocialLinks } from "@/components/social/SocialLinks";
import { Container } from "@/components/ui/Container";
import type { BioContent } from "@/types/database";

export const revalidate = 0;

const FALLBACK_INTERESTS = "Software development and generative AI.";
const CONTACT_EMAIL = "officialvanshdixit@gmail.com";

const EYEBROW_CLASS = "font-headline text-sm font-medium uppercase tracking-[0.3em] text-red";
const SECTION_HEADING_CLASS =
  "font-headline mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl";

async function getHeroInterests(): Promise<string> {
  const { data } = await supabase
    .from("site_settings")
    .select("value")
    .eq("key", "hero_interests")
    .maybeSingle();

  return data?.value ?? FALLBACK_INTERESTS;
}

async function getBioMap(): Promise<Record<string, string>> {
  const { data } = await supabase.from("bio_content").select("key, value");

  const map: Record<string, string> = {};
  (data as BioContent[] | null)?.forEach((row) => {
    if (row.value) map[row.key] = row.value;
  });
  return map;
}

async function getAchievements(): Promise<{ title: string; status: string }[]> {
  const { data } = await supabase
    .from("projects")
    .select("title, status")
    .order("sort_order", { ascending: true });

  return (data ?? []).filter(
    (project): project is { title: string; status: string } => Boolean(project.status),
  );
}

function parseSkills(raw: string | undefined): string[] {
  if (!raw) return [];
  return raw
    .split("\n")
    .flatMap((line) => line.split(","))
    .map((skill) => skill.trim())
    .filter(Boolean);
}

export default async function HeroPage() {
  const [interests, socialLinks, bio, achievements] = await Promise.all([
    getHeroInterests(),
    getSocialLinks(),
    getBioMap(),
    getAchievements(),
  ]);

  const skills = parseSkills(bio.technical_skills);
  const certifications = (bio.certifications ?? "").split("\n").filter(Boolean);

  return (
    <>
      <MouseTrail />
      <AnimatedGradientBackground />
      <main className="relative overflow-hidden">
        {/* Hero */}
        <section className="relative flex min-h-screen flex-col overflow-hidden">
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
          <ScrollCue />
        </section>

        {/* Technical skills */}
        <section className="relative overflow-hidden border-t border-border py-28">
          <div className="pointer-events-none absolute inset-0 -z-10 text-red opacity-[0.05]">
            <BackgroundShapes width={1000} height={600} colors={["currentColor"]} className="h-full w-full" />
          </div>
          <Container>
            <Reveal>
              <p className={EYEBROW_CLASS}>Skills</p>
              <h2 className={SECTION_HEADING_CLASS}>What I work with.</h2>
              {skills.length > 0 && (
                <ul className="mt-10 flex flex-wrap gap-3">
                  {skills.map((skill) => (
                    <li
                      key={skill}
                      className="rounded-full border border-border bg-bg-elevated px-4 py-2 text-sm font-medium text-fg"
                    >
                      {skill}
                    </li>
                  ))}
                </ul>
              )}
            </Reveal>
          </Container>
        </section>

        {/* Interactive tech stack */}
        <section className="border-t border-border py-28">
          <Container>
            <Reveal>
              <p className={EYEBROW_CLASS}>Stack</p>
              <h2 className={SECTION_HEADING_CLASS}>Build my stack.</h2>
            </Reveal>
          </Container>
          <Reveal delay={0.1}>
            <TechStackBuilder className="mt-6" />
          </Reveal>
        </section>

        {/* GitHub / LeetCode streaks */}
        <section className="border-t border-border py-28">
          <Container>
            <Reveal>
              <p className={EYEBROW_CLASS}>Consistency</p>
              <h2 className={SECTION_HEADING_CLASS}>GitHub &amp; LeetCode streaks.</h2>
              <div className="mt-10">
                <StreakCards />
              </div>
            </Reveal>
          </Container>
        </section>

        {/* Certifications */}
        {certifications.length > 0 && (
          <section className="border-t border-border py-28">
            <Container>
              <Reveal>
                <p className={EYEBROW_CLASS}>Certifications</p>
                <h2 className={SECTION_HEADING_CLASS}>Credentials.</h2>
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-2">
                  {certifications.map((cert) => (
                    <div
                      key={cert}
                      className="rounded-2xl border border-border bg-bg-elevated p-6 text-sm font-medium leading-relaxed text-fg shadow-[0_1px_2px_rgba(10,10,10,0.04),0_24px_48px_-28px_rgba(10,10,10,0.18)]"
                    >
                      {cert}
                    </div>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Hackathons & achievements */}
        {achievements.length > 0 && (
          <section className="border-t border-border py-28">
            <Container>
              <Reveal>
                <p className={EYEBROW_CLASS}>Hackathons &amp; achievements</p>
                <h2 className={SECTION_HEADING_CLASS}>Where it&apos;s been tested.</h2>
                <div className="mt-10 grid grid-cols-1 gap-4 sm:grid-cols-3">
                  {achievements.map((project) => (
                    <div
                      key={project.title}
                      className="rounded-2xl border border-border bg-bg-elevated p-6 shadow-[0_1px_2px_rgba(10,10,10,0.04),0_24px_48px_-28px_rgba(10,10,10,0.18)]"
                    >
                      <p className="text-xs font-semibold uppercase tracking-wide text-red">
                        {project.status}
                      </p>
                      <p className="mt-2 text-sm font-medium text-fg">{project.title}</p>
                    </div>
                  ))}
                </div>
              </Reveal>
            </Container>
          </section>
        )}

        {/* Get in touch */}
        <section className="border-t border-border py-28">
          <Container className="flex flex-col items-center text-center">
            <Reveal className="flex flex-col items-center">
              <p className={EYEBROW_CLASS}>Get in touch</p>
              <h2 className="font-headline mt-4 text-4xl font-extrabold tracking-tight sm:text-5xl">
                Let&apos;s build something.
              </h2>
              <a
                href={`mailto:${CONTACT_EMAIL}`}
                className="font-headline mt-8 inline-flex items-center gap-3 rounded-full bg-red px-7 py-3.5 text-base font-semibold text-bg transition-transform duration-300 ease-[var(--ease-google)] hover:scale-[1.03]"
              >
                {CONTACT_EMAIL}
              </a>
              <SocialLinks links={socialLinks} className="mt-8 justify-center" />
            </Reveal>
          </Container>
        </section>
      </main>
    </>
  );
}
