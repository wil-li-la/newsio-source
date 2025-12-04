# GitHub Trending Documentation

## What is GitHub Trending?

GitHub Trending is a daily-updated list of the most popular repositories on GitHub, showcasing projects gaining the most stars, forks, and attention from the developer community. It's an excellent way to discover innovative open-source projects, emerging technologies, and popular developer tools.

## Base URL
```
https://github.com/trending
```

## Access Method

GitHub Trending **does not have an official API**. However, the data can be accessed through:

1. **Web Scraping** - Parse the HTML from the trending page (recommended for simplicity)
2. **Unofficial APIs** - Third-party services that scrape and provide JSON APIs
3. **GitHub GraphQL API** - Limited trending data available

This documentation focuses on **web scraping**, which is the most straightforward approach.

## Available Filters

You can filter trending repositories by:

| Filter | URL Parameter | Example |
|--------|--------------|---------|
| Time Range | `?since=` | `daily`, `weekly`, `monthly` |
| Language | `/[language]` | `/typescript`, `/python`, `/rust` |
| Spoken Language | `?spoken_language_code=` | `en`, `zh`, `ja` |

**Examples:**
- `https://github.com/trending` - Today's trending (all languages)
- `https://github.com/trending?since=weekly` - This week's trending
- `https://github.com/trending/typescript` - Trending TypeScript repos
- `https://github.com/trending/python?since=monthly` - Trending Python repos (monthly)

## Data Structure

Each trending repository typically contains:

| Field | Type | Description |
|-------|------|-------------|
| `author` | string | Repository owner/organization |
| `name` | string | Repository name |
| `url` | string | Full GitHub URL |
| `description` | string | Repository description |
| `language` | string | Primary programming language |
| `stars` | number | Total star count |
| `forks` | number | Total fork count |
| `todayStars` | number | Stars gained today/this period |
| `contributors` | array | Top contributors (avatars) |




## License & Commercial Use

### Can I use GitHub Trending data for business/commercial purposes?

**YES, with reasonable use!** ✅

GitHub's public trending page data can be scraped and used commercially under these conditions:

#### What you CAN do:
- ✅ Scrape the public trending page for commercial applications
- ✅ Build developer tools, newsletters, or aggregation services
- ✅ Display trending repositories in your platform
- ✅ Use for analytics and research
- ✅ Create mobile apps or browser extensions

#### What you MUST do:
- **Respect rate limits** - Don't hammer the server with excessive requests
- **Set a User-Agent** - Identify your bot/application
- **Cache data** - Update periodically (e.g., every 1-6 hours)
- **Follow robots.txt** - Check GitHub's crawling rules
- **Attribute GitHub** - Mention data source when appropriate

#### What you SHOULD NOT do:
- ❌ Make excessive requests (> 1 request per minute)
- ❌ Use the data to impersonate GitHub services
- ❌ Violate GitHub's Terms of Service
- ❌ Scrape private repositories or user data without permission

### GitHub's Terms of Service

GitHub's [Terms of Service](https://docs.github.com/en/site-policy/github-terms/github-terms-of-service) allow reasonable scraping of public data, but you should:
- Not disrupt GitHub's services
- Not use bots that consume excessive resources
- Follow the [GitHub Acceptable Use Policies](https://docs.github.com/en/site-policy/acceptable-use-policies/github-acceptable-use-policies)

### Rate Limits & Best Practices

**Recommended Rate Limits:**
- **Web scraping:** 1 request per 1-10 minutes
- **Caching:** Store results for 1-6 hours
- **User-Agent:** Always set a descriptive User-Agent

## Comparison with Other Tech News Sources

| Feature | GitHub Trending | Hacker News | TechXplore | Dev.to |
|---------|----------------|-------------|-----------|--------|
| **Format** | HTML scraping | JSON API | RSS/XML | JSON API |
| **Auth** | None | None | None | Optional |
| **Commercial** | ✅ Yes (reasonable use) | ✅ Yes | ✅ Yes | ✅ Yes |
| **Comments** | ❌ No (in trending) | ✅ Yes | ❌ No | ✅ Yes |
| **Rate Limit** | Scraping limits | None | Polling | 30 req/30s |
| **Update Frequency** | Daily | Real-time | Real-time | Real-time |
| **Data Type** | Developer projects | Tech discussions | Tech news | Dev articles |

## Key Advantages

1. **Discover trending developer tools** - See what developers are building
2. **Free to access** - No API key or payment required
3. **Daily updates** - Fresh content every day
4. **Language filters** - Focus on specific technologies
5. **Open-source focus** - All projects are publicly accessible
6. **Developer community** - Curated by GitHub's massive community

## Implementation Notes

### Web Scraping Challenges

1. **HTML Structure Changes** - GitHub may update their HTML, breaking your parser
2. **No Official API** - Scraping is a workaround, not an official method
3. **Parsing Complexity** - Extracting data from HTML requires regex or parsing libraries


---

## Summary

- **Best for:** Discovering trending developer projects and tools
- **Cost:** Free (no API key needed)
- **Commercial:** ✅ Allowed with reasonable use
- **Format:** HTML (web scraping required)
- **Comments:** ❌ Not available in trending list
- **Rate limits:** Self-imposed (1 request per 1-10 minutes recommended)
- **Cache:** Store results for 1-6 hours
- **Key advantage:** Direct insight into what developers are building and using

## Example
```
================================================================================
ALL TRENDING REPOSITORIES (5 items):
================================================================================

[1] traefik/traefik
    Language: Go
    Stars: 60,076
    Stars today: 109
    URL: https://github.com/traefik/traefik
    Description: The Cloud Native Application Proxy

[2] bobeff/open-source-games
    Language: Unknown
    Stars: 9,993
    Stars today: 282
    URL: https://github.com/bobeff/open-source-games
    Description: A list of open source games.

[3] milvus-io/milvus
    Language: Go
    Stars: 41,304
    Stars today: 112
    URL: https://github.com/milvus-io/milvus
    Description: Milvus is a high-performance, cloud-native vector database built for scalable vector ANN search

[4] jj-vcs/jj
    Language: Rust
    Stars: 22,719
    Stars today: 15
    URL: https://github.com/jj-vcs/jj
    Description: A Git-compatible VCS that is both simple and powerful

[5] serverless-dns/serverless-dns
    Language: JavaScript
    Stars: 3,239
    Stars today: 8
    URL: https://github.com/serverless-dns/serverless-dns
    Description: The RethinkDNS resolver that deploys to Cloudflare Workers, Deno Deploy, Fastly, and Fly.io
```