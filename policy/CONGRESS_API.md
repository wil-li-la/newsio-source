# Congress.gov API Documentation

## What is the Congress.gov API?

The **Congress.gov API** is the **official API from the Library of Congress** that provides accXess to legislative data from the U.S. Congress. It offers comprehensive information about bills, resolutions, amendments, members, committees, and much more.

### Key Features
- 🏛️ **Official U.S. Government API** from the Library of Congress
- 📜 **Comprehensive legislative data** covering all aspects of Congress
- 🔄 **Real-time updates** with current congressional activity
- 🆓 **Free to use** with an API key
- 📊 **Multiple endpoints** for bills, amendments, members, committees, and more
- 🌐 **JSON and XML formats** available
- 📅 **Historical data** going back to the 1st Congress (1789)

### Data Coverage

The API provides data on:
- 🗳️ **Bills and Resolutions** (all types from all Congresses)
- 📝 **Amendments** to legislation
- 👥 **Members of Congress** (current and historical)
- 🏢 **Committees** (standing, select, joint)
- 🗓️ **Committee Meetings and Hearings**
- 📊 **Roll Call Votes** (House and Senate)
- 📤 **Congressional Reports**
- 📨 **Communications** (Presidential messages, Executive communications)
- 🤝 **Nominations and Treaties**
- 📋 **Summaries** of legislation

---

## Authentication

### 🔑 Getting an API Key

