# Dev.to (Forem) API Documentation

## What is Dev.to?

Dev.to is a community platform for software developers to share articles, tutorials, and discussions about programming, web development, DevOps, and technology. It's powered by Forem, an open-source platform (AGPL v3 licensed) that enables anyone to create their own developer community.

## Base URL
```
https://dev.to/api/
```

## Authentication

Most endpoints are **public and don't require authentication**. However, some actions (creating posts, liking, etc.) require an API key.

### Getting an API Key (Optional)

1. Sign up at https://dev.to
2. Go to Settings → Account → DEV Community API Keys
3. Generate a new API key
4. Use in header: `api-key: YOUR_API_KEY`

**Note:** API key is NOT required for reading articles and comments (the primary use case for news aggregation).

## Endpoints

### 1. List Articles

**Endpoint:** `GET /api/articles`

**Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `page` | number | Page number (default: 1) | `2` |
| `per_page` | number | Results per page (max: 1000, default: 30) | `10` |
| `tag` | string | Filter by tag | `javascript` |
| `tags` | string | Filter by multiple tags (comma-separated) | `javascript,webdev` |
| `tags_exclude` | string | Exclude tags | `beginners` |
| `username` | string | Filter by author username | `ben` |
| `state` | string | Article state (`fresh`, `rising`, `all`) | `rising` |
| `top` | number | Top articles by time period (7, 30, 365, infinity) | `7` |
| `collection_id` | number | Filter by collection ID | `1` |



## Response Structure

### Article Object

```json
{
  "type_of": "article",
  "id": 123456,
  "title": "Understanding Async/Await in JavaScript",
  "description": "A deep dive into modern asynchronous JavaScript...",
  "readable_publish_date": "Dec 3",
  "slug": "understanding-async-await-javascript-1a2b",
  "path": "/ben/understanding-async-await-javascript-1a2b",
  "url": "https://dev.to/ben/understanding-async-await-javascript-1a2b",
  "comments_count": 42,
  "public_reactions_count": 523,
  "positive_reactions_count": 523,
  "published_timestamp": "2025-12-03T10:30:00Z",
  "cover_image": "https://dev.to/uploads/articles/...",
  "tag_list": ["javascript", "webdev", "tutorial"],
  "tags": "javascript, webdev, tutorial",
  "reading_time_minutes": 8,
  "user": {
    "name": "Ben Halpern",
    "username": "ben",
    "twitter_username": "bendhalpern",
    "github_username": "benhalpern",
    "profile_image": "https://dev.to/uploads/user/...",
    "profile_image_90": "https://dev.to/uploads/user/..."
  }
}
```

### Available Fields

| Field | Type | Always Present? | Description |
|-------|------|----------------|-------------|
| `id` | number | ✅ Yes | Unique article ID |
| `title` | string | ✅ Yes | Article title |
| `description` | string | ✅ Yes | Article summary |
| `url` | string | ✅ Yes | Full article URL |
| `published_timestamp` | string | ✅ Yes | ISO 8601 timestamp |
| `comments_count` | number | ✅ Yes | Number of comments |
| `positive_reactions_count` | number | ✅ Yes | Number of reactions (likes) |
| `tag_list` | array | ✅ Yes | Array of tags |
| `reading_time_minutes` | number | ✅ Yes | Estimated reading time |
| `user` | object | ✅ Yes | Author information |
| `body_html` | string | ⚠️ Sometimes | Full HTML content (only in single article endpoint) |
| `body_markdown` | string | ⚠️ Sometimes | Full Markdown content (only in single article endpoint) |
| `cover_image` | string | ⚠️ Sometimes | Cover image URL |

## License & Commercial Use

### Can I use Dev.to API for business/commercial purposes?

**YES, likely allowed!** ✅ (with confirmation recommended)

Dev.to is built on Forem, which is open-source (AGPL v3). The API is public and designed for community integration.

#### What you CAN do:
- ✅ Use the API for commercial applications
- ✅ Build aggregators, newsletters, or content platforms
- ✅ Integrate Dev.to articles into your platform
- ✅ Create mobile apps or browser extensions
- ✅ Use for analytics and research

