# arXiv API Documentation

## What is arXiv?

arXiv (pronounced "archive") is a free distribution service and an open-access archive for scholarly articles in physics, mathematics, computer science, quantitative biology, quantitative finance, statistics, electrical engineering, systems science, and economics. It's operated by Cornell University and contains over 2 million research papers.

## Base URL
```
http://export.arxiv.org/api/query
```

## Authentication

**None required** - arXiv API is completely free and open to the public.

## API Request Format

### Query Parameters

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `search_query` | string | Search query (see Query Construction below) | `cat:cs.AI` |
| `id_list` | string | Comma-separated list of arXiv IDs | `2301.12345,2302.67890` |
| `start` | number | Index of first result (0-indexed, default: 0) | `0` |
| `max_results` | number | Number of results to return (default: 10) | `5` |
| `sortBy` | string | Sort order: `relevance`, `lastUpdatedDate`, `submittedDate` | `submittedDate` |
| `sortOrder` | string | `ascending` or `descending` (default: descending) | `descending` |

### Query Construction

arXiv uses a simple query language:

```
# Search by category
cat:cs.AI

# Search by author
au:LeCun

# Search in title
ti:transformer

# Search in abstract
abs:neural+network

# Combine with AND
cat:cs.LG+AND+ti:transformer

# Combine with OR
cat:cs.AI+OR+cat:cs.LG

# Use AND NOT
cat:cs.AI+ANDNOT+cat:cs.LG
```

### Example API Calls

```bash
# Get 5 latest AI papers
http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending

# Get 10 machine learning papers sorted by relevance
http://export.arxiv.org/api/query?search_query=cat:cs.LG&max_results=10&sortBy=relevance

# Search for papers by a specific author
http://export.arxiv.org/api/query?search_query=au:Hinton&max_results=5

# Search for "GPT" in title
http://export.arxiv.org/api/query?search_query=ti:GPT&max_results=5

# Get a specific paper by ID
http://export.arxiv.org/api/query?id_list=2301.12345
```

## Response Format

The API returns data in **Atom XML** format (not JSON).

### Entry Structure

Each paper is represented as an `<entry>` element:

```xml
<entry>
  <id>http://arxiv.org/abs/2301.12345v1</id>
  <updated>2023-01-28T10:30:00Z</updated>
  <published>2023-01-25T18:00:00Z</published>
  <title>Attention Is All You Need</title>
  <summary>We propose a new simple network architecture...</summary>
  <author>
    <name>Ashish Vaswani</name>
  </author>
  <author>
    <name>Noam Shazeer</name>
  </author>
  <arxiv:comment>15 pages, 5 figures</arxiv:comment>
  <link href="http://arxiv.org/abs/2301.12345v1" rel="alternate" type="text/html"/>
  <link title="pdf" href="http://arxiv.org/pdf/2301.12345v1" rel="related" type="application/pdf"/>
  <arxiv:primary_category term="cs.CL"/>
  <category term="cs.CL"/>
  <category term="cs.LG"/>
  <arxiv:doi>10.1234/example.doi</arxiv:doi>
  <arxiv:journal_ref>Journal of Machine Learning Research, 2023</arxiv:journal_ref>
</entry>
```

## Available Fields for Each Paper

| Field | Type | Always Present? | Description |
|-------|------|----------------|-------------|
| `id` | string | ✅ Yes | Unique arXiv identifier URL |
| `title` | string | ✅ Yes | Paper title |
| `summary` | string | ✅ Yes | Abstract/summary of the paper |
| `published` | string | ✅ Yes | Original submission date (ISO 8601) |
| `updated` | string | ✅ Yes | Last update date (ISO 8601) |
| `authors` | array | ✅ Yes | List of author names |
| `categories` | array | ✅ Yes | All subject categories |
| `primaryCategory` | string | ✅ Yes | Primary subject category |
| `pdfUrl` | string | ✅ Yes | Direct link to PDF |
| `htmlUrl` | string | ✅ Yes | Link to abstract page |
| `doi` | string | ⚠️ Sometimes | Digital Object Identifier (if published) |
| `journalRef` | string | ⚠️ Sometimes | Journal reference (if published) |
| `comment` | string | ⚠️ Sometimes | Author comments (e.g., "15 pages, 5 figures") |

## arXiv Categories

arXiv papers are organized into categories. Here are the major categories:

### Computer Science (cs)

