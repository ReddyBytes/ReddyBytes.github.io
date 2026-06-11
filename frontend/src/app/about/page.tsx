import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "About",
  description: "The story so far — coming in v1.1.",
};

export default function AboutPage() {
  return (
    <ComingSoonPage
      title="KNOW THE BUILDER"
      tease="My engineering journey, what I'm building, what I'm learning, and what makes me different — beyond what fits on a resume."
    />
  );
}
