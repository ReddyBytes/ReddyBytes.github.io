/**
 * RoleCard — single role card with all metadata.
 *
 * Per docs/design/LAYER3-EXPERIENCE.md.
 * Stagger fade-in via Framer Motion on scroll-into-view.
 * Reuses TechStackPills from layer3/projects (already built).
 */
"use client";

import { motion } from "framer-motion";
import { MapPin } from "lucide-react";

import { TechStackPills } from "@/components/layer3/projects/TechStackPills";
import { ImpactList } from "@/components/layer3/experience/ImpactList";
import type { RoleEntry } from "@/lib/content/experience-schema";

interface RoleCardProps {
  role: RoleEntry;
  index: number;
}

function formatDateRange(start: string, end: string, current: boolean): string {
  return current ? `${start} – present` : `${start} – ${end}`;
}

export function RoleCard({ role, index }: RoleCardProps) {
  const pillClass = role.current
    ? "text-emerald-400 border-emerald-400/40 bg-emerald-400/10"
    : "text-text-tertiary border-border-subtle bg-bg-elevated";

  const hoverBorder = role.current
    ? "hover:border-accent-cyan/60"
    : "hover:border-accent-purple/60";

  // RoleCard takes TechStackPills which expects {name, primary?} shape.
  const techStackForPills = role.techStack.map((name) => ({ name }));

  return (
    <motion.article
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        delay: 0.1 * index,
        duration: 0.55,
        ease: [0.2, 0.8, 0.2, 1] as const,
      }}
      className={`relative rounded-lg border border-border-subtle bg-bg-elevated p-6 transition-all duration-300 hover:-translate-y-1 ${hoverBorder}`}
    >
      {/* Header: status pill (left) + date range (right) */}
      <div className="mb-4 flex flex-wrap items-center justify-between gap-2">
        <span
          className={`rounded-full border px-3 py-0.5 text-[10px] font-semibold tracking-widest uppercase ${pillClass}`}
          style={{ fontFamily: "var(--font-mono)" }}
        >
          ● {role.current ? "current" : "prior"}
        </span>
        <span
          className="text-xs font-medium tracking-wider text-accent-cyan"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          {formatDateRange(role.start, role.end, role.current)}
        </span>
      </div>

      {/* Title + company + location */}
      <h3
        className="text-xl font-semibold tracking-tight text-text-primary sm:text-2xl"
        style={{ fontFamily: "var(--font-display)" }}
      >
        {role.title}
      </h3>
      <p className="mt-1 text-base font-medium text-text-secondary">
        {role.company}
      </p>
      <p
        className="mt-1 flex items-center gap-1.5 text-xs text-text-tertiary"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        <MapPin className="h-3 w-3" aria-hidden="true" />
        {role.location}
      </p>

      {/* Impact bullets */}
      <div className="mt-5">
        <ImpactList impact={role.impact} />
      </div>

      {/* Tech pills */}
      <div className="mt-5">
        <TechStackPills techStack={techStackForPills} />
      </div>
    </motion.article>
  );
}
