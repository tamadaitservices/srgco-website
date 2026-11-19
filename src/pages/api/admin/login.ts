import type { APIRoute } from 'astro';
import { checkLogin, sessionCookie, sameOrigin, adminEnabled } from '../../../lib/admin';
import { json, rateLimited } from '../../../lib/mail';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!adminEnabled()) return json({ error: 'Admin is not enabled on this server.' }, 503);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  if (rateLimited('admin:' + (clientAddress || 'x'), 8, 900_000)) return json({ error: 'Too many attempts. Try again in a few minutes.' }, 429);
  const b = await request.json().catch(() => ({}));
  if (!checkLogin(String(b.email ?? ''), String(b.password ?? ''))) return json({ error: 'Incorrect email or password.' }, 401);
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie() } });
};
