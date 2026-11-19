# S.R. Garimella & Co. — Website

Marketing site for S.R. Garimella & Co., Chartered Accountants (Hyderabad, Vijayawada).
Built with [Astro](https://astro.build) (pre-rendered pages + a small Node server for the enquiry APIs), Tailwind CSS v4.

## Features
- Four selectable themes: **Navy & Copper** (default), Ledger (light), Night (dark), Emerald.
- Contact page with a live "enquiry letter" that changes per enquiry type.
- Chat enquiry assistant + WhatsApp button (floating, every page).
- SEO: per-page titles/descriptions, canonical URLs, JSON-LD, sitemap, robots.txt.

## Maintaining the content features

| Feature | Where | What to keep updated |
| --- | --- | --- |
| Tax calculators (`/tools/...`) | `src/lib/tax.ts` | **Slabs, rebate and cess for the new financial year** (after each Union Budget). Then run `npm run check`. Currently set for FY 2025-26. |
| Compliance calendar | `src/data/compliance.ts` | Due dates when the government extends or changes them. |
| Notes (`/insights`) | `src/content/notes/*.md` | Add a new `.md` file (copy an existing one's front-matter) and push. Set `draft: true` to hide it. |
| Health check | `src/data/health.ts` | Questions, tips and the service each one links to. |
| Booking (`/book`) | `src/data/booking.ts` | Working days, hours, slot length, lead time, meeting modes. |
| Enquiry types & checklists | `src/data/site.ts` (`enquiryTypes`) | Fields and "documents to keep ready" per service. |
| Languages (English / Telugu / Hindi) | `src/i18n/dict.ts` | Add a row `[English, Telugu, Hindi]` for any new visible text. Translations are **drafts — have a native speaker review them**. |

### How booking, reminders and enquiries reach the firm
All forms email the address in `CONTACT_TO` (and `CONTACT_CC`) through the SMTP mailbox. A booking arrives as a **calendar invite** (open it in Gmail/Outlook and accept to add it to the calendar) and the visitor gets a tentative copy if they gave an email. Slots are *requests* — the site does not check live calendar availability. The reminder list signup emails the firm the subscriber's address; sending the reminders themselves is manual (or connect a mailing-list service later).

## Develop
```bash
npm install
npm run dev        # http://localhost:4321
npm run build      # outputs dist/
npm start          # serves the production build (node dist/server/entry.mjs)
npm run check      # self-tests for the tax calculators and booking slots
```
Requires Node 22.23.4 or newer (Astro 7).

## Deploy on Hostinger (Node.js web app, GitHub connected)
| Setting | Value |
| --- | --- |
| Framework | Astro / Other (Node.js) |
| Node version | 24.x (or 22.x, must be >= 22.23.4) |
| Install command | `npm install` |
| Build command | `npm run build` |
| Output directory | `dist` |
| Entry file | `server/entry.mjs` (**relative to the output directory** — `dist/server/entry.mjs` makes Hostinger fail with "Entry file not found") |

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


## Admin console

Open `/admin`. It has its own tricolour-themed sign-in and dashboard, separate from the public site.

* **Sign-in:** the email in `ADMIN_EMAIL` and the password in `ADMIN_PASSWORD` (environment variables). If `ADMIN_PASSWORD` is empty the admin is switched off.
* **About page:** edit text, founders and partners (with photos), gallery, timeline, values and promise. Changes show immediately.
* **Offices & phones:** edit each office's city, address, PIN, phone/mobile numbers (several per office), email and map location (coordinates and/or a Google Maps link), add or remove offices, and choose which show their full address. These appear in the footer, contact page, home page, About-page map, city pages and booking options.
* **Services:** add, edit, reorder or remove services (name, icon, description, headings and bullet items, search-engine title/description). Each service gets its own page automatically, and appears in the footer, lists, chat topics and enquiry forms.
* **Appearance:** turn each colour theme on or off in the website's theme switcher, and choose the default theme for new visitors (at least one theme always stays on).
* **Security:** change the password (needs the current one). "Forgot password?" on the sign-in page emails a 30-minute reset link to the admin email (needs the SMTP settings). Once the password is changed or reset, only a salted hash is kept in `DATA_DIR/admin.json` and it replaces `ADMIN_PASSWORD`.
* **Storage:** edited content, settings, photos and the password hash live in `DATA_DIR` (default `./data`). **Set `DATA_DIR` to a folder outside the app folder** (for example `/home/<user>/srg-data`) so a re-deploy never erases them.

## Notes: banners and PDFs

In a note's front matter, add optional `banner: /notes/my-banner.jpg` and `pdf: /notes/my-circular.pdf` (place the files in `public/notes/`).
Without a banner, one is generated from the note's category. Every note has a "Save this note as PDF" button; notes with a `pdf` also get "View PDF" and "Download PDF".


## How pages are built

The site now runs in server mode (`output: 'server'`): every page is rendered on request, so anything saved in the admin shows immediately without a rebuild or redeploy.
Offices and services come from `DATA_DIR/content.json` (falling back to the defaults in `src/data/site.ts` until something is saved). `/sitemap.xml` is generated on request from the same data.
