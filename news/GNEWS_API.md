# GNews API Documentation

## What is GNews API?

GNews API is a **RESTful API for searching and retrieving articles from 60,000+ worldwide news sources**. It provides both real-time news and historical data powered by Google News rankings.

### Key Features
- 📰 **60,000+ news sources worldwide**
- 🔄 **Real-time breaking news**
- 📊 **9 categories** (General, World, Nation, Business, Technology, Entertainment, Sports, Science, Health)
- 🌐 **Multi-language support** (60+ languages)
- 🌍 **Country filtering** (150+ countries)
- 🔍 **Boolean search operators** (AND, OR, NOT)
- 🆓 **100 requests/day free** (for non-commercial use only)

---

## ⚠️ Commercial Use Restrictions

### Can I use GNews API for commercial projects?

**FREE TIER: NO** ❌
The free subscription **cannot be used for commercial projects**. It is designed for:
- Non-commercial projects
- Development purposes
- Testing

**PAID TIER: YES** ✅
Commercial use requires a paid subscription.

### Pricing Plans

| Plan | Price | Daily Requests | Commercial Use |
|------|------:|---------------:|:--------------:|
| **Free** | $0 | 100 | ❌ No |
| **Basic** | $9/mo | 10,000 | ✅ Yes |
| **Professional** | $49/mo | 100,000 | ✅ Yes |
| **Enterprise** | Custom | Custom | ✅ Yes |

