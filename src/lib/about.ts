// About-page content that the client can edit from /admin.
// Stored as JSON on the server (DATA_DIR), falling back to the defaults below.
import fs from 'node:fs';
import path from 'node:path';
import { firm, timeline, values, promises } from '../data/site';

export interface Founder { name: string; role: string; bio: string; photo: string }
export interface Photo { src: string; caption: string }
export interface AboutData {
  description: string;
  approach: string;
  founders: Founder[];
  photos: Photo[];
  timeline: { year: string; text: string }[];
  values: string[];
  promises: string[];
}

export const DEFAULT_ABOUT: AboutData = {
  description: firm.description,
  approach: firm.approach,
  founders: [
    { name: 'Late Sri Garimella Someswara Rao, FCA', role: 'Founder, 1989', bio: 'Founded the firm in 1989. His commitment to integrity and professional excellence remains the foundation of the practice.', photo: '' },
    { name: 'D.P. Sai Sandeep Garimella', role: 'Partner, B.Com, FCA, CISA, Dip. Int Tax (ICAI)', bio: 'With the firm since 2011. Focus areas: direct tax, assurance and international tax. Certified in international taxation, forensic accounting and concurrent bank audit.', photo: '' },
  ],
  photos: [],
  timeline: timeline.map((t) => ({ ...t })),
  values: values.map((v) => v.name),
  promises: [...promises],
};

export const dataDir = () => path.resolve(process.env.DATA_DIR || path.join(process.cwd(), 'data'));
const file = () => path.join(dataDir(), 'about.json');

const str = (v: unknown, max: number) => String(v ?? '').trim().slice(0, max);
const arr = <T>(v: unknown, n: number, f: (x: any) => T): T[] => (Array.isArray(v) ? v.slice(0, n).map(f) : []);

/** Validate and normalise anything that comes from the admin form or disk. */
export function sanitize(raw: any): AboutData {
  const d = DEFAULT_ABOUT;
  const imgOk = (s: string) => (/^\/media\/[\w.-]+$/.test(s) || /^https:\/\/[^\s"'<>]+$/.test(s) ? s : '');
  return {
    description: str(raw?.description, 1500) || d.description,
    approach: str(raw?.approach, 1500) || d.approach,
    founders: arr(raw?.founders, 8, (f) => ({ name: str(f?.name, 120), role: str(f?.role, 160), bio: str(f?.bio, 1200), photo: imgOk(str(f?.photo, 300)) })).filter((f) => f.name),
    photos: arr(raw?.photos, 24, (p) => ({ src: imgOk(str(p?.src, 300)), caption: str(p?.caption, 160) })).filter((p) => p.src),
    timeline: arr(raw?.timeline, 20, (t) => ({ year: str(t?.year, 20), text: str(t?.text, 400) })).filter((t) => t.year && t.text),
    values: arr(raw?.values, 16, (v) => str(v, 60)).filter(Boolean),
    promises: arr(raw?.promises, 12, (v) => str(v, 200)).filter(Boolean),
  };
}

export function loadAbout(): AboutData {
  try {
    return sanitize(JSON.parse(fs.readFileSync(file(), 'utf8')));
  } catch {
    return DEFAULT_ABOUT;
  }
}

export function saveAbout(data: AboutData) {
  fs.mkdirSync(dataDir(), { recursive: true });
  fs.writeFileSync(file(), JSON.stringify(data, null, 2));
}
