import type { APIRoute } from 'astro';
import { isAuthed, sameOrigin } from '../../../lib/admin';
import { loadSettings, sanitizeSettings, saveSettings } from '../../../lib/settings';
import { json } from '../../../lib/mail';

export const prerender = false;

export const GET: APIRoute = ({ request }) => (isAuthed(request) ? json(loadSettings()) : json({ error: 'Not signed in.' }, 401));

export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid data.' }, 400);
  const s = sanitizeSettings({ ...body, v: 2 }); // the form always sends the full list
  try { saveSettings(s); } catch { return json({ error: 'Could not save on the server. Check that DATA_DIR is writable.' }, 500); }
  return json({ ok: true, ...s });
};
