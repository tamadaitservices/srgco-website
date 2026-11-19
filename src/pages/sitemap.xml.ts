import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';
import { getOffices, getServices } from '../lib/content';

// Built on request so new services and offices added in /admin are listed straight away.
export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://srgco.in')).toString().replace(/\/$/, '');
  const notes = await getCollection('notes', ({ data }) => !data.draft);
  const paths = [
    '/', '/about', '/services', ...getServices().map((s) => `/services/${s.slug}`), '/industries', '/team', '/contact', '/book',
    '/tools', '/tools/income-tax-calculator', '/tools/gst-calculator', '/tools/hra-calculator', '/tools/tds-calculator',
    '/compliance-calendar', '/health-check', '/insights', ...notes.map((n) => `/insights/${n.id}`),
    ...getOffices().map((o) => `/chartered-accountants-${o.slug}`),
  ];
  const urls = paths.map((p) => `<url><loc>${base}${p}</loc></url>`).join('');
  return new Response(`<?xml version="1.0" encoding="UTF-8"?><urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">${urls}</urlset>`, { headers: { 'Content-Type': 'application/xml' } });
};
