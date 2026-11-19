import type { APIRoute } from 'astro';
import { clearCookie } from '../../../lib/admin';

export const prerender = false;

export const POST: APIRoute = () => new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': clearCookie() } });
