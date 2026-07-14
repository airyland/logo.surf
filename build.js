const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');

// Configuration
const config = {
  baseUrl: 'https://www.logo.surf',
  supportedLanguages: {
    'en': { name: 'English', dir: 'ltr' },
    'zh-hans': { name: '简体中文', dir: 'ltr' },
    'zh-hant': { name: '繁體中文', dir: 'ltr' },
    'es': { name: 'Español', dir: 'ltr' },
    'fr': { name: 'Français', dir: 'ltr' },
    'de': { name: 'Deutsch', dir: 'ltr' },
    'ja': { name: '日本語', dir: 'ltr' },
    'ko': { name: '한국어', dir: 'ltr' },
    'pt': { name: 'Português', dir: 'ltr' },
    'ru': { name: 'Русский', dir: 'ltr' },
    'ar': { name: 'العربية', dir: 'rtl' },
    'it': { name: 'Italiano', dir: 'ltr' },
    'nl': { name: 'Nederlands', dir: 'ltr' },
    'pl': { name: 'Polski', dir: 'ltr' },
    'tr': { name: 'Türkçe', dir: 'ltr' },
    'hi': { name: 'हिंदी', dir: 'ltr' }
  },
  outputDir: 'dist',
  templateFile: 'index.hbs',
  translationsDir: 'translations'
};

// Map an internal language code to its public BCP-47 tag.
// The internal codes (zh-hans / zh-hant) differ from the URL/hreflang tags
// (zh-CN / zh-TW); every public-facing surface must use the BCP-47 tag so that
// <html lang>, in-page hreflang and the sitemap stay consistent.
function toBcp47(lang) {
  const map = {
    'zh-hans': 'zh-CN',
    'zh-hant': 'zh-TW'
  };
  return map[lang] || lang;
}

// Remove HTML tags / decode a few entities and collapse whitespace so FAQ
// answers that contain inline markup become clean plain text for JSON-LD.
function stripHtml(input) {
  return String(input)
    .replace(/<[^>]*>/g, ' ')
    .replace(/&amp;/g, '&')
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'")
    .replace(/&nbsp;/g, ' ')
    .replace(/\s+/g, ' ')
    .trim();
}

// Build the two per-language JSON-LD blocks (WebApplication + FAQPage).
// Every value is sourced from the page's own visible copy so the structured
// data never asserts anything the page does not already state.
function buildJsonLd(lang, t) {
  const url = getLanguageUrl(lang);
  const bcp47 = toBcp47(lang);

  const webApplication = {
    '@context': 'https://schema.org',
    '@type': 'WebApplication',
    'name': 'Logo.surf',
    'url': url,
    'description': (t.meta && t.meta.description) || '',
    'applicationCategory': 'DesignApplication',
    'operatingSystem': 'Web Browser',
    'browserRequirements': 'Requires JavaScript.',
    'inLanguage': bcp47,
    'isAccessibleForFree': true,
    'offers': { '@type': 'Offer', 'price': '0', 'priceCurrency': 'USD' },
    'featureList': [
      'Text to Logo',
      'Text to Favicon',
      'PNG, SVG and ICO export',
      'Customizable colors and fonts',
      'Instant preview',
      'Free download'
    ],
    'creator': {
      '@type': 'Organization',
      'name': 'Logo.surf',
      'url': config.baseUrl,
      'sameAs': [
        'https://github.com/airyland/logo.surf',
        'https://twitter.com/we_webmaster'
      ]
    }
  };

  const faq = t.faq || {};
  const faqPairs = [
    ['what_is_logosurf', 'what_is_logosurf_answer'],
    ['ai_question', 'ai_answer'],
    ['what_is_favicon', 'what_is_favicon_answer'],
    ['font_copyright', 'font_copyright_answer'],
    ['supported_characters', 'supported_characters_answer'],
    ['why_different_sizes', 'why_different_sizes_answer'],
    ['how_to_add', 'how_to_add_answer']
  ];
  const mainEntity = faqPairs
    .filter(([q, a]) => faq[q] && faq[a])
    .map(([q, a]) => ({
      '@type': 'Question',
      'name': stripHtml(faq[q]),
      'acceptedAnswer': { '@type': 'Answer', 'text': stripHtml(faq[a]) }
    }));

  const faqPage = {
    '@context': 'https://schema.org',
    '@type': 'FAQPage',
    'inLanguage': bcp47,
    'mainEntity': mainEntity
  };

  // Escaping "<" as < keeps a stray "</script>" inside any answer from
  // breaking out of the inline JSON-LD block.
  const encode = obj => JSON.stringify(obj).replace(/</g, '\\u003c');
  return `<script type="application/ld+json">${encode(webApplication)}</script>\n    <script type="application/ld+json">${encode(faqPage)}</script>`;
}

