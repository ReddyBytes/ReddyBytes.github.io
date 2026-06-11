/**
 * TechChips — horizontal auto-scrolling marquee of 12 tech chips.
 *
 * Per LAYER2.md spec:
 *   - 12 techs ordered by AI engineer relevance (tokens.ts)
 *   - Duplicated row scrolling left at constant 60s loop
 *   - Pause on hover (any chip)
 *   - Reduced motion: static, scrollable manually
 *
 * Uses CSS animation (marquee-x in globals.css) not Framer Motion —
 * cheaper for an infinite loop. Touch swipe overrides via overflow-x-auto.
 */
"use client";

import { useReducedMotion } from "@/lib/motion/reducedMotion";
import { LAYER2_TECH_CHIPS } from "@/lib/theme/tokens";

export function TechChips() {
  const reducedMotion = useReducedMotion();

  // Duplicate the chips so the marquee can loop seamlessly
  const doubled = [...LAYER2_TECH_CHIPS, ...LAYER2_TECH_CHIPS];

  return (
    <section
      aria-label="Tech stack"
      className="group relative w-full overflow-x-hidden border-y border-border-subtle py-6"
      style={{
        background:
          "linear-gradient(90deg, transparent 0%, rgba(168,85,247,0.04) 50%, transparent 100%)",
      }}
    >
      {/* Edge fade — soft mask so chips dissolve at the viewport edges */}
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 left-0 z-10 w-16 bg-gradient-to-r from-bg-base to-transparent sm:w-24"
      />
      <div
        aria-hidden
        className="pointer-events-none absolute inset-y-0 right-0 z-10 w-16 bg-gradient-to-l from-bg-base to-transparent sm:w-24"
      />

      <ul
        className={`flex w-max gap-3 sm:gap-4 ${reducedMotion ? "" : "animate-marquee-x group-hover:[animation-play-state:paused]"}`}
        style={{ willChange: reducedMotion ? undefined : "transform" }}
      >
        {doubled.map((tech, i) => (
          <li
            key={`${tech}-${i}`}
            className="inline-flex shrink-0 items-center gap-2 rounded-full border border-border-subtle px-4 py-2 text-xs font-medium tracking-wider text-text-secondary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-pink-bright/60 hover:text-accent-pink-bright sm:text-sm"
            style={{
              fontFamily: "var(--font-mono)",
              background:
                "linear-gradient(135deg, rgba(236,72,153,0.06) 0%, rgba(168,85,247,0.06) 100%)",
            }}
          >
            <span
              aria-hidden
              className="h-1.5 w-1.5 rounded-full bg-accent-cyan"
            />
            {tech}
          </li>
        ))}
      </ul>
    </section>
  );
}
