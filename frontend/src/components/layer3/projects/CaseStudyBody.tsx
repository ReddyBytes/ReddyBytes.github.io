/**
 * ArchitectureDiagram — renders Mermaid diagrams found in the case study body.
 *
 * The page server-renders the Markdown body to HTML via remark — Mermaid
 * fenced code blocks come out as <pre><code class="language-mermaid">...</code></pre>.
 * This component scans the rendered body, replaces each Mermaid block with
 * a rendered SVG diagram. Mermaid library lazy-loaded on first render.
 *
 * Per LAYER3-PROJECTS.md "Architecture diagrams" decision.
 *
 * Reduced motion: Mermaid renders are static (no edge animations) by default.
 */
"use client";

import { useEffect, useRef } from "react";

/**
 * Extracts mermaid code blocks from rendered HTML.
 * Returns { idx, code } pairs identifying their position.
 */
function extractMermaidBlocks(html: string): { code: string; index: number }[] {
  const blocks: { code: string; index: number }[] = [];
  // remark-html outputs: <pre><code class="language-mermaid">...code...</code></pre>
  const regex =
    /<pre><code class="language-mermaid">([\s\S]*?)<\/code><\/pre>/g;
  let match: RegExpExecArray | null;
  let i = 0;
  while ((match = regex.exec(html)) !== null) {
    const decoded = match[1]
      .replace(/&lt;/g, "<")
      .replace(/&gt;/g, ">")
      .replace(/&amp;/g, "&")
      .replace(/&quot;/g, '"');
    blocks.push({ code: decoded, index: i++ });
  }
  return blocks;
}

interface CaseStudyBodyProps {
  /** Server-rendered HTML from remark. */
  html: string;
}

export function CaseStudyBody({ html }: CaseStudyBodyProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const blocks = extractMermaidBlocks(html);

  // Replace mermaid <pre> blocks with placeholder divs we'll inject SVGs into.
  const htmlWithPlaceholders = html.replace(
    /<pre><code class="language-mermaid">[\s\S]*?<\/code><\/pre>/g,
    () => {
      const id = `mermaid-${Math.random().toString(36).slice(2, 9)}`;
      return `<div class="mermaid-host my-8 overflow-x-auto rounded-lg border border-border-subtle bg-bg-elevated p-4" data-mermaid-id="${id}"></div>`;
    },
  );

  useEffect(() => {
    if (!containerRef.current || blocks.length === 0) return;

    let cancelled = false;
    (async () => {
      const mermaid = (await import("mermaid")).default;
      mermaid.initialize({
        startOnLoad: false,
        theme: "dark",
        themeVariables: {
          background: "#0f0f24",
          primaryColor: "#1a1a3a",
          primaryTextColor: "#f5f5f7",
          primaryBorderColor: "#a855f7",
          lineColor: "#22d3ee",
          secondaryColor: "#7c3aed",
          tertiaryColor: "#08081a",
          fontFamily: "var(--font-mono), monospace",
          fontSize: "13px",
        },
      });

      const hosts =
        containerRef.current?.querySelectorAll<HTMLDivElement>(".mermaid-host");
      if (!hosts) return;

      for (let i = 0; i < hosts.length && i < blocks.length; i++) {
        if (cancelled) return;
        try {
          const { svg } = await mermaid.render(
            `mermaid-svg-${i}-${Date.now()}`,
            blocks[i].code,
          );
          if (!cancelled) hosts[i].innerHTML = svg;
        } catch (err) {
          // Render failed — show the raw code as fallback
          hosts[i].innerHTML = `<pre class="text-xs text-red-400">${
            err instanceof Error ? err.message : "Mermaid render failed"
          }</pre>`;
        }
      }
    })();

    return () => {
      cancelled = true;
    };
  }, [blocks]);

  return (
    <div
      ref={containerRef}
      // Tailwind typography-ish styles applied via className to scope to the body
      className="case-study-body prose prose-invert max-w-none"
      dangerouslySetInnerHTML={{ __html: htmlWithPlaceholders }}
    />
  );
}
