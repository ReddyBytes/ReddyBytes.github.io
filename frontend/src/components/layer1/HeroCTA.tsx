/**
 * HeroCTA — primary "ENTER THE SYSTEM →" + secondary "WATCH INTRO" buttons.
 *
 * Layer 1 component 4. Per LAYER1.md spec:
 *   - Primary: gradient outline → fills on hover, triggers pull-thread + scroll
 *   - Secondary: text-only mono, replays boot sequence
 *
 * Client component — needs onClick handlers wired to parent state.
 * Parent (Layer1Hero) passes activatePullThread + replayBoot callbacks.
 */
"use client";

import { ArrowRight } from "lucide-react";

interface HeroCTAProps {
  onPrimaryClick: () => void;
  onSecondaryClick: () => void;
}

export function HeroCTA({ onPrimaryClick, onSecondaryClick }: HeroCTAProps) {
  return (
    <div
      className="animate-fade-in-up flex flex-col items-start gap-4 sm:flex-row sm:items-center"
      style={{ animationDelay: "480ms" }}
    >
      {/* Primary CTA */}
      <button
        type="button"
        onClick={onPrimaryClick}
        className="group relative inline-flex items-center gap-3 overflow-hidden rounded-md px-6 py-3 text-sm font-semibold tracking-wider text-text-primary uppercase transition-all duration-300 hover:-translate-y-px"
        style={{
          fontFamily: "var(--font-sans)",
          background:
            "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(34,211,238,0.1) 100%)",
          border: "1px solid",
          borderImage:
            "linear-gradient(135deg, #a855f7 0%, #22d3ee 100%) 1",
        }}
      >
        <span className="relative z-10">Enter the system</span>
        <ArrowRight className="relative z-10 h-4 w-4 transition-transform duration-300 group-hover:translate-x-1" />
        {/* hover fill */}
        <span
          aria-hidden
          className="absolute inset-0 -z-0 opacity-0 transition-opacity duration-300 group-hover:opacity-100"
          style={{
            background:
              "linear-gradient(135deg, rgba(168,85,247,0.3) 0%, rgba(34,211,238,0.2) 100%)",
          }}
        />
      </button>

      {/* Secondary CTA */}
      <button
        type="button"
        onClick={onSecondaryClick}
        className="group inline-flex items-center gap-2 px-2 py-2 text-xs font-medium tracking-widest text-text-secondary uppercase transition-colors duration-300 hover:text-accent-cyan"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <span>Watch intro</span>
        <ArrowRight className="h-3.5 w-3.5 transition-transform duration-300 group-hover:translate-x-0.5" />
      </button>
    </div>
  );
}