| Code | Category Name |
|------|--------------|
| `cs.AI` | Artificial Intelligence |
| `cs.LG` | Machine Learning |
| `cs.CV` | Computer Vision and Pattern Recognition |
| `cs.CL` | Computation and Language (NLP) |
| `cs.NE` | Neural and Evolutionary Computing |
| `cs.RO` | Robotics |
| `cs.CR` | Cryptography and Security |
| `cs.DS` | Data Structures and Algorithms |
| `cs.DC` | Distributed, Parallel, and Cluster Computing |
| `cs.DB` | Databases |
| `cs.SE` | Software Engineering |
| `cs.PL` | Programming Languages |
| `cs.HC` | Human-Computer Interaction |
| `cs.IT` | Information Theory |
| `cs.AR` | Hardware Architecture |
| `cs.SY` | Systems and Control |

### Mathematics (math)

| Code | Category Name |
|------|--------------|
| `math.CO` | Combinatorics |
| `math.NA` | Numerical Analysis |
| `math.OC` | Optimization and Control |
| `math.PR` | Probability |
| `math.ST` | Statistics Theory |
| `math.LO` | Logic |
| `math.NT` | Number Theory |
| `math.AG` | Algebraic Geometry |

### Physics

| Code | Category Name |
|------|--------------|
| `physics.comp-ph` | Computational Physics |
| `physics.data-an` | Data Analysis, Statistics and Probability |
| `quant-ph` | Quantum Physics |
| `cond-mat.stat-mech` | Statistical Mechanics |
| `hep-th` | High Energy Physics - Theory |
| `astro-ph.CO` | Cosmology and Nongalactic Astrophysics |

### Other Fields

| Code | Category Name |
|------|--------------|
| `stat.ML` | Machine Learning (Statistics) |
| `stat.ME` | Methodology (Statistics) |
| `q-bio.QM` | Quantitative Methods (Biology) |
| `q-bio.NC` | Neurons and Cognition |
| `q-fin.CP` | Computational Finance |
| `econ.EM` | Econometrics |
| `eess.IV` | Image and Video Processing |
| `eess.SP` | Signal Processing |

**Full list:** https://arxiv.org/category_taxonomy

## Rate Limits & Best Practices

### Rate Limits

- **3 seconds minimum** between API calls (recommended)
- **Max 1 request per second** sustained
- Bulk downloading is allowed but should be done responsibly
- Use `max_results` wisely (start small, paginate if needed)

### Best Practices

1. **Identify yourself** - Set a User-Agent header with your email
2. **Cache results** - Don't repeatedly request the same data
3. **Use pagination** - Use `start` and `max_results` for large queries
4. **Respect rate limits** - Wait at least 3 seconds between requests
5. **Handle errors gracefully** - Implement retry logic with exponential backoff

## License & Commercial Use

### Can I use arXiv data for business/commercial purposes?

**YES! ✅**

arXiv content is available under various open licenses:

#### What you CAN do:
- ✅ Download and use papers for research
- ✅ Build commercial applications using arXiv data
- ✅ Create aggregators, search engines, or recommendation systems
- ✅ Use for machine learning training data
- ✅ Analyze papers for insights and trends
- ✅ Build citation networks and bibliometric tools

#### What you MUST do:
- **Respect author copyrights** - Individual papers may have different licenses
- **Attribute arXiv** - Acknowledge arXiv as the source
- **Link to original** - Provide links to the original arXiv entries
- **Follow rate limits** - Don't overload the servers
- **Check paper licenses** - Most are CC BY, CC BY-SA, or CC BY-NC

#### Paper Licenses

Most papers on arXiv use Creative Commons licenses:
- **CC BY** (Attribution) - Free to use, even commercially
- **CC BY-SA** (Share-Alike) - Must share derivatives under same license
- **CC BY-NC** (Non-Commercial) - Cannot be used commercially
- **Public Domain** - No restrictions
- **arXiv license** - Default license allowing non-commercial redistribution

Always check the license of individual papers!

## Contact Information

**Website:** https://arxiv.org

**API Documentation:** https://info.arxiv.org/help/api/index.html

**Terms of Use:** https://info.arxiv.org/help/api/tou.html

**Support:** https://info.arxiv.org/help/contact.html

**Bulk Access:** https://info.arxiv.org/help/bulk_data.html

## Comparison with Other Academic Sources

