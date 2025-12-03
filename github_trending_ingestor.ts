#!/usr/bin/env -S deno run --allow-net
/**
 * GitHub Trending Ingestor (TypeScript/Deno)
 * Fetches the top trending repository from GitHub
 * Uses web scraping of trending page (no official API)
 */

interface TrendingRepo {
  name: string;
  author: string;
  description: string;
  language: string;
  stars: number;
  forks: number;
  todayStars: number;
  url: string;
}

interface StoryData {
  title: string;
  text: string;
  comments: string;
}

/**
 * Extract text content from HTML between tags
 */
function extractText(html: string, startTag: string, endTag: string): string {
  const startIndex = html.indexOf(startTag);
  if (startIndex === -1) return '';

  const contentStart = startIndex + startTag.length;
  const endIndex = html.indexOf(endTag, contentStart);
  if (endIndex === -1) return '';

  return html.substring(contentStart, endIndex).trim();
}

/**
 * Clean HTML tags and entities from text
 */
function cleanText(text: string): string {
  if (!text) return '';

  // Remove HTML tags
  text = text.replace(/<[^>]+>/g, '');

  // Decode HTML entities
  const entities: { [key: string]: string } = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#x27;': "'",
    '&#39;': "'",
    '&nbsp;': ' ',
  };

  text = text.replace(/&[^;]+;/g, (match) => entities[match] || match);

  // Remove extra whitespace
  return text.replace(/\s+/g, ' ').trim();
}

/**
 * Parse a single repository from HTML block
 */
function parseRepo(repoHtml: string): TrendingRepo | null {
  try {
    // Extract repository name and author
    const h2Match = repoHtml.match(/<h2[^>]*>([\s\S]*?)<\/h2>/);
    if (!h2Match) return null;

    const h2Content = h2Match[1];
    const linkMatch = h2Content.match(/href="\/([^"]+)"/);
    if (!linkMatch) return null;

    const fullName = linkMatch[1];
    const [author, name] = fullName.split('/');
    const url = `https://github.com/${fullName}`;

    // Extract description
    let description = '';
    const descMatch = repoHtml.match(/<p[^>]*class="[^"]*col-9[^"]*"[^>]*>([\s\S]*?)<\/p>/);
    if (descMatch) {
      description = cleanText(descMatch[1]);
    }

    // Extract language
    let language = 'Unknown';
    const langMatch = repoHtml.match(/itemprop="programmingLanguage"[^>]*>([\s\S]*?)<\/span>/);
    if (langMatch) {
      language = cleanText(langMatch[1]);
    }

    // Extract stars (total)
    let stars = 0;
    const starsMatch = repoHtml.match(/href="[^"]*\/stargazers"[^>]*>([\s\S]*?)<\/a>/);
    if (starsMatch) {
      const starsText = cleanText(starsMatch[1]).replace(/,/g, '');
      stars = parseInt(starsText) || 0;
    }

    // Extract forks
    let forks = 0;
    const forksMatch = repoHtml.match(/href="[^"]*\/forks"[^>]*>([\s\S]*?)<\/a>/);
    if (forksMatch) {
      const forksText = cleanText(forksMatch[1]).replace(/,/g, '');
      forks = parseInt(forksText) || 0;
    }

    // Extract today's stars
    let todayStars = 0;
    const todayMatch = repoHtml.match(/<span[^>]*class="[^"]*float-sm-right[^"]*"[^>]*>([\s\S]*?)<\/span>/);
    if (todayMatch) {
      const todayText = cleanText(todayMatch[1]);
      const numberMatch = todayText.match(/[\d,]+/);
      if (numberMatch) {
        todayStars = parseInt(numberMatch[0].replace(/,/g, '')) || 0;
      }
    }

    return {
      name,
      author,
      description,
      language,
      stars,
      forks,
      todayStars,
      url,
    };
  } catch (error) {
    console.error('Error parsing repository:', error);
    return null;
  }
}

/**
 * Fetch multiple trending repositories from GitHub (English)
 */
async function getTrendingRepos(count: number = 5): Promise<TrendingRepo[]> {
  console.log(`Fetching ${count} trending repositories from GitHub (English)...`);

  const trendingUrl = 'https://github.com/trending?spoken_language_code=en';

  try {
    const response = await fetch(trendingUrl, {
      headers: {
        'User-Agent': 'Mozilla/5.0 (compatible; NewsBot/1.0)',
        'Accept': 'text/html',
      },
    });

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      return [];
    }

    const html = await response.text();

    // Find all repository articles
    const articleRegex = /<article[^>]*class="[^"]*Box-row[^"]*"[^>]*>([\s\S]*?)<\/article>/g;
    const matches = html.matchAll(articleRegex);

    const repos: TrendingRepo[] = [];

    for (const match of matches) {
      const repoHtml = match[1];
      const repo = parseRepo(repoHtml);
      if (repo) {
        repos.push(repo);
        if (repos.length >= count) break;
      }
    }

    if (repos.length === 0) {
      console.log('No trending repositories found');
      return [];
    }

    console.log(`Found ${repos.length} repositories\n`);
    return repos;
  } catch (error) {
    console.error('Error fetching GitHub Trending:', error);
    return [];
  }
}

/**
 * Fetch the top trending repository from GitHub
 */
async function getTopTrendingRepo(): Promise<StoryData | null> {
  const repos = await getTrendingRepos(1);

  if (repos.length === 0) {
    return null;
  }

  const topRepo = repos[0];
  console.log(`Using top repository: ${topRepo.author}/${topRepo.name}\n`);

  // Build metadata
  const metadata: string[] = [
    `Repository: ${topRepo.author}/${topRepo.name}`,
    `Language: ${topRepo.language}`,
    `Stars: ${topRepo.stars.toLocaleString()}`,
    `Forks: ${topRepo.forks.toLocaleString()}`,
    `Stars today: ${topRepo.todayStars.toLocaleString()}`,
    `URL: ${topRepo.url}`,
  ];

  const result: StoryData = {
    title: `${topRepo.author}/${topRepo.name}`,
    text: `${topRepo.description || '(No description)'}\n\n${metadata.join('\n')}`,
    comments: '(GitHub Trending does not include comments)',
  };

  return result;
}

/**
 * Main function - gets and displays top 5 trending repositories
 */
async function main() {
  // Fetch 5 trending repositories
  const repos = await getTrendingRepos(5);

  if (repos.length === 0) {
    console.log('Failed to fetch repositories');
    return null;
  }

  // Print all available repositories
  console.log('='.repeat(80));
  console.log(`ALL TRENDING REPOSITORIES (${repos.length} items):`);
  console.log('='.repeat(80));

  repos.forEach((repo, index) => {
    console.log(`\n[${index + 1}] ${repo.author}/${repo.name}`);
    console.log(`    Language: ${repo.language}`);
    console.log(`    Stars: ${repo.stars.toLocaleString()}`);
    console.log(`    Stars today: ${repo.todayStars.toLocaleString()}`);
    console.log(`    URL: ${repo.url}`);
    if (repo.description) {
      const preview = repo.description.length > 100
        ? repo.description.substring(0, 100) + '...'
        : repo.description;
      console.log(`    Description: ${preview}`);
    }
  });

  console.log('\n' + '='.repeat(80));
  console.log('TOP REPOSITORY DETAILS:');
  console.log('='.repeat(80) + '\n');

  // Get detailed view of top repository
  const storyData = await getTopTrendingRepo();

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
    console.log('Failed to fetch repository data');
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
