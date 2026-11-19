import type { APIRoute } from 'astro';
import { passwordProblem, sameOrigin, sessionCookie, setPassword, validResetToken } from '../../../lib/admin';
import { json, rateLimited } from '../../../lib/mail';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  if (rateLimited('admin-reset:' + (clientAddress || 'x'), 6, 900_000)) return json({ error: 'Too many attempts. Try again later.' }, 429);
  const b = await request.json().catch(() => ({}));
  if (!validResetToken(String(b.token ?? ''))) return json({ error: 'This reset link has expired or was already used. Request a new one.' }, 400);
  const next = String(b.password ?? '');
  const problem = passwordProblem(next);
  if (problem) return json({ error: problem }, 400);
  try { setPassword(next); } catch { return json({ error: 'Could not save on the server. Check that DATA_DIR is writable.' }, 500); }
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie() } });
};
