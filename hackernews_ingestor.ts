#!/usr/bin/env -S deno run --allow-net
/**
 * Hacker News Ingestor (TypeScript/Deno)
 * Fetches one top story and returns its title, text, and comments
 */

interface HNItem {
  id: number;
  type: string;
  by?: string;
  time: number;
  title?: string;
  text?: string;
  url?: string;
  score?: number;
  descendants?: number;
  kids?: number[];
  deleted?: boolean;
  dead?: boolean;
}

interface StoryData {
  title: string;
  text: string;
  comments: string;
}

/**
 * Remove HTML tags and decode HTML entities
 */
function stripHtmlTags(htmlText: string | undefined): string {
  if (!htmlText) return "";

  // Remove HTML tags
  let cleanText = htmlText.replace(/<[^>]+>/g, "");

  // Decode common HTML entities
  const entities: { [key: string]: string } = {
    "&quot;": '"',
    "&amp;": "&",
    "&lt;": "<",
    "&gt;": ">",
    "&#x27;": "'",
    "&#x2F;": "/",
    "&#39;": "'",
    "&nbsp;": " ",
  };

  cleanText = cleanText.replace(/&[^;]+;/g, (match) => entities[match] || match);

  return cleanText.trim();
}

/**
 * Fetch one top story and return its title, text, and top comments
 */
async function getTopStory(maxComments: number = 10): Promise<StoryData | null> {
  console.log("Fetching top story from Hacker News...");

  // Get top stories
  const topStoriesResponse = await fetch(
    "https://hacker-news.firebaseio.com/v0/topstories.json"
  );
  const topStoryIds: number[] = await topStoriesResponse.json();

  // Get the first story
  const storyId = topStoryIds[0];
  console.log(`Fetching story ID: ${storyId}\n`);

  // Fetch the story
  const storyResponse = await fetch(
    `https://hacker-news.firebaseio.com/v0/item/${storyId}.json`
  );
  const story: HNItem = await storyResponse.json();

  if (!story) return null;

  // Extract basic fields (only title, text, comments - no URL)
  const result: StoryData = {
    title: story.title || "",
    text: stripHtmlTags(story.text),
    comments: "",
  };

  // Fetch and sort comments by score if they exist
  if (story.kids && story.kids.length > 0) {
    console.log(
      `Found ${story.kids.length} top-level comments, fetching top ${maxComments} by score...`
    );

    // Fetch comment metadata to get scores
    const commentsWithScores: Array<[number, number, HNItem]> = [];

    for (const commentId of story.kids) {
      try {
        const commentResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${commentId}.json`
        );
        const commentData: HNItem = await commentResponse.json();

        if (commentData && !commentData.deleted && !commentData.dead) {
          const score = commentData.score || 0;
          commentsWithScores.push([commentId, score, commentData]);
        }
      } catch (e) {
        console.error(`Error fetching comment ${commentId} metadata:`, e);
        continue;
      }
    }

    // Sort by score (highest first)
    commentsWithScores.sort((a, b) => b[1] - a[1]);

    // Take top N comments
    const topComments = commentsWithScores.slice(0, maxComments);
    console.log(`Fetching ${topComments.length} top comments...`);

    // Format the top comments
    const formattedComments: string[] = [];
    for (const [_commentId, _score, commentData] of topComments) {
      const formatted = await formatCommentData(commentData, 0);
      if (formatted) {
        formattedComments.push(formatted);
      }
    }

    // Convert comments list to a single string
    result.comments = formattedComments.join("\n\n---\n\n");
  }

  return result;
}

/**
 * Format a comment and recursively fetch its top replies
 */
async function formatCommentData(
  commentData: HNItem,
  depth: number = 0,
  maxDepth: number = 2
): Promise<string | null> {
  if (!commentData || commentData.deleted || commentData.dead) {
    return null;
  }

  // Get comment text
  const author = commentData.by || "unknown";
  const text = stripHtmlTags(commentData.text);
  const score = commentData.score || 0;

  if (!text) return null;

  // Format the comment with indentation and score
  const indent = "  ".repeat(depth);
  let formattedComment = `${indent}[${author}] (${score} pts): ${text}`;

  // Fetch top replies if they exist and we haven't reached max depth
  if (commentData.kids && commentData.kids.length > 0 && depth < maxDepth) {
    // Limit replies to top 3 per comment
    const replyIds = commentData.kids.slice(0, 3);
    const replies: string[] = [];

    for (const replyId of replyIds) {
      try {
        const replyResponse = await fetch(
          `https://hacker-news.firebaseio.com/v0/item/${replyId}.json`
        );
        const replyData: HNItem = await replyResponse.json();

        const reply = await formatCommentData(replyData, depth + 1, maxDepth);
        if (reply) {
          replies.push(reply);
        }
      } catch (e) {
        console.error(`Error fetching reply ${replyId}:`, e);
        continue;
      }
    }

    if (replies.length > 0) {
      formattedComment += "\n" + replies.join("\n");
    }
  }

  return formattedComment;
}

/**
 * Main function - gets one top story and returns title, text, and comments
 */
async function main() {
  const storyData = await getTopStory();

  // Show story data attributes
  if (storyData) {
    for (const [key, value] of Object.entries(storyData)) {
      console.log(`${key}: ${typeof value}`);
    }
  }

  if (storyData) {
    console.log("=".repeat(80));
    console.log("TITLE:");
    console.log(storyData.title);
    console.log("\n" + "=".repeat(80));

    console.log("TEXT:");
    console.log(storyData.text || "(No text content)");
    console.log("\n" + "=".repeat(80));

    console.log("COMMENTS:");
    console.log(storyData.comments || "(No comments yet)");
    console.log("\n" + "=".repeat(80));

    // Print summary
    console.log(`\nComment string length: ${storyData.comments.length} characters`);

    return storyData;
  } else {
    console.log("Failed to fetch story data");
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
