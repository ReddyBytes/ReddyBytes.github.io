/**
 * Experience page schema (Zod).
 *
 * All experience content lives in frontmatter as an array of roles.
 * Per docs/design/LAYER3-EXPERIENCE.md.
 */
import { z } from "zod";

export const RoleEntry = z.object({
  company: z.string().min(1),
  title: z.string().min(1),
  location: z.string().min(1),
  /** Year (or year-month like "2024-01"). */
  start: z.string().min(1),
  /** Empty string = current role. */
  end: z.string(),
  current: z.boolean(),
  impact: z.array(z.string().min(1)).min(1).max(6),
  techStack: z.array(z.string().min(1)).min(1),
});
export type RoleEntry = z.infer<typeof RoleEntry>;

export const ExperienceFrontmatter = z.object({
  roles: z.array(RoleEntry).min(1),
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});
export type ExperienceFrontmatter = z.infer<typeof ExperienceFrontmatter>;
