/**
 * Layer2Dashboard — orchestrator for the Layer 2 dashboard.
 *
 * Composes (per LAYER2.md spec, top to bottom):
 *   1. <StatsBar>           — 4 stats strip
 *   2. <SectionCards>       — 3x2 vault-door grid
 *   3. <TechChips>          — auto-scrolling tech marquee
 *   4. <WhyHireMeCard>      — floating top-right, dismissible
 *   5. <Terminal>           — collapsed button bottom-left
 *   6. <AIOrb>              — rotating crystal bottom-right
 *
 * Lazy-loaded via next/dynamic from page.tsx so Layer 1 bundle stays <100KB.
 *
 * This single section serves as the scroll target for Layer 1's pull-thread +
 * "ENTER THE SYSTEM" CTA — wraps with id="layer-2" anchor.
 */
"use client";

import { AIOrb } from "@/components/layer2/AIOrb";
import { SectionCards } from "@/components/layer2/SectionCards";
import { StatsBar } from "@/components/layer2/StatsBar";
import { TechChips } from "@/components/layer2/TechChips";
import { Terminal } from "@/components/layer2/Terminal";
import { WhyHireMeCard } from "@/components/layer2/WhyHireMeCard";

export function Layer2Dashboard() {
  return (
    <>
      <section
        id="layer-2"
        aria-label="Discover sections"
        className="relative min-h-screen pt-12 sm:pt-20"
      >
        {/* Eyebrow label */}
        <div className="mx-auto max-w-7xl px-4 sm:px-6 lg:px-8">
          <p
            className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // discover
          </p>
          <h2
            className="text-2xl font-bold tracking-tight text-text-primary sm:text-3xl"
            style={{ fontFamily: "var(--font-display)" }}
          >
            The system is open.
          </h2>
          <p className="mt-2 max-w-xl text-sm text-text-secondary sm:text-base">
            Pick a path. The deeper layers reveal architecture, work, and the
            occasional easter egg.
          </p>
        </div>

        <StatsBar />
        <SectionCards />
        <TechChips />
      </section>

      {/* Floating + fixed widgets (overlap viewport, not in scroll flow) */}
      <WhyHireMeCard />
      <Terminal />
      <AIOrb />
    </>
  );
}
