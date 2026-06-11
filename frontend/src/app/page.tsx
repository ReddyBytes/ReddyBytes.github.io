/**
 * Landing page — Layer 1 (top of the 3-layer experience model).
 *
 * Composition:
 *   - <Nav>         top navigation bar (sticky)
 *   - <Layer1Hero>  client orchestrator: BootSequence + Hero + PullThread
 *   - <ScrollHint>  bottom scroll affordance (fixed, fades on scroll)
 *
 * Per docs/design/LAYER1.md spec.
 *
 * Server component — only `<Layer1Hero>` is interactive (client),
 * keeping the rest of the page server-rendered for SEO + perf.
 */
import { Layer1Hero } from "@/components/layer1/Layer1Hero";
import { Nav } from "@/components/layer1/Nav";
import { ScrollHint } from "@/components/layer1/ScrollHint";

export default function Home() {
  return (
    <>
      <Nav />
      <Layer1Hero />
      <ScrollHint />
    </>
  );
}
