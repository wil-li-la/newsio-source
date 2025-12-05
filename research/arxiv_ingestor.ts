#!/usr/bin/env -S deno run --allow-net
/**
 * arXiv Research Paper Ingestor (TypeScript/Deno)
 * Fetches top 5 recent research papers from arXiv API
 * arXiv is a free distribution service for scholarly articles
 */

interface ArxivEntry {
  id: string;
  updated: string;
  published: string;
  title: string;
  summary: string;
  authors: string[];
  categories: string[];
  primaryCategory: string;
  pdfUrl: string;
  htmlUrl: string;
  doi?: string;
  journalRef?: string;
  comment?: string;
}

interface PaperData {
  id: string;
  title: string;
  summary: string;
  authors: string;
  published: string;
  updated: string;
  categories: string;
  primaryCategory: string;
  pdfUrl: string;
  htmlUrl: string;
  doi?: string;
  journalRef?: string;
  comment?: string;
}

/**
 * Parse XML response from arXiv API
 */
function parseArxivXML(xmlText: string): ArxivEntry[] {
  const entries: ArxivEntry[] = [];

  // Match all <entry> blocks
  const entryRegex = /<entry>([\s\S]*?)<\/entry>/g;
  const entryMatches = xmlText.matchAll(entryRegex);

  for (const entryMatch of entryMatches) {
    const entryXml = entryMatch[1];

    // Extract ID
    const idMatch = entryXml.match(/<id>(.*?)<\/id>/);
    const id = idMatch ? idMatch[1].trim() : '';

    // Extract updated
    const updatedMatch = entryXml.match(/<updated>(.*?)<\/updated>/);
    const updated = updatedMatch ? updatedMatch[1].trim() : '';

    // Extract published
    const publishedMatch = entryXml.match(/<published>(.*?)<\/published>/);
    const published = publishedMatch ? publishedMatch[1].trim() : '';

    // Extract title
    const titleMatch = entryXml.match(/<title>([\s\S]*?)<\/title>/);
    const title = titleMatch ? titleMatch[1].replace(/\s+/g, ' ').trim() : '';

    // Extract summary
    const summaryMatch = entryXml.match(/<summary>([\s\S]*?)<\/summary>/);
    const summary = summaryMatch ? summaryMatch[1].replace(/\s+/g, ' ').trim() : '';

    // Extract all authors
    const authorRegex = /<author>[\s\S]*?<name>(.*?)<\/name>[\s\S]*?<\/author>/g;
    const authorMatches = entryXml.matchAll(authorRegex);
    const authors: string[] = [];
    for (const authorMatch of authorMatches) {
      authors.push(authorMatch[1].trim());
    }

    // Extract all categories
    const categoryRegex = /<category term="(.*?)"[^>]*>/g;
    const categoryMatches = entryXml.matchAll(categoryRegex);
    const categories: string[] = [];
    for (const catMatch of categoryMatches) {
      categories.push(catMatch[1].trim());
    }

    // Extract primary category
    const primaryCatMatch = entryXml.match(/<arxiv:primary_category[^>]+term="(.*?)"/);
    const primaryCategory = primaryCatMatch ? primaryCatMatch[1].trim() : (categories[0] || '');

    // Extract PDF URL
    const pdfMatch = entryXml.match(/<link[^>]+title="pdf"[^>]+href="(.*?)"/);
    const pdfUrl = pdfMatch ? pdfMatch[1].trim() : '';

    // Extract HTML URL (abstract page)
    const htmlMatch = entryXml.match(/<link[^>]+title="html"[^>]+href="(.*?)"/);
    const htmlUrl = htmlMatch ? htmlMatch[1].trim() : id;

    // Extract DOI (optional)
    const doiMatch = entryXml.match(/<arxiv:doi[^>]*>(.*?)<\/arxiv:doi>/);
    const doi = doiMatch ? doiMatch[1].trim() : undefined;

    // Extract journal reference (optional)
    const journalRefMatch = entryXml.match(/<arxiv:journal_ref[^>]*>(.*?)<\/arxiv:journal_ref>/);
    const journalRef = journalRefMatch ? journalRefMatch[1].trim() : undefined;

    // Extract comment (optional)
    const commentMatch = entryXml.match(/<arxiv:comment[^>]*>(.*?)<\/arxiv:comment>/);
    const comment = commentMatch ? commentMatch[1].trim() : undefined;

    entries.push({
      id,
      updated,
      published,
      title,
      summary,
      authors,
      categories,
      primaryCategory,
      pdfUrl,
      htmlUrl,
      doi,
      journalRef,
      comment,
    });
  }

  return entries;
}

