/**
 * BootSequence — full-screen cinematic loader, "INITIALIZING ENGINEER PROFILE...".
 *
 * Layer 1 component 8. Per LAYER1.md spec:
 *   - 5 typed lines + final "Profile ready"
 *   - ~30ms per char, 200ms between lines, 800ms pause at end
 *   - Visible SKIP button + Esc/Space hotkey
 *   - prefers-reduced-motion: auto-skipped (instant)
 *   - First-visit only (localStorage flag); WATCH INTRO replays it
 *
 * Driven by useTypewriter hook. Parent component decides whether to show.
 */
"use client";

import { useEffect } from "react";

import { useTypewriter } from "@/hooks/useTypewriter";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import { BOOT_LINES } from "@/lib/theme/tokens";

interface BootSequenceProps {
  /** Called when the sequence completes naturally OR is skipped. */
  onComplete: () => void;
}

export function BootSequence({ onComplete }: BootSequenceProps) {
  const reducedMotion = useReducedMotion();

  const { completedLines, currentLine, isDone } = useTypewriter({
    lines: BOOT_LINES,
    charSpeed: 30,
    pauseBetweenLines: 200,
    pauseAtEnd: 800,
    instant: reducedMotion,
    onComplete,
  });

  // Esc / Space hotkey to skip
  useEffect(() => {
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape" || e.key === " " || e.code === "Space") {
        e.preventDefault();
        onComplete();
      }
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [onComplete]);

  return (
    <div
      className="fixed inset-0 z-50 grid place-items-center transition-opacity duration-300"
      style={{ background: "var(--color-bg-base)" }}
      role="dialog"
      aria-modal="true"
      aria-label="Initializing engineer profile"
    >
      {/* Drifting particles backdrop (CSS only, sparse, ~24 particles) */}
      <div aria-hidden className="pointer-events-none absolute inset-0 overflow-hidden">
        {Array.from({ length: 24 }).map((_, i) => (
          <span
            key={i}
            className="absolute h-0.5 w-0.5 rounded-full"
            style={{
              left: `${(i * 37) % 100}%`,
              bottom: `-${(i * 13) % 50}px`,
              background:
                i % 3 === 0
                  ? "#a855f7"
                  : i % 3 === 1
                    ? "#22d3ee"
                    : "#ffffff",
              animation: `drift-up ${20 + (i % 8) * 2}s linear ${i * 0.5}s infinite`,
              opacity: 0.5,
            }}
          />
        ))}
      </div>

      {/* Skip button — top-right */}
      <button
        type="button"
        onClick={onComplete}
        className="absolute right-6 top-6 text-xs font-medium tracking-widest text-text-secondary uppercase transition-colors hover:text-accent-cyan"
        style={{ fontFamily: "var(--font-mono)" }}
        aria-label="Skip boot sequence (Esc or Space)"
      >
        Skip →
      </button>

      {/* Typewriter content */}
      <div
        className="w-full max-w-xl px-6"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        {completedLines.map((line, i) => (
          <div
            key={i}
            className="text-sm leading-relaxed text-text-tertiary sm:text-base"
            style={{ marginBottom: "0.4rem" }}
          >
            <span className="text-accent-cyan">{">"}</span> {line}
          </div>
        ))}

        {!isDone && (
          <div className="text-sm leading-relaxed text-accent-cyan-bright sm:text-base">
            <span className="text-accent-cyan">{">"}</span> {currentLine}
            <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 bg-accent-cyan align-middle" />
          </div>
        )}
      </div>

      <span className="sr-only">
        Press Escape or Space to skip the introduction.
      </span>
    </div>
  );
}
