// Appointment booking settings and helpers (used by the page AND the API).
// All times are Indian Standard Time (IST, UTC+05:30, no daylight saving).
export const BOOKING = {
  weekdays: [1, 2, 3, 4, 5, 6], // Mon–Sat (0 = Sunday)
  start: '10:00',
  end: '18:00', // last slot ends here
  slotMinutes: 30,
  minLeadHours: 3, // earliest slot is this many hours from now
  horizonDays: 21, // how far ahead people can book
  modes: [
    { id: 'phone', label: 'Phone call' },
    { id: 'video', label: 'Video call' },
    { id: 'hyderabad', label: 'Visit – Hyderabad office' },
    { id: 'vijayawada', label: 'Visit – Vijayawada office' },
  ],
};

const pad = (n: number) => String(n).padStart(2, '0');

export function slotTimes(): string[] {
  const [sh, sm] = BOOKING.start.split(':').map(Number);
  const [eh, em] = BOOKING.end.split(':').map(Number);
  const out: string[] = [];
  for (let m = sh * 60 + sm; m + BOOKING.slotMinutes <= eh * 60 + em; m += BOOKING.slotMinutes) out.push(`${pad(Math.floor(m / 60))}:${pad(m % 60)}`);
  return out;
}

/** Current date (YYYY-MM-DD) and minutes-since-midnight in IST. */
export function istParts(d = new Date()) {
  const f = new Intl.DateTimeFormat('en-CA', { timeZone: 'Asia/Kolkata', year: 'numeric', month: '2-digit', day: '2-digit', hour: '2-digit', minute: '2-digit', hourCycle: 'h23' });
  const p = Object.fromEntries(f.formatToParts(d).map((x) => [x.type, x.value]));
  return { date: `${p.year}-${p.month}-${p.day}`, minutes: Number(p.hour) * 60 + Number(p.minute) };
}

export const toUtc = (date: string, time: string) => new Date(`${date}T${time}:00+05:30`);
export const weekday = (date: string) => new Date(`${date}T12:00:00+05:30`).getUTCDay();
export function addDays(date: string, n: number) {
  const d = new Date(`${date}T12:00:00+05:30`);
  d.setUTCDate(d.getUTCDate() + n);
  return istParts(d).date;
}

export function slotsOn(date: string, now = new Date()): string[] {
  if (!BOOKING.weekdays.includes(weekday(date))) return [];
  const { date: today, minutes } = istParts(now);
  if (date < today) return [];
  const earliest = minutes + BOOKING.minLeadHours * 60;
  return slotTimes().filter((t) => {
    if (date > today) return true;
    const [h, m] = t.split(':').map(Number);
    return h * 60 + m >= earliest;
  });
}

export function availableDays(now = new Date()): string[] {
  const today = istParts(now).date;
  const out: string[] = [];
  for (let i = 0; i <= BOOKING.horizonDays; i++) {
    const d = addDays(today, i);
    if (slotsOn(d, now).length) out.push(d);
  }
  return out;
}

const MON = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
const WD = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
export const fmtDay = (date: string) => { const [, m, d] = date.split('-').map(Number); return `${WD[weekday(date)]}, ${d} ${MON[m - 1]}`; };
export const fmtTime = (t: string) => { const [h, m] = t.split(':').map(Number); return `${h % 12 || 12}:${pad(m)} ${h < 12 ? 'AM' : 'PM'}`; };
