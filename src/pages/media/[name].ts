import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import { dataDir } from '../../lib/about';

export const prerender = false;
const TYPES: Record<string, string> = { jpg: 'image/jpeg', png: 'image/png', webp: 'image/webp' };

// Serves images uploaded through /admin.
export const GET: APIRoute = ({ params }) => {
  const name = String(params.name || '');
  if (!/^[\w-]+\.(jpg|png|webp)$/.test(name)) return new Response('Not found', { status: 404 });
  try {
    const buf = fs.readFileSync(path.join(dataDir(), 'uploads', name));
    return new Response(buf, { headers: { 'Content-Type': TYPES[name.split('.').pop()!], 'Cache-Control': 'public, max-age=31536000, immutable', 'X-Content-Type-Options': 'nosniff' } });
  } catch {
    return new Response('Not found', { status: 404 });
  }
};
