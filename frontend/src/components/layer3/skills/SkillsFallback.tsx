/**
 * SkillsFallback — category-grouped list rendered when React Flow is unavailable
 * (e.g., reduced-motion preference, JS disabled, or React Flow fails to load).
 *
 * SSR-friendly: pure server component. The page renders this immediately so
 * recruiters get usable content even before React Flow hydrates.
 *
 * Per docs/design/LAYER3-SKILLS.md.
 */
import Link from "next/link";

import type { SkillEnriched } from "@/lib/content/skills-schema";

const CATEGORY_LABEL: Record<SkillEnriched["category"], string> = {
  language: "Languages",
  systems: "Systems",
  ai: "AI / ML",
};

const CATEGORY_COLOR: Record<SkillEnriched["category"], string> = {
  language: "text-accent-cyan border-accent-cyan/40",
  systems: "text-accent-purple-bright border-accent-purple/40",
  ai: "text-accent-pink-bright border-accent-pink/40",
};

interface SkillsFallbackProps {
  techs: SkillEnriched[];
}

export function SkillsFallback({ techs }: SkillsFallbackProps) {
  const byCategory: Record<SkillEnriched["category"], SkillEnriched[]> = {
    language: [],
    systems: [],
    ai: [],
  };
  techs.forEach((t) => byCategory[t.category].push(t));

  return (
    <div className="mx-auto grid max-w-5xl grid-cols-1 gap-6 px-4 py-8 sm:px-6 md:grid-cols-3 lg:px-8">
      {(Object.keys(byCategory) as SkillEnriched["category"][]).map((cat) => (
        <section key={cat}>
          <h3
            className={`mb-3 border-b pb-2 text-xs font-bold tracking-widest uppercase ${CATEGORY_COLOR[cat]}`}
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {CATEGORY_LABEL[cat]}
          </h3>
          <ul className="flex flex-col gap-3">
            {byCategory[cat].map((tech) => (
              <li
                key={tech.slug}
                className="rounded-md border border-border-subtle bg-bg-elevated p-3"
              >
                <div className="flex items-baseline justify-between gap-2">
                  <h4
                    className="text-sm font-semibold text-text-primary"
                    style={{ fontFamily: "var(--font-display)" }}
                  >
                    {tech.name}
                  </h4>
                  <span
                    className="text-[10px] tracking-widest text-accent-cyan"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {tech.years} {tech.years.match(/\d/) ? "yr" : ""}
                  </span>
                </div>
                <p className="mt-1 text-xs leading-relaxed text-text-secondary">
                  {tech.confidence}
                </p>
                {tech.resolvedProjects.length > 0 && (
                  <ul className="mt-2 flex flex-wrap gap-1.5">
                    {tech.resolvedProjects.map((p) => (
                      <li key={p.slug}>
                        <Link
                          href={`/projects/${p.slug}/`}
                          className="rounded-full border border-border-subtle px-2 py-0.5 text-[10px] text-accent-purple-bright transition-colors hover:border-accent-purple-bright/60"
                          style={{ fontFamily: "var(--font-mono)" }}
                        >
                          {p.title.length > 18
                            ? `${p.title.slice(0, 18)}…`
                            : p.title}
                        </Link>
                      </li>
                    ))}
                  </ul>
                )}
              </li>
            ))}
          </ul>
        </section>
      ))}
    </div>
  );
}
