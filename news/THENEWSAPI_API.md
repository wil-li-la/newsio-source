# The News API Documentation

## What is The News API?

The News API (thenewsapi.com) is a **fast, cost-effective REST API for accessing live and historical news articles** from over 40,000 sources worldwide. It provides real-time news data with state-of-the-art caching technology for exceptional response times.

### Key Features
- 📰 **40,000+ news sources worldwide**
- 🔄 **Real-time breaking news**
- 📊 **10 categories** (general, science, sports, business, health, entertainment, tech, politics, food, travel)
- 🌐 **35+ languages supported**
- 🌍 **50+ countries/locales**
- 🔍 **Advanced search operators** (AND, OR, NOT, phrases, wildcards)
- 📈 **1 million+ articles added weekly**
- 🆓 **100 requests/day free** (for non-commercial use only)

---

## ⚠️ Commercial Use Restrictions

### Can I use The News API for commercial projects?

**FREE TIER: NO** ❌
The free plan is for **personal, non-commercial use only** according to their Terms of Service. Commercial use on the free tier is prohibited unless specifically endorsed or approved by The News API.

**PAID TIER: YES** ✅
Commercial use requires a paid subscription.

### Pricing Plans

| Plan | Price/Month | Daily Requests | Articles per Request | Commercial Use |
|------|------------:|---------------:|---------------------:|:--------------:|
| **Free** | $0 | 100 | 3 | ❌ No (approval required) |
| **Basic** | $9 | 2,500 | 25 | ✅ Yes |
| **Standard** | $49 | 10,000 | 100 | ✅ Yes |
| **Pro** | $79 | 25,000 | 200 | ✅ Yes |
| **Enterprise** | Custom | Custom | Custom | ✅ Yes |

*Annual billing available with 20% discount. Prices current as of December 2025.*

---

## Authentication

The News API requires an **API token** for all requests.

### 🔑 Getting an API Token

