# Module 07: Meridian Memory — Knowledge Base

## Purpose

Meridian Memory is the institutional brain. It makes every piece of banking knowledge — past pitches, transaction precedents, credit decisions, market analysis, process letters, and know-how — findable in seconds through natural language search. No more digging through old emails, shared drives, or asking who worked on a similar deal three years ago.

The defining question Memory answers: **"Has someone done this before, and can I find it?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| IB Analyst | Primary user — precedent searches, past pitch books, transaction comps, onboarding |
| Credit Analyst | Past credit memos, industry benchmarks, precedent covenants, waiver history |
| IB Associate | Deal structure research, comparable process research |
| Compliance Officer | Policy documents, regulatory guidance, restricted list management |
| Operations / Middle Office | KYC files, onboarding documentation, procedure guides |
| All roles | "Institutional knowledge" — who knows what, what did we do before |

---

## Key Features

### 1. Semantic Document Search

The core Memory capability — natural language search across all institutional documents:

**Search scope:**
- Pitch books and presentations (all time)
- CIMs and offering memoranda
- Credit memos and annual reviews
- Briefing notes and research
- Process letters and bid instructions
- Transaction documents
- Policy and procedure documents
- Knowledge articles

**How it works:**
1. All documents indexed with vector embeddings (using Claude's text embedding API)
2. User types a natural language query: *"Find me pitch books for European industrial M&A where we positioned as sell-side advisor"*
3. Semantic search returns the 10 most relevant documents, ranked by relevance
4. Each result shows document title, date, responsible banker, relevant excerpts
5. User can open, preview, or ask Claude questions about the document

**AI layer:** Claude can answer questions about a specific document or across a search result set: *"What valuation multiples did we use in the 2023 Acme Industries pitch?"*

---

### 2. Precedent Transaction Database

Searchable library of all past transactions the institution has completed or pitched on:

**Per transaction record:**
- Transaction name, counterparty, date
- Deal type, product, size
- Key terms (multiples, spreads, structure)
- Our role (lead advisor, bookrunner, co-manager, etc.)
- Deal team
- Materials: pitch book, CIM, process letter, tombstone
- Outcome: won / lost / withdrawn
- League table credit

**Search:**
- Natural language: *"Find me all IG bond deals we ran for European tech companies in the last 3 years"*
- Structured filters: deal type, sector, size range, date range, outcome
- Comparables matching: given a new deal, find the 5 most comparable past transactions

**Integration with Forge:** Comparable transactions searchable and directly insertable into pitch book sections.

---

### 3. Deal History by Client

Complete picture of everything that has ever happened between the institution and a client:

- All pitches (won and lost) with materials linked
- All mandates with transaction details
- All credit facilities (current and historical)
- Key milestones and events
- Revenue history by year and by product

Accessible directly from the Intelligence module's client 360° view.

---

### 4. Knowledge Articles

Structured knowledge base for banking best practice and institutional know-how:

**Article types:**
- **Process guides**: How to run an M&A process, how to structure a leveraged loan, how to run a book
- **Market practice notes**: Current market practice for specific products (updated periodically)
- **Product guides**: Explanation of specific banking products for junior team members
- **Regulatory summaries**: Plain-English summaries of key regulations and their implications
- **Sector primers**: Industry sector overviews for new coverage onboarding
- **Case studies**: Anonymized deal case studies for training purposes

**Knowledge management:**
- Articles authored by senior bankers, reviewed, and version-controlled
- Feedback and rating from readers
- AI-assisted drafting: bankers can ask Claude to draft an article, then review and approve
- Search-optimized: articles indexed alongside documents in semantic search

---

### 5. Expert Finder

*"Who in the firm has done this before?"*

When a banker needs expertise they don't have, Expert Finder identifies colleagues:

- Based on past deals: who worked on similar transactions?
- Based on sector coverage: who covers this sector or geography?
- Based on authored knowledge articles: who has written about this topic?
- Based on client history: who has a relationship with this client?

Output: Profile cards for relevant experts with their deal experience and contact details.

---

### 6. Document Vault

Secure, versioned storage for important deal and compliance documents:

- **Deal files**: Transaction documents, regulatory submissions, correspondence
- **Credit files**: Credit memos, spreading worksheets, covenant data, waiver letters
- **KYC packages**: Client onboarding documents, AML screening records
- **Compliance records**: Wall crossing approvals, restricted list decisions, audit exports

**Controls:**
- Access controlled per document (owner-set or by data classification)
- MNPI-classified documents enforce wall crossing controls
- Version history: all versions of every document preserved
- Immutable audit log: every access, download, or modification logged

---

### 7. Restricted List Management

MNPI-aware search and access control:

- **Restricted list integration**: Companies on the institutional restricted list are flagged in Memory
- **Search blocking**: Restricted company documents hidden from non-wall-crossed users
- **Wall crossing workflow**: Analysts who need access request a wall crossing via Connect
- **Temporary access grants**: Post-wall-crossing, access to restricted documents is time-limited and logged
- **Automatic expiry**: Access removed when wall crossing expires

---

### 8. AI Summary of Legacy Documents

Ask questions about old documents without reading them in full:

- Upload or select a document
- Ask Claude: *"What was the valuation methodology used in this pitch?"* or *"What were the key risk factors cited in this credit memo?"*
- Claude reads the document and provides a direct, sourced answer with page references
- Multi-document Q&A: *"Compare the covenant structures across these three credit files"*

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Semantic search indexing | Embed all documents for vector search | Embedding model |
| Document Q&A | Answer questions about specific documents | claude-sonnet-4-6 |
| Multi-document synthesis | Compare and synthesize across multiple documents | claude-opus-4-6 |
| Knowledge article drafting | Draft new articles from prompts | claude-sonnet-4-6 |
| Comparable matching | Find and rank comparable transactions | claude-sonnet-4-6 |
| Expert finder | Identify relevant internal experts | claude-haiku-4-5 |

---

## Data Requirements

### Internal Data (Primary Source)
- All documents produced through Forge
- Transaction records from Pipeline
- Credit files from Credit module
- Meeting notes from Connect
- Manually uploaded legacy documents

### Data Ingestion Pipeline
- **Forge integration**: All Forge-produced documents automatically indexed
- **Bulk ingestion**: Historical documents can be bulk-uploaded and indexed
- **File formats supported**: PDF, DOCX, PPTX, XLSX, TXT
- **Extraction quality**: OCR for scanned PDFs; quality score per document

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Company deal history surfaced in client 360° profile |
| Pipeline | Completed deals automatically archived in Memory |
| Forge | All documents produced in Forge automatically indexed in Memory; Memory search surfaces comps into Forge |
| Credit | Past credit files, covenants, and waivers searchable from Credit module |
| Connect | Meeting notes stored and searchable in Memory |
| Signal | N/A (Signal deals in live external data; Memory deals in internal institutional knowledge) |

---

## UX Principles for this Module

- **Speed is everything**: Search results must return in < 500ms for keyword queries; < 1s for semantic queries
- **Trust through transparency**: Show which document an answer came from; link to source with page reference
- **Progressive detail**: Results show a snippet, not the whole document — click to expand
- **No dead ends**: If a search returns no results, suggest related searches or offer to escalate to a colleague via Expert Finder
- **Forgetting is a feature**: Expired/superseded documents removed from default search scope (still accessible with filters)
