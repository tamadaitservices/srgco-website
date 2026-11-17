# S.R. Garimella & Co. — Website

Marketing site for S.R. Garimella & Co., Chartered Accountants (Hyderabad, Vijayawada).
Built with [Astro](https://astro.build) (pre-rendered pages + a small Node server for the enquiry APIs), Tailwind CSS v4.

## Features
- Four selectable themes: **Navy & Copper** (default), Ledger (light), Night (dark), Emerald.
- Contact page with a live "enquiry letter" that changes per enquiry type.
- Chat enquiry assistant + WhatsApp button (floating, every page).
- SEO: per-page titles/descriptions, canonical URLs, JSON-LD, sitemap, robots.txt.

## Develop
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm start          # serves the production build (node dist/server/entry.mjs)
```
Requires Node 22.23.4 or newer (Astro 7).

## Deploy on Hostinger (Node.js web app, GitHub connected)
| Setting | Value |
| --- | --- |
| Framework | Astro / Other (Node.js) |
| Node version | 24.x (or 22.x, must be >= 22.23.4) |
| Install command | `npm install` |
| Build command | `npm run build` |
| Start command | `npm start` (runs `node dist/server/entry.mjs`) |
| Entry file | `dist/server/entry.mjs` |

Set `HOST=0.0.0.0` if Hostinger does not provide it; Hostinger supplies `PORT`.

### Environment variables (set in hPanel, never commit)
See `.env.example`.

| Variable | Purpose |
| --- | --- |
| `PUBLIC_SITE_URL` | Production URL, e.g. `https://srgco.in` (used for canonical URLs + sitemap) |
| `PUBLIC_WHATSAPP` | WhatsApp number, digits with country code, e.g. `919876543210` (button is hidden in production until set) |
| `SMTP_HOST`, `SMTP_PORT`, `SMTP_USER`, `SMTP_PASS` | Mailbox used to send enquiries |
| `CONTACT_TO` | Address that receives enquiries |
| `CONTACT_CC` | Optional second recipient |

`PUBLIC_*` values are read at **build time** — set them before the build runs, and redeploy after changing them.

## Content
All firm content (services, team, offices, enquiry types) lives in `src/data/site.ts`.

## Before going live
- Confirm the domain and set `PUBLIC_SITE_URL`.
- Add logo, partner and office photos.
- Review the per-service "documents to keep ready" lists in `src/data/site.ts` with the client.
