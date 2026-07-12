import { supabase } from "@/lib/supabase/client";
import { BlobBackground } from "@/components/blobs/BlobBackground";
import { Container } from "@/components/ui/Container";
import type { Project } from "@/types/database";

export const revalidate = 0;

async function getProjects(): Promise<Project[]> {
  const { data } = await supabase
    .from("projects")
    .select("*")
    .order("sort_order", { ascending: true });

  return data ?? [];
}

export default async function ProjectsPage() {
  const projects = await getProjects();

  return (
    <main className="relative min-h-screen overflow-hidden py-32">
      <BlobBackground />
      <Container>
        <p className="font-headline text-sm font-medium uppercase tracking-[0.3em] text-red">
          Projects
        </p>
        <h1 className="font-headline mt-4 max-w-2xl text-4xl font-extrabold tracking-tight sm:text-5xl">
          Things I&apos;ve built.
        </h1>

        <div className="mt-16 grid grid-cols-1 gap-8 md:grid-cols-2">
          {projects.map((project, index) => (
            <article
              key={project.id}
              className="animate-reveal-up group relative overflow-hidden rounded-[2rem] border border-border bg-bg-elevated p-8 shadow-[0_1px_2px_rgba(10,10,10,0.04),0_24px_48px_-28px_rgba(10,10,10,0.18)] transition-[transform,box-shadow,border-color] duration-300 ease-[var(--ease-google)] hover:-translate-y-1 hover:border-red-dim hover:shadow-[0_1px_2px_rgba(10,10,10,0.05),0_32px_56px_-24px_rgba(10,10,10,0.22)] sm:p-10"
              style={{ animationDelay: `${index * 90}ms` }}
            >
              {project.status && (
                <p className="font-headline text-xs font-semibold uppercase tracking-wide text-red">
                  {project.status}
                </p>
              )}
              <h2 className="font-headline mt-3 text-2xl font-bold">{project.title}</h2>
              {project.description && (
                <p className="mt-4 text-sm leading-relaxed text-fg-muted">
                  {project.description}
                </p>
              )}
              {project.tech?.length > 0 && (
                <ul className="mt-6 flex flex-wrap gap-2">
                  {project.tech.map((tag) => (
                    <li
                      key={tag}
                      className="rounded-full border border-border px-3 py-1 text-xs text-fg-muted"
                    >
                      {tag}
                    </li>
                  ))}
                </ul>
              )}
              {project.link && (
                <a
                  href={project.link}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="mt-6 inline-flex items-center gap-1 text-sm font-medium text-red"
                >
                  View project
                  <span className="transition-transform duration-300 ease-[var(--ease-google)] group-hover:translate-x-1">
                    →
                  </span>
                </a>
              )}
            </article>
          ))}
        </div>
      </Container>
    </main>
  );
}
