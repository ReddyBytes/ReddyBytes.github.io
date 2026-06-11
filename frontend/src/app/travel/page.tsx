import { ComingSoonPage } from "@/components/shared/ComingSoonPage";

export const metadata = {
  title: "Travel",
  description: "Life beyond code — coming in v1.1.",
};

export default function TravelPage() {
  return (
    <ComingSoonPage
      title="WANDER WITH ME"
      tease="An interactive world map of places I've explored. Click a glowing node to see photos, stories, and what I learned."
    />
  );
}
