/**
 * SkillNode — custom React Flow node for a single tech.
 *
 * Per docs/design/LAYER3-SKILLS.md:
 *   - Center node (Python) renders larger with bright halo
 *   - Category-colored gradient border (cyan/purple/pink)
 *   - Hover/tap → expands, popover appears via SkillPopover
 *   - Reduced motion: no scale-on-hover
 */
"use client";

import { Handle, Position, type NodeProps } from "@xyflow/react";
import { useState } from "react";

import { SkillPopover } from "@/components/layer3/skills/SkillPopover";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import type { SkillEnriched } from "@/lib/content/skills-schema";

const CATEGORY_BORDER: Record<SkillEnriched["category"], string> = {
  language:
    "linear-gradient(135deg, #22d3ee 0%, #67e8f9 100%)",
  systems:
    "linear-gradient(135deg, #a855f7 0%, #c084fc 100%)",
  ai:
    "linear-gradient(135deg, #ec4899 0%, #f472b6 100%)",
};

export interface SkillNodeData extends Record<string, unknown> {
  skill: SkillEnriched;
}

export function SkillNode({ data, selected }: NodeProps) {
  const [hovered, setHovered] = useState(false);
  const reducedMotion = useReducedMotion();
  const skill = (data as SkillNodeData).skill;

  const isCenter = skill.isCenter;
  const expanded = hovered || selected;

  const size = isCenter
    ? { width: 140, height: 80 }
    : { width: 110, height: 56 };

  return (
    <div
      role="button"
      tabIndex={0}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
      onFocus={() => setHovered(true)}
      onBlur={() => setHovered(false)}
      className="relative grid place-items-center rounded-xl"
      style={{
        ...size,
        background: CATEGORY_BORDER[skill.category],
        padding: 1.5,
        transform: expanded && !reducedMotion ? "scale(1.08)" : undefined,
        transition: reducedMotion ? undefined : "transform 240ms cubic-bezier(0.2, 0.8, 0.2, 1)",
        cursor: "pointer",
        boxShadow: isCenter
          ? "0 0 28px rgba(168, 85, 247, 0.55), 0 0 8px rgba(34, 211, 238, 0.4) inset"
          : expanded
          ? `0 0 18px ${
              skill.category === "language"
                ? "rgba(34,211,238,0.5)"
                : skill.category === "systems"
                ? "rgba(168,85,247,0.5)"
                : "rgba(236,72,153,0.5)"
            }`
          : "0 4px 12px rgba(0,0,0,0.4)",
      }}
      aria-label={`${skill.name} — ${skill.years} years`}
    >
      <Handle
        type="target"
        position={Position.Top}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
        style={{ opacity: 0 }}
      />

      <div
        className="grid h-full w-full place-items-center rounded-xl px-3"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,36,0.94) 0%, rgba(8,8,26,0.94) 100%)",
        }}
      >
        <span
          className="text-center text-xs font-semibold tracking-wide text-text-primary"
          style={{
            fontFamily: "var(--font-mono)",
            fontSize: isCenter ? "0.95rem" : "0.75rem",
          }}
        >
          {skill.name}
        </span>
      </div>

      <Handle
        type="source"
        position={Position.Bottom}
        className="!h-1.5 !w-1.5 !border-0 !bg-transparent"
        style={{ opacity: 0 }}
      />

      <SkillPopover skill={skill} visible={expanded} />
    </div>
  );
}
