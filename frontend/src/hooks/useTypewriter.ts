/**
 * useTypewriter — types out a series of strings character by character.
 *
 * Used by BootSequence (LAYER1.md spec):
 *   - ~30ms per char
 *   - 200ms pause between lines
 *   - Final pause before completion callback
 *
 * Honors prefers-reduced-motion via the `instant` flag passed in by caller
 * (BootSequence component decides whether to skip entirely).
 *
 * Returns:
 *   - lines: completed lines so far + current partially-typed line
 *   - currentIndex: which line is currently typing (or lines.length if done)
 *   - isDone: all lines complete
 */
"use client";

import { useEffect, useState } from "react";

interface UseTypewriterOpts {
  lines: readonly string[];
  /** ms per character */
  charSpeed?: number;
  /** ms pause between lines */
  pauseBetweenLines?: number;
  /** ms pause after the LAST line before isDone flips true */
  pauseAtEnd?: number;
  /** Skip animation, return all lines instantly */
  instant?: boolean;
  /** Called when last line finishes + pauseAtEnd elapses */
  onComplete?: () => void;
}

export function useTypewriter({
  lines,
  charSpeed = 30,
  pauseBetweenLines = 200,
  pauseAtEnd = 800,
  instant = false,
  onComplete,
}: UseTypewriterOpts) {
  const [completedLines, setCompletedLines] = useState<string[]>([]);
  const [currentLine, setCurrentLine] = useState("");
  const [isDone, setIsDone] = useState(false);

  useEffect(() => {
    let cancelled = false;
    const timers: ReturnType<typeof setTimeout>[] = [];

    if (instant) {
      setCompletedLines([...lines]);
      setCurrentLine("");
      setIsDone(true);
      onComplete?.();
      return;
    }

    let lineIdx = 0;

    const typeNextLine = () => {
      if (cancelled) return;
      if (lineIdx >= lines.length) {
        const t = setTimeout(() => {
          if (cancelled) return;
          setIsDone(true);
          onComplete?.();
        }, pauseAtEnd);
        timers.push(t);
        return;
      }

      const line = lines[lineIdx];
      let charIdx = 0;

      const typeChar = () => {
        if (cancelled) return;
        if (charIdx <= line.length) {
          setCurrentLine(line.slice(0, charIdx));
          charIdx++;
          const t = setTimeout(typeChar, charSpeed);
          timers.push(t);
        } else {
          // Line done — commit to completed, advance after pause
          setCompletedLines((prev) => [...prev, line]);
          setCurrentLine("");
          lineIdx++;
          const t = setTimeout(typeNextLine, pauseBetweenLines);
          timers.push(t);
        }
      };

      typeChar();
    };

    typeNextLine();

    return () => {
      cancelled = true;
      timers.forEach(clearTimeout);
    };
  }, [lines, charSpeed, pauseBetweenLines, pauseAtEnd, instant, onComplete]);

  return { completedLines, currentLine, isDone };
}
