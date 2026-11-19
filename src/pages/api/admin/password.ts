import type { APIRoute } from 'astro';
import { checkPassword, isAuthed, passwordProblem, sameOrigin, sessionCookie, setPassword } from '../../../lib/admin';
import { json, rateLimited } from '../../../lib/mail';

export const prerender = false;

// Change the password while signed in (needs the current password).
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  if (rateLimited('admin-pw:' + (clientAddress || 'x'), 6, 900_000)) return json({ error: 'Too many attempts. Try again later.' }, 429);
  const b = await request.json().catch(() => ({}));
  if (!checkPassword(String(b.current ?? ''))) return json({ error: 'The current password is not correct.' }, 400);
  const next = String(b.next ?? '');
  const problem = passwordProblem(next);
  if (problem) return json({ error: problem }, 400);
  try { setPassword(next); } catch { return json({ error: 'Could not save on the server. Check that DATA_DIR is writable.' }, 500); }
  // the old session is now invalid; hand back a fresh one
  return new Response(JSON.stringify({ ok: true }), { headers: { 'Content-Type': 'application/json', 'Set-Cookie': sessionCookie() } });
};