#### What you MUST do:
- **Attribute Dev.to** - Mention the content source
- **Link back** - Provide links to original articles
- **Follow rate limits** - Respect API usage guidelines
- **Confirm for large-scale use** - Contact yo@forem.com for clarity

#### Rate Limits & Best Practices

**Rate Limits:**
- **30 requests per 30 seconds** for certain endpoints
- No official global rate limit documented
- CORS enabled for public endpoints



### Forem Open-Source License

Forem (the platform powering Dev.to) is licensed under **AGPL v3**, which is a copyleft license. This applies to:
- ✅ The Forem platform code itself
- ✅ Self-hosted Forem instances
- ❌ NOT the content on Dev.to (user-generated content)

**Key points:**
- Dev.to's **API data** (articles, comments) can be used commercially
- If you use Forem's **source code** to build your own platform, you must open-source your changes (AGPL requirement)
- Using the **API** to access data is NOT the same as using the source code

## Contact Information

**Website:** https://dev.to

**API Documentation:** https://developers.forem.com/api

**Forem Platform:** https://www.forem.com

**Support/Questions:** yo@forem.com

**GitHub:** https://github.com/forem/forem

**Licensing Info:** https://developers.forem.com/licensing



## Comparison with Other Developer News Sources

| Feature | Dev.to | Hacker News | GitHub Trending | TechXplore |
|---------|--------|-------------|-----------------|-----------|
| **Format** | JSON REST API | JSON Firebase | HTML scraping | XML RSS |
| **Auth** | Optional | None | None | None |
| **Commercial** | ✅ Yes (likely) | ✅ Yes | ✅ Yes | ✅ Yes |
| **Comments** | ✅ Yes (nested) | ✅ Yes (nested) | ❌ No | ❌ No |
| **Rate Limit** | 30 req/30s | None | Scraping | Polling |
| **Content Type** | Dev articles | Tech discussions | Code repos | Tech news |
| **Community** | Developers | Tech/startups | Developers | General public |
| **Reactions** | ✅ Yes | ✅ Yes (votes) | ✅ Yes (stars) | ❌ No |

## Key Advantages

1. **Nested comments** - Similar to Hacker News, supports threaded discussions
2. **Reactions system** - See popular content by reaction count
3. **Rich metadata** - Tags, reading time, cover images
4. **Developer focus** - Tutorials, how-tos, and technical deep dives
5. **No API key required** - Read articles and comments without authentication
6. **Active community** - Regular high-quality content from developers worldwide

## Implementation Notes

### Filtering by Popularity

```typescript
// Get top articles from last 7 days
const url = 'https://dev.to/api/articles?top=7&per_page=10';

// Get trending JavaScript articles
const url = 'https://dev.to/api/articles?tag=javascript&state=rising&per_page=10';

// Get fresh articles (latest)
const url = 'https://dev.to/api/articles?state=fresh&per_page=10';
```




## Summary

- **Best for:** Developer tutorials, how-tos, and technical discussions
- **Cost:** Free (no API key needed for reading)
- **Commercial:** ✅ Likely allowed (confirm with yo@forem.com for large-scale)
- **Format:** JSON REST API
- **Comments:** ✅ Yes (nested, like HN)
- **Rate limits:** 30 requests per 30 seconds
- **Key advantage:** Rich developer content with nested comments and reactions
- **Community:** Active, helpful developer community

## Example:
```
etching up to 10 comments...
Formatting 3 comments...
title: string
text: string
comments: string
================================================================================
TITLE:
A step-by-step guide to fine-tuning MedGemma for breast tumor classification

================================================================================
TEXT:
Disclaimer: This guide is for informational and educational purposes only and is not a...

Author: Shir Meir Lador (@shirmeirlador)
Published: Dec 2
Reading time: 14 min
Tags: healthcare, gemini, machinelearning, ai
Reactions: 113
URL: https://dev.to/googleai/a-step-by-step-guide-to-fine-tuning-medgemma-for-breast-tumor-classification-35af

================================================================================
COMMENTS:
[glenn_trojan_1e79e881c2b7]: Wow

---

[aussiearef]: Amazing!

---

[sylwia-lask]: Beautiful piece — I love reading about how modern technologies are used to help people ❤️ And you always end up learning a bit more about ML, like LoRA or fine-tuning 😊

```