/**
 * Landing page — composes Layer 1 (always loaded) + Layer 2 (lazy-loaded).
 *
 * Layer 2 is dynamically imported so its bundle doesn't load until needed
 * (recruiter starts scrolling or clicks ENTER THE SYSTEM). This keeps the
 * Layer 1 first-paint budget under 100KB gzip per LAYER1.md spec.
 *
 * Per docs/design/LAYER1.md + docs/design/LAYER2.md.
 */
import dynamic from "next/dynamic";

import { Layer1Hero } from "@/components/layer1/Layer1Hero";
import { Nav } from "@/components/layer1/Nav";
import { ScrollHint } from "@/components/layer1/ScrollHint";

// Lazy-load Layer 2 (Framer Motion + 6 components) to protect Layer 1 bundle.
// ssr: false because Layer 2 components use 'use client' interactivity.
const Layer2Dashboard = dynamic(
  () =>
    import("@/components/layer2/Layer2Dashboard").then(
      (m) => m.Layer2Dashboard,
    ),
  { ssr: false },
);

export default function Home() {
  return (
    <>
      <Nav />
      <Layer1Hero />
      <Layer2Dashboard />
      <ScrollHint />
    </>
  );
}