*Prices current as of December 2025. Check [gnews.io/pricing](https://gnews.io/pricing) for updates.*

---

## Authentication

GNews API requires an **API key** for all requests.

### 🔑 Getting an API Key

1. **Sign up** at [gnews.io/register](https://gnews.io/register)
2. **Verify your email** address
3. **Get your API key** from the dashboard
4. **Set environment variable:**

```bash
# .env file
GNEWS_API_KEY=your_api_key_here

# Or export in terminal
export GNEWS_API_KEY="your_api_key_here"
```

### Free Tier Limits

| Feature | Limit |
|---------|-------|
| **Requests per day** | 100 |
| **Results per request** | 10 (max) |
| **Commercial use** | ❌ **Not allowed** (non-commercial only) |
| **Historical data** | ✅ Available |

---

## API Endpoints

### 1. 🔍 Search

**Base URL:** `https://gnews.io/api/v4/search`

**Description:** Search for articles using keywords, dates, language, country, and Boolean operators.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apikey` | string | ✅ | Your API key | `abc123...` |
| `q` | string | ✅ | Search query/keywords | `artificial intelligence` |
| `lang` | string | ❌ | Language code (ISO 639-1) | `en` |
| `country` | string | ❌ | Country code (ISO 3166-1) | `us` |
| `max` | number | ❌ | Number of results (1-100, default 10) | `10` |
| `from` | string | ❌ | Start date (ISO 8601) | `2025-12-01T00:00:00Z` |
| `to` | string | ❌ | End date (ISO 8601) | `2025-12-05T23:59:59Z` |
| `in` | string | ❌ | Search in specific fields | `title,description,content` |
| `nullable` | string | ❌ | Allow null fields | `image,description` |
| `sortby` | string | ❌ | Sort order | `publishedAt`, `relevance` |

**Example Request:**
```bash
GET https://gnews.io/api/v4/search?q=technology&lang=en&country=us&max=10&apikey=YOUR_API_KEY
```

**Boolean Search Operators:**
- `AND` - Both terms must appear: `AI AND ethics`
- `OR` - Either term can appear: `ChatGPT OR GPT-4`
- `NOT` - Exclude term: `AI NOT cryptocurrency`
- Grouping with parentheses: `(AI OR "machine learning") AND ethics`

### 2. 📰 Top Headlines

**Base URL:** `https://gnews.io/api/v4/top-headlines`

**Description:** Get breaking news headlines ranked by Google News. Available in 9 categories.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apikey` | string | ✅ | Your API key | `abc123...` |
| `category` | string | ❌ | News category | `technology` |
| `lang` | string | ❌ | Language code (ISO 639-1) | `en` |
| `country` | string | ❌ | Country code (ISO 3166-1) | `us` |
| `max` | number | ❌ | Number of results (1-100, default 10) | `5` |
| `q` | string | ❌ | Search keywords | `AI` |
| `from` | string | ❌ | Start date (ISO 8601) | `2025-12-01T00:00:00Z` |
| `to` | string | ❌ | End date (ISO 8601) | `2025-12-05T23:59:59Z` |
| `in` | string | ❌ | Search in specific fields | `title,description` |
| `nullable` | string | ❌ | Allow null fields | `image` |

**Example Request:**
```bash
GET https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=5&apikey=YOUR_API_KEY
```

---

## Available Categories

GNews API supports **9 categories**:

```
general
world
nation
business
technology
entertainment
sports
science
health
```

---

## Supported Languages

GNews supports **60+ languages** using ISO 639-1 codes:

**Popular Languages:**
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi

[Full language list](https://gnews.io/docs/v4#supported-languages)

---

## Supported Countries

GNews supports **150+ countries** using ISO 3166-1 alpha-2 codes:

**Popular Countries:**
- `us` - United States
- `gb` - United Kingdom
- `ca` - Canada
- `au` - Australia
- `in` - India
- `de` - Germany
- `fr` - France
- `jp` - Japan
- `cn` - China
- `br` - Brazil

[Full country list](https://gnews.io/docs/v4#supported-countries)

---

## Response Structure

### Search & Top Headlines Response

Both endpoints return the same structure:

```json
{
  "totalArticles": 245,
  "articles": [...]
}
```

### Article Object Fields

| Field | Type | Always Present? | Description |
|-------|------|:---------------:|-------------|
| `title` | string | ✅ | Article headline |
| `description` | string | ✅ | Article summary/excerpt |
| `content` | string | ✅ | Article content preview |
| `url` | string | ✅ | Direct URL to article |
| `image` | string \| null | ✅ | URL to article image |
| `publishedAt` | string | ✅ | Publication time (ISO 8601 UTC) |
| `source.name` | string | ✅ | Publisher name |
| `source.url` | string | ✅ | Publisher homepage URL |

### Example Response

```json
{
  "totalArticles": 3542,
  "articles": [
    {
      "title": "OpenAI Launches GPT-5 with Revolutionary Capabilities",
      "description": "OpenAI today announced the release of GPT-5, marking a significant leap in AI capabilities...",
      "content": "OpenAI today announced the release of GPT-5, marking a significant leap in AI capabilities. The new model demonstrates unprecedented reasoning and problem-solving abilities...",
      "url": "https://example.com/openai-gpt5-launch",
      "image": "https://example.com/images/gpt5.jpg",
      "publishedAt": "2025-12-05T10:30:00Z",
      "source": {
        "name": "TechCrunch",
        "url": "https://techcrunch.com"
      }
    }
  ]
}
```

---

## Example Usage

### Get Top 5 Technology Headlines (US)

```bash
GET https://gnews.io/api/v4/top-headlines?category=technology&lang=en&country=us&max=5&apikey=YOUR_API_KEY
```

### Search for "AI" Articles in Last 7 Days

```bash
GET https://gnews.io/api/v4/search?q=artificial%20intelligence&lang=en&from=2025-11-28T00:00:00Z&to=2025-12-05T23:59:59Z&max=10&sortby=publishedAt&apikey=YOUR_API_KEY
```

### Search with Boolean Operators

```bash
# Articles about AI but not cryptocurrency
GET https://gnews.io/api/v4/search?q=AI%20NOT%20cryptocurrency&lang=en&max=10&apikey=YOUR_API_KEY

# Articles about either ChatGPT or GPT-4
GET https://gnews.io/api/v4/search?q=ChatGPT%20OR%20GPT-4&lang=en&max=10&apikey=YOUR_API_KEY
```

---

## Running the Ingestor

### Prerequisites

- [Deno](https://deno.land/) installed
- GNews API key set in `.env` file or environment variable

### Run Command

```bash
# With .env file
deno run --allow-net --allow-env --env gnews_ingestor.ts

# Or with inline env var
GNEWS_API_KEY="your_key" deno run --allow-net --allow-env gnews_ingestor.ts
```

### Expected Output

```
Fetching top 5 technology headlines from GNews API...

Found 1247 total results, returning 5 articles

================================================================================
TOP 5 TECHNOLOGY HEADLINES
================================================================================

[1] OpenAI Launches GPT-5 with Revolutionary Capabilities
    Source: TechCrunch
    Published: 2025-12-05T10:30:00Z
    URL: https://techcrunch.com/...
    Description: OpenAI today announced the release of GPT-5...

[2] Google Announces Gemini 2.0 Advanced
    Source: The Verge
    Published: 2025-12-05T09:15:00Z
    URL: https://www.theverge.com/...
    Description: Google is launching Gemini 2.0 Advanced...

[...]
```

---

## Rate Limits & Best Practices

### Rate Limits

- **Free tier:** 100 requests/day
- **Basic tier:** 10,000 requests/day
- **Professional tier:** 100,000 requests/day
- **Enterprise tier:** Custom limits
- **Exceeded limit response:** `429 Too Many Requests`

### Best Practices

**✅ DO:**
- Cache responses to minimize requests
- Use `max` parameter efficiently (default is 10, max is 100 for paid plans)
- Use specific search parameters to get relevant results
- Handle error responses gracefully
- Store API keys in environment variables (never in code)
- Use Boolean operators for precise searches
- Filter by `lang` and `country` for targeted results
- Use `from`/`to` dates to narrow results

**❌ DON'T:**
- Make requests more than necessary (use caching)
- Use free tier for commercial projects (violates TOS)
- Expose your API key in public repositories
- Exceed rate limits (implement backoff strategy)
- Make overly broad searches without filters

---

## Error Handling

### Common Error Responses

| Status Code | Meaning |
|------------|---------|
| `200` | Request successful |
| `400` | Bad Request - Invalid parameters |
| `401` | Unauthorized - Invalid or missing API key |
| `403` | Forbidden - Account suspended or commercial use on free tier |
| `429` | Too Many Requests - Rate limit exceeded |
| `500` | Internal Server Error |

### Example Error Response

```json
{
  "errors": [
    "Invalid API key. Please check your API key and try again."
  ]
}
```

---

## Comparison with Other APIs

| Feature | GNews API | News API | NewsData.io | Hacker News |
|---------|:---------:|:--------:|:-----------:|:-----------:|
| **Format** | JSON REST | JSON REST | JSON REST | JSON |
| **Auth** | API Key | API Key | API Key | None |
| **Free Tier** | 100/day | 100/day | 200/day | Unlimited |
| **Commercial (Free)** | ❌ | ❌ | ✅ | ✅ |
| **Commercial (Paid)** | $9+/mo | $449+/mo | $49+/mo | N/A |
| **Sources** | 60,000+ | 150,000+ | 1,000+ | 1 |
| **Categories** | 9 | 7 | 11 | Tech only |
| **Languages** | 60+ | Limited | 50+ | English |
| **Countries** | 150+ | 50+ | 100+ | Global |
| **Boolean Search** | ✅ | ❌ | ❌ | ❌ |
| **Historical Data** | ✅ | 1 month | Paid only | Full history |
| **Search** | ✅ | ✅ | ✅ | ❌ |
| **Best For** | Affordable commercial | Dev/testing | Commercial free tier | Tech discussions |

### Key Considerations

1. ❌ **Free tier = non-commercial only** - Commercial use requires $9+/month
2. ✅ **Affordable pricing** - Much cheaper than News API ($9 vs $449/month)
3. ✅ **Large source coverage** - 60,000+ sources worldwide
4. ✅ **Boolean search** - Advanced search with AND, OR, NOT operators
5. ✅ **Multi-language/country** - 60+ languages, 150+ countries
6. ✅ **Google News powered** - Rankings based on Google News
7. ⚠️ **Free tier limits** - Only 10 results max on free tier (100 on paid)

### When to Use GNews API

**Use GNews API if:**
- You need affordable commercial news access ($9/month)
- You need Boolean search capabilities
- You want Google News rankings
- You need multi-language/country support
- Budget-conscious commercial project

**Consider alternatives if:**
- You need free commercial use → Use **NewsData.io** or **Dev.to**
- You need tech-specific discussions → Use **Hacker News**
- You're just testing/developing → **News API** or **NewsData.io** free tiers work
- You need 150K+ sources → Use **News API** (paid)

---

## License & Commercial Use

### Account Termination

⚠️ **IMPORTANT:** If abuse of the free tier terms is detected (e.g., using free tier for commercial projects), your account will be terminated.

### Image Copyright

GNews API declines all responsibility if you use the data illegally. Note that images may be copyrighted by their respective publishers.

### Fair Use

Always respect publisher copyright and terms of service when using articles retrieved from GNews API.

---

## Official Resources

| Resource | URL |
|----------|-----|
| **Website** | https://gnews.io |
| **Documentation** | https://gnews.io/docs |
| **Register** | https://gnews.io/register |
| **Pricing** | https://gnews.io/pricing |
| **Terms of Service** | https://gnews.io/terms |
| **API Status** | Check dashboard |

---

## Summary

- **Best for:** Affordable commercial news aggregation with Boolean search
- **Cost:** Free for non-commercial (100 requests/day), $9+/month for commercial
- **Commercial:** ❌ NOT allowed on free tier, requires paid plan
- **Format:** JSON REST API
- **Auth:** API key required
- **Categories:** 9 categories (General, World, Nation, Business, Technology, Entertainment, Sports, Science, Health)
- **Search:** ✅ Boolean operators (AND, OR, NOT), field filtering
- **Sources:** 60,000+ worldwide
- **Languages:** 60+ languages
- **Countries:** 150+ countries
- **Rate limits:** 100/day free, 10K-100K/day paid
- **Historical data:** ✅ Available on all tiers
- **Key advantage:** Most affordable commercial option with advanced Boolean search
- **Key limitation:** Free tier restricted to non-commercial use only, max 10 results on free tier
