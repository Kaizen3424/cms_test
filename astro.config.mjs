import { defineConfig } from 'astro/config';
import react from '@astrojs/react';
import sitemap from '@astrojs/sitemap';
import tailwindcss from '@tailwindcss/vite';
import { fileURLToPath } from 'node:url';

// Cloudflare Workers injects nothing at build time, so the site URL is an env
// var with the deployed workers.dev URL as default. Override SITE_URL when
// building for a custom domain.
const site = process.env.SITE_URL ?? 'https://atlas.scantest.workers.dev';

export default defineConfig({
  site,
  output: 'static',
  integrations: [
    react(),
    sitemap({
      filter: (page) => !page.includes('/admin'),
      // The asset server serves pages slash-less (html_handling:
      // drop-trailing-slash), so sitemap URLs must match the canonical form.
      serialize(item) {
        const url = new URL(item.url);
        if (url.pathname.length > 1) url.pathname = url.pathname.replace(/\/+$/, '');
        return { ...item, url: url.href };
      },
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
