/**
 * StatsBar — 4 big numbers in a horizontal strip, intro to Layer 2.
 *
 * Per LAYER2.md spec:
 *   - 4 stats: YEARS / PROJECTS / COMMITS / TECHNOLOGIES (values in tokens.ts)
 *   - Big number: vivid gradient (pink → cyan)
 *   - Small label: mono, tracking-widest, tertiary text
 *   - Mobile: 2x2 grid
 *   - Stagger entry: 60ms between stats
 *
 * Pure client component (uses Framer Motion stagger). Lazy-load happens
 * at the Layer2Dashboard level via next/dynamic.
 */
"use client";

import { motion } from "framer-motion";

import { LAYER2_STATS } from "@/lib/theme/tokens";

const variants = {
  hidden: { opacity: 0, y: 16 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: 0.06 * i,
      duration: 0.5,
      ease: [0.2, 0.8, 0.2, 1] as const,
    },
  }),
};

export function StatsBar() {
  return (
    <section
      className="mx-auto grid max-w-5xl grid-cols-2 gap-4 px-4 py-8 sm:grid-cols-4 sm:gap-8"
      aria-label="Career statistics"
    >
      {LAYER2_STATS.map((stat, i) => (
        <motion.div
          key={stat.label}
          custom={i}
          initial="hidden"
          whileInView="visible"
          viewport={{ once: true, margin: "-80px" }}
          variants={variants}
          className="flex flex-col items-center gap-1 text-center"
        >
          <div
            className="bg-clip-text text-4xl font-bold text-transparent sm:text-5xl"
            style={{
              fontFamily: "var(--font-display)",
              backgroundImage:
                "linear-gradient(135deg, #ec4899 0%, #a855f7 50%, #22d3ee 100%)",
            }}
          >
            {stat.value}
          </div>
          <div
            className="text-[10px] font-medium tracking-widest text-text-tertiary uppercase sm:text-xs"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {stat.label}
          </div>
        </motion.div>
      ))}
    </section>
  );
}
