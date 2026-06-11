/**
 * SocialIcons — bottom-left of hero. GitHub + LinkedIn + email.
 *
 * Layer 1 component 5. Per LAYER1.md spec.
 * Pure server component, no interactivity.
 *
 * LinkedIn URL is a placeholder until user provides exact slug.
 */
import { Github, Linkedin, Mail } from "lucide-react";

const SOCIAL_LINKS = [
  {
    label: "GitHub",
    href: "https://github.com/ReddyBytes",
    Icon: Github,
    external: true,
  },
  {
    label: "LinkedIn",
    href: "https://www.linkedin.com/in/penchalareddy",
    Icon: Linkedin,
    external: true,
  },
  {
    label: "Email Penchala Reddy",
    href: "mailto:penchalareddy260@gmail.com",
    Icon: Mail,
    external: false,
  },
] as const;

export function SocialIcons() {
  return (
    <ul
      className="animate-fade-in-up flex items-center gap-4"
      style={{ animationDelay: "600ms" }}
    >
      {SOCIAL_LINKS.map(({ label, href, Icon, external }) => (
        <li key={label}>
          <a
            href={href}
            target={external ? "_blank" : undefined}
            rel={external ? "noopener noreferrer" : undefined}
            aria-label={label}
            className="grid h-10 w-10 place-items-center rounded-md border border-border-subtle text-text-tertiary transition-all duration-300 hover:-translate-y-0.5 hover:border-accent-cyan/60 hover:text-accent-cyan"
          >
            <Icon className="h-4 w-4" aria-hidden="true" />
          </a>
        </li>
      ))}
    </ul>
  );
}