| Feature | arXiv | Google Scholar | PubMed | Semantic Scholar |
|---------|-------|----------------|--------|------------------|
| **API** | ✅ Free XML | ❌ No official API | ✅ Free JSON | ✅ Free JSON |
| **Commercial** | ✅ Yes | ⚠️ TOS unclear | ✅ Yes | ✅ Yes |
| **Full Text** | ✅ Yes (PDFs) | ❌ Links only | ⚠️ Sometimes | ⚠️ Sometimes |
| **Preprints** | ✅ Yes | ✅ Yes | ⚠️ Limited | ✅ Yes |
| **Fields** | STEM focused | All fields | Medicine/Bio | CS/Bio focused |
| **Rate Limit** | 1 req/sec | N/A | 3 req/sec | 100 req/5min |
| **Citations** | ⚠️ Limited | ✅ Yes | ✅ Yes | ✅ Yes |

## Key Advantages

1. **Free and open** - No API key required, completely free
2. **Full-text access** - Direct access to PDF files
3. **Preprints** - Latest research before peer review
4. **STEM focus** - Strong coverage of CS, math, physics
5. **Fast updates** - Papers posted within hours of submission
6. **Stable IDs** - Permanent identifiers for papers
7. **Clean metadata** - Well-structured author, category, and abstract data

## Implementation Notes

### TypeScript/Deno Example

```typescript
// Fetch 5 latest AI papers
const url = 'http://export.arxiv.org/api/query?search_query=cat:cs.AI&start=0&max_results=5&sortBy=submittedDate&sortOrder=descending';

const response = await fetch(url);
const xmlText = await response.text();

// Parse XML (use DOMParser or regex)
// Extract <entry> elements for each paper
```


## Summary

- **Best for:** Academic research papers, preprints, STEM fields
- **Cost:** Free (no API key needed)
- **Commercial:** ✅ Yes (check individual paper licenses)
- **Format:** Atom XML
- **Rate limits:** Max 1 request per second
- **Key advantage:** Free access to full-text PDFs of cutting-edge research
- **Coverage:** 2M+ papers in physics, math, CS, and related fields
- **Update frequency:** Daily (papers posted throughout the day)


## Example

```
Title: Fast &amp; Efficient Normalizing Flows and Applications of Image Generative Models
Authors: Sandeep Nagar
Published: 12/4/2025
Primary Category: cs.CV
All Categories: cs.CV, cs.AI, cs.LG

Abstract:
This thesis presents novel contributions in two primary areas: advancing the efficiency of generative models, particularly normalizing flows, and applying generative models to solve real-world computer vision challenges. The first part introduce significant improvements to normalizing flow architectures through six key innovations: 1) Development of invertible 3x3 Convolution layers with mathematically proven necessary and sufficient conditions for invertibility, (2) introduction of a more efficient Quad-coupling layer, 3) Design of a fast and efficient parallel inversion algorithm for kxk convolutional layers, 4) Fast &amp; efficient backpropagation algorithm for inverse of convolution, 5) Using inverse of convolution, in Inverse-Flow, for the forward pass and training it using proposed backpropagation algorithm, and 6) Affine-StableSR, a compact and efficient super-resolution model that leverages pre-trained weights and Normalizing Flow layers to reduce parameter count while maintaining performance. The second part: 1) An automated quality assessment system for agricultural produce using Conditional GANs to address class imbalance, data scarcity and annotation challenges, achieving good accuracy in seed purity testing; 2) An unsupervised geological mapping framework utilizing stacked autoencoders for dimensionality reduction, showing improved feature extraction compared to conventional methods; 3) We proposed a privacy preserving method for autonomous driving datasets using on face detection and image inpainting; 4) Utilizing Stable Diffusion based image inpainting for replacing the detected face and license plate to advancing privacy-preserving techniques and ethical considerations in the field.; and 5) An adapted diffusion model for art restoration that effectively handles multiple types of degradation through unified fine-tuning.

===================

Sandeep Nagar built faster normalizing-flow models and applied them to seed testing, geological mapping, safe-driving image privacy, and art repair, improving accuracy and efficiency across these industries.

Fields: AgriTech, Geospatial Mapping, Autonomous Driving Safety, Cultural Heritage, Generative AI

Signals:
1. Efficiency Breakthrough in Normalizing Flows
2. Cross-Domain Practical Impact
3. Privacy-Preserving Vision Emerges as a Priority

```