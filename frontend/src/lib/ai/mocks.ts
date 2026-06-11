/**
 * AI mocks loader — fetches /ai-mocks.json (served from frontend/public/)
 * and provides keyword matching for free-text input.
 *
 * v1: mocked responses from JSON. The same shape will be returned by
 * /api/v1/ask when the FastAPI RAG backend ships — swap fetch URL only.
 *
 * Why fetch (not import): keeps mocks out of the JS bundle entirely.
 * The 6KB JSON loads lazily on first orb open.
 */
import type { MockData, MockQuestion } from "@/lib/ai/types";

const DEFAULT_FALLBACK = {
  id: "fallback",
  text: "",
  audience: "recruiter" as const,
  answer:
    "Great question — I'm still learning to answer that one. Try one of the suggestions above, or explore the section cards to find what you're looking for.",
};

let cache: MockData | null = null;

/** Lazy-load mocks on first call; subsequent calls return cached data. */
export async function loadMocks(): Promise<MockData> {
  if (cache) return cache;
  const res = await fetch("/ai-mocks.json", { cache: "force-cache" });
  if (!res.ok) {
    throw new Error(`Failed to load AI mocks: ${res.status}`);
  }
  cache = (await res.json()) as MockData;
  return cache;
}

/** Find a mock answer by exact id (used when clicking a suggested question). */
export function findById(
  mocks: MockData,
  id: string,
): MockQuestion | undefined {
  return mocks.questions.find((q) => q.id === id);
}

/**
 * Match free-text input to a mock answer via simple keyword overlap.
 *
 * Strategy: tokenize input (lowercase, alphanumeric only), score each mock
 * by counting tokens that appear in its `text` + first 200 chars of `answer`.
 * Highest scorer wins if score >= 2; otherwise return generic fallback.
 *
 * Simple but good enough for the v1 mock experience. Real RAG replaces this.
 */
export function matchByKeyword(
  mocks: MockData,
  input: string,
): MockQuestion {
  const tokens = input
    .toLowerCase()
    .replace(/[^a-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter((t) => t.length > 2); // ignore stopwords-ish (the, a, is, etc.)

  if (tokens.length === 0) {
    return DEFAULT_FALLBACK;
  }

  let bestScore = 0;
  let best: MockQuestion | undefined;

  for (const q of mocks.questions) {
    const haystack = (
      q.text.toLowerCase() +
      " " +
      q.answer.toLowerCase().slice(0, 200)
    ).replace(/[^a-z0-9\s]/g, " ");

    let score = 0;
    for (const token of tokens) {
      if (haystack.includes(token)) score++;
    }
    if (score > bestScore) {
      bestScore = score;
      best = q;
    }
  }

  return bestScore >= 2 && best ? best : DEFAULT_FALLBACK;
}
