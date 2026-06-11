/**
 * AboutHero — full-bleed photo strip left + intro text right.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 * Falls back to silhouette-portal.svg if user photo not uploaded.
 * Pure server component (no client interactivity).
 */
import Image from "next/image";

import type { AboutHero as AboutHeroData } from "@/lib/content/about-schema";

const FALLBACK_GRADIENT =
  "linear-gradient(180deg, #1a1a3a 0%, #0f0f24 60%, #08081a 100%)";

interface AboutHeroProps {
  hero: AboutHeroData;
}

export function AboutHero({ hero }: AboutHeroProps) {
  return (
    <section
      className="mx-auto grid max-w-7xl grid-cols-1 gap-8 px-4 py-8 sm:px-6 md:grid-cols-12 md:gap-12 md:py-12 lg:px-8"
      aria-label="Hero — introduction"
    >
      {/* Photo strip — 4/12 desktop, full-width on top mobile */}
      <div
        className="relative aspect-[3/4] overflow-hidden rounded-lg md:col-span-4 md:aspect-auto md:min-h-[500px]"
        style={{ background: FALLBACK_GRADIENT }}
      >
        <Image
          src={hero.photo}
          alt={`Photo of Penchala Reddy`}
          fill
          sizes="(max-width: 768px) 100vw, 33vw"
          className="object-cover"
          priority
          unoptimized
          onError={(e) => {
            // SVG fallback: gradient backdrop already there + show silhouette
            const target = e.currentTarget as HTMLImageElement;
            target.src = "/photos/defaults/silhouette-portal.svg";
            target.style.objectFit = "contain";
          }}
        />
        {/* Subtle bottom gradient overlay for color cohesion */}
        <span
          aria-hidden
          className="pointer-events-none absolute inset-x-0 bottom-0 h-1/3"
          style={{
            background:
              "linear-gradient(180deg, transparent 0%, rgba(168,85,247,0.25) 100%)",
          }}
        />
      </div>

      {/* Intro text — 8/12 desktop */}
      <div className="flex flex-col justify-center gap-6 md:col-span-8">
        <p
          className="text-base font-medium tracking-widest text-accent-cyan uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {hero.greeting}
        </p>

        <h2
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl lg:text-5xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          <span
            className="bg-clip-text text-transparent"
            style={{
              backgroundImage:
                "linear-gradient(135deg, #f5f5f7 0%, #c084fc 60%, #22d3ee 100%)",
            }}
          >
            {hero.tagline}
          </span>
        </h2>

        <div className="flex max-w-2xl flex-col gap-4">
          {hero.paragraphs.map((p, i) => (
            <p
              key={i}
              className="text-base leading-relaxed text-text-secondary sm:text-lg"
            >
              {p}
            </p>
          ))}
        </div>
      </div>
    </section>
  );
}
