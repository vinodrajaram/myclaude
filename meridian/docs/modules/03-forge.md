# Module 03: Meridian Forge — Content Factory

## Purpose

Meridian Forge eliminates the single biggest time drain in investment banking: the manual production of pitch books, CIMs, credit memos, briefing notes, and financial analysis narratives. Forge auto-drafts content from structured data, allowing bankers to focus on judgment, strategy, and relationships — not document assembly.

The defining question Forge answers: **"How do I produce great content, fast?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| IB Analyst | Primary user — pitch books, CIMs, financial analysis, precedent transaction summaries |
| IB Associate | Quality review, strategic narrative, deal-specific customization |
| Credit Analyst | Credit memos, annual reviews, financial spreading narratives |
| VP / Director | Executive summaries, client presentations, thought leadership |
| Product Banker | Product-specific pitches, term sheets, transaction summaries |

---

## Key Features

### 1. Pitch Book Generator

The flagship Forge feature. Generates a structured, branded pitch book in minutes:

**Inputs:**
- Target company (auto-populated from Intelligence module)
- Deal type and product (M&A, ECM, DCM, etc.)
- Template selection (standard templates per product/deal type)
- Key messages / angle (banker provides the strategic hook)

**Auto-generated sections:**
1. Executive Summary / Key Themes
2. Company Overview (financials, market position, recent events)
3. Situation Analysis (why now, why us)
4. Transaction Structure / Approach
5. Market Overview (relevant comps, market conditions)
6. Comparable Transactions
7. Valuation Analysis (framework / placeholder for model outputs)
8. Process / Timeline
9. Credentials / League Table
10. Appendix (detailed financials, additional comps)

**Output format:** Structured slide-by-slide content with layout guides, exportable to PowerPoint with brand template applied.

**AI layer:** Claude generates narrative, synthesizes company analysis, and writes section content. Financial data pulled from Intelligence module via tool calls. Comparable transactions fetched from Memory module.

---

### 2. CIM / Offering Memorandum Drafting

For sell-side M&A mandates, Forge generates a full Confidential Information Memorandum:

**Standard CIM Structure:**
1. Executive Summary
2. Investment Highlights
3. Business Overview
4. Products / Services
5. Customers and Market
6. Financial Performance
7. Management Team
8. Growth Strategy
9. Transaction Considerations

**Sources:** Management-provided materials + Intelligence module data + financial model outputs.

**Output:** Word document export, ready for management review and formatting.

---

### 3. Credit Memo Drafting (Corporate Banking)

For credit analysts, Forge pre-populates a full credit application:

**Auto-populated sections:**
- Borrower overview and business description
- Purpose and use of proceeds
- Financial analysis (spreading of last 3 years, ratio analysis, trend commentary)
- Peer benchmarking and industry context
- Risk assessment (macro, sector, company-specific)
- Management and ownership summary
- Facility structure recommendation
- Covenant recommendation
- Conclusion and credit recommendation

**Data sources:** Company financials from Intelligence, credit history from Credit module, industry data from Signal, precedent credits from Memory.

**Human layer:** Credit analyst reviews every AI draft, adjusts analysis, adds judgment. AI provides the structure and data synthesis; human provides the credit judgment.

---

### 4. Briefing Notes & Executive Summaries

Fast-turnaround short-form content:

- **Client meeting briefing**: 1-page summary for banker or executive preparation
- **Market update**: Sector or product market summary for internal distribution
- **Board paper sections**: Summary content for board-level presentations
- **Earnings commentary**: Rapid synthesis of client or comparable company earnings
- **Deal update**: Progress report on a live transaction for internal or client distribution

---

### 5. Financial Analysis Narratives

Convert numerical model outputs into written analysis:

- **Upload model output**: CSV or paste key metrics
- **Generate narrative**: Commentary on performance, trends, and key drivers
- **Peer comparison**: Written analysis of how metrics compare to sector benchmarks
- **Scenario narrative**: Written summaries of bull / base / bear cases

---

### 6. Template Library

Institution-wide library of branded, version-controlled templates:

- **Template types**: Pitch book, CIM, credit memo, board paper, briefing note, tombstone, process letter, term sheet
- **Product variants**: Templates for M&A, ECM, DCM, LevFin, cash management, trade finance
- **Version control**: Retired templates preserved but not surfaced by default; version history maintained
- **Brand enforcement**: Fonts, colors, logo placement locked in master templates
- **Usage analytics**: Which templates are used most; quality scoring from user feedback

---

### 7. Collaborative Editing

Real-time multi-user editing for deal team collaboration:

- **Presence indicators**: See who else is editing
- **Comment threads**: Section-level and line-level comments
- **Version history**: Full edit history with rollback capability
- **Track changes**: Accept/reject mode for senior review
- **AI chat**: Ask Claude questions about the document, request rewrites, or ask for section suggestions — inline
- **Access control**: Document owner controls who can edit vs. comment vs. view

---

### 8. Export Engine

Forge outputs in any format the banker needs:

- **PowerPoint (.pptx)**: Brand template applied, slide-by-slide from Forge layout
- **Word (.docx)**: Formatted document with styles applied
- **PDF**: Watermarked, non-editable for distribution
- **Watermarking**: Auto-applied on PDF export (confidential, recipient name if set)

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Pitch book generation | Full narrative and section content generation | claude-sonnet-4-6 |
| CIM drafting | Long-form document drafting from structured inputs | claude-opus-4-6 |
| Credit memo drafting | Financial narrative, risk sections, recommendation | claude-sonnet-4-6 |
| Financial narrative | Convert numbers to written analysis | claude-sonnet-4-6 |
| Section rewrite | "Make this more concise / more formal / change angle" | claude-haiku-4-5 |
| Inline Q&A | Answer questions about the document in context | claude-sonnet-4-6 |
| Quality check | Review draft for consistency, missing sections, errors | claude-sonnet-4-6 |

---

## Data Requirements

### From Other Modules
- **Intelligence**: Company financials, overview, recent news, deal history
- **Pipeline**: Deal context, deal type, key thesis
- **Signal**: Market conditions, comparable transaction data
- **Memory**: Precedent pitches, CIM structures, comparable transactions, template content

### External Data
- Financial data: Revenue, EBITDA, balance sheet (via Bloomberg/FactSet)
- Transaction comps: M&A multiples, bond terms, equity deal terms
- Market data: Trading multiples, sector benchmarks
- Regulatory filings: Public company disclosures for fundamental data

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Company data auto-populated into pitch; client profile linked to every document |
| Pipeline | Pitch book output linked to deal record; deal stage updates when materials sent |
| Signal | Market data and comparable transactions pulled into pitch content |
| Memory | Past pitches searchable as precedent; output documents saved to Memory |
| Connect | Sharing a finished document triggers a Connect notification/task |

---

## UX Principles for this Module

- **Draft fast, refine easily**: The first AI draft should be good enough to be a starting point within 60 seconds
- **Section granularity**: Each section independently editable, regeneratable, and commentable
- **Context-aware suggestions**: AI suggestions adapt to deal type, banker seniority, and client context
- **Version safety**: Auto-save every 30 seconds; manual checkpoint saves for major milestones
- **Preview-first**: Always show a rendered preview alongside the edit view
