#!/usr/bin/env -S deno run --allow-net
/**
 * TechXplore Ingestor (TypeScript/Deno)
 * Fetches the latest tech news article from TechXplore RSS feed
 * Attribution: Content from TechXplore.com
 */

interface RSSItem {
  title: string;
  description: string;
  link: string;
  pubDate: string;
  guid: string;
}

interface StoryData {
  title: string;
  text: string;
  comments: string;
}

/**
 * Parse XML RSS feed and extract items
 */
function parseRSS(xmlText: string): RSSItem[] {
  const items: RSSItem[] = [];

  // Extract all <item> blocks
  const itemRegex = /<item>([\s\S]*?)<\/item>/g;
  const matches = xmlText.matchAll(itemRegex);

  for (const match of matches) {
    const itemXml = match[1];

    // Extract fields from each item
    const title = extractTag(itemXml, 'title');
    const description = extractTag(itemXml, 'description');
    const link = extractTag(itemXml, 'link');
    const pubDate = extractTag(itemXml, 'pubDate');
    const guid = extractTag(itemXml, 'guid');

    if (title && description && link) {
      items.push({ title, description, link, pubDate, guid });
    }
  }

  return items;
}

/**
 * Extract content from XML tag
 */
function extractTag(xml: string, tagName: string): string {
  const regex = new RegExp(`<${tagName}(?:[^>]*)>([\\s\\S]*?)<\/${tagName}>`, 'i');
  const match = xml.match(regex);

  if (match && match[1]) {
    return cleanText(match[1].trim());
  }

  return '';
}

/**
 * Remove HTML tags and decode HTML entities
 */
function cleanText(text: string): string {
  if (!text) return '';

  // Remove CDATA wrapper if present
  text = text.replace(/<!\[CDATA\[([\s\S]*?)\]\]>/g, '$1');

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode numeric HTML entities (decimal like &#039; and hex like &#x27;)
  text = text.replace(/&#(\d+);/g, (_match, dec) => {
    return String.fromCharCode(parseInt(dec, 10));
  });
  text = text.replace(/&#x([0-9a-fA-F]+);/g, (_match, hex) => {
    return String.fromCharCode(parseInt(hex, 16));
  });

  // Decode common named HTML entities
  const entities: { [key: string]: string } = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&apos;': "'",
    '&nbsp;': ' ',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
    '&mdash;': '—',
    '&ndash;': '–',
  };

  text = text.replace(/&[^;]+;/g, (match) => entities[match] || match);

  return text.trim();
}

/**
 * Fetch all articles from TechXplore RSS feed
 */
async function getAllArticles(): Promise<RSSItem[]> {
  console.log('Fetching articles from TechXplore RSS feed...');

  const rssUrl = 'https://techxplore.com/rss-feed/';

  try {
    const response = await fetch(rssUrl);
    const xmlText = await response.text();

    // Parse RSS feed
    const items = parseRSS(xmlText);

    if (items.length === 0) {
      console.log('No articles found in RSS feed');
      return [];
    }

    console.log(`Found ${items.length} articles\n`);
    return items;
  } catch (error) {
    console.error('Error fetching TechXplore RSS feed:', error);
    return [];
  }
}

/**
 * Fetch the latest article from TechXplore RSS feed
 */
async function getLatestArticle(): Promise<StoryData | null> {
  const items = await getAllArticles();

  if (items.length === 0) {
    return null;
  }

  // Get the first (latest) article
  const article = items[0];
  console.log(`Using top article: ${article.title}\n`);

  const result: StoryData = {
    title: article.title,
    text: `${article.description}\n\nSource: ${article.link}\nPublished: ${article.pubDate}\n\n[Attribution: Content from TechXplore.com]`,
    comments: '(TechXplore RSS feed does not include comments)',
  };

  return result;
}

/**
 * Main function - gets and displays all articles from TechXplore
 */
async function main() {
  // First, get all available articles
  const allArticles = await getAllArticles();

  if (allArticles.length === 0) {
    console.log('Failed to fetch articles');
    return null;
  }

  // Print all available items
  console.log('='.repeat(80));
  console.log(`ALL AVAILABLE ARTICLES (${allArticles.length} items):`);
  console.log('='.repeat(80));

  allArticles.forEach((item, index) => {
    console.log(`\n[${index + 1}] ${item.title}`);
    console.log(`    Published: ${item.pubDate}`);
    console.log(`    Link: ${item.link}`);
    console.log(`    Description: ${item.description.substring(0, 100)}...`);
  });

  console.log('\n' + '='.repeat(80));
  console.log('TOP STORY DETAILS:');
  console.log('='.repeat(80) + '\n');

  // Get the top story
  const storyData = await getLatestArticle();

  if (storyData) {
    // Show story data attributes
    for (const [key, value] of Object.entries(storyData)) {
      console.log(`${key}: ${typeof value}`);
    }

    console.log('\n' + '='.repeat(80));
    console.log('TITLE:');
    console.log(storyData.title);
    console.log('\n' + '='.repeat(80));

    console.log('TEXT:');
    console.log(storyData.text || '(No text content)');
    console.log('\n' + '='.repeat(80));

    console.log('COMMENTS:');
    console.log(storyData.comments || '(No comments yet)');
    console.log('\n' + '='.repeat(80));

    // Print summary
    console.log(`\nText length: ${storyData.text.length} characters`);

    return storyData;
  } else {
    console.log('Failed to fetch story data');
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
