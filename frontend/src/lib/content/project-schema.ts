/**
 * Project case study frontmatter schema (Zod).
 *
 * Validated at build time when content/projects/*.md is loaded.
 * Build fails with a clear error if any project file violates the schema.
 *
 * Per docs/design/LAYER3-PROJECTS.md "Content schema" section.
 */
import { z } from "zod";

export const ProjectStatus = z.enum(["production", "beta", "wip", "retired"]);
export type ProjectStatus = z.infer<typeof ProjectStatus>;

export const ProjectTech = z.object({
  name: z.string().min(1),
  primary: z.boolean().optional(),
});
export type ProjectTech = z.infer<typeof ProjectTech>;

export const ProjectMetric = z.object({
  value: z.string().min(1),
  label: z.string().min(1),
});
export type ProjectMetric = z.infer<typeof ProjectMetric>;

export const ProjectLinks = z.object({
  live: z.string().url().optional(),
  github: z.string().url().optional(),
  docs: z.string().url().optional(),
});
export type ProjectLinks = z.infer<typeof ProjectLinks>;

export const ProjectFrontmatter = z.object({
  slug: z.string().min(1).regex(/^[a-z0-9-]+$/, "slug must be kebab-case"),
  title: z.string().min(1),
  tagline: z.string().min(1),
  featured: z.boolean().default(false),
  order: z.number().int().positive(),
  status: ProjectStatus,
  role: z.string().min(1),
  period: z.string().min(1),
  heroImage: z.string().startsWith("/"),
  techStack: z.array(ProjectTech).min(1),
  metrics: z.array(ProjectMetric).default([]),
  links: ProjectLinks,
  seo: z.object({ description: z.string().min(1) }),
});

export type ProjectFrontmatter = z.infer<typeof ProjectFrontmatter>;

/** Full project = parsed frontmatter + rendered HTML body. */
export interface Project {
  frontmatter: ProjectFrontmatter;
  /** Rendered HTML body (Markdown body sans frontmatter, via remark). */
  bodyHtml: string;
  /** Raw Markdown body before HTML rendering (used to extract sections). */
  bodyMd: string;
}
