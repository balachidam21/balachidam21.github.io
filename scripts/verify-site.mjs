#!/usr/bin/env node
// Verification harness for the built site. Run after `npm run build`.
// These are the checks a green Astro build does NOT make — most importantly the
// diagram-scoping check, whose failure mode is a passing build with unstyled diagrams.

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

if (!existsSync(DIST)) {
  console.error('dist/ missing — run `npm run build` first');
  process.exit(1);
}

const files = walk(DIST);
const html = files.filter((f) => f.endsWith('.html'));
// CSS lives in TWO places. Astro's build.inlineStylesheets:'auto' inlines any
// stylesheet under ~4kB straight into the HTML, so globbing .css files alone silently
// skips every small component's styles. That blind spot let SectionNav ship with
// Astro-scoped selectors that could never match its runtime-created nodes -- the exact
// bug check 6 exists to catch -- while this harness stayed green. Never narrow this.
const cssFiles = files.filter((f) => f.endsWith('.css'));
const css = cssFiles;
const inlineCss = html
  .map((f) => [...readFileSync(f, 'utf8').matchAll(/<style[^>]*>([\s\S]*?)<\/style>/g)].map((m) => m[1]).join('\n'))
  .join('\n');
const allCss = cssFiles.map((f) => readFileSync(f, 'utf8')).join('\n') + '\n' + inlineCss;
const allHtml = html.map((f) => readFileSync(f, 'utf8')).join('\n');

// 1. No client engagement names anywhere in the built output.
for (const name of ['Cardinal', 'HESS', 'Finance One', 'Fin.AI', 'Contract CoPilot']) {
  if (allHtml.includes(name)) fail(`client name "${name}" appears in dist/`);
}

// 1b. No client CHARACTERISATION either. Withholding the name while describing the
// client's industry ("for a healthcare distributor") still narrows identification, and
// advertises that a constraint is being worked around -- the exact anonymisation pattern
// the Disclosure Policy rejects. Caught in review of PR #3, where two engagement titles
// had inferred the clients' industries from knowledge of who they were.
for (const phrase of [
  'healthcare distributor', 'energy company', 'oil and gas', 'pharmaceutical distributor',
  'Fortune 500', 'Fortune 100', 'a major bank', 'a leading retailer',
]) {
  if (allHtml.toLowerCase().includes(phrase.toLowerCase())) {
    fail(`client characterisation "${phrase}" appears in dist/ — name-free is not enough, do not describe the client`);
  }
}

// 2. No stale self-description carried over from the 2024 site.
for (const stale of ['graduate computer science student', 'currently mastering', 'go-to expert in data engineering']) {
  if (allHtml.toLowerCase().includes(stale.toLowerCase())) fail(`stale copy "${stale}" in dist/`);
}

// 3. Current positioning is actually present.
if (!allHtml.includes('Principal Consultant')) fail('current title "Principal Consultant" not found in dist/');

// 3b. Glued-word guard. Astro parses inline markup as JSX and drops the newline
// between an inline element and adjacent text, silently producing "slowestfinishes".
// Catch any lowercase letter butting directly against a closing inline tag or an
// opening one, which is never intentional in prose.
// The negative lookbehind skips EMPTY inline elements: the diagram legends use
// `<i class="sw req"></i>request decoded` as a colour swatch, which is correct markup
// and byte-identical to the original. Only closing tags that actually wrapped text count.
const GLUE = /(?<!>)(<\/(?:b|i|em|strong|code|a)>)([a-z])|([a-z])(<(?:b|i|em|strong|code)>)/g;
for (const f of html) {
  const body = readFileSync(f, 'utf8').replace(/<(script|style)[\s\S]*?<\/\1>/g, '');
  const hits = [...body.matchAll(GLUE)]
    // section-number chips like <span class="n">01</span>Static are intentional
    .filter((m) => !/class="n"/.test(body.slice(Math.max(0, m.index - 60), m.index)));
  if (hits.length) {
    fail(`${f}: ${hits.length} glued word(s) at tag boundary, e.g. "${body.slice(Math.max(0, hits[0].index - 12), hits[0].index + 24).replace(/\s+/g, ' ')}"`);
  }
}

