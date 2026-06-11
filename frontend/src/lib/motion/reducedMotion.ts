/**
 * useReducedMotion — detects user's prefers-reduced-motion preference.
 *
 * Per SKILL.md Critical Rule: every animation must respect this.
 * Boot sequence auto-skips, portal pulse freezes, scroll-hint stops bouncing
 * when this returns true.
 *
 * Listens to media-query changes so toggling the OS setting updates live
 * without page refresh.
 */
"use client";

import { useEffect, useState } from "react";

export function useReducedMotion(): boolean {
  // SSR-safe initial value (false). Real value set in useEffect.
  const [prefersReduced, setPrefersReduced] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined" || !window.matchMedia) return;

    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setPrefersReduced(mq.matches);

    const handler = (e: MediaQueryListEvent) => setPrefersReduced(e.matches);
    mq.addEventListener("change", handler);
    return () => mq.removeEventListener("change", handler);
  }, []);

  return prefersReduced;
}
