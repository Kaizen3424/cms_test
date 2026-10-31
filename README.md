# Wanderlust Chronicles — Travel Blog & MyCMS Integration

A single-page landing page for an expedition travel blog ("Wanderlust Chronicles"), integrated with **MyCMS** for **Phase 6** testing and validation.

---

## 🌟 Overview

- **Public Landing Page** (`/`): A modern, responsive single-page editorial travel blog with:
  - Atmospheric hero section & live expedition statistics
  - Filterable field dispatches (reading times, categories, author bio, modal reader)
  - Curated destination guides (Kyoto, Dolomites, Marrakech, Banff) with best seasons, climate, and highlights
  - Nomad explorer profile ("Behind the Lens" with Maya Lin) & camera gear breakdown
  - Mindful Travel Manifesto & Sunday Dispatch newsletter postcard
- **CMS Studio** (`/admin.html` or `/admin`):
  - Directly powered by `@mycms/admin` and `@mycms/core`
  - Zero-database, Git-backed content architecture
  - **Local Sandbox Mode**: Pre-seeded with all travel blog posts and destinations, runs an in-memory `FakeGithubServer` so you can test editing, drafting, widgets, and saving immediately offline with zero setup!
  - **Real GitHub Mode**: Ready to connect to any actual GitHub repository with a Personal Access Token (PAT).

---

## 📂 Content Architecture

Content lives as version-controlled JSON files:

```
cms_test/
├── content/
│   ├── settings.json              # Site title, tagline, hero text, stats, contact
│   ├── author.json                # Explorer bio, gear, quote, avatar
│   ├── destinations/              # Destination guides
│   │   ├── banff-canada.json
│   │   ├── dolomites-italy.json
│   │   ├── kyoto-japan.json
│   │   └── marrakech-morocco.json
│   └── posts/                     # Field notes & articles
│       ├── banff-glacial-lakes.json
│       ├── dolomites-alpine-trails.json
│       ├── kyoto-tea-gardens.json
│       └── marrakech-souks-and-spices.json
├── public/
│   └── images/                    # Scenic SVG assets
│       ├── author/
│       ├── destinations/
│       └── posts/
└── src/
    ├── cms/
    │   ├── config.ts              # Zod-first MyCMS collection & field definitions
    │   └── sandbox.ts             # In-memory FakeGithubServer transport for offline testing
    ├── admin-entry.tsx            # CMS mount point (mountAdmin) with mode switcher
    ├── App.tsx                    # Landing page component
    ├── data.ts                    # Dynamic loader for JSON content
    └── main.tsx                   # Main entry point & client router
```

---

## 🚀 Running the Project

### 1. Development Server
```bash
pnpm dev
```
- Open `http://localhost:5173/` for the Travel Blog landing page.
- Click **"Studio / CMS Admin"** in the top navigation or open `http://localhost:5173/admin.html` to enter the CMS.

### 2. Testing the CMS in Sandbox Mode
- In `/admin.html`, Local Sandbox Mode is active by default.
- When prompted for a GitHub token on the login screen, enter any test token (e.g. `sandbox-token`).
- You will enter the studio with full access:
  - Browse **Dispatches & Stories**
  - Edit posts, test slug generation, and relation fields linking posts to destinations
  - Test the **Destinations** collection
  - Edit **Site Settings** and **Traveler Bio**
  - Verify drafts in IndexedDB, the save pipeline, and validation!

### 3. Testing with Real GitHub
- Click **"Switch to Real GitHub Mode"** in the top bar (or add `?mode=github&owner=YOUR_USER&repo=YOUR_REPO`).
- Enter your GitHub Personal Access Token (with repo scope) to edit live content directly on GitHub.

### 4. Production Build
```bash
pnpm build
pnpm preview
```
Both `index.html` (landing page) and `admin.html` (MyCMS studio) bundle cleanly into `dist/`.
