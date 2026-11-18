import type { APIRoute } from 'astro';
import { getCollection } from 'astro:content';

export const GET: APIRoute = async ({ site }) => {
  const base = (site ?? new URL('https://srgco.in')).toString().replace(/\/$/, '');
  const notes = (await getCollection('notes', ({ data }) => !data.draft)).sort((a, b) => b.data.date.valueOf() - a.data.date.valueOf());
  const esc = (s: string) => s.replace(/[&<>"']/g, (c) => ({ '&': '&amp;', '<': '&lt;', '>': '&gt;', '"': '&quot;', "'": '&apos;' }[c]!));
  const items = notes.map((n) => `<item><title>${esc(n.data.title)}</title><link>${base}/insights/${n.id}</link><guid>${base}/insights/${n.id}</guid><pubDate>${n.data.date.toUTCString()}</pubDate><description>${esc(n.data.description)}</description></item>`).join('');
  const xml = `<?xml version="1.0" encoding="UTF-8"?><rss version="2.0"><channel><title>Notes — S.R. Garimella &amp; Co.</title><link>${base}/insights</link><description>Tax, audit and compliance notes from S.R. Garimella &amp; Co., Chartered Accountants.</description>${items}</channel></rss>`;
  return new Response(xml, { headers: { 'Content-Type': 'application/rss+xml; charset=utf-8' } });
};
