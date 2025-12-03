#!/usr/bin/env -S deno run --allow-net
/**
 * Dev.to/Forem Ingestor (TypeScript/Deno)
 * Fetches the top article with comments from Dev.to API
 * Includes recursive comment fetching similar to Hacker News
 */

interface DevToArticle {
  type_of: string;
  id: number;
  title: string;
  description: string;
  readable_publish_date: string;
  slug: string;
  path: string;
  url: string;
  comments_count: number;
  public_reactions_count: number;
  collection_id: number | null;
  published_timestamp: string;
  positive_reactions_count: number;
  cover_image: string | null;
  social_image: string;
  canonical_url: string;
  created_at: string;
  edited_at: string | null;
  crossposted_at: string | null;
  published_at: string;
  last_comment_at: string;
  reading_time_minutes: number;
  tag_list: string[];
  tags: string;
  body_html?: string;
  body_markdown?: string;
  user: {
    name: string;
    username: string;
    twitter_username: string | null;
    github_username: string | null;
    user_id: number;
    website_url: string | null;
    profile_image: string;
    profile_image_90: string;
  };
}

interface DevToComment {
  type_of: string;
  id_code: string;
  created_at: string;
  body_html: string;
  user: {
    name: string;
    username: string;
    twitter_username: string | null;
    github_username: string | null;
    user_id: number;
    website_url: string | null;
    profile_image: string;
    profile_image_90: string;
  };
  children: DevToComment[];
}

interface StoryData {
  title: string;
  text: string;
  comments: string;
}

/**
 * Remove HTML tags from text
 */
function stripHtmlTags(htmlText: string | undefined): string {
  if (!htmlText) return '';

  // Remove HTML tags
  let cleanText = htmlText.replace(/<[^>]+>/g, '');

  // Decode common HTML entities
  const entities: { [key: string]: string } = {
    '&quot;': '"',
    '&amp;': '&',
    '&lt;': '<',
    '&gt;': '>',
    '&#x27;': "'",
    '&#x2F;': '/',
    '&#39;': "'",
    '&nbsp;': ' ',
    '&rsquo;': "'",
    '&lsquo;': "'",
    '&rdquo;': '"',
    '&ldquo;': '"',
  };

  cleanText = cleanText.replace(/&[^;]+;/g, (match) => entities[match] || match);

  return cleanText.trim();
}

/**
 * Format a comment and its children recursively
 */
function formatComment(comment: DevToComment, depth: number = 0, maxDepth: number = 2): string {
  const indent = '  '.repeat(depth);
  const author = comment.user.username;
  const text = stripHtmlTags(comment.body_html);

  if (!text) return '';

  let formatted = `${indent}[${author}]: ${text}`;

  // Recursively format children if within max depth
  if (comment.children && comment.children.length > 0 && depth < maxDepth) {
    const childComments = comment.children
      .slice(0, 3) // Limit to 3 replies per comment
      .map((child) => formatComment(child, depth + 1, maxDepth))
      .filter((c) => c.length > 0);

    if (childComments.length > 0) {
      formatted += '\n' + childComments.join('\n');
    }
  }

  return formatted;
}

/**
 * Fetch the top article with highest reactions from Dev.to
 */
async function getTopArticle(maxComments: number = 10): Promise<StoryData | null> {
  console.log('Fetching top article from Dev.to...');

  // Get latest articles sorted by reactions
  const articlesUrl = 'https://dev.to/api/articles?per_page=10&top=1';

  try {
    const response = await fetch(articlesUrl);

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      return null;
    }

    const articles: DevToArticle[] = await response.json();

    if (!articles || articles.length === 0) {
      console.log('No articles found');
      return null;
    }

    // Get the first article (top by reactions)
    const article = articles[0];
    console.log(`Found article: ${article.title}`);
    console.log(`By: ${article.user.name} (@${article.user.username})`);
    console.log(`Reactions: ${article.positive_reactions_count}, Comments: ${article.comments_count}\n`);

    // Fetch full article to get body
    const fullArticleUrl = `https://dev.to/api/articles/${article.id}`;
    const fullResponse = await fetch(fullArticleUrl);
    const fullArticle: DevToArticle = await fullResponse.json();

    // Build article text with metadata
    const metadata: string[] = [
      `Author: ${article.user.name} (@${article.user.username})`,
      `Published: ${article.readable_publish_date}`,
      `Reading time: ${article.reading_time_minutes} min`,
      `Tags: ${article.tag_list.join(', ')}`,
      `Reactions: ${article.positive_reactions_count}`,
      `URL: ${article.url}`,
    ];

    // Get article description or excerpt
    const articleText = fullArticle.description || article.description || '(No description)';

    const result: StoryData = {
      title: article.title,
      text: `${articleText}\n\n${metadata.join('\n')}`,
      comments: '',
    };

    // Fetch comments if they exist
    if (article.comments_count > 0) {
      console.log(`Fetching up to ${maxComments} comments...`);

      const commentsUrl = `https://dev.to/api/comments?a_id=${article.id}`;
      const commentsResponse = await fetch(commentsUrl);

      if (commentsResponse.ok) {
        const comments: DevToComment[] = await commentsResponse.json();

        // Take top comments (limited by maxComments)
        const topComments = comments.slice(0, maxComments);
        console.log(`Formatting ${topComments.length} comments...`);

        // Format all comments
        const formattedComments = topComments
          .map((comment) => formatComment(comment, 0))
          .filter((c) => c.length > 0);

        result.comments = formattedComments.join('\n\n---\n\n');
      } else {
        result.comments = '(Failed to fetch comments)';
      }
    } else {
      result.comments = '(No comments yet)';
    }

    return result;
  } catch (error) {
    console.error('Error fetching Dev.to API:', error);
    return null;
  }
}

/**
 * Main function - gets the top article with comments
 */
async function main() {
  const storyData = await getTopArticle();

  // Show story data attributes
  if (storyData) {
    for (const [key, value] of Object.entries(storyData)) {
      console.log(`${key}: ${typeof value}`);
    }
  }

  if (storyData) {
    console.log('='.repeat(80));
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
    console.log(`\nComment string length: ${storyData.comments.length} characters`);

    return storyData;
  } else {
    console.log('Failed to fetch article data');
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
