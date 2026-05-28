import fs from 'node:fs';
import path from 'node:path';
import process from 'node:process';
import matter from 'gray-matter';
import MarkdownIt from 'markdown-it';

const rootDir = process.cwd();

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true,
});

export const config = {
  baseUrl: 'https://www.logo.surf',
  supportedLanguages: {
    en: { name: 'English', dir: 'ltr' },
    'zh-hans': { name: '简体中文', dir: 'ltr' },
    'zh-hant': { name: '繁體中文', dir: 'ltr' },
    es: { name: 'Español', dir: 'ltr' },
    fr: { name: 'Français', dir: 'ltr' },
    de: { name: 'Deutsch', dir: 'ltr' },
    ja: { name: '日本語', dir: 'ltr' },
    ko: { name: '한국어', dir: 'ltr' },
    pt: { name: 'Português', dir: 'ltr' },
    ru: { name: 'Русский', dir: 'ltr' },
    ar: { name: 'العربية', dir: 'rtl' },
    it: { name: 'Italiano', dir: 'ltr' },
    nl: { name: 'Nederlands', dir: 'ltr' },
    pl: { name: 'Polski', dir: 'ltr' },
    tr: { name: 'Türkçe', dir: 'ltr' },
    hi: { name: 'हिंदी', dir: 'ltr' },
  },
  translationsDir: 'translations',
};

export function substring(str, start, length) {
  if (!str) return '';
  return str.substring(start, length);
}

