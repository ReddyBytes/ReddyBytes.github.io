/**
 * Terminal command registry — 12 commands per LAYER2.md spec.
 *
 * Each command is a pure function: receives optional args, returns output lines.
 * Side effects (opening links, clearing output) are signaled via a typed
 * action discriminant on the return value — Terminal component decides what
 * to actually do with it.
 *
 * Easter eggs: deploy engineer, hire now, kubectl get projects, python --skills.
 */

export type CommandAction =
  | { kind: "print"; lines: string[] }
  | { kind: "clear" }
  | { kind: "openLink"; url: string; lines: string[] };

interface Command {
  name: string;
  description: string;
  handler: (args: string[]) => CommandAction;
}

// === Helpers ===
const helpLines = (cmds: Command[]) => [
  "AVAILABLE COMMANDS",
  "",
  ...cmds.map(
    (c) => `  ${c.name.padEnd(24, " ")} ${c.description}`,
  ),
  "",
  "Tip: try `deploy engineer` :)",
];

// === Command registry — order matters for `help` output ===
const REGISTRY: Command[] = [
  {
    name: "help",
    description: "List all commands",
    handler: () => ({ kind: "print", lines: helpLines(REGISTRY) }),
  },
  {
    name: "whoami",
    description: "Identity check",
    handler: () => ({
      kind: "print",
      lines: [
        "penchala_reddy@portfolio:~$ Software Engineer · AI Engineer",
        "                            · Python Backend Developer",
      ],
    }),
  },
  {
    name: "about",
    description: "Quick intro",
    handler: () => ({
      kind: "print",
      lines: [
        "Penchala Reddy — building intelligent backend systems and",
        "AI-powered solutions that solve real-world problems at scale.",
        "Strong in Python, Airflow, Kubernetes, RAG. Learning AI deeply.",
      ],
    }),
  },
  {
    name: "projects",
    description: "List shipped projects",
    handler: () => ({
      kind: "print",
      lines: [
        "SHIPPED PROJECTS",
        "",
        "  1. prepzy           Govt exam prep platform (production)",
        "                      Python · FastAPI · PostgreSQL · K8s · RAG",
        "                      → github.com/ReddyBytes/prepzy-app",
        "",
        "  2. portfolio        This site (you are here)",
        "                      Next.js · FastAPI · sentence-transformers",
        "                      → github.com/ReddyBytes/ReddyBytes.github.io",
        "",
        "  Type `kubectl get projects` for the K8s-style view.",
      ],
    }),
  },
  {
    name: "skills",
    description: "Skills grouped by category",
    handler: () => ({
      kind: "print",
      lines: [
        "SKILLS",
        "",
        "  Languages         Python (5+ yr) · TypeScript · SQL",
        "  Backend           FastAPI · Airflow · Pydantic · async Python",
        "  Infra             Kubernetes · Docker · AWS · Linux",
        "  AI / ML           RAG · LangChain · sentence-transformers · FAISS",
        "  Frontend          Next.js · React · Tailwind",
        "  Databases         PostgreSQL · Redis",
        "",
        "  Type `python --skills` for the Python view.",
      ],
    }),
  },
  {
    name: "github",
    description: "Open GitHub profile",
    handler: () => ({
      kind: "openLink",
      url: "https://github.com/ReddyBytes",
      lines: ["→ Opening github.com/ReddyBytes ..."],
    }),
  },
  {
    name: "resume",
    description: "Get the resume PDF",
    handler: () => ({
      kind: "print",
      lines: [
        "Resume is coming in v1.1 :)",
        "For now: explore the Projects section above,",
        "or email penchalareddy260@gmail.com.",
      ],
    }),
  },
  {
    name: "clear",
    description: "Clear the terminal output",
    handler: () => ({ kind: "clear" }),
  },
  // === Easter eggs ===
  {
    name: "deploy engineer",
    description: "(easter egg)",
    handler: () => ({
      kind: "print",
      lines: [
        "",
        "         |",
        "        / \\",
        "       /___\\",
        "      |=   =|",
        "      |  P  |",
        "      |  R  |",
        "      |     |",
        "     /|##!##|\\",
        "    / |##!##| \\",
        "   /  |##!##|  \\",
        "  /   |##!##|   \\",
        " /    |##!##|    \\",
        "      `---^---`",
        "",
        "  🚀 Candidate deployment successful.",
        "  Reply at penchalareddy260@gmail.com.",
        "",
      ],
    }),
  },
  {
    name: "hire now",
    description: "(easter egg)",
    handler: () =>
      REGISTRY.find((c) => c.name === "deploy engineer")!.handler([]),
  },
  {
    name: "kubectl get projects",
    description: "(easter egg)",
    handler: () => ({
      kind: "print",
      lines: [
        "NAME         READY   STATUS    RESTARTS   AGE   LANG",
        "prepzy       1/1     Running   0          1y    python",
        "portfolio    1/1     Running   0          1d    typescript",
        "",
        "  2 projects, both green :)",
      ],
    }),
  },
  {
    name: "python --skills",
    description: "(easter egg)",
    handler: () => ({
      kind: "print",
      lines: [
        ">>> import penchala",
        ">>> penchala.skills.python",
        "{",
        "  'core':       ['async', 'typing', 'asyncio', 'pydantic'],",
        "  'web':        ['fastapi', 'starlette', 'uvicorn'],",
        "  'data':       ['airflow', 'pandas', 'sqlalchemy'],",
        "  'ai':         ['sentence-transformers', 'faiss', 'langchain'],",
        "  'years':      5,",
        "  'production': True,",
        "}",
      ],
    }),
  },
];

/** Look up a command by typed input (handles multi-word commands too). */
export function runCommand(input: string): CommandAction {
  const trimmed = input.trim().toLowerCase();
  if (trimmed === "") {
    return { kind: "print", lines: [] };
  }

  // Try longest-match first so multi-word commands like "deploy engineer" win
  // over a one-word "deploy" that doesn't exist.
  const sorted = [...REGISTRY].sort((a, b) => b.name.length - a.name.length);
  const match = sorted.find((c) => trimmed === c.name);

  if (!match) {
    return {
      kind: "print",
      lines: [
        `command not found: ${input}`,
        `Type 'help' for the list of commands.`,
      ],
    };
  }
  const args = trimmed.split(/\s+/).slice(match.name.split(/\s+/).length);
  return match.handler(args);
}

/** Used by Terminal greeting + suggested-commands chip row. */
export const SUGGESTED_COMMANDS = [
  "help",
  "projects",
  "skills",
  "deploy engineer",
] as const;
