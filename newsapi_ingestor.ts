#!/usr/bin/env -S deno run --allow-net --allow-env
/**
 * News API Ingestor (TypeScript/Deno)
 * Fetches top 5 technology headlines from newsapi.org
 */

interface NewsAPISource {
  id: string | null;
  name: string;
}

interface NewsAPIArticle {
  source: NewsAPISource;
  author: string | null;
  title: string;
  description: string | null;
  url: string;
  urlToImage: string | null;
  publishedAt: string;
  content: string | null;
}

interface NewsAPIResponse {
  status: string;
  totalResults: number;
  articles: NewsAPIArticle[];
}

interface TechNewsData {
  title: string;
  description: string;
  source: string;
  author: string;
  publishedAt: string;
  url: string;
}

/**
 * Fetch top 5 technology headlines from News API
 */
async function getTechHeadlines(): Promise<TechNewsData[]> {
  // Get API key from environment variable
  const apiKey = Deno.env.get("NEWSAPI_KEY");

  if (!apiKey) {
    throw new Error("NEWSAPI_KEY environment variable is not set");
  }

  console.log("Fetching top 5 technology headlines from News API...\n");

  // Build API URL - get top headlines for technology category in US
  const url = new URL("https://newsapi.org/v2/top-headlines");
  url.searchParams.append("apiKey", apiKey);
  url.searchParams.append("category", "technology");
  url.searchParams.append("country", "us");
  url.searchParams.append("pageSize", "5");

  // Fetch data
  const response = await fetch(url.toString());

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`News API request failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data: NewsAPIResponse = await response.json();

  if (data.status !== "ok") {
    throw new Error(`News API returned non-ok status: ${data.status}`);
  }

  console.log(`Found ${data.totalResults} total results, returning ${data.articles.length} articles\n`);

  // Transform articles into our format
  const techNews: TechNewsData[] = data.articles.map((article) => ({
    title: article.title,
    description: article.description || "(No description)",
    source: article.source.name,
    author: article.author || "Unknown",
    publishedAt: article.publishedAt,
    url: article.url,
  }));

  return techNews;
}

/**
 * Main function - gets top 5 tech headlines and displays them
 */
async function main() {
  try {
    const headlines = await getTechHeadlines();

    console.log("=".repeat(80));
    console.log("TOP 5 TECHNOLOGY HEADLINES");
    console.log("=".repeat(80));

    headlines.forEach((article, index) => {
      console.log(`\n[${index + 1}] ${article.title}`);
      console.log(`    Source: ${article.source}`);
      console.log(`    Author: ${article.author}`);
      console.log(`    Published: ${article.publishedAt}`);
      console.log(`    URL: ${article.url}`);
      console.log(`    Description: ${article.description}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\nTotal articles fetched: ${headlines.length}`);

    return headlines;
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