// Helper functions
function loadTranslations() {
  const translations = {};
  for (const lang of Object.keys(config.supportedLanguages)) {
    // Map language codes to file names
    const fileMapping = {
      'zh-hans': 'zh-hans',
      'zh-hant': 'zh-hant'
    };
    const fileName = fileMapping[lang] || lang;
    const filePath = path.join(config.translationsDir, `${fileName}.json`);
    if (fs.existsSync(filePath)) {
      const content = fs.readFileSync(filePath, 'utf8');
      if (content.trim()) {
        translations[lang] = JSON.parse(content);
      } else {
        console.warn(`Translation file is empty: ${filePath}`);
      }
    } else {
      console.warn(`Translation file not found: ${filePath}`);
    }
  }
  return translations;
}

function getLanguageUrl(lang) {
  if (lang === 'en') {
    return config.baseUrl + '/';
  }
  return config.baseUrl + '/' + toBcp47(lang) + '/';
}

function getFilePath(lang) {
  if (lang === 'en') {
    return 'index.html';
  }
  return path.join(toBcp47(lang), 'index.html');
}

// Keyed by the public BCP-47 tag so in-page hreflang matches the sitemap.
// An x-default entry points crawlers at the English version.
function generateAlternateUrls() {
  const alternateUrls = {};
  for (const lang of Object.keys(config.supportedLanguages)) {
    alternateUrls[toBcp47(lang)] = getLanguageUrl(lang);
  }
  alternateUrls['x-default'] = getLanguageUrl('en');
  return alternateUrls;
}

function generateLanguageOptions(currentLang) {
  return Object.entries(config.supportedLanguages).map(([code, info]) => {
    const urlCode = toBcp47(code);
    return {
      code,
      name: info.name,
      url: code === 'en' ? '/' : `/${urlCode}/`,
      current: code === currentLang
    };
  });
}

function ensureDirectoryExists(filePath) {
  const dir = path.dirname(filePath);
  if (!fs.existsSync(dir)) {
    fs.mkdirpSync(dir);
  }
}

async function copyStaticAssets() {
  console.log('📁 Copying static assets...');
  
  const staticAssets = [
    'app.js',
    'apple-touch-icon.png',
    'favicon-16x16.png',
    'favicon-32x32.png',
    'favicon-2048x2048.png',
    'favicon.ico',
    'assets',
    'LICENSE',
    'README.MD'
  ];

  for (const asset of staticAssets) {
    const srcPath = path.join('.', asset);
    const destPath = path.join(config.outputDir, asset);
    
    if (fs.existsSync(srcPath)) {
      if (fs.statSync(srcPath).isDirectory()) {
        fs.copySync(srcPath, destPath, { overwrite: true });
      } else {
        fs.copyFileSync(srcPath, destPath);
      }
    }
  }
}

function generateSitemap() {
  console.log('🗺️  Generating sitemap.xml...');
  
  const urls = [];
  
  for (const lang of Object.keys(config.supportedLanguages)) {
    const url = getLanguageUrl(lang);
    const alternates = Object.keys(config.supportedLanguages).map(altLang => ({
      lang: toBcp47(altLang),
      url: getLanguageUrl(altLang)
    }));
    alternates.push({ lang: 'x-default', url: getLanguageUrl('en') });

    urls.push({
      loc: url,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: lang === 'en' ? '1.0' : '0.8',
      alternates: alternates
    });
  }

  const today = new Date().toISOString().split('T')[0];
  const sitemap = `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9"
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls.map(url => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${url.alternates.map(alt => `    <xhtml:link rel="alternate" hreflang="${alt.lang}" href="${alt.url}"/>`).join('\n')}
  </url>`).join('\n')}
  <url>
    <loc>${config.baseUrl}/changelog/</loc>
    <lastmod>${today}</lastmod>
    <changefreq>monthly</changefreq>
    <priority>0.5</priority>
  </url>
</urlset>`;

  fs.writeFileSync(path.join(config.outputDir, 'sitemap.xml'), sitemap);
}

function generateRobotsTxt() {
  console.log('🤖 Generating robots.txt...');
  
  const robots = `User-agent: *
Allow: /

# Sitemaps
Sitemap: ${config.baseUrl}/sitemap.xml

# Block common bot patterns
User-agent: AhrefsBot
Disallow: /

User-agent: MJ12bot
Disallow: /

