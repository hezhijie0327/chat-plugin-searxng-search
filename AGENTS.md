# AGENTS.md

chat-plugin-searxng-search is a LobeChat plugin that provides metasearch through a self-hosted SearXNG instance. See [README.md](README.md) for setup and usage.

## HANDOVER.md

When a multi-step task is interrupted, write progress to `HANDOVER.md` so the next session can pick up where you left off. Include: what was done, what remains, key decisions made, and the next concrete step. Delete the file when the task is complete.

## Behavioral Guidelines

**Tradeoff:** These guidelines bias toward caution over speed. For trivial tasks, use judgment.

### 1. Think Before Coding

**Don't assume. Don't hide confusion. Surface tradeoffs.**

Before implementing:
- State your assumptions explicitly. If uncertain, ask.
- If multiple interpretations exist, present them — don't pick silently.
- If a simpler approach exists, say so. Push back when warranted.
- If something is unclear, stop. Name what's confusing. Ask.

### 2. Simplicity First

**Minimum code that solves the problem. Nothing speculative.**

- No features beyond what was asked.
- No abstractions for single-use code.
- No "flexibility" or "configurability" that wasn't requested.
- No error handling for impossible scenarios.
- If you write 200 lines and it could be 50, rewrite it.

Ask yourself: "Would a senior engineer say this is overcomplicated?" If yes, simplify.

### 3. Surgical Changes

**Touch only what you must. Clean up only your own mess.**

When editing existing code:
- Don't "improve" adjacent code, comments, or formatting.
- Don't refactor things that aren't broken.
- Match existing style, even if you'd do it differently.
- If you notice unrelated dead code, mention it — don't delete it.

When your changes create orphans:
- Remove imports/variables/functions that YOUR changes made unused.
- Don't remove pre-existing dead code unless asked.

The test: Every changed line should trace directly to the user's request.

### 4. Goal-Driven Execution

**Define success criteria. Loop until verified.**

Transform tasks into verifiable goals:
- "Add validation" → "Write tests for invalid inputs, then make them pass"
- "Fix the bug" → "Write a test that reproduces it, then make it pass"
- "Refactor X" → "Ensure tests pass before and after"

For multi-step tasks, state a brief plan:
```
1. [Step] → verify: [check]
2. [Step] → verify: [check]
3. [Step] → verify: [check]
```

Strong success criteria let you loop independently. Weak criteria ("make it work") require constant clarification.

**These guidelines are working if:** fewer unnecessary changes in diffs, fewer rewrites due to overcomplication, and clarifying questions come before implementation rather than after mistakes.

**Additional rules:**
- Be concise in output but thorough in reasoning.
- Do not re-read files you have already read.
- User instructions always override this file.
- Don't wrestle with indentation in the Edit tool — focus on logic, let the project's formatter fix formatting. Use `sed` or `python3` freely when the Edit tool struggles with whitespace.

## Git commit convention

Every commit subject starts with a type prefix — `feat` / `fix` / `chore` / `docs` / `revert` / `refactor` / `perf` / `test` / `build` — optionally scoped: `fix(toolbar): ...`. Subject: imperative, lowercase start, no trailing period, aim ≤ 72 chars; detail goes in the body after a blank line (why, not what); breaking changes take `!` before the colon or a `BREAKING CHANGE:` body footer. Never rewrite pushed history.

- Commit incrementally — one logical change per commit, after lint and tests pass. Present changes for review before committing.
- PRs: link the issue, summarize the change and verification (tests/benchmarks), and include config/log/pprof evidence for bug fixes.

### Co-Author Format

- Always add co-author information. If closing an issue in commit text, verify against `main` first: `gh issue view <issue-id>`.
- Only ONE co-author line is allowed. If multiple agents contributed, aggregate into ONE entry.

Format: `Co-authored-by: <AgentName> <Email>`

Valid examples (choose EXACTLY ONE):

```
Co-authored-by: ZCode <noreply@z.ai>
```

## Documentation format

Family-wide Markdown rules, shared verbatim across all ZJ projects:

