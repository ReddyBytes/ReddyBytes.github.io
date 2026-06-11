/**
 * Experience content loader.
 *
 * Reads content/experience.md at BUILD time, parses frontmatter, validates with Zod.
 * Per docs/design/LAYER3-EXPERIENCE.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {
  ExperienceFrontmatter,
  type ExperienceFrontmatter as ExperienceFrontmatterType,
} from "@/lib/content/experience-schema";

const CONTENT_PATH = path.join(
  process.cwd(),
  "..",
  "content",
  "experience.md",
);

export async function loadExperience(): Promise<ExperienceFrontmatterType> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  const { data } = matter(raw);

  const parsed = ExperienceFrontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/experience.md:\n${parsed.error.message}`,
    );
  }
  return parsed.data;
}
