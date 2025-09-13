const fs = require('fs-extra');
const path = require('path');
const matter = require('gray-matter');
const MarkdownIt = require('markdown-it');

const md = new MarkdownIt({
  html: true,
  linkify: true,
  typographer: true
});

// Configuration
const config = {
  contentDir: 'content/blog',
  outputDir: 'data/blog',
  templatesDir: 'templates/blog'
};

// Ensure output directory exists
fs.ensureDirSync(config.outputDir);

// Function to generate slug from filename
function generateSlug(filename) {
  return path.basename(filename, '.md')
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, '-')
    .replace(/^-+|-+$/g, '');
}

// Function to generate excerpt
function generateExcerpt(content, maxLength = 150) {
  // Remove markdown and HTML
  const plainText = content
    .replace(/#{1,6}\s+/g, '') // Remove headers
    .replace(/\*\*(.*?)\*\*/g, '$1') // Remove bold
    .replace(/\*(.*?)\*/g, '$1') // Remove italic
    .replace(/\[(.*?)\]\(.*?\)/g, '$1') // Remove links
    .replace(/<[^>]*>/g, '') // Remove HTML tags
    .replace(/\n+/g, ' ') // Replace newlines with spaces
    .trim();
    
  if (plainText.length <= maxLength) {
    return plainText;
  }
  
  return plainText.substring(0, maxLength).replace(/\s+\w+$/, '') + '...';
}

// Function to estimate reading time
function estimateReadingTime(content) {
  const wordsPerMinute = 200;
  const words = content.split(/\s+/).length;
  const minutes = Math.ceil(words / wordsPerMinute);
  return `${minutes} min read`;
}

// Function to process markdown content (convert # to ##)
function processMarkdownContent(content) {
  return content
    .split('\n')
    .map(line => {
      // Convert # to ##, ## to ###, etc.
      if (line.match(/^#+\s/)) {
        return '#' + line;
      }
      return line;
    })
    .join('\n');
}

async function buildBlogPosts() {
  try {
    console.log('Building blog posts...');
    
    // Ensure content directory exists
    if (!fs.existsSync(config.contentDir)) {
      console.log(`Creating content directory: ${config.contentDir}`);
      fs.ensureDirSync(config.contentDir);
      return { posts: [], count: 0 };
    }
    
    const files = fs.readdirSync(config.contentDir)
      .filter(file => file.endsWith('.md'));
    
    if (files.length === 0) {
      console.log('No markdown files found in content/blog directory.');
      return { posts: [], count: 0 };
    }
    
    const posts = [];
    
    for (const file of files) {
      const filePath = path.join(config.contentDir, file);
      const fileContent = fs.readFileSync(filePath, 'utf-8');
      const { data: frontmatter, content } = matter(fileContent);
      
      // Process content (convert # to ##)
      const processedContent = processMarkdownContent(content);
      const htmlContent = md.render(processedContent);
      
      // Generate slug if not provided
      const slug = frontmatter.slug || generateSlug(file);
      
      // Generate excerpt if not provided
      const excerpt = frontmatter.description || generateExcerpt(content);
      
      // Estimate reading time if not provided
      const readTime = frontmatter.readTime || estimateReadingTime(content);
      
      const post = {
        title: frontmatter.title || 'Untitled',
        description: excerpt,
        date: frontmatter.date || new Date().toISOString().split('T')[0],
        author: frontmatter.author || 'Logo.surf Team',
        tags: frontmatter.tags || [],
        keywords: frontmatter.keywords || '',
        image: frontmatter.image || '/images/blog/default.jpg',
        slug: slug,
        readTime: readTime,
        featured: frontmatter.featured || false,
        published: frontmatter.published !== false, // Default to published
        content: htmlContent,
        excerpt: excerpt,
        filename: file
      };
      
      posts.push(post);
    }
    
    // Sort posts by date (newest first)
    posts.sort((a, b) => new Date(b.date) - new Date(a.date));
    
    // Filter published posts
    const publishedPosts = posts.filter(post => post.published);
    
    // Generate posts data
    const postsData = {
      posts: publishedPosts,
      count: publishedPosts.length,
      lastUpdated: new Date().toISOString()
    };
    
    // Write posts data to JSON file
    fs.writeFileSync(
      path.join(config.outputDir, 'posts.json'),
      JSON.stringify(postsData, null, 2)
    );
    
    // Write individual post files
    for (const post of publishedPosts) {
      fs.writeFileSync(
        path.join(config.outputDir, `${post.slug}.json`),
        JSON.stringify(post, null, 2)
      );
    }
    
    console.log(`✅ Built ${publishedPosts.length} blog posts`);
    console.log(`📄 Posts written to ${config.outputDir}/`);
    
    return postsData;
    
  } catch (error) {
    console.error('❌ Error building blog posts:', error);
    throw error;
  }
}

// Run if called directly
if (require.main === module) {
  buildBlogPosts()
    .then(() => {
      console.log('✅ Blog build completed successfully');
    })
    .catch(error => {
      console.error('❌ Blog build failed:', error);
      process.exit(1);
    });
}

module.exports = { buildBlogPosts };