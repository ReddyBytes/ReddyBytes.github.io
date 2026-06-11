/**
 * JourneyMilestone — single card in the vertical journey timeline.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 * Alternates left/right of the central line on desktop; all-right on mobile.
 * Animation: Framer Motion fade-in-up on scroll-into-view.
 */
"use client";

import { motion } from "framer-motion";

import type { JourneyMilestone as MilestoneData } from "@/lib/content/about-schema";

interface JourneyMilestoneProps {
  milestone: MilestoneData;
  /** Even-indexed = left side on desktop, odd = right side. */
  side: "left" | "right";
  index: number;
}

export function JourneyMilestone({
  milestone,
  side,
  index,
}: JourneyMilestoneProps) {
  const isLeft = side === "left";

  return (
    <li className="relative md:grid md:grid-cols-2 md:gap-12">
      {/* Connector dot on the center line (desktop) / left line (mobile) */}
      <span
        aria-hidden
        className="absolute z-10 grid h-4 w-4 place-items-center rounded-full bg-bg-base ring-2 ring-accent-purple md:left-1/2 md:-translate-x-1/2"
        style={{
          background:
            "radial-gradient(circle, #c084fc 0%, #a855f7 60%, #7c3aed 100%)",
          boxShadow: "0 0 12px rgba(168, 85, 247, 0.5)",
          top: 24,
          left: 12,
          transform: "translateX(-50%)",
        }}
      />

      {/* Card — placed in left or right column on desktop */}
      <motion.article
        initial={{ opacity: 0, y: 24 }}
        whileInView={{ opacity: 1, y: 0 }}
        viewport={{ once: true, margin: "-100px" }}
        transition={{
          delay: 0.08 * index,
          duration: 0.55,
          ease: [0.2, 0.8, 0.2, 1] as const,
        }}
        className={`relative ml-8 rounded-lg border border-border-subtle bg-bg-elevated p-5 md:ml-0 ${
          isLeft ? "md:col-start-1 md:text-right" : "md:col-start-2"
        }`}
      >
        <p
          className="text-xs font-bold tracking-widest text-accent-cyan uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {milestone.year}
        </p>
        <h3
          className="mt-1 text-lg font-semibold text-text-primary sm:text-xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          {milestone.title}
        </h3>
        <p className="mt-2 text-sm leading-relaxed text-text-secondary sm:text-base">
          {milestone.body}
        </p>
      </motion.article>
    </li>
  );
}
