import type { APIRoute } from 'astro';
import { clean, json, mailConfigured, rateLimited, sendMail } from '../../lib/mail';
import { CATEGORIES } from '../../data/compliance';

export const prerender = false;

// Compliance-reminder signup: tells the firm who to remind, and confirms to the subscriber.
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress || 'unknown', 4)) return json({ error: 'Too many requests. Please try again later.' }, 429);
  let body: Record<string, unknown>;
  try { body = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (clean(body.website, 50)) return json({ ok: true }); // honeypot

  const email = clean(body.email, 160);
  const name = clean(body.name, 120);
  if (!/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please enter a valid email address.' }, 400);
  const cats = (Array.isArray(body.categories) ? body.categories : []).map((c) => String(c)).filter((c) => (CATEGORIES as string[]).includes(c));
  const list = cats.length ? cats.join(', ') : 'All categories';

  if (!mailConfigured()) { console.error('Subscribe: SMTP env vars not configured'); return json({ error: 'unavailable' }, 503); }
  try {
    await sendMail({
      subject: `Compliance reminder signup: ${email}`,
      replyTo: email,
      text: `New compliance-reminder signup\n\nEmail: ${email}\nName: ${name || '-'}\nWants reminders for: ${list}\n\nAdd this address to the reminder / newsletter list.`,
    });
    // Courtesy confirmation to the subscriber (best effort).
    sendMail({
      to: email,
      subject: 'You are on the S.R. Garimella & Co. reminder list',
      text: `Thank you${name ? ', ' + name : ''}.\n\nWe have added you to our compliance reminder list for: ${list}.\nOur team will send you the key due dates ahead of time. You can reply to this email at any time to change your choices or stop.\n\nS.R. Garimella & Co., Chartered Accountants\nHyderabad · Vijayawada`,
    }).catch(() => {});
    return json({ ok: true });
  } catch (err) {
    console.error('Subscribe failed', err);
    return json({ error: 'send-failed' }, 500);
  }
};