/**
 * Fetch top 5 research papers from arXiv
 *
 * @param category - arXiv category (e.g., 'cs.AI', 'cs.LG', 'physics.comp-ph')
 * @param maxResults - Number of papers to fetch (default: 5)
 * @param sortBy - Sort order: 'relevance', 'lastUpdatedDate', 'submittedDate'
 */
async function getTopPapers(
  category: string = 'cs.AI',
  maxResults: number = 5,
  sortBy: 'relevance' | 'lastUpdatedDate' | 'submittedDate' = 'submittedDate'
): Promise<PaperData[]> {
  console.log(`Fetching top ${maxResults} papers from arXiv (category: ${category})...`);

  // Build arXiv API query
  const baseUrl = 'http://export.arxiv.org/api/query';
  const searchQuery = `cat:${category}`;
  const url = `${baseUrl}?search_query=${encodeURIComponent(searchQuery)}&start=0&max_results=${maxResults}&sortBy=${sortBy}&sortOrder=descending`;

  try {
    const response = await fetch(url);

    if (!response.ok) {
      console.error(`HTTP error: ${response.status}`);
      return [];
    }

    const xmlText = await response.text();
    const entries = parseArxivXML(xmlText);

    console.log(`Found ${entries.length} papers\n`);

    // Convert to PaperData format
    const papers: PaperData[] = entries.map(entry => ({
      id: entry.id,
      title: entry.title,
      summary: entry.summary,
      authors: entry.authors.join(', '),
      published: entry.published,
      updated: entry.updated,
      categories: entry.categories.join(', '),
      primaryCategory: entry.primaryCategory,
      pdfUrl: entry.pdfUrl,
      htmlUrl: entry.htmlUrl,
      doi: entry.doi,
      journalRef: entry.journalRef,
      comment: entry.comment,
    }));

    return papers;
  } catch (error) {
    console.error('Error fetching arXiv API:', error);
    return [];
  }
}

/**
 * Main function - fetches and displays top 5 papers
 */
async function main() {
  // You can change the category here
  // Examples: 'cs.AI', 'cs.LG', 'cs.CV', 'physics.comp-ph', 'math.CO'
  const papers = await getTopPapers('cs.AI', 5, 'submittedDate');

  if (papers.length === 0) {
    console.log('No papers found');
    return;
  }

  // Display each paper
  papers.forEach((paper, index) => {
    console.log('='.repeat(80));
    console.log(`PAPER ${index + 1}:`);
    console.log('='.repeat(80));
    console.log(`Title: ${paper.title}`);
    console.log(`Authors: ${paper.authors}`);
    console.log(`Published: ${new Date(paper.published).toLocaleDateString()}`);
    console.log(`Primary Category: ${paper.primaryCategory}`);
    console.log(`All Categories: ${paper.categories}`);
    console.log(`\nAbstract:\n${paper.summary}`);
    console.log(`\nPDF: ${paper.pdfUrl}`);
    console.log(`HTML: ${paper.htmlUrl}`);

    if (paper.doi) {
      console.log(`DOI: ${paper.doi}`);
    }
    if (paper.journalRef) {
      console.log(`Journal Reference: ${paper.journalRef}`);
    }
    if (paper.comment) {
      console.log(`Comment: ${paper.comment}`);
    }
    console.log('\n');
  });

  console.log('='.repeat(80));
  console.log(`Total papers fetched: ${papers.length}`);

  return papers;
}

// Run if this is the main module
if (import.meta.main) {
  main();
}

export { getTopPapers, type PaperData };