export function formatDate(dateString) {
  if (!dateString) return '';
  const date = new Date(dateString);
  return date.toLocaleDateString('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });
}

function projectPath(...segments) {
  return path.join(rootDir, ...segments);
}

function readText(relativePath) {
  return fs.readFileSync(projectPath(relativePath), 'utf8');
}

function readJson(relativePath) {
  return JSON.parse(readText(relativePath));
}

function fileExists(relativePath) {
  return fs.existsSync(projectPath(relativePath));
}

function createBlankShape(value) {
  if (Array.isArray(value)) return [];
  if (value && typeof value === 'object') {
    return Object.fromEntries(Object.entries(value).map(([key, child]) => [key, createBlankShape(child)]));
  }
  return '';
}

function mergeMissingText(shape, value) {
  if (Array.isArray(value)) return value;
  if (shape && typeof shape === 'object' && !Array.isArray(shape)) {
    const source = value && typeof value === 'object' && !Array.isArray(value) ? value : {};
    return Object.fromEntries(
      Object.entries(shape).map(([key, childShape]) => [key, mergeMissingText(childShape, source[key])])
    );
  }
  return value ?? shape;
}

function urlLanguageCode(lang) {
  const mapping = {
    'zh-hans': 'zh-CN',
    'zh-hant': 'zh-TW',
  };
  return mapping[lang] || lang;
}

function localizedPath(lang, tail = '') {
  const basePath = lang === 'en' ? '/' : `/${urlLanguageCode(lang)}/`;
  return `${basePath}${tail}`;
}

export function routeParamFromPathname(pathname) {
  return pathname.replace(/^\/|\/$/g, '');
}

export function getLanguageUrl(lang) {
  if (lang === 'en') {
    return `${config.baseUrl}/`;
  }
  return `${config.baseUrl}/${urlLanguageCode(lang)}/`;
}

function generateAlternateUrls() {
  const alternateUrls = {};
  for (const lang of Object.keys(config.supportedLanguages)) {
    alternateUrls[lang] = getLanguageUrl(lang);
  }
  return alternateUrls;
}

function generateLanguageOptions(currentLang) {
  return Object.entries(config.supportedLanguages).map(([code, info]) => ({
    code,
    name: info.name,
    url: code === 'en' ? '/' : `/${urlLanguageCode(code)}/`,
    current: code === currentLang,
  }));
}

function loadTranslations() {
  const translations = {};
  for (const lang of Object.keys(config.supportedLanguages)) {
    const fileName = lang === 'zh-hans' || lang === 'zh-hant' ? lang : lang;
    const filePath = path.join(config.translationsDir, `${fileName}.json`);
    if (!fileExists(filePath)) continue;
    const content = readText(filePath);
    if (content.trim()) {
      translations[lang] = JSON.parse(content);
    }
  }

  const blankShape = createBlankShape(translations.en || {});
  return Object.fromEntries(
    Object.entries(translations).map(([lang, translation]) => [lang, mergeMissingText(blankShape, translation)])
  );
}

function loadGradientFaviconTranslations(languages) {
  const translations = {};
  for (const lang of Object.keys(languages)) {
    const fileName = lang === 'zh-hans' || lang === 'zh-hant' ? lang : lang;
    const filePath = path.join('translations/gradient-favicon', `${fileName}.json`);
    if (fileExists(filePath)) {
      translations[lang] = readJson(filePath);
    }
  }
  return translations;
}

function generateSlug(filename) {
  return path
    .basename(filename, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

function generateExcerpt(content, maxLength = 150) {
  const plainText = content
    .replace(/#{1,6}\s+/g, '')
    .replace(/\*\*(.*?)\*\*/g, '$1')
    .replace(/\*(.*?)\*/g, '$1')
    .replace(/\[(.*?)\]\(.*?\)/g, '$1')
    .replace(/<[^>]*>/g, '')
    .replace(/\n+/g, ' ')
    .trim();

  if (plainText.length <= maxLength) {
    return plainText;
  }

  return `${plainText.substring(0, maxLength).replace(/\s+\w+$/, '')}...`;
}

function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

export function buildBlogPosts() {
  const contentDir = projectPath('content/blog');
  if (!fs.existsSync(contentDir)) {
    return { posts: [], count: 0 };
  }

  const files = fs.readdirSync(contentDir).filter((file) => file.endsWith('.md'));
  const posts = [];

  for (const file of files) {
    const filePath = path.join(contentDir, file);
    const fileContent = fs.readFileSync(filePath, 'utf-8');
    const { data: frontmatter, content } = matter(fileContent);
    const htmlContent = md.render(content);
    const slug = frontmatter.slug || generateSlug(file);
    const excerpt = frontmatter.description || generateExcerpt(content);
    const readTime = frontmatter.readTime || estimateReadingTime(content);

    posts.push({
      title: frontmatter.title || 'Untitled',
      description: excerpt,
      date: frontmatter.date || new Date().toISOString().split('T')[0],
      lastUpdated: frontmatter.lastUpdated || null,
      author: frontmatter.author || 'Logo.surf Team',
      authorBio: frontmatter.authorBio || null,
      tags: frontmatter.tags || [],
      keywords: frontmatter.keywords || '',
      image: frontmatter.image || '/images/blog/default.jpg',
      slug,
      readTime,
      featured: frontmatter.featured || false,
      published: frontmatter.published !== false,
      content: htmlContent,
      excerpt,
      filename: file,
      faq: frontmatter.faq || null,
    });
  }

  posts.sort((a, b) => new Date(b.date) - new Date(a.date));

  const publishedPosts = posts.filter((post) => post.published);
  return {
    posts: publishedPosts,
    count: publishedPosts.length,
    lastUpdated: new Date().toISOString(),
  };
}

export function getHomeContext(lang, translations = loadTranslations()) {
  const langInfo = config.supportedLanguages[lang];
  return {
    lang,
    isRtl: langInfo.dir === 'rtl',
    languageName: langInfo.name,
    t: translations[lang],
    canonicalUrl: getLanguageUrl(lang),
    alternateUrls: generateAlternateUrls(),
    languageOptions: generateLanguageOptions(lang),
  };
}

function getHomePages(translations) {
  return Object.entries(config.supportedLanguages)
    .filter(([lang]) => translations[lang])
    .map(([lang]) => ({
      pathname: localizedPath(lang),
      kind: 'home',
      props: getHomeContext(lang, translations),
    }));
}

function getBlogIndexContext(lang, translations, blogData) {
  const langInfo = config.supportedLanguages[lang];
  const posts = blogData.posts || [];
  return {
    lang,
    isRtl: langInfo.dir === 'rtl',
    currentLanguageName: langInfo.name,
    t: translations[lang],
    posts,
    canonicalUrl: getLanguageUrl(lang).replace(/\/$/, ''),
    alternateUrls: generateAlternateUrls(),
    languages: Object.entries(config.supportedLanguages).map(([code, info]) => ({
      code,
      name: info.name,
    })),
  };
}

function getBlogPages(translations, blogData) {
  const pages = [];

  for (const [lang] of Object.entries(config.supportedLanguages)) {
    if (!translations[lang]) continue;

    const blogIndexContext = getBlogIndexContext(lang, translations, blogData);

    pages.push({
      pathname: localizedPath(lang, 'blog/'),
      kind: 'blog-index',
      props: blogIndexContext,
    });

    for (const post of blogIndexContext.posts) {
      pages.push({
        pathname: localizedPath(lang, `blog/${post.slug}/`),
        kind: 'blog-post',
        props: {
          ...blogIndexContext,
          post,
        },
      });
    }
  }

  return pages;
}

function getGradientFaviconLanguageOptions(languages, currentLang) {
  return Object.entries(languages).map(([code, info]) => ({
    code,
    name: info.name,
    url: code === 'en' ? '/' : `/${urlLanguageCode(code)}/`,
    current: code === currentLang,
  }));
}

function getGradientFaviconContext(lang, languages, translations) {
  const langInfo = languages[lang];
  return {
    lang: lang === 'zh-hans' ? 'zh-CN' : lang === 'zh-hant' ? 'zh-TW' : lang,
    currentLanguageName: langInfo.name,
    gf: translations[lang],
    canonicalUrl: getLanguageUrl(lang),
    alternateUrls: Object.fromEntries(
      Object.keys(languages).map((language) => [urlLanguageCode(language), getLanguageUrl(language)])
    ),
    languageOptions: getGradientFaviconLanguageOptions(languages, lang),
  };
}

function getGradientFaviconPages() {
  const gfLanguages = {
    en: config.supportedLanguages.en,
    'zh-hans': config.supportedLanguages['zh-hans'],
    'zh-hant': config.supportedLanguages['zh-hant'],
  };
  const gfTranslations = loadGradientFaviconTranslations(gfLanguages);

  return Object.entries(gfLanguages)
    .filter(([lang]) => gfTranslations[lang])
    .map(([lang]) => ({
      pathname: localizedPath(lang, 'gradient-favicon/'),
      kind: 'gradient-favicon',
      props: getGradientFaviconContext(lang, gfLanguages, gfTranslations),
    }));
}

export function getPageEntries() {
  const translations = loadTranslations();
  const blogData = buildBlogPosts();
  return [...getHomePages(translations), ...getBlogPages(translations, blogData), ...getGradientFaviconPages()];
}

export function getSitemapXml() {
  const blogData = buildBlogPosts();
  const urls = [];
  const today = new Date().toISOString().split('T')[0];

  const gfLangs = ['en', 'zh-hans', 'zh-hant'];
  const gfAlternates = gfLangs.map((lang) => ({
    lang: urlLanguageCode(lang),
    url: `${getLanguageUrl(lang)}gradient-favicon/`,
  }));

  for (const lang of gfLangs) {
    urls.push({
      loc: `${getLanguageUrl(lang)}gradient-favicon/`,
      lastmod: today,
      changefreq: 'monthly',
      priority: '0.7',
      alternates: gfAlternates,
    });
  }

  for (const lang of Object.keys(config.supportedLanguages)) {
    const langUrl = getLanguageUrl(lang);
    const alternates = Object.keys(config.supportedLanguages).map((altLang) => ({
      lang: urlLanguageCode(altLang),
      url: getLanguageUrl(altLang),
    }));

    urls.push({
      loc: langUrl,
      lastmod: today,
      changefreq: 'weekly',
      priority: lang === 'en' ? '1.0' : '0.8',
      alternates,
    });

    urls.push({
      loc: `${langUrl}blog/`,
      lastmod: today,
      changefreq: 'weekly',
      priority: '0.7',
      alternates: alternates.map((alternate) => ({
        ...alternate,
        url: `${alternate.url}blog/`,
      })),
    });

    if (blogData.posts) {
      for (const post of blogData.posts) {
        urls.push({
          loc: `${langUrl}blog/${post.slug}/`,
          lastmod: post.date || new Date().toISOString().split('T')[0],
          changefreq: 'monthly',
          priority: '0.6',
          alternates: alternates.map((alternate) => ({
            ...alternate,
            url: `${alternate.url}blog/${post.slug}/`,
          })),
        });
      }
    }
  }

  return `<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" 
        xmlns:xhtml="http://www.w3.org/1999/xhtml">
${urls
  .map(
    (url) => `  <url>
    <loc>${url.loc}</loc>
    <lastmod>${url.lastmod}</lastmod>
    <changefreq>${url.changefreq}</changefreq>
    <priority>${url.priority}</priority>
${url.alternates
  .map((alternate) => `    <xhtml:link rel="alternate" hreflang="${alternate.lang}" href="${alternate.url}"/>`)
  .join('\n')}
  </url>`
  )
  .join('\n')}
</urlset>`;
}

export function getRobotsTxt() {
  return `User-agent: *
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
}

export function getStructuredDataJson() {
  return JSON.stringify(
    {
      '@context': 'https://schema.org',
      '@type': 'WebApplication',
      name: 'Logo.surf',
      description: 'Free text-to-logo and favicon generator',
      url: config.baseUrl,
      applicationCategory: 'DesignApplication',
      operatingSystem: 'Web Browser',
      offers: {
        '@type': 'Offer',
        price: '0',
        priceCurrency: 'USD',
      },
      creator: {
        '@type': 'Organization',
        name: 'Logo.surf',
        url: config.baseUrl,
      },
      featureList: [
        'Text to Logo Generation',
        'Text to Favicon Generation',
        'Multiple Format Support (PNG, SVG, ICO)',
        'Customizable Colors and Fonts',
        'Instant Preview',
        'Free Download',
      ],
      inLanguage: Object.keys(config.supportedLanguages),
    },
    null,
    2
  );
}
