# logo.surf GEO/SEO Audit Fix Report

- Date: 2026-07-14 (second pass; first pass 2026-07-10)
- Branch: `fix/geo-seo-audit-fixes` (builds on the first-pass `fix/geo-seo-audit`)
- Source audit: parent task P30002 (`task_Sm0c1zbMrsqReA4A978vLXtx`), wiki `seo-audit/2026-07-03`
- Scope: repository-level fixes only (`index.hbs`, `build.js`, `translations/*.json`, build tooling). No production deploy or merge was performed.

All changes live in the single Handlebars template and the build script, so one edit propagates to all 16 language builds.

> Second-pass note: an adversarial re-review of the first pass found that its claim of "zero Spanish contamination" held only for `hi`. The Polish (`pl`) and Turkish (`tr`) files were still roughly 40% Spanish (UI labels, the features grid, two FAQ entries, and the languages/footer blocks). This pass finishes that translation work and hardens the lint so the defect cannot silently reappear. See section 2b.

---

## 1. Audit items addressed

### P0-1 JSON-LD was never embedded (fixed)
`build.js` produced a `WebApplication` object but only wrote it to an orphan `structured-data.json` that no page referenced. Pages shipped with zero `ld+json`.

- `build.js` now renders two JSON-LD blocks per language and injects them into the template head via `{{{jsonLd}}}`:
  - `WebApplication` (name, url, localized description, `Offer` price 0, feature list, `isAccessibleForFree`, `creator` Organization with `sameAs`, `inLanguage` as the page BCP-47 tag).
  - `FAQPage` built from the 7 existing FAQ entries in `translations/<lang>.json`. Answers are stripped of inline HTML and every value traces back to visible page copy (no invented facts).
- Output is escaped (`<` becomes the JSON unicode escape) so a stray tag inside an answer cannot break out of the script block.
- Verified: all 16 pages contain valid, parseable `WebApplication` + `FAQPage` JSON-LD.

### P0-2 Broken social preview image (fixed)
`og:image` / `twitter:image` pointed at `favicon-512x512.png`, which does not exist and returned the HTML home page (soft-404).

- Both now point to `https://www.logo.surf/assets/logo.surf.preview.png`, a real 2570x1314 preview already shipped in `assets/` and copied to `dist/` by the build.
- Added `og:image:width/height`, `og:image:alt`, `twitter:image:alt`, `og:site_name`, and `twitter:site`.

### P1-3 Soft-404 on unknown paths (fixed at repo level)
Unknown paths returned 200 + HTML.

- `build.js` now emits `dist/404.html` (with `noindex`). On Cloudflare Pages a top-level `404.html` is served with a real 404 status for unmatched routes.
- Residual risk: this depends on the host honoring `404.html`. If the site is fronted by a Worker or catch-all rewrite, that layer must also be pointed at the 404 page. Hosting config is outside the repo.

### P1-4 Missing `<main>` and duplicate `<h1>` (fixed)
- The header brand `<h1>` is now a `<span>`; the single page `<h1>` is the hero tagline.
- Primary content is wrapped in a `<main>` landmark. The "Available languages" heading was raised from `<h3>` to `<h2>` for a correct outline.
- Verified: every page has exactly one `<h1>` and one balanced `<main>`.

### P1-5 Runtime Tailwind CDN and no resource hints (partially addressed)
- Added `preconnect` / `dns-prefetch` for the Tailwind CDN, cdnjs, and Google Fonts origins.
- Deferred: replacing the runtime `cdn.tailwindcss.com` with precompiled CSS. `app.js` injects utility classes at runtime (color schemes, gallery, previews) and the page relies on an inline `tailwind.config`, so static class extraction needs a dedicated safelist plus visual QA. Doing it blind risks visual regressions, so it is left as a follow-up rather than shipped half-done. Documented here as a known remaining item.

### P1-6 Language tag inconsistency (fixed, and generalized)
`/zh-CN/` shipped `<html lang="zh-hans">` while the URL and sitemap used `zh-CN`.

- Added a single `toBcp47()` mapping in `build.js`. It now drives `<html lang>`, in-page `hreflang`, the sitemap, and the language switcher, so every public surface uses the BCP-47 tag (`zh-CN`, `zh-TW`, etc.).
- The in-page `hreflang` links previously used the internal codes (`zh-hans` / `zh-hant`), which disagreed with the sitemap. This is now consistent, and an `x-default` alternate (pointing to English) was added to both the page and the sitemap.

### P2 items
- `sitemap.xml` `lastmod` refreshes on every build (already used `new Date()`); it updates on the next deploy.
- Added a `/changelog/` page (see below), included in the sitemap, as a first step beyond the single-page structure.

---

## 2. Additional defects found by generalization (not in the original audit)

The audit only sampled English and `zh-CN`. Reviewing all 16 locales surfaced defects that were more severe than several audit items:

### Template keys that resolved to nothing in all 16 languages (fixed)
Four template references did not match any translation key, so they rendered empty everywhere:

| Template used | Correct key |
|---|---|
| `footer.follow_us` | `footer.follow_on_x` |
| `footer.available_languages_title` | `languages.title` |
| `footer.language_note` | `languages.note` |
| `gallery.copyright_note` | `gallery.brand_copyright` |

Effect before fix: the "Follow us" button had no label, the languages section had no heading or note, and the gallery copyright line was blank in every language. Fixed by pointing the template at the real keys.

### Four locales were half-migrated and mostly empty (fixed)
`hi`, `ko`, `pl`, `tr` still used an older flat translation schema while the template expects the nested schema. As a result their meta title, description, hero, generator labels, FAQ, and footer rendered empty. They were remapped to the nested schema, preserving the existing human translations.

