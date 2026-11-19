import type { APIRoute } from 'astro';
import { clean, json, mailConfigured, rateLimited, sendMail } from '../../lib/mail';
import { buildIcs } from '../../lib/ics';
import { BOOKING, slotsOn, toUtc, fmtDay, fmtTime } from '../../data/booking';
import { getBookingModes, getOffices } from '../../lib/content';

export const prerender = false;

// Appointment REQUEST: emails the firm a calendar invite (Gmail shows it as an event with
// Yes/No buttons, and adds it to the partner's Google Calendar), and emails the visitor a copy.
export const POST: APIRoute = async ({ request, clientAddress }) => {
  if (rateLimited(clientAddress || 'unknown', 4)) return json({ error: 'Too many requests. Please try again later.' }, 429);
  let b: Record<string, unknown>;
  try { b = await request.json(); } catch { return json({ error: 'Invalid request.' }, 400); }
  if (clean(b.website, 50)) return json({ ok: true }); // honeypot

  const date = clean(b.date, 10), time = clean(b.time, 5);
  const mode = getBookingModes().find((m) => m.id === clean(b.mode, 20));
  const name = clean(b.name, 120), phone = clean(b.phone, 30), email = clean(b.email, 160);
  const topic = clean(b.topic, 120) || 'General discussion', note = clean(b.note, 800);
  const digits = phone.replace(/\D/g, '');
  if (!/^\d{4}-\d{2}-\d{2}$/.test(date) || !/^\d{2}:\d{2}$/.test(time)) return json({ error: 'Please choose a date and time.' }, 400);
  if (!slotsOn(date).includes(time)) return json({ error: 'That time is no longer available. Please pick another slot.' }, 409);
  if (!mode) return json({ error: 'Please choose how you would like to meet.' }, 400);
  if (name.length < 2 || digits.length < 10 || digits.length > 13) return json({ error: 'Please check your name and phone number.' }, 400);
  if (email && !/^\S+@\S+\.\S+$/.test(email)) return json({ error: 'Please check your email address.' }, 400);
  if (!mailConfigured()) { console.error('Booking: SMTP env vars not configured'); return json({ error: 'unavailable' }, 503); }

  const start = toUtc(date, time);
  const end = new Date(start.getTime() + BOOKING.slotMinutes * 60000);
  const office = getOffices().find((o) => o.slug === mode.id);
  const location = office ? `${office.city} office — ${(office.address || []).join(', ')}, ${office.postal}` : mode.id === 'phone' ? `Phone call — ${phone}` : 'Video call (link to be shared)';
  const when = `${fmtDay(date)} at ${fmtTime(time)} IST`;
  const organizer = process.env.SMTP_USER!;
  const uid = `${date}-${time.replace(':', '')}-${Date.now()}@srgco.in`;
  const description = [`Requested by: ${name}`, `Phone: ${phone}`, `Email: ${email || '-'}`, `Topic: ${topic}`, `Mode: ${mode.label}`, note ? `Note: ${note}` : ''].filter(Boolean).join('\n');

  try {
    await sendMail({
      subject: `Appointment request: ${name} — ${when}`,
      replyTo: email ? `"${name}" <${email}>` : undefined,
      text: `New appointment request\n\nWhen:  ${when}\nMode:  ${mode.label}\nWhere: ${location}\n\nName:  ${name}\nPhone: ${phone}\nEmail: ${email || '-'}\nTopic: ${topic}\n${note ? '\nNote:  ' + note + '\n' : ''}\nA calendar invite is attached — accept it to add the event to your calendar, then confirm with the visitor.`,
      icalEvent: { method: 'REQUEST', content: buildIcs({ uid, start, end, summary: `Consultation request: ${name} (${topic})`, description, location, organizer, attendees: [{ email: process.env.CONTACT_TO! }], method: 'REQUEST' }) },
    });
    if (email) {
      sendMail({
        to: email,
        subject: `Your appointment request — ${when}`,
        text: `Dear ${name},\n\nThank you for requesting an appointment with S.R. Garimella & Co.\n\nRequested time: ${when}\nMode: ${mode.label}\n${office ? 'Where: ' + location + '\n' : ''}Topic: ${topic}\n\nOur team will confirm this by phone or email shortly. Until then, the attached calendar entry is marked tentative.\n\nIf you need to change the time, just reply to this email or call us.\n\nS.R. Garimella & Co., Chartered Accountants\nHyderabad · Vijayawada`,
        icalEvent: { method: 'PUBLISH', content: buildIcs({ uid, start, end, summary: 'Consultation with S.R. Garimella & Co. (to be confirmed)', description: `Topic: ${topic}\nMode: ${mode.label}`, location, organizer, attendees: [], method: 'PUBLISH' }) },
      }).catch(() => {});
    }
    return json({ ok: true, when });
  } catch (err) {
    console.error('Booking failed', err);
    return json({ error: 'send-failed' }, 500);
  }
};
