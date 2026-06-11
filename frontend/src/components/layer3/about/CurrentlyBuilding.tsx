/**
 * CurrentlyBuilding — 3-card row of active projects.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 * Reuses status-pill pattern from Layer 3 Projects ProjectHero.
 */
"use client";

import { motion } from "framer-motion";
import { ArrowUpRight } from "lucide-react";
import Link from "next/link";

import type {
  BuildingItem,
  BuildingStatus,
} from "@/lib/content/about-schema";

const STATUS_COLOR: Record<BuildingStatus, string> = {
  live: "text-emerald-400 border-emerald-400/40 bg-emerald-400/10",
  beta: "text-amber-400 border-amber-400/40 bg-amber-400/10",
  learning: "text-accent-cyan border-accent-cyan/40 bg-accent-cyan/10",
  shipped: "text-text-tertiary border-border-subtle bg-bg-elevated",
};

interface CurrentlyBuildingProps {
  items: readonly BuildingItem[];
}

export function CurrentlyBuilding({ items }: CurrentlyBuildingProps) {
  return (
    <section
      id="building"
      className="mx-auto max-w-7xl px-4 py-12 sm:px-6 sm:py-16 lg:px-8"
      aria-label="Currently building"
    >
      <header className="mb-8">
        <p
          className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // building
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          What I&apos;m building right now
        </h2>
      </header>

      <ul className="grid grid-cols-1 gap-4 sm:grid-cols-2 sm:gap-5 lg:grid-cols-3 lg:gap-6">
        {items.map((item, i) => {
          const isExternal = item.href.startsWith("http");
          return (
            <motion.li
              key={item.slug}
              initial={{ opacity: 0, y: 24 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-80px" }}
              transition={{
                delay: 0.1 * i,
                duration: 0.5,
                ease: [0.2, 0.8, 0.2, 1] as const,
              }}
            >
              <Link
                href={item.href}
                target={isExternal ? "_blank" : undefined}
                rel={isExternal ? "noopener noreferrer" : undefined}
                className="group relative flex h-full flex-col gap-3 overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated p-5 transition-all duration-300 hover:-translate-y-1 hover:border-accent-pink-bright/60"
              >
                <span
                  aria-hidden
                  className="pointer-events-none absolute inset-0 rounded-lg opacity-0 transition-opacity duration-300 group-hover:opacity-100"
                  style={{
                    background:
                      "linear-gradient(135deg, rgba(168,85,247,0.15) 0%, rgba(236,72,153,0.15) 100%)",
                    mixBlendMode: "screen",
                  }}
                />

                <div className="relative flex items-start justify-between">
                  <span
                    className={`rounded-full border px-2 py-0.5 text-[10px] font-semibold tracking-widest uppercase ${STATUS_COLOR[item.status]}`}
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    ● {item.status}
                  </span>
                  <ArrowUpRight
                    className="h-4 w-4 text-text-tertiary transition-all group-hover:text-accent-cyan group-hover:translate-x-0.5 group-hover:-translate-y-0.5"
                    aria-hidden
                  />
                </div>

                <h3
                  className="relative text-lg font-semibold text-text-primary sm:text-xl"
                  style={{ fontFamily: "var(--font-display)" }}
                >
                  {item.title}
                </h3>
                <p className="relative text-sm leading-relaxed text-text-secondary">
                  {item.description}
                </p>
              </Link>
            </motion.li>
          );
        })}
      </ul>
    </section>
  );
}
