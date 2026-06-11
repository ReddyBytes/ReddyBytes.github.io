import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Architecture Lab",
  description: "Systems I've designed — coming in v1.1.",
};

export default function ArchitectureLabPage() {
  return (
    <ComingSoonPage
      title="EXPLORE THE LAB"
      tease="Interactive architecture diagrams — Airflow DAGs, Kubernetes clusters, API flows, RAG pipelines. Click any node to dive in."
    />
  );
}
