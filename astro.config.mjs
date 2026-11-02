// astro.config.mjs — static build (no SSR adapter needed: every save is a
// rebuild, so the whole site renders from whichever JSON is committed).
import { defineConfig } from "astro/config"
import react from "@astrojs/react"
import sitemap from "@astrojs/sitemap"
import tailwindcss from "@tailwindcss/vite"

// Cloudflare Pages injects the production URL at build time; local builds
// fall back to the deploy preview domain so sitemap/sitemap-links stay valid.
const site = process.env.CF_PAGES_URL ?? "https://wanderlust-chronicles.pages.dev"

export default defineConfig({
  site,
  integrations: [react(), sitemap()],
  vite: {
    plugins: [tailwindcss()],
  },
})
