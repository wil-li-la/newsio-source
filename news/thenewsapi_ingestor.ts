/**
 * The News API Ingestor
 *
 * Fetches top 5 technology headlines from The News API (thenewsapi.com)
 *
 * ⚠️  COMMERCIAL USE RESTRICTION:
 * The free tier of The News API is for NON-COMMERCIAL use only.
 * Commercial use requires a paid subscription ($9+/month) or specific approval.
 * See: https://www.thenewsapi.com/pricing
 *
 * API Documentation: https://www.thenewsapi.com/documentation
 *
 * Prerequisites:
 * - Deno installed (https://deno.land/)
 * - THENEWS_API_KEY environment variable set
 *
 * Run:
 * deno run --allow-net --allow-env --env thenewsapi_ingestor.ts
 */

interface TheNewsArticle {
  uuid: string;
  title: string;
  description: string;
  keywords: string;
  snippet: string;
  url: string;
  image_url: string | null;
  language: string;
  published_at: string; // ISO 8601 format UTC
  source: string; // Domain name
  categories: string[];
  relevance_score: number | null;
  locale: string;
}

interface TheNewsResponse {
  meta: {
    found: number;
    returned: number;
    limit: number;
    page: number;
  };
  data: TheNewsArticle[];
}

interface TheNewsErrorResponse {
  error: {
    code: string;
    message: string;
  };
}

/**
 * Fetch top technology headlines from The News API
 *
 * @param apiToken - Your The News API token
 * @param limit - Number of results to fetch (default: 5, max: 3 for free tier)
 * @param locale - Country code (ISO 3166-1 alpha-2, default: 'us')
 * @param language - Language code (ISO 639-1, default: 'en')
 * @returns Promise<TheNewsResponse>
 */
async function fetchTopTechHeadlines(
  apiToken: string,
  limit: number = 5,
  locale: string = "us",
  language: string = "en"
): Promise<TheNewsResponse> {
  // Validate limit (free tier limited to 3 articles per request)
  if (limit > 3) {
    console.warn("⚠️  Free tier is limited to 3 articles per request. Setting limit to 3.");
    limit = 3;
  }

  const baseUrl = "https://api.thenewsapi.com/v1/news/top";

  // Build query parameters
  const params = new URLSearchParams({
    api_token: apiToken,
    categories: "tech",
    locale: locale,
    language: language,
    limit: limit.toString(),
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    console.log(`Fetching top ${limit} technology headlines from The News API...`);
    console.log(`Language: ${language}, Locale: ${locale}\n`);

    const response = await fetch(url);

    // Handle error responses
    if (!response.ok) {
      let errorMessage: string;

      try {
        const errorData: TheNewsErrorResponse = await response.json();
        errorMessage = errorData.error?.message || response.statusText;

        if (response.status === 401) {
          throw new Error(`Authentication failed: Invalid API token. ${errorMessage}`);
        } else if (response.status === 402) {
          throw new Error(`Usage limit reached: You've exceeded your plan's daily/monthly limit. ${errorMessage}`);
        } else if (response.status === 403) {
          throw new Error(`Access restricted: ${errorMessage} (This endpoint may not be available on your plan, or you may be using free tier for commercial purposes)`);
        } else if (response.status === 404) {
          throw new Error(`Resource not found: ${errorMessage}`);
        } else if (response.status === 429) {
          throw new Error(`Rate limit exceeded: Too many requests in the past 60 seconds. ${errorMessage}`);
        } else if (response.status === 400) {
          throw new Error(`Bad request: ${errorMessage} (Invalid parameters)`);
        } else {
          throw new Error(`HTTP ${response.status}: ${errorMessage}`);
        }
      } catch (parseError) {
        // If we can't parse the error response, use status text
        throw new Error(`HTTP ${response.status}: ${response.statusText}`);
      }
    }

    const data: TheNewsResponse = await response.json();

    console.log(`Found ${data.meta.found} total results, returning ${data.meta.returned} articles\n`);

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
function displayArticles(articles: TheNewsArticle[]): void {
  console.log("=".repeat(80));
  console.log("TOP 5 TECHNOLOGY HEADLINES");
  console.log("=".repeat(80));
  console.log();

  articles.forEach((article, index) => {
    console.log(`[${index + 1}] ${article.title}`);
    console.log(`    Source: ${article.source}`);
    console.log(`    Published: ${article.published_at}`);
    console.log(`    URL: ${article.url}`);
    if (article.image_url) {
      console.log(`    Image: ${article.image_url}`);
    }
    console.log(`    Categories: ${article.categories.join(", ")}`);
    console.log(`    Locale: ${article.locale}`);
    console.log(`    UUID: ${article.uuid}`);
    console.log(`    Description: ${article.description}`);
    if (article.snippet) {
      console.log(`    Snippet: ${article.snippet}`);
    }
    console.log();
  });

  console.log("=".repeat(80));
}

/**
 * Fetch tech news sources from The News API
 *
 * @param apiToken - Your The News API token
 * @param limit - Number of sources to fetch (max: 50)
 * @returns Promise with sources data
 */
async function fetchTechSources(apiToken: string, limit: number = 50): Promise<any> {
  const baseUrl = "https://api.thenewsapi.com/v1/news/sources";

  const params = new URLSearchParams({
    api_token: apiToken,
    categories: "tech",
    language: "en",
    limit: Math.min(limit, 50).toString(),
  });

  const url = `${baseUrl}?${params.toString()}`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      throw new Error(`Failed to fetch sources: ${response.statusText}`);
    }

    return await response.json();
  } catch (error) {
    if (error instanceof Error) {
      console.error(`❌ Error fetching sources: ${error.message}`);
    }
    throw error;
  }
}

/**
 * Main execution
 */
async function main() {
  // Get API token from environment variable
  const apiToken = Deno.env.get("THENEWS_API_KEY");

  if (!apiToken) {
    console.error("❌ Error: THENEWS_API_KEY environment variable is not set");
    console.error("\nPlease set your API token:");
    console.error("  export THENEWS_API_KEY='your_api_token_here'");
    console.error("\nOr add it to your .env file:");
    console.error("  THENEWS_API_KEY=your_api_token_here");
    console.error("\nGet your API token at: https://www.thenewsapi.com/account/dashboard");
    Deno.exit(1);
  }

  try {
    // Fetch top 5 technology headlines (limited to 3 on free tier)
    const data = await fetchTopTechHeadlines(apiToken, 5);

    // Display the results
    displayArticles(data.data);

    console.log("✅ Successfully fetched and displayed articles");
    console.log(`\n📊 Metadata:`);
    console.log(`   Total found: ${data.meta.found}`);
    console.log(`   Returned: ${data.meta.returned}`);
    console.log(`   Limit: ${data.meta.limit}`);
    console.log(`   Page: ${data.meta.page}`);

    // Optional: Uncomment to fetch and display tech sources
    // console.log("\n\nFetching tech news sources...");
    // const sources = await fetchTechSources(apiToken, 10);
    // console.log(`\n📰 Found ${sources.meta?.found || 0} tech sources`);
    // if (sources.data) {
    //   sources.data.forEach((source: any, idx: number) => {
    //     console.log(`  ${idx + 1}. ${source.name || source.domain} (${source.locale})`);
    //   });
    // }
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
export { fetchTopTechHeadlines, fetchTechSources, displayArticles };
export type { TheNewsArticle, TheNewsResponse };
