/**
 * VaultCard — single vault-door themed section card.
 *
 * Per LAYER2.md spec:
 *   - 240x280 desktop, full-width stacked on mobile
 *   - Closed state: title visible, small lock icon top-right
 *   - Hover: door cracks open ~10% revealing icon + tease line + lock becomes unlock
 *   - Click: navigates to the section's route (placeholder for v1)
 *   - Gradient border that changes color on hover
 *
 * Uses Framer Motion for the door-crack animation.
 */
"use client";

import { motion } from "framer-motion";
import {
  Briefcase,
  Cpu,
  FlaskConical,
  Lock,
  Plane,
  Sparkles,
  Unlock,
  User2,
} from "lucide-react";
import Link from "next/link";
import { useState, type ComponentType, type SVGProps } from "react";

type IconKey = "projects" | "experience" | "lab" | "travel" | "skills" | "about";

const ICONS: Record<IconKey, ComponentType<SVGProps<SVGSVGElement>>> = {
  projects: Sparkles,
  experience: Briefcase,
  lab: FlaskConical,
  travel: Plane,
  skills: Cpu,
  about: User2,
};

interface VaultCardProps {
  title: string;
  tease: string;
  href: string;
  iconKey: IconKey;
  /** Tailwind gradient classes for hover border (e.g. "from-accent-cyan to-accent-purple"). */
  gradient: string;
  /** Stagger entry index (multiplied by 100ms). */
  index: number;
}

export function VaultCard({
  title,
  tease,
  href,
  iconKey,
  gradient,
  index,
}: VaultCardProps) {
  const [hovered, setHovered] = useState(false);
  const Icon = ICONS[iconKey];
  const LockIcon = hovered ? Unlock : Lock;

  return (
    <motion.div
      initial={{ opacity: 0, y: 24 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, margin: "-100px" }}
      transition={{
        delay: 0.1 * index,
        duration: 0.55,
        ease: [0.2, 0.8, 0.2, 1] as const,
      }}
    >
      <Link
        href={href}
        onMouseEnter={() => setHovered(true)}
        onMouseLeave={() => setHovered(false)}
        onFocus={() => setHovered(true)}
        onBlur={() => setHovered(false)}
        className={`group relative block overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated p-6 transition-all duration-300 hover:-translate-y-1 hover:border-transparent`}
        aria-label={`${title} — ${tease}`}
      >
        {/* Animated gradient border on hover (pseudo via background) */}
        <span
          aria-hidden
          className={`pointer-events-none absolute inset-0 rounded-lg bg-gradient-to-br ${gradient} opacity-0 transition-opacity duration-300 group-hover:opacity-30`}
          style={{ mixBlendMode: "screen" }}
        />

        {/* Lock icon top-right */}
        <div className="absolute right-4 top-4 text-text-tertiary transition-colors duration-300 group-hover:text-accent-cyan">
          <LockIcon className="h-4 w-4" aria-hidden="true" />
        </div>

        {/* Card content — sliding "vault door" effect */}
        <motion.div
          animate={{ y: hovered ? -4 : 0 }}
          transition={{ duration: 0.35, ease: [0.2, 0.8, 0.2, 1] as const }}
          className="flex h-44 flex-col justify-between sm:h-48"
        >
          <div>
            <Icon
              className="mb-4 h-7 w-7 text-accent-purple-bright transition-colors duration-300 group-hover:text-accent-pink-bright"
              aria-hidden="true"
            />
            <h3
              className="text-base font-semibold tracking-widest text-text-primary uppercase sm:text-lg"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              {title}
            </h3>
          </div>

          {/* Tease — fades in on hover */}
          <motion.p
            animate={{ opacity: hovered ? 1 : 0.4, y: hovered ? 0 : 4 }}
            transition={{ duration: 0.3 }}
            className="text-sm text-text-secondary"
          >
            {tease}
          </motion.p>
        </motion.div>
      </Link>
    </motion.div>
  );
}
