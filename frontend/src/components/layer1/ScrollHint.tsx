/**
 * ScrollHint — bottom-of-viewport "↓ SCROLL TO EXPLORE" affordance.
 *
 * Layer 1 component 7. Per LAYER1.md spec:
 *   - Centered horizontally, 32px from bottom
 *   - Animated bounce on the chevron
 *   - Hides on scroll position > 100px (its purpose is served)
 *   - Gentle on the eye, not visually heavy
 *
 * Client component — needs scroll listener to fade out.
 */
"use client";

import { ChevronDown } from "lucide-react";
import { useEffect, useState } from "react";

export function ScrollHint() {
  const [visible, setVisible] = useState(true);

  useEffect(() => {
    const onScroll = () => {
      setVisible(window.scrollY < 100);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <div
      className="animate-fade-in-up pointer-events-none fixed inset-x-0 bottom-8 z-10 flex flex-col items-center gap-1 transition-opacity duration-500"
      style={{
        animationDelay: "840ms",
        opacity: visible ? 1 : 0,
      }}
      aria-hidden="true"
    >
      <ChevronDown className="animate-bounce-down h-4 w-4 text-accent-cyan" />
      <span
        className="text-[10px] font-medium tracking-[0.25em] text-text-tertiary uppercase"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        Scroll to explore
      </span>
    </div>
  );
}
