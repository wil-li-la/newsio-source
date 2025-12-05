/**
 * GNews API Ingestor
 *
 * Fetches top 5 technology headlines from GNews API
 *
 * ⚠️  COMMERCIAL USE RESTRICTION:
 * The free tier of GNews API is for NON-COMMERCIAL use only.
 * Commercial use requires a paid subscription ($9+/month).
 * See: https://gnews.io/pricing
 *
 * API Documentation: https://gnews.io/docs
 *
 * Prerequisites:
 * - Deno installed (https://deno.land/)
 * - GNEWS_API_KEY environment variable set
 *
 * Run:
 * deno run --allow-net --allow-env --env gnews_ingestor.ts
 */

interface GNewsArticle {
  title: string;
  description: string;
  content: string;
  url: string;
  image: string | null;
  publishedAt: string; // ISO 8601 format
  source: {
    name: string;
    url: string;
  };
}

interface GNewsResponse {
  totalArticles: number;
  articles: GNewsArticle[];
}

interface GNewsErrorResponse {
  errors: string[];
}

/**
 * Fetch top technology headlines from GNews API
 *
 * @param apiKey - Your GNews API key
 * @param maxResults - Number of results to fetch (default: 5, max: 10 for free tier)
 * @param country - Country code (ISO 3166-1 alpha-2, default: 'us')
 * @param lang - Language code (ISO 639-1, default: 'en')
 * @returns Promise<GNewsResponse>
 */
async function fetchTopTechHeadlines(
  apiKey: string,
  maxResults: number = 5,
  country: string = "us",
  lang: string = "en"
): Promise<GNewsResponse> {
  // Validate max results (free tier limited to 10)
  if (maxResults > 10) {
    console.warn("⚠️  Free tier is limited to 10 results max. Setting maxResults to 10.");
    maxResults = 10;
  }

  const baseUrl = "https://gnews.io/api/v4/top-headlines";

  // Build query parameters
  const params = new URLSearchParams({
    category: "technology",
    lang: lang,
    country: country,
    max: maxResults.toString(),
    apikey: apiKey,
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    console.log(`Fetching top ${maxResults} technology headlines from GNews API...`);
    console.log(`Language: ${lang}, Country: ${country}\n`);

    const response = await fetch(url);

    // Handle error responses
    if (!response.ok) {
      const errorData: GNewsErrorResponse = await response.json();

      if (response.status === 401) {
        throw new Error(`Authentication failed: Invalid API key. ${errorData.errors?.join(", ") || ""}`);
      } else if (response.status === 403) {
        throw new Error(`Access forbidden: ${errorData.errors?.join(", ") || "Possible commercial use on free tier or account suspended"}`);
      } else if (response.status === 429) {
        throw new Error(`Rate limit exceeded: You've hit your daily request limit. ${errorData.errors?.join(", ") || ""}`);
      } else if (response.status === 400) {
        throw new Error(`Bad request: ${errorData.errors?.join(", ") || "Invalid parameters"}`);
      } else {
        throw new Error(`HTTP ${response.status}: ${errorData.errors?.join(", ") || response.statusText}`);
      }
    }

    const data: GNewsResponse = await response.json();

    console.log(`Found ${data.totalArticles} total results, returning ${data.articles.length} articles\n`);

    return data;
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error fetching data: ${error.message}`);
    } else {
      console.error(`❌ Unknown error: ${error}`);
    }
    throw error;
  }
}

/**
 * Display articles in a formatted output
 */
function displayArticles(articles: GNewsArticle[]): void {
  console.log("=".repeat(80));
  console.log("TOP 5 TECHNOLOGY HEADLINES");
  console.log("=".repeat(80));
  console.log();

  articles.forEach((article, index) => {
    console.log(`[${index + 1}] ${article.title}`);
    console.log(`    Source: ${article.source.name}`);
    console.log(`    Published: ${article.publishedAt}`);
    console.log(`    URL: ${article.url}`);
    if (article.image) {
      console.log(`    Image: ${article.image}`);
    }
    console.log(`    Description: ${article.description}`);
    console.log();
  });

  console.log("=".repeat(80));
}

/**
 * Main execution
 */
async function main() {
  // Get API key from environment variable
  const apiKey = Deno.env.get("GNEWS_API_KEY");

  if (!apiKey) {
    console.error("❌ Error: GNEWS_API_KEY environment variable is not set");
    console.error("\nPlease set your API key:");
    console.error("  export GNEWS_API_KEY='your_api_key_here'");
    console.error("\nOr add it to your .env file:");
    console.error("  GNEWS_API_KEY=your_api_key_here");
    console.error("\nGet your API key at: https://gnews.io/register");
    Deno.exit(1);
  }

  try {
    // Fetch top 5 technology headlines
    const data = await fetchTopTechHeadlines(apiKey, 5);

    // Display the results
    displayArticles(data.articles);

    console.log("✅ Successfully fetched and displayed articles");
  } catch (error) {
    console.error("\n❌ Failed to fetch articles");
    Deno.exit(1);
  }
}

// Run the main function
if (import.meta.main) {
  main();
}

// Export functions for potential reuse
export { fetchTopTechHeadlines, displayArticles };
export type { GNewsArticle, GNewsResponse };
