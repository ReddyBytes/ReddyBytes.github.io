/**
 * /skills — neural skill map page.
 *
 * Server component: loads skills + cross-links to projects at BUILD time.
 * SkillsMap (React Flow + Framer Motion) is lazy-loaded so other routes
 * don't pay its ~80KB bundle cost.
 *
 * Per docs/design/LAYER3-SKILLS.md.
 */
import dynamic from "next/dynamic";

import { Nav } from "@/components/layer1/Nav";
import { SkillsFallback } from "@/components/layer3/skills/SkillsFallback";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadSkills } from "@/lib/content/skills";

// React Flow is a heavy client-only widget — load on-demand.
const SkillsMap = dynamic(
  () =>
    import("@/components/layer3/skills/SkillsMap").then((m) => m.SkillsMap),
  { ssr: false },
);

export async function generateMetadata() {
  const skills = await loadSkills();
  return {
    title: skills.seo.title,
    description: skills.seo.description,
    openGraph: {
      title: skills.seo.title,
      description: skills.seo.description,
      type: "website",
      url: "https://reddybytes.github.io/skills/",
    },
    twitter: {
      card: "summary_large_image",
      title: skills.seo.title,
      description: skills.seo.description,
    },
    alternates: { canonical: "https://reddybytes.github.io/skills/" },
  };
}

export default async function SkillsPage() {
  const { techs, seo } = await loadSkills();

  // JSON-LD: list every tech as Person.knowsAbout
  const schema = {
    "@context": "https://schema.org",
    "@type": "Person",
    name: "Penchala Reddy",
    url: "https://github.com/ReddyBytes",
    knowsAbout: techs.map((t) => t.name),
    description: seo.description,
  };

  return (
    <>
      <Nav />
      <script
        type="application/ld+json"
        // eslint-disable-next-line react/no-danger
        dangerouslySetInnerHTML={{ __html: JSON.stringify(schema) }}
      />
      <main className="min-h-screen pt-16 pb-12">
        <PageHeader
          eyebrow="// skills"
          title="The stack I lean on"
          tagline="Python at the core. Backend systems and AI tooling around it. Drag the map, click a node to see real proof."
        />

        <section
          className="mx-auto max-w-7xl px-4 pb-16 sm:px-6 lg:px-8"
          aria-label="Interactive skill map"
        >
          <SkillsMap techs={techs} />
        </section>

        {/* Fallback / SEO-friendly text list */}
        <section
          className="mx-auto max-w-5xl px-4 pb-16 sm:px-6 lg:px-8"
          aria-label="Skills list (text view)"
        >
          <h2
            className="mb-4 text-xs font-bold tracking-widest text-text-tertiary uppercase"
            style={{ fontFamily: "var(--font-mono)" }}
          >
            // text view
          </h2>
          <SkillsFallback techs={techs} />
        </section>
      </main>
    </>
  );
}
