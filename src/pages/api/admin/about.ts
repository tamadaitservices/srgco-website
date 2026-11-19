import type { APIRoute } from 'astro';
import { isAuthed, sameOrigin } from '../../../lib/admin';
import { loadAbout, sanitize, saveAbout } from '../../../lib/about';
import { json } from '../../../lib/mail';

export const prerender = false;

export const GET: APIRoute = ({ request }) => (isAuthed(request) ? json(loadAbout()) : json({ error: 'Not signed in.' }, 401));

export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid data.' }, 400);
  try {
    saveAbout(sanitize(body));
  } catch (e) {
    return json({ error: 'Could not save on the server. Check that DATA_DIR is writable.' }, 500);
  }
  return json({ ok: true });
};
