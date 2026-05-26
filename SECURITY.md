# Security Policy

## Supported Versions

This is a personal portfolio website. Only the currently deployed version (`main` branch on GitHub Pages + the live FastAPI backend on Hugging Face Spaces) is supported. Older commits, branches, or forks are not patched.

## Components in scope

| Component | URL | Stack |
|-----------|-----|-------|
| Frontend | `https://reddybytes.github.io` (custom domain TBD) | Next.js static export on GitHub Pages |
| Backend (AI assistant) | `https://reddybytes-portfolio-rag.hf.space` | FastAPI + sentence-transformers + FAISS + Gemini on Hugging Face Spaces |

## Reporting a Vulnerability

If you discover a security vulnerability, please **DO NOT** open a public GitHub issue, pull request, or discussion.

Instead, report it **privately via email**:

**📧 penchalareddy260@gmail.com**

Subject line: `[SECURITY] <short description>`

### Include in your report

1. **Description** — what the vulnerability is
2. **Affected component** — frontend, backend, or both
3. **Steps to reproduce** — exact sequence (curl commands, browser steps, payloads)
4. **Impact** — what an attacker could do
5. **Suggested fix** — if you have one
6. **Your name + GitHub handle** — for credit in the security advisory (optional)

### What happens next

| Timeline | Action |
|----------|--------|
| Within **24 hours** | Initial acknowledgment of receipt |
| Within **7 days** | Reproduction confirmation + severity assessment (CVSS 3.1) |
| Within **30 days** | Fix deployed (sooner if Critical/High severity) |
| After fix | Public security advisory published (with your credit) |

## In scope

- **Frontend**: XSS, CSRF, clickjacking, secrets accidentally committed to the repo, dependency vulnerabilities
- **Backend**: Prompt injection / jailbreak on the RAG endpoint, rate-limit bypass, server-side request forgery, data exfiltration from FAISS index, unauthenticated access to admin endpoints
- **Infrastructure**: Secrets in build logs, misconfigured GitHub Actions, HF Space exposing internal state
- **Supply chain**: Compromised dependencies not yet caught by Dependabot

## Out of scope

- Social engineering of the maintainer
- Physical attacks
- Spam or brute-force on the contact form (rate-limited, considered nuisance not vulnerability)
- Issues requiring physical access to the maintainer's devices
- Self-XSS (requires victim to paste code into console)
- Theoretical attacks without a working proof-of-concept
- Missing security headers that don't lead to a concrete vulnerability

## Responsible Disclosure

We follow **responsible disclosure**:
- Give us a reasonable window to fix before public disclosure (default: 30 days; longer if severity warrants)
- Coordinate the disclosure timeline with us
- Do not exploit the vulnerability beyond what is needed to demonstrate it
- Do not access, modify, or delete data belonging to others
- Do not perform attacks that degrade service for other users (DoS, etc.)

## Hall of Fame

Responsible security researchers who help improve the security of this project will be credited here (with permission):

*(empty — be the first!)*

---

Thank you for helping keep this project and its visitors secure.
