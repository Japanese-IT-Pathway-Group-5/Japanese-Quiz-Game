# Japanese Quiz Game: Project Plan

> Group 5 - Japanese IT Pathway Project #2
> Deadline: **Monday 14 Sep 2026, 6:00 PM**

## Context

Team of 6 building a JLPT N3/N4 quiz web app. Repo `LaySopanha/Japanese-Quiz-Game` is **public** and currently **empty** (zero commits).

The brief requires: N3+N4 content, a scoreboard with visible names, a credits page naming who built which screen, TypeScript + SvelteKit on Cloudflare Workers + D1, and Prettier/ESLint/Vitest/Playwright/Drizzle.

### Decisions locked

| Area            | Decision                                                                          |
| --------------- | --------------------------------------------------------------------------------- |
| Identity        | No accounts. Nickname + signed session cookie                                     |
| Formats         | MCQ, kana/romaji typing, gap-fill, word order. **Listening = stretch, cut first** |
| Content         | Authored in-app via admin UI, gated by shared password                            |
| Scoring         | Server-side. Correct answers never sent to client                                 |
| Package manager | pnpm, pinned via corepack                                                         |
| Cloudflare      | Nothing exists yet — account, D1, and API token all part of Day 1                 |
| Branch policy   | `main` protected: PR + green CI + 1 approval                                      |
| Tracking        | ~32 issues across 5 milestones                                                    |

**Environment baseline:** Node v24.12.0, npm 11.6.2, corepack 0.34.5, gh 2.92.0. No pnpm yet. Collaborators today: `LaySopanha`, `LYLEAB` — **4 more to invite**.

**Scope note:** four formats + admin CRUD + server grading + full CI/CD in 11 days is aggressive. This plan is ordered so a deployed, demoable game exists by Day 6 and everything after is additive. If a day slips, cut in this order: listening → word-order drag → admin edit/delete (keep create) → typing format.

---

## Phase 0 — Repo foundation (Day 1, before any app code)

Order matters: protection rules go on **after** the first commit, or the initial push is blocked.

1. **Scaffold, commit, push** to `main` (Phase 1 below).
2. **Invite the 4 remaining members** — `gh api -X PUT repos/LaySopanha/Japanese-Quiz-Game/collaborators/<user> -f permission=push`.
3. **Labels** — lanes `lane:engine|play|typing|order|score|admin`, types `type:feat|chore|test|docs|bug`, priority `P0|P1|P2`, size `size:S|M|L`.
4. **Milestones** — the 5 below, with due dates.
5. **Issues** — ~32, each labelled by lane + type + size and assigned to a milestone.
6. **Branch protection on `main`** — require PR, 1 approval, all CI checks green, no force-push, dismiss stale reviews on new commits. Admin bypass stays enabled as a deadline-night escape hatch.
7. **Repo hygiene files** — `.github/PULL_REQUEST_TEMPLATE.md`, `.github/ISSUE_TEMPLATE/{feature,bug}.yml`, `CODEOWNERS` (lane owner per directory), `CONTRIBUTING.md` (branch naming, Conventional Commits, review rules), `.env.example`, `README.md`.

**Conventions:** branches `<type>/<issue#>-<slug>` (e.g. `feat/17-kana-normalize`). Commits follow Conventional Commits. PR body must close its issue (`Closes #17`).

> ### ⚠️ Security — the repo is public
>
> `.dev.vars`, `.env`, and `*.sqlite` go in `.gitignore` from the very first commit. `CLOUDFLARE_API_TOKEN`, `AUTH_SECRET`, and `ADMIN_PASSWORD` live only in GitHub Actions secrets and Wrangler secrets — never in `wrangler.jsonc`, never in a commit. If a token is ever pushed, **rotate it** in the Cloudflare dashboard; deleting the commit is not enough.

---

## Phase 1 — Scaffold + Cloudflare (Day 1)

