/**
 * ProjectCaseStudy — orchestrator for /projects/[slug] pages.
 *
 * Composes:
 *   - <ProjectHero>     hero image + title + metadata + CTAs
 *   - <CaseStudyToc>    sticky left TOC (desktop only)
 *   - <CaseStudyBody>   server-rendered HTML with Mermaid diagrams hydrated
 *   - <ProjectFooter>   prev/next nav
 *
 * Mixed server/client: most of the page is server-rendered; only TOC and
 * Mermaid blocks are client components (interactive).
 */
import { CaseStudyBody } from "@/components/layer3/projects/CaseStudyBody";
import { CaseStudyToc } from "@/components/layer3/projects/CaseStudyToc";
import { ProjectFooter } from "@/components/layer3/projects/ProjectFooter";
import { ProjectHero } from "@/components/layer3/projects/ProjectHero";
import { extractSections } from "@/lib/content/projects";
import type { Project } from "@/lib/content/project-schema";

interface ProjectCaseStudyProps {
  project: Project;
  /** Used for prev/next footer. */
  allProjects: Project[];
}

export function ProjectCaseStudy({
  project,
  allProjects,
}: ProjectCaseStudyProps) {
  const sections = extractSections(project.bodyMd);

  // Find neighbors in the ordered project list (wraps around)
  const idx = allProjects.findIndex(
    (p) => p.frontmatter.slug === project.frontmatter.slug,
  );
  const prev =
    allProjects[(idx - 1 + allProjects.length) % allProjects.length];
  const next = allProjects[(idx + 1) % allProjects.length];

  return (
    <main className="min-h-screen pt-16 pb-12">
      <ProjectHero project={project.frontmatter} />

      <div className="mx-auto mt-16 grid max-w-7xl grid-cols-1 gap-12 px-4 sm:px-6 lg:grid-cols-[200px_1fr] lg:gap-16 lg:px-8">
        <CaseStudyToc sections={sections} />

        <article className="max-w-3xl">
          <CaseStudyBody html={project.bodyHtml} />
        </article>
      </div>

      <ProjectFooter
        prevSlug={prev.frontmatter.slug}
        prevTitle={prev.frontmatter.title}
        nextSlug={next.frontmatter.slug}
        nextTitle={next.frontmatter.title}
      />
    </main>
  );
}
