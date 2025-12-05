# EU Legislation API Documentation

## What is the EU Legislation API?

The **EU Legislation API** (api.epdb.eu) is a **free, open JSON API** that provides programmatic access to European Union legislative data. It extracts, organizes, and connects data from various official EU sources, making it easier to conduct research, create visualizations, or build applications.

### Key Features
- 📚 **170,000+ legislative documents** from official EU databases
- 🆓 **Free and open** - no API key required
- 📊 **Two main data sources**: EUR-Lex and PreLex
- 🔍 **Multiple filtering options** (by year, author, form, legal basis, directory code, etc.)
- 🌐 **JSON format** for easy integration
- 📅 **Historical data** dating back to 1949

### Data Sources

The API aggregates data from official European Union databases:

1. **[EUR-Lex](http://eur-lex.europa.eu/)** - Contains all documents printed in the Official Journal of the EU (dating back to 1951). Focuses on enacted legislation.

2. **[PreLex](http://ec.europa.eu/prelex/)** - Monitors inter-institutional procedures and legislative processes. Contains information about different stages in decision-making (dating back to 1969).

---

## Authentication

**No API key required!** 🎉

The EU Legislation API is completely open and free to use. No registration or authentication is needed.

---

## Base URL

```
http://api.epdb.eu/
```

⚠️ **Note:** The API uses HTTP (not HTTPS). The certificate has expired but the API remains functional.

---

## API Structure

The API is organized into two main sections:

### 1. EUR-Lex Data (`/eurlex/`)
Contains **138,911+ legislative documents** from the Official Journal of the EU.

**Available endpoints:**
- `/eurlex/document/` - All EUR-Lex documents
- `/eurlex/author/` - Documents grouped by author
- `/eurlex/directory_code/` - Documents grouped by subject/directory code
- `/eurlex/form/` - Documents grouped by form (Directive, Regulation, Decision)
- `/eurlex/legal_basis/` - Documents grouped by legal basis
- `/eurlex/year/` - Documents grouped by year

### 2. PreLex Data (`/prelex/`)
Contains **31,173+ legislative proposals** tracking the EU decision-making process.

**Available endpoints:**
- `/prelex/document/` - All PreLex documents
- `/prelex/dg_responsible/` - Documents by responsible Directorate General
- `/prelex/legal_basis/` - Documents by legal basis
- `/prelex/procedure/` - Documents by legislative procedure
- `/prelex/form/` - Documents by form
- `/prelex/commissioner/` - Documents by responsible Commissioner
- `/prelex/year_commission/` - Documents by year of Commission adoption
- `/prelex/year_council/` - Documents by year of Council adoption

---

## Common Query Parameters

All endpoints support these parameters:

| Parameter | Type | Description | Example |
|-----------|------|-------------|---------|
| `format` | string | Response format (default: HTML, use `json` for JSON) | `format=json` |
| `limit` | number | Limit number of results returned | `limit=5` |
| `id` | string | Get specific document by ID | `id=228100` |

### Category-Specific Parameters

Different endpoints accept category-specific filters:

| Endpoint | Parameter | Description | Example |
|----------|-----------|-------------|---------|
| `/eurlex/author/` | `author` | Filter by author organization | `author=European+Central+Bank` |
| `/eurlex/directory_code/` | `dc` | Filter by directory code | `dc=07.40.30.00` |
| `/eurlex/form/` | `form` | Filter by form of act | `form=Directive` |
| `/eurlex/legal_basis/` | `legal_basis` | Filter by legal basis | `legal_basis=11992E113` |
| `/eurlex/year/` | `y` | Filter by year | `y=2013` |
| `/prelex/dg_responsible/` | `dg` | Filter by DG | `dg=DG+Environment` |
| `/prelex/procedure/` | `p` | Filter by procedure | `p=Codecision+procedure` |
| `/prelex/commissioner/` | `c` | Filter by commissioner | `c=Neelie+Kroes` |

---

## EUR-Lex Document Structure

### EUR-Lex Document Fields

Each EUR-Lex document contains:

| Field | Type | Description |
|-------|------|-------------|
| `doc_id` | string | Unique document identifier |
| `form` | string | Type of act (Directive, Regulation, Decision, Agreement, etc.) |
| `title` | string | Document title |
| `date_document` | string | Date of the document (YYYY-MM-DD) |
| `of_effect` | string | Date of effect |
| `end_validity` | string | End of validity date |
| `oj_date` | string | Official Journal publication date |
| `api_url` | string | API URL for this document |
| `eurlex_perma_url` | string | Permanent EUR-Lex URL |
| `text_url` | string | URL to full text (if available) |
| `author` | string | Author organization |
| `addressee` | string | Addressee (if any) |
| `additional_info` | string | Additional information |
| `directory_codes` | array | Subject classification codes |
| `legal_basis` | array | Legal basis references |
| `relationships` | array | Related documents |
| `eurovoc_descriptors` | array | Eurovoc subject descriptors |
| `subject_matter` | array | Subject matter categories |
| `prelex_relation` | array | Related PreLex documents |

### Available EUR-Lex Forms

Common legislative forms available:

- **Directive** - Binding legislative act requiring member states to achieve results
- **Regulation** - Binding legislative act applied directly across all member states
- **Decision** - Binding in its entirety for those to whom it is addressed
- **Agreement** - International agreements with third countries
- **Recommendation** - Non-binding suggestions
- **Opinion** - Non-binding viewpoints



## PreLex Document Structure

### PreLex Document Fields

Each PreLex document contains:

| Field | Type | Description |
|-------|------|-------------|
| `doc_id` | string | Unique document identifier |
| `com_number` | string | COM document number (e.g., COM(1999) 749) |
| `title` | string | Document title |
| `legislative_type` | string | Type (Proposal for a Regulation, Directive, etc.) |
| `dg_responsible` | string | Responsible Directorate General |
| `commissioner` | string | Responsible Commissioner |
| `legal_basis` | string | Legal basis text |
| `prelex_procedure` | string | Legislative procedure used |
| `adoption_commission` | string | Date adopted by Commission |
| `adoption_council` | string | Date adopted by Council |
| `api_url` | string | API URL for this document |
| `prelex_perma_url` | string | Permanent PreLex URL |
| `eurlex_perma_url` | string | Related EUR-Lex URL (if adopted) |
| `events` | array | Timeline of legislative events |
| `directory_codes` | array | Subject classification codes |
| `legal_bases_eurlex` | array | EUR-Lex legal basis codes |

### PreLex Events

Each event in the `events` array contains:

| Field | Type | Description |
|-------|------|-------------|
| `event_id` | string | Unique event identifier |
| `doc_id` | string | Parent document ID |
| `event` | string | Event type (e.g., "Adoption by Commission", "EP opinion") |
| `date` | string | Event date (YYYY-MM-DD) |

### Available PreLex Procedures

Common legislative procedures:

- **Codecision procedure** - European Parliament and Council legislate jointly
- **Consultation procedure** - Council consults Parliament but decides alone
- **Assent procedure** - Parliament can approve or reject but not amend
- **CNS procedure** (Consultation)
- **COD procedure** (Ordinary legislative procedure/Codecision)



## Example API Calls

### 1. Get Top 5 Recent EUR-Lex Documents

**Request:**
```bash
GET http://api.epdb.eu/eurlex/document/?limit=5&format=json
```

**Response Structure:**
```json
{
  "139159": {
    "doc_id": "139159",
    "form": "Agreement",
    "title": "Agreement on cooperation...",
    "date_document": "1953-07-04",
    "of_effect": "1953-07-16",
    "end_validity": "2100-01-01",
    "oj_date": "1953-08-14",
    "eurlex_perma_url": "http://eur-lex.europa.eu/...",
    "directory_codes": [{"directory_code": "11.30.40.00"}],
    "legal_basis": [],
    "relationships": [...],
    "eurovoc_descriptors": [...],
    "subject_matter": [{"subject_matter": "External relations"}]
  },
  ...
}
```

### 2. Get Top 5 Recent PreLex Proposals

**Request:**
```bash
GET http://api.epdb.eu/prelex/document/?limit=5&format=json
```

**Response Structure:**
```json
{
  "53921": {
    "doc_id": "53921",
    "com_number": "BCE (1999) 1",
    "title": "European Central Bank recommendation...",
    "legislative_type": "Recomm. for a Regulation",
    "dg_responsible": "",
    "commissioner": "",
    "prelex_procedure": "Commission:Consultation procedure...",
    "adoption_commission": "",
    "adoption_council": "2000-05-08",
    "prelex_perma_url": "http://ec.europa.eu/prelex/...",
    "eurlex_perma_url": "http://eur-lex.europa.eu/...",
    "events": [
      {
        "event_id": "1265194",
        "doc_id": "53921",
        "event": "EP Cttee report single rdg",
        "date": "2000-02-23"
      },
      ...
    ],
    "directory_codes": [{"directory_code": "01.40.75.00"}],
    "legal_bases_eurlex": [{"legal_basis": "11992M/PRO/SEBC/30 -P4"}]
  },
  ...
}
```

### 3. Get Directives from EUR-Lex

**Request:**
```bash
GET http://api.epdb.eu/eurlex/form/?form=Directive&format=json
```

Returns all directives grouped and available for listing.

### 4. Get Legislation by Directory Code

**Request:**
```bash
GET http://api.epdb.eu/eurlex/directory_code/?dc=07.40.30.00&format=json
```

Returns all legislation under directory code 07.40.30.00 (air safety within transport policy).

### 5. Get Documents by Year

**Request:**
```bash
GET http://api.epdb.eu/eurlex/year/?y=2013&format=json
```

Returns all EUR-Lex documents from 2013.

### 6. Get Documents by DG Responsible

**Request:**
```bash
GET http://api.epdb.eu/prelex/dg_responsible/?dg=DG+Environment&format=json
```

Returns all PreLex documents where DG Environment is responsible.

### 7. Get Specific Document by ID

**Request:**
```bash
GET http://api.epdb.eu/eurlex/document/?id=228100&format=json
```

Returns a single document with ID 228100.

### 8. Get Documents by Author

**Request:**
```bash
GET http://api.epdb.eu/eurlex/author/?author=European+Central+Bank&format=json
```

Returns all documents authored by the European Central Bank.



## Directory Codes (Subject Classification)

Directory codes organize EU legislation by subject matter. Examples:

| Code | Description |
|------|-------------|
| `01.xx.xx.xx` | General, financial and institutional matters |
| `02.xx.xx.xx` | Customs union and free movement of goods |
| `03.xx.xx.xx` | Agriculture |
| `04.xx.xx.xx` | Fisheries |
| `05.xx.xx.xx` | Freedom of movement for workers |
| `06.xx.xx.xx` | Right of establishment and freedom to provide services |
| `07.xx.xx.xx` | Transport policy |
| `08.xx.xx.xx` | Competition policy |
| `09.xx.xx.xx` | Taxation |
| `10.xx.xx.xx` | Economic and monetary policy |
| `11.xx.xx.xx` | External relations |
| `12.xx.xx.xx` | Energy |
| `13.xx.xx.xx` | Industrial policy and internal market |
| `14.xx.xx.xx` | Regional policy and coordination of structural instruments |
| `15.xx.xx.xx` | Environment, consumers and health protection |
| `16.xx.xx.xx` | Science, information, education and culture |

**Browse all codes:**
```bash
GET http://api.epdb.eu/eurlex/directory_code/?format=json
```

---

## Running the Ingestor

### Prerequisites

- [Deno](https://deno.land/) installed
- Network access to http://api.epdb.eu

### Run Command

```bash
# Basic run
deno run --allow-net eulegislation_ingestor.ts

# Or make executable and run directly
chmod +x eulegislation_ingestor.ts
./eulegislation_ingestor.ts
```


## Use Cases & Examples

### Research Applications

1. **Decision-Making Time Analysis**
   - Track events timeline in PreLex documents
   - Calculate time between proposal and adoption

2. **Voting Pattern Analysis**
   - Analyze legislative procedures
   - Study codecision vs consultation procedures

3. **Commissioner Activity Measurement**
   - Query by commissioner to measure output
   - Track proposals by responsible DG

4. **Legislative Integration Timeline**
   - Visualize EU law development over time
   - Track legislation by year and subject

### Data Visualization

```javascript
// Example: Get all directives from 2010-2020
const years = [2010, 2011, 2012, 2013, 2014, 2015, 2016, 2017, 2018, 2019, 2020];
const directives = [];

for (const year of years) {
  const response = await fetch(
    `http://api.epdb.eu/eurlex/form/?form=Directive&y=${year}&format=json`
  );
  const data = await response.json();
  directives.push({ year, count: Object.keys(data).length });
}

// Visualize trends over time
```

### Legislative Monitoring

```javascript
// Monitor new environment legislation
const envLegislation = await fetch(
  'http://api.epdb.eu/prelex/dg_responsible/?dg=DG+Environment&format=json'
).then(r => r.json());

// Check for recent proposals
const recentProposals = Object.values(envLegislation).filter(doc => {
  const adoptionDate = new Date(doc.adoption_commission);
  const thirtyDaysAgo = new Date();
  thirtyDaysAgo.setDate(thirtyDaysAgo.getDate() - 30);
  return adoptionDate > thirtyDaysAgo;
});
```

---

## Best Practices

### ✅ DO:

- **Cache responses** - API data doesn't change frequently
- **Use specific filters** - Narrow down results with category parameters
- **Handle response format** - Documents are returned as objects keyed by ID
- **Check for null values** - Many fields can be empty strings or null
- **Parse dates properly** - Dates are in YYYY-MM-DD format
- **Follow relationships** - Use document relationships to build connected datasets

### ❌ DON'T:

- **Hammer the API** - Cache responses and be respectful of the free service
- **Assume HTTPS** - The API uses HTTP only
- **Expect real-time data** - EUR-Lex data ends around 2013, PreLex around 2011
- **Ignore empty fields** - Many documents have incomplete metadata

---

## Data Limitations

⚠️ **Important Notes:**

1. **Data Coverage Dates:**
   - EUR-Lex: 1949-09-24 to 2013-10-04 (138,911 documents)
   - PreLex: 1965-06-25 to 2011-11-30 (31,173 documents)

2. **Not Real-Time:** This API contains historical data and is not actively updated with current legislation.

3. **Incomplete Metadata:** Some documents have missing or incomplete fields (commissioner, DG, etc.)

4. **No Full Text:** The API provides metadata only. Use `text_url` or permalink URLs to access full text.

---

## Alternative & Official Sources

For current, up-to-date EU legislation:

| Source | URL | Description |
|--------|-----|-------------|
| **EUR-Lex (Official)** | https://eur-lex.europa.eu/ | Official EU law database |
| **PreLex (Official)** | http://ec.europa.eu/prelex/ | Inter-institutional procedures |
| **OEIL** | http://www.europarl.europa.eu/oeil/ | European Parliament database |
| **Rapid Database** | http://europa.eu/rapid/ | Press releases and communications |
| **Council Documents** | http://www.consilium.europa.eu/ | Council of the EU documents |

---

## Rate Limits & Terms

### Rate Limits

**Unknown/Not specified** - Be respectful and cache responses where possible.

### Terms of Use

- ✅ Free to use for research, analysis, and applications
- ✅ No API key required
- ✅ No stated commercial restrictions
- ⚠️ Historical data only (not actively maintained)
- ⚠️ Use at your own risk (no SLA or guarantees)



## Official Resources

| Resource | URL |
|----------|-----|
| **API Website** | http://api.epdb.eu/ |
| **Contact** | contact@buhlrasmussen.eu |
| **EUR-Lex** | http://eur-lex.europa.eu/ |
| **PreLex** | http://ec.europa.eu/prelex/ |

---

## Summary

- **Best for:** Research, historical analysis, data visualization of EU legislation
- **Cost:** 100% Free, no API key required
- **Format:** JSON REST API
- **Auth:** None required
- **Coverage:** 170,000+ documents (EUR-Lex + PreLex)
- **Date Range:** 1949-2013 (EUR-Lex), 1965-2011 (PreLex)
- **Update Frequency:** Historical/archived data (not actively updated)
- **Rate Limits:** None specified (be respectful)
- **Key Advantage:** Free, comprehensive historical EU legislative data
- **Key Limitation:** Data is historical and not current (ends 2011-2013)
- **Use Cases:** Academic research, legal analysis, policy studies, legislative tracking

## Example

```
[2] Agreement between the United Kingdom of Great Britain and Northern Ireland and Belgium, France, the Federal Republic of Germany, Italy, Luxembourg, the Netherlands and the High Authority of the European Coal and Steel Community concerning the relations between the United Kingdom of Great Britain and Northern Ireland and the European Coal and Steel Community, signed at London, on 21 December 1954
    Source: EUR-Lex
    Type: Agreement
    Date: 1954-12-21
    URL: http://eur-lex.europa.eu/LexUriServ/LexUriServ.do?uri=CELEX:21954A1221(01):EN:NOT
    Summary: Agreement from 1954-12-21. Subject: External relations. Directory codes: 11.40.10.00
```