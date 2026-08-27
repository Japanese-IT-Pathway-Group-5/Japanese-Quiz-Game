# Contributing

Group 5 · Japanese Quiz Game. Read this once before your first PR.

## Setup

```bash
corepack enable          # Windows: run this in an ADMIN terminal, see note below
pnpm install
pnpm run gen             # generates worker-configuration.d.ts from wrangler.jsonc
pnpm exec playwright install chromium
cp .env.example .env     # then fill it in — never commit .env
pnpm run dev
```

> **Windows `pnpm: command not found`**
> `corepack enable` writes shims into the Node install directory. If that directory is not
> user-writable you get `EPERM: operation not permitted` and no `pnpm` on your PATH.
> Fix: run `corepack enable` once from a terminal opened as Administrator.
> Workaround if you cannot elevate: prefix every command with `corepack` — e.g.
> `corepack pnpm install`, `corepack pnpm run dev`.

## Branches

Branch off `main`, named `<type>/<issue#>-<slug>`:

```
feat/17-kana-normalize
fix/42-leaderboard-tie-order
chore/3-cloudflare-secrets
```

`main` is protected. No direct pushes — every change lands through a PR with one approval and green CI.

## Commits

[Conventional Commits](https://www.conventionalcommits.org/):

```
feat(quiz): grade typing answers against normalized kana
fix(leaderboard): break score ties by fastest duration
chore(ci): cache pnpm store
docs(readme): add architecture diagram
test(kana): cover small-tsu and long-vowel cases
```

Types in use: `feat`, `fix`, `chore`, `docs`, `test`, `refactor`, `style`.

## Pull requests

- One issue per PR. The body must say `Closes #<issue>`.
- CI must be green: `lint`, `check`, `test:unit:run`, `build`, and the e2e job.
- A bot comments a live preview URL on the PR — click it and check your change before requesting review.
- One approval required. Review someone else's PR the same day you open yours.

## Before you push

```bash
pnpm run lint          # prettier --check + eslint
pnpm run check         # wrangler types --check + svelte-check
pnpm run test:unit:run
```

`pnpm run format` fixes formatting complaints.

If you changed `wrangler.jsonc` (new binding, new D1 database), re-run `pnpm run gen` so your local
types match. `worker-configuration.d.ts` is **generated, not committed** — `pnpm install` regenerates
it via the `prepare` script, and CI regenerates it too. Do not add it to a commit.

## Where code goes

| Path                  | Rule                                                                                                           |
| --------------------- | -------------------------------------------------------------------------------------------------------------- |
| `src/lib/quiz/`       | **Pure functions only.** No DB, no `fetch`, no SvelteKit imports. Every file here has a `.spec.ts` next to it. |
| `src/lib/server/`     | Anything touching D1, cookies, or secrets. Never imported from a `.svelte` component.                          |
| `src/lib/components/` | Presentational Svelte components.                                                                              |
| `src/routes/`         | Pages, `load` functions, form actions.                                                                         |
| `drizzle/`            | Generated SQL migrations. Never hand-edit — change `schema.ts` and run `pnpm run db:generate`.                 |

## Security

This repository is **public**.

- Secrets live in `.env` (local, gitignored), GitHub Actions secrets (CI), and Wrangler secrets (production). Nowhere else.
- Never commit `.env`, `.dev.vars`, or an API token. If you push one, tell the team and **rotate it** — deleting the commit is not enough, it stays in the history and in forks.
- Correct answers must never reach the browser. Anything sent to the client goes through `toClientQuestion()`.
