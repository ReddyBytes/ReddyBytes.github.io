/**
 * ImpactList — bullet list of impact statements per role.
 *
 * Triangle pointer + body text. Reusable for any 3-4 item bullet list.
 */
import { Triangle } from "lucide-react";

interface ImpactListProps {
  impact: readonly string[];
}

export function ImpactList({ impact }: ImpactListProps) {
  return (
    <ul className="flex flex-col gap-2.5">
      {impact.map((line) => (
        <li key={line} className="flex gap-2.5">
          <Triangle
            className="mt-1.5 h-2 w-2 shrink-0 rotate-90 text-accent-pink"
            aria-hidden="true"
          />
          <span className="text-sm leading-relaxed text-text-secondary sm:text-base">
            {line}
          </span>
        </li>
      ))}
    </ul>
  );
}
