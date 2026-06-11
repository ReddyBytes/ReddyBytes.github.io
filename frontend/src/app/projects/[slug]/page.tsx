/**
 * /projects/[slug] — dynamic case study page.
 *
 * Statically generated at build time:
 *   - generateStaticParams() returns every project slug (one HTML file each)
 *   - generateMetadata() supplies per-project SEO from frontmatter
 *   - The page itself server-renders Markdown to HTML via remark + injects
 *     into ProjectCaseStudy, which client-renders only the TOC + Mermaid
 *
 * Per docs/design/LAYER3-PROJECTS.md.
 */
import { notFound } from "next/navigation";

import { Nav } from "@/components/layer1/Nav";
import { ProjectCaseStudy } from "@/components/layer3/projects/ProjectCaseStudy";
import { loadAllProjects, loadProject } from "@/lib/content/projects";

interface PageProps {
  params: Promise<{ slug: string }>;
}

export async function generateStaticParams() {
  const projects = await loadAllProjects();
  return projects.map((p) => ({ slug: p.frontmatter.slug }));
}

export async function generateMetadata({ params }: PageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) return { title: "Project not found" };

  const fm = project.frontmatter;
  return {
    title: fm.title,
    description: fm.seo.description,
    openGraph: {
      title: fm.title,
      description: fm.seo.description,
      type: "article",
      url: `https://reddybytes.github.io/projects/${fm.slug}/`,
    },
    twitter: {
      card: "summary_large_image",
      title: fm.title,
      description: fm.seo.description,
    },
    alternates: {
      canonical: `https://reddybytes.github.io/projects/${fm.slug}/`,
    },
  };
}

export default async function ProjectPage({ params }: PageProps) {
  const { slug } = await params;
  const project = await loadProject(slug);
  if (!project) {
    notFound();
  }

  const allProjects = await loadAllProjects();

  // JSON-LD CreativeWork schema (recruiter SEO signal)
  const schema = {
    "@context": "https://schema.org",
    "@type": "CreativeWork",
    headline: project.frontmatter.title,
    description: project.frontmatter.seo.description,
    author: {
      "@type": "Person",
      name: "Penchala Reddy",
      url: "https://github.com/ReddyBytes",
    },
    url: `https://reddybytes.github.io/projects/${project.frontmatter.slug}/`,
    ...(project.frontmatter.links.github && {
      codeRepository: project.frontmatter.links.github,
    }),
    keywords: project.frontmatter.techStack.map((t) => t.name).join(", "),
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <ProjectCaseStudy project={project} allProjects={allProjects} />
    </>
  );
}
