/**
 * Root layout — fonts, metadata, html shell.
 *
 * Fonts (per LAYER1.md typography spec):
 *   - Inter (body, role line, descriptions, nav)
 *   - JetBrains Mono (terminal, system status, scroll hint)
 *   - Space Grotesk (display — the hero name)
 *
 * Metadata (per SKILL.md SEO rules):
 *   - One <h1> per page (HeroCopy renders it)
 *   - OG image, Twitter card
 *   - JSON-LD Person schema (recruiters' search engines parse this for rich results)
 *   - Canonical URL
 */
import type { Metadata } from "next";
import { Inter, JetBrains_Mono, Space_Grotesk } from "next/font/google";
import "./globals.css";

const inter = Inter({
  variable: "--font-inter",
  subsets: ["latin"],
  display: "swap",
});

const jetbrainsMono = JetBrains_Mono({
  variable: "--font-jetbrains-mono",
  subsets: ["latin"],
  display: "swap",
});

const spaceGrotesk = Space_Grotesk({
  variable: "--font-space-grotesk",
  subsets: ["latin"],
  display: "swap",
  weight: ["400", "500", "600", "700"],
});

export const metadata: Metadata = {
  metadataBase: new URL("https://reddybytes.github.io"),
  title: {
    default: "Penchala Reddy — Software Engineer · AI Engineer · Python Backend",
    template: "%s — Penchala Reddy",
  },
  description:
    "I build intelligent backend systems and AI-powered solutions that solve real-world problems at scale. Python, FastAPI, Airflow, Kubernetes, RAG systems.",
  keywords: [
    "Penchala Reddy",
    "Software Engineer",
    "AI Engineer",
    "Python",
    "FastAPI",
    "Kubernetes",
    "Airflow",
    "RAG",
    "Backend Developer",
    "Portfolio",
  ],
  authors: [{ name: "Penchala Reddy", url: "https://github.com/ReddyBytes" }],
  creator: "Penchala Reddy",
  openGraph: {
    type: "website",
    url: "https://reddybytes.github.io",
    title: "Penchala Reddy — Software Engineer · AI Engineer",
    description:
      "Building intelligent backend systems and AI-powered solutions that solve real-world problems at scale.",
    siteName: "Penchala Reddy Portfolio",
  },
  twitter: {
    card: "summary_large_image",
    title: "Penchala Reddy — Software Engineer · AI Engineer",
    description:
      "Building intelligent backend systems and AI-powered solutions at scale.",
  },
  robots: { index: true, follow: true },
  alternates: { canonical: "https://reddybytes.github.io" },
};

const personSchema = {
  "@context": "https://schema.org",
  "@type": "Person",
  name: "Penchala Reddy",
  url: "https://reddybytes.github.io",
  email: "penchalareddy260@gmail.com",
  jobTitle: "Software Engineer · AI Engineer · Python Backend Developer",
  sameAs: [
    "https://github.com/ReddyBytes",
    "https://www.linkedin.com/in/penchalareddy",
  ],
  knowsAbout: [
    "Python",
    "FastAPI",
    "Apache Airflow",
    "Kubernetes",
    "Retrieval-Augmented Generation",
    "Large Language Models",
    "System Design",
    "Backend Engineering",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${inter.variable} ${jetbrainsMono.variable} ${spaceGrotesk.variable} antialiased`}
    >
      <body className="min-h-screen flex flex-col">
        <script
          type="application/ld+json"
          // eslint-disable-next-line react/no-danger
          dangerouslySetInnerHTML={{ __html: JSON.stringify(personSchema) }}
        />
        {children}
      </body>
    </html>
  );
}