User-agent: DotBot
Disallow: /`;

  fs.writeFileSync(path.join(config.outputDir, 'robots.txt'), robots);
}

// Static 404 page. On Cloudflare Pages a top-level 404.html is served with a
// real 404 status for unmatched paths, which replaces the previous soft-404
// (unknown paths returning 200 + the home page).
function generate404() {
  console.log('🚧 Generating 404.html...');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <meta name="robots" content="noindex">
    <title>Page not found - Logo.surf</title>
    <link rel="icon" type="image/png" sizes="2048x2048" href="/favicon-2048x2048.png">
    <style>
      body { font-family: system-ui, -apple-system, "Segoe UI", Roboto, sans-serif; background: #f9fafb; color: #111827; margin: 0; min-height: 100vh; display: flex; align-items: center; justify-content: center; text-align: center; }
      .wrap { padding: 2rem; max-width: 32rem; }
      h1 { font-size: 4rem; margin: 0; }
      p { color: #4b5563; font-size: 1.125rem; }
      a { display: inline-block; margin-top: 1.5rem; background: #111827; color: #fff; padding: 0.75rem 1.5rem; border-radius: 9999px; text-decoration: none; }
      a:hover { background: #374151; }
    </style>
  </head>
  <body>
    <div class="wrap">
      <h1>404</h1>
      <p>The page you are looking for could not be found.</p>
      <a href="/">Back to Logo.surf</a>
    </div>
  </body>
</html>`;

  fs.writeFileSync(path.join(config.outputDir, '404.html'), html);
}

// User-facing changelog. Content is written from the visitor's point of view,
// with no internal implementation detail.
const changelogEntries = [
  {
    date: '2026-07-14',
    title: 'Better previews and more complete translations',
    items: [
      'Logo.surf now appears with a proper preview image when shared on social platforms and messaging apps.',
      'Search engines and AI assistants can now read a clear summary of the tool and its most common questions.',
      'Hindi, Korean, Polish and Turkish are now fully translated across the whole page.',
      'Language settings are now consistent for every locale.',
      'Improved page structure and accessibility.'
    ]
  }
];

function generateChangelog() {
  console.log('📝 Generating changelog page...');

  const sections = changelogEntries.map(entry => `
      <section class="mb-10">
        <div class="flex items-baseline gap-3 mb-3">
          <time datetime="${entry.date}" class="text-sm font-mono text-gray-500">${entry.date}</time>
          <h2 class="text-xl font-semibold text-gray-900">${entry.title}</h2>
        </div>
        <ul class="list-disc pl-6 space-y-2 text-gray-600">
          ${entry.items.map(i => `<li>${i}</li>`).join('\n          ')}
        </ul>
      </section>`).join('\n');

  const html = `<!DOCTYPE html>
<html lang="en">
  <head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Changelog - Logo.surf</title>
    <meta name="description" content="Product updates and improvements for Logo.surf, the free text-to-logo and favicon generator.">
    <link rel="canonical" href="${config.baseUrl}/changelog/">
    <link rel="icon" type="image/png" sizes="2048x2048" href="/favicon-2048x2048.png">
    <script src="https://cdn.tailwindcss.com"></script>
  </head>
  <body class="bg-gray-50 text-gray-900">
    <header class="bg-white shadow-sm border-b border-gray-200">
      <div class="max-w-3xl mx-auto px-4 py-4 flex items-center justify-between">
        <a href="/" class="text-xl font-bold text-gray-900">Logo.surf</a>
        <a href="/" class="text-sm text-gray-600 hover:text-gray-900">Back to app</a>
      </div>
    </header>
    <main class="max-w-3xl mx-auto px-4 py-12">
      <h1 class="text-3xl font-bold mb-8 text-gray-900">Changelog</h1>
${sections}
    </main>
  </body>
</html>`;

  const dir = path.join(config.outputDir, 'changelog');
  fs.mkdirpSync(dir);
  fs.writeFileSync(path.join(dir, 'index.html'), html);
}

