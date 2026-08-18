import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://balachidam21.github.io',
  base: '/',
  integrations: [
    mdx(),
    // /resume is noindex (it exists only to source the PDF). Submitting a noindex URL
    // in a sitemap is contradictory and shows up in Search Console as an error.
    sitemap({ filter: (page) => !page.includes('/resume') }),
  ],
  build: { format: 'directory' },
});
