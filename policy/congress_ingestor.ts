#!/usr/bin/env -S deno run --allow-net --allow-env --allow-read
/**
 * Congress.gov API Ingestor (TypeScript/Deno)
 * Fetches top 5 recent bills from the official Congress.gov API
 */

// Bill List Response Interfaces
interface BillLatestAction {
  actionDate: string;
  text: string;
}

interface BillListItem {
  congress: number;
  latestAction: BillLatestAction;
  number: string;
  originChamber: string;
  originChamberCode: string;
  title: string;
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
  url: string;
}

interface BillListResponse {
  bills: BillListItem[];
  pagination: {
    count: number;
    next?: string;
  };
  request: {
    contentType: string;
    format: string;
  };
}

// Detailed Bill Response Interfaces
interface BillSponsor {
  bioguideId: string;
  district?: number;
  firstName: string;
  fullName: string;
  isByRequest: string;
  lastName: string;
  party: string;
  state: string;
  url: string;
}

interface BillPolicyArea {
  name: string;
}

interface BillDetail {
  actions: {
    count: number;
    url: string;
  };
  committees: {
    count: number;
    url: string;
  };
  congress: number;
  introducedDate: string;
  latestAction: BillLatestAction;
  legislationUrl: string;
  number: string;
  originChamber: string;
  originChamberCode: string;
  policyArea?: BillPolicyArea;
  sponsors: BillSponsor[];
  subjects: {
    count: number;
    url: string;
  };
  summaries: {
    count: number;
    url: string;
  };
  textVersions: {
    count: number;
    url: string;
  };
  title: string;
  titles: {
    count: number;
    url: string;
  };
  type: string;
  updateDate: string;
  updateDateIncludingText: string;
}

interface BillDetailResponse {
  bill: BillDetail;
}

// Bill Summary Interfaces
interface BillSummaryItem {
  actionDate: string;
  actionDesc: string;
  text: string;
  updateDate: string;
  versionCode: string;
}

interface BillSummariesResponse {
  summaries: BillSummaryItem[];
}

// Unified output interface
interface CongressBillData {
  congress: number;
  number: string;
  type: string;
  title: string;
  sponsor: string;
  party: string;
  state: string;
  introducedDate: string;
  latestActionDate: string;
  latestActionText: string;
  policyArea: string;
  chamber: string;
  url: string;
  apiUrl: string;
  summary?: string;
  summaryDate?: string;
  summaryVersion?: string;
}

/**
 * Load API key from .env file or environment
 */
function getApiKey(): string {
  // Try environment variable first
  let apiKey = Deno.env.get("CONGRESS_API_KEY");

  if (!apiKey) {
    // Try loading from .env file
    try {
      const envContent = Deno.readTextFileSync(".env");
      const match = envContent.match(/CONGRESS_API_KEY=(.+)/);
      if (match) {
        apiKey = match[1].trim();
      }
    } catch {
      // .env file doesn't exist or can't be read
    }
  }

  if (!apiKey) {
    throw new Error("CONGRESS_API_KEY not found. Set it in .env file or as environment variable.");
  }

  return apiKey;
}

/**
 * Fetch top 5 recent bills from Congress.gov API
 */
