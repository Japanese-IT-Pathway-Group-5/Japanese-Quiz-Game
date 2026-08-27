# Japanese Quiz Game

A JLPT **N4 / N3** quiz game for the web. Answer vocabulary, kanji, and grammar questions against
the clock, then see where your score lands on the leaderboard.

Group 5 · Japanese IT Pathway, class project #2.

> **Status:** in development. Deadline 7 September 2026.

## Features

- **Four question formats** — multiple choice, gap-fill, kana/romaji typing, and word ordering.
- **Two levels** — N4 and N3, picked at the start of a run.
- **Leaderboard** — nickname-based, no sign-up. One row per player, best score kept.
- **Server-side grading** — correct answers never reach the browser, so scores are trustworthy.
- **Admin editor** — the team authors questions in-app behind a shared password.

## Stack

| Layer     | Choice                                                         |
| --------- | -------------------------------------------------------------- |
| Framework | SvelteKit 2 · Svelte 5 (runes) · TypeScript                    |
| Hosting   | Cloudflare Workers                                             |
| Database  | Cloudflare D1 (SQLite) via Drizzle ORM                         |
| Tests     | Vitest (unit + component) · Playwright (e2e)                   |
| Quality   | Prettier · ESLint · `svelte-check`                             |
| CI/CD     | GitHub Actions — checks on every PR, deploy on merge to `main` |

## Quick start

```bash
corepack enable
pnpm install
pnpm run gen                          # generate Cloudflare types
cp .env.example .env                  # fill in your values
pnpm run dev
```

Full setup notes, branch rules, and the Windows `pnpm` gotcha are in [CONTRIBUTING.md](./CONTRIBUTING.md).

## Scripts

| Command                     | Does                                              |
| --------------------------- | ------------------------------------------------- |
| `pnpm run dev`              | Dev server                                        |
| `pnpm run build`            | Production build                                  |
| `pnpm run preview`          | Serve the built Worker locally via `wrangler dev` |
| `pnpm run check`            | `svelte-kit sync` + `svelte-check`                |
| `pnpm run lint` / `format`  | Prettier + ESLint                                 |
| `pnpm run test:unit`        | Vitest, watch mode                                |
| `pnpm run test:e2e`         | Playwright                                        |
| `pnpm run db:generate`      | Generate a migration from `schema.ts`             |
| `pnpm run db:migrate:local` | Apply migrations to the local D1                  |
| `pnpm run db:migrate:prod`  | Apply migrations to the deployed D1               |
| `pnpm run deploy`           | Deploy the Worker manually                        |

## Project layout

```
src/lib/quiz/         Pure, unit-tested logic — kana normalization, scoring, types
src/lib/server/       D1 access, grading, attempt lifecycle, cookie auth
src/lib/components/   Presentational Svelte components
src/routes/           Pages, load functions, form actions
drizzle/              Generated SQL migrations
e2e/                  Playwright specs
```

`src/lib/quiz/` holds no database or network code, which is what keeps it cheap to test.

## Deployment

Merging to `main` runs the `Deploy` workflow: build, apply D1 migrations to production, deploy the
Worker. Every pull request gets its own preview URL, posted as a comment on the PR.

The workflow calls `pnpm exec wrangler` directly (not the wrangler-action) and reads two GitHub
Actions secrets that a repo admin must set:

- `CLOUDFLARE_API_TOKEN` - create one at [dash.cloudflare.com/profile/api-tokens](https://dash.cloudflare.com/profile/api-tokens) using the "Edit Cloudflare Workers" template
- `CLOUDFLARE_ACCOUNT_ID` - visible in the URL bar on any Cloudflare dashboard page

## Team

See the in-app **Credits** page for who built which screen.

## License

Coursework. Not licensed for reuse.
