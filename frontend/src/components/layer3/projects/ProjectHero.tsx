/**
 * ProjectHero — title + tagline + hero image + metadata pills + CTAs.
 *
 * Used at the top of every /projects/[slug] case study page.
 * Pure server component.
 */
import { Github, Globe } from "lucide-react";
import Image from "next/image";

import type { ProjectFrontmatter } from "@/lib/content/project-schema";

interface ProjectHeroProps {
  project: ProjectFrontmatter;
}

const STATUS_COLOR: Record<ProjectFrontmatter["status"], string> = {
  production: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  beta: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  wip: "text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10",
  retired: "text-text-tertiary border-border-subtle bg-bg-elevated",
};

export function ProjectHero({ project }: ProjectHeroProps) {
  return (
    <header className="mx-auto max-w-5xl px-4 pt-24 sm:px-6 sm:pt-32 lg:px-8">
      {/* Hero image */}
      <div
        className="relative mb-8 aspect-[16/9] overflow-hidden rounded-xl border border-border-subtle"
        style={{
          background:
            "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%)",
        }}
      >
        <Image
          src={project.heroImage}
          alt={`${project.title} hero`}
          fill
          sizes="(max-width: 1024px) 100vw, 1024px"
          className="object-cover"
          unoptimized
          priority
          onError={(e) => {
            (e.currentTarget as HTMLImageElement).style.opacity = "0";
          }}
        />
      </div>

      <h1
        className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {project.title}
      </h1>
      <p className="mt-4 max-w-2xl text-base leading-relaxed text-text-secondary sm:text-lg">
        {project.tagline}
      </p>

      {/* Metadata pills */}
      <ul className="mt-6 flex flex-wrap items-center gap-2">
        <li
          className={`rounded-full border px-3 py-1 text-[10px] font-semibold tracking-widest uppercase ${STATUS_COLOR[project.status]}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ● {project.status}
        </li>
        <li
          className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-[10px] font-medium tracking-widest text-text-secondary uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {project.role}
        </li>
        <li
          className="rounded-full border border-border-subtle bg-bg-elevated px-3 py-1 text-[10px] font-medium tracking-widest text-text-secondary uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {project.period}
        </li>
      </ul>

      {/* CTAs */}
      {(project.links.live || project.links.github) && (
        <div className="mt-6 flex flex-wrap gap-3">
          {project.links.live && (
            <a
              href={project.links.live}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-accent-cyan/60 bg-accent-cyan/10 px-4 py-2 text-xs font-semibold tracking-widest text-accent-cyan uppercase transition-all hover:-translate-y-px hover:bg-accent-cyan/20"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Globe className="h-3.5 w-3.5" />
              Live demo →
            </a>
          )}
          {project.links.github && (
            <a
              href={project.links.github}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-elevated px-4 py-2 text-xs font-semibold tracking-widest text-text-primary uppercase transition-all hover:-translate-y-px hover:border-accent-purple/60"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <Github className="h-3.5 w-3.5" />
              View on GitHub →
            </a>
          )}
        </div>
      )}
    </header>
  );
}
