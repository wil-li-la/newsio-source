#!/usr/bin/env -S deno run --allow-net --allow-env
/**
 * EU Legislation API Ingestor (TypeScript/Deno)
 * Fetches top 5 recent legislative events from api.epdb.eu
 */

// EUR-Lex Document Interfaces
interface EURLexDirectoryCode {
  directory_code: string;
}

interface EURLexLegalBasis {
  legal_basis: string;
}

interface EURLexRelationship {
  relationship: string;
  relation: string;
  link: string;
}

interface EURLexEurovocDescriptor {
  eurovoc_descriptor: string;
}

interface EURLexSubjectMatter {
  subject_matter: string;
}

interface EURLexDocument {
  doc_id: string;
  form: string;
  title: string;
  api_url: string;
  eurlex_perma_url: string;
  date_document: string;
  of_effect: string;
  end_validity: string;
  oj_date: string;
  directory_codes: EURLexDirectoryCode[];
  legal_basis: EURLexLegalBasis[];
  addressee: string;
  internal_ref: string;
  additional_info: string;
  text_url: string;
  prelex_relation: any[];
  relationships: EURLexRelationship[];
  eurovoc_descriptors: EURLexEurovocDescriptor[];
  subject_matter: EURLexSubjectMatter[];
}

interface EURLexResponse {
  [key: string]: EURLexDocument;
}

// PreLex Document Interfaces
interface PreLexEvent {
  event_id: string;
  doc_id: string;
  event: string;
  date: string;
}

interface PreLexDirectoryCode {
  dir_code_id: string;
  doc_id: string;
  directory_code: string;
}

interface PreLexLegalBasis {
  legal_basis: string;
}

interface PreLexDocument {
  doc_id: string;
  com_number: string;
  api_url: string;
  prelex_perma_url: string;
  eurlex_perma_url: string;
  dg_responsible: string;
  legal_basis: string;
  prelex_procedure: string;
  title: string;
  legislative_type: string;
  commissioner: string;
  adoption_commission: string;
  adoption_council: string;
  events: PreLexEvent[];
  directory_codes: PreLexDirectoryCode[];
  legal_bases_eurlex: PreLexLegalBasis[];
}

interface PreLexResponse {
  [key: string]: PreLexDocument;
}

// Unified output interface
interface EULegislationData {
  id: string;
  title: string;
  type: string;
  date: string;
  source: "EUR-Lex" | "PreLex";
  url: string;
  summary: string;
}

/**
 * Fetch top 5 recent EUR-Lex legislative documents
 */
async function getEURLexDocuments(): Promise<EULegislationData[]> {
  console.log("Fetching top 5 recent EUR-Lex legislative documents...\n");

  const url = "http://api.epdb.eu/eurlex/document/?limit=5&format=json";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`EUR-Lex API request failed: ${response.status} ${response.statusText}`);
  }

  const data: EURLexResponse = await response.json();

  // Transform documents into our unified format
  const documents: EULegislationData[] = Object.values(data).map((doc) => {
    const subjectMatters = doc.subject_matter?.map(sm => sm.subject_matter).join(", ") || "N/A";
    const directoryCodes = doc.directory_codes?.map(dc => dc.directory_code).join(", ") || "N/A";
    const title = doc.title?.replace(/\/\*|\*\//g, "").trim() || "Untitled";

    return {
      id: doc.doc_id || "unknown",
      title: title,
      type: doc.form || "Unknown",
      date: doc.date_document || "Unknown",
      source: "EUR-Lex",
      url: doc.eurlex_perma_url || "",
      summary: `${doc.form || "Document"} from ${doc.date_document || "unknown date"}. Subject: ${subjectMatters}. Directory codes: ${directoryCodes}`,
    };
  });

  return documents;
}

/**
 * Fetch top 5 recent PreLex legislative proposals
 */
async function getPreLexDocuments(): Promise<EULegislationData[]> {
  console.log("Fetching top 5 recent PreLex legislative proposals...\n");

  const url = "http://api.epdb.eu/prelex/document/?limit=5&format=json";

  const response = await fetch(url);

  if (!response.ok) {
    throw new Error(`PreLex API request failed: ${response.status} ${response.statusText}`);
  }

  const data: PreLexResponse = await response.json();

  // Transform documents into our unified format
  const documents: EULegislationData[] = Object.values(data).map((doc) => {
    // Get the most recent event date
    const recentEvent = doc.events?.length > 0
      ? doc.events.sort((a, b) => b.date.localeCompare(a.date))[0]
      : null;

    const eventDate = recentEvent?.date || doc.adoption_commission || doc.adoption_council || "Unknown";
    const latestEvent = recentEvent?.event || "No events";
    const directoryCodes = doc.directory_codes?.map(dc => dc.directory_code).join(", ") || "";

    return {
      id: doc.doc_id || "unknown",
      title: doc.title?.trim() || "Untitled",
      type: doc.legislative_type || "Unknown",
      date: eventDate,
      source: "PreLex",
      url: doc.prelex_perma_url || "",
      summary: `${doc.legislative_type || "Document"}. Latest event: ${latestEvent} (${eventDate}). ${doc.dg_responsible ? `DG: ${doc.dg_responsible}.` : ""} ${directoryCodes ? `Codes: ${directoryCodes}` : ""}`.trim(),
    };
  });

  return documents;
}

/**
 * Format and display legislation data
 */
function displayLegislation(items: EULegislationData[], title: string) {
  console.log("=".repeat(80));
  console.log(title);
  console.log("=".repeat(80));

  items.forEach((item, index) => {
    console.log(`\n[${index + 1}] ${item.title}`);
    console.log(`    Source: ${item.source}`);
    console.log(`    Type: ${item.type}`);
    console.log(`    Date: ${item.date}`);
    console.log(`    URL: ${item.url}`);
    console.log(`    Summary: ${item.summary}`);
  });

  console.log("\n" + "=".repeat(80));
  console.log(`\nTotal items fetched: ${items.length}`);
}

/**
 * Main function - fetches and displays EU legislation data
 */
async function main() {
  try {
    console.log("EU LEGISLATION API INGESTOR");
    console.log("Fetching recent EU legislative documents and proposals...\n");

    // Fetch EUR-Lex documents
    const eurlexDocs = await getEURLexDocuments();
    displayLegislation(eurlexDocs, "TOP 5 RECENT EUR-LEX LEGISLATIVE DOCUMENTS");

    console.log("\n\n");

    // Fetch PreLex documents
    const prelexDocs = await getPreLexDocuments();
    displayLegislation(prelexDocs, "TOP 5 RECENT PRELEX LEGISLATIVE PROPOSALS");

    return {
      eurlex: eurlexDocs,
      prelex: prelexDocs,
    };
  } catch (error) {
    console.error("Error:", error.message);
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
