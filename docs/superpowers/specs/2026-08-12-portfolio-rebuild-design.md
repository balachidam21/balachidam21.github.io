# Portfolio Rebuild — Design

**Date:** 2026-08-12
**Repo:** `balachidam21.github.io`
**Branch:** `portfolio-rebuild-2026` — branched from `blog/continuous-batching-post`.
Verified 2026-08-12 against a fetched `origin/main` (`34bf8a5`, the merge of that same
branch): the working tree is **content-identical** to `origin/main` apart from this spec
and one `.gitignore` line. Only commit topology differs; no upstream work is missing.
**Status:** Approved design, pending implementation plan

---

## Problem

The site was last updated in January 2024 and misrepresents its subject. It presents a
USC masters student targeting data-engineering roles. The subject is a Principal
Consultant, AI Engineer with two years of production agentic-AI work, an IEEE
publication, and a current title the site never mentions.

Specific defects, verified against `cv.md` (career-ops, 2026-08-12):

| Site claims | Actual |
|---|---|
| "currently mastering the art at USC" | Graduated Dec 2023 |
| "go-to expert in data engineering" | Principal Consultant, AI Engineer |
| Experience: 4 internships | Missing Genpact (May 2024–present) and Keck full-time roles |
| Skills: Scala, Golang, GraphQL, Angular, MongoDB | Not in `cv.md` |
| — | Missing LangGraph, MCP, Databricks, MLflow, pgvector, TimeGPT |
| No publications | IEEE ACDSA 2026 |
| Résumé PDF | January 2024 |
| `<meta description>`: "graduate computer science student" | Governs recruiter link previews |

A secondary structural defect: `blog/continuous-batching-from-scratch.html` is a
410-line standalone file duplicating the `<head>`, nav, footer, and the entire CSS
custom-property palette, because there is no mechanism to share them. The duplication
problem is already present at post #1.

## Goals

1. Reposition the site to match current seniority and domain.
2. Serve two audiences in layers — a 30-second recruiter skim, with technical depth one click away.
3. Make publishing a post cheap enough that the site does not go stale again.
4. Publish only content that is safe to publish (see Disclosure Policy).

## Non-goals

Custom domain · removing `old_version/` or the `…github.io copy` sibling folder ·
writing new blog posts · analytics · a contact-form backend (mailto only) ·
touching `blog/paged-attention-from-scratch.html` (see Constraints).

---

## Disclosure Policy

The governing rule, decided 2026-08-12:

> **The site never says more about client work than `cv.md` and LinkedIn already do.**
> Anything deeper must be a personal project, published research, or general
> problem-class writing.

Rationale. Two distinct risks were weighed:

- **Disclosure risk.** Narrow. Résumé bullets describing one's own architectural
  decisions are already public via LinkedIn; the site restating them at the same
  granularity introduces no new category of disclosure.
- **Impression risk.** Sharper, and decisive. A detailed anonymized case study can read
  to a hiring manager as *"this person will discuss our internals too."* Anonymization
  is what makes it conspicuous: "a Fortune 500 healthcare distributor" plus 800 words
  of architecture advertises that a constraint is being worked around.

Impression risk is why **anonymized case-study pages are rejected**, not merely
deprioritized. This reverses an earlier decision in the same session to anonymize and
publish client architecture.

**Permitted:** patterns and decisions the subject made; personal projects; published
peer-reviewed research; problem-class essays where experience is the source of
authority, not the subject.

**Excluded:** client identity tied to specifics; the client's business metrics;
screenshots, real data, or code from an engagement; anything an NDA names as a
deliverable.

**Open item for the user, not the implementation:** Genpact likely has a policy on
public writing about client work. This should be checked before publishing anything in
the problem-class category. It does not block this build, which contains no such content.

---

## Constraints

- **`blog/paged-attention-from-scratch.html` must not be touched, committed, or
  referenced.** It is untracked WIP (745 lines) and the user explicitly excluded it on
  2026-08-12. Every `git add` in this work must use explicit paths — never `git add -A`
  or `git add .` — so it cannot be swept into a commit.
