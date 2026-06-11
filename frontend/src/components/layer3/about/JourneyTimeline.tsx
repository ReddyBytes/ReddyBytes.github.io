/**
 * JourneyTimeline — vertical timeline of milestone cards.
 *
 * Per docs/design/LAYER3-ABOUT.md:
 *   - Vertical gradient line down center on desktop, down-left on mobile
 *   - Milestone cards alternate L/R on desktop; all-right on mobile
 *   - Connector dots on the line at each milestone
 *   - Stagger fade-in via Framer Motion (handled per-milestone)
 */
import { JourneyMilestone } from "@/components/layer3/about/JourneyMilestone";
import type { JourneyMilestone as MilestoneData } from "@/lib/content/about-schema";

interface JourneyTimelineProps {
  milestones: readonly MilestoneData[];
}

export function JourneyTimeline({ milestones }: JourneyTimelineProps) {
  return (
    <section
      id="journey"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-label="Engineering journey"
    >
      <header className="mb-12">
        <p
          className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // journey
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The path so far
        </h2>
      </header>

      <div className="relative">
        {/* Vertical gradient line */}
        <span
          aria-hidden
          className="absolute top-0 bottom-0 w-px md:left-1/2 md:-translate-x-1/2"
          style={{
            left: 12,
            background:
              "linear-gradient(to bottom, transparent 0%, #a855f7 8%, #22d3ee 50%, #a855f7 92%, transparent 100%)",
            boxShadow: "0 0 6px rgba(168, 85, 247, 0.4)",
          }}
        />

        <ol className="relative flex flex-col gap-12">
          {milestones.map((m, i) => (
            <JourneyMilestone
              key={`${m.year}-${m.title}`}
              milestone={m}
              side={i % 2 === 0 ? "left" : "right"}
              index={i}
            />
          ))}
        </ol>
      </div>
    </section>
  );
}
