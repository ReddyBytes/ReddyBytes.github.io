/**
 * Skills page schema (Zod).
 *
 * Per docs/design/LAYER3-SKILLS.md. Backend + AI only (no frontend stack).
 */
import { z } from "zod";

export const SkillCategory = z.enum(["language", "systems", "ai"]);
export type SkillCategory = z.infer<typeof SkillCategory>;

export const SkillEntry = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  name: z.string().min(1),
  category: SkillCategory,
  /** Exactly ONE skill in the array should have isCenter=true (the hub node). */
  isCenter: z.boolean().default(false),
  years: z.string().min(1),
  confidence: z.string().min(1),
  /** Project slugs this skill is demonstrated in. Loader cross-links these. */
  projects: z.array(z.string().min(1)).default([]),
  /** Other tech slugs to draw an edge to (besides automatic center→tech edges). */
  connects: z.array(z.string().min(1)).default([]),
});
export type SkillEntry = z.infer<typeof SkillEntry>;

export const SkillsFrontmatter = z.object({
  techs: z.array(SkillEntry).min(2),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});
export type SkillsFrontmatter = z.infer<typeof SkillsFrontmatter>;

/** Enriched skill = SkillEntry + resolved project titles for cross-linking. */
export interface SkillEnriched extends SkillEntry {
  resolvedProjects: { slug: string; title: string }[];
}
