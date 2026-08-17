// Single source of truth for the writing stream: the two legacy .astro post routes
// plus external research. The /writing index, the homepage teasers and /rss.xml all
// read from this array.
//
// NOTE: src/content.config.ts declares a `writing` collection for future markdown
// posts, but NOTHING MERGES IT YET. Dropping a .md file into src/content/writing/
// will not make it appear on the site until this array is joined with
// getCollection('writing'). Add both when the first markdown post is written.

export interface WritingEntry {
  slug: string;
  title: string;
  description: string;
  date: string; // ISO
  tags: string[];
  href: string;
  external?: boolean;
  meta?: string;
}

export const writingIndex: WritingEntry[] = [
  {
    slug: 'paged-attention-from-scratch',
    title: 'PagedAttention from scratch',
    description:
      'Three pieces let a KV cache survive a churning batch: a block allocator, a gather kernel, and a preemption policy. Built by hand and measured — naive reservation wastes 84.6% of the pool, paging brings it to 2.8%.',
    date: '2026-08-16',
    tags: ['deep-dive'],
    href: '/writing/paged-attention-from-scratch/',
  },
  {
    slug: 'continuous-batching-from-scratch',
    title: 'Continuous batching from scratch',
    description:
      'How iteration-level scheduling makes LLM serving fast — built by hand, then measured: static 10 steps / 65% utilization becomes continuous 6 steps / 100%, same requests served.',
    date: '2026-06-16',
    tags: ['deep-dive'],
    href: '/writing/continuous-batching-from-scratch/',
  },
  {
    slug: 'ieee-acdsa-2026',
    title:
      'Effectiveness of Retrieval Augmented Generation, Contextualized Examples and Prompt Finetuning on Data Enrichment, Cleaning and Master Data Creation',
    description:
      'Peer-reviewed work on retrieval-augmented data enrichment, cleaning and master data creation.',
    date: '2026-01-01',
    tags: ['research'],
    href: 'https://doi.org/10.1109/ACDSA67686.2026.11467982',
    external: true,
    meta: 'IEEE ACDSA, 2026',
  },
].sort((a, b) => b.date.localeCompare(a.date));