1. **Sign up** at [api.data.gov](https://api.data.gov/signup/)
2. **Receive your API key** via email instantly
3. **Set environment variable:**

```bash
# .env file
CONGRESS_API_KEY=your_api_key_here

# Or export in terminal
export CONGRESS_API_KEY="your_api_key_here"
```

### Rate Limits

| Feature | Limit |
|---------|-------|
| **Requests per hour** | 5,000 |
| **Requests per day** | No daily limit (hourly limit only) |
| **Commercial use** | ✅ Allowed |

---

## Base URL

```
https://api.congress.gov/v3/
```

**Current Version:** v3 (as of 2025)

---

## Available Endpoints

### 1. 📜 Bills

**Endpoint:** `GET /bill`

**Description:** Search and retrieve information about bills and resolutions.

**Key Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `fromDateTime` | string | Filter by update date (ISO 8601) | `2025-12-01T00:00:00Z` |
| `toDateTime` | string | Filter by update date (ISO 8601) | `2025-12-04T23:59:59Z` |
| `limit` | number | Number of results (1-250, default 20) | `5` |
| `offset` | number | Pagination offset | `0` |
| `format` | string | Response format: `json` or `xml` | `json` |

**Bill Types Available:**
- `hr` - House Bill
- `s` - Senate Bill
- `hjres` - House Joint Resolution
- `sjres` - Senate Joint Resolution
- `hconres` - House Concurrent Resolution
- `sconres` - Senate Concurrent Resolution
- `hres` - House Simple Resolution
- `sres` - Senate Simple Resolution

**Specific Bill Endpoint:** `GET /bill/{congress}/{billType}/{billNumber}`

**Sub-endpoints for Bills:**
- `/bill/{congress}/{billType}/{billNumber}/actions` - Legislative actions
- `/bill/{congress}/{billType}/{billNumber}/amendments` - Amendments to the bill
- `/bill/{congress}/{billType}/{billNumber}/committees` - Committee assignments
- `/bill/{congress}/{billType}/{billNumber}/cosponsors` - Bill cosponsors
- `/bill/{congress}/{billType}/{billNumber}/relatedbills` - Related legislation
- `/bill/{congress}/{billType}/{billNumber}/subjects` - Policy area subjects
- `/bill/{congress}/{billType}/{billNumber}/summaries` - Bill summaries
- `/bill/{congress}/{billType}/{billNumber}/text` - Full text versions
- `/bill/{congress}/{billType}/{billNumber}/titles` - All titles

### 2. 📝 Amendments

**Endpoint:** `GET /amendment`

**Description:** Retrieve amendments to bills and resolutions.

**Specific Amendment:** `GET /amendment/{congress}/{amendmentType}/{amendmentNumber}`

**Amendment Types:**
- `hamdt` - House Amendment
- `samdt` - Senate Amendment
- `suamdt` - Senate Unprinted Amendment

### 3. 👥 Members

**Endpoint:** `GET /member`

**Description:** Get information about current and historical Members of Congress.

**Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `currentMember` | boolean | Filter to current members only | `true` |
| `limit` | number | Results per page | `20` |
| `offset` | number | Pagination offset | `0` |

**Specific Member:** `GET /member/{bioguideId}`

**Member Sub-endpoints:**
- `/member/{bioguideId}/sponsored-legislation` - Bills sponsored
- `/member/{bioguideId}/cosponsored-legislation` - Bills cosponsored

### 4. 🏢 Committees

**Endpoint:** `GET /committee`

**Description:** Information about congressional committees.

**Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `chamber` | string | Filter by chamber: `house`, `senate`, or `joint` | `house` |
| `limit` | number | Results per page | `20` |

**Specific Committee:** `GET /committee/{chamber}/{committeeCode}`

**Committee Sub-endpoints:**
- `/committee/{chamber}/{committeeCode}/bills` - Bills referred to committee
- `/committee/{chamber}/{committeeCode}/reports` - Committee reports
- `/committee/{chamber}/{committeeCode}/nominations` - Nominations

### 5. 🗓️ Committee Meetings

**Endpoint:** `GET /committee-meeting`

**Description:** Scheduled and past committee meetings and hearings.

**Parameters:**

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `chamber` | string | Filter by chamber | `house` |
| `fromDateTime` | string | Start date (ISO 8601) | `2025-12-01T00:00:00Z` |
| `toDateTime` | string | End date (ISO 8601) | `2025-12-04T23:59:59Z` |

**Specific Meeting:** `GET /committee-meeting/{chamber}/{eventId}`

### 6. 🗳️ Roll Call Votes (Beta - 2025)

**Endpoint:** `GET /vote` (House only, beta)

**Description:** House roll call votes on legislation (118th Congress onwards, 2023+).

**Sub-endpoints:**
- List-level: Get all votes
- Item-level: Get specific vote details
- Member votes-level: How individual members voted

### 7. 📊 Congressional Reports

**Endpoint:** `GET /committee-report`

**Description:** Committee reports on legislation.

**Specific Report:** `GET /committee-report/{congress}/{reportType}/{reportNumber}`

### 8. 📤 Communications

**Endpoint:** `GET /senate-communication`

**Description:** Senate communications including Presidential messages and Executive communications.

**Specific Communication:** `GET /senate-communication/{congress}/{communicationType}/{communicationNumber}`

### 9. 🤝 Nominations

**Endpoint:** `GET /nomination`

**Description:** Presidential nominations sent to the Senate.

**Specific Nomination:** `GET /nomination/{congress}/{nominationNumber}`

### 10. 📜 Treaties

**Endpoint:** `GET /treaty`

**Description:** Treaties submitted to the Senate for ratification.

**Specific Treaty:** `GET /treaty/{congress}/{treatyNumber}`

### 11. 🏛️ Congress

**Endpoint:** `GET /congress`

**Description:** Information about specific Congresses.

**Specific Congress:** `GET /congress/{congress}`

### 12. 📄 Summaries

**Endpoint:** `GET /summaries`

**Description:** Bill summaries written by the Congressional Research Service.

**Specific Summary:** `GET /summaries/{congress}/{billType}/{billNumber}`

---

## Response Structure

### Bill List Response

```json
{
  "bills": [
    {
      "congress": 119,
      "latestAction": {
        "actionDate": "2025-12-03",
        "text": "Presented to President."
      },
      "number": "983",
      "originChamber": "House",
      "originChamberCode": "H",
      "title": "Montgomery GI Bill Selected Reserves Tuition Fairness Act of 2025",
      "type": "HR",
      "updateDate": "2025-12-04",
      "updateDateIncludingText": "2025-12-04",
      "url": "https://api.congress.gov/v3/bill/119/hr/983?format=json"
    }
  ],
  "pagination": {
    "count": 422644,
    "next": "https://api.congress.gov/v3/bill?offset=5&limit=5&format=json"
  },
  "request": {
    "contentType": "application/json",
    "format": "json"
  }
}
```

### Detailed Bill Response Fields

| Field | Type | Description |
|-------|------|-------------|
| `congress` | number | Congress number (e.g., 119 for 119th Congress) |
| `number` | string | Bill number |
| `type` | string | Bill type (HR, S, HJRES, etc.) |
| `title` | string | Official title of the bill |
| `introducedDate` | string | Date bill was introduced (YYYY-MM-DD) |
| `latestAction.actionDate` | string | Date of most recent action |
| `latestAction.text` | string | Description of latest action |
| `originChamber` | string | Chamber where bill originated |
| `sponsors` | array | Primary sponsors (bioguideId, name, party, state, district) |
| `cosponsors` | object | Information about cosponsors |
| `policyArea.name` | string | Primary policy area |
| `subjects` | object | Related policy subjects |
| `committees` | object | Committees handling the bill |
| `actions` | object | All legislative actions taken |
| `summaries` | object | Bill summaries |
| `textVersions` | object | Available text versions |
| `titles` | object | All titles (short, official, etc.) |
| `legislationUrl` | string | Congress.gov URL for the bill |
| `updateDate` | string | Last update timestamp (ISO 8601) |

### Bill Types Explained

| Type | Full Name | Description | Example |
|------|-----------|-------------|---------|
| **HR** | House Bill | Legislation from the House | HR 983 |
| **S** | Senate Bill | Legislation from the Senate | S 1234 |
| **HJRES** | House Joint Resolution | Constitutional amendments, declarations of war | HJRES 130 |
| **SJRES** | Senate Joint Resolution | Constitutional amendments from Senate | SJRES 45 |
| **HCONRES** | House Concurrent Resolution | Non-binding, affects both chambers | HCONRES 20 |
| **SCONRES** | Senate Concurrent Resolution | Non-binding from Senate | SCONRES 15 |
| **HRES** | House Simple Resolution | House internal matters only | HRES 500 |
| **SRES** | Senate Simple Resolution | Senate internal matters only | SRES 300 |

---

## Example API Calls

### 1. Get Top 5 Recent Bills

**Request:**
```bash
GET https://api.congress.gov/v3/bill?api_key=YOUR_KEY&limit=5&format=json
```

### 2. Get Specific Bill Details

**Request:**
```bash
GET https://api.congress.gov/v3/bill/119/hr/983?api_key=YOUR_KEY&format=json
```

### 3. Get Bill Actions (Legislative History)

**Request:**
```bash
GET https://api.congress.gov/v3/bill/119/hr/983/actions?api_key=YOUR_KEY&format=json
```

### 4. Get Bills by Date Range

**Request:**
```bash
GET https://api.congress.gov/v3/bill?fromDateTime=2025-12-01T00:00:00Z&toDateTime=2025-12-04T23:59:59Z&api_key=YOUR_KEY&format=json
```

### 5. Get Current Members of Congress

**Request:**
```bash
GET https://api.congress.gov/v3/member?currentMember=true&limit=20&api_key=YOUR_KEY&format=json
```

### 6. Get Specific Member Information

**Request:**
```bash
GET https://api.congress.gov/v3/member/V000135?api_key=YOUR_KEY&format=json
```

### 7. Get House Committees

**Request:**
```bash
GET https://api.congress.gov/v3/committee?chamber=house&api_key=YOUR_KEY&format=json
```

### 8. Get Upcoming Committee Meetings

**Request:**
```bash
GET https://api.congress.gov/v3/committee-meeting?chamber=house&fromDateTime=2025-12-04T00:00:00Z&api_key=YOUR_KEY&format=json
```

### 9. Get Bill Summaries

**Request:**
```bash
GET https://api.congress.gov/v3/bill/119/hr/983/summaries?api_key=YOUR_KEY&format=json
```

### 10. Get Bills Sponsored by a Member

**Request:**
```bash
GET https://api.congress.gov/v3/member/V000135/sponsored-legislation?api_key=YOUR_KEY&format=json
```

---

## Running the Ingestor

### Prerequisites

- [Deno](https://deno.land/) installed
- Congress API key set in `.env` file or environment variable

### Run Command

```bash
# With .env file in same directory
deno run --allow-net --allow-env --allow-read congress_ingestor.ts

# Or with inline env var
CONGRESS_API_KEY="your_key" deno run --allow-net --allow-env congress_ingestor.ts
```

### Expected Output

```
Fetching top 5 recent bills from Congress.gov API...

Found 422644 total bills, fetching details for 5 recent bills...

================================================================================
TOP 5 RECENT BILLS FROM CONGRESS
================================================================================

[1] HR 983 (119th Congress)
    Title: Montgomery GI Bill Selected Reserves Tuition Fairness Act of 2025
    Type: House Bill
    Chamber: House
    Sponsor: Rep. Van Orden, Derrick [R-WI-3]
    Policy Area: Armed Forces and National Security
    Introduced: 2025-02-05
    Latest Action (2025-12-03): Presented to President.
    URL: https://www.congress.gov/bill/119th-congress/house-bill/983

[2] HR 970 (119th Congress)
    Title: Fairness for Servicemembers and their Families Act of 2025
    Type: House Bill
    Chamber: House
    Sponsor: Rep. Example [D-CA-12]
    Policy Area: Armed Forces and National Security
    Introduced: 2025-02-01
    Latest Action (2025-12-03): Presented to President.
    URL: https://www.congress.gov/bill/119th-congress/house-bill/970

[...]

================================================================================

Total bills fetched: 5
Congress: 119th Congress
API Rate Limit: 5,000 requests per hour
```

---

## Use Cases & Examples

### Legislative Tracking

```typescript
// Monitor bills in specific policy areas
const response = await fetch(
  `https://api.congress.gov/v3/bill?api_key=${apiKey}&format=json&limit=100`
);
const data = await response.json();

// Filter by policy area
const techBills = data.bills.filter(bill =>
  bill.title.toLowerCase().includes('technology') ||
  bill.title.toLowerCase().includes('artificial intelligence')
);
```

### Member Activity Tracking

```typescript
// Track a specific member's legislative activity
const memberId = "V000135"; // bioguideId
const sponsoredBills = await fetch(
  `https://api.congress.gov/v3/member/${memberId}/sponsored-legislation?api_key=${apiKey}&format=json`
).then(r => r.json());

const cosponsoredBills = await fetch(
  `https://api.congress.gov/v3/member/${memberId}/cosponsored-legislation?api_key=${apiKey}&format=json`
).then(r => r.json());
```

### Committee Monitoring

```typescript
// Monitor specific committee activity
const committeeCode = "hsif00"; // House Energy and Commerce
const committeeBills = await fetch(
  `https://api.congress.gov/v3/committee/house/${committeeCode}/bills?api_key=${apiKey}&format=json`
).then(r => r.json());
```

### Bill Timeline Analysis

```typescript
// Get complete legislative history
const billActions = await fetch(
  `https://api.congress.gov/v3/bill/119/hr/983/actions?api_key=${apiKey}&format=json`
).then(r => r.json());

// Calculate time between introduction and passage
// Analyze bottlenecks in legislative process
```

---

## Best Practices

### ✅ DO:

- **Use specific endpoints** - Query specific bills/members rather than listing all
- **Cache responses** - Store frequently accessed data locally
- **Respect rate limits** - 5,000 requests per hour
- **Use date filters** - Narrow results with `fromDateTime` and `toDateTime`
- **Paginate efficiently** - Use `offset` and `limit` parameters
- **Handle errors gracefully** - Check response status and handle failures
- **Store API keys securely** - Use environment variables or .env files
- **Use sub-endpoints** - Get specific data (actions, summaries) rather than full details
- **Check pagination** - Use `pagination.next` for additional results

### ❌ DON'T:

- **Exceed rate limits** - Implement rate limiting in your code
- **Expose API keys** - Never commit keys to public repositories
- **Request unnecessary data** - Use specific endpoints to minimize data transfer
- **Ignore pagination** - Large datasets require paginating through results
- **Make synchronous requests** - Use async/await for better performance
- **Skip error handling** - Always handle API errors and rate limit responses

---

## Error Handling

### Common HTTP Status Codes

| Status Code | Meaning | Resolution |
|-------------|---------|------------|
| `200` | Success | Request completed successfully |
| `400` | Bad Request | Check parameters and format |
| `401` | Unauthorized | Invalid or missing API key |
| `404` | Not Found | Resource doesn't exist |
| `429` | Too Many Requests | Rate limit exceeded, wait before retry |
| `500` | Server Error | Congress.gov API issue, retry later |

### Example Error Response

```json
{
  "error": {
    "code": "OVER_RATE_LIMIT",
    "message": "API rate limit exceeded"
  }
}
```

---

## Congress Numbers Reference

| Congress | Years | President(s) |
|----------|-------|--------------|
| **119th** | 2025-2027 | Biden/Trump |
| **118th** | 2023-2025 | Biden |
| **117th** | 2021-2023 | Biden |
| **116th** | 2019-2021 | Trump |
| **115th** | 2017-2019 | Trump |

**Historical:** Congress numbers go back to the 1st Congress (1789-1791). Use the congress number in API endpoints to access historical data.

---

## Additional Data Sources

For comprehensive congressional data, consider combining with:

| Source | Description | URL |
|--------|-------------|-----|
| **GovTrack** | Legislative tracking and analytics | https://www.govtrack.us/api/v2 |
| **ProPublica Congress API** | Voting records and member data | https://projects.propublica.org/api-docs/congress-api/ |
| **OpenSecrets** | Campaign finance data | https://www.opensecrets.org/api |
| **FEC API** | Federal Election Commission data | https://api.open.fec.gov/developers/ |

---

## Official Resources

| Resource | URL |
|----------|-----|
| **API Website** | https://api.congress.gov |
| **GitHub Documentation** | https://github.com/LibraryOfCongress/api.congress.gov |
| **Sign Up for API Key** | https://api.data.gov/signup/ |
| **Congress.gov** | https://www.congress.gov |
| **Library of Congress APIs** | https://www.loc.gov/apis/ |
| **API Status** | Check GitHub issues for known problems |

---

## Summary

- **Best for:** Official U.S. legislative data from the Library of Congress
- **Cost:** Free with API key
- **Format:** JSON and XML
- **Auth:** API key required (free signup)
- **Coverage:** All bills, members, committees from 1st Congress (1789) to present
- **Update Frequency:** Real-time updates with current congressional activity
- **Rate Limits:** 5,000 requests per hour
- **Key Advantage:** Official, comprehensive, and authoritative legislative data
- **Key Limitation:** Some newer endpoints (like House votes) are still in beta
- **Use Cases:** Legislative tracking, policy research, government transparency tools, civic engagement apps

---

## Sources

- [GitHub - LibraryOfCongress/api.congress.gov](https://github.com/LibraryOfCongress/api.congress.gov)
- [Using Congress.gov Data Offsite | Library of Congress](https://www.congress.gov/help/using-data-offsite)
- [Congress.gov API | APIs at the Library of Congress](https://www.loc.gov/apis/additional-apis/congress-dot-gov-api/)
- [Bill Endpoint Documentation](https://github.com/LibraryOfCongress/api.congress.gov/blob/main/Documentation/BillEndpoint.md)
- [Introducing House Roll Call Votes in the Congress.gov API | In Custodia Legis](https://blogs.loc.gov/law/2025/05/introducing-house-roll-call-votes-in-the-congress-gov-api/)

## Example
```
[3] HR 1912 (119th Congress)
    Title: Veteran Fraud Reimbursement Act of 2025
    Type: House Bill
    Chamber: House
    Sponsor: Rep. Connolly, Gerald E. [D-VA-11] [D-VA]
    Policy Area: Armed Forces and National Security
    Introduced: 2025-03-06
    Latest Action (2025-12-03): Presented to President.

    === SUMMARY (Introduced in House - 2025-03-06) ===
    <p><strong>Veteran Fraud Reimbursement Act of 2025</strong></p><p>This bill modifies the procedures by which the Department of Veterans Affairs (VA) reissues misused benefits to a beneficiary, including by requiring the VA to establish methods and timing with respect to determining whether an instance of misuse by a fiduciary is the result of negligence by the VA. The bill also provides that if a ...
    URL: https://www.congress.gov/bill/119th-congress/house-bill/1912
    
Rep. Gerald Connolly introduced a bill requiring the VA to more quickly determine negligence in benefit misuse and reimburse affected veterans, aiming to reduce delays and protect beneficiaries from fiduciary fraud.

⸻

Three one-line signals
	1.	Tighter VA Accountability: The bill pressures the VA to formally assess its negligence in fraud cases.
	2.	Faster Benefit Recovery: Veterans receive clearer, faster reimbursement when funds are misused.
	3.	Stronger Fiduciary Oversight: Highlights growing federal focus on preventing fraud in veteran financial management.
```