import type { APIRoute } from 'astro';
import { clean, json, mailConfigured, rateLimited, sendMail } from '../../lib/mail';

export const prerender = false;

// Receives the enquiry collected by the on-site chat assistant and emails it to the firm.
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress || 'unknown', 4)) return json({ error: 'Too many requests. Please try again later.' }, 429);

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return json({ error: 'Invalid request.' }, 400);
  }
  if (clean(body.website, 50)) return json({ ok: true }); // honeypot

  const lead = {
    topic: clean(body.topic, 120),
    name: clean(body.name, 120),
    phone: clean(body.phone, 30),
    email: clean(body.email, 160),
    city: clean(body.city, 80),
    message: clean(body.message, 2000),
    page: clean(body.page, 200),
  };
  const phoneDigits = lead.phone.replace(/\D/g, '');
  if (!lead.name || phoneDigits.length < 8 || phoneDigits.length > 15) return json({ error: 'Please check your name and phone number.' }, 400);
  if (lead.email && !/^\S+@\S+\.\S+$/.test(lead.email)) return json({ error: 'Please check your email address.' }, 400);

  if (!mailConfigured()) {
    console.error('Lead bot: SMTP env vars not configured');
    return json({ error: 'unavailable' }, 503);
  }
  try {
    await sendMail({
      subject: `New enquiry (chat): ${lead.name} — ${lead.topic || 'General'}`,
      replyTo: lead.email ? `"${lead.name}" <${lead.email}>` : undefined,
      text: [
        'New enquiry from the website chat assistant',
        '-------------------------------------------',
        `Name:    ${lead.name}`,
        `Phone:   ${lead.phone}`,
        `Email:   ${lead.email || '-'}`,
        `City:    ${lead.city || '-'}`,
        `Topic:   ${lead.topic || '-'}`,
        `Message: ${lead.message || '-'}`,
        '',
        `Sent from page: ${lead.page || '-'}`,
        `Time: ${new Date().toLocaleString('en-IN', { timeZone: 'Asia/Kolkata' })} IST`,
      ].join('\n'),
    });
    return json({ ok: true });
  } catch (err) {
    console.error('Lead bot send failed', err);
    return json({ error: 'send-failed' }, 500);
  }
};
