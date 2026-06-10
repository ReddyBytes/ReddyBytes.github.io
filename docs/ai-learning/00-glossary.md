# Glossary

Every term used across the AI learning files, defined in plain English. Skim once now, return when you hit an unfamiliar word in any concept file.

---

### AI (Artificial Intelligence)
A computer program that does things normally requiring human thinking — answering questions, writing text, recognizing images.

### LLM (Large Language Model)
A specific kind of AI that reads and writes text. Examples: ChatGPT, Claude (by Anthropic), Gemini (by Google), GPT-4 (by OpenAI). When you type into ChatGPT, the LLM reads what you wrote and writes a reply. "Large" because they have billions of parameters and are trained on huge amounts of text.

### Model
Any trained AI program. Different models do different things — some write text (LLMs), some create images (DALL-E), some convert text to vectors (embedding models).

### Embedding model
A specialized model whose only job is to convert TEXT into a list of NUMBERS that represents the meaning. We use embedding models so we can compare meanings of texts mathematically (instead of by keyword matching).

### Vector
Just a list of numbers. Example: `[0.5, -0.2, 0.8]` is a 3-number vector. Our embeddings are 384-number vectors. Vectors can be thought of as coordinates in N-dimensional space.

### Embedding
The output of an embedding model — the vector representation of some piece of text.

### Training
How an AI model learns. The model is shown millions of examples until it figures out patterns. Done once before we use the model; we don't re-train at runtime.

### Inference
Running a trained model to get an output. When you ask ChatGPT a question, ChatGPT is doing inference (generating text using its trained knowledge).

### Hallucination
When an LLM makes up facts that sound real but aren't. E.g., if you ask Claude "What did Penchala do at Google?" and Penchala never worked at Google, the LLM might INVENT a fake job with fake dates and fake projects. This is the main problem we want to prevent.

### Token
A chunk of text the LLM works with. Roughly: 1 token ≈ 0.75 English words. "Hello world" = 2 tokens. "internationalization" = ~3 tokens. LLMs have token limits (e.g., Gemini Flash handles 1 million tokens at once; smaller models cap at 4-8k).

### Context window
The maximum number of tokens an LLM can read in one request. Gemini 2.5 Flash = 1M tokens. Claude Haiku = 200K. Older GPT-3.5 = 4K. Larger context windows let us stuff more retrieved chunks into a RAG prompt.

### RAG (Retrieval-Augmented Generation)
The technique we're learning. Instead of asking the LLM blind, we first FETCH relevant facts from our own documents, then PASS those facts to the LLM along with the question, so it can answer with grounded truth instead of guesses.

### Cosine similarity
A math formula that tells you "how similar are these two vectors?" Returns a number from -1 to 1. We use it to find which stored embeddings are most similar to the user's question embedding.

### Chunk
A small piece of a document. We split long docs into chunks (200-500 tokens each) so the embedding model can handle them and so retrieval can return precise context, not whole files.

### Chunking strategy
The rule we use to split docs into chunks. Options include: fixed-size (every N characters), sliding window (overlap chunks), semantic (split on headings), hierarchical (parent + child chunks).

### Vector DB / Vector database
A database designed to store vectors and answer "give me the closest N vectors to this one" really fast — in milliseconds, even across millions of vectors.

### FAISS (Facebook AI Similarity Search)
The specific vector database we use. It's a library, not a server — runs in-memory inside our Python process. Persists as a single file (`data/faiss_index.bin`). Free, fast, no external service needed.

### ANN (Approximate Nearest Neighbor)
A trick FAISS uses for speed. Instead of comparing the query vector to EVERY stored vector (slow at scale), it uses clever indexing to find "probably-the-closest" matches very fast. Trades exactness for speed. For portfolio-size content (100s of chunks), the loss in accuracy is negligible.

### Top-k retrieval
"Give me the K closest matches" — e.g., top-3 means return the 3 most similar chunks. Standard pattern in RAG.

### MMR (Maximal Marginal Relevance)
A retrieval strategy that picks chunks that are BOTH relevant to the query AND different from each other. Avoids returning 3 nearly-identical chunks just because they all matched well.

### Re-ranking
A second retrieval pass with a more accurate (but slower) model. Common pattern: retrieve top-20 with a fast embedding-based search, then re-rank to top-5 with a cross-encoder.

### Cross-encoder
A specialized model that takes a (query, chunk) pair and returns a relevance score directly. More accurate than embedding-based similarity but slower (must process each pair, can't batch the same way).

### Prompt
The text we send to an LLM. Has structure: a SYSTEM prompt (instructions for how to behave), CONTEXT (the retrieved chunks), and the USER prompt (the actual question).

### System prompt
The instructions we give the LLM about HOW to behave. Example: "You are Penchala's AI assistant. Answer concisely using only the provided context. Cite sources."

### Few-shot examples
Including 2-3 example (question, answer) pairs in the prompt to teach the LLM the answer style we want. Massively improves consistency.

### Streaming response
The LLM emits tokens one at a time as it generates, rather than waiting until the full answer is ready. The frontend displays tokens as they arrive (the typing effect you see in ChatGPT). Better UX than blocking on a 5-second wait.

### SSE (Server-Sent Events)
The HTTP mechanism we use to stream LLM responses from the FastAPI backend to the Next.js frontend. One-way server-to-client streaming over a single HTTP connection.

### Grounding
The practice of making the LLM answer ONLY from provided context, not from its general training knowledge. Reduces hallucination. Enforced via system prompt instructions like "If the context doesn't contain the answer, say so."

### P@k (Precision at k)
A retrieval quality metric. "P@1" = was the TOP-1 retrieved chunk correct? "P@3" = was the correct chunk in the top 3? Higher = better retrieval quality.

### Recall@k
"Of all correct chunks, what percentage appeared in top-k?" Different from P@k — recall measures completeness, precision measures correctness.

### Eval set
A set of questions with KNOWN correct answers, used to measure RAG quality. We hand-build 30 realistic recruiter questions + manually identify which chunks should be returned, then measure P@k after every tuning change.

### Rate limiting
Capping how many requests a single user (IP) can make per minute / day. Prevents abuse of free LLM tiers. We use `slowapi` (a FastAPI rate-limiter).

### Cold start
The delay when a sleeping service wakes up. Hugging Face Spaces free tier sleeps after 48h inactivity; waking takes 15-30s. The frontend must show "AI assistant is waking up..." UX so recruiters don't bounce.

### Plug-and-play (in our RAG context)
Every layer (embedding model, vector DB, LLM, knowledge loader) implemented behind an interface so we can swap implementations without changing business logic. E.g., swap `sentence-transformers` for OpenAI embeddings = change one adapter file, not the pipeline.

---

## Style note

When a term you're reading anywhere in `docs/ai-learning/` is unfamiliar, search this glossary first. If it's missing here, ask for it to be added.
