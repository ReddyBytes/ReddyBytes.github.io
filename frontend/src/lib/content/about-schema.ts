/**
 * About page frontmatter schema (Zod).
 *
 * All About content lives in frontmatter (no Markdown body needed) so
 * components can render structured sections without parsing prose.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 */
import { z } from "zod";

export const BuildingStatus = z.enum(["live", "beta", "learning", "shipped"]);
export type BuildingStatus = z.infer<typeof BuildingStatus>;

export const AboutHero = z.object({
  greeting: z.string().min(1),
  tagline: z.string().min(1),
  photo: z.string().startsWith("/"),
  paragraphs: z.array(z.string().min(1)).min(1).max(5),
});
export type AboutHero = z.infer<typeof AboutHero>;

export const JourneyMilestone = z.object({
  year: z.string().min(1),
  title: z.string().min(1),
  body: z.string().min(1),
});
export type JourneyMilestone = z.infer<typeof JourneyMilestone>;

export const BuildingItem = z.object({
  slug: z.string().min(1),
  title: z.string().min(1),
  status: BuildingStatus,
  description: z.string().min(1),
  href: z.string().min(1),
});
export type BuildingItem = z.infer<typeof BuildingItem>;

export const LearningItem = z.object({
  topic: z.string().min(1),
  progress: z.number().int().min(0).max(100),
  link: z.string().optional(),
});
export type LearningItem = z.infer<typeof LearningItem>;

export const ContactSection = z.object({
  intro: z.string().min(1),
  email: z.string().email(),
  github: z.string().url(),
  linkedin: z.string().url(),
});
export type ContactSection = z.infer<typeof ContactSection>;

export const AboutFrontmatter = z.object({
  hero: AboutHero,
  journey: z.array(JourneyMilestone).min(3),
  building: z.array(BuildingItem).min(1).max(6),
  learning: z.array(LearningItem).min(3).max(10),
  contact: ContactSection,
  seo: z.object({
    title: z.string().min(1),
    description: z.string().min(1),
  }),
});
export type AboutFrontmatter = z.infer<typeof AboutFrontmatter>;
