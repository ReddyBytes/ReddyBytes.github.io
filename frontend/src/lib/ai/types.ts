/**
 * AI mocks types — shape of the mocked Q&A pairs used by the AI orb in v1.
 *
 * IMPORTANT: this shape mirrors what the real /api/v1/ask backend endpoint
 * will return. When backend RAG ships, we swap the loader from fetching
 * /ai-mocks.json to calling the FastAPI endpoint — components don't change.
 *
 * Per docs/design/LAYER2.md "Mocked AI orb response strategy" decision.
 */

export type Audience =
  | "recruiter"
  | "showcase"
  | "personal-brand"
  | "freelance"
  | "skill-deep";

export interface MockQuestion {
  /** Stable slug — used to match user clicks to canned answers. */
  id: string;
  /** Text shown on the suggested question chip. */
  text: string;
  /** Primary audience this question targets. */
  audience: Audience;
  /** Mocked answer body (markdown allowed but rendered as plain text in v1). */
  answer: string;
  /** Source files this answer is grounded in (recruiter trust signal). */
  sources?: string[];
}

export interface MockData {
  questions: MockQuestion[];
}
