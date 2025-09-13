const fs = require('fs-extra');
const path = require('path');
const Handlebars = require('handlebars');
const { buildBlogPosts } = require('./scripts/build-blog');

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
  // Use proper language codes for URLs
  const urlMapping = {
    'zh-hans': 'zh-CN',
    'zh-hant': 'zh-TW'
  };
  const urlLang = urlMapping[lang] || lang;
  return config.baseUrl + '/' + urlLang + '/';
}

function getFilePath(lang) {
  if (lang === 'en') {
    return 'index.html';
  }
  // Use proper language codes for file paths
  const pathMapping = {
    'zh-hans': 'zh-CN',
    'zh-hant': 'zh-TW'
  };
  const pathLang = pathMapping[lang] || lang;
  return path.join(pathLang, 'index.html');
}

function generateAlternateUrls() {
  const alternateUrls = {};
  for (const lang of Object.keys(config.supportedLanguages)) {
    alternateUrls[lang] = getLanguageUrl(lang);
  }
  return alternateUrls;
}

function generateLanguageOptions(currentLang) {
  return Object.entries(config.supportedLanguages).map(([code, info]) => {
    const urlMapping = {
      'zh-hans': 'zh-CN',
      'zh-hant': 'zh-TW'
    };
    const urlCode = urlMapping[code] || code;
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

async function generateBlogPages() {
  console.log('📝 Generating blog pages...');
  
  // Load blog data
  const blogDataPath = path.join('data/blog/posts.json');
  if (!fs.existsSync(blogDataPath)) {
    console.log('⚠️  No blog data found, skipping blog pages...');
    return { posts: [], count: 0 };
  }
  
  const blogData = JSON.parse(fs.readFileSync(blogDataPath, 'utf8'));
  const posts = blogData.posts || [];
  
  if (posts.length === 0) {
    console.log('⚠️  No published posts found, skipping blog pages...');
    return blogData;
  }
  
  // Load templates
  const blogIndexTemplate = Handlebars.compile(
    fs.readFileSync('templates/blog/blog-index.hbs', 'utf8')
  );
  const blogPostTemplate = Handlebars.compile(
    fs.readFileSync('templates/blog/blog-post.hbs', 'utf8')
  );
  
  const translations = loadTranslations();
  
  // Generate pages for each language
  for (const [lang, langInfo] of Object.entries(config.supportedLanguages)) {
    if (!translations[lang]) continue;
    
    console.log(`  📄 Building blog pages for ${lang}...`);
    
    // Base URL for this language
    const baseUrl = lang === 'en' ? '' : `/${lang === 'zh-hans' ? 'zh-CN' : lang === 'zh-hant' ? 'zh-TW' : lang}`;
    
    // Blog index page context
    const blogIndexContext = {
      lang: lang,
      isRtl: langInfo.dir === 'rtl',
      currentLanguageName: langInfo.name,
      t: translations[lang],
      posts: posts,
      canonicalUrl: getLanguageUrl(lang).replace(/\/$/, ''),
      alternateUrls: generateAlternateUrls(),
      languages: Object.entries(config.supportedLanguages).map(([code, info]) => ({
        code,
        name: info.name
      }))
    };
    
    // Generate blog index page
    const blogIndexHtml = blogIndexTemplate(blogIndexContext);
    const blogIndexPath = path.join(config.outputDir, baseUrl, 'blog', 'index.html');
    ensureDirectoryExists(blogIndexPath);
    fs.writeFileSync(blogIndexPath, blogIndexHtml);
    
    // Generate individual post pages
    for (const post of posts) {
      const postContext = {
        ...blogIndexContext,
        post: post
      };
      
      const postHtml = blogPostTemplate(postContext);
      const postPath = path.join(config.outputDir, baseUrl, 'blog', post.slug, 'index.html');
      ensureDirectoryExists(postPath);
      fs.writeFileSync(postPath, postHtml);
    }
  }
  
  console.log(`✅ Generated blog pages for ${posts.length} posts`);
  return blogData;
}

function generateSitemap(blogData = null) {
  console.log('🗺️  Generating sitemap.xml...');
  
  const urls = [];
  
  for (const lang of Object.keys(config.supportedLanguages)) {
    const langUrl = getLanguageUrl(lang);
    const baseUrl = lang === 'en' ? '' : `/${lang === 'zh-hans' ? 'zh-CN' : lang === 'zh-hant' ? 'zh-TW' : lang}`;
    
    const alternates = Object.entries(config.supportedLanguages).map(([altLang]) => {
      // Use proper hreflang codes
      const hreflangMapping = {
        'zh-hans': 'zh-CN',
        'zh-hant': 'zh-TW'
      };
      const hreflangCode = hreflangMapping[altLang] || altLang;
      return {
        lang: hreflangCode,
        url: getLanguageUrl(altLang)
      };
    });
    
    // Main page
    urls.push({
      loc: langUrl,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: lang === 'en' ? '1.0' : '0.8',
      alternates: alternates
    });
    
    // Blog index page
    urls.push({
      loc: `${langUrl}blog/`,
      lastmod: new Date().toISOString().split('T')[0],
      changefreq: 'weekly',
      priority: '0.7',
      alternates: alternates.map(alt => ({
        ...alt,
        url: `${alt.url}blog/`
      }))
    });
    
    // Individual blog posts
    if (blogData && blogData.posts) {
      for (const post of blogData.posts) {
        urls.push({
          loc: `${langUrl}blog/${post.slug}/`,
          lastmod: post.date || new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6',
          alternates: alternates.map(alt => ({
            ...alt,
            url: `${alt.url}blog/${post.slug}/`
          }))
        });
      }
    }
  }

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

async function buildSite() {
  console.log('🚀 Starting multi-language website build...\n');

  // Clean and create output directory
  if (fs.existsSync(config.outputDir)) {
    fs.removeSync(config.outputDir);
  }
  fs.mkdirpSync(config.outputDir);

  // Build blog posts first
  console.log('📝 Building blog posts...');
  const blogData = await buildBlogPosts();

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
      isRtl: langInfo.dir === 'rtl',
      languageName: langInfo.name,
      t: translations[lang],
      canonicalUrl: getLanguageUrl(lang),
      alternateUrls: generateAlternateUrls(),
      languageOptions: generateLanguageOptions(lang)
    };

    const html = template(context);
    const outputPath = path.join(config.outputDir, getFilePath(lang));
    
    ensureDirectoryExists(outputPath);
    fs.writeFileSync(outputPath, html);
  }

  // Generate blog pages
  await generateBlogPages();

  // Copy static assets
  await copyStaticAssets();

  // Generate SEO files
  generateSitemap(blogData);
  generateRobotsTxt();

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

Handlebars.registerHelper('formatDate', function(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', { 
    year: 'numeric', 
    month: 'long', 
    day: 'numeric' 
  });
});

// Run the build
if (require.main === module) {
  buildSite().catch(error => {
    console.error('❌ Build failed:', error);
    process.exit(1);
  });
}

module.exports = { buildSite, config };