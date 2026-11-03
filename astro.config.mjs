import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Cloudflare Workers injects nothing at build time, so the site URL is an env
// var with a workers.dev fallback. Change before launch.
const site = process.env.SITE_URL ?? 'https://atlas.example.workers.dev';

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
    }),
  ],
  vite: {
    plugins: [tailwindcss()],
    resolve: {
      alias: {
        '@': fileURLToPath(new URL('./src', import.meta.url)),
      },
    },
  },
});
