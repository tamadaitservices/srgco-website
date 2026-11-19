import type { APIRoute } from 'astro';
import fs from 'node:fs';
import path from 'node:path';
import crypto from 'node:crypto';
import { isAuthed, sameOrigin } from '../../../lib/admin';
import { dataDir } from '../../../lib/about';
import { json } from '../../../lib/mail';

export const prerender = false;
const EXT: Record<string, string> = { 'image/jpeg': 'jpg', 'image/png': 'png', 'image/webp': 'webp' };
const MAX = 4 * 1024 * 1024;

export const POST: APIRoute = async ({ request }) => {
  if (!isAuthed(request)) return json({ error: 'Not signed in.' }, 401);
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  const form = await request.formData().catch(() => null);
  const f = form?.get('file');
  if (!(f instanceof File)) return json({ error: 'No file received.' }, 400);
  const ext = EXT[f.type];
  if (!ext) return json({ error: 'Please upload a JPG, PNG or WebP image.' }, 400);
  if (f.size > MAX) return json({ error: 'Image is larger than 4 MB. Please resize it.' }, 400);
  const buf = Buffer.from(await f.arrayBuffer());
  // check the real file signature, not just the declared type
  const ok = (ext === 'jpg' && buf[0] === 0xff && buf[1] === 0xd8) || (ext === 'png' && buf.subarray(1, 4).toString() === 'PNG') || (ext === 'webp' && buf.subarray(8, 12).toString() === 'WEBP');
  if (!ok) return json({ error: 'That file is not a valid image.' }, 400);
  const name = `${Date.now().toString(36)}-${crypto.randomBytes(4).toString('hex')}.${ext}`;
  const dir = path.join(dataDir(), 'uploads');
  fs.mkdirSync(dir, { recursive: true });
  fs.writeFileSync(path.join(dir, name), buf);
  return json({ url: `/media/${name}` });
};
