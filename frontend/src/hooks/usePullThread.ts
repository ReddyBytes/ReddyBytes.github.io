/**
 * usePullThread — drag/swipe handler for the Layer 1 pull-thread interaction.
 *
 * Per LAYER1.md spec:
 * - Desktop: drag mouse downward by 50+ pixels to trigger
 * - Mobile: swipe-down gesture starting on the orb
 * - Click also triggers (fallback for accessibility)
 * - prefers-reduced-motion → no drag animation, click goes straight to scroll
 *
 * Returns:
 * - dragY: current drag distance in px (for visual progress feedback)
 * - isDragging: true while user is actively dragging
 * - bind: pointer event handlers to spread on the draggable element
 * - triggerActivation: programmatic activation (used by primary CTA)
 */
"use client";

import { useCallback, useState } from "react";

const ACTIVATION_THRESHOLD_PX = 50;

interface UsePullThreadOpts {
  onActivate: () => void;
}

export function usePullThread({ onActivate }: UsePullThreadOpts) {
  const [dragY, setDragY] = useState(0);
  const [isDragging, setIsDragging] = useState(false);
  const [startY, setStartY] = useState(0);

  const onPointerDown = useCallback((e: React.PointerEvent) => {
    e.currentTarget.setPointerCapture(e.pointerId);
    setIsDragging(true);
    setStartY(e.clientY);
    setDragY(0);
  }, []);

  const onPointerMove = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const delta = Math.max(0, e.clientY - startY);
      setDragY(delta);
    },
    [isDragging, startY],
  );

  const onPointerUp = useCallback(
    (e: React.PointerEvent) => {
      if (!isDragging) return;
      const delta = Math.max(0, e.clientY - startY);
      setIsDragging(false);
      if (delta >= ACTIVATION_THRESHOLD_PX) {
        onActivate();
      } else {
        // Snap back
        setDragY(0);
      }
      e.currentTarget.releasePointerCapture(e.pointerId);
    },
    [isDragging, startY, onActivate],
  );

  /** Click fallback OR external trigger (used by primary CTA). */
  const triggerActivation = useCallback(() => {
    onActivate();
  }, [onActivate]);

  return {
    dragY,
    isDragging,
    bind: {
      onPointerDown,
      onPointerMove,
      onPointerUp,
      onClick: triggerActivation,
    },
    triggerActivation,
  };
}
