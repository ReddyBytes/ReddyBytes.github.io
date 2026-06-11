import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Projects",
  description: "What I've shipped end-to-end — coming in v1.1.",
};

export default function ProjectsPage() {
  return (
    <ComingSoonPage
      title="SEE MY WORK"
      tease="Deep-dive case studies of every project I've shipped — problem, architecture, tech, contribution, outcome, GitHub source."
    />
  );
}
