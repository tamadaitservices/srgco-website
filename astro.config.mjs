// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// TODO: confirm the final production domain with the client.
const site = process.env.PUBLIC_SITE_URL || 'https://srgco.in';

// Pages are pre-rendered (static HTML) for speed + SEO.
// The Node adapter only serves them and runs the /api/contact endpoint.
export default defineConfig({
  site,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), sitemap()],
  vite: { plugins: [tailwindcss()] },
  server: { host: true },
});
