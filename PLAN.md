# Japanese Quiz Game - Project Plan

Group 5 - Japanese IT Pathway Project #2  
Deadline: **Monday 14 Sep 2026, 6:00 PM**

## 1. Project Overview

We are building a JLPT N4 / N3 quiz game web app with 6 teammates.

Key features:

- Four question types: multiple choice, gap-fill, romaji/kana typing, and word ordering
- Two difficulty levels: N4 and N3
- Anonymous players: enter a nickname, start playing immediately, session saved in cookies
- Server-side grading: answer keys stay on the server so players cannot inspect them
- Leaderboard: shows top scores per player
- Admin panel: add, edit, and manage questions behind a shared password
- Credits page: lists team members and their work

## 2. Tech Stack

- Frontend & Backend: SvelteKit 2 (Svelte 5 runes, TypeScript)
- Hosting: Cloudflare Workers
- Database: Cloudflare D1 (SQLite) with Drizzle ORM
- Testing: Vitest (unit tests), Playwright (end to end tests)
- Tooling: pnpm, Prettier, ESLint

## 3. Team Roles

We split the work into 6 lanes so everyone can work without blocking each other.

| Lane      | Member       | Main Tasks                                              |
| --------- | ------------ | ------------------------------------------------------- |
| `engine`  | @LaySopanha  | Database schema, migrations, server grading, scoring    |
| `play`    | @virakbottch | Quiz runner page, multiple choice component, timer      |
| `typing`  | @Bemine5Cent | Romaji to kana conversion, typing input component       |
| `order`   | @virakbottch | Word ordering question component                        |
| `score`   | @zinhour10   | Results screen, leaderboard, styling, accessibility     |
| `admin`   | @Thaikarona  | Admin login, question editor, credits page              |
| `content` | @LYLEAB      | Writing 120 N4/N3 questions, testing questions in admin |

## 4. Milestones

We organized our 34 issues into 5 milestones on GitHub:

1. **M1 Foundation** (Due Sep 4): Repo setup, connect Cloudflare D1, branch protection, project docs.
2. **M2 Data & Admin** (Due Sep 6): Database tables, auth sessions, admin question editor.
3. **M3 Quiz Engine** (Due Sep 10): Core quiz flow, all question components, grading, timer.
4. **M4 Score & Polish** (Due Sep 12): Score calculation, results, leaderboard, credits, UI and mobile layout.
5. **M5 Release** (Due Sep 14): Enter 120 questions, test on phones, deploy to production.

## 5. Timeline

| Dates           | Goals                                                         |
| --------------- | ------------------------------------------------------------- |
| Aug 27 - Sep 4  | Setup repo, D1 database, and branch protection                |
| Sep 5 - Sep 6   | Database schema, migrations, auth, and admin editor           |
| Sep 7 - Sep 10  | Quiz engine, question formats, and timer                      |
| Sep 11 - Sep 12 | Leaderboard, result page, credits, and styling                |
| Sep 13 - Sep 14 | Enter all 120 questions, test on real devices, submit project |

## 6. Team Rules

- Branch names: `<type>/<issue#>-<slug>` (example: `feat/20-quiz-screen`)
- Commit style: `feat(quiz): add timer component`, `fix(score): fix tie breaker`
- Pull Requests: One PR per issue. PR description must include `Closes #<issue#>`.
- CI must pass (lint, check, test) before merging.
- At least 1 teammate must review and approve before merging to `main`.
