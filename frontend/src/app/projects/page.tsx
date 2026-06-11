/**
 * /projects — magazine-layout index of project case studies.
 *
 * Server component: loads all projects at BUILD time via the Node-only
 * loader (gray-matter + remark + Zod), passes data to the index component.
 *
 * Per docs/design/LAYER3-PROJECTS.md.
 */
import { Nav } from "@/components/layer1/Nav";
import { ProjectsIndex } from "@/components/layer3/projects/ProjectsIndex";
import { loadAllProjects } from "@/lib/content/projects";

export const metadata = {
  title: "Projects",
  description:
    "Case studies of the systems I've built end-to-end — Prepzy, this portfolio, and more.",
};

export default async function ProjectsPage() {
  const projects = await loadAllProjects();

  return (
    <>
      <Nav />
      <ProjectsIndex projects={projects} />
    </>
  );
}
