# Meridian Dashboard — Product Requirements

## Vision
Single pane of glass for a banker's entire book of clients. One tab, zero context switching.

## Target Users
- Investment Bankers (coverage, M&A, ECM, DCM)
- Corporate Bankers (lending, treasury)
- Coverage Bankers (relationship owners)

## Core User Stories

1. **Client Book Overview** — As a banker, I can see all my covered clients in a sidebar and click to drill into any one of them.
2. **Client Intelligence** — As a banker, I see revenue, wallet share, lending exposure, risk-adjusted returns, market events, leadership changes, and deal pipeline per client in one scrollable view.
3. **AI Chat Layer** — As a banker, I can ask the AI chat anything about the selected client and get a structured, data-grounded answer.

## Data Modules (per client)

### Revenue & Wallet Share
- YTD revenue, LTM revenue, wallet share %
- 12-month area chart trend
- Revenue breakdown by product (horizontal bars)

### Lending Exposure
- Committed / Drawn / Undrawn totals
- Facility table: type, amount, maturity, status
- Maturity timeline visualization

### Risk-Adjusted Returns
- ROE, RAROC, Revenue vs Cost-of-Capital KPIs
- Deal-level P&L table

### Market Events
- Timeline feed of news & events (newest first)
- Impact classification: positive / negative / neutral
- Stock price widget for public companies

### Leadership Changes
- Card per change with old → new role
- Action Required flag for high-significance changes
- Significance description

### Deal Pipeline
- Active and prospective deals table
- Stage: Pitching | Diligence | Mandate | Closing
- Size, expected close, responsible banker

## AI Chat Layer
- Quick prompts: Summarize client, Next best action, Meeting prep, Key risks
- Free-text input with natural language queries
- Simulated responses grounded in mock client data
- Collapsible panel (360px default)

## Non-Functional Requirements
- Dark terminal aesthetic, no border-radius, square corners
- Gold accent used sparingly (one highlight element per section)
- Cormorant Garamond for display, IBM Plex Mono for data, IBM Plex Sans for body
- Responsive to window resize within the 3-column layout
