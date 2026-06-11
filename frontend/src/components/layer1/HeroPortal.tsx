/**
 * HeroPortal — glowing purple ring with silhouette inside.
 *
 * Layer 1 component 2. Centerpiece on the right side of the viewport.
 * Per LAYER1.md spec:
 *   - Outer ring: glowing purple gradient circle, pulse 4s loop
 *   - Inner: SVG silhouette (default fallback) on small platform
 *   - Background inside ring: cosmic gradient + faint stars
 *   - Size: ~480px desktop, ~280px mobile
 *
 * Pure server component — all animation is CSS, all assets are static SVG.
 * Uses next/image with `unoptimized: true` (set in next.config.ts) for static export.
 */
import Image from "next/image";

import { getPhoto } from "@/lib/photo/fallback";

export function HeroPortal() {
  const silhouetteSrc = getPhoto("hero-silhouette");

  return (
    <div
      className="relative grid place-items-center"
      style={{
        width: "min(72vw, 480px)",
        aspectRatio: "1",
      }}
    >
      {/* Outer glow halo — radial fade */}
      <div
        aria-hidden
        className="absolute inset-0 animate-pulse-glow rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(168, 85, 247, 0.32) 0%, rgba(124, 58, 237, 0.16) 35%, transparent 70%)",
          filter: "blur(8px)",
        }}
      />

      {/* The ring itself — gradient stroke */}
      <div
        aria-hidden
        className="absolute inset-[8%] rounded-full"
        style={{
          background:
            "conic-gradient(from 0deg, #a855f7, #c084fc, #22d3ee, #a855f7)",
          padding: "1.5px",
          boxShadow:
            "0 0 32px rgba(168, 85, 247, 0.45), inset 0 0 24px rgba(168, 85, 247, 0.2)",
        }}
      >
        <div
          className="h-full w-full rounded-full"
          style={{
            background:
              "radial-gradient(circle at 50% 70%, #1a1a3a 0%, #0f0f24 60%, #08081a 100%)",
          }}
        />
      </div>

      {/* Silhouette inside — animated float */}
      <div
        className="relative z-10 animate-float-y"
        style={{
          width: "60%",
          height: "75%",
          marginTop: "10%",
        }}
      >
        <Image
          src={silhouetteSrc}
          alt="Penchala silhouette inside cinematic portal"
          fill
          sizes="(max-width: 768px) 280px, 480px"
          priority
          className="object-contain"
          unoptimized
        />
      </div>

      {/* Inner stars — extra detail in the portal void */}
      <div
        aria-hidden
        className="absolute inset-[12%] rounded-full"
        style={{
          backgroundImage:
            "radial-gradient(1px 1px at 25% 30%, rgba(255,255,255,0.5), transparent 50%), radial-gradient(1px 1px at 70% 60%, rgba(168,85,247,0.6), transparent 50%), radial-gradient(0.5px 0.5px at 50% 80%, rgba(34,211,238,0.5), transparent 50%)",
          backgroundSize: "100% 100%",
          opacity: 0.6,
        }}
      />
    </div>
  );
}
