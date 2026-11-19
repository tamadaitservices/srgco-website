import type { APIRoute } from 'astro';
import { adminEmail, adminEnabled, resetToken, safeEqual, sameOrigin } from '../../../lib/admin';
import { clean, json, mailConfigured, rateLimited, sendMail } from '../../../lib/mail';

export const prerender = false;

// Emails a reset link to the administrator. The reply never reveals whether the address matched.
export const POST: APIRoute = async ({ request, clientAddress, url }) => {
  if (!sameOrigin(request)) return json({ error: 'Bad request.' }, 403);
  if (rateLimited('admin-forgot:' + (clientAddress || 'x'), 3, 900_000)) return json({ error: 'Too many requests. Try again later.' }, 429);
  const b = await request.json().catch(() => ({}));
  const email = clean(b.email, 160).toLowerCase();
  if (adminEnabled() && mailConfigured() && email && safeEqual(email, adminEmail())) {
    const link = `${url.origin}/admin?reset=${encodeURIComponent(resetToken())}`;
    try {
      await sendMail({ to: adminEmail(), cc: false, subject: 'Reset your admin password', text: `Use this link within 30 minutes to choose a new admin password:\n\n${link}\n\nIf you did not ask for this, ignore this email.` });
    } catch { /* keep the reply generic */ }
  }
  return json({ ok: true, message: 'If that address is the administrator, a reset link has been emailed.' });
};