- `main` must remain deployable and untouched until the user approves a preview.
- The live site must not break during migration.

---

## Site Structure

```
/                    Hero · metrics strip · selected writing · experience · projects · contact
/writing             Tagged stream — #deep-dive, #research, #project
/writing/[slug]      Individual pieces (MDX)
/about               Full bio · experience detail · education · skills · résumé link
/404
```

`/writing` is a single unified stream rather than a Projects grid plus a separate Blog.
Rationale: the differentiator is demonstrated reasoning, and a unified stream makes each
piece reinforce that. It also degrades gracefully — two strong pieces read as
intentional in a stream, whereas a three-slot "Case Studies" section with one entry
filled reads as abandoned. The homepage retains a short curated Projects strip so a
recruiter scanning for "Projects" still finds one.

---

## Content Inventory

All factual content derives from `cv.md` (career-ops user layer). Nothing is invented.
Per the career-ops source-of-truth boundary: reformulate, never fabricate.

### Hero

Headline: "Hi, I'm Balaji — I build agentic AI systems."
Sub-line adapted from the `cv.md` summary, rewritten to present tense with current title.

### Metrics strip

Four figures, all from `cv.md`, none naming a client:

| Figure | Source |
|---|---|
| 100+ enterprise users | Finance One conversational AI |
| 400+ governed KPIs | Lakebase agent governance layer |
| 40% → 60% acceptance | MLflow GenAI evaluation harness |
| 20+ MCP skills | MCP servers, least-privilege tool access |

### Experience — résumé-level only

Genpact, Principal Consultant AI Engineer (Mar 2026–present) · Genpact, Assistant
Manager AI Engineer (May 2024–Feb 2026) · Keck Medicine of USC, Data Engineer /
Marketing Data Analyst (2022–2024) · Sayari Labs, USC ISI, HertzAI (condensed).

Bullets at `cv.md` granularity. No architecture deep-dives, no case-study links.

### Writing at launch

1. **Continuous batching from scratch** — migrated from `blog/continuous-batching-from-scratch.html`. Tag `#deep-dive`.
2. **IEEE ACDSA 2026** — "Effectiveness of Retrieval Augmented Generation, Contextualized Examples and Prompt Finetuning on Data Enrichment, Cleaning and Master Data Creation." Tag `#research`. Links to DOI `10.1109/ACDSA67686.2026.11467982`.

### Projects — 3 kept, 3 cut

**Kept** (verified live, HTTP 200, 2026-08-12):
- Automated Stock Market Streaming — Kafka, Spark, Cassandra, Airflow
- KG and Fusion-Based Transformer for Multi-Hop QA — RoBERTa, DFGN, Tucker fusion
- Adapting Vision-Language Models to Vision-Only Tasks — Docker, GCP

**Cut:** Yelp Review App · Delivery tracking API · `rag-llm`. Rationale: generic
CRUD/tutorial-tier work reads as junior signal on a site positioning at Principal level,
and `rag-llm` is superseded by production RAG work described in the experience section.
Three strong entries beat six mixed.

### Résumé PDF

Regenerated from `cv.md` via the career-ops `pdf` mode, replacing the January 2024
`Resume_Balaji_Chidambaram.pdf`.

---

## Design System

Direction: **evolved violet** — the identity already established in the
continuous-batching post, modernized, plus a metrics strip grafted from the rejected
"systems" direction because it is the strongest recruiter-skim element available.

Tokens extracted from the existing post's inline `<style>` into a shared Astro layer:

```
--violet: #6e57e0    --violet-alt: #7d6bd6    --violet-light: #c2b6fc
--violet-bg: #f0edfb --title: hsl(250,8%,15%) --text: hsl(250,9%,32%)
--body: #fcfcff      --container: #ffffff     --line: #e7e4f2
```

Poppins served via `@fontsource-variable/poppins` (self-hosted), not the Google Fonts
CDN — removes a third-party request and a render-blocking stylesheet.

**Removed from the current site:** jQuery, `tilt.jquery.min.js`, Swiper (carousel),
Unicons CDN, Devicon CDN, FontAwesome kit, `typed.js`, and the skill-percentage bars.
The bars are removed on signal grounds, not only weight — self-assigned "Python 90%"
conveys nothing and dates the page.