```bash
corepack enable
corepack use pnpm@latest          # writes packageManager to package.json — pins all 6 machines
pnpm dlx sv create .              # SvelteKit minimal, TypeScript, + prettier eslint vitest playwright drizzle
pnpm add wanakana
pnpm add -D @cloudflare/workers-types wrangler
pnpm dlx wrangler login
pnpm dlx wrangler d1 create japanese-quiz
```

Then set `@sveltejs/adapter-cloudflare` in `svelte.config.js` and write `wrangler.jsonc`:

```jsonc
{
	"name": "japanese-quiz-game",
	"main": ".svelte-kit/cloudflare/_worker.js",
	"compatibility_date": "2026-08-01",
	"compatibility_flags": ["nodejs_als"],
	"assets": { "binding": "ASSETS", "directory": ".svelte-kit/cloudflare" },
	"d1_databases": [
		{
			"binding": "DB",
			"database_name": "japanese-quiz",
			"database_id": "<from wrangler d1 create>",
			"migrations_dir": "drizzle"
		}
	]
}
```

`drizzle.config.ts` uses `out: './drizzle'` so drizzle-kit's output _is_ wrangler's migrations dir.

**package.json scripts:** `dev`, `build`, `preview`, `check`, `lint`, `format`, `test:unit`, `test:e2e`, `db:generate`, `db:migrate:local`, `db:migrate:prod`, `db:seed`, `deploy`.

**Cloudflare API token** — mint at dash → My Profile → API Tokens, scoped to: `Account › Workers Scripts:Edit`, `Account › D1:Edit`, `Account › Account Settings:Read`. Add `CLOUDFLARE_API_TOKEN` + `CLOUDFLARE_ACCOUNT_ID` via `gh secret set`.

> **Day 1 exit criteria: a hello-world Worker is live on a public URL.**
> Deploying on Day 1 rather than Day 10 is the single highest-value scheduling choice here — Cloudflare surprises surface while there's still time to absorb them.

---

## Phase 2 — CI/CD

### `.github/workflows/ci.yml` — on PR + push to `main`

- **Job `quality`:** checkout → `pnpm/action-setup` + `actions/setup-node@v6` (cache: pnpm) → `pnpm install --frozen-lockfile` → `pnpm lint` → `pnpm check` (svelte-check) → `pnpm test:unit` → `pnpm build`.
- **Job `e2e`:** same setup → apply migrations to **local** D1 (`wrangler d1 migrations apply japanese-quiz --local`) → seed fixture questions → `pnpm exec playwright test` (Playwright `webServer` runs `wrangler dev`) → upload the HTML report as an artifact on failure.

Both jobs are the required status checks for branch protection.

### `.github/workflows/deploy.yml` — Cloudflare

Uses `cloudflare/wrangler-action@v4` with `packageManager: pnpm`.

- **On push to `main`:** apply migrations `--remote` **first**, then `wrangler deploy`. Migration before deploy, always — new code against an old schema is the classic self-inflicted outage.
- **On pull request:** `wrangler versions upload --preview-alias pr-${{ github.event.number }}` → post the preview URL as a PR comment. Every PR gets a real URL the team and the instructor can click.

> PRs from **forks** cannot read repo secrets, so the preview job is skipped there. All 6 members push branches to this repo directly, so this doesn't bite us — worth knowing before someone forks and wonders why the preview never appears.

---

## Phase 3 — Application architecture

```
src/
  lib/
    quiz/               # PURE, shared, unit-tested — no DB, no fetch
      kana.ts           # romaji→hiragana normalize (wraps `wanakana`)
      score.ts          # computeScore(correct, total, durationMs)
      types.ts          # QuestionFormat, ClientQuestion, GradeResult
    server/
      db/{schema.ts,index.ts}   # Drizzle tables; getDb(platform)
      quiz/
        grade.ts        # gradeAnswer(question, given) — per-format
        attempt.ts      # createAttempt / loadCurrent / submitAnswer / finish
        serialize.ts    # toClientQuestion() — STRIPS answers
      auth.ts           # HMAC sign/verify for player + admin cookies
    data/credits.ts     # team member array -> /credits
    components/         # QuestionMcq, QuestionTyping, QuestionOrder, QuestionAudio,
                        # Timer, ProgressBar, LeaderboardTable
  routes/
    +page.svelte              # landing: nickname + level + mode
    play/[attemptId]/         # quiz runner (form actions, works without JS)
    result/[attemptId]/
    leaderboard/  credits/
    admin/{login,questions}/  # questions: list / new / [id]
  hooks.server.ts             # issue player cookie; guard /admin/*
drizzle/                      # generated SQL migrations (= wrangler migrations_dir)
e2e/                          # Playwright
```

**Key rule:** `src/lib/quiz/` is pure functions only. That's where Vitest earns its keep and where three people work without merge conflicts.

### Data model (5 tables)

| Table             | Columns                                                                                                                                                                                                                                                                             |
| ----------------- | ----------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------------- |
| `players`         | `id` (uuid PK), `nickname`, `createdAt`                                                                                                                                                                                                                                             |
| `questions`       | `id`, `level` (`N3`\|`N4`), `category` (`vocab`\|`kanji`\|`grammar`\|`listening`), `format` (`mcq`\|`typing`\|`order`\|`listening`), `prompt`, `promptJa`, `answerKeys` (JSON — normalized accepted answers, typing only), `audioPath` (null), `explanation`, `active`, `createdAt` |
| `choices`         | `id`, `questionId` FK, `text`, `isCorrect`, `sortOrder`                                                                                                                                                                                                                             |
| `quiz_attempts`   | `id` (uuid PK), `playerId` FK, `nickname` (snapshot), `level`, `questionIds` (JSON), `currentIndex`, `correctCount`, `score`, `startedAt`, `finishedAt`, `status` (`active`\|`finished`\|`abandoned`)                                                                               |
| `attempt_answers` | `attemptId` FK, `questionId` FK, `given`, `isCorrect`, `timeMs`                                                                                                                                                                                                                     |

- **Gap-fill folds into `mcq`** — the prompt just contains `____`. One less format to build, still reads as distinct to the player.
- **Word order (`order`)** reuses `choices`: `sortOrder` is the correct sequence, the client shuffles for display.
- **No `scores` table.** Leaderboard = query over `quiz_attempts WHERE status='finished'`, best per `playerId`. One source of truth.
- `answerKeys` is stored already normalized through `kana.ts`, so grading is set membership, not parsing.

### Server-side grading flow

