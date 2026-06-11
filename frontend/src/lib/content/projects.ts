/**
 * Project content loader.
 *
 * Reads content/projects/*.md files at BUILD time (via Node.js fs).
 * Parses frontmatter with gray-matter, validates with Zod, renders body
 * to HTML with remark + remark-html.
 *
 * Static-export-safe: all I/O happens at build time inside server components
 * or generateStaticParams(). Never imported into a 'use client' component.
 *
 * Per docs/design/LAYER3-PROJECTS.md.
 */
import fs from "node:fs/promises";
import path from "node:path";

import matter from "gray-matter";
import { remark } from "remark";
import remarkHtml from "remark-html";

import {
  ProjectFrontmatter,
  type Project,
} from "@/lib/content/project-schema";

/** Resolve content/projects/ relative to the repo root (frontend/ is a subdir). */
const CONTENT_DIR = path.join(process.cwd(), "..", "content", "projects");

/** Render Markdown to safe HTML via remark. */
async function renderMarkdown(md: string): Promise<string> {
  const file = await remark().use(remarkHtml).process(md);
  let html = String(file);

  // remark-html doesn't auto-add IDs to headings — inject them so the
  // sticky TOC can scroll to each H2 by anchor. Mirrors extractSections().
  html = html.replace(
    /<h2>([^<]+)<\/h2>/g,
    (_, label: string) => {
      const id = label
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      return `<h2 id="${id}">${label}</h2>`;
    },
  );

  return html;
}

/** Read + parse + validate a single project Markdown file. */
async function loadOne(filename: string): Promise<Project> {
  const fullPath = path.join(CONTENT_DIR, filename);
  const raw = await fs.readFile(fullPath, "utf8");
  const { data, content } = matter(raw);

  const parsed = ProjectFrontmatter.safeParse(data);
  if (!parsed.success) {
    throw new Error(
      `Invalid frontmatter in ${filename}:\n${parsed.error.message}`,
    );
  }

  // Slug in frontmatter must match filename (without .md) — fail loud.
  const expectedSlug = filename.replace(/\.md$/, "");
  if (parsed.data.slug !== expectedSlug) {
    throw new Error(
      `Slug mismatch in ${filename}: frontmatter says "${parsed.data.slug}" but filename implies "${expectedSlug}"`,
    );
  }

  const bodyHtml = await renderMarkdown(content);

  return {
    frontmatter: parsed.data,
    bodyHtml,
    bodyMd: content,
  };
}

/** Load all projects, sorted by `order` ascending. */
export async function loadAllProjects(): Promise<Project[]> {
  let filenames: string[];
  try {
    filenames = await fs.readdir(CONTENT_DIR);
  } catch (err) {
    // No content/projects/ folder yet — return empty list, don't crash build.
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return [];
    throw err;
  }

  const projects = await Promise.all(
    filenames
      .filter((f) => f.endsWith(".md") && !f.startsWith("_"))
      .map(loadOne),
  );

  return projects.sort((a, b) => a.frontmatter.order - b.frontmatter.order);
}

/** Load a single project by slug. Throws if not found (caller catches for 404). */
export async function loadProject(slug: string): Promise<Project | null> {
  try {
    return await loadOne(`${slug}.md`);
  } catch (err) {
    if ((err as NodeJS.ErrnoException).code === "ENOENT") return null;
    throw err;
  }
}

/**
 * Extract H2 sections from body Markdown for the sticky TOC.
 * Returns ordered [{ id, label }] where id = slugified label.
 */
export function extractSections(bodyMd: string): { id: string; label: string }[] {
  const lines = bodyMd.split("\n");
  const sections: { id: string; label: string }[] = [];
  for (const line of lines) {
    const match = line.match(/^##\s+(.+)$/);
    if (match) {
      const label = match[1].trim();
      const id = label
        .toLowerCase()
        .replace(/[^a-z0-9\s-]/g, "")
        .replace(/\s+/g, "-");
      sections.push({ id, label });
    }
  }
  return sections;
}
