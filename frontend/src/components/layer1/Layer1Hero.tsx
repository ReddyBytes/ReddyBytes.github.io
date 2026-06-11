/**
 * Layer1Hero — orchestrator client component composing all Layer 1 pieces.
 *
 * Owns the cross-component state:
 *   - Whether boot sequence is currently showing
 *   - Programmatic activation of the pull-thread
 *
 * Wires:
 *   - First visit (no localStorage flag) → show boot sequence
 *   - Boot sequence onComplete → hide overlay + mark visited
 *   - Primary CTA "ENTER THE SYSTEM" → trigger pull-thread activate
 *   - Secondary CTA "WATCH INTRO" → re-show boot sequence (replay)
 *   - PullThread direct interaction → activate self (no parent involvement needed)
 *
 * Per LAYER1.md spec.
 */
"use client";

import { useEffect, useRef, useState } from "react";

import { BootSequence } from "@/components/layer1/BootSequence";
import { HeroCopy } from "@/components/layer1/HeroCopy";
import { HeroCTA } from "@/components/layer1/HeroCTA";
import { HeroPortal } from "@/components/layer1/HeroPortal";
import { PullThread, type PullThreadHandle } from "@/components/layer1/PullThread";
import { SocialIcons } from "@/components/layer1/SocialIcons";
import { SystemStatus } from "@/components/layer1/SystemStatus";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import { hasVisited, markVisited } from "@/lib/visit/firstVisit";

const SCROLL_TARGET_ID = "layer-2";

export function Layer1Hero() {
  // null on initial server render; resolved after hydration
  const [showBoot, setShowBoot] = useState<boolean | null>(null);
  const reducedMotion = useReducedMotion();
  const pullThreadRef = useRef<PullThreadHandle>(null);

  // Decide whether to show boot — only after hydration (avoids SSR/CSR mismatch)
  useEffect(() => {
    const visited = hasVisited();
    if (visited === null) {
      setShowBoot(false);
      return;
    }
    // First-visit OR reduced-motion → skip boot entirely (per spec)
    if (visited || reducedMotion) {
      setShowBoot(false);
      markVisited();
    } else {
      setShowBoot(true);
    }
  }, [reducedMotion]);

  const handleBootComplete = () => {
    setShowBoot(false);
    markVisited();
  };

  const handlePrimaryCTA = () => {
    pullThreadRef.current?.activate();
  };

  const handleSecondaryCTA = () => {
    setShowBoot(true);
  };

  return (
    <>
      {showBoot && <BootSequence onComplete={handleBootComplete} />}

      <main
        id="top"
        className="relative min-h-[calc(100vh-4rem)] overflow-hidden pt-16"
      >
        <PullThread ref={pullThreadRef} scrollTargetId={SCROLL_TARGET_ID} />

        <div className="mx-auto grid max-w-7xl grid-cols-1 items-center gap-12 px-4 py-16 sm:px-6 md:grid-cols-2 lg:px-8 lg:py-24">
          {/* Left column — text + CTAs */}
          <div className="flex flex-col gap-8">
            <HeroCopy />
            <HeroCTA
              onPrimaryClick={handlePrimaryCTA}
              onSecondaryClick={handleSecondaryCTA}
            />
            <SocialIcons />
          </div>

          {/* Right column — portal */}
          <div className="flex justify-center md:justify-end">
            <HeroPortal />
          </div>
        </div>

        {/* Bottom-right system status panel — absolute on desktop, hidden mobile */}
        <div className="absolute bottom-8 right-8 hidden md:block">
          <SystemStatus />
        </div>
      </main>
    </>
  );
}
