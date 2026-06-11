/**
 * FeaturedProjectCard — large hero card for the magazine layout.
 *
 * Per LAYER3-PROJECTS.md spec:
 *   - 2-col: 60% image / 40% content (desktop)
 *   - Stacked single column on mobile (image top)
 *   - Gradient border (vivid palette), hover lift + glow
 *   - Image fallback gradient if file missing
 */
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProjectFrontmatter } from "@/lib/content/project-schema";

interface FeaturedProjectCardProps {
  project: ProjectFrontmatter;
}

const FALLBACK_GRADIENT =
  "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%)";

export function FeaturedProjectCard({ project }: FeaturedProjectCardProps) {
  const primaryTechs = project.techStack
    .filter((t) => t.primary)
    .slice(0, 3)
    .map((t) => t.name);
  const tagsToShow =
    primaryTechs.length > 0
      ? primaryTechs
      : project.techStack.slice(0, 3).map((t) => t.name);

  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group relative block overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated transition-all duration-300 hover:-translate-y-1 hover:border-transparent"
      aria-label={`Read case study: ${project.title}`}
    >
      {/* Gradient glow border on hover */}
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.25) 0%, rgba(236,72,153,0.25) 50%, rgba(34,211,238,0.25) 100%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-5">
        {/* Image — 3/5 desktop, full mobile */}
        <div
          className="relative aspect-[16/10] md:col-span-3 md:aspect-auto md:min-h-[360px]"
          style={{ background: FALLBACK_GRADIENT }}
        >
          <Image
            src={project.heroImage}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 60vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            unoptimized
            // Fallback handled by background gradient if Image fails to load
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>

        {/* Content — 2/5 desktop */}
        <div className="flex flex-col justify-between p-6 md:col-span-2 md:p-8">
          <div>
            <p
              className="mb-3 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              // featured
            </p>
            <h2
              className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h2>
            <p className="mt-3 text-sm leading-relaxed text-text-secondary sm:text-base">
              {project.tagline}
            </p>
            <ul className="mt-4 flex flex-wrap gap-2">
              {tagsToShow.map((name) => (
                <li
                  key={name}
                  className="rounded-full border border-border-subtle bg-bg-base/40 px-2.5 py-1 text-[10px] font-medium tracking-wider text-text-secondary uppercase"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  {name}
                </li>
              ))}
            </ul>
          </div>

          <div className="mt-6 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-accent-cyan uppercase">
            Read case study
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
