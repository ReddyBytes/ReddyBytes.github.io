/**
 * useTerminal — state machine for the Layer 2 interactive terminal.
 *
 * Owns command history, output lines, and input value.
 * Wraps lib/terminal/commands.ts runCommand for executing typed input.
 *
 * Side effects (opening external links) are handled in the consumer
 * component, because window.open requires browser context.
 */
"use client";

import { useCallback, useState } from "react";

import { runCommand, type CommandAction } from "@/lib/terminal/commands";

export interface TerminalLine {
  /** Whether this is a user-typed command (with prompt) or a command response. */
  kind: "prompt" | "response";
  text: string;
}

export function useTerminal() {
  const [lines, setLines] = useState<TerminalLine[]>([
    {
      kind: "response",
      text: "PENCHALA-OS v1.0.0 · Type 'help' to begin.",
    },
  ]);
  const [input, setInput] = useState("");
  const [history, setHistory] = useState<string[]>([]);
  const [historyIdx, setHistoryIdx] = useState(-1);

  const submit = useCallback(
    (raw: string) => {
      const trimmed = raw.trim();
      if (trimmed === "") return;

      // Echo the user's input as a prompt line
      const promptLine: TerminalLine = { kind: "prompt", text: trimmed };

      const action: CommandAction = runCommand(trimmed);

      if (action.kind === "clear") {
        setLines([]);
      } else if (action.kind === "openLink") {
        if (typeof window !== "undefined") {
          window.open(action.url, "_blank", "noopener,noreferrer");
        }
        setLines((prev) => [
          ...prev,
          promptLine,
          ...action.lines.map(
            (text): TerminalLine => ({ kind: "response", text }),
          ),
        ]);
      } else {
        setLines((prev) => [
          ...prev,
          promptLine,
          ...action.lines.map(
            (text): TerminalLine => ({ kind: "response", text }),
          ),
        ]);
      }

      // Save to history (skip duplicates of the last entry)
      setHistory((prev) =>
        prev[prev.length - 1] === trimmed ? prev : [...prev, trimmed],
      );
      setHistoryIdx(-1);
      setInput("");
    },
    [],
  );

  /** ↑ / ↓ arrow history navigation. */
  const historyUp = useCallback(() => {
    if (history.length === 0) return;
    const nextIdx =
      historyIdx === -1
        ? history.length - 1
        : Math.max(0, historyIdx - 1);
    setHistoryIdx(nextIdx);
    setInput(history[nextIdx] ?? "");
  }, [history, historyIdx]);

  const historyDown = useCallback(() => {
    if (history.length === 0 || historyIdx === -1) return;
    const nextIdx = historyIdx + 1;
    if (nextIdx >= history.length) {
      setHistoryIdx(-1);
      setInput("");
    } else {
      setHistoryIdx(nextIdx);
      setInput(history[nextIdx] ?? "");
    }
  }, [history, historyIdx]);

  return {
    lines,
    input,
    setInput,
    submit,
    historyUp,
    historyDown,
  };
}
