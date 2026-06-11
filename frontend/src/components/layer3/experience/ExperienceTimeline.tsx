/**
 * ExperienceTimeline — vertical stack of role cards (current → prior).
 *
 * Per docs/design/LAYER3-EXPERIENCE.md.
 * Server component: maps roles array → RoleCard (client) with stagger index.
 */
import { RoleCard } from "@/components/layer3/experience/RoleCard";
import type { RoleEntry } from "@/lib/content/experience-schema";

interface ExperienceTimelineProps {
  roles: readonly RoleEntry[];
}

export function ExperienceTimeline({ roles }: ExperienceTimelineProps) {
  return (
    <section
      id="experience-timeline"
      className="mx-auto max-w-3xl px-4 pb-16 sm:px-6 sm:pb-24 lg:px-8"
      aria-label="Work history"
    >
      <div className="flex flex-col gap-6">
        {roles.map((role, i) => (
          <RoleCard
            key={`${role.company}-${role.start}-${role.title}`}
            role={role}
            index={i}
          />
        ))}
      </div>
    </section>
  );
}
