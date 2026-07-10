#!/usr/bin/env node
/*
 * lint-i18n-seo.js
 *
 * Guards against the classes of GEO/SEO and i18n defects fixed in the
 * 2026-07 audit so they cannot silently reappear:
 *
 *   1. i18n completeness - every {{t.*}} key used by the template must exist
 *      in every translations/*.json (catches half-migrated locales and
 *      template<->translation key mismatches).
 *   2. Template invariants - single <h1>, a <main> landmark, BCP-47 <html lang>,
 *      JSON-LD injection, and social images that point at a real asset.
 *   3. Rendered output - after building, every page must expose valid JSON-LD,
 *      exactly one <h1>, a <main>, and a consistent <html lang>.
 *
 * Runs on pre-commit (via husky) and is safe to run in CI.
 */

const fs = require('fs');
const path = require('path');
const { execSync } = require('child_process');

const root = path.resolve(__dirname, '..');
const errors = [];
const fail = msg => errors.push(msg);

function readJson(p) {
  return JSON.parse(fs.readFileSync(p, 'utf8'));
}

function hasPath(obj, dottedPath) {
  let cur = obj;
  for (const seg of dottedPath.split('.')) {
    if (cur && typeof cur === 'object' && seg in cur) cur = cur[seg];
    else return false;
  }
  return typeof cur === 'string' ? cur.trim() !== '' : cur != null;
}

// --- Load template ---------------------------------------------------------
const templatePath = path.join(root, 'index.hbs');
const template = fs.readFileSync(templatePath, 'utf8');

// --- 1. i18n completeness --------------------------------------------------
const referencedKeys = [
  ...new Set(
    [...template.matchAll(/\{\{\{?\s*(t\.[a-zA-Z0-9_.]+)/g)].map(m => m[1].slice(2))
  )
].sort();

const translationFiles = fs
  .readdirSync(path.join(root, 'translations'))
  .filter(f => f.endsWith('.json'));

for (const file of translationFiles) {
  const data = readJson(path.join(root, 'translations', file));
  const missing = referencedKeys.filter(k => !hasPath(data, k));
  if (missing.length) {
    fail(`translations/${file}: missing/empty i18n keys -> ${missing.join(', ')}`);
  }
}

// --- 2. Template invariants ------------------------------------------------
const h1Count = (template.match(/<h1\b/g) || []).length;
if (h1Count !== 1) fail(`index.hbs: expected exactly one <h1>, found ${h1Count}`);
if (!/<main\b/.test(template)) fail('index.hbs: missing <main> landmark');
if (!/<html lang="\{\{htmlLang\}\}"/.test(template)) {
  fail('index.hbs: <html lang> must use {{htmlLang}} (BCP-47), not the raw {{lang}} code');
}
if (!/\{\{\{jsonLd\}\}\}/.test(template)) {
  fail('index.hbs: missing {{{jsonLd}}} JSON-LD injection point');
}

// Social images must resolve to a real local asset (no soft-404 covers).
const socialImgs = [...template.matchAll(/(?:og:image|twitter:image)"\s+content="([^"]+)"/g)].map(m => m[1]);
for (const url of socialImgs) {
  const rel = url.replace(/^https?:\/\/[^/]+\//, '');
  if (/favicon-512x512/.test(url) || !fs.existsSync(path.join(root, rel))) {
    fail(`index.hbs: social image does not point to an existing asset -> ${url}`);
  }
}

// --- 3. Rendered output ----------------------------------------------------
try {
  execSync('node build.js', { cwd: root, stdio: 'pipe' });
} catch (e) {
  fail(`build failed: ${e.message}`);
}

const distDir = path.join(root, 'dist');
if (fs.existsSync(distDir)) {
  const pages = [];
  const walk = dir => {
    for (const name of fs.readdirSync(dir)) {
      const full = path.join(dir, name);
      if (fs.statSync(full).isDirectory()) {
        if (name === 'changelog') continue; // standalone page, not a localized index
        walk(full);
      } else if (name === 'index.html') {
        pages.push(full);
      }
    }
  };
  walk(distDir);

  for (const page of pages) {
    const html = fs.readFileSync(page, 'utf8');
    const rel = path.relative(distDir, page);

    const h1s = (html.match(/<h1\b/g) || []).length;
    if (h1s !== 1) fail(`dist/${rel}: expected one <h1>, found ${h1s}`);
    if (!/<main\b/.test(html)) fail(`dist/${rel}: missing <main>`);

    const ld = [...html.matchAll(/<script type="application\/ld\+json">([\s\S]*?)<\/script>/g)];
    if (ld.length < 2) fail(`dist/${rel}: expected >=2 JSON-LD blocks, found ${ld.length}`);
    const types = [];
    for (const block of ld) {
      try {
        types.push(JSON.parse(block[1])['@type']);
      } catch (e) {
        fail(`dist/${rel}: JSON-LD is not valid JSON (${e.message})`);
      }
    }
    if (!types.includes('WebApplication')) fail(`dist/${rel}: missing WebApplication JSON-LD`);
    if (!types.includes('FAQPage')) fail(`dist/${rel}: missing FAQPage JSON-LD`);

    const langMatch = html.match(/<html lang="([^"]+)"/);
    const lang = langMatch && langMatch[1];
    if (!lang) fail(`dist/${rel}: missing <html lang>`);
    if (lang === 'zh-hans' || lang === 'zh-hant') {
      fail(`dist/${rel}: <html lang="${lang}"> must use the BCP-47 tag (zh-CN / zh-TW)`);
    }
    const expected = rel === 'index.html' ? 'en' : path.dirname(rel);
    if (lang && lang !== expected) {
      fail(`dist/${rel}: <html lang="${lang}"> does not match URL locale "${expected}"`);
    }
  }
}

// --- Report ----------------------------------------------------------------
if (errors.length) {
  console.error('✗ i18n/SEO lint failed:');
  for (const e of errors) console.error('  - ' + e);
  process.exit(1);
}
console.log('✓ i18n/SEO lint passed (' + referencedKeys.length + ' keys × ' + translationFiles.length + ' locales).');