async function buildSite() {
  console.log('🚀 Starting multi-language website build...\n');

  // Clean and create output directory
  if (fs.existsSync(config.outputDir)) {
    fs.removeSync(config.outputDir);
  }
  fs.mkdirpSync(config.outputDir);

  // Load template and translations
  console.log('📖 Loading template and translations...');
  const templateContent = fs.readFileSync(config.templateFile, 'utf8');
  const template = Handlebars.compile(templateContent);
  const translations = loadTranslations();

  console.log(`✅ Loaded ${Object.keys(translations).length} translation files\n`);

  // Generate pages for each language
  console.log('🌍 Generating language-specific pages...');
  
  for (const [lang, langInfo] of Object.entries(config.supportedLanguages)) {
    if (!translations[lang]) {
      console.warn(`⚠️  No translation found for ${lang}, skipping...`);
      continue;
    }

    console.log(`  📄 Building ${lang} (${langInfo.name})...`);

    const context = {
      lang: lang,
      htmlLang: toBcp47(lang),
      isRtl: langInfo.dir === 'rtl',
      languageName: langInfo.name,
      t: translations[lang],
      canonicalUrl: getLanguageUrl(lang),
      alternateUrls: generateAlternateUrls(),
      languageOptions: generateLanguageOptions(lang),
      jsonLd: buildJsonLd(lang, translations[lang])
    };

    const html = template(context);
    const outputPath = path.join(config.outputDir, getFilePath(lang));
    
    ensureDirectoryExists(outputPath);
    fs.writeFileSync(outputPath, html);
  }

  // Copy static assets
  await copyStaticAssets();

  // Generate SEO files
  generateSitemap();
  generateRobotsTxt();
  generate404();
  generateChangelog();

  // Create redirects for common language patterns
  console.log('🔗 Generating redirect rules...');
  
  const htaccess = `# Language redirects based on Accept-Language header
RewriteEngine On

# Redirect based on browser language (only if no specific path is requested)
RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^zh-CN [NC]
RewriteRule ^$ /zh-CN/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^zh-TW [NC]
RewriteRule ^$ /zh-TW/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^zh [NC]
RewriteRule ^$ /zh-CN/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^es [NC]
RewriteRule ^$ /es/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^fr [NC]
RewriteRule ^$ /fr/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^de [NC]
RewriteRule ^$ /de/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^ja [NC]
RewriteRule ^$ /ja/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^ko [NC]
RewriteRule ^$ /ko/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^pt [NC]
RewriteRule ^$ /pt/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^ru [NC]
RewriteRule ^$ /ru/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^ar [NC]
RewriteRule ^$ /ar/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^it [NC]
RewriteRule ^$ /it/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^nl [NC]
RewriteRule ^$ /nl/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^pl [NC]
RewriteRule ^$ /pl/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^tr [NC]
RewriteRule ^$ /tr/ [R=302,L]

RewriteCond %{REQUEST_URI} ^/$
RewriteCond %{HTTP:Accept-Language} ^hi [NC]
RewriteRule ^$ /hi/ [R=302,L]

# Cache static assets
<FilesMatch "\\.(css|js|png|jpg|jpeg|gif|ico|svg|woff|woff2|ttf|eot)$">
    ExpiresActive On
    ExpiresDefault "access plus 1 year"
    Header append Cache-Control "public, immutable"
</FilesMatch>

# Cache HTML files for a shorter period
<FilesMatch "\\.html$">
    ExpiresActive On
    ExpiresDefault "access plus 1 week"
    Header append Cache-Control "public"
</FilesMatch>`;

  fs.writeFileSync(path.join(config.outputDir, '.htaccess'), htaccess);

  // Generate JSON-LD structured data
  console.log('📊 Generating structured data...');
  
  const structuredData = {
    "@context": "https://schema.org",
    "@type": "WebApplication",
    "name": "Logo.surf",
    "description": "Free text-to-logo and favicon generator",
    "url": config.baseUrl,
    "applicationCategory": "DesignApplication",
    "operatingSystem": "Web Browser",
    "offers": {
      "@type": "Offer",
      "price": "0",
      "priceCurrency": "USD"
    },
    "creator": {
      "@type": "Organization",
      "name": "Logo.surf",
      "url": config.baseUrl
    },
    "featureList": [
      "Text to Logo Generation",
      "Text to Favicon Generation", 
      "Multiple Format Support (PNG, SVG, ICO)",
      "Customizable Colors and Fonts",
      "Instant Preview",
      "Free Download"
    ],
    "inLanguage": Object.keys(config.supportedLanguages)
  };

  fs.writeFileSync(
    path.join(config.outputDir, 'structured-data.json'), 
    JSON.stringify(structuredData, null, 2)
  );

  // Build summary
  console.log('\n✨ Build completed successfully!');
  console.log('📊 Build Summary:');
  console.log(`   • Generated ${Object.keys(config.supportedLanguages).length} language versions`);
  console.log(`   • Languages: ${Object.values(config.supportedLanguages).map(l => l.name).join(', ')}`);
  console.log(`   • Output directory: ${config.outputDir}/`);
  console.log('   • SEO files: sitemap.xml, robots.txt, .htaccess');
  console.log('   • Structured data: structured-data.json');
  console.log('\n🌍 Language URLs:');
  
  for (const [lang, langInfo] of Object.entries(config.supportedLanguages)) {
    const url = getLanguageUrl(lang);
    const localPath = getFilePath(lang);
    console.log(`   • ${langInfo.name.padEnd(15)} ${url.padEnd(35)} → ${localPath}`);
  }
  
  console.log('\n🚀 To test locally, run:');
  console.log('   pnpm start');
  console.log('   # or');
  console.log('   python3 -m http.server 8000 --directory dist');
  console.log(`   # then visit http://localhost:8000\n`);
}

// Register Handlebars helpers
Handlebars.registerHelper('eq', function(a, b, options) {
  return a === b ? options.fn(this) : options.inverse(this);
});

Handlebars.registerHelper('json', function(context) {
  return JSON.stringify(context);
});

// Run the build
if (require.main === module) {
  buildSite().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });
}

module.exports = { buildSite, config };