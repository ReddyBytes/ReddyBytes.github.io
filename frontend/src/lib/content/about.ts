/**
 * About content loader.
 *
 * Reads content/about.md at BUILD time, parses frontmatter, validates with Zod.
 * No Markdown body rendering — all content lives in frontmatter.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";

import {
  AboutFrontmatter,
  type AboutFrontmatter as AboutFrontmatterType,
} from "@/lib/content/about-schema";

const CONTENT_PATH = path.join(process.cwd(), "..", "content", "about.md");

export async function loadAbout(): Promise<AboutFrontmatterType> {
  const raw = await fs.readFile(CONTENT_PATH, "utf8");
  const { data } = matter(raw);

  const parsed = AboutFrontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in content/about.md:\n${parsed.error.message}`,
    );
  }
  return parsed.data;
}
