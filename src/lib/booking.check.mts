import { slotTimes, slotsOn, availableDays, istParts, weekday, fmtDay, fmtTime, toUtc } from '../data/booking.ts';
import { buildIcs } from './ics.ts';
import nodemailer from 'nodemailer';
const ok = (l: string, c: boolean, d = '') => console.log(c ? 'OK  ' : 'FAIL', l, d);
const s = slotTimes();
ok('16 slots 10:00..17:30', s.length === 16 && s[0] === '10:00' && s[15] === '17:30', s.join(' '));
// Wed 18 Nov 2026, 09:00 IST (03:30Z): earliest slot = 12:00 (3h lead)
const now = new Date('2026-11-18T03:30:00Z');
ok('IST parts', istParts(now).date === '2026-11-18' && istParts(now).minutes === 540, JSON.stringify(istParts(now)));
ok('today first slot 12:00', slotsOn('2026-11-18', now)[0] === '12:00');
ok('sunday has no slots', slotsOn('2026-11-22', now).length === 0 && weekday('2026-11-22') === 0);
ok('past day none', slotsOn('2026-11-17', now).length === 0);
const days = availableDays(now);
ok('days skip sundays, start today', days[0] === '2026-11-18' && !days.includes('2026-11-22') && days.length > 15, days.slice(0, 5).join(','));
// late evening: 17:00 IST today -> no slots today
ok('late today empty', slotsOn('2026-11-18', new Date('2026-11-18T11:30:00Z')).length === 0);
ok('format', fmtDay('2026-11-19') === 'Thu, 19 Nov' && fmtTime('14:30') === '2:30 PM' && fmtTime('10:00') === '10:00 AM', fmtDay('2026-11-19') + ' ' + fmtTime('14:30'));
const start = toUtc('2026-11-19', '11:30');
ok('toUtc 11:30 IST = 06:00Z', start.toISOString() === '2026-11-19T06:00:00.000Z', start.toISOString());
const ics = buildIcs({ uid: 'x@y', start, end: new Date(start.getTime() + 1800000), summary: 'Consultation, test', description: 'Line1\nLine2', location: 'Hyderabad office — Flat 304', organizer: 'a@b.in', attendees: [{ email: 'c@d.in' }], method: 'REQUEST' });
ok('ics structure', ics.includes('METHOD:REQUEST') && ics.includes('DTSTART:20261119T060000Z') && ics.includes('DTEND:20261119T063000Z') && ics.includes('SUMMARY:Consultation\\, test') && ics.includes('\r\n'));
// render the message exactly as nodemailer would send it
const t = nodemailer.createTransport({ jsonTransport: true });
const info = await t.sendMail({ from: 'a@b.in', to: 'c@d.in', subject: 'x', text: 'hi', icalEvent: { method: 'REQUEST', content: ics } });
const msg = JSON.parse(info.message);
ok('mail has calendar part', JSON.stringify(msg).includes('text/calendar') || JSON.stringify(msg).includes('icalEvent'), Object.keys(msg).join(','));