// 4. Required routes exist.
const required = [
  'dist/index.html',
  'dist/about/index.html',
  'dist/writing/index.html',
  'dist/writing/continuous-batching-from-scratch/index.html',
  'dist/writing/paged-attention-from-scratch/index.html',
  'dist/404.html',
  'dist/blog/continuous-batching-from-scratch.html',
  'dist/blog/paged-attention-from-scratch.html',
  // The résumé is the highest-value link for a recruiter; a missing file 404s silently.
  'dist/Resume_Balaji_Chidambaram.pdf',
  'dist/robots.txt',
  // The continuous-batching diagrams are injected by this script at runtime. Without
  // it the three <svg> shells still count as 3 and every other check stays green.
  'dist/js/continuous-batching-diagrams.js',
];
for (const p of required) if (!existsSync(p)) fail(`missing route: ${p}`);

// 5. Redirect stubs point at the new URLs.
const stubs = {
  'dist/blog/continuous-batching-from-scratch.html': '/writing/continuous-batching-from-scratch/',
  'dist/blog/paged-attention-from-scratch.html': '/writing/paged-attention-from-scratch/',
};
for (const [f, target] of Object.entries(stubs)) {
  if (existsSync(f) && !readFileSync(f, 'utf8').includes(target)) {
    fail(`${f} does not redirect to ${target}`);
  }
}

// 5b. The diagram script must actually be referenced by the post that needs it.
const cbPost = 'dist/writing/continuous-batching-from-scratch/index.html';
if (existsSync(cbPost) && !readFileSync(cbPost, 'utf8').includes('/js/continuous-batching-diagrams.js')) {
  fail(`${cbPost}: diagram script is not referenced — all three diagrams will render blank`);
}

// 5c. The layout must keep its namespaced chrome classes. If it reverts to
// .site-footer, the post CSS (which still defines that class as a violet block)
// would restyle the footer on post pages only.
for (const f of ['dist/index.html', cbPost]) {
  if (!existsSync(f)) continue;
  const src = readFileSync(f, 'utf8');
  if (!src.includes('pf-footer') || !src.includes('pf-nav')) {
    fail(`${f}: layout chrome is not using .pf-nav/.pf-footer — post CSS will collide`);
  }
}

