# AGENTS.md — Atlas (cms_test)

> **Deployment — read this first.** This site is connected to GitHub: **every push to `main`
> automatically builds and publishes it to Cloudflare** at
> `https://cms-test.scantest.workers.dev`. That is the only live site. There is no manual deploy
> step — a push *is* a production deployment. Do not run `bun run deploy` / `wrangler deploy` as part
> of the normal flow, and do not push until the user has reviewed the changes. Treat "push to
> `main`" and "go live" as the same action. (The `deploy` script and `wrangler.jsonc` in the repo are
> the underlying setup, but the GitHub integration drives publishing.)

## What this repo is

A static Astro 7 site ("Atlas — Photography Travel Explorer") with a git-backed CMS. Content is
plain JSON committed to this same repository; the admin at `/admin` edits it through the GitHub API
using a fine-grained PAT entered in the browser. No database, no server. `patcms` is the CMS SDK.

- GitHub repo: `Kaizen3424/cms_test`, branch `main`.
- Live site: `https://cms-test.scantest.workers.dev` (canonical URL everywhere: `astro.config.mjs`,
  `src/lib/seo.ts`, `src/cms/config.ts`, `public/robots.txt`).
- Content lives in `content/places/*.json` and `content/settings/*.json`.

## Key files

| Path | Role |
|---|---|
| `src/cms/client.ts` | the single `createCMS()` client — opt-ins like the device cache go here |
| `src/cms/config.ts` | patcms config (mirrors `src/lib/schema.ts`) |
| `src/cms/provider.tsx` | React context (`CmsApi`) — the only gateway screens use to reach the CMS |
| `src/components/islands/admin/` | the admin screens (list, editor, settings, dashboard) |
| `src/lib/schema.ts` | zod schemas enforced at build time |

## Commands

`bun install`, `bun run dev`, `bun run build`, `bun run test`, `bun run check`, `bun run lint`.
Publishing happens on push (see the deployment note above) — not via a local command.

## Working rules

- The user is not a developer: explain in plain language, ask before anything that can't be undone.
- Never put a GitHub token in source, env files, URLs, or logs. The user pastes it into `/admin`.
- Screens must not import the raw `cms` client directly; add a method to `CmsApi` in the provider.
- Push only after the user signs off — pushing changes the live site.
