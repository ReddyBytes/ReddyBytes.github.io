/**
 * Terminal — collapsed pill button → expanded interactive terminal panel.
 *
 * Per LAYER2.md spec:
 *   - Collapsed: bottom-left button "> open terminal"
 *   - Expanded: 600x360 panel with mono UI, command history, free input
 *   - 12 commands incl. 4 easter eggs
 *   - History navigation: ↑/↓ arrows
 *   - Mobile: expanded state becomes full-screen modal
 *   - Reduced motion: instant expand/collapse, no typing animation
 *
 * State + commands handled by useTerminal hook (which calls runCommand).
 */
"use client";

import { AnimatePresence, motion } from "framer-motion";
import { Minimize2, TerminalIcon, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { useTerminal } from "@/hooks/useTerminal";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import { SUGGESTED_COMMANDS } from "@/lib/terminal/commands";

export function Terminal() {
  const [expanded, setExpanded] = useState(false);
  const { lines, input, setInput, submit, historyUp, historyDown } =
    useTerminal();
  const reducedMotion = useReducedMotion();
  const outputRef = useRef<HTMLDivElement>(null);
  const inputRef = useRef<HTMLInputElement>(null);

  // Auto-scroll terminal output to bottom on new lines
  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [lines, reducedMotion]);

  // Focus input when expanded
  useEffect(() => {
    if (expanded) inputRef.current?.focus();
  }, [expanded]);

  // Esc to close
  useEffect(() => {
    if (!expanded) return;
    const onKey = (e: globalThis.KeyboardEvent) => {
      if (e.key === "Escape") setExpanded(false);
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [expanded]);

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter") {
      e.preventDefault();
      submit(input);
    } else if (e.key === "ArrowUp") {
      e.preventDefault();
      historyUp();
    } else if (e.key === "ArrowDown") {
      e.preventDefault();
      historyDown();
    }
  };

  return (
    <>
      {/* Collapsed pill button */}
      {!expanded && (
        <button
          type="button"
          onClick={() => setExpanded(true)}
          className="group fixed bottom-6 left-6 z-30 inline-flex items-center gap-2 rounded-md border border-border-subtle bg-bg-elevated/90 px-4 py-2 text-xs font-medium text-text-secondary backdrop-blur transition-all hover:-translate-y-0.5 hover:border-accent-cyan/60 hover:text-accent-cyan"
          style={{ fontFamily: "var(--font-mono)" }}
          aria-label="Open interactive terminal"
        >
          <TerminalIcon className="h-3.5 w-3.5" />
          <span>open terminal</span>
          <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 bg-accent-cyan align-middle" />
        </button>
      )}

      <AnimatePresence>
        {expanded && (
          <motion.div
            initial={{ opacity: 0, scale: 0.92, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.92, y: 20 }}
            transition={{
              duration: reducedMotion ? 0 : 0.35,
              ease: [0.2, 0.8, 0.2, 1] as const,
            }}
            className="fixed inset-0 z-40 grid place-items-end p-4 sm:bottom-6 sm:left-6 sm:right-auto sm:top-auto sm:p-0"
            role="dialog"
            aria-modal="true"
            aria-label="Interactive terminal"
          >
            {/* Mobile backdrop */}
            <button
              type="button"
              onClick={() => setExpanded(false)}
              className="fixed inset-0 -z-10 bg-bg-base/80 sm:hidden"
              aria-label="Close terminal"
            />

            <div
              className="flex h-[60vh] w-full flex-col overflow-hidden rounded-lg border border-border-subtle bg-bg-elevated shadow-2xl sm:h-[360px] sm:w-[600px]"
              style={{
                background:
                  "linear-gradient(180deg, rgba(15,15,36,0.98) 0%, rgba(8,8,26,0.98) 100%)",
                backdropFilter: "blur(20px)",
                boxShadow:
                  "0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(168,85,247,0.15)",
              }}
            >
              {/* Title bar */}
              <div className="flex items-center justify-between border-b border-border-subtle px-3 py-2">
                <div className="flex items-center gap-2">
                  <div className="flex gap-1.5">
                    <span className="h-2.5 w-2.5 rounded-full bg-red-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-yellow-500/70" />
                    <span className="h-2.5 w-2.5 rounded-full bg-green-500/70" />
                  </div>
                  <span
                    className="ml-2 text-[11px] text-text-tertiary"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    PENCHALA-OS · v1.0.0
                  </span>
                </div>
                <div className="flex gap-1">
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="grid h-6 w-6 place-items-center rounded text-text-tertiary hover:bg-bg-base hover:text-text-primary"
                    aria-label="Minimize terminal"
                  >
                    <Minimize2 className="h-3 w-3" />
                  </button>
                  <button
                    type="button"
                    onClick={() => setExpanded(false)}
                    className="grid h-6 w-6 place-items-center rounded text-text-tertiary hover:bg-bg-base hover:text-text-primary sm:hidden"
                    aria-label="Close terminal"
                  >
                    <X className="h-3 w-3" />
                  </button>
                </div>
              </div>

              {/* Output area */}
              <div
                ref={outputRef}
                className="flex-1 overflow-y-auto px-4 py-3 text-[12px] leading-relaxed"
                style={{ fontFamily: "var(--font-mono)" }}
              >
                {lines.map((line, i) => (
                  <div
                    key={i}
                    className={
                      line.kind === "prompt"
                        ? "text-accent-cyan-bright"
                        : "whitespace-pre text-text-secondary"
                    }
                  >
                    {line.kind === "prompt" ? "> " : ""}
                    {line.text}
                  </div>
                ))}
              </div>

              {/* Suggested commands chips (mobile keyboard helper) */}
              <div className="flex gap-2 overflow-x-auto border-t border-border-subtle px-3 py-2 sm:hidden">
                {SUGGESTED_COMMANDS.map((cmd) => (
                  <button
                    key={cmd}
                    type="button"
                    onClick={() => submit(cmd)}
                    className="shrink-0 rounded border border-border-subtle px-2 py-1 text-[10px] text-text-secondary"
                    style={{ fontFamily: "var(--font-mono)" }}
                  >
                    {cmd}
                  </button>
                ))}
              </div>

              {/* Input row */}
              <div className="flex items-center gap-2 border-t border-border-subtle bg-bg-base/40 px-4 py-2">
                <span
                  className="text-accent-cyan"
                  style={{ fontFamily: "var(--font-mono)" }}
                >
                  &gt;
                </span>
                <input
                  ref={inputRef}
                  type="text"
                  value={input}
                  onChange={(e) => setInput(e.target.value)}
                  onKeyDown={handleKey}
                  className="flex-1 bg-transparent text-[12px] text-text-primary outline-none placeholder:text-text-tertiary"
                  style={{ fontFamily: "var(--font-mono)" }}
                  placeholder="Type 'help' to start..."
                  aria-label="Terminal input"
                  autoComplete="off"
                  autoCorrect="off"
                  spellCheck={false}
                />
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
