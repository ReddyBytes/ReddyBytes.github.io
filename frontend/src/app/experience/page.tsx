/**
 * /experience — work history page.
 *
 * Server component: loads experience content at BUILD time, passes to
 * ExperienceTimeline (which maps to client RoleCard for stagger animation).
 *
 * Per docs/design/LAYER3-EXPERIENCE.md.
 */
import { Nav } from "@/components/layer1/Nav";
import { ExperienceTimeline } from "@/components/layer3/experience/ExperienceTimeline";
import { PageHeader } from "@/components/shared/PageHeader";
import { loadExperience } from "@/lib/content/experience";

export async function generateMetadata() {
  const exp = await loadExperience();
  return {
    title: exp.seo.title,
    description: exp.seo.description,
    openGraph: {
      title: exp.seo.title,
      description: exp.seo.description,
      type: "profile",
      url: "https://reddybytes.github.io/experience/",
    },
    twitter: {
      card: "summary_large_image",
      title: exp.seo.title,
      description: exp.seo.description,
    },
    alternates: { canonical: "https://reddybytes.github.io/experience/" },
  };
}

export default async function ExperiencePage() {
  const exp = await loadExperience();

  // JSON-LD ProfilePage + Person with workHistory (one OrganizationRole per role)
  const schema = {
    "@context": "https://schema.org",
    "@type": "ProfilePage",
    mainEntity: {
      "@type": "Person",
      name: "Penchala Reddy",
      url: "https://github.com/ReddyBytes",
      jobTitle: exp.roles[0]?.title,
      worksFor: exp.roles[0]
        ? {
            "@type": "Organization",
            name: exp.roles[0].company,
          }
        : undefined,
      hasOccupation: exp.roles.map((r) => ({
        "@type": "OrganizationRole",
        roleName: r.title,
        startDate: r.start,
        ...(r.end ? { endDate: r.end } : {}),
        memberOf: {
          "@type": "Organization",
          name: r.company,
        },
      })),
    },
    url: "https://reddybytes.github.io/experience/",
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
          eyebrow="// experience"
          title="Where I've worked"
          tagline="Real systems, real teams, real production weight."
        />
        <ExperienceTimeline roles={exp.roles} />
      </main>
    </>
  );
}