1. **Sign up** at [thenewsapi.com](https://www.thenewsapi.com/)
2. **Verify your email** address
3. **Get your API token** from the [dashboard](https://www.thenewsapi.com/account/dashboard)
4. **Set environment variable:**

```bash
# .env file
THENEWS_API_KEY=your_api_token_here

# Or export in terminal
export THENEWS_API_KEY="your_api_token_here"
```

### Free Tier Limits

| Feature | Limit |
|---------|-------|
| **Requests per day** | 100 |
| **Articles per request** | 3 (max) |
| **Commercial use** | ❌ **Not allowed** (personal use only) |
| **Historical data** | ✅ Available |
| **Top stories** | ✅ Available |
| **All endpoints** | ✅ Available (except Headlines) |

---

## API Endpoints

### 1. 📰 Top Stories

**Base URL:** `https://api.thenewsapi.com/v1/news/top`

**Description:** Access live and historical top stories around the world.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `api_token` | string | ✅ | Your API token | `abc123...` |
| `locale` | string | ❌ | Country code (ISO 3166-1) | `us` |
| `language` | string | ❌ | Language code (ISO 639-1) | `en` |
| `categories` | string | ❌ | Comma-separated categories | `tech,science` |
| `source_ids` | string | ❌ | Comma-separated source IDs | `techcrunch,wired` |
| `domains` | string | ❌ | Comma-separated domains | `techcrunch.com,wired.com` |
| `exclude_domains` | string | ❌ | Exclude specific domains | `example.com` |
| `published_before` | string | ❌ | Date/time filter (ISO 8601 or YYYY-MM-DD) | `2025-12-05T12:00:00` |
| `published_after` | string | ❌ | Date/time filter (ISO 8601 or YYYY-MM-DD) | `2025-12-01` |
| `published_on` | string | ❌ | Specific date (YYYY-MM-DD) | `2025-12-05` |
| `limit` | number | ❌ | Number of results (max based on plan) | `5` |
| `page` | number | ❌ | Page number for pagination | `1` |

**Example Request:**
```bash
GET https://api.thenewsapi.com/v1/news/top?api_token=YOUR_API_TOKEN&locale=us&language=en&categories=tech&limit=5
```

### 2. 🔍 All News

**Base URL:** `https://api.thenewsapi.com/v1/news/all`

**Description:** Search all live and historical articles with advanced filtering.

**Parameters:**

All parameters from **Top Stories** endpoint, plus:

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `search` | string | ❌ | Advanced search query | `artificial intelligence` |
| `search_fields` | string | ❌ | Fields to search in | `title,description` |

**Search Operators:**
- `+` or `AND` - Both terms must appear: `AI +ethics` or `AI AND ethics`
- `|` or `OR` - Either term can appear: `ChatGPT|GPT-4` or `ChatGPT OR GPT-4`
- `-` or `NOT` - Exclude term: `-cryptocurrency` or `NOT cryptocurrency`
- `"..."` - Exact phrase: `"machine learning"`
- `*` - Prefix wildcard: `tech*` matches technology, technical, etc.
- `(...)` - Grouping: `(AI OR "machine learning") +ethics`

**Example Request:**
```bash
GET https://api.thenewsapi.com/v1/news/all?api_token=YOUR_API_TOKEN&search=AI+ethics&categories=tech&language=en&limit=10
```

### 3. 📑 Headlines

**Base URL:** `https://api.thenewsapi.com/v1/news/headlines`

**Description:** Latest headlines by category with similar articles.

**Availability:** Standard plan and above only

**Parameters:** Same as Top Stories endpoint

### 4. 🔗 Similar News

**Base URL:** `https://api.thenewsapi.com/v1/news/similar/{uuid}`

**Description:** Find articles similar to a specific article.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `api_token` | string | ✅ | Your API token | `abc123...` |
| `uuid` | string | ✅ | Article UUID (in path) | `e3b0c442-98fc...` |
| `limit` | number | ❌ | Number of results | `10` |

**Example Request:**
```bash
GET https://api.thenewsapi.com/v1/news/similar/e3b0c442-98fc?api_token=YOUR_API_TOKEN&limit=10
```

### 5. 📄 News by UUID

**Base URL:** `https://api.thenewsapi.com/v1/news/uuid/{uuid}`

**Description:** Retrieve a specific article by its unique identifier.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `api_token` | string | ✅ | Your API token | `abc123...` |
| `uuid` | string | ✅ | Article UUID (in path) | `e3b0c442-98fc...` |

**Example Request:**
```bash
GET https://api.thenewsapi.com/v1/news/uuid/e3b0c442-98fc?api_token=YOUR_API_TOKEN
```

### 6. 📚 Sources

**Base URL:** `https://api.thenewsapi.com/v1/news/sources`

**Description:** Discover news sources to filter in other requests.

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `api_token` | string | ✅ | Your API token | `abc123...` |
| `categories` | string | ❌ | Filter by categories | `tech` |
| `language` | string | ❌ | Filter by language | `en` |
| `locale` | string | ❌ | Filter by country | `us` |
| `limit` | number | ❌ | Number of results (max 50) | `50` |

**Example Request:**
```bash
GET https://api.thenewsapi.com/v1/news/sources?api_token=YOUR_API_TOKEN&categories=tech&language=en&limit=50
```

---

## Available Categories

The News API supports **10 categories**:

```
general
science
sports
business
health
entertainment
tech
politics
food
travel
```

---

## Supported Languages

The News API supports **35+ languages** using ISO 639-1 codes:

**Popular Languages:**
- `en` - English
- `es` - Spanish
- `fr` - French
- `de` - German
- `it` - Italian
- `pt` - Portuguese
- `nl` - Dutch
- `ru` - Russian
- `zh` - Chinese
- `ja` - Japanese
- `ko` - Korean
- `ar` - Arabic
- `hi` - Hindi
- `tr` - Turkish
- `pl` - Polish

---

## Supported Countries/Locales

The News API supports **50+ countries** using ISO 3166-1 alpha-2 codes:

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
- `mx` - Mexico
- `es` - Spain
- `it` - Italy

---

## Response Structure

### Standard Response

All endpoints return a similar structure:

```json
{
  "meta": {
    "found": 3542,
    "returned": 5,
    "limit": 5,
    "page": 1
  },
  "data": [...]
}
```

### Article Object Fields

| Field | Type | Always Present? | Description |
|-------|------|:---------------:|-------------|
| `uuid` | string | ✅ | Unique article identifier |
| `title` | string | ✅ | Article headline |
| `description` | string | ✅ | Article summary/excerpt |
| `keywords` | string | ✅ | Comma-separated keywords |
| `snippet` | string | ✅ | Short text snippet |
| `url` | string | ✅ | Direct URL to article |
| `image_url` | string \| null | ✅ | URL to article image |
| `language` | string | ✅ | Language code |
| `published_at` | string | ✅ | Publication time (UTC, ISO 8601) |
| `source` | string | ✅ | Source domain name |
| `categories` | array | ✅ | Array of category strings |
| `relevance_score` | number \| null | ✅ | Relevance score (when search used) |
| `locale` | string | ✅ | Country/locale code |

### Example Response

```json
{
  "meta": {
    "found": 1247,
    "returned": 5,
    "limit": 5,
    "page": 1
  },
  "data": [
    {
      "uuid": "e3b0c442-98fc-1c14-9afb-4c8996fb92427",
      "title": "OpenAI Launches GPT-5 with Revolutionary Capabilities",
      "description": "OpenAI today announced the release of GPT-5, marking a significant leap in AI capabilities.",
      "keywords": "AI, OpenAI, GPT-5, artificial intelligence",
      "snippet": "OpenAI today announced the release of GPT-5...",
      "url": "https://techcrunch.com/openai-gpt5-launch",
      "image_url": "https://techcrunch.com/images/gpt5.jpg",
      "language": "en",
      "published_at": "2025-12-05T10:30:00.000000Z",
      "source": "techcrunch.com",
      "categories": ["tech", "business"],
      "relevance_score": null,
      "locale": "us"
    }
  ]
}
```

**Note:** The API only provides article snippets and links, not full article content.

---

## Example Usage

### Get Top 5 Tech Stories (US)

```bash
GET https://api.thenewsapi.com/v1/news/top?api_token=YOUR_API_TOKEN&categories=tech&locale=us&language=en&limit=5
```

### Search for "AI" Articles in Tech

```bash
GET https://api.thenewsapi.com/v1/news/all?api_token=YOUR_API_TOKEN&search=artificial+intelligence&categories=tech&language=en&limit=10
```

### Advanced Search with Boolean Operators

```bash
# Articles about AI and ethics, but not cryptocurrency
GET https://api.thenewsapi.com/v1/news/all?api_token=YOUR_API_TOKEN&search=(AI+OR+"artificial+intelligence")+AND+ethics+NOT+cryptocurrency&categories=tech&language=en&limit=10
```

### Get Tech News from Last 7 Days

```bash
GET https://api.thenewsapi.com/v1/news/all?api_token=YOUR_API_TOKEN&categories=tech&published_after=2025-11-28&language=en&limit=10
```

### Get Tech News Sources

```bash
GET https://api.thenewsapi.com/v1/news/sources?api_token=YOUR_API_TOKEN&categories=tech&language=en&limit=50
```

---

## Running the Ingestor

### Prerequisites

- [Deno](https://deno.land/) installed
- The News API token set in `.env` file or environment variable

### Run Command

```bash
# With .env file
deno run --allow-net --allow-env --env thenewsapi_ingestor.ts

# Or with inline env var
THENEWS_API_KEY="your_token" deno run --allow-net --allow-env thenewsapi_ingestor.ts
```

### Expected Output

```
Fetching top 5 technology headlines from The News API...

Found 1247 total results, returning 5 articles

================================================================================
TOP 5 TECHNOLOGY HEADLINES
================================================================================

[1] OpenAI Launches GPT-5 with Revolutionary Capabilities
    Source: techcrunch.com
    Published: 2025-12-05T10:30:00.000000Z
    URL: https://techcrunch.com/...
    Description: OpenAI today announced the release of GPT-5...

[2] Google Announces Gemini 2.0 Advanced
    Source: theverge.com
    Published: 2025-12-05T09:15:00.000000Z
    URL: https://www.theverge.com/...
    Description: Google is launching Gemini 2.0 Advanced...

[...]
```

---

## Rate Limits & Best Practices

### Rate Limits

- **Free tier:** 100 requests/day, 3 articles per request
- **Basic tier:** 2,500 requests/day, 25 articles per request
- **Standard tier:** 10,000 requests/day, 100 articles per request
- **Pro tier:** 25,000 requests/day, 200 articles per request
- **Rate limiting:** 429 error if too many requests in 60 seconds
- **Max pagination:** 20,000 articles total per query

### Best Practices

**✅ DO:**
- Cache responses to minimize requests
- Use `limit` parameter efficiently based on your plan
- Use specific search parameters and categories for relevant results
- Handle error responses gracefully (400, 401, 402, 403, 404, 429)
- Store API tokens in environment variables (never in code)
- Use advanced search operators for precise queries
- Filter by `locale`, `language`, and `categories`
- URL encode special characters in search queries
- Check rate limit headers: `X-RateLimit-Limit`

**❌ DON'T:**
- Make requests more than necessary (use caching)
- Use free tier for commercial projects (violates TOS)
- Expose your API token in public repositories
- Exceed rate limits (implement backoff strategy)
- Request more than your plan's articles-per-request limit
- Make overly broad searches without filters
- Attempt to paginate beyond 20,000 results

---

## Error Handling

### Common Error Responses

| Status Code | Error Type | Meaning |
|------------|------------|---------|
| `200` | Success | Request successful |
| `400` | `malformed_parameters` | Invalid parameter formatting |
| `401` | `invalid_api_token` | Invalid or missing API token |
| `402` | `usage_limit_reached` | Daily/monthly plan limit exceeded |
| `403` | `endpoint_access_restricted` | Feature unavailable on your plan |
| `404` | `resource_not_found` | Article/resource doesn't exist |
| `429` | `rate_limit_reached` | Too many requests in 60 seconds |
| `500` | Server Error | Internal server error |

### Example Error Response

```json
{
  "error": {
    "code": "invalid_api_token",
    "message": "The API token provided is invalid. Please check your token and try again."
  }
}
```

---

## Comparison with Other APIs

| Feature | The News API | News API | GNews API | NewsData.io |
|---------|:------------:|:--------:|:---------:|:-----------:|
| **Format** | JSON REST | JSON REST | JSON REST | JSON REST |
| **Auth** | API Token | API Key | API Key | API Key |
| **Free Tier** | 100/day | 100/day | 100/day | 200/day |
| **Free Tier Articles** | 3 per request | 100 per request | 10 per request | Varies |
| **Commercial (Free)** | ❌ | ❌ | ❌ | ✅ |
| **Commercial (Paid)** | $9+/mo | $449+/mo | $9+/mo | $49+/mo |
| **Sources** | 40,000+ | 150,000+ | 60,000+ | 1,000+ |
| **Categories** | 10 | 7 | 9 | 11 |
| **Languages** | 35+ | Limited | 60+ | 50+ |
| **Countries** | 50+ | 50+ | 150+ | 100+ |
| **Boolean Search** | ✅ | ❌ | ✅ | ❌ |
| **Historical Data** | ✅ | 1 month | ✅ | Paid only |
| **Full Content** | ❌ (snippets) | ❌ (200 chars) | ✅ | ✅ |
| **Search** | ✅ | ✅ | ✅ | ✅ |
| **Best For** | Affordable commercial | Dev/testing | Affordable + Boolean search | Free commercial |

### Key Considerations

1. ❌ **Free tier = non-commercial only** - Commercial use requires $9+/month
2. ✅ **Cost-effective pricing** - Tied with GNews as most affordable ($9/mo)
3. ✅ **Large source coverage** - 40,000+ sources worldwide
4. ✅ **Advanced search** - Boolean operators (AND, OR, NOT, wildcards, phrases)
5. ✅ **Fast response times** - State-of-the-art caching technology
6. ✅ **All features on free tier** - Top stories, historical data, all endpoints (except Headlines)
7. ⚠️ **Limited articles on free tier** - Only 3 articles per request (vs 100 on News API)
8. ⚠️ **Snippets only** - Full article content not provided

### When to Use The News API

**Use The News API if:**
- You need affordable commercial news access ($9/month)
- You want advanced Boolean search capabilities
- You need fast response times (state-of-the-art caching)
- Budget-conscious commercial project
- You're okay with article snippets (not full content)

**Consider alternatives if:**
- You need free commercial use → Use **NewsData.io**
- You need more articles per request on free tier → Use **News API** (100 vs 3)
- You need full article content → Use **GNews API** or **NewsData.io**
- You need tech-specific discussions → Use **Hacker News**
- You need 150K+ sources → Use **News API** (paid)

---

## License & Commercial Use

### ⚠️ Important TOS Requirements

According to The News API Terms of Service:
- Free tier is for **personal, non-commercial use only**
- Commercial use requires specific endorsement/approval OR paid subscription
- Violating TOS may result in account termination

### Content Usage

- Articles contain copyrighted content from publishers
- Only snippets and links are provided (not full articles)
- Respect publisher copyright and terms of service
- All text data is UTF-8 encoded
- All dates are in UTC (GMT)

---

## Official Resources

| Resource | URL |
|----------|-----|
| **Website** | https://www.thenewsapi.com |
| **Documentation** | https://www.thenewsapi.com/documentation |
| **Dashboard** | https://www.thenewsapi.com/account/dashboard |
| **Pricing** | https://www.thenewsapi.com/pricing |
| **FAQ** | https://www.thenewsapi.com/faq |
| **Terms of Service** | https://www.thenewsapi.com/tos |

---

## Summary

- **Best for:** Affordable commercial news with fast response times and Boolean search
- **Cost:** Free for non-commercial (100 requests/day), $9+/month for commercial
- **Commercial:** ❌ NOT allowed on free tier, requires paid plan or approval
- **Format:** JSON REST API
- **Auth:** API token required
- **Categories:** 10 categories (general, science, sports, business, health, entertainment, tech, politics, food, travel)
- **Search:** ✅ Boolean operators (AND, OR, NOT, wildcards, phrases), field targeting
- **Sources:** 40,000+ worldwide
- **Languages:** 35+ languages
- **Countries:** 50+ countries/locales
- **Rate limits:** 100/day free (3 articles max), 2.5K-25K/day paid (25-200 articles max)
- **Historical data:** ✅ Available on all tiers
- **Content:** Article snippets and links only (not full content)
- **Key advantage:** Fast, affordable commercial option with advanced Boolean search and caching
- **Key limitation:** Free tier for non-commercial use only, only 3 articles per request on free tier, snippets only