- **Language**: AGENTS.md, AUDIT.md, DESIGN.md and other agent-facing docs are English; README.md is Chinese (human-facing). Keep literal UI strings and code identifiers verbatim.
- **AGENTS.md skeleton** — generic sections first, then project; omit sections that don't apply, keep the order:
  `# AGENTS.md` → 1–2 sentence intro (what the project is + key doc links) → Behavioral Guidelines → Git commit convention → Documentation format → Project → Commands → Architecture → Conventions (Gotchas as a subsection) → project-specific sections → Key Docs.
- **README.md skeleton**: `# <project>` → badge block → one-line positioning + stack + key links → 特性 → 快速开始 → 配置 / 用法 → 文档 → License (omit as needed).
- **README badges** (shields.io, after the title, in order): Version (only where a real version exists, linked to the repo's GitHub releases), License (Apache 2.0 with Commons Clause — every project), primary-language badge (Go / TypeScript / Bash / Python / Docker), Biome for TypeScript projects; pure data/config repos get License only. Version links use the real GitHub repo name.
- **Formatting**: ATX headings (`#`), never skip a level; code fences always carry a language tag (`bash`, `go`, `json`, `text` for trees); tables for structured reference; no decorative emoji in headings or bullets; bold for key terms only.

## Project

A LobeChat plugin (Next.js 14 + TypeScript) exposing SearXNG search as a function-calling tool:
- `src/app/api/search/route.ts` — the `searxngSearch` tool: reads plugin settings, queries the SearXNG instance with `format=json`, trims results to `SEARXNG_MAX_RESULTS`
- `src/app/api/gateway/route.ts` — LobeChat plugin gateway (settings validation)
- `public/manifest.json` / `manifest-dev.json` — plugin manifests (tool schema, settings, metadata)
- Ships as a multi-arch Docker image `hezhijie0327/lobechat:searxng` (also GHCR)

**Upstream note**: the plugin's functionality was merged into LobeChat mainline (PR #6813); the built-in search can be used directly. This repo remains for standalone/self-hosted use and the customized SearXNG image.

## Commands

```bash
pnpm install
pnpm dev        # next dev -H 0.0.0.0
pnpm build      # next build
pnpm start      # next start -H 0.0.0.0
npx vitest      # tests (vitest configured)
```

Docker (multi-arch, manual trigger): `.github/workflows/main.yml` builds `lobechat:searxng` for amd64/arm64 via `workflow_dispatch`. `docker-compose.yml` runs SearXNG + plugin together; `docker-compose-bm25.yml` adds the BM25 rerank variant.

## Architecture

```text
LobeChat ── tool call ──> /api/search ──> SearXNG /search?format=json ──> trimmed results
        └─ settings ───> /api/gateway (plugin settings validation)
```

Plugin settings (configured in LobeChat UI): `SEARXNG_INSTANCE_URL` (required), `SEARXNG_MAX_RESULTS` (default 5). Tool parameters: `q` (required), `categories` (array or JSON string), `time_range` (day/month/year).

## Conventions

1. TypeScript, Next.js App Router API routes; plugin SDK helpers (`createErrorResponse`, `getPluginSettingsFromRequest`) for all error paths
2. pnpm (packageManager pinned); dependencies via Renovate (`renovate.json`)
3. Manifest changes: keep `manifest.json` and `manifest-dev.json` in sync (dev points at localhost)

### Gotchas
- The SearXNG instance **must enable `json` in `search.formats`**, otherwise the plugin gets no parseable results.
- `categories` arrives as an array or a JSON-encoded string from different LobeChat versions — `normalizeCategories()` handles both; keep it.
- `PRODUCTION_URL` env must match the public URL LobeChat reaches (manifest/gateway URLs are rewritten from it at runtime).
- Behind a reverse proxy on the same main domain as LobeChat, rewrite `/searxng-search/manifest.json`, `/searxng-search/api/gateway`, `/searxng-search/api/search`.
- The customized SearXNG image (`hezhijie0327/searxng`) adds engines (ChP, XiaoHongShu, PubMed API, Google PSE, Brave) and plugins (advanced search syntax, BM25 rerank); patches live in the DockerimageBuilder repo.

## Key Docs

- [README.md](README.md) — setup and usage (Chinese)
