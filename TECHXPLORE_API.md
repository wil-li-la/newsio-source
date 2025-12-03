# TechXplore RSS Feed Documentation

## What is TechXplore?

TechXplore is a leading technology and engineering news website providing daily updates on scientific breakthroughs, innovations, and emerging technologies. It covers topics including electronics, nanotechnology, robotics, artificial intelligence, space exploration, and more.

## Base URL
```
https://techxplore.com/rss-feed/
```

## Access Method

TechXplore provides news through an **RSS feed** (XML format), not a REST API. This means:
- No authentication required
- Simple XML parsing needed
- Updates published as they occur
- Free to access

## RSS Feed Structure

### Available Fields in Each Item

| Field | Type | Always Present? | Description |
|-------|------|----------------|-------------|
| `title` | string | ✅ Yes | Article headline |
| `description` | string | ✅ Yes | Article summary/excerpt |
| `link` | string | ✅ Yes | Full article URL |
| `pubDate` | string | ✅ Yes | Publication date (RFC 822 format) |
| `guid` | string | ✅ Yes | Unique identifier |

### ❌ NOT Available in RSS Feed

**Important:** TechXplore RSS feed does **NOT** include:
- Popularity metrics (views, likes, shares)
- Comment counts
- Trending/popular article indicators
- User engagement data

**Articles are sorted chronologically (newest first), NOT by popularity.**



## License & Commercial Use

### Can I use TechXplore RSS feed for business/commercial purposes?

**YES, with attribution!** ✅

TechXplore's RSS feed is provided free of charge for both **personal AND commercial use**.

#### What you CAN do:
- ✅ Use the RSS feed for commercial applications
- ✅ Integrate TechXplore news into your business platform
- ✅ Build aggregators, newsletters, or content platforms
- ✅ Display articles in apps or websites

#### What you MUST do:
- **Include attribution to TechXplore.com** - This is required
- **Link back to the full article** on TechXplore
- **Do not remove credit to TechXplore.com**

#### What you CANNOT do:
- ❌ Alter, modify, or appropriate content beyond limited use
- ❌ Remove TechXplore.com attribution
- ❌ Present content as your own

#### Terms of Service Quote:
> "TechXplore provides its News Feed Services at no charge for both personal and commercial use on an 'as-is' basis. Content may not be altered, modified or appropriated beyond limited use. Credit to TechXplore.com must not be removed, and use of RSS and XML content must include credit to TechXplore.com."

### Rate Limits & Best Practices

**Rate Limits:**
- No explicit rate limit mentioned in TOS
- RSS feeds are designed for periodic polling
- Recommended: Poll every 15-30 minutes

**Best Practices:**
- Cache articles to avoid redundant fetches
- Use conditional GET requests (If-Modified-Since header)
- Set a reasonable User-Agent header
- Handle XML parsing errors gracefully
- Always include attribution when displaying content

### Attribution Format

When displaying TechXplore content, use:

```
Article Title
Article description/excerpt...

Source: TechXplore.com
[Link to full article]
```

Or inline:

```
"Article title" - TechXplore.com [link]
```

## Contact Information

**Website:** https://techxplore.com

**About Page:** https://techxplore.com/about/

**Contact:** Available through their website

**RSS Feed:** https://techxplore.com/rss-feed/


## Key Differences from Other News APIs

| Feature | TechXplore | Hacker News | NewsAPI |
|---------|-----------|-------------|---------|
| **Access** | RSS feed (XML) | Firebase API (JSON) | REST API (JSON) |
| **Auth** | None | None | API Key |
| **Commercial** | ✅ Free with attribution | ✅ Free (MIT) | 💰 $449/mo |
| **Comments** | ❌ No | ✅ Yes | ❌ No |
| **Rate Limit** | Reasonable use | Good citizenship | Tier-based |
| **Format** | XML | JSON | JSON |

## Implementation Notes

### XML Parsing Strategy

1. **Regex-based parsing:** Simple for RSS feeds (structured XML)
2. **CDATA handling:** Some fields may contain `<![CDATA[...]]>` wrappers
3. **HTML entities:** Decode `&quot;`, `&amp;`, etc.
4. **Tag extraction:** Use regex patterns to extract content



### Full Article Access

The RSS feed only provides article **summaries**. To get the full article text:
1. Follow the `link` field to the article page
2. Parse the HTML content
3. Extract the article body

**Note:** Scraping full articles may have additional restrictions. Stick to RSS summaries for commercial use or contact TechXplore for licensing full content.

## Summary

- **Best for:** Technology and engineering news aggregation
- **Cost:** Free with attribution
- **Commercial:** ✅ Allowed
- **Format:** RSS/XML
- **Comments:** ❌ Not available in feed
- **Rate limits:** Reasonable polling (15-30 min intervals)
- **Attribution:** **Required** - Must credit TechXplore.com

