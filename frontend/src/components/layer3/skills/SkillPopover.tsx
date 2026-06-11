/**
 * SkillPopover — hover/tap popover anchored to a tech node.
 *
 * Per docs/design/LAYER3-SKILLS.md:
 *   - Tech name + years badge + confidence statement + project links
 *   - Renders inside the React Flow viewport using xyflow's NodeToolbar
 *
 * NodeToolbar handles positioning + auto-hide on outside click.
 */
"use client";

import { NodeToolbar, Position } from "@xyflow/react";
import Link from "next/link";

import type { SkillEnriched } from "@/lib/content/skills-schema";

interface SkillPopoverProps {
  skill: SkillEnriched;
  visible: boolean;
}

export function SkillPopover({ skill, visible }: SkillPopoverProps) {
  return (
    <NodeToolbar
      isVisible={visible}
      position={Position.Top}
      offset={12}
      className="!pointer-events-auto z-50"
    >
      <div
        className="w-72 rounded-lg border border-accent-cyan/40 bg-bg-elevated p-4 shadow-2xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,36,0.98) 0%, rgba(8,8,26,0.98) 100%)",
          backdropFilter: "blur(12px)",
        }}
      >
        <div className="mb-2 flex items-baseline justify-between gap-2">
          <h4
            className="text-base font-semibold text-text-primary"
            style={{ fontFamily: "var(--font-display)" }}
          >
            {skill.name}
          </h4>
          <span
            className="rounded-full border border-accent-cyan/50 bg-accent-cyan/10 px-2 py-0.5 text-[10px] font-semibold tracking-widest text-accent-cyan uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            {skill.years} {skill.years.match(/\d/) ? "yr" : ""}
          </span>
        </div>

        <p className="text-xs leading-relaxed text-text-secondary">
          {skill.confidence}
        </p>

        {skill.resolvedProjects.length > 0 && (
          <div className="mt-3 border-t border-border-subtle pt-3">
            <p
              className="mb-1.5 text-[9px] font-bold tracking-widest text-text-tertiary uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              Used in
            </p>
            <ul className="flex flex-wrap gap-1.5">
              {skill.resolvedProjects.map((p) => (
                <li key={p.slug}>
                  <Link
                    href={`/projects/${p.slug}/`}
                    className="inline-flex items-center gap-1 rounded-full border border-border-subtle bg-bg-base/40 px-2 py-0.5 text-[10px] font-medium text-accent-purple-bright transition-colors hover:border-accent-purple-bright/60 hover:text-text-primary"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {p.title.length > 22 ? `${p.title.slice(0, 22)}…` : p.title}
                  </Link>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </NodeToolbar>
  );
}