async function getRecentBills(): Promise<CongressBillData[]> {
  const apiKey = getApiKey();

  console.log("Fetching top 5 recent bills from Congress.gov API...\n");

  const url = `https://api.congress.gov/v3/bill?api_key=${apiKey}&limit=5&format=json`;

  const response = await fetch(url);

  if (!response.ok) {
    const errorText = await response.text();
    throw new Error(`Congress API request failed: ${response.status} ${response.statusText}\n${errorText}`);
  }

  const data: BillListResponse = await response.json();

  console.log(`Found ${data.pagination.count} total bills, fetching details for ${data.bills.length} recent bills...\n`);

  // Fetch detailed information for each bill
  const detailedBills: CongressBillData[] = [];

  for (const bill of data.bills) {
    try {
      const detailUrl = `${bill.url}&api_key=${apiKey}`;
      const detailResponse = await fetch(detailUrl);

      if (detailResponse.ok) {
        const detailData: BillDetailResponse = await detailResponse.json();
        const detail = detailData.bill;

        const primarySponsor = detail.sponsors && detail.sponsors.length > 0
          ? detail.sponsors[0]
          : null;

        // Fetch summary if available
        let billSummary = "";
        let summaryDate = "";
        let summaryVersion = "";

        if (detail.summaries && detail.summaries.count > 0) {
          try {
            const summariesUrl = `${detail.summaries.url}&api_key=${apiKey}`;
            const summariesResponse = await fetch(summariesUrl);
            if (summariesResponse.ok) {
              const summariesData: BillSummariesResponse = await summariesResponse.json();
              // Get the most recent summary
              if (summariesData.summaries && summariesData.summaries.length > 0) {
                const latestSummary = summariesData.summaries[0];
                billSummary = latestSummary.text;
                summaryDate = latestSummary.actionDate;
                summaryVersion = latestSummary.actionDesc;
              }
            }
            await new Promise(resolve => setTimeout(resolve, 100));
          } catch (error) {
            const errorMessage = error instanceof Error ? error.message : String(error);
            console.error(`Error fetching summary for ${detail.type}-${detail.number}:`, errorMessage);
          }
        }

        detailedBills.push({
          congress: detail.congress,
          number: detail.number,
          type: detail.type,
          title: detail.title,
          sponsor: primarySponsor ? primarySponsor.fullName : "Unknown",
          party: primarySponsor ? primarySponsor.party : "Unknown",
          state: primarySponsor ? primarySponsor.state : "Unknown",
          introducedDate: detail.introducedDate || "Unknown",
          latestActionDate: detail.latestAction.actionDate,
          latestActionText: detail.latestAction.text,
          policyArea: detail.policyArea?.name || "Not specified",
          chamber: detail.originChamber,
          url: detail.legislationUrl,
          apiUrl: bill.url,
          summary: billSummary || undefined,
          summaryDate: summaryDate || undefined,
          summaryVersion: summaryVersion || undefined,
        });
      } else {
        // If detailed fetch fails, use list data
        detailedBills.push({
          congress: bill.congress,
          number: bill.number,
          type: bill.type,
          title: bill.title,
          sponsor: "Unknown",
          party: "Unknown",
          state: "Unknown",
          introducedDate: "Unknown",
          latestActionDate: bill.latestAction.actionDate,
          latestActionText: bill.latestAction.text,
          policyArea: "Unknown",
          chamber: bill.originChamber,
          url: `https://www.congress.gov/bill/${bill.congress}th-congress/${bill.type.toLowerCase()}/${bill.number}`,
          apiUrl: bill.url,
        });
      }

      // Add a small delay to be respectful of rate limits
      await new Promise(resolve => setTimeout(resolve, 100));
    } catch (error) {
      const errorMessage = error instanceof Error ? error.message : String(error);
      console.error(`Error fetching details for bill ${bill.type}-${bill.number}:`, errorMessage);
    }
  }

  return detailedBills;
}

/**
 * Format bill type for display
 */
function formatBillType(type: string): string {
  const types: { [key: string]: string } = {
    "HR": "House Bill",
    "S": "Senate Bill",
    "HJRES": "House Joint Resolution",
    "SJRES": "Senate Joint Resolution",
    "HCONRES": "House Concurrent Resolution",
    "SCONRES": "Senate Concurrent Resolution",
    "HRES": "House Simple Resolution",
    "SRES": "Senate Simple Resolution",
  };
  return types[type] || type;
}

/**
 * Main function - gets top 5 recent bills and displays them
 */
async function main() {
  try {
    const bills = await getRecentBills();

    console.log("=".repeat(80));
    console.log("TOP 5 RECENT BILLS FROM CONGRESS");
    console.log("=".repeat(80));

    bills.forEach((bill, index) => {
      console.log(`\n[${index + 1}] ${bill.type} ${bill.number} (${bill.congress}th Congress)`);
      console.log(`    Title: ${bill.title}`);
      console.log(`    Type: ${formatBillType(bill.type)}`);
      console.log(`    Chamber: ${bill.chamber}`);
      console.log(`    Sponsor: ${bill.sponsor} [${bill.party}-${bill.state}]`);
      console.log(`    Policy Area: ${bill.policyArea}`);
      console.log(`    Introduced: ${bill.introducedDate}`);
      console.log(`    Latest Action (${bill.latestActionDate}): ${bill.latestActionText}`);

      // Display summary if available
      if (bill.summary) {
        console.log(`\n    === SUMMARY (${bill.summaryVersion || 'Version'} - ${bill.summaryDate}) ===`);
        // Display first 400 characters of summary
        const summaryPreview = bill.summary.length > 400
          ? bill.summary.substring(0, 400) + "..."
          : bill.summary;
        console.log(`    ${summaryPreview.replace(/\n/g, '\n    ')}`);
      } else {
        console.log(`    Summary: Not available yet`);
      }

      console.log(`    URL: ${bill.url}`);
    });

    console.log("\n" + "=".repeat(80));
    console.log(`\nTotal bills fetched: ${bills.length}`);
    console.log(`Congress: ${bills[0]?.congress}th Congress`);
    console.log(`API Rate Limit: 5,000 requests per hour`);

    return bills;
  } catch (error) {
    const errorMessage = error instanceof Error ? error.message : String(error);
    console.error("Error:", errorMessage);
    return null;
  }
}

// Run if this is the main module
if (import.meta.main) {
  main();
}
