/**
 * WhyHireMeCard — floating top-right card on Layer 2.
 *
 * Per LAYER2.md spec:
 *   - 3 bullet points (headline + tease line each)
 *   - Dismissible; persists dismiss in localStorage
 *   - Gradient border (purple → pink → cyan, Layer 2 vivid palette)
 *   - Pulse once on first arrival to draw attention
 *   - Mobile: becomes a bottom-sheet card
 */
"use client";

import { motion } from "framer-motion";
import { Triangle, X } from "lucide-react";

import { useDismissible } from "@/hooks/useDismissible";
import { LAYER2_WHY_HIRE_ME } from "@/lib/theme/tokens";

export function WhyHireMeCard() {
  const { dismissed, dismiss } = useDismissible("why-hire-me");

  if (dismissed) return null;

  return (
    <motion.aside
      initial={{ opacity: 0, x: 40, scale: 0.96 }}
      animate={{ opacity: 1, x: 0, scale: 1 }}
      exit={{ opacity: 0, x: 40 }}
      transition={{
        duration: 0.55,
        ease: [0.2, 0.8, 0.2, 1] as const,
        delay: 0.4,
      }}
      className="fixed bottom-4 left-4 right-4 z-30 mx-auto max-w-sm sm:right-6 sm:bottom-auto sm:top-24 sm:left-auto sm:mx-0 sm:w-[280px]"
      role="region"
      aria-label="Why hire me — quick recruiter summary"
    >
      <div
        className="relative rounded-lg p-4"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,36,0.92) 0%, rgba(8,8,26,0.92) 100%)",
          backdropFilter: "blur(20px)",
          border: "1px solid",
          borderImage:
            "linear-gradient(135deg, #a855f7 0%, #ec4899 50%, #22d3ee 100%) 1",
          boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 24px rgba(168,85,247,0.2)",
        }}
      >
        {/* Header */}
        <div className="mb-3 flex items-center justify-between">
          <span
            className="text-[10px] font-bold tracking-widest text-accent-cyan uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            Why hire me
          </span>
          <button
            type="button"
            onClick={dismiss}
            className="grid h-7 w-7 place-items-center rounded-md text-text-tertiary transition-colors hover:bg-bg-base hover:text-text-primary"
            aria-label="Dismiss why hire me card"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Bullets */}
        <ul className="flex flex-col gap-3">
          {LAYER2_WHY_HIRE_ME.map((item) => (
            <li key={item.headline} className="flex gap-2">
              <Triangle
                className="mt-1 h-2.5 w-2.5 shrink-0 rotate-90 text-accent-pink"
                aria-hidden="true"
              />
              <div>
                <div className="text-sm font-semibold text-text-primary">
                  {item.headline}
                </div>
                <div className="text-xs text-text-secondary">{item.tease}</div>
              </div>
            </li>
          ))}
        </ul>
      </div>
    </motion.aside>
  );
}
