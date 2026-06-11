/**
 * TechStackPills — pill row of all techs used by a project.
 *
 * Primary techs get a brighter accent.
 */
import type { ProjectTech } from "@/lib/content/project-schema";

interface TechStackPillsProps {
  techStack: readonly ProjectTech[];
}

export function TechStackPills({ techStack }: TechStackPillsProps) {
  return (
    <ul className="flex flex-wrap gap-2">
      {techStack.map((t) => (
        <li
          key={t.name}
          className={`rounded-full border px-3 py-1.5 text-xs font-medium tracking-wider uppercase ${
            t.primary
              ? "border-accent-pink-bright/60 bg-accent-pink/10 text-accent-pink-bright"
              : "border-border-subtle bg-bg-elevated text-text-secondary"
          }`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {t.name}
        </li>
      ))}
    </ul>
  );
}
