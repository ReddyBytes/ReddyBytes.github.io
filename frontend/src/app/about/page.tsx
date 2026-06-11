/**
 * /about — personal page about Penchala.
 *
 * Server component: loads about content at BUILD time, passes to client
 * components for the animated sections (timeline reveal, learning bars).
 *
 * Per docs/design/LAYER3-ABOUT.md.
 */
import { Nav } from "@/components/layer1/Nav";
import { AboutHero } from "@/components/layer3/about/AboutHero";
import { ContactCTA } from "@/components/layer3/about/ContactCTA";
import { CurrentlyBuilding } from "@/components/layer3/about/CurrentlyBuilding";
import { JourneyTimeline } from "@/components/layer3/about/JourneyTimeline";
import { LearningWall } from "@/components/layer3/about/LearningWall";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadAbout } from "@/lib/content/about";

export async function generateMetadata() {
  const about = await loadAbout();
  return {
    title: about.seo.title,
    description: about.seo.description,
    openGraph: {
      title: about.seo.title,
      description: about.seo.description,
      type: "profile",
      url: "https://reddybytes.github.io/about/",
    },
    twitter: {
      card: "summary_large_image",
      title: about.seo.title,
      description: about.seo.description,
    },
    alternates: { canonical: "https://reddybytes.github.io/about/" },
  };
}

export default async function AboutPage() {
  const about = await loadAbout();

  // JSON-LD AboutPage schema (recruiter SEO signal)
  const schema = {
    "@context": "https://schema.org",
    "@type": "AboutPage",
    mainEntity: {
      "@type": "Person",
      name: "Penchala Reddy",
      url: "https://github.com/ReddyBytes",
      email: about.contact.email,
      sameAs: [about.contact.github, about.contact.linkedin],
      description: about.seo.description,
    },
    url: "https://reddybytes.github.io/about/",
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
          eyebrow="// about"
          title="Know the builder"
          tagline="A working engineer who learns and builds in public."
        />
        <AboutHero hero={about.hero} />
        <JourneyTimeline milestones={about.journey} />
        <CurrentlyBuilding items={about.building} />
        <LearningWall items={about.learning} />
        <ContactCTA contact={about.contact} />
      </main>
    </>
  );
}
