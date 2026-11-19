import type { APIRoute } from 'astro';
import { loadSettings } from '../../lib/settings';

export const prerender = false;

// Public: tells the site which themes are on and which is the default.
export const GET: APIRoute = () => {
  const s = loadSettings();
  return new Response(JSON.stringify({ enabled: s.enabled, def: s.defaultTheme }), { headers: { 'Content-Type': 'application/json', 'Cache-Control': 'public, max-age=60' } });
};
