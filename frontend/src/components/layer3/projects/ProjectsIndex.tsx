/**
 * ProjectsIndex — magazine layout for /projects.
 *
 * Per LAYER3-PROJECTS.md spec:
 *   - 1 featured project (large card on top)
 *   - 1 secondary project (smaller card below)
 *   - Server component — receives projects array, no client interactivity
 */
import { FeaturedProjectCard } from "@/components/layer3/projects/FeaturedProjectCard";
import { SecondaryProjectCard } from "@/components/layer3/projects/SecondaryProjectCard";
import { PageHeader } from "@/components/shared/PageHeader";
import type { Project } from "@/lib/content/project-schema";

interface ProjectsIndexProps {
  projects: Project[];
}

export function ProjectsIndex({ projects }: ProjectsIndexProps) {
  const featured = projects.find((p) => p.frontmatter.featured);
  const secondaries = projects.filter((p) => !p.frontmatter.featured);

  return (
    <main className="min-h-screen pt-16">
      <PageHeader
        eyebrow="// shipped"
        title="See My Work"
        tagline="Real systems. Real users. Real code on GitHub."
      />

      <section
        className="mx-auto flex max-w-7xl flex-col gap-8 px-4 pb-24 sm:px-6 lg:px-8"
        aria-label="Project case studies"
      >
        {featured && <FeaturedProjectCard project={featured.frontmatter} />}
        {secondaries.map((p) => (
          <SecondaryProjectCard key={p.frontmatter.slug} project={p.frontmatter} />
        ))}

        {projects.length === 0 && (
          <div className="rounded-lg border border-border-subtle bg-bg-elevated p-12 text-center">
            <p className="text-text-secondary">
              No projects published yet. Check back soon.
            </p>
          </div>
        )}
      </section>
    </main>
  );
}
