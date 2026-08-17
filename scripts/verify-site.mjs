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
const css = files.filter((f) => f.endsWith('.css'));
const allHtml = html.map((f) => readFileSync(f, 'utf8')).join('\n');

// 1. No client engagement names anywhere in the built output.
for (const name of ['Cardinal', 'HESS', 'Finance One', 'Fin.AI', 'Contract CoPilot']) {
  if (allHtml.includes(name)) fail(`client name "${name}" appears in dist/`);
}

// 2. No stale self-description carried over from the 2024 site.
for (const stale of ['graduate computer science student', 'currently mastering', 'go-to expert in data engineering']) {
  if (allHtml.toLowerCase().includes(stale.toLowerCase())) fail(`stale copy "${stale}" in dist/`);
}

// 3. Current positioning is actually present.
if (!allHtml.includes('Principal Consultant')) fail('current title "Principal Consultant" not found in dist/');

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

// 7. Diagram custom properties must resolve somewhere in the CSS.
const allCss = css.map((f) => readFileSync(f, 'utf8')).join('\n');
for (const prop of ['--violet', '--ink', '--muted', '--r1', '--waste']) {
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
