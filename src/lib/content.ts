// Offices (address, phones, map) and services that the client edits from /admin.
// Saved as DATA_DIR/content.json; until something is saved, the defaults in data/site.ts are used.
import fs from 'node:fs';
import path from 'node:path';
import { offices as DEFAULT_OFFICES, services as DEFAULT_SERVICES, enquiryTypes as STATIC_ENQUIRY_TYPES, type Service, type EnquiryType } from '../data/site';
import { dataDir } from './about';

export interface OfficeX {
  slug: string;
  city: string;
  region: string;
  /** Show the full address on the contact page, footer, home page and map. */
  primary: boolean;
  address: string[];
  postal: string;
  phones: string[];
  email: string;
  mapLink: string;
  lat: number | null;
  lng: number | null;
  // derived (not stored)
  tel: string;
  telHref: string;
}
export const ICONS = ['glasses', 'gavel', 'globe', 'receipt', 'stamp', 'building', 'chart', 'calculator', 'shield', 'briefcase', 'scales', 'arrows', 'cap', 'bulb'];

/** "040-66462292" or "98480 12345" or "+91 98480 12345" -> "+914066462292" style dial string. */
export function telHref(raw: string) {
  let d = String(raw || '').replace(/[^\d+]/g, '');
  if (!d) return '';
  if (d.startsWith('+')) return d;
  if (d.startsWith('91') && d.length >= 12) return '+' + d;
  if (d.startsWith('0')) d = d.slice(1);
  return '+91' + d;
}

const slugify = (s: string) => s.toLowerCase().replace(/&/g, ' and ').replace(/[^a-z0-9]+/g, '-').replace(/^-+|-+$/g, '').slice(0, 60);
const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const arr = <T>(v: unknown, n: number, f: (x: any) => T): T[] => (Array.isArray(v) ? v.slice(0, n).map(f) : []);
const num = (v: unknown) => { const n = typeof v === 'number' ? v : parseFloat(String(v ?? '')); return Number.isFinite(n) ? n : null; };

function derive(o: Omit<OfficeX, 'tel' | 'telHref'>): OfficeX {
  return { ...o, tel: o.phones[0] || '', telHref: telHref(o.phones[0] || '') };
}
const defaultOffices = (): OfficeX[] =>
  DEFAULT_OFFICES.map((o) => derive({ slug: o.slug, city: o.city, region: o.region, primary: o.primary, address: o.address ?? [], postal: o.postal ?? '', phones: o.tel ? [o.tel] : [], email: o.email ?? '', mapLink: '', lat: o.geo?.lat ?? null, lng: o.geo?.lng ?? null }));
const defaultServices = (): Service[] => DEFAULT_SERVICES.map((s) => ({ ...s, groups: s.groups.map((g) => ({ heading: g.heading, items: [...g.items] })) }));

export function sanitizeOffices(raw: unknown): OfficeX[] {
  const seen = new Set<string>();
  const out: OfficeX[] = [];
  for (const o of Array.isArray(raw) ? raw.slice(0, 12) : []) {
    const city = str(o?.city, 60);
    if (!city) continue;
    let slug = slugify(str(o?.slug, 60) || city) || 'office';
    while (seen.has(slug)) slug += '-2';
    seen.add(slug);
    const mapLink = str(o?.mapLink, 500);
    out.push(derive({
      slug, city, region: str(o?.region, 60), primary: o?.primary !== false && o?.primary !== 'false',
      address: arr(o?.address, 6, (l) => str(l, 120)).filter(Boolean), postal: str(o?.postal, 12),
      phones: arr(o?.phones, 6, (p) => str(p, 30)).filter(Boolean), email: /^\S+@\S+\.\S+$/.test(str(o?.email, 160)) ? str(o?.email, 160) : '',
      mapLink: /^https:\/\/[^\s"'<>]+$/.test(mapLink) ? mapLink : '', lat: num(o?.lat), lng: num(o?.lng),
    }));
  }
  return out;
}

export function sanitizeServices(raw: unknown): Service[] {
  const seen = new Set<string>();
  const out: Service[] = [];
  for (const s of Array.isArray(raw) ? raw.slice(0, 30) : []) {
    const title = str(s?.title, 100);
    if (!title) continue;
    let slug = slugify(str(s?.slug, 60) || title) || 'service';
    while (seen.has(slug)) slug += '-2';
    seen.add(slug);
    out.push({
      slug, title, short: str(s?.short, 220), icon: ICONS.includes(s?.icon) ? s.icon : 'briefcase',
      seoTitle: str(s?.seoTitle, 120) || `${title} in Hyderabad & Vijayawada`,
      seoDescription: str(s?.seoDescription, 300) || str(s?.short, 220),
      intro: str(s?.intro, 600),
      groups: arr(s?.groups, 8, (g) => ({ heading: str(g?.heading, 100), items: arr(g?.items, 30, (i) => str(i, 220)).filter(Boolean) })).filter((g) => g.heading || g.items.length),
    });
  }
  return out;
}

interface Stored { offices?: unknown; services?: unknown }
let cache: { m: number; data: Stored } | null = null;
const file = () => path.join(dataDir(), 'content.json');
function stored(): Stored {
  try {
    const m = fs.statSync(file()).mtimeMs;
    if (cache && cache.m === m) return cache.data;
    const data = JSON.parse(fs.readFileSync(file(), 'utf8'));
    cache = { m, data };
    return data;
  } catch {
    return {};
  }
}

export function getOffices(): OfficeX[] {
  const s = stored().offices;
  return Array.isArray(s) ? sanitizeOffices(s) : defaultOffices();
}
export function getServices(): Service[] {
  const s = stored().services;
  return Array.isArray(s) ? sanitizeServices(s) : defaultServices();
}

export function saveContent(patch: { offices?: OfficeX[]; services?: Service[] }) {
  const cur = stored();
  const next = { ...cur, ...(patch.offices ? { offices: sanitizeOffices(patch.offices) } : {}), ...(patch.services ? { services: sanitizeServices(patch.services) } : {}) };
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify(next, null, 2));
  cache = null;
}

/** Enquiry types follow the service list: renamed services keep their form, new services get a simple one. */
export function getEnquiryTypes(): EnquiryType[] {
  const services = getServices();
  const bySlug = new Map(STATIC_ENQUIRY_TYPES.map((t) => [t.slug, t]));
  const out: EnquiryType[] = services.map((s) => {
    const t = bySlug.get(s.slug);
    return t
      ? { ...t, title: s.title }
      : { slug: s.slug, chip: s.title.length > 18 ? s.title.split(/[&,]| and /)[0].trim() : s.title, title: s.title, docTitle: `${s.title} Enquiry`, fields: [], enclosures: ['PAN and identity documents', 'Latest financial statements, if any', 'Any notices or correspondence received'] };
  });
  const other = bySlug.get('other');
  if (other) out.push(other);
  return out;
}

/** Google Maps links for an office. A map pin (lat/lng) is the most exact; otherwise the address is searched. */
export function mapLinks(o: Pick<OfficeX, 'city' | 'address' | 'postal' | 'lat' | 'lng' | 'mapLink'>) {
  const text = [...o.address, `${o.city} ${o.postal}`.trim(), 'India'].join(', ');
  const q = o.lat != null && o.lng != null ? `${o.lat},${o.lng}` : `S.R. Garimella & Co., ${text}`;
  const enc = encodeURIComponent(q);
  return {
    embed: `https://maps.google.com/maps?q=${enc}&z=16&output=embed`,
    open: o.mapLink || `https://www.google.com/maps/search/?api=1&query=${enc}`,
    dir: o.mapLink || `https://www.google.com/maps/dir/?api=1&destination=${enc}`,
  };
}

/** Ways to meet for the booking page: phone, video, plus a visit option for each office that has an address. */
export function getBookingModes() {
  const offices = getOffices().filter((o) => o.primary && o.address.length);
  return [
    { id: 'phone', label: 'Phone call' },
    { id: 'video', label: 'Video call' },
    ...offices.map((o) => ({ id: o.slug, label: `Visit – ${o.city} office` })),
  ];
}
/** The number shown for "call us" (first phone of the first office that has one). */
export function mainPhone() {
  const o = getOffices().find((x) => x.phones[0]);
  return o ? { tel: o.phones[0], href: telHref(o.phones[0]), city: o.city } : { tel: '', href: '', city: '' };
}
