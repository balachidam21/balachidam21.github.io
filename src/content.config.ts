import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

// For FUTURE markdown posts. The two existing deep-dives stay as .astro routes
// because their inline diagram styles and script are a working unit — see the
// Migration section of the design spec.
const writing = defineCollection({
  loader: glob({ pattern: '**/*.{md,mdx}', base: './src/content/writing' }),
  schema: z.object({
    title: z.string(),
    description: z.string(),
    date: z.coerce.date(),
    tags: z.array(z.string()).default([]),
    draft: z.boolean().default(false),
  }),
});

export const collections = { writing };
