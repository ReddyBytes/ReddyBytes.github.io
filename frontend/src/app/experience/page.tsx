import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Experience",
  description: "Where I've worked + grown — coming in v1.1.",
};

export default function ExperiencePage() {
  return (
    <ComingSoonPage
      title="TRACE MY PATH"
      tease="A timeline of where I've worked, the systems I've owned, and how I've grown from village to engineer to AI builder."
    />
  );
}
