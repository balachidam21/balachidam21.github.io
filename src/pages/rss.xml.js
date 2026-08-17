import rss from '@astrojs/rss';
import { writingIndex } from '../data/writing';

export function GET(context) {
  return rss({
    title: 'Balaji Chidambaram — Writing',
    description: 'Technical deep-dives on LLM inference internals, agent systems, and peer-reviewed research.',
    site: context.site,
    items: writingIndex.map((e) => ({
      title: e.title,
      description: e.description,
      pubDate: new Date(e.date + 'T12:00:00Z'),
      link: e.external ? e.href : new URL(e.href, context.site).href,
    })),
  });
}
