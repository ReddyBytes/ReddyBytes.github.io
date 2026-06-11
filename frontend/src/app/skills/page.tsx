import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Skills",
  description: "What I know deeply — coming in v1.1.",
};

export default function SkillsPage() {
  return (
    <ComingSoonPage
      title="CHECK MY STACK"
      tease="A neural map of my skills. Python is the central node — hover anything to see related projects and proof."
    />
  );
}
