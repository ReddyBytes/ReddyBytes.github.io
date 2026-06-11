/**
 * ContactCTA — big bottom contact section with email/GitHub/LinkedIn pills.
 *
 * Per docs/design/LAYER3-ABOUT.md.
 * Pure server component, no client interactivity.
 */
import { Github, Linkedin, Mail } from "lucide-react";

import type { ContactSection } from "@/lib/content/about-schema";

interface ContactCTAProps {
  contact: ContactSection;
}

export function ContactCTA({ contact }: ContactCTAProps) {
  const pills = [
    {
      label: "Email",
      href: `mailto:${contact.email}`,
      detail: contact.email,
      Icon: Mail,
      external: false,
    },
    {
      label: "GitHub",
      href: contact.github,
      detail: "@ReddyBytes",
      Icon: Github,
      external: true,
    },
    {
      label: "LinkedIn",
      href: contact.linkedin,
      detail: "Connect on LinkedIn",
      Icon: Linkedin,
      external: true,
    },
  ];

  return (
    <section
      id="contact"
      className="mx-auto max-w-5xl px-4 py-16 sm:px-6 sm:py-24 lg:px-8"
      aria-label="Contact"
    >
      <header className="mb-8 text-center">
        <p
          className="mb-2 text-[10px] font-bold tracking-widest text-accent-pink-bright uppercase"
          style={{ fontFamily: "var(--font-mono)" }}
        >
          // contact
        </p>
        <h2
          className="text-3xl font-bold tracking-tight text-text-primary sm:text-4xl"
          style={{ fontFamily: "var(--font-display)" }}
        >
          Let&apos;s talk
        </h2>
        <p className="mx-auto mt-3 max-w-xl text-sm text-text-secondary sm:text-base">
          {contact.intro}
        </p>
      </header>

      <nav aria-label="Contact methods">
        <ul className="flex flex-col items-stretch gap-3 sm:flex-row sm:justify-center sm:gap-4">
          {pills.map(({ label, href, detail, Icon, external }) => (
            <li key={label}>
              <a
                href={href}
                target={external ? "_blank" : undefined}
                rel={external ? "noopener noreferrer" : undefined}
                className="group flex items-center gap-3 rounded-lg border border-border-subtle bg-bg-elevated px-5 py-3 transition-all hover:-translate-y-1 hover:border-transparent"
                style={{
                  background:
                    "linear-gradient(135deg, rgba(15,15,36,1) 0%, rgba(8,8,26,1) 100%)",
                }}
              >
                <Icon
                  className="h-5 w-5 text-accent-cyan transition-colors group-hover:text-accent-pink-bright"
                  aria-hidden="true"
                />
                <span className="flex flex-col">
                  <span className="text-[10px] font-bold tracking-widest text-text-tertiary uppercase"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {label}
                  </span>
                  <span className="text-sm font-medium text-text-primary">
                    {detail}
                  </span>
                </span>
              </a>
            </li>
          ))}
        </ul>
      </nav>

      <p
        className="mt-8 text-center text-xs text-text-tertiary"
        style={{ fontFamily: "var(--font-mono)" }}
      >
        // typically respond within 24h
      </p>
    </section>
  );
}