[1] Can AI ever be funny? Some comedians embrace AI tools but they're still running the show
    Published: Wed, 03 Dec 2025 10:07:49 EST
    Link: https://techxplore.com/news/2025-12-ai-funny-comedians-embrace-tools.html
    Description: A baby and his family dog sit across from each other in a podcast studio....

[2] India rolls back order to preinstall cybersecurity app on smartphones
    Published: Wed, 03 Dec 2025 10:00:01 EST
    Link: https://techxplore.com/news/2025-12-india-preinstall-cybersecurity-app-smartphones.html
    Description: India's telecoms ministry on Wednesday rolled back its order for smartphone manufacturers to preinst...

[3] A new era beyond gas refrigerants: Magnetic cooling technology offers eco-friendly alternative
    Published: Wed, 03 Dec 2025 09:53:35 EST
    Link: https://techxplore.com/news/2025-12-era-gas-refrigerants-magnetic-cooling.html
    Description: A research team at the Korea Institute of Materials Science (KIMS) has successfully developed Korea'...

[4] New defense system for transport smart-tech could save lives
    Published: Wed, 03 Dec 2025 09:42:50 EST
    Link: https://techxplore.com/news/2025-12-defense-smart-tech.html
    Description: A new system for detecting unusual and potentially harmful data sharing between in-vehicle smart-tec...

[5] Ahead of new game release, 'Animal Crossing: New Horizons' book reflects on comfort, community, and capitalism
    Published: Wed, 03 Dec 2025 09:32:06 EST
    Link: https://techxplore.com/news/2025-12-game-animal-horizons-comfort-community.html
    Description: Remember Animal Crossing: New Horizons? During the height of its popularity during the COVID-19 pand...

[6] Taming chaos in neural networks: A biologically plausible way
    Published: Wed, 03 Dec 2025 09:30:25 EST
    Link: https://techxplore.com/news/2025-12-chaos-neural-networks-biologically-plausible.html
    Description: A new framework that causes artificial neural networks to mimic how real neural networks operate in ...

[7] Electric vehicle high-nickel batteries: Fundamental cause of performance degradation identified
    Published: Wed, 03 Dec 2025 09:14:36 EST
    Link: https://techxplore.com/news/2025-12-electric-vehicle-high-nickel-batteries.html
    Description: High-nickel batteries, which are high-energy lithium-ion batteries primarily used in electric vehicl...

[8] New robotic eyeball could enhance visual perception of embodied AI
    Published: Wed, 03 Dec 2025 07:50:01 EST
    Link: https://techxplore.com/news/2025-12-robotic-eyeball-visual-perception-embodied.html
    Description: Embodied artificial intelligence (AI) systems are robotic agents that rely on machine learning algor...

[9] How AI is quietly reshaping your shopping trip
    Published: Wed, 03 Dec 2025 07:24:33 EST
    Link: https://techxplore.com/news/2025-12-ai-quietly-reshaping.html
    Description: From the recommendations on a store's app to the prices flashing on digital shelf labels, artificial...

[10] Building better, building beautiful: Novel method allows more architects to design attractive gridshell structures
    Published: Wed, 03 Dec 2025 07:00:03 EST
    Link: https://techxplore.com/news/2025-12-beautiful-method-architects-gridshell.html
    Description: A researcher from the University of Tokyo and a U.S.-based structural engineer developed a new compu...

[11] In Data Center Alley, AI sows building boom, doubts
    Published: Wed, 03 Dec 2025 04:30:01 EST
    Link: https://techxplore.com/news/2025-12-center-alley-ai-boom.html
    Description: As planes make their final approach to Washington DC's Dulles Airport, just below lies Ashburn, a to...

[12] What are 'rare earths' for?
    Published: Wed, 03 Dec 2025 04:23:07 EST
    Link: https://techxplore.com/news/2025-12-rare-earths.html
    Description: Crucial for making smartphones, fighter jets and electric cars, "rare earth" metals have become a st...

[13] Chinese smart glasses firms eye overseas conquest
    Published: Wed, 03 Dec 2025 04:20:47 EST
    Link: https://techxplore.com/news/2025-12-chinese-smart-glasses-firms-eye.html
    Description: In China, AI glasses let the wearer pay in shops with just a glance at a QR code and a voice command...

[14] Australia's national AI plan has just been released. Who exactly will benefit?
    Published: Wed, 03 Dec 2025 00:40:01 EST
    Link: https://techxplore.com/news/2025-12-australia-national-ai-benefit.html
    Description: Today, the Albanese Labor government released the long-awaited National AI Plan, "a whole-of-governm...

[15] High-speed rail moves millions throughout the world every day, but in the US its future is bumpy
    Published: Tue, 02 Dec 2025 20:30:01 EST
    Link: https://techxplore.com/news/2025-12-high-rail-millions-world-day.html
    Description: High-speed rail systems are found all over the globe. Japan's bullet train began operating in 1964. ...