// 6. THE important one: diagram class rules must not be scope-suffixed.
// Astro stamps data-astro-cid-* on build-time elements only; the continuous-batching
// script creates SVG nodes at runtime, which never receive it. A scoped rule would
// silently stop matching and every diagram would render unstyled.
// Each post has its own diagram class vocabulary — verified against the sources.
const POST_DIAGRAM_CLASSES = [
  { match: /continuous-batching/, classes: /\.(stepnum|lanelbl|cell-lbl)\s*[,.{]/ },
  { match: /paged-attention/, classes: /\.(s-lbl|s-num|s-mid|s-sub)\s*[,.{]/ },
];
const postCss = css.filter((f) => POST_DIAGRAM_CLASSES.some((p) => p.match.test(f)));
if (postCss.length !== 2) fail(`expected 2 post CSS bundles in dist/_astro/, found ${postCss.length}`);
for (const f of postCss) {
  const src = readFileSync(f, 'utf8');
  if (src.includes('data-astro-cid')) {
    fail(`${f}: post CSS is scoped — runtime-created SVG nodes will render unstyled`);
  }
  const spec = POST_DIAGRAM_CLASSES.find((p) => p.match.test(f));
  if (spec && !spec.classes.test(src)) fail(`${f}: expected diagram class rules not found`);
  // The post CSS still carries the original page's chrome rules (.nav, .site-footer,
  // .socials). That is harmless ONLY because BaseLayout namespaces its own chrome as
  // .pf-nav / .pf-footer. If the layout ever reverts to .site-footer, post pages would
  // render a full violet footer while every other page renders the bordered one.
  for (const layoutClass of ['.pf-nav', '.pf-footer']) {
    if (src.includes(layoutClass)) {
      fail(`${f}: post CSS defines ${layoutClass} — it would override the site layout`);
    }
  }
}

// 6b. Any component that creates DOM at runtime must have GLOBAL styles, for the same
// reason as check 6. Scope-suffixed selectors on those hooks match nothing.
for (const hook of ['.toc-list', '.toc', '.to-top']) {
  const scoped = new RegExp(`\\${hook}\\[data-astro-cid`);
  if (scoped.test(allCss)) {
    fail(`${hook} is Astro-scoped — SectionNav builds its links at runtime, so scoped rules never match and the nav renders unstyled`);
  }
}

// 7. Diagram custom properties must resolve somewhere in the CSS.
for (const prop of [
  '--violet', '--violet-alt', '--violet-light', '--violet-bg', '--title', '--text',
  '--text-light', '--body', '--container', '--line', '--accent2', '--ink', '--muted',
  '--idle', '--idle-ink', '--none', '--r1', '--r2', '--r3', '--r4', '--r5',
  '--waste', '--waste-ink', '--panel-warm', '--panel-cool', '--panel-sand',
  '--rung-cool-ink', '--rung-sand-ink',
]) {
  if (!allCss.includes(`${prop}:`)) fail(`custom property ${prop} is never defined in dist CSS`);
}

// 8. Both posts kept their diagrams.
const svgExpect = {
  'dist/writing/continuous-batching-from-scratch/index.html': 3,
  'dist/writing/paged-attention-from-scratch/index.html': 5,
};
for (const [f, n] of Object.entries(svgExpect)) {
  if (!existsSync(f)) continue;
  const found = (readFileSync(f, 'utf8').match(/<svg/g) || []).length;
  if (found !== n) fail(`${f}: expected ${n} <svg>, found ${found}`);
}

// 8b. Every custom property referenced anywhere must be defined, in BOTH themes if
// it is defined in dark at all. A var() with no definition renders as nothing.
const referenced = new Set([...allCss.matchAll(/var\((--[a-z0-9-]+)\)/g)].map((m) => m[1]));
for (const prop of referenced) {
  if (!allCss.includes(`${prop}:`)) fail(`custom property ${prop} is used but never defined`);
}

// 8c. SEO essentials.
for (const f of html) {
  const src = readFileSync(f, 'utf8');
  const is404 = f.endsWith('404.html');
  // /resume is print-only and noindex: it exists to source the PDF, not to be found.
  const isStub = f.includes('/blog/') || f.includes('/resume/');
  if (isStub) continue;
  if (!src.includes('og:image')) fail(`${f}: missing og:image`);
  if (is404) {
    if (src.includes('rel="canonical"')) fail(`${f}: 404 must not declare a canonical`);
    if (!src.includes('name="robots"')) fail(`${f}: 404 must be noindex`);
  } else if (!src.includes('rel="canonical"')) {
    fail(`${f}: missing canonical`);
  }
}

// 8d. Every internal link must resolve to something that exists. The migrated
// PagedAttention post carried a relative href ("continuous-batching-from-scratch.html")
// that was correct when both posts were flat siblings under /blog/, but 404s now the
// post lives a directory deeper at /writing/<slug>/. Nothing else caught it.
const resolveRoute = (href) => {
  const clean = href.split('#')[0].split('?')[0];
  if (!clean) return null;
  if (clean.endsWith('/')) return `${DIST}${clean}index.html`;
  if (/\.[a-z0-9]+$/i.test(clean)) return `${DIST}${clean}`;
  return `${DIST}${clean}/index.html`;
};
for (const f of html) {
  const src = readFileSync(f, 'utf8');
  for (const m of src.matchAll(/href="([^"]+)"/g)) {
    const href = m[1];
    if (/^(https?:|mailto:|tel:|data:|#)/.test(href)) continue;
    if (!href.startsWith('/')) {
      fail(`${f}: relative internal link "${href}" — use an absolute path, relative links break when routes move`);
      continue;
    }
    const target = resolveRoute(href);
    if (target && !existsSync(target)) fail(`${f}: internal link "${href}" resolves to missing ${target}`);
  }
}

// 9. Legacy template cruft must be gone.
for (const [pattern, label] of [
  [/skills_percentage|skills__percentage/, 'legacy skill-percentage bars'],
  [/jquery/i, 'jQuery'],
  [/swiper/i, 'Swiper carousel'],
  [/tilt\.jquery/i, 'tilt.js'],
]) {
  if (pattern.test(allHtml)) fail(`${label} still present in dist/`);
}

if (failures.length) {
  console.error(`\n✗ ${failures.length} check(s) failed:\n` + failures.map((f) => `  - ${f}`).join('\n') + '\n');
  process.exit(1);
}
console.log(`✓ all checks passed — ${html.length} HTML files, ${css.length} CSS bundles`);