### Three locales carried wrong-language content and a false "AI" claim (fixed)
`hi`, `pl`, and `tr` had been seeded from an outdated Spanish source. Consequences:

- The FAQ (and, for `hi`, most of the page) displayed Spanish text on Hindi / Polish / Turkish pages.
- That old copy asserted the product is "AI powered" (`generación de logotipos impulsada por IA`), which directly contradicts the site's actual positioning. The current English FAQ states Logo.surf does not use AI, and that "not AI" stance is the key differentiator called out by the audit.
- The Turkish meta description also contained mojibake.

Fix: the corrupted fields were replaced with correct translations of the current canonical English copy, in the correct language, with no AI claim. `ko` was already clean Korean and only needed the schema remap.

### Empty flag markup (fixed)
The language grid rendered an always-empty `{{flag}}` span (no flag data exists). The empty element was removed.

---

## 2b. Second pass: Polish and Turkish were still ~40% Spanish (fixed)

The first pass converted `pl` and `tr` from the flat to the nested schema but carried the pre-existing Spanish strings across untouched, then reported them as clean. A key-by-key re-review of every locale (comparing each value against the Spanish reference) found the leak was extensive, not limited to the FAQ:

- `pl` and `tr`: about 40 strings each were Spanish, including the generator labels (`Configuración`, `Vista Previa`, `Color de Fondo`, `Descargar PNG`), the features grid (`Características`, `Múltiples Formatos`), two FAQ entries (`font_copyright`, `supported_characters`), `gallery.brand_copyright` (which was also the wrong sentence: a Spanish "all rights reserved" instead of the trademark disclaimer), the `languages` block, and `footer.follow_on_x` / `footer.privacy_note`.
- Root cause: the original flat `pl.json` / `tr.json` on `main` were themselves seeded from `es.json` and only partially translated, so the correct text could not be recovered from git history. Each Spanish string was translated fresh from the current canonical English copy into proper Polish / Turkish.
- `hi`, `ko` and the other 12 locales were re-verified clean.

Verified: a full cross-locale sweep now reports zero strings in any non-Romance locale that are byte-identical to the Spanish reference (Romance locales `fr` / `it` / `pt` are excluded because they legitimately share vocabulary with Spanish), and template-key parity holds across all 16 files.

---

## 3. New: /changelog page

- `build.js` generates `dist/changelog/index.html`, a user-facing changelog (English) linked from the footer of every page and listed in the sitemap.
- The footer link label is localized in all 16 languages via a new `footer.changelog` key.
- Content is written from the visitor's point of view and does not expose internal implementation.

---

## 4. New: lint guard + pre-commit hook

`scripts/lint-i18n-seo.js` (run via `pnpm run lint`) fails the build if any of the fixed defects regress:

1. i18n completeness: every `{{t.*}}` key used by the template must exist and be non-empty in all 16 locale files (catches key mismatches and half-migrated schemas).
2. Cross-locale contamination: no non-Romance locale may contain a string that is byte-identical to the Spanish reference (this is exactly how `pl` / `tr` ended up part-Spanish). Romance locales (`fr` / `it` / `pt`) are excluded and a short allow-list covers universal tokens (brand name, `PNG`, `SVG`, `Normal`, etc.).
3. Template invariants: exactly one `<h1>`, a `<main>` landmark, `<html lang="{{htmlLang}}">`, a JSON-LD injection point, and social images that resolve to a real local asset (the old `favicon-512x512` reference is explicitly rejected).
4. Rendered output: after building, every page must expose valid `WebApplication` + `FAQPage` JSON-LD, one `<h1>`, a `<main>`, and an `<html lang>` that matches its URL locale and is never an internal-only code.

Husky is installed and configured (`.husky/pre-commit` runs `pnpm run lint`) so the check runs before every commit. Verified: the lint passes on the clean tree and fails (exit 1) when a translation key is dropped, a Spanish string is reintroduced into a non-Romance locale, or the broken image reference is reintroduced.

---

## 5. Verification commands

```bash
pnpm install
pnpm run build         # builds dist/ for all 16 languages
pnpm run lint          # i18n + SEO invariants, exits non-zero on regression
pnpm start             # serve dist/ at http://localhost:8000
```

Checks performed on the built output:

- 16/16 pages contain valid `WebApplication` + `FAQPage` JSON-LD.
- `og:image` / `twitter:image` resolve to an existing 2570x1314 asset.
- Each page has one `<h1>`, one `<main>`, and `<html lang>` equal to its URL locale (`zh-CN` / `zh-TW`, never `zh-hans` / `zh-hant`).
- In-page `hreflang` matches the sitemap; `x-default` present in both.
- `dist/404.html` and `dist/changelog/index.html` are generated; `/changelog/` is in the sitemap.
- No Spanish contamination and no false "AI powered" claims in any locale.

---

## 6. Remaining risks / not covered

- Runtime Tailwind CDN to precompiled CSS (P1-5) is deferred; see the rationale above. Resource hints partially mitigate the cost.
- The 404 status fix depends on the hosting layer serving `dist/404.html`; verify on the live host after deploy.
- Depth pages, comparison/alternative pages, and fact-card modules (P2 content assets) are out of scope for this pass.
- A tracked, stale root `index.html` predates the i18n refactor. The build serves `dist/`, so it appears unused, but it was left untouched to avoid changing serving behavior. Recommend confirming the deploy source and removing it if unused.
- The orphan `dist/structured-data.json` is still emitted for backward compatibility; the real structured data is now inline and no longer depends on it.
