# News API Documentation

## What is News API?

News API is a **simple HTTP REST API for searching and retrieving live articles** from all over the web. It can help you answer questions like:
- What's the latest news about technology?
- What are the top headlines in the US today?
- What has a specific source published recently?

### Key Features
- 📰 **150,000+ news sources worldwide**
- 🔄 **Real-time breaking news**
- 📊 **Category filtering** (business, entertainment, general, health, science, sports, technology)
- 🌐 **Multi-language and country support**
- 🔍 **Keyword search** across articles
- 🆓 **100 requests/day free** (for development)

---

## Authentication

News API requires an **API key** for all requests.

### 🔑 Getting an API Key

1. **Sign up** at [newsapi.org/register](https://newsapi.org/register)
2. **Get your API key** from the dashboard
3. **Set environment variable:**

```bash
# .env file
NEWSAPI_KEY=your_api_key_here

# Or export in terminal
export NEWSAPI_KEY="your_api_key_here"
```

### Free Tier Limits

| Feature | Limit |
|---------|-------|
| **Requests per day** | 100 |
| **Results per request** | 100 (max) |
| **Commercial use** | ❌ **Not allowed** (development only) |
| **Historical data** | ✅ Up to 1 month |

⚠️ **Important:** The free Developer plan is for development and non-commercial projects only. Commercial use requires a paid plan starting at $449/month.

---

## API Endpoints

### 1. 📰 Top Headlines

**Endpoint:** `GET https://newsapi.org/v2/top-headlines`

**Description:** Returns breaking news headlines for countries, categories, and singular publishers.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apiKey` | string | ✅ | Your API key | `abc123...` |
| `category` | string | ❌ | Filter by category | `technology` |
| `country` | string | ❌ | 2-letter ISO country code | `us` |
| `sources` | string | ❌ | Comma-separated source IDs | `techcrunch,wired` |
| `q` | string | ❌ | Search keywords | `artificial intelligence` |
| `pageSize` | number | ❌ | Number of results (1-100) | `5` |
| `page` | number | ❌ | Page number for pagination | `1` |

**Note:** You cannot mix `country`/`category` with `sources` parameter.

### 2. 🔍 Everything

**Endpoint:** `GET https://newsapi.org/v2/everything`

**Description:** Search through millions of articles from over 150,000 sources.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apiKey` | string | ✅ | Your API key | `abc123...` |
| `q` | string | ⚠️ | Keywords or phrases to search for | `ChatGPT` |
| `sources` | string | ⚠️ | Comma-separated source IDs | `bbc-news,cnn` |
| `domains` | string | ⚠️ | Comma-separated domains | `techcrunch.com,wired.com` |
| `from` | string | ❌ | Start date (ISO 8601) | `2025-12-01` |
| `to` | string | ❌ | End date (ISO 8601) | `2025-12-03` |
| `language` | string | ❌ | 2-letter ISO language code | `en` |
| `sortBy` | string | ❌ | Sort order: `relevancy`, `popularity`, `publishedAt` | `publishedAt` |
| `pageSize` | number | ❌ | Number of results (1-100) | `20` |
| `page` | number | ❌ | Page number for pagination | `1` |

⚠️ **Note:** At least one of `q`, `sources`, or `domains` is required.

### 3. 📚 Sources

**Endpoint:** `GET https://newsapi.org/v2/top-headlines/sources`

**Description:** Returns the subset of news publishers that top headlines are available from.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apiKey` | string | ✅ | Your API key | `abc123...` |
| `category` | string | ❌ | Filter by category | `technology` |
| `language` | string | ❌ | 2-letter ISO language code | `en` |
| `country` | string | ❌ | 2-letter ISO country code | `us` |

---

## Available Categories

News API supports **7 categories**:

```
business
entertainment
general
health
science
sports
technology
```

---

## Available Technology Sources

News API provides access to numerous technology news publishers. You can query specific sources using their source IDs or filter by domain names.

### 🔍 How to Get Technology Sources

To retrieve the complete current list of technology sources:

```bash
GET https://newsapi.org/v2/top-headlines/sources?category=technology&apiKey=YOUR_API_KEY
```

### Popular Technology Sources

Here are some of the major technology news sources available on News API:

| Source ID | Name | Domain | Description |
|-----------|------|--------|-------------|
| `ars-technica` | Ars Technica | arstechnica.com | In-depth technology news, analysis, and reviews |
| `techcrunch` | TechCrunch | techcrunch.com | Leading startup and technology news platform |
| `the-verge` | The Verge | theverge.com | Technology, science, art, and culture coverage |
| `wired` | Wired | wired.com | Technology, business, and culture magazine |
| `engadget` | Engadget | engadget.com | Consumer electronics and gadget reviews |
| `techradar` | TechRadar | techradar.com | Technology news, reviews, and opinions |
| `hacker-news` | Hacker News | news.ycombinator.com | Tech and startup community news |
| `recode` | Recode | recode.net | Technology business news and analysis |

### Using Source IDs in Requests

**Filter by specific sources (Top Headlines):**
```bash
GET https://newsapi.org/v2/top-headlines?sources=techcrunch,the-verge,ars-technica&apiKey=YOUR_API_KEY
```

**Filter by domains (Everything endpoint):**
```bash
GET https://newsapi.org/v2/everything?domains=techcrunch.com,wired.com,arstechnica.com&q=AI&apiKey=YOUR_API_KEY
```

**Important Notes:**
- You can specify up to **20 sources** in a comma-separated list
- When using `sources` parameter, you **cannot** use `country` or `category` parameters
- Use the `/sources` endpoint to get the most up-to-date list of available sources
- Source IDs and domains give you precise control over which publishers to include

### Example: Get Latest from TechCrunch

```bash
# Using source ID
GET https://newsapi.org/v2/top-headlines?sources=techcrunch&pageSize=10&apiKey=YOUR_API_KEY

# Using domain (Everything endpoint)
GET https://newsapi.org/v2/everything?domains=techcrunch.com&sortBy=publishedAt&pageSize=10&apiKey=YOUR_API_KEY
```

---

## Response Structure

### Top Headlines & Everything Response

Both endpoints return the same structure:

```json
{
  "status": "ok",
  "totalResults": 38,
  "articles": [...]
}
```

### Article Object Fields

| Field | Type | Always Present? | Description |
|-------|------|:---------------:|-------------|
| `source.id` | string \| null | ✅ | Source identifier (may be null) |
| `source.name` | string | ✅ | Source display name |
| `author` | string \| null | ✅ | Article author |
| `title` | string | ✅ | Article headline |
| `description` | string \| null | ✅ | Article summary/excerpt |
| `url` | string | ✅ | Direct URL to article |
| `urlToImage` | string \| null | ✅ | URL to article image |
| `publishedAt` | string | ✅ | Publication time (UTC, ISO 8601) |
| `content` | string \| null | ✅ | Truncated article content (200 chars) |

### Sources Response

```json
{
  "status": "ok",
  "sources": [
    {
      "id": "techcrunch",
      "name": "TechCrunch",
      "description": "The latest technology news and information on startups",
      "url": "https://techcrunch.com",
      "category": "technology",
      "language": "en",
      "country": "us"
    }
  ]
}
```

---

## Example Usage

### Get Top 5 Technology Headlines (US)

```bash
GET https://newsapi.org/v2/top-headlines?category=technology&country=us&pageSize=5&apiKey=YOUR_API_KEY
```

### Search Everything for "AI" in Last 7 Days

```bash
GET https://newsapi.org/v2/everything?q=artificial+intelligence&from=2025-11-26&to=2025-12-03&sortBy=publishedAt&pageSize=10&apiKey=YOUR_API_KEY
```

### Get All Technology Sources

```bash
GET https://newsapi.org/v2/top-headlines/sources?category=technology&apiKey=YOUR_API_KEY
```

---

## Running the Ingestor

### Prerequisites

- [Deno](https://deno.land/) installed
- News API key set in `.env` file or environment variable

### Run Command

```bash
# With .env file
deno run --allow-net --allow-env --env newsapi_ingestor.ts

# Or with inline env var
NEWSAPI_KEY="your_key" deno run --allow-net --allow-env newsapi_ingestor.ts
```

### Expected Output

```
Fetching top 5 technology headlines from News API...

Found 70 total results, returning 5 articles

================================================================================
TOP 5 TECHNOLOGY HEADLINES
================================================================================

[1] OpenAI launches new o3 model
    Source: TechCrunch
    Author: Kyle Wiggers
    Published: 2025-12-03T10:30:00Z
    URL: https://techcrunch.com/...
    Description: OpenAI today announced o3, its newest reasoning model...

[2] Google announces Gemini 2.0
    Source: The Verge
    Author: David Pierce
    Published: 2025-12-03T09:15:00Z
    URL: https://www.theverge.com/...
    Description: Google is launching Gemini 2.0, a major update to its AI model...

[...]
```

---

## Rate Limits & Best Practices

### Rate Limits

- **Free tier (Developer):** 100 requests/day
- **Paid tier (Business):** 250-100,000 requests/day (based on plan)
- **Exceeded limit response:** `426 Upgrade Required`

### Best Practices

**✅ DO:**
- Cache responses to minimize requests
- Use `pageSize` parameter efficiently (default is 20, max is 100)
- Use specific search parameters to get relevant results
- Handle error responses gracefully
- Store API keys in environment variables (never in code)
- Use `sources` or `domains` for targeted searches
- Check `totalResults` for pagination needs

**❌ DON'T:**
- Make requests more than necessary (use caching)
- Ignore the free tier commercial use restrictions
- Expose your API key in public repositories
- Exceed rate limits (implement backoff strategy)
- Mix `country`/`category` with `sources` parameter

---

## Error Handling

### Common Error Responses

| Status Code | Error | Meaning |
|------------|-------|---------|
| `200` | `ok` | Request successful |
| `400` | `parameterInvalid` | Invalid parameter value |
| `401` | `apiKeyMissing` | API key not provided |
| `401` | `apiKeyInvalid` | Invalid API key |
| `429` | `rateLimited` | Too many requests |
| `426` | `upgradeRequired` | Rate limit exceeded |
| `500` | `serverError` | Server-side error |

### Example Error Response

```json
{
  "status": "error",
  "code": "apiKeyInvalid",
  "message": "Your API key is invalid or incorrect. Check your key, or go to https://newsapi.org to create a free API key."
}
```

---

## Comparison with Other APIs

| Feature | News API | NewsData.io | Hacker News | Dev.to |
|---------|:--------:|:-----------:|:-----------:|:------:|
| **Format** | JSON REST | JSON REST | JSON | JSON REST |
| **Auth** | API Key | API Key | None | None |
| **Free Tier** | 100/day | 200/day | Unlimited | Unlimited |
| **Commercial (Free)** | ❌ | ✅ | ✅ | ✅ |
| **Commercial (Paid)** | $449+/mo | $49+/mo | N/A | N/A |
| **Sources** | 150,000+ | 1,000+ | 1 | 1 |
| **Categories** | 7 | 11 | Tech only | Tech only |
| **Historical Data** | 1 month | Paid only | Full history | 6-12 months |
| **Search** | ✅ | ✅ | ❌ | ✅ |
| **Best For** | News aggregation (paid) | Commercial free tier | Tech discussions | Dev community |

### Key Considerations

1. ❌ **Free tier = development only** - Commercial use requires $449/month Business plan
2. ✅ **Massive source coverage** - 150,000+ sources worldwide
3. ✅ **Powerful search** - Full-text search across all articles
4. ✅ **Well-documented** - Comprehensive API docs with examples
5. ⚠️ **Cost** - Expensive for commercial use compared to alternatives
6. ✅ **Reliable** - Established service with good uptime

### When to Use News API

**Use News API if:**
- You need comprehensive news coverage from thousands of sources
- You're building a development/personal project (free tier)
- You have budget for commercial use ($449+/month)
- You need powerful search and filtering capabilities

**Consider alternatives if:**
- You need free commercial use → Use **NewsData.io** or **Dev.to**
- You need tech-specific discussions → Use **Hacker News**
- Budget is limited → Use **NewsData.io** ($49/mo commercial)

---

## License & Commercial Use

### ⚠️ Can I use News API for business/commercial purposes?

**FREE TIER: NO** ❌
The Developer plan (free) is strictly for **development and non-commercial projects only**.

**PAID TIER: YES** ✅
Commercial use requires a Business plan or higher.

### Pricing Plans

| Plan | Price | Daily Requests | Commercial Use |
|------|------:|---------------:|:--------------:|
| **Developer** | Free | 100 | ❌ No |
| **Business 150** | $449/mo | 150,000 | ✅ Yes |
| **Business 250** | $649/mo | 250,000 | ✅ Yes |
| **Business 500** | $1,249/mo | 500,000 | ✅ Yes |
| **Enterprise** | Custom | Custom | ✅ Yes |

*Prices current as of December 2025. Check [newsapi.org/pricing](https://newsapi.org/pricing) for updates.*

---

## Official Resources

| Resource | URL |
|----------|-----|
| **Website** | https://newsapi.org |
| **Documentation** | https://newsapi.org/docs |
| **Register** | https://newsapi.org/register |
| **Pricing** | https://newsapi.org/pricing |
| **Account Dashboard** | https://newsapi.org/account |
| **Support** | support@newsapi.org |
| **Status** | https://status.newsapi.org |

---

## Summary

- **Best for:** Comprehensive news aggregation with massive source coverage (paid commercial use)
- **Cost:** Free for development (100 requests/day), $449+/month for commercial use
- **Commercial:** ❌ NOT allowed on free tier, requires paid plan
- **Format:** JSON REST API
- **Auth:** API key required
- **Categories:** 7 categories (business, entertainment, general, health, science, sports, technology)
- **Search:** ✅ Full-text search across all sources
- **Sources:** 150,000+ worldwide
- **Rate limits:** 100/day free, 150,000-500,000/day paid
- **Historical data:** ✅ Up to 1 month on free tier
- **Key advantage:** Massive source coverage and powerful search capabilities
- **Key limitation:** Free tier restricted to non-commercial use only
