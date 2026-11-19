import { defineCollection } from 'astro:content';
import { glob } from 'astro/loaders';
import { z } from 'astro/zod';

// Notes live as Markdown files in src/content/notes. To publish a note, add a new
// .md file there (see the existing ones for the front-matter fields) and push.
const notes = defineCollection({
  loader: glob({ pattern: '**/*.md', base: './src/content/notes' }),
  schema: z.object({
    title: z.string(),
    description: z.string().max(200),
    date: z.coerce.date(),
    category: z.string().default('Notes'),
    service: z.string().optional(), // slug of a related service page, e.g. gst-customs
    banner: z.string().optional(), // image in /public/notes, e.g. /notes/gst-banner.jpg (optional)
    pdf: z.string().optional(), // PDF in /public/notes, e.g. /notes/circular.pdf (optional)
    draft: z.boolean().default(false),
  }),
});

export const collections = { notes };
