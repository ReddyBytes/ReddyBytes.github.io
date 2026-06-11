/**
 * ChatPanel — chat UI that opens when the AI orb is tapped.
 *
 * Per LAYER2.md spec:
 *   - Greeting line + 6 suggested question chips + free-text input
 *   - Mocked responses for v1 from /ai-mocks.json (same shape as future RAG)
 *   - Streaming illusion: type response chars at 30ms via useTypewriter
 *   - 400px wide bottom-right panel; full-screen on mobile
 *   - Reduced motion: instant response, no typing animation
 */
"use client";

import { motion } from "framer-motion";
import { Send, Sparkles, X } from "lucide-react";
import { useEffect, useRef, useState, type KeyboardEvent } from "react";

import { useTypewriter } from "@/hooks/useTypewriter";
import { useReducedMotion } from "@/lib/motion/reducedMotion";
import {
  findById,
  loadMocks,
  matchByKeyword,
} from "@/lib/ai/mocks";
import type { MockData, MockQuestion } from "@/lib/ai/types";

interface ChatPanelProps {
  onClose: () => void;
}

interface ChatTurn {
  role: "user" | "assistant";
  text: string;
  sources?: string[];
}

export function ChatPanel({ onClose }: ChatPanelProps) {
  const [mocks, setMocks] = useState<MockData | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [turns, setTurns] = useState<ChatTurn[]>([]);
  const [pendingAnswer, setPendingAnswer] = useState<MockQuestion | null>(null);
  const [input, setInput] = useState("");
  const reducedMotion = useReducedMotion();
  const outputRef = useRef<HTMLDivElement>(null);

  // Lazy-load mocks on first open
  useEffect(() => {
    let cancelled = false;
    loadMocks()
      .then((m) => {
        if (!cancelled) setMocks(m);
      })
      .catch((e: Error) => {
        if (!cancelled) setError(e.message);
      });
    return () => {
      cancelled = true;
    };
  }, []);

  // Auto-scroll output on new turns
  useEffect(() => {
    outputRef.current?.scrollTo({
      top: outputRef.current.scrollHeight,
      behavior: reducedMotion ? "auto" : "smooth",
    });
  }, [turns, pendingAnswer, reducedMotion]);

  // Typewriter for the pending answer (one at a time)
  const { completedLines, currentLine, isDone } = useTypewriter({
    lines: pendingAnswer ? [pendingAnswer.answer] : [],
    charSpeed: 18,
    pauseBetweenLines: 0,
    pauseAtEnd: 0,
    instant: reducedMotion,
    onComplete: () => {
      if (pendingAnswer) {
        setTurns((prev) => [
          ...prev,
          {
            role: "assistant",
            text: pendingAnswer.answer,
            sources: pendingAnswer.sources,
          },
        ]);
        setPendingAnswer(null);
      }
    },
  });

  const ask = (question: MockQuestion, userText: string) => {
    setTurns((prev) => [...prev, { role: "user", text: userText }]);
    setPendingAnswer(question);
  };

  const handleChipClick = (id: string) => {
    if (!mocks) return;
    const q = findById(mocks, id);
    if (q) ask(q, q.text);
  };

  const handleSubmit = () => {
    if (!mocks || input.trim() === "" || pendingAnswer) return;
    const q = matchByKeyword(mocks, input);
    ask(q, input.trim());
    setInput("");
  };

  const handleKey = (e: KeyboardEvent<HTMLInputElement>) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      handleSubmit();
    }
  };

  return (
    <motion.div
      initial={{ opacity: 0, scale: 0.85, originX: 1, originY: 1 }}
      animate={{ opacity: 1, scale: 1 }}
      exit={{ opacity: 0, scale: 0.85 }}
      transition={{
        duration: reducedMotion ? 0 : 0.4,
        ease: [0.2, 0.8, 0.2, 1] as const,
      }}
      className="fixed inset-0 z-40 flex items-end justify-end p-0 sm:bottom-24 sm:right-6 sm:top-auto sm:p-0"
      role="dialog"
      aria-modal="true"
      aria-label="AI assistant chat panel"
    >
      {/* Mobile backdrop */}
      <button
        type="button"
        onClick={onClose}
        className="fixed inset-0 -z-10 bg-bg-base/80 sm:hidden"
        aria-label="Close chat"
      />

      <div
        className="flex h-[80vh] w-full flex-col overflow-hidden rounded-t-xl border border-border-subtle bg-bg-elevated shadow-2xl sm:h-[60vh] sm:max-h-[600px] sm:w-[400px] sm:rounded-xl"
        style={{
          background:
            "linear-gradient(180deg, rgba(15,15,36,0.98) 0%, rgba(8,8,26,0.98) 100%)",
          backdropFilter: "blur(20px)",
          boxShadow:
            "0 16px 48px rgba(0,0,0,0.6), 0 0 32px rgba(168,85,247,0.18)",
        }}
      >
        {/* Header */}
        <div className="flex items-center justify-between border-b border-border-subtle px-4 py-3">
          <div className="flex items-center gap-2">
            <Sparkles className="h-4 w-4 text-accent-pink-bright" />
            <span
              className="text-xs font-bold tracking-widest text-text-primary uppercase"
              style={{ fontFamily: "var(--font-mono)" }}
            >
              AI Assistant
            </span>
            <span className="rounded-full bg-accent-pink/15 px-2 py-0.5 text-[9px] font-medium tracking-widest text-accent-pink-bright uppercase">
              v1 mocks
            </span>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="grid h-7 w-7 place-items-center rounded text-text-tertiary hover:bg-bg-base hover:text-text-primary"
            aria-label="Close chat"
          >
            <X className="h-3.5 w-3.5" />
          </button>
        </div>

        {/* Output area */}
        <div
          ref={outputRef}
          className="flex-1 overflow-y-auto px-4 py-3"
        >
          {/* Greeting (always first) */}
          <div className="mb-3 rounded-lg border border-border-purple-faint bg-bg-base/40 p-3">
            <p
              className="text-sm leading-relaxed text-text-secondary"
              style={{ fontFamily: "var(--font-sans)" }}
            >
              <span className="text-accent-pink-bright">◊</span> Hi — I&apos;m
              Penchala&apos;s AI assistant. Ask me anything about his work,
              skills, or experience.
            </p>
          </div>

          {/* Suggested questions (chips) — only shown when no turns yet */}
          {turns.length === 0 && mocks && (
            <div className="mb-3 flex flex-col gap-2">
              <p className="px-1 text-[10px] font-medium tracking-widest text-text-tertiary uppercase">
                Try one of these
              </p>
              {mocks.questions.map((q) => (
                <button
                  key={q.id}
                  type="button"
                  onClick={() => handleChipClick(q.id)}
                  className="rounded-md border border-border-subtle bg-bg-base/40 px-3 py-2 text-left text-xs text-text-secondary transition-all hover:-translate-y-px hover:border-accent-cyan/60 hover:text-text-primary"
                >
                  {q.text}
                </button>
              ))}
            </div>
          )}

          {error && (
            <div className="rounded border border-red-500/40 bg-red-500/10 p-3 text-xs text-red-300">
              Failed to load mocks: {error}
            </div>
          )}

          {/* Past turns */}
          {turns.map((turn, i) => (
            <div
              key={i}
              className={`mb-3 ${turn.role === "user" ? "flex justify-end" : ""}`}
            >
              <div
                className={`max-w-[85%] rounded-lg p-3 text-sm leading-relaxed ${
                  turn.role === "user"
                    ? "bg-accent-cyan/15 text-text-primary"
                    : "bg-bg-base/40 text-text-secondary"
                }`}
              >
                {turn.text}
                {turn.sources && turn.sources.length > 0 && (
                  <div className="mt-2 flex flex-wrap gap-1.5">
                    {turn.sources.map((src) => (
                      <span
                        key={src}
                        className="rounded-full bg-accent-purple/15 px-2 py-0.5 text-[9px] tracking-wider text-accent-purple-bright"
                        style={{ fontFamily: "var(--font-mono)" }}
                      >
                        {src}
                      </span>
                    ))}
                  </div>
                )}
              </div>
            </div>
          ))}

          {/* Currently typing (pending answer) */}
          {pendingAnswer && !isDone && (
            <div className="mb-3 max-w-[85%] rounded-lg bg-bg-base/40 p-3 text-sm leading-relaxed text-text-secondary">
              {currentLine || completedLines.join(" ")}
              <span className="animate-blink ml-0.5 inline-block h-3 w-1.5 bg-accent-cyan align-middle" />
            </div>
          )}
        </div>

        {/* Input row */}
        <div className="flex items-center gap-2 border-t border-border-subtle bg-bg-base/40 px-3 py-2">
          <input
            type="text"
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKey}
            disabled={!mocks || !!pendingAnswer}
            placeholder={mocks ? "Ask anything..." : "Loading mocks..."}
            className="flex-1 bg-transparent text-sm text-text-primary outline-none placeholder:text-text-tertiary disabled:opacity-50"
            aria-label="Ask the AI assistant"
          />
          <button
            type="button"
            onClick={handleSubmit}
            disabled={!mocks || input.trim() === "" || !!pendingAnswer}
            className="grid h-8 w-8 place-items-center rounded text-accent-cyan transition-all hover:bg-accent-cyan/10 disabled:opacity-30"
            aria-label="Send question"
          >
            <Send className="h-3.5 w-3.5" />
          </button>
        </div>
      </div>
    </motion.div>
  );
}
