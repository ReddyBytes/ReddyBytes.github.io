/**
 * SecondaryProjectCard — smaller magazine card.
 *
 * Per LAYER3-PROJECTS.md:
 *   - 2-col: 30% image / 70% content (desktop)
 *   - Stacked single column on mobile
 *   - Same gradient border + hover behavior as featured
 */
import { ArrowRight } from "lucide-react";
import Image from "next/image";
import Link from "next/link";

import type { ProjectFrontmatter } from "@/lib/content/project-schema";

interface SecondaryProjectCardProps {
  project: ProjectFrontmatter;
}

const FALLBACK_GRADIENT =
  "linear-gradient(135deg, #7c3aed 0%, #a855f7 50%, #22d3ee 100%)";

export function SecondaryProjectCard({ project }: SecondaryProjectCardProps) {
  const tagsToShow = project.techStack
    .filter((t) => t.primary)
    .slice(0, 3)
    .map((t) => t.name);
  const finalTags =
    tagsToShow.length > 0
      ? tagsToShow
      : project.techStack.slice(0, 3).map((t) => t.name);

  return (
    <Link
      href={`/projects/${project.slug}/`}
      className="group relative block overflow-hidden rounded-xl border border-border-subtle bg-bg-elevated transition-all duration-300 hover:-translate-y-1 hover:border-transparent"
      aria-label={`Read case study: ${project.title}`}
    >
      <span
        aria-hidden
        className="pointer-events-none absolute inset-0 rounded-xl opacity-0 transition-opacity duration-300 group-hover:opacity-100"
        style={{
          background:
            "linear-gradient(135deg, rgba(124,58,237,0.22) 0%, rgba(168,85,247,0.22) 50%, rgba(34,211,238,0.22) 100%)",
          mixBlendMode: "screen",
        }}
      />

      <div className="relative grid grid-cols-1 md:grid-cols-10">
        <div
          className="relative aspect-[16/10] md:col-span-3 md:aspect-auto md:min-h-[220px]"
          style={{ background: FALLBACK_GRADIENT }}
        >
          <Image
            src={project.heroImage}
            alt={`${project.title} preview`}
            fill
            sizes="(max-width: 768px) 100vw, 30vw"
            className="object-cover transition-transform duration-500 group-hover:scale-[1.02]"
            unoptimized
            onError={(e) => {
              (e.currentTarget as HTMLImageElement).style.opacity = "0";
            }}
          />
        </div>

        <div className="flex flex-col justify-between p-5 md:col-span-7 md:p-6">
          <div>
            <h2
              className="text-xl font-bold tracking-tight text-text-primary sm:text-2xl"
              style={{ fontFamily: "var(--font-display)" }}
            >
              {project.title}
            </h2>
            <p className="mt-2 text-sm leading-relaxed text-text-secondary">
              {project.tagline}
            </p>
            <ul className="mt-3 flex flex-wrap gap-2">
              {finalTags.map((name) => (
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

          <div className="mt-4 inline-flex items-center gap-2 text-xs font-semibold tracking-widest text-accent-cyan uppercase">
            Read case study
            <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-1" />
          </div>
        </div>
      </div>
    </Link>
  );
}
