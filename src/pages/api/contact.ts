import type { APIRoute } from 'astro';
import { clean, json, mailConfigured, rateLimited, sendMail } from '../../lib/mail';

export const prerender = false;

export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress || 'unknown')) return json({ error: 'Too many requests. Please try again later.' }, 429);

  const form = await request.formData();
  if (clean(form.get('website'), 50)) return json({ ok: true }); // honeypot

  const name = clean(form.get('name'), 120);
  const email = clean(form.get('email'), 160);
  const phone = clean(form.get('phone'), 30);
  const topic = clean(form.get('topic'), 120);
  const message = clean(form.get('message'), 3000);
  // type-specific answers arrive as fields named "d:<Label>"
  const details: string[] = [];
  for (const [k, v] of form.entries()) {
    if (k.startsWith('d:') && details.length < 8) {
      const val = clean(v, 200);
      if (val) details.push(`${clean(k.slice(2), 60)}: ${val}`);
    }
  }
  if (!name || !/^\S+@\S+\.\S+$/.test(email) || !message) return json({ error: 'Please fill in name, a valid email and a message.' }, 400);
  if (!mailConfigured()) {
    console.error('Contact form: SMTP env vars not configured');
    return json({ error: 'Messaging is temporarily unavailable. Please call or email us.' }, 503);
  }
  try {
    await sendMail({
      subject: `Website enquiry from ${name}${topic ? ' — ' + topic : ''}`,
      replyTo: `"${name}" <${email}>`,
      text: `Name: ${name}\nEmail: ${email}\nPhone: ${phone || '-'}\nTopic: ${topic || '-'}\n${details.length ? '\nDetails\n' + details.map((d) => '  ' + d).join('\n') + '\n' : ''}\n${message}`,
    });
    return json({ ok: true });
  } catch (err) {
    console.error('Contact form send failed', err);
    return json({ error: 'Could not send your message. Please call or email us.' }, 500);
  }
};
