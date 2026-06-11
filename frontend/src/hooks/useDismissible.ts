/**
 * useDismissible — localStorage-backed dismiss state.
 *
 * Used by Layer 2 components that can be permanently dismissed by the user
 * (WhyHireMeCard, future banners). Persists dismiss across page reloads.
 *
 * SSR-safe: initial state is `false` (not-dismissed) during server render +
 * first paint; flips to true on hydration if localStorage flag exists.
 * This avoids flash-of-content for already-dismissed UI on slow networks.
 */
"use client";

import { useCallback, useEffect, useState } from "react";

interface UseDismissibleReturn {
  /** True if user has dismissed this item (after hydration). */
  dismissed: boolean;
  /** Mark as dismissed; persists to localStorage. */
  dismiss: () => void;
  /** Reset dismiss state (handy for "undo" toasts; not used in v1). */
  reset: () => void;
}

export function useDismissible(key: string): UseDismissibleReturn {
  const storageKey = `dismissed:${key}`;
  const [dismissed, setDismissed] = useState(false);

  useEffect(() => {
    if (typeof window === "undefined") return;
    setDismissed(window.localStorage.getItem(storageKey) === "true");
  }, [storageKey]);

  const dismiss = useCallback(() => {
    setDismissed(true);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(storageKey, "true");
    }
  }, [storageKey]);

  const reset = useCallback(() => {
    setDismissed(false);
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(storageKey);
    }
  }, [storageKey]);

  return { dismissed, dismiss, reset };
}
