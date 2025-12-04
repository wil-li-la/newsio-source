# Hacker News API Documentation

## What is Hacker News (HN)?

Hacker News is a social news website run by Y Combinator, focusing on computer science, entrepreneurship, and technology. It's one of the most popular tech communities for sharing and discussing tech articles, startups, research, and ideas.

## Base URL
```
https://hacker-news.firebaseio.com/v0/
```

## Item vs Story - Understanding the Hierarchy

**Item** is the generic parent concept - any object in the HN database.

**Story** is a specific type of item (the main posts/links you see on the front page).

### Item Types and Visual Hierarchy

```
Item (generic concept - all objects in HN)
│
├── Story (articles, links, text posts)
│   ├── Comment (discussion on the story)
│   │   └── Comment (reply to comment)
│   │       └── Comment (nested reply)
│   └── Comment (another top-level comment)
│
├── Job (job posting)
│
├── Poll (question with multiple choice)
│   ├── PollOpt (option 1)
│   ├── PollOpt (option 2)
│   └── PollOpt (option 3)
│
└── Comment (can exist independently or as part of a story)
```

### Common Item Fields

Every item (regardless of type) has these fields:
- `id` - Unique identifier
- `type` - One of: "story", "comment", "job", "poll", "pollopt"
- `by` - Username of author
- `time` - Unix timestamp

**Example:** When you call `/item/{id}.json`, you might get back a story, comment, job, or poll depending on what that ID represents. When you call `/topstories.json`, you only get IDs for items where `type = "story"`.

---


### Available Endpoints

| Endpoint | Count | Sorted By | Use Case |
|----------|-------|-----------|----------|
| `/topstories.json` | 500 | HN algorithm (score + time) | Front page stories |
| `/newstories.json` | 500 | Submission time (newest first) | Latest submissions |
| `/beststories.json` | 500 | Score (highest first) | Best recent content |
| `/askstories.json` | 200 | Recency | Community questions |
| `/showstories.json` | 200 | Recency | Community projects |
| `/jobstories.json` | 200 | Recency | Job postings |

---

### 2. Item Details

**Endpoint:** `/item/{id}.json`

**Example (Python):**
```python
import urllib.request, json

# Fetch a story
story_url = 'https://hacker-news.firebaseio.com/v0/item/8863.json'
with urllib.request.urlopen(story_url) as response:
    story = json.loads(response.read())

# Access story fields
print(story['title'])        # "My YC app: Dropbox - Throw away your USB drive"
print(story['score'])        # 111
print(story['by'])           # "dhouston"
print(story['descendants'])  # 71
```

**Example (TypeScript/Deno):**
```typescript
// Fetch a story
const storyUrl = 'https://hacker-news.firebaseio.com/v0/item/8863.json';
const response = await fetch(storyUrl);
const story = await response.json();

// Access story fields
console.log(story.title);        // "My YC app: Dropbox - Throw away your USB drive"
console.log(story.score);        // 111
console.log(story.by);           // "dhouston"
console.log(story.descendants);  // 71
```

---

## Available Keys After Fetching a Story

When you fetch a story using `/item/{id}.json`, here are the keys you can access:

| Key | Type | Always Present? | Description |
|-----|------|----------------|-------------|
| `id` | number | ✅ Yes | Unique story ID |
| `type` | string | ✅ Yes | Always "story" for stories |
| `by` | string | ✅ Yes | Username of author |
| `time` | number | ✅ Yes | Unix timestamp |
| `title` | string | ✅ Yes | Story title |
| `score` | number | ✅ Yes | Points (upvotes) |
| `descendants` | number | ✅ Yes | Total comment count (all levels) |
| `url` | string | ⚠️ Sometimes | External link (not present for Ask HN/text posts) |
| `text` | string | ⚠️ Sometimes | Story text (only for Ask HN, Show HN text posts) |
| `kids` | array | ⚠️ Sometimes | Array of top-level comment IDs (empty if no comments) |
| `deleted` | boolean | ❌ Rare | Only present if story is deleted |
| `dead` | boolean | ❌ Rare | Only present if story is dead/flagged |

### Quick Reference

**Python:**
```python
# Always available
story['id']           # e.g., 8863
story['type']         # "story"
story['by']           # e.g., "dhouston"
story['time']         # e.g., 1175714200
story['title']        # e.g., "My YC app: Dropbox"
story['score']        # e.g., 111
story['descendants']  # e.g., 71

# Use .get() for optional fields
story.get('url', '')         # External URL or empty string
story.get('text', '')        # Story text or empty string
story.get('kids', [])        # Comment IDs or empty list
```

**TypeScript:**
```typescript
// Always available
story.id           // e.g., 8863
story.type         // "story"
story.by           // e.g., "dhouston"
story.time         // e.g., 1175714200
story.title        // e.g., "My YC app: Dropbox"
story.score        // e.g., 111
story.descendants  // e.g., 71

// Optional fields (may be undefined)
story.url || ''         // External URL or empty string
story.text || ''        // Story text or empty string
story.kids || []        // Comment IDs or empty array
```



## License & Commercial Use

### Can I use this API for business/commercial purposes?

**YES!** The Hacker News API is licensed under the **MIT License**, which is a permissive open-source license that explicitly allows commercial use.

#### What you CAN do:
- ✅ Use the API for commercial applications
- ✅ Build paid products/services using HN data
- ✅ Modify, distribute, and sell software that uses this API
- ✅ Integrate HN data into your business analytics
- ✅ Create aggregators, newsletters, or content platforms

#### What you MUST do:
- Include the MIT License copyright notice in your application
- Attribute the Hacker News API properly

#### Rate Limits:
- **No rate limit** currently enforced
- Be respectful with request frequency
- Consider caching data to reduce load

#### Best Practices:
- Cache responses when possible
- Don't hammer the API with excessive requests
- Handle errors gracefully
- Follow the principle of "good netizen" behavior

#### Contact:
For questions or bug reports: **api@ycombinator.com**

**Official Repository & License:** [HackerNews/API on GitHub](https://github.com/HackerNews/API)

---

## Example: Real Story Fetch & Analysis

This example demonstrates how to fetch a story and generate insights from the data.

### Story Fetched

**Story ID:** `46124267`

**Title:** Anthropic acquires Bun

**Text Content:** *(No text content - external link story)*

**Top Comment Excerpt:**
> [dts]: A lot of people seem confused about this acquisition because they think of Bun as a node.js compatible bundler / runtime and just compare it to Deno / npm. But I think its a really smart move if you think of where Bun has been pushing into lately which is a kind of cloud-native self contained runtime (S3 API, SQL, streaming, etc). For an agent like Claude Code this trajectory is really interesting as you are creating a runtime where your agent can work inside of cloud services as fluently as it currently does with a local filesystem. Claude will be able to leverage these capabilities to extend its reach across the cloud and add more value in enterprise use cases...

---

### Analysis Prompt Used

```
Generate one structured summary explaining who did what, why, and result within 30 words.
Generate three signals in bullet points.
```

### Generated Summary

**Anthropic bought Bun to secure a fast cloud-native runtime for Claude Code, keeping Bun open-source and funded.**

### Key Signals Extracted

- AI companies are moving to own their execution runtimes
- The future of AI coding assistants is full-stack, not just LLM-only
- Open-source infra projects without clear monetization paths may exit via AI-driven acquisitions

