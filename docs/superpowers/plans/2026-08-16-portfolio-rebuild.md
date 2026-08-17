# Portfolio Rebuild Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Rebuild `balachidam21.github.io` on Astro so it presents a Principal Consultant, AI Engineer instead of a 2024 masters student, with both existing deep-dive posts migrated intact and a working deploy pipeline.

**Architecture:** Astro 5 static build. A shared layout owns head/nav/footer and a single token palette lifted from the existing posts. The two legacy posts are preserved as dedicated `.astro` routes rather than converted to MDX — their inline `<style>`/`<script>` are a working unit and rewriting them risks silent diagram breakage (see Global Constraints). A typed content collection handles *future* markdown posts, and one `writing-index` module merges legacy routes and collection entries so the index page and homepage have a single source of truth.

**Tech Stack:** Astro 5 · `@astrojs/mdx` · `@astrojs/sitemap` · `@astrojs/rss` · `@fontsource-variable/poppins` · GitHub Actions → GitHub Pages · Node 20

**Spec:** `docs/superpowers/specs/2026-08-12-portfolio-rebuild-design.md`

**Worktree:** All work happens in `~/Documents/Projects/balachidam21.github.io-rebuild` on branch `portfolio-rebuild-2026`. The user's own checkout at `~/Documents/Projects/balachidam21.github.io` must never be switched or modified.

## Global Constraints

Every task's requirements implicitly include this section.

- **Never scope the post styles.** Astro stamps a hashed attribute on elements at build time; the continuous-batching script creates SVG nodes at runtime via `createElementNS`, which never receive it. Scoped selectors would silently not match and diagrams would render unstyled **with a passing build**. Post styles MUST use `<style is:global>` and post scripts MUST use `<script is:inline>`.
- **Preserve these custom-property names verbatim:** `--violet #6e57e0`, `--violet-alt #7d6bd6`, `--violet-light #c2b6fc`, `--violet-bg #f0edfb`, `--title hsl(250,8%,15%)`, `--text hsl(250,9%,32%)`, `--text-light hsl(250,8%,55%)`, `--body #fcfcff`, `--container #ffffff`, `--line #e7e4f2`, `--accent #6e57e0`, `--accent2 #9a4a2f`, `--ink #1c1c1e`, `--muted #6b6b70`, `--idle #e3e1dc`, `--idle-ink #9a978f`, `--none #cfcdc7`, `--sans`, `--mono`.
- **Every user-facing fact must trace to `~/Documents/career-ops/cv.md`.** Reformulate, never fabricate. No claim that `cv.md` does not support.
- **No client names in output.** `Cardinal`, `HESS`, `Finance One` must not appear in `dist/`.
- **No `Co-Authored-By` or AI-attribution trailers in commit messages.**
- **Do not merge to `main` or push until the user approves a preview.** The first workflow run replaces the live site.
- **Both `/blog/*.html` URLs must keep resolving** via redirect stub.
- Base URL is a GitHub Pages **user site** (`https://balachidam21.github.io`), so Astro `base` stays `/`.

---

## File Structure

| Path | Responsibility |
|---|---|
| `package.json`, `astro.config.mjs`, `tsconfig.json` | Build config |
| `src/styles/tokens.css` | The palette + base element styles. Single source of color truth. |
| `src/layouts/BaseLayout.astro` | `<head>`, nav, footer, meta/OG tags. Every page uses it. |
| `src/layouts/PostLayout.astro` | Wraps BaseLayout; adds article header, date, tags, prose width. |
| `src/data/profile.ts` | All CV-derived facts as typed data. The only place facts live. |
| `src/data/writing.ts` | Merged writing index — legacy routes + collection entries. |
| `src/content.config.ts` | Zod schema for future markdown posts. |
| `src/pages/index.astro` | Homepage |
| `src/pages/about.astro` | About |
| `src/pages/writing/index.astro` | Writing stream |
| `src/pages/writing/continuous-batching-from-scratch.astro` | Legacy post, preserved |
| `src/pages/writing/paged-attention-from-scratch.astro` | Legacy post, preserved |
| `src/pages/404.astro` | 404 |
| `public/blog/*.html` | Redirect stubs for the two old URLs |
| `scripts/verify-site.mjs` | Verification harness — the plan's test suite |
| `.github/workflows/deploy.yml` | Build + deploy to Pages |

---

## Task 1: Astro scaffold that builds

**Files:**
- Create: `package.json`, `astro.config.mjs`, `tsconfig.json`, `.gitignore` (modify)
- Create: `src/pages/index.astro` (placeholder, replaced in Task 7)

**Interfaces:**
- Produces: a working `npm run build` emitting `dist/`.

- [ ] **Step 1: Create `package.json`**

```json
{
  "name": "balachidam21-portfolio",
  "type": "module",
  "version": "1.0.0",
  "scripts": {
    "dev": "astro dev",
    "build": "astro build",
    "preview": "astro preview",
    "verify": "node scripts/verify-site.mjs"
  },
  "dependencies": {
    "astro": "^5.0.0",
    "@astrojs/mdx": "^4.0.0",
    "@astrojs/rss": "^4.0.0",
    "@astrojs/sitemap": "^3.0.0",
    "@fontsource-variable/poppins": "^5.0.0"
  }
}
```

- [ ] **Step 2: Create `astro.config.mjs`**

```js
import { defineConfig } from 'astro/config';
import mdx from '@astrojs/mdx';
import sitemap from '@astrojs/sitemap';

export default defineConfig({
  site: 'https://balachidam21.github.io',
  base: '/',
  integrations: [mdx(), sitemap()],
  build: { format: 'directory' },
});
```

- [ ] **Step 3: Create `tsconfig.json`**

```json
{ "extends": "astro/tsconfigs/strict" }
```

- [ ] **Step 4: Add build artifacts to `.gitignore`**

Append these lines to the existing `.gitignore`:

```
node_modules/
dist/
.astro/
.superpowers/
```

- [ ] **Step 5: Create a placeholder homepage so the build has a route**

`src/pages/index.astro`:

```astro
---
---
<html lang="en"><head><title>Balaji Chidambaram</title></head>
<body><h1>Placeholder</h1></body></html>
```

- [ ] **Step 6: Install and build**

Run: `npm install && npm run build`
Expected: exits 0, `dist/index.html` exists.

- [ ] **Step 7: Verify the old site files did not leak into `dist/`**

Run: `ls dist/`
Expected: `index.html` and Astro assets only. The legacy `index.html`, `assets/`, `old_version/` at repo root are NOT part of the Astro build and must not appear.

- [ ] **Step 8: Commit**

```bash
git add package.json package-lock.json astro.config.mjs tsconfig.json .gitignore src/pages/index.astro
git commit -m "build: astro scaffold"
```

---

## Task 2: Design tokens and base layout

**Files:**
- Create: `src/styles/tokens.css`, `src/layouts/BaseLayout.astro`

**Interfaces:**
- Produces: `BaseLayout` accepting props `{ title: string; description: string; ogType?: string }`. Every later page imports it.

- [ ] **Step 1: Extract the palette into `src/styles/tokens.css`**

Copy the `:root` block verbatim from `blog/continuous-batching-from-scratch.html` (lines 16–30 of the original), then add dark-mode overrides. Names must match Global Constraints exactly.

```css
:root{
  --violet:#6e57e0; --violet-alt:#7d6bd6; --violet-light:#c2b6fc; --violet-bg:#f0edfb;
  --title:hsl(250,8%,15%); --text:hsl(250,9%,32%); --text-light:hsl(250,8%,55%);
  --body:#fcfcff; --container:#ffffff; --line:#e7e4f2;
  --sans:"Poppins Variable","Poppins",-apple-system,BlinkMacSystemFont,"Segoe UI",Roboto,Helvetica,Arial,sans-serif;
  --mono:"SF Mono",ui-monospace,"Cascadia Code",Menlo,Consolas,monospace;
  --accent:#6e57e0; --accent2:#9a4a2f; --ink:#1c1c1e; --muted:#6b6b70;
  --idle:#e3e1dc; --idle-ink:#9a978f; --none:#cfcdc7;
}
@media (prefers-color-scheme: dark){
  :root{
    --title:hsl(250,10%,94%); --text:hsl(250,8%,78%); --text-light:hsl(250,6%,58%);
    --body:#131218; --container:#1a1922; --line:#2b2936;
    --violet-bg:#1e1a33; --ink:#e9e9ee; --muted:#9a97a6;
    --idle:#2e2c38; --idle-ink:#6f6c7d; --none:#3a3846;
  }
}
*,*::before,*::after{box-sizing:border-box}
body{margin:0;background:var(--body);color:var(--text);font-family:var(--sans);line-height:1.65}
a{color:var(--violet)}
img{max-width:100%;height:auto}
.container{width:min(100% - 2.5rem, 60rem);margin-inline:auto}
```

- [ ] **Step 2: Create `src/layouts/BaseLayout.astro`**

```astro
---
import '@fontsource-variable/poppins';
import '../styles/tokens.css';
interface Props { title: string; description: string; ogType?: string }
const { title, description, ogType = 'website' } = Astro.props;
const canonical = new URL(Astro.url.pathname, Astro.site).href;
const nav = [
  { href: '/', label: 'Home' },
  { href: '/writing/', label: 'Writing' },
  { href: '/about/', label: 'About' },
];
---
<!doctype html>
<html lang="en">
<head>
  <meta charset="utf-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1" />
  <title>{title}</title>
  <meta name="description" content={description} />
  <link rel="canonical" href={canonical} />
  <meta property="og:title" content={title} />
  <meta property="og:description" content={description} />
  <meta property="og:type" content={ogType} />
  <meta property="og:url" content={canonical} />
  <meta name="twitter:card" content="summary" />
  <link rel="icon" href="/assets/img/icon.jpg" />
</head>
<body>
  <header class="site-nav"><nav class="container">
    <a class="brand" href="/">Balaji</a>
    <ul>{nav.map(i => <li><a href={i.href}>{i.label}</a></li>)}</ul>
  </nav></header>
  <main><slot /></main>
  <footer class="site-footer"><div class="container">
    <p>© 2026 Balaji Chidambaram</p>
  </div></footer>
</body>
</html>
<style>
  .site-nav nav{display:flex;align-items:center;gap:1.5rem;padding:1.1rem 0}
  .site-nav .brand{font-weight:650;color:var(--violet);text-decoration:none;margin-right:auto}
  .site-nav ul{display:flex;gap:1.25rem;list-style:none;margin:0;padding:0}
  .site-nav a{color:var(--text);text-decoration:none;font-size:.95rem}
  .site-nav a:hover{color:var(--violet)}
  .site-footer{border-top:1px solid var(--line);margin-top:4rem;padding:1.5rem 0;color:var(--text-light);font-size:.9rem}
</style>
```

Note: this component's own `<style>` MAY be scoped — it styles only build-time markup. The Global Constraint applies to the *post* styles in Tasks 4 and 5.

- [ ] **Step 3: Point the placeholder homepage at the layout**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Balaji Chidambaram" description="AI engineer building agentic systems.">
  <div class="container"><h1>Placeholder</h1></div>
</BaseLayout>
```

- [ ] **Step 4: Build and eyeball**

Run: `npm run build && npx astro preview --port 4321`
Expected: build exits 0; page shows nav and footer; no console errors.

- [ ] **Step 5: Commit**

```bash
git add src/styles/tokens.css src/layouts/BaseLayout.astro src/pages/index.astro
git commit -m "feat: design tokens and base layout"
```

---

## Task 3: Profile data module

**Files:**
- Create: `src/data/profile.ts`

**Interfaces:**
- Produces: `profile` object consumed by Tasks 7 and 8. Exact shape below — later tasks depend on these key names.

- [ ] **Step 1: Create `src/data/profile.ts`**

Every value below is copied from `~/Documents/career-ops/cv.md`. Do not add, embellish, or round any figure. No client names.

```ts
export const profile = {
  name: 'Balaji Chidambaram',
  title: 'Principal Consultant, AI Engineer',
  location: 'San Francisco Bay Area, CA',
  email: 'balaji21.chidambaram@gmail.com',
  links: {
    linkedin: 'https://www.linkedin.com/in/balaji-chidam/',
    github: 'https://github.com/balachidam21',
  },
  headline: "Hi, I'm Balaji — I build agentic AI systems.",
  lede:
    'Principal Consultant, AI Engineer at Genpact. I take multi-agent platforms from ' +
    'prototype to production for enterprise teams — and make them auditable once they are there.',
  metrics: [
    { value: '100+',    label: 'enterprise users' },
    { value: '400+',    label: 'governed KPIs' },
    { value: '40→60%',  label: 'user acceptance' },
    { value: '20+',     label: 'MCP skills' },
  ],
  experience: [
    {
      company: 'Genpact', role: 'Principal Consultant, AI Engineer',
      period: 'Mar 2026 – Present', location: 'Remote, USA',
      bullets: [
        'Lead architect for an enterprise Agentic xP&A platform unifying Financial Planning, Supply Chain, Workforce Planning and Demand Planning across 4 business segments; shipped a production MVP on Databricks in 1 month with 3 engineers and 2 SMEs.',
        'Architected a Lakebase-backed agent governance layer where finance users curate 400+ KPIs and drivers directly, with versioned lineage — cutting data-readiness prep from over a month to a few days.',
      ],
    },
    {
      company: 'Genpact', role: 'Assistant Manager, AI Engineer',
      period: 'May 2024 – Feb 2026', location: 'Remote, USA',
      bullets: [
        'Architected a multi-agent Conversational AI platform using a LangGraph orchestrator over 8 deterministic tools, reducing analysis lead time from days to minutes for 100+ enterprise users.',
        'Exposed 20+ reusable analysis skills through MCP servers with least-privilege tool access and prompt-injection guardrails on every tool call.',
        'Systematized agent quality assurance with an MLflow GenAI evaluation harness using LLM-as-a-judge scorers — raising user acceptance from 40% to 60% and preempting ~20 pre-production regressions.',
        'Engineered a query-lineage governance layer surfacing underlying SQL and source datasets, moving AI-driven analysis from a black box to an auditable solution.',
      ],
    },
    {
      company: 'Keck Medicine of USC', role: 'Data Engineer / Marketing Data Analyst',
      period: 'Sep 2022 – Dec 2024', location: 'Los Angeles, CA',
      bullets: [
        'Engineered a multi-source data warehouse and analytics platform on AWS Redshift, unifying analytics across data silos.',
        'Built AWS ingestion and ETL pipelines that cut reporting prep time by 40%; designed a Tableau/AWS/Looker analytics platform raising campaign visibility by 54%.',
      ],
    },
    {
      company: 'Sayari Labs', role: 'Data Engineer Intern',
      period: 'May 2023 – Jul 2023', location: 'Washington, D.C.',
      bullets: [
        'Built scalable microservice-style data pipelines (Scrapy, Kubernetes, Airflow) ingesting data from 10+ sources monthly.',
      ],
    },
    {
      company: 'USC Information Sciences Institute', role: 'Research Assistant, Center on Knowledge Graphs',
      period: 'Aug 2022 – May 2023', location: 'Los Angeles, CA',
      bullets: [
        'Executed knowledge graph algorithms with the KGTK toolkit, achieving 78% accuracy predicting information flow.',
        'Developed a chatbot using NER and Relation Extraction with Transformers, improving query response accuracy by 40%.',
      ],
    },
    {
      company: 'HertzAI', role: 'Cloud Architect Intern',
      period: 'Aug 2021 – Nov 2021', location: 'Chennai, India',
      bullets: [
        'Automated the CI/CD pipeline with Jenkins across ten cloud services, improving release cycles by 40%.',
      ],
    },
  ],
  education: [
    { degree: 'M.S. Computer Science', school: 'University of Southern California', period: 'Jan 2022 – Dec 2023', detail: 'GPA 3.81/4.0' },
    { degree: 'B.E. Computer Science and Engineering', school: 'Anna University', period: 'Aug 2017 – Jul 2021', detail: 'GPA 8.97/10' },
  ],
  publication: {
    authors: 'P. Shekhar, R. Saha, M. J. B. Dudekula, B. Chidambaram',
    title: 'Effectiveness of Retrieval Augmented Generation, Contextualized Examples and Prompt Finetuning on Data Enrichment, Cleaning and Master Data Creation',
    venue: 'IEEE ACDSA, 2026',
    doi: 'https://doi.org/10.1109/ACDSA67686.2026.11467982',
  },
  projects: [
    { name: 'Automated Stock Market Streaming', href: 'https://github.com/balachidam21/automated-stock-market-streaming',
      blurb: 'Real-time stock market streaming with Kafka, Spark and Cassandra, orchestrated in Airflow. 30% faster processing, 40% lower retrieval time.' },
    { name: 'KG + Fusion Transformer for Multi-Hop QA', href: 'https://github.com/balachidam21/kg-fusion-transformer-for-multi-hop-qa',
      blurb: 'Fine-tuned RoBERTa in Dynamically Fused Graph Networks; replaced skip-connections with Compact Bilinear Pooling and Tucker Fusion.' },
    { name: 'Adapting Vision-Language Models to Vision-Only Tasks', href: 'https://github.com/balachidam21/adapt-VL-models-to-vision-only-tasks',
      blurb: 'Optimized VL models for object detection, with Docker and GCP for reproducible training plus a real-time streaming pipeline.' },
  ],
  skills: {
    Specialties: 'Agentic AI & Multi-Agent Systems (ReAct, Hierarchical Delegation, Supervisor), MCP, Distributed Systems Design, RAG & Vector Databases, Agent Governance & Lineage, LLM Evaluation & Observability, Knowledge Graphs',
    Languages: 'Python (PySpark), SQL, C++, C, Java, React',
    'AI/ML': 'LangGraph, MCP, Google ADK, TensorFlow, PyTorch, MLflow, TimeGPT, KGTK, Transformers',
    Platforms: 'AWS (Lambda, EC2, VPC, RDS, Redshift), Databricks, Google Cloud (Vertex AI, Gemini, Document AI), Azure, Kubernetes, Docker, Airflow, Kafka, CI/CD',
  },
  certifications: [
    { name: 'Google Cloud Professional Machine Learning Engineer', href: 'https://www.credly.com/badges/97c6f50c-1bef-436e-bcb1-f1154239d518/public_url' },
    { name: 'Databricks Generative AI Associate', href: 'https://credentials.databricks.com/cfc819fc-1713-4ea5-ac62-87c21e7bc3d6' },
    { name: 'Google Cloud Associate Cloud Engineer', href: 'https://www.credly.com/badges/933c2caa-b186-4a6e-9c4d-b86543fed717/public_url' },
  ],
} as const;
```

- [ ] **Step 2: Verify no client names**

Run: `grep -nE 'Cardinal|HESS|Finance One|Fin\.AI|Contract CoPilot' src/data/profile.ts`
Expected: no output.

- [ ] **Step 3: Verify it type-checks**

Run: `npx astro check` (or `npm run build`)
Expected: exits 0.

- [ ] **Step 4: Commit**

```bash
git add src/data/profile.ts
git commit -m "feat: profile data module sourced from cv.md"
```

---

## Task 4: Migrate the continuous-batching post

This is the highest-risk task. Read Global Constraints again before starting.

**Files:**
- Create: `src/layouts/PostLayout.astro`, `src/pages/writing/continuous-batching-from-scratch.astro`
- Read: `blog/continuous-batching-from-scratch.html`

**Interfaces:**
- Produces: `PostLayout` with props `{ title, description, date, tags }`; route `/writing/continuous-batching-from-scratch/`.

- [ ] **Step 1: Create `src/layouts/PostLayout.astro`**

```astro
---
import BaseLayout from './BaseLayout.astro';
interface Props { title: string; description: string; date: string; tags: string[] }
const { title, description, date, tags } = Astro.props;
---
<BaseLayout title={`${title} — Balaji Chidambaram`} description={description} ogType="article">
  <article class="container prose">
    <header class="post-head">
      <p class="meta"><time datetime={date}>{new Date(date).toLocaleDateString('en-US',{year:'numeric',month:'long',day:'numeric'})}</time>{tags.map(t => <span class="tag">#{t}</span>)}</p>
      <h1>{title}</h1>
    </header>
    <slot />
  </article>
</BaseLayout>
<style>
  .prose{width:min(100% - 2.5rem, 46rem)}
  .post-head{margin:2rem 0 2.5rem}
  .post-head h1{font-size:clamp(1.8rem,4vw,2.4rem);line-height:1.2;color:var(--title);margin:.4rem 0 0}
  .meta{display:flex;gap:.75rem;align-items:center;color:var(--text-light);font-size:.9rem;margin:0}
  .tag{color:var(--violet)}
</style>
```

- [ ] **Step 2: Create the post route, copying the body verbatim**

Create `src/pages/writing/continuous-batching-from-scratch.astro`. Line ranges below were
verified against the file on 2026-08-16 — copy exactly these, no more:

| Source | Lines | Destination |
|---|---|---|
| `<style>` contents | **16–134** | `<style is:global>` — but **drop the `:root{…}` block** (lines 16–30), which now lives in `tokens.css` |
| `<nav class="nav">` | 139–149 | **EXCLUDE** — BaseLayout owns the nav |
| Article content | **150–285** | inside `<PostLayout>` |
| `<footer class="site-footer">` | 286–310 | **EXCLUDE** — BaseLayout owns the footer |
| `<script>` contents | **313–407** | `<script is:inline>` |

Note the article body is 150–285, **not** through 408 — lines 312–408 are the script, and
copying the body as one 138–408 range would duplicate it.

Also drop the post's own `.nav`/`.site-footer` CSS rules from the style block; they style
chrome this route no longer contains.

```astro
---
import PostLayout from '../../layouts/PostLayout.astro';
---
<PostLayout
  title="Continuous batching from scratch"
  description="Building a continuous-batching LLM inference scheduler from scratch — why iteration-level scheduling makes serving fast, with timelines and a scoreboard."
  date="2026-06-16"
  tags={["deep-dive"]}
>
  <!-- PASTE post body markup here, verbatim, minus nav/footer -->
</PostLayout>

<style is:global>
  /* PASTE post style rules here, verbatim, minus the :root block */
</style>

<script is:inline>
  /* PASTE the 96-line diagram script here, verbatim */
</script>
```

- [ ] **Step 3: Build**

Run: `npm run build`
Expected: exits 0.

- [ ] **Step 4: Verify the diagrams visually — this is the actual test**

Run: `npx astro preview --port 4321`, open `http://localhost:4321/writing/continuous-batching-from-scratch/`.

Expected, checked against the original file opened side by side:
- All 6 SVG diagrams render **with color and labels**, not as bare/unstyled boxes
- Step numbers and lane labels are present and positioned
- Browser console shows zero errors

A passing build is NOT evidence here. If diagrams render unstyled, the cause is style scoping — confirm `is:global` is present on the style block.

- [ ] **Step 5: Verify no scoping attribute leaked into the post CSS**

Run: `grep -c 'astro-' dist/writing/continuous-batching-from-scratch/index.html`
Expected: the post's diagram class rules (`.stepnum`, `.lanelbl`) appear **without** an `astro-*` scope suffix. Inspect with:
`grep -oE '\.(stepnum|lanelbl)[^{]*' dist/writing/continuous-batching-from-scratch/index.html | head`
Expected: bare class selectors, no hashed attribute selector attached.

- [ ] **Step 6: Commit**

```bash
git add src/layouts/PostLayout.astro src/pages/writing/continuous-batching-from-scratch.astro
git commit -m "feat: migrate continuous-batching post"
```

---

## Task 5: Migrate the PagedAttention post

**Files:**
- Create: `src/pages/writing/paged-attention-from-scratch.astro`
- Read: `blog/paged-attention-from-scratch.html`

**Interfaces:**
- Consumes: `PostLayout` from Task 4.
- Produces: route `/writing/paged-attention-from-scratch/`.

- [ ] **Step 1: Create the route**

Same shape as Task 4. This post has **no `<script>`** — its 8 SVGs are static markup.
Line ranges verified 2026-08-16:

| Source | Lines | Destination |
|---|---|---|
| `<style>` contents | **16–142** | `<style is:global>` — **drop the `:root{…}` block** |
| `<nav class="nav">` | 147–157 | **EXCLUDE** |
| Article content | **158–710** | inside `<PostLayout>` |
| `<footer class="site-footer">` | 711–735 | **EXCLUDE** |

Drop the post's own `.nav`/`.site-footer` CSS rules along with the chrome.

```astro
---
import PostLayout from '../../layouts/PostLayout.astro';
---
<PostLayout
  title="PagedAttention from scratch"
  description="Building PagedAttention by hand — block allocator, gather kernel, and preemption policy — measured: 84.6% of the KV pool wasted by naive reservation drops to 2.8%."
  date="2026-08-16"
  tags={["deep-dive"]}
>
  <!-- PASTE post body markup here, verbatim, minus nav/footer -->
</PostLayout>

<style is:global>
  /* PASTE post style rules here, verbatim, minus the :root block */
</style>
```

- [ ] **Step 2: Build and verify visually**

Run: `npm run build && npx astro preview --port 4321`, open `/writing/paged-attention-from-scratch/`.
Expected: all 8 diagrams render with color; the 84.6% → 2.8% figures appear; console clean.

- [ ] **Step 3: Commit**

```bash
git add src/pages/writing/paged-attention-from-scratch.astro
git commit -m "feat: migrate paged-attention post"
```

---

## Task 6: Writing index and redirect stubs

**Files:**
- Create: `src/data/writing.ts`, `src/content.config.ts`, `src/pages/writing/index.astro`
- Create: `public/blog/continuous-batching-from-scratch.html`, `public/blog/paged-attention-from-scratch.html`

**Interfaces:**
- Produces: `writingIndex: WritingEntry[]` where `WritingEntry = { slug, title, description, date, tags, href }`. Task 7 consumes this for the homepage teasers.

- [ ] **Step 1: Create `src/data/writing.ts`**

```ts
export interface WritingEntry {
  slug: string; title: string; description: string;
  date: string; tags: string[]; href: string; external?: boolean;
}

export const writingIndex: WritingEntry[] = [
  {
    slug: 'paged-attention-from-scratch',
    title: 'PagedAttention from scratch',
    description: 'Block allocator, gather kernel, and preemption policy — measured: 84.6% of the KV pool wasted by naive reservation drops to 2.8%.',
    date: '2026-08-16', tags: ['deep-dive'],
    href: '/writing/paged-attention-from-scratch/',
  },
  {
    slug: 'continuous-batching-from-scratch',
    title: 'Continuous batching from scratch',
    description: 'Why iteration-level scheduling makes LLM serving fast — static 10 steps / 65% utilization becomes continuous 6 steps / 100%, same requests served.',
    date: '2026-06-16', tags: ['deep-dive'],
    href: '/writing/continuous-batching-from-scratch/',
  },
  {
    slug: 'ieee-acdsa-2026',
    title: 'Effectiveness of RAG, Contextualized Examples and Prompt Finetuning on Data Enrichment, Cleaning and Master Data Creation',
    description: 'IEEE ACDSA 2026. Co-authored peer-reviewed work on retrieval-augmented data enrichment.',
    date: '2026-01-01', tags: ['research'],
    href: 'https://doi.org/10.1109/ACDSA67686.2026.11467982',
    external: true,
  },
].sort((a, b) => b.date.localeCompare(a.date));
```

- [ ] **Step 2: Create `src/content.config.ts` for future markdown posts**

```ts
import { defineCollection, z } from 'astro:content';
import { glob } from 'astro/loaders';

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
```

- [ ] **Step 3: Create `src/pages/writing/index.astro`**

```astro
---
import BaseLayout from '../../layouts/BaseLayout.astro';
import { writingIndex } from '../../data/writing';
---
<BaseLayout title="Writing — Balaji Chidambaram" description="Technical deep-dives on LLM inference internals, agent systems, and published research.">
  <div class="container wrap">
    <h1>Writing</h1>
    <ul class="list">
      {writingIndex.map(e => (
        <li>
          <a href={e.href} rel={e.external ? 'noopener' : undefined} target={e.external ? '_blank' : undefined}>
            <h2>{e.title}{e.external && <span class="ext"> ↗</span>}</h2>
          </a>
          <p class="meta"><time datetime={e.date}>{new Date(e.date).toLocaleDateString('en-US',{year:'numeric',month:'short'})}</time>{e.tags.map(t => <span class="tag">#{t}</span>)}</p>
          <p class="desc">{e.description}</p>
        </li>
      ))}
    </ul>
  </div>
</BaseLayout>
<style>
  .wrap{width:min(100% - 2.5rem, 46rem);padding-block:1rem 3rem}
  h1{color:var(--title);font-size:2rem;margin-bottom:2rem}
  .list{list-style:none;padding:0;margin:0;display:flex;flex-direction:column;gap:2.25rem}
  .list a{text-decoration:none}
  .list h2{color:var(--title);font-size:1.2rem;margin:0;line-height:1.35}
  .list a:hover h2{color:var(--violet)}
  .ext{color:var(--text-light);font-size:.85em}
  .meta{display:flex;gap:.7rem;color:var(--text-light);font-size:.85rem;margin:.4rem 0 .5rem}
  .tag{color:var(--violet)}
  .desc{margin:0;color:var(--text)}
</style>
```

- [ ] **Step 4: Create both redirect stubs**

`public/blog/continuous-batching-from-scratch.html`:

```html
<!doctype html>
<html lang="en"><head>
<meta charset="utf-8">
<title>Redirecting…</title>
<link rel="canonical" href="https://balachidam21.github.io/writing/continuous-batching-from-scratch/">
<meta http-equiv="refresh" content="0; url=/writing/continuous-batching-from-scratch/">
</head><body>
<p>This post moved to <a href="/writing/continuous-batching-from-scratch/">/writing/continuous-batching-from-scratch/</a>.</p>
</body></html>
```

`public/blog/paged-attention-from-scratch.html`: identical, with `paged-attention-from-scratch` substituted in both the canonical URL and the refresh target.

- [ ] **Step 5: Build and verify the stubs land in `dist/`**

Run: `npm run build && ls dist/blog/`
Expected: both `.html` files present.

- [ ] **Step 6: Commit**

```bash
git add src/data/writing.ts src/content.config.ts src/pages/writing/index.astro public/blog/
git commit -m "feat: writing index and legacy URL redirects"
```

---

## Task 7: Homepage

**Files:**
- Modify: `src/pages/index.astro` (replaces the Task 1 placeholder)

**Interfaces:**
- Consumes: `profile` (Task 3), `writingIndex` (Task 6), `BaseLayout` (Task 2).

- [ ] **Step 1: Replace `src/pages/index.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
import { profile } from '../data/profile';
import { writingIndex } from '../data/writing';
const latest = writingIndex.slice(0, 3);
---
<BaseLayout title="Balaji Chidambaram — AI Engineer" description={profile.lede}>
  <section class="container hero">
    <h1>{profile.headline}</h1>
    <p class="lede">{profile.lede}</p>
    <p class="links">
      <a href="/writing/">Writing</a><a href={profile.links.github} target="_blank" rel="noopener">GitHub</a><a href={profile.links.linkedin} target="_blank" rel="noopener">LinkedIn</a><a href={`mailto:${profile.email}`}>Email</a>
    </p>
  </section>

  <section class="container metrics">
    {profile.metrics.map(m => <div class="metric"><b>{m.value}</b><span>{m.label}</span></div>)}
  </section>

  <section class="container block">
    <h2>Writing</h2>
    <ul class="teasers">
      {latest.map(e => (
        <li><a href={e.href} target={e.external ? '_blank' : undefined} rel={e.external ? 'noopener' : undefined}>
          <b>{e.title}</b><span>{e.description}</span>
        </a></li>
      ))}
    </ul>
    <p><a class="more" href="/writing/">All writing →</a></p>
  </section>

  <section class="container block">
    <h2>Experience</h2>
    {profile.experience.slice(0, 3).map(x => (
      <div class="job">
        <div class="job-head"><b>{x.role}</b><span>{x.company}</span><i>{x.period}</i></div>
        <ul>{x.bullets.map(b => <li>{b}</li>)}</ul>
      </div>
    ))}
    <p><a class="more" href="/about/">Full background →</a></p>
  </section>

  <section class="container block">
    <h2>Projects</h2>
    <div class="cards">
      {profile.projects.map(p => (
        <a class="card" href={p.href} target="_blank" rel="noopener">
          <b>{p.name}</b><span>{p.blurb}</span>
        </a>
      ))}
    </div>
  </section>
</BaseLayout>

<style>
  .hero{padding-block:3rem 1.5rem;max-width:44rem}
  .hero h1{color:var(--title);font-size:clamp(1.9rem,5vw,2.7rem);line-height:1.2;margin:0 0 .9rem;letter-spacing:-.015em}
  .lede{font-size:1.05rem;margin:0 0 1.3rem}
  .links{display:flex;gap:1.25rem;flex-wrap:wrap;margin:0}
  .links a{color:var(--violet);text-decoration:none;font-size:.95rem}
  .links a:hover{text-decoration:underline}
  .metrics{display:grid;grid-template-columns:repeat(auto-fit,minmax(140px,1fr));gap:1px;background:var(--line);border:1px solid var(--line);border-radius:10px;overflow:hidden;margin-block:2rem}
  .metric{background:var(--container);padding:1rem 1.1rem}
  .metric b{display:block;color:var(--violet);font-size:1.45rem;font-weight:650}
  .metric span{font-size:.78rem;letter-spacing:.06em;text-transform:uppercase;color:var(--text-light)}
  .block{padding-block:2rem}
  .block h2{color:var(--title);font-size:1.35rem;margin:0 0 1.2rem}
  .teasers{list-style:none;padding:0;margin:0 0 1rem;display:flex;flex-direction:column;gap:1.1rem}
  .teasers a{text-decoration:none;display:block}
  .teasers b{display:block;color:var(--title);font-weight:600;margin-bottom:.2rem}
  .teasers a:hover b{color:var(--violet)}
  .teasers span{color:var(--text);font-size:.95rem}
  .job{margin-bottom:1.6rem}
  .job-head{display:flex;gap:.6rem;flex-wrap:wrap;align-items:baseline;margin-bottom:.4rem}
  .job-head b{color:var(--title)}
  .job-head span{color:var(--violet)}
  .job-head i{color:var(--text-light);font-style:normal;font-size:.85rem;margin-left:auto}
  .job ul{margin:0;padding-left:1.1rem}
  .job li{margin-bottom:.35rem}
  .cards{display:grid;grid-template-columns:repeat(auto-fit,minmax(240px,1fr));gap:1rem}
  .card{background:var(--container);border:1px solid var(--line);border-radius:10px;padding:1rem;text-decoration:none;display:block}
  .card:hover{border-color:var(--violet-light)}
  .card b{display:block;color:var(--title);margin-bottom:.35rem}
  .card span{color:var(--text-light);font-size:.9rem}
  .more{color:var(--violet);text-decoration:none;font-size:.95rem}
</style>
```

- [ ] **Step 2: Build and check responsive widths**

Run: `npm run build && npx astro preview --port 4321`
Expected: renders correctly at 375px, 768px, 1440px. Metrics strip wraps rather than overflowing at 375px.

- [ ] **Step 3: Commit**

```bash
git add src/pages/index.astro
git commit -m "feat: homepage"
```

---

## Task 8: About page and 404

**Files:**
- Create: `src/pages/about.astro`, `src/pages/404.astro`

- [ ] **Step 1: Create `src/pages/about.astro`**

Renders, from `profile`: full `experience` (all six entries, all bullets), `education`, `publication` with DOI link, `skills` as a definition list, and `certifications` as links. Uses `BaseLayout`. Include a résumé download link to `/Resume_Balaji_Chidambaram.pdf`. Reuse the `.job` styles from Task 7 — copy them into this file's `<style>` block rather than importing, so each page stays self-contained.

- [ ] **Step 2: Create `src/pages/404.astro`**

```astro
---
import BaseLayout from '../layouts/BaseLayout.astro';
---
<BaseLayout title="Not found — Balaji Chidambaram" description="Page not found.">
  <div class="container wrap">
    <h1>404</h1>
    <p>That page doesn't exist. Try <a href="/">the homepage</a> or <a href="/writing/">the writing index</a>.</p>
  </div>
</BaseLayout>
<style>.wrap{padding-block:4rem;max-width:40rem}h1{color:var(--title);font-size:3rem;margin:0 0 .5rem}</style>
```

- [ ] **Step 3: Build and click through every nav link**

Run: `npm run build && npx astro preview --port 4321`
Expected: `/`, `/writing/`, `/about/`, both posts, and a bad URL (404 page) all render with nav and footer.

- [ ] **Step 4: Commit**

```bash
git add src/pages/about.astro src/pages/404.astro
git commit -m "feat: about page and 404"
```

---

## Task 9: Verification harness

**Files:**
- Create: `scripts/verify-site.mjs`

**Interfaces:**
- Produces: `npm run verify`, exit 0 on pass, non-zero with a list of failures.

- [ ] **Step 1: Create `scripts/verify-site.mjs`**

```js
#!/usr/bin/env node
import { readFileSync, readdirSync, statSync, existsSync } from 'node:fs';
import { join } from 'node:path';

const DIST = 'dist';
const failures = [];
const fail = (m) => failures.push(m);

function walk(dir) {
  return readdirSync(dir).flatMap((f) => {
    const p = join(dir, f);
    return statSync(p).isDirectory() ? walk(p) : [p];
  });
}

if (!existsSync(DIST)) { console.error('dist/ missing — run npm run build first'); process.exit(1); }
const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));
const allText = html.map((f) => readFileSync(f, 'utf8')).join('\n');

// 1. No client names anywhere in the built output.
for (const name of ['Cardinal', 'HESS', 'Finance One', 'Fin.AI', 'Contract CoPilot']) {
  if (allText.includes(name)) fail(`client name "${name}" appears in dist/`);
}

// 2. No stale self-description from the 2024 site.
for (const stale of ['graduate computer science student', 'currently mastering']) {
  if (allText.toLowerCase().includes(stale.toLowerCase())) fail(`stale copy "${stale}" in dist/`);
}

// 3. Required routes exist.
for (const p of [
  'dist/index.html',
  'dist/about/index.html',
  'dist/writing/index.html',
  'dist/writing/continuous-batching-from-scratch/index.html',
  'dist/writing/paged-attention-from-scratch/index.html',
  'dist/404.html',
  'dist/blog/continuous-batching-from-scratch.html',
  'dist/blog/paged-attention-from-scratch.html',
]) if (!existsSync(p)) fail(`missing route: ${p}`);

// 4. Redirect stubs point at the new URLs.
const stubs = {
  'dist/blog/continuous-batching-from-scratch.html': '/writing/continuous-batching-from-scratch/',
  'dist/blog/paged-attention-from-scratch.html': '/writing/paged-attention-from-scratch/',
};
for (const [f, target] of Object.entries(stubs)) {
  if (existsSync(f) && !readFileSync(f, 'utf8').includes(target)) fail(`${f} does not redirect to ${target}`);
}

// 5. Diagram class rules must NOT be scope-suffixed (Astro scoping would break runtime SVG).
for (const post of ['continuous-batching-from-scratch', 'paged-attention-from-scratch']) {
  const f = `dist/writing/${post}/index.html`;
  if (!existsSync(f)) continue;
  const src = readFileSync(f, 'utf8');
  if (/\.(stepnum|lanelbl)[^{,\s]*\[data-astro-cid/.test(src)) {
    fail(`${post}: diagram classes are scoped — runtime SVG will render unstyled`);
  }
  if (!src.includes('<svg')) fail(`${post}: no <svg> found in output`);
}

// 6. Old skill-bar markup must be gone.
if (/skills_percentage|skills__percentage/.test(allText)) fail('legacy skill-percentage bars still present');

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:\n` + failures.map((f) => `  - ${f}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`✓ all checks passed across ${html.length} HTML files`);
```

- [ ] **Step 2: Run it against the current build**

Run: `npm run build && npm run verify`
Expected: `✓ all checks passed`. If any check fails, fix the site — not the check.

- [ ] **Step 3: Commit**

```bash
git add scripts/verify-site.mjs
git commit -m "test: site verification harness"
```

---

## Task 10: Résumé PDF regeneration

**Files:**
- Replace: `Resume_Balaji_Chidambaram.pdf`

- [ ] **Step 1: Generate the PDF from `cv.md` via career-ops**

```bash
cd ~/Documents/career-ops && node generate-pdf.mjs
```

If `generate-pdf.mjs` requires arguments, run `node generate-pdf.mjs --help` first and follow it. Output lands in `~/Documents/career-ops/output/`.

- [ ] **Step 2: Verify the PDF opens and shows the current title**

Expected: page 1 shows "Principal Consultant, AI Engineer" and Genpact dates through 2026. If it shows the 2024 content, `cv.md` was not the source — stop and report.

- [ ] **Step 3: Copy into the site and confirm the About link resolves**

```bash
cp ~/Documents/career-ops/output/<generated>.pdf \
   ~/Documents/Projects/balachidam21.github.io-rebuild/public/Resume_Balaji_Chidambaram.pdf
npm run build && ls dist/Resume_Balaji_Chidambaram.pdf
```

- [ ] **Step 4: Commit**

```bash
git add public/Resume_Balaji_Chidambaram.pdf
git commit -m "chore: regenerate resume pdf from cv.md"
```

---

## Task 11: Deploy workflow — build only, no deploy yet

**Files:**
- Create: `.github/workflows/deploy.yml`

**Interfaces:**
- Produces: a Pages deployment on push to `main`.

**Read this before starting:** deploys are currently frozen (Pages source is "GitHub Actions" with no workflow). The **first successful run of this workflow replaces the live site.** It must not run until the user has approved a preview.

- [ ] **Step 1: Create `.github/workflows/deploy.yml`**

```yaml
name: Deploy site
on:
  push:
    branches: [main]
  workflow_dispatch:

permissions:
  contents: read
  pages: write
  id-token: write

concurrency:
  group: pages
  cancel-in-progress: false

jobs:
  build:
    runs-on: ubuntu-latest
    steps:
      - uses: actions/checkout@v4
      - uses: actions/setup-node@v4
        with:
          node-version: 20
          cache: npm
      - run: npm ci
      - run: npm run build
      - run: npm run verify
      - uses: actions/upload-pages-artifact@v3
        with:
          path: dist

  deploy:
    needs: build
    runs-on: ubuntu-latest
    environment:
      name: github-pages
      url: ${{ steps.deployment.outputs.page_url }}
    steps:
      - id: deployment
        uses: actions/deploy-pages@v4
```

The workflow triggers only on `main` and manual dispatch. Because this branch is not `main`, pushing it does not deploy.

- [ ] **Step 2: Validate the YAML parses**

Run: `node -e "import('node:fs').then(fs=>console.log(fs.readFileSync('.github/workflows/deploy.yml','utf8').length))"` and confirm no tabs: `grep -Pn '\t' .github/workflows/deploy.yml || echo "no tabs"`
Expected: no tabs (YAML forbids them for indentation).

- [ ] **Step 3: Commit**

```bash
git add .github/workflows/deploy.yml
git commit -m "ci: build and deploy to github pages"
```

---

## Task 12: Full verification pass

- [ ] **Step 1: Clean build**

```bash
rm -rf dist .astro && npm run build && npm run verify
```
Expected: build exits 0, verify prints `✓ all checks passed`.

- [ ] **Step 2: Visual check of both posts against the originals**

Open each migrated post and its original `blog/*.html` side by side. Expected: identical diagrams, colors, and layout. This is the check `npm run verify` cannot make.

- [ ] **Step 3: External link check**

```bash
for u in \
  https://github.com/balachidam21/automated-stock-market-streaming \
  https://github.com/balachidam21/kg-fusion-transformer-for-multi-hop-qa \
  https://github.com/balachidam21/adapt-VL-models-to-vision-only-tasks \
  https://doi.org/10.1109/ACDSA67686.2026.11467982 \
  https://www.credly.com/badges/97c6f50c-1bef-436e-bcb1-f1154239d518/public_url \
  https://credentials.databricks.com/cfc819fc-1713-4ea5-ac62-87c21e7bc3d6 \
  https://www.credly.com/badges/933c2caa-b186-4a6e-9c4d-b86543fed717/public_url ; do
  printf "%-90s %s\n" "$u" "$(curl -sL -o /dev/null -w '%{http_code}' "$u")"
done
```
Expected: all 200 (DOI may 302 then 200 — `-L` follows).

- [ ] **Step 4: Responsive check at 375 / 768 / 1440px**

Expected: no horizontal scroll at 375px on any page.

- [ ] **Step 5: Report to the user and STOP**

Do not merge to `main`, do not push, do not trigger the workflow. Report: what was built, the preview command, and the remaining manual steps.

---

## Self-Review Notes

**Spec coverage:** Site structure → Tasks 6–8. Content inventory → Task 3, 6, 7. Design system → Task 2. Astro architecture → Tasks 1, 6. Migration hazard → Tasks 4, 5, and check 5 in Task 9. Risk 1 (frozen deploys) → Task 11. Risk 2 (URL break) → Task 6 step 4. Résumé PDF → Task 10. Verification section → Tasks 9 and 12.

**Known deviation from spec:** The spec specified MDX Content Collections for posts. This plan keeps the two legacy posts as `.astro` routes and uses the collection for *future* markdown posts only, with `src/data/writing.ts` merging both for the index. Rationale: converting hand-authored HTML with an inline diagram script into MDX adds real breakage risk for zero benefit on posts that will never be edited as markdown. Flagged for the user rather than applied silently.

**Not covered, deliberately:** Lighthouse ≥95 from the spec's verification list is checked manually in Task 12, not automated — adding Lighthouse CI would be a dependency out of proportion to a 5-page site.
