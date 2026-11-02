# Wanderlust Chronicles — Travel Blog on patcms (Astro + Bun)

A statically-rendered expedition travel blog ("Wanderlust Chronicles") whose every word,
image path and stat lives as version-controlled JSON — managed through **patcms**, a
zero-database, git-backed CMS. One repository holds the site, the content *and* the CMS
config: an edit in the studio is a commit, a commit is a deploy.

- **Site framework:** Astro 7 (static output — no SSR adapter; every save is a rebuild)
- **Package manager:** Bun
- **CMS:** [`patcms`](https://www.npmjs.com/package/patcms) from npm, mounted as the CMS Studio at `/admin/`
- **Design system:** the "Wise" system from `DESIGN.md` — sage canvas, white cards, one lime accent, self-hosted Inter, spring physics via `motion`

---

## 🗺️ Routes (all real, all static)

| Route | What it is |
| --- | --- |
| `/` | Landing page: hero with auto-advancing **featured dispatch ticker**, filterable story grid with modal reader, destination cards, explorer profile, manifesto, newsletter |
| `/journal/` | Chronological archive of every dispatch |
| `/journal/<slug>/` | The full article page — what the CMS preview button opens |
| `/destinations/<slug>/` | Destination field guide |
| `/admin/` | **CMS Studio** — sign in with a GitHub token, edit, save |
| `/rss.xml`, `sitemap-index.xml` | Publication feeds |
| `/404.html` | Not-found page |

Static redirects: `/admin.html` → `/admin/` (301, in `public/_redirects`).

---

## 📂 Where things live

```
cms_test/
├── content/                    ← THE CONTENT (CMS writes here; Astro reads here)
│   ├── settings.json           # site title, tagline, hero copy, stats, contact
│   ├── author.json             # explorer bio, gear, quote, avatar
│   ├── destinations/*.json     # destination guides
│   └── posts/*.json            # field notes & articles
├── public/images/              # scenic assets (upload target for the CMS media library)
├── public/_headers             # Cloudflare Pages headers incl. admin CSP
├── public/_redirects           # /admin.html → /admin/
├── src/
│   ├── cms/config.ts           # patcms defineConfig: collections, fields, media folder
│   ├── panel/                  # the CMS Studio UI (React island, unstyled framework-free)
│   ├── components/             # .astro section components + React islands (islands/)
│   ├── layouts/Layout.astro    # document shell: theme boot script, fonts, meta
│   ├── lib/                    # settings/author loaders, format helpers, repo target
│   ├── scripts/site.ts         # vanilla behaviours: theme toggle, reveals, count-ups
│   ├── styles/                 # theme.css (tokens) + global.css (Tailwind v4 binding)
│   ├── content.config.ts       # Astro Content Layer: glob loaders over content/**
│   └── pages/                  # index, admin, journal/…, destinations/…, rss, 404
├── astro.config.mjs            # static build, react + sitemap, Tailwind via vite plugin
└── DESIGN.md                   # the design spec this site implements
```

Content is **the same JSON the CMS edits** — there is no copy step. `src/content.config.ts`
declares Astro collections that glob over `content/posts` and `content/destinations`;
`settings.json` / `author.json` are imported directly.

---

## 🚀 Commands (Bun)

```bash
bun install        # install dependencies
bun run dev        # dev server → http://localhost:5173/ (studio at /admin/)
bun run build      # static build → dist/
bun run preview    # serve dist/ on :5173
bun run typecheck  # astro sync && astro check
```

---

## 🖥️ Using the CMS Studio

1. Open **/admin/** and sign in with a GitHub **Personal Access Token**
   (fine-grained, "Contents: read & write" on this repository).
2. The token is stored only in the browser (IndexedDB) — it is never committed, logged,
   or placed in any URL.
3. Editing behaviour:
   - **Draft** autosaves to IndexedDB per entry; discard or publish from the editor.
   - **Save** writes a normal `chore(cms): save …` commit to `main` — which is the
     repository Cloudflare Pages deploys from, so the live site updates automatically.
   - Saving an unchanged entry is a **noop** (no empty commits).
   - If someone edited the file upstream while you worked, the panel shows a **conflict
     table** (yours vs. remote per field) and you decide each side — no exception, no data loss.
   - The media library uploads to `public/images/` and references them as `/images/…`.
   - The **preview** button opens the real rendered route (`/journal/<slug>/`,
     `/destinations/<slug>/`) once it exists in the built site.

Contribution rules the site keeps to: never force-push, never merge JSON with
`Object.assign`, never embed the token in URLs or logs, never render repository content
as HTML.

---

## 🔒 /admin/ security headers

`public/_headers` gives `/admin*` a strict CSP: `script-src 'self' <theme-boot-hash>`,
`connect-src 'self' https://api.github.com`, no `object-src`, `frame-ancestors 'none'`,
plus `X-Robots-Tag: noindex` and `robots.txt` disallow. The one permitted inline script is
the theme boot (avoid-light-flash) resolver, pinned by its **sha256 hash**.

> If you ever edit the boot script in `src/layouts/Layout.astro`, recompute the hash:
> build, extract the `<script>` content from `dist/admin/index.html`, and update the
> `'sha256-…'` value in `public/_headers`.

---

## ☁️ Cloudflare Pages

- **Build command:** `bun install && bun run build`
- **Build output directory:** `dist`
- **Deployment:** automatic on push to `main` — including the CMS save commits above
- `CF_PAGES_URL` supplies the production `site` for the sitemap/RSS at build time.

---

## 🧪 Testing notes

- `content/posts/testing.json` is a scratch entry for exercising the create → edit →
  save → delete flow against the live repo; safe to delete from the studio when done.
- Local sandbox/`FakeGithubServer` mode was removed along with the old Vite scaffold —
  the studio now tests against the real repository (use a scratch branch on a fork of your
  own repo if you'd rather not touch `main`).
