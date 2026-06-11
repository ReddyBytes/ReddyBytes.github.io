/**
 * Skills content loader.
 *
 * Reads content/skills.md at BUILD time, parses + validates with Zod,
 * cross-references project slugs against loadAllProjects() so the popover
 * shows real project titles + URLs.
 *
 * Per docs/design/LAYER3-SKILLS.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import { loadAllProjects } from "@/lib/content/projects";
import {
  SkillsFrontmatter,
  type SkillEnriched,
  type SkillEntry,
  type SkillsFrontmatter as SkillsFrontmatterType,
} from "@/lib/content/skills-schema";

const CONTENT_PATH = path.join(process.cwd(), "..", "content", "skills.md");

async function readSkills(): Promise<SkillsFrontmatterType> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  const { data } = matter(raw);

  const parsed = SkillsFrontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/skills.md:\n${parsed.error.message}`,
    );
  }
  return parsed.data;
}

/** Load skills + enrich each with its real project titles. */
export async function loadSkills(): Promise<{
  techs: SkillEnriched[];
  seo: SkillsFrontmatterType["seo"];
}> {
  const [skillsData, projects] = await Promise.all([
    readSkills(),
    loadAllProjects(),
  ]);

  const projectBySlug = new Map(
    projects.map((p) => [p.frontmatter.slug, p.frontmatter.title]),
  );

  const techs: SkillEnriched[] = skillsData.techs.map((t: SkillEntry) => ({
    ...t,
    resolvedProjects: t.projects
      .map((slug) => {
        const title = projectBySlug.get(slug);
        return title ? { slug, title } : null;
      })
      .filter((x): x is { slug: string; title: string } => x !== null),
  }));

  // Sanity: exactly one center
  const centers = techs.filter((t) => t.isCenter);
  if (centers.length !== 1) {
    throw new Error(
      `content/skills.md must have exactly one tech with isCenter: true (found ${centers.length})`,
    );
  }

  return { techs, seo: skillsData.seo };
}
