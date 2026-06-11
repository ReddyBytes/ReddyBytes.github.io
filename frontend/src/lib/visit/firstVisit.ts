/**
 * First-visit tracking — used by BootSequence to decide whether to play.
 *
 * Per LAYER1.md spec: boot sequence shows on FIRST visit only. Return visitors
 * skip directly to hero. Stored in localStorage; reset by clearing site data
 * or by URL param `?firstvisit=1` (handy for testing).
 *
 * SSR-safe: returns null during server render, real value after hydration.
 */
"use client";

const FLAG_KEY = "portfolio_visited";

/** Read flag (returns null on SSR / first hydration). */
export function hasVisited(): boolean | null {
  if (typeof window === "undefined") return null;

  // Override: ?firstvisit=1 in URL forces "not visited" for QA / demo.
  const url = new URL(window.location.href);
  if (url.searchParams.get("firstvisit") === "1") {
    return false;
  }

  return window.localStorage.getItem(FLAG_KEY) === "true";
}

/** Mark visited — called after boot sequence completes or is skipped. */
export function markVisited(): void {
  if (typeof window === "undefined") return;
  window.localStorage.setItem(FLAG_KEY, "true");
}
