# Atlas — Photography Travel Explorer

A static Astro site with a git-backed CMS. Content lives as JSON in this repository, the admin panel
edits it through the GitHub API, and every publish is a commit that triggers a Cloudflare rebuild.

## Stack

| Layer | Choice |
|---|---|
| Framework | Astro 7 (`output: 'static'`) |
| UI islands | React 19 (`@astrojs/react`) — map + admin only |
| Styling | Tailwind CSS v4 via `@tailwindcss/vite` |
| CMS | [patcms](https://www.npmjs.com/package/patcms) — no database, no server |
| Media | Committed under `public/images`, responsive AVIF/JPEG variants |
| Hosting | Cloudflare Workers static assets |
| Tests | Vitest |

## Commands

```bash
bun install          # install dependencies
bun run dev          # dev server (http://localhost:4321)
bun run build        # static build to dist/
bun run preview      # preview the build locally
bun run check        # astro check + content schema validation
bun run lint         # tsc --noEmit
bun run test         # vitest
bun run deploy       # wrangler deploy (after build)
```

## Content

```
content/
  places/<slug>.json          one document per destination
  settings/home.json          homepage settings
  settings/philosophy.json    philosophy page settings
  settings/contact.json       contact page settings
```

- Filenames are the URL slugs: `content/places/kyoto.json` → `/place/kyoto`.
- Only entries with `status: "published"` get a page and a sitemap entry.
- Schemas live in `src/lib/schema.ts` and are enforced at build time; a malformed file fails the
  build rather than shipping a broken page.

## Images

Photographs are hotlinked from their original sources (Unsplash and one Google-hosted image), exactly
as in the previous build. `<ResponsiveImage>` accepts any `src`; remote URLs render as a plain
`<img>`, and any future local asset under `/images/...` automatically gains responsive AVIF/JPEG
variants through `src/data/image-manifest.json` when that manifest is generated.

Attribution and licence notes: `public/images/CREDITS.md` (generated alongside the manifest).

## Admin

The admin lives at `/admin` and is the only React-heavy part of the site.

1. Create a **fine-grained personal access token** on GitHub, scoped to this repository only, with
   `Contents: Read and write`.
2. Open `/admin`, paste the token into the sign-in form. Choose "remember" to keep it in IndexedDB
   on that device; otherwise it is session-only.
3. Edits buffer locally as drafts. **Publish** writes one commit; a refresh does not lose work.

The token is never placed in a URL, a build variable, or a log line. It only ever lives in the
browser's storage. Do not commit it.

## Deploy

```bash
bun run build
bun run deploy
```

`wrangler.jsonc` serves `dist/` as static assets with `not_found_handling: "404-page"`.
`public/_headers` and `public/_redirects` control caching, security headers and legacy URL aliases.

Set `SITE_URL` at build time to the production origin (used for canonical URLs, Open Graph and the
sitemap). Without it, the build falls back to the placeholder in `astro.config.mjs`.
