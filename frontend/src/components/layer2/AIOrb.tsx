/**
 * AIOrb — rotating neural crystal bottom-right, tap to expand into ChatPanel.
 *
 * Per LAYER2.md spec:
 *   - ~64px icosahedron silhouette with rotating wireframe (CSS animation)
 *   - Purple → cyan gradient fill, pulsing halo behind it
 *   - Tap → expands into ChatPanel (lazy-loaded)
 *   - Reduced motion: static crystal, no rotation/halo
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { useState } from "react";

import { ChatPanel } from "@/components/layer2/ChatPanel";
import { useReducedMotion } from "@/lib/motion/reducedMotion";

export function AIOrb() {
  const [open, setOpen] = useState(false);
  const reducedMotion = useReducedMotion();

  return (
    <>
      {!open && (
        <motion.button
          type="button"
          onClick={() => setOpen(true)}
          initial={{ opacity: 0, scale: 0 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{
            duration: reducedMotion ? 0 : 0.6,
            ease: [0.2, 0.8, 0.2, 1] as const,
            delay: 0.8,
          }}
          className="group fixed bottom-6 right-6 z-30 grid h-16 w-16 cursor-pointer place-items-center rounded-full focus:outline-none"
          aria-label="Open AI assistant"
          style={{
            background:
              "radial-gradient(circle at 30% 30%, #c084fc 0%, #a855f7 40%, #7c3aed 100%)",
            boxShadow:
              "0 0 32px rgba(168,85,247,0.55), 0 0 12px rgba(34,211,238,0.4) inset",
          }}
        >
          {/* Pulsing halo backdrop */}
          <span
            aria-hidden
            className="absolute inset-0 animate-pulse-glow rounded-full"
            style={{
              background:
                "radial-gradient(circle, rgba(168,85,247,0.6) 0%, transparent 70%)",
              filter: "blur(8px)",
            }}
          />

          {/* Rotating neural crystal — inline SVG icosahedron silhouette */}
          <svg
            viewBox="0 0 64 64"
            className={`relative z-10 h-9 w-9 ${reducedMotion ? "" : "animate-rotate-slow"}`}
            style={{ filter: "drop-shadow(0 0 4px rgba(255,255,255,0.5))" }}
            aria-hidden="true"
          >
            <defs>
              <linearGradient id="orb-fill" x1="0" y1="0" x2="1" y2="1">
                <stop offset="0%" stopColor="#ffffff" stopOpacity="0.95" />
                <stop offset="100%" stopColor="#22d3ee" stopOpacity="0.7" />
              </linearGradient>
            </defs>
            {/* Hexagonal/icosahedral silhouette outline */}
            <polygon
              points="32,8 52,20 52,44 32,56 12,44 12,20"
              fill="none"
              stroke="url(#orb-fill)"
              strokeWidth="1.2"
              strokeOpacity="0.9"
            />
            {/* Inner faces — wireframe */}
            <polygon
              points="32,8 32,32 52,20"
              fill="none"
              stroke="url(#orb-fill)"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <polygon
              points="32,8 32,32 12,20"
              fill="none"
              stroke="url(#orb-fill)"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <polygon
              points="32,32 52,44 32,56"
              fill="none"
              stroke="url(#orb-fill)"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            <polygon
              points="32,32 12,44 32,56"
              fill="none"
              stroke="url(#orb-fill)"
              strokeWidth="0.8"
              strokeOpacity="0.6"
            />
            {/* Center spark */}
            <circle cx="32" cy="32" r="2.2" fill="#ffffff" />
          </svg>
        </motion.button>
      )}

      <AnimatePresence>
        {open && <ChatPanel onClose={() => setOpen(false)} />}
      </AnimatePresence>
    </>
  );
}
