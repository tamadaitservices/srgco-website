import type { APIRoute } from 'astro';
import fs from 'node:fs';
import { isAuthed } from '../../../lib/admin';
import { dataDir } from '../../../lib/about';
import { json, mailConfigured } from '../../../lib/mail';

export const prerender = false;

// Health checks shown on the admin Overview.
export const GET: APIRoute = ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  let storage = false;
  try { fs.mkdirSync(dataDir(), { recursive: true }); fs.accessSync(dataDir(), fs.constants.W_OK); storage = true; } catch { /* not writable */ }
  return json({ mail: mailConfigured(), storage, customStorage: Boolean(process.env.DATA_DIR) });
};
