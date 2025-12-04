#!/usr/bin/env -S deno run --allow-net --allow-env
/**
 * NewsData.io Ingestor (TypeScript/Deno)
 * Fetches the latest tech news from NewsData.io API
 * Requires: NEWSDATA_API_KEY environment variable
 */

// To run this script, use:
//deno run --allow-net --allow-env --env newsdata_ingestor.ts


interface NewsDataArticle {
  article_id: string;
  title: string;
  link: string;
  keywords?: string[];
  creator?: string[];
  video_url?: string | null;
  description?: string;
  content?: string;
  pubDate: string;
  image_url?: string | null;
  source_id: string;
  source_priority: number;
  country?: string[];
  category?: string[];
  language: string;
}

interface NewsDataResponse {
  status: string;
  totalResults: number;
  results: NewsDataArticle[];
  nextPage?: string;
}

interface StoryData {
  title: string;
  text: string;
  comments: string;
}

/**
 * Get API key from environment variable
 */
function getApiKey(): string | null {
  const apiKey = Deno.env.get('NEWSDATA_API_KEY');

  if (!apiKey) {
    console.error('ERROR: NEWSDATA_API_KEY environment variable not set');
    console.error('Get your free API key at: https://newsdata.io/register');
    console.error('Then set it: export NEWSDATA_API_KEY="your_key_here"');
    return null;
  }

  return apiKey;
}

/**
 * Clean and truncate text
 */
function cleanText(text: string | undefined): string {
  if (!text) return '';

  // Remove extra whitespace
  return text.trim().replace(/\s+/g, ' ');
}

/**
 * Fetch multiple tech news articles from NewsData.io
 */
async function getTechNews(count: number = 5): Promise<NewsDataArticle[]> {
  console.log(`Fetching ${count} tech news articles from NewsData.io...`);

  const apiKey = getApiKey();
  if (!apiKey) return [];

  // API endpoint with parameters
  const baseUrl = 'https://newsdata.io/api/1/news';
  const params = new URLSearchParams({
    apikey: apiKey,
    category: 'technology',
    language: 'en',
    size: count.toString(), // Get multiple articles
  });

  const url = `${baseUrl}?${params}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      const errorText = await response.text();
      console.error(`HTTP error ${response.status}: ${errorText}`);
      return [];
    }

    const data: NewsDataResponse = await response.json();

    if (data.status !== 'success') {
      console.error('API returned non-success status:', data.status);
      return [];
    }

    if (!data.results || data.results.length === 0) {
      console.log('No articles found');
      return [];
    }

    console.log(`Found ${data.results.length} articles\n`);
    return data.results;
  } catch (error) {
    console.error('Error fetching NewsData.io API:', error);
    return [];
  }
}

/**
 * Fetch the latest tech news article from NewsData.io
 */
async function getLatestTechNews(): Promise<StoryData | null> {
  const articles = await getTechNews(1);

  if (articles.length === 0) {
    return null;
  }

  const article = articles[0];
  console.log(`Using top article: ${article.title}\n`);

  // Build metadata string
  const metadata: string[] = [];

  if (article.creator && article.creator.length > 0) {
    metadata.push(`Author: ${article.creator.join(', ')}`);
  }

  metadata.push(`Source: ${article.source_id}`);
  metadata.push(`Published: ${article.pubDate}`);

  if (article.keywords && article.keywords.length > 0) {
    metadata.push(`Keywords: ${article.keywords.join(', ')}`);
  }

  if (article.country && article.country.length > 0) {
    metadata.push(`Country: ${article.country.join(', ')}`);
  }

  metadata.push(`Link: ${article.link}`);

  const result: StoryData = {
    title: article.title,
    text: `${cleanText(article.description)}\n\n${metadata.join('\n')}`,
    comments: '(NewsData.io does not provide comments)',
  };

  return result;
}

/**
 * Main function - gets and displays 5 tech news articles
 */
async function main() {
  // Fetch 5 tech news articles
  const articles = await getTechNews(5);

  if (articles.length === 0) {
    console.log('Failed to fetch articles');
    return null;
  }

  // Print all available articles
  console.log('='.repeat(80));
  console.log(`ALL TECH NEWS ARTICLES (${articles.length} items):`);
  console.log('='.repeat(80));

  articles.forEach((article, index) => {
    console.log(`\n[${index + 1}] ${article.title}`);
    console.log(`    Source: ${article.source_id}`);
    console.log(`    Published: ${article.pubDate}`);
    console.log(`    Link: ${article.link}`);
    if (article.description) {
      const preview = article.description.length > 100
        ? article.description.substring(0, 100) + '...'
        : article.description;
      console.log(`    Description: ${preview}`);
    }
    if (article.keywords && article.keywords.length > 0) {
      console.log(`    Keywords: ${article.keywords.slice(0, 5).join(', ')}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('TOP STORY DETAILS:');
  console.log('='.repeat(80) + '\n');

  // Get detailed view of top story
  const storyData = await getLatestTechNews();

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
