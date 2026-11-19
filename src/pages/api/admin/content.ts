import type { APIRoute } from 'astro';
import { isAuthed, sameOrigin } from '../../../lib/admin';
import { getOffices, getServices, ICONS, saveContent } from '../../../lib/content';
import { json } from '../../../lib/mail';

export const prerender = false;

export const GET: APIRoute = ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  return json({ offices: getOffices(), services: getServices(), icons: ICONS });
};

// Body: { offices?: [...], services?: [...] }. Only what is sent is replaced.
export const PUT: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  const body = await request.json().catch(() => null);
  if (!body) return json({ error: 'Invalid data.' }, 400);
  if (Array.isArray(body.offices) && !body.offices.some((o: any) => String(o?.city ?? '').trim())) return json({ error: 'Add at least one office.' }, 400);
  if (Array.isArray(body.services) && !body.services.some((s: any) => String(s?.title ?? '').trim())) return json({ error: 'Add at least one service.' }, 400);
  try {
    saveContent({ offices: Array.isArray(body.offices) ? body.offices : undefined, services: Array.isArray(body.services) ? body.services : undefined });
  } catch {
    return json({ error: 'Could not save on the server. Check that DATA_DIR is writable.' }, 500);
  }
  return json({ ok: true, offices: getOffices(), services: getServices() });
};
