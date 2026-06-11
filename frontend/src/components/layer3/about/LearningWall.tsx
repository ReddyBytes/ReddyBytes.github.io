/**
 * LearningWall — build-in-public wall of currently-studying topics.
 *
 * Per docs/design/LAYER3-ABOUT.md:
 *   - Each topic row: triangle pointer + name + progress bar + %
 *   - Progress bars animate from 0 → target on scroll-into-view (Framer Motion)
 *   - Reduced motion: instant fill
 */
"use client";

import { motion } from "framer-motion";
import { Triangle } from "lucide-react";

import { useReducedMotion } from "@/lib/motion/reducedMotion";
import type { LearningItem } from "@/lib/content/about-schema";

interface LearningWallProps {
  items: readonly LearningItem[];
}

export function LearningWall({ items }: LearningWallProps) {
  const reducedMotion = useReducedMotion();

  return (
    <section
      id="learning"
      className="mx-auto max-w-5xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      aria-label="Currently learning"
    >
      <header className="mb-8">
        <p
          className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // learning
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          The build-in-public wall
        </h2>
        <p className="mt-3 text-sm text-text-secondary sm:text-base">
          What I&apos;m studying right now. Honest self-assessment, not marketing.
        </p>
      </header>

      <ul className="flex flex-col gap-4">
        {items.map((item, i) => (
          <li
            key={item.topic}
            className="flex flex-col gap-2 rounded-lg border border-border-subtle bg-bg-elevated p-4"
          >
            <div className="flex items-center justify-between gap-3">
              <div className="flex items-center gap-2">
                <Triangle
                  className="h-2.5 w-2.5 rotate-90 text-accent-pink"
                  aria-hidden="true"
                />
                {item.link ? (
                  <a
                    href={item.link}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-sm font-semibold text-text-primary transition-colors hover:text-accent-cyan sm:text-base"
                  >
                    {item.topic}
                  </a>
                ) : (
                  <span className="text-sm font-semibold text-text-primary sm:text-base">
                    {item.topic}
                  </span>
                )}
              </div>
              <span
                className="text-xs font-medium tracking-wider text-text-tertiary"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {item.progress}%
              </span>
            </div>

            <div
              className="h-1.5 w-full overflow-hidden rounded-full bg-bg-base"
              role="progressbar"
              aria-label={`${item.topic} progress`}
              aria-valuenow={item.progress}
              aria-valuemin={0}
              aria-valuemax={100}
            >
              <motion.div
                initial={{ width: reducedMotion ? `${item.progress}%` : 0 }}
                whileInView={{ width: `${item.progress}%` }}
                viewport={{ once: true, margin: "-80px" }}
                transition={{
                  delay: reducedMotion ? 0 : 0.15 + 0.05 * i,
                  duration: reducedMotion ? 0 : 1,
                  ease: [0.2, 0.8, 0.2, 1] as const,
                }}
                className="h-full rounded-full"
                style={{
                  background:
                    "linear-gradient(90deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%)",
                }}
              />
            </div>
          </li>
        ))}
      </ul>
    </section>
  );
}
