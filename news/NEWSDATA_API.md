# NewsData.io API Documentation



## What is NewsData.io?

NewsData.io is a **news aggregation API service** that provides access to real-time and historical news articles from **thousands of sources worldwide**. It's designed for developers building news applications, analytics platforms, and content aggregation services.

### Key Features
- 🌍 **1,000+ global news sources**
- 🔄 **Real-time updates**
- 📊 **Category filtering** (technology, business, sports, etc.)
- 🌐 **Multi-language support**
- 💰 **Commercial use allowed on free tier**
- 🆓 **200 requests/day free**



## Authentication

NewsData.io requires an **API key** for all requests.

### 🔑 Getting an API Key

1. **Sign up** at [newsdata.io/register](https://newsdata.io/register)
2. **Get your free API key** from the dashboard
3. **Set environment variable:**

```bash
# .env file
NEWSDATA_API_KEY=pub_xxxxxxxxxxxxx

# Or export in terminal
export NEWSDATA_API_KEY="pub_xxxxxxxxxxxxx"
```

### Free Tier Limits

| Feature | Limit |
|---------|-------|
| **Requests per day** | 200 |
| **Results per request** | 10 (max) |
| **Commercial use** | ✅ Allowed |
| **Historical data** | ❌ No (paid plans only) |

---

## API Endpoints

### 📰 Latest News

**Endpoint:** `GET /news`

**Parameters:**

| Parameter | Type | Required | Description | Example |
|-----------|------|:--------:|-------------|---------|
| `apikey` | string | ✅ | Your API key | `pub_xxxxx` |
| `category` | string | ❌ | Filter by category | `technology` |
| `language` | string | ❌ | Filter by language | `en` |
| `country` | string | ❌ | Filter by country | `us` |
| `q` | string | ❌ | Search keywords | `artificial intelligence` |
| `qInTitle` | string | ❌ | Keywords in title only | `AI` |
| `size` | number | ❌ | Number of results (1-10) | `5` |
| `page` | string | ❌ | Pagination token | `next_page_token` |

### Available Categories

```
business, entertainment, environment, food, health, politics,
science, sports, technology, top, world
```

---


### Available Fields

| Field | Type | Always Present? | Description |
|-------|------|:---------------:|-------------|
| `article_id` | string | ✅ | Unique article identifier |
| `title` | string | ✅ | Article headline |
| `link` | string | ✅ | Full article URL |
| `pubDate` | string | ✅ | Publication date (YYYY-MM-DD HH:MM:SS) |
| `source_id` | string | ✅ | Source identifier (e.g., "techcrunch") |
| `language` | string | ✅ | Language code (e.g., "en") |
| `description` | string | ⚠️ | Article summary |
| `content` | string | ⚠️ | Full text (limited on free tier) |
| `creator` | array | ⚠️ | Author names |
| `keywords` | array | ⚠️ | Article keywords/tags |
| `category` | array | ⚠️ | Article categories |
| `country` | array | ⚠️ | Country codes |
| `image_url` | string | ⚠️ | Featured image URL |
| `video_url` | string | ⚠️ | Video URL if available |

---



### Run Command

```bash
# With .env file
deno run --allow-net --allow-env --env newsdata_ingestor.ts

# Or with inline env var
NEWSDATA_API_KEY="your_key" deno run --allow-net --allow-env newsdata_ingestor.ts
```

---

## License & Commercial Use

### ✅ Can I use NewsData.io for business/commercial purposes?

**YES, even on the free tier!**

NewsData.io explicitly allows commercial use on all plans, including the free tier.

#### What you CAN do:
- ✅ Use the API for commercial applications
- ✅ Build paid products/services using NewsData.io data
- ✅ Integrate news into your business platform
- ✅ Create aggregators, newsletters, or content platforms
- ✅ Use for AI training and analytics

#### Pricing Plans

| Plan | Price | Daily Requests | Results/Request | Commercial |
|------|------:|---------------:|----------------:|:----------:|
| **Free** | $0 | 200 | 10 | ✅ |
| **Basic** | $49/mo | 10,000 | 50 | ✅ |
| **Professional** | $249/mo | 50,000 | 50 | ✅ |
| **Enterprise** | Custom | Unlimited | Unlimited | ✅ |

*Note: Prices are approximate. Check [newsdata.io/pricing](https://newsdata.io/pricing) for current rates.*

---

## Rate Limits & Best Practices

### Rate Limits

- **Free tier:** 200 requests/day
- **Reset time:** Daily at 00:00 UTC
- **Exceeded limit response:** `429 Too Many Requests`

### Best Practices

**✅ DO:**
- Cache API responses to minimize requests
- Use the `size` parameter efficiently (get only what you need)
- Use pagination (`nextPage` token) for browsing multiple articles
- Filter by category, language, or country to get relevant results
- Monitor your daily usage in the [dashboard](https://newsdata.io/dashboard)
- Handle 429 errors gracefully with exponential backoff

**❌ DON'T:**
- Make excessive requests (stay within daily limits)
- Request more results than needed
- Ignore error responses
- Store API keys in code (use environment variables)


## Comparison with Other APIs

| Feature | NewsData.io | TechXplore | Hacker News | NewsAPI.org |
|---------|:-----------:|:----------:|:-----------:|:-----------:|
| **Format** | JSON REST | XML RSS | JSON | JSON REST |
| **Auth** | API Key | None | None | API Key |
| **Free Tier** | 200/day | Unlimited | Unlimited | 100/day |
| **Commercial (Free)** | ✅ | ✅ | ✅ | ❌ |
| **Commercial (Paid)** | $49+/mo | N/A | N/A | $449/mo |
| **Tech Filter** | ✅ | ✅ | ✅ | ✅ |
| **Comments** | ❌ | ❌ | ✅ | ❌ |
| **Historical Data** | Paid only | ❌ | ✅ | Paid only |
| **Sources** | 1,000s | 1 | Community | 100,000+ |

### Key Advantages

1. ✅ **Commercial use on free tier** - Unlike NewsAPI.org ($449/mo)
2. ✅ **Multiple sources** - Aggregates TechCrunch, Wired, Engadget, etc.
3. ✅ **Proper REST API** - JSON responses, easy integration
4. ✅ **Real-time updates** - News published as it happens
5. ✅ **Category filtering** - Easy tech news filtering
6. ✅ **Reasonable free tier** - 200 requests/day sufficient for many use cases

---

## Example Output

### Sample API Response (5 Articles)

```
================================================================================
ALL TECH NEWS ARTICLES (5 items):
================================================================================

[1] CORRECTING and REPLACING GitLab Reports Third Quarter Fiscal Year 2026 Financial Results
    Source: businesswire
    Published: 2025-12-03 03:19:00
    Link: https://www.businesswire.com/...
    Description: SAN FRANCISCO--(BUSINESS WIRE)--In the Fourth Quarter...

[2] The AI imperative: Why transactional relationships are obsolete in the new tech ecosystem
    Source: e27
    Published: 2025-12-03 03:18:34
    Link: https://e27.co/...
    Description: The Southeast Asian tech ecosystem is at an inflection point...
    Keywords: artificial intelligence, echelon, e27 partnerships, startups

[3] Cooler Master's new COSMOS ALPHA case: full-tower beast with 400mm GPU support
    Source: tweaktown
    Published: 2025-12-03 03:18:02
    Link: https://www.tweaktown.com/...
    Description: Cooler Master intros new COSMOS ALPHA massive flagship tower...

[4] Altman declares 'code red', urges staff to speed up improvements to ChatGPT
    Source: business-standard
    Published: 2025-12-03 03:18:01
    Link: https://www.business-standard.com/...
    Description: Altman on Monday sent an internal memo calling for a "surge"...

[5] Hack of the day: Check your provident fund (PF) balance instantly
    Source: toi
    Published: 2025-12-03 03:17:41
    Link: https://timesofindia.indiatimes.com/...
    Description: The Times of India's 'Hack of the Day' series offers...
    Keywords: epf balance check, check pf balance, employee provident fund
```

---

## Contact & Resources

### Official Links

| Resource | URL |
|----------|-----|
| **Website** | https://newsdata.io |
| **Documentation** | https://newsdata.io/documentation |
| **Pricing** | https://newsdata.io/pricing |
| **Dashboard** | https://newsdata.io/dashboard |
| **Support** | support@newsdata.io |
| **Register** | https://newsdata.io/register |

---

## Summary

- **Best for:** Real-time news aggregation from multiple sources
- **Cost:** Free tier with 200 requests/day
- **Commercial:** ✅ Allowed on free tier
- **Format:** JSON REST API
- **Auth:** API key required
- **Tech filtering:** ✅ Category-based filtering
- **Comments:** ❌ Not available
- **Rate limits:** 200/day free, paid plans available
- **Key advantage:** Commercial use on free tier + thousands of sources

