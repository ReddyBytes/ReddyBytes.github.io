/**
 * PullThread — draggable glowing thread, top-right of hero.
 *
 * Layer 1 component 3. Per LAYER1.md spec:
 *   - Glowing thin line + orb handle at bottom
 *   - Tooltip on hover: "Pull to discover more"
 *   - Drag DOWN ≥ 50px (mouse + swipe) → activate
 *   - Click also triggers (fallback)
 *   - On activation: thread unwinds + viewport scrolls to Layer 2
 *   - prefers-reduced-motion: instant scroll, no unwind animation
 *
 * Uses usePullThread hook for interaction logic.
 */
"use client";

import { forwardRef, useImperativeHandle, useRef, useState } from "react";

import { usePullThread } from "@/hooks/usePullThread";
import { useReducedMotion } from "@/lib/motion/reducedMotion";

export interface PullThreadHandle {
  /** Programmatically trigger the pull-thread unwind + scroll. */
  activate: () => void;
}

interface PullThreadProps {
  /** Element to scroll into view after the unwind animation. */
  scrollTargetId: string;
}

export const PullThread = forwardRef<PullThreadHandle, PullThreadProps>(
  function PullThread({ scrollTargetId }, ref) {
    const [unwinding, setUnwinding] = useState(false);
    const reducedMotion = useReducedMotion();
    const wrapRef = useRef<HTMLDivElement>(null);

    const handleActivate = () => {
      const target = document.getElementById(scrollTargetId);

      if (reducedMotion) {
        // No animation — go straight to scroll.
        target?.scrollIntoView({ behavior: "auto", block: "start" });
        return;
      }

      setUnwinding(true);

      // Wait for unwind animation (800ms per spec) before scrolling.
      setTimeout(() => {
        target?.scrollIntoView({ behavior: "smooth", block: "start" });
      }, 600);
    };

    useImperativeHandle(ref, () => ({ activate: handleActivate }));

    const { dragY, isDragging, bind } = usePullThread({
      onActivate: handleActivate,
    });

    return (
      <div
        ref={wrapRef}
        className="pointer-events-none absolute right-8 top-20 z-20 flex flex-col items-center gap-2 sm:top-24 md:right-16"
        aria-hidden={false}
      >
        <span
          className="text-[10px] font-medium tracking-widest text-accent-purple-bright uppercase opacity-70"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          Pull the thread
        </span>

        <div
          className={`pointer-events-auto relative flex flex-col items-center ${unwinding ? "animate-thread-unwind" : ""}`}
          style={{
            transform:
              !unwinding && dragY > 0
                ? `translateY(${Math.min(dragY, 60)}px)`
                : undefined,
            transition: isDragging
              ? undefined
              : "transform 0.4s cubic-bezier(0.2, 0.8, 0.2, 1)",
          }}
        >
          {/* The thread line */}
          <div
            className="w-px"
            style={{
              height: "100px",
              background:
                "linear-gradient(to bottom, transparent 0%, #a855f7 30%, #c084fc 100%)",
              boxShadow: "0 0 8px rgba(168, 85, 247, 0.6)",
            }}
          />

          {/* The orb handle */}
          <button
            type="button"
            onClick={bind.onClick}
            onPointerDown={bind.onPointerDown}
            onPointerMove={bind.onPointerMove}
            onPointerUp={bind.onPointerUp}
            className="group relative grid h-4 w-4 cursor-grab place-items-center rounded-full active:cursor-grabbing touch-none"
            style={{
              background:
                "radial-gradient(circle, #c084fc 0%, #a855f7 50%, #7c3aed 100%)",
              boxShadow:
                "0 0 16px rgba(168, 85, 247, 0.7), 0 0 4px rgba(255, 255, 255, 0.4) inset",
            }}
            aria-label="Pull to enter the system"
          >
            <span
              aria-hidden
              className="pointer-events-none absolute inset-0 animate-pulse-glow rounded-full"
              style={{
                background:
                  "radial-gradient(circle, rgba(168,85,247,0.5) 0%, transparent 70%)",
              }}
            />
          </button>
        </div>
      </div>
    );
  },
);