Dark mode via `prefers-color-scheme` with a token swap.

---

## Technical Architecture

Astro 5. Static output, zero client JS by default.

| Concern | Choice |
|---|---|
| Content | Content Collections + `@astrojs/mdx`, typed Zod schema |
| Feed | `@astrojs/rss` at `/rss.xml` |
| Sitemap | `@astrojs/sitemap` |
| Fonts | `@fontsource-variable/poppins` |
| Deploy | GitHub Actions → GitHub Pages |

A typed content schema means a malformed post fails the build rather than shipping
broken. Frontmatter: `title`, `description`, `date`, `tags[]`, `draft?`.

### Migration of the existing post

`blog/continuous-batching-from-scratch.html` contains hand-authored SVG diagrams driven
by a `<script>` that reads CSS custom properties **by name**, with the source marked
`diagram palette: FROZEN`. The migration must preserve those variable names exactly or
the diagrams break. This is the highest-risk part of the migration and is verified
visually, not by build success.

---

## Risks

1. **Deploys are currently frozen.** ✅ The user switched Pages source from "deploy from
   branch" to "GitHub Actions" on 2026-08-12. But the repo has no `.github/workflows/`,
   so no deployment can run. GitHub continues serving the last branch-based build — the
   site is live (HTTP 200, verified 2026-08-12) but **cannot be updated until the Astro
   workflow ships.** The workflow is therefore on the critical path, not a finishing
   touch. Corollary: the first successful workflow run replaces the live site, so it must
   not run until the build is verified locally.
2. **URL break — required mitigation, not optional.** PR #1 merged, so
   `/blog/continuous-batching-from-scratch.html` **is live and indexable** (HTTP 200,
   verified 2026-08-12). Astro would place the post at
   `/writing/continuous-batching-from-scratch/`. A redirect stub at the old path is
   mandatory; dropping it breaks a published URL. (An earlier draft of this spec judged
   the stub optional on the belief the post had never been live. That was wrong — it went
   live when PR #1 merged.)
3. **Diagram palette coupling** — see Migration above.
4. **Accidental commit of untracked WIP** — see Constraints. Mitigated by explicit-path
   `git add` only.

---

## Verification

Implementation is not complete until:

- `npm run build` succeeds with zero errors.
- The migrated post renders with diagrams intact, checked visually in a browser against
  the original file — build success is not sufficient evidence.
- Every fact on the built site traces to `cv.md`. No claim appears that `cv.md` does not
  support.
- No client name appears anywhere in the built output. Verified by grep for
  `Cardinal`, `HESS`, and `Finance One` across `dist/`.
- `git status` shows `blog/paged-attention-from-scratch.html` still untracked.
- After the first workflow deploy: the site root returns HTTP 200, and
  `/blog/continuous-batching-from-scratch.html` still resolves (via redirect stub) rather
  than 404ing. Because deploys are frozen until this workflow runs, its first run
  *replaces the live site* — verify the build locally before letting it run on `main`.
- The three retained project links, plus the DOI and all `cv.md` credential links,
  return HTTP 200.
- Site renders correctly at 375px, 768px, and 1440px widths.
- Lighthouse accessibility score ≥ 95.

---

## Decision Log

| Decision | Choice | Rationale |
|---|---|---|
| Audience | Layered — skim + depth | Serves recruiters and engineers without splitting the site |
| Stack | Astro | Markdown authoring and shared layout; duplication already hit at post #1 |
| Client work | Résumé-level only | Impression risk of anonymized case studies outweighs their value |
| Structure | Unified `/writing` stream | Degrades gracefully; reinforces demonstrated reasoning |
| Design | Evolved violet + metrics strip | Builds on established identity; metrics carry the skim |
| Projects | Cut 3 of 6 | Junior-signal entries drag the average at Principal level |
| Launch | Ship now, grow later | Current site actively misrepresents; waiting costs more than sparseness |
| PagedAttention post | Untouched | User instruction, 2026-08-12 |
