import nodemailer from 'nodemailer';

// In-memory per-IP rate limit (fine for a single-process brochure site).
const hits = new Map<string, number[]>();
export function rateLimited(ip: string, max = 5, windowMs = 600_000) {
  const now = Date.now();
  const recent = (hits.get(ip) ?? []).filter((t) => now - t < windowMs);
  if (recent.length >= max) return true;
  hits.set(ip, [...recent, now]);
  return false;
}

export const clean = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
export const json = (body: object, status = 200) =>
  new Response(JSON.stringify(body), { status, headers: { 'Content-Type': 'application/json' } });

export function mailConfigured() {
  const { SMTP_HOST, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  return Boolean(SMTP_HOST && SMTP_USER && SMTP_PASS && CONTACT_TO);
}

export interface MailOptions {
  subject: string;
  text: string;
  html?: string;
  replyTo?: string;
  /** Send to this address instead of the firm's CONTACT_TO (e.g. a confirmation to the visitor). */
  to?: string;
  /** Also copy CONTACT_CC. Defaults to true for mail sent to the firm. */
  cc?: boolean;
  /** A calendar invite, shown by Gmail/Outlook as an event with an "Add to calendar" button. */
  icalEvent?: { method: string; content: string; filename?: string };
}

export async function sendMail(opts: MailOptions) {
  const { SMTP_HOST, SMTP_PORT, SMTP_USER, SMTP_PASS, CONTACT_TO } = process.env;
  const port = Number(SMTP_PORT) || 465;
  const transport = nodemailer.createTransport({
    host: SMTP_HOST,
    port,
    secure: port === 465,
    auth: { user: SMTP_USER, pass: SMTP_PASS },
  });
  const toFirm = !opts.to;
  await transport.sendMail({
    from: `"S.R. Garimella & Co." <${SMTP_USER}>`,
    to: opts.to || CONTACT_TO,
    cc: toFirm && opts.cc !== false ? process.env.CONTACT_CC || undefined : undefined,
    replyTo: opts.replyTo,
    subject: opts.subject,
    text: opts.text,
    html: opts.html,
    icalEvent: opts.icalEvent,
  });
}