1. Landing form action → `createAttempt()` picks N random active questions for the level, writes the attempt, redirects to `/play/[attemptId]`.
2. `play/[attemptId]/+page.server.ts` `load` → returns the current question through **`toClientQuestion()`**, which drops `isCorrect`, `answerKeys`, and `explanation`.
3. Action `?/answer` → `gradeAnswer()` server-side, append `attempt_answers`, advance index, redirect to self (POST-redirect-GET, so refresh can't double-submit).
4. Last question → `finish()` writes `computeScore(...)`, `finishedAt`, `status='finished'` → `/result/[attemptId]`.
5. **Guards:** an attempt is readable/advanceable only by the cookie's `playerId`; a `finished` attempt rejects further answers.

### Auth (`src/lib/server/auth.ts`)

HMAC-SHA256 sign/verify over `AUTH_SECRET` using Web Crypto. `hooks.server.ts` issues a `pid` cookie (`httpOnly, sameSite:'lax', secure, maxAge 1y`) and puts it on `event.locals.playerId`. `/admin/login` does a **constant-time compare** against `ADMIN_PASSWORD`, then sets a short-lived signed `adm` cookie; `hooks.server.ts` redirects unauthenticated `/admin/*`. Read both via **`$env/dynamic/private`** — Wrangler secrets are injected at runtime, not build time.

---

## Milestones & issues (34 issues)

| Milestone             | Due Date | Issues |
| --------------------- | -------- | ------ |
| **M1 Foundation**     | Sep 4    | 4      |
| **M2 Data + Admin**   | Sep 6    | 6      |
| **M3 Quiz Engine**    | Sep 10   | 14     |
| **M4 Score + Polish** | Sep 12   | 6      |
| **M5 Release**        | Sep 14   | 4      |

**M1 Foundation**: Project setup, D1 database binding, branch protection, and project documents.

**M2 Data + Admin**: Database tables, migrations, session auth, and admin question editor.

**M3 Quiz Engine**: Question types, quiz attempt flow, grading logic, start screen, and timer.

**M4 Score + Polish**: Score calculation, result screen, leaderboard, credits page, and styling.

**M5 Release**: 120 quiz questions, testing across devices, and production deployment.

### Lane ownership

| Lane     | Owner        | Responsibilities                                      |
| -------- | ------------ | ----------------------------------------------------- |
| `engine` | @LaySopanha  | Database schema, migrations, grading logic, scoring   |
| `play`   | @virakbottch | Quiz runner UI, multiple choice questions, timer      |
| `typing` | @Bemine5Cent | Romaji to hiragana conversion, typing input component |
| `order`  | @virakbottch | Word ordering question component                      |
| `score`  | @zinhour10   | Leaderboard, result screen, styling, accessibility    |
| `admin`  | @Thaikarona  | Admin login, question editor, credits page            |

---

## Timeline

| Milestone / Phase     | Dates           | Target                                                         |
| --------------------- | --------------- | -------------------------------------------------------------- |
| **M1 Foundation**     | Aug 27 - Sep 4  | Setup repo, connect D1, and configure branch protection        |
| **M2 Data + Admin**   | Sep 5 - Sep 6   | Build schema, migrations, auth, and admin CRUD                 |
| **M3 Quiz Engine**    | Sep 7 - Sep 10  | Build core quiz engine, question formats, and timer            |
| **M4 Score + Polish** | Sep 11 - Sep 12 | Build leaderboard, result page, credits, and styling           |
| **M5 Release**        | Sep 13 - Sep 14 | Enter 120 questions, test on phones, and submit before 6:00 PM |

---

## Verification

Every PR must pass, and these are the required checks on `main`:

```bash
pnpm lint && pnpm check      # eslint + prettier + svelte-check, zero errors
pnpm test:unit               # vitest
pnpm test:e2e                # playwright against wrangler dev + local D1
```

**Unit (Vitest) — the pure layer:**

- `kana.ts`: `toumei`/`とうめい`, long vowels (`tou` vs `とう`), small tsu (`kitte`/`きって`), `nn`/`n'`/`ん`, trailing whitespace, full-width vs half-width.
- `grade.ts`: every format; a typing answer matching any entry in `answerKeys`; an `order` answer wrong only in sequence.
- `score.ts`: all-correct, all-wrong, time-bonus bounds, zero-duration guard.
- `auth.ts`: valid signature round-trips; a tampered payload verifies false.

**E2E (Playwright):**

1. Nickname → full 5-question playthrough → result shows correct count → nickname on `/leaderboard`.
2. Replay in the same profile → **one** row for that player, best score kept.
3. Anonymous `GET /admin/questions` → redirect to login; wrong password → rejected.
4. **Answer-leak assertion:** the `/play/[attemptId]` payload contains no `isCorrect`, `answerKeys`, or `explanation`. This test is the reason the server-grading design exists — write it early, in M3.

**Release checklist (Day 10, on the deployed URL):** prod migrations applied · `AUTH_SECRET` + `ADMIN_PASSWORD` set as Wrangler secrets · full playthrough on a phone · leaderboard verified from two devices · `/credits` shows all 6 names · README screenshots current.

---

## Open items

- [ ] GitHub usernames of the 4 members not yet collaborators
- [ ] Real names + lane assignment for all 6 (fills the Lane ownership table and `src/lib/data/credits.ts`)
- [ ] Cloudflare account created, `wrangler login` done
