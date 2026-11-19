// @ts-check
import { defineConfig } from 'astro/config';
import node from '@astrojs/node';
import sitemap from '@astrojs/sitemap';
import mdx from '@astrojs/mdx';
import tailwindcss from '@tailwindcss/vite';

// TODO: confirm the final production domain with the client.
// Tolerant of "srgco.in", trailing slashes, stray spaces or an empty value.
const FALLBACK_SITE = 'https://srgco.in';
function resolveSite(raw) {
  const v = (raw || '').trim();
  if (!v) return FALLBACK_SITE;
  try {
    return new URL(/^https?:\/\//i.test(v) ? v : `https://${v}`).origin;
  } catch {
    return FALLBACK_SITE;
  }
}
const site = resolveSite(process.env.PUBLIC_SITE_URL);

// Pages are pre-rendered (static HTML) for speed + SEO.
// The Node adapter only serves them and runs the /api/contact endpoint.
export default defineConfig({
  site,
  output: 'static',
  adapter: node({ mode: 'standalone' }),
  integrations: [mdx(), sitemap({ customPages: [`${site}/about`], filter: (page) => !page.includes('/admin') })],
  vite: { plugins: [tailwindcss()] },
  server: { host: true },
});
