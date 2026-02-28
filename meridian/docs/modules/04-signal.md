# Module 04: Meridian Signal — Market Intelligence

## Purpose

Meridian Signal is the real-time intelligence feed that keeps bankers informed about the markets, sectors, and companies that matter to them. It transforms information overload into actionable signal — synthesizing news, filings, market data, and competitive intelligence into a curated, role-personalized view.

The defining question Signal answers: **"What's happening in my market right now, and what does it mean for me?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| MD / Director | Strategic signals: M&A triggers, sector shifts, competitive moves |
| VP / Coverage Banker | Daily intelligence feed, client trigger events, deal opportunity signals |
| Product Banker | Product-specific market conditions: market windows, transaction comps |
| Credit Officer | Credit-relevant events: rating actions, earnings misses, sector stress |
| Business Head | Macro view, sector trends, competitive intelligence |

---

## Key Features

### 1. Personalized Intelligence Feed

The daily "newspaper" for each banker, algorithmically curated:

**Feed composition:**
- Client-specific news (companies in the banker's coverage universe)
- Sector news (sectors the banker covers)
- Product news (market conditions relevant to the banker's product focus)
- Competitive intelligence (deals announced by peer banks in the banker's market)
- Macro signals (interest rates, credit spreads, equity markets — contextualized)

**AI synthesis layer:**
- News articles synthesized to 3–5 sentence summaries
- Relevance scoring: items ranked by likely importance to this specific banker
- Deal signal tagging: articles that imply a deal opportunity are flagged as `TRIGGER_EVENT`
- Deduplication: multiple sources covering the same story collapsed into one item

**Interaction modes:**
- Mark as read, save for later
- One-click to create a deal idea in Pipeline from a trigger event
- Share an item to a colleague with annotation

---

### 2. Sector Monitor

Deep-dive dashboard for a specific sector (e.g., Technology, Energy, Healthcare):

**Content:**
- M&A activity: announced deals, rumoured deals, process signals
- Equity markets: IPOs, follow-ons, index moves, valuation trends
- Credit markets: new issuance, spread movements, rating actions
- Earnings: recent results and guidance, beat/miss summary across the sector
- Key themes: AI-synthesized narrative on what's driving the sector right now
- Notable events: conferences, regulatory changes, macro impacts on the sector

**Customization:** Each banker can follow any number of sectors; new sectors onboarded quickly.

---

### 3. Transaction Comps Tracker

Real-time database of comparable transactions:

- **M&A comps**: Enterprise value, EV/EBITDA, EV/Revenue, deal structure, advisor, timeline
- **ECM comps**: Deal size, pricing, discount, sector, IPO vs. follow-on, bookrunner
- **DCM comps**: Bond terms, spread, maturity, currency, rating, bookrunner
- **LevFin comps**: Leverage multiple, spread, OID, structure, sponsor

**Filtering:** By sector, deal size, date range, geography, deal type.

**AI layer:** "Find me the closest comps to this company" natural language search using embedding similarity.

**Export:** CSV and formatted table for insertion into Forge pitch books.

---

### 4. M&A Signal Detection

Proactive identification of M&A trigger events:

**Signal types monitored:**
- Strategic review announcements
- Activist investor stake disclosures
- CEO/CFO leadership changes at public companies
- Declining earnings / guidance cuts suggesting strategic pressure
- Material asset disposals or acquisitions by conglomerates
- Private equity portfolio company signals (hold period maturity, refinancing)
- Cross-border expansion signals (new market entries, JVs)

**AI classification:** Each detected signal scored for likelihood of leading to a deal opportunity (High / Medium / Low) with rationale.

**Pipeline integration:** High-confidence M&A signals auto-create deal ideas in Meridian Pipeline.

---

### 5. Credit Event Monitoring

For credit-focused bankers and Credit Officers:

**Events monitored per covered credit:**
- Earnings releases: revenue/EBITDA vs. expectations, guidance changes
- Rating agency actions: upgrade, downgrade, outlook changes, watchlist placement
- Covenant headroom: approaching test dates with current estimated headroom
- Debt maturity approaching: names with debt maturing in next 12–24 months
- Liquidity stress: revolver draws, cash burn signals, dividend cuts
- Sector stress: macro events affecting sector credit quality

**Alert configuration:** Bankers configure alert thresholds per covered credit. Credit Officers see alerts for their entire portfolio.

---

### 6. Market Window Analysis

For DCM and ECM product bankers, Signal provides real-time market window assessment:

**DCM indicators:**
- Investment-grade and high-yield spread levels (absolute and vs. historical)
- New issue premium trends (are issuers having to pay up?)
- Order book oversubscription rates (is demand strong?)
- Issuance volume vs. prior year

**ECM indicators:**
- IPO aftermarket performance
- Follow-on discount trends
- Market volatility (VIX)
- Sector P/E vs. historical
- Rights issue performance

**AI interpretation:** Claude provides a daily "market conditions assessment" in plain English: "DCM conditions are favorable for investment-grade issuers — spreads at 12-month lows and recent deals have priced flat to secondary."

---

### 7. Macro Dashboard

Contextualized macro intelligence for banking relevance:

- **Interest rates**: Fed/ECB/BoE policy, yield curve, SOFR/SONIA/Euribor
- **FX**: Major pairs, emerging market FX stress indicators
- **Credit markets**: IG/HY spreads, CDS indices (CDX, iTraxx)
- **Equity markets**: Indices, sector performance, volatility
- **Economic data**: GDP, unemployment, CPI — with banking implications commentary

**AI macro brief**: Weekly 300-word synthesis of macro conditions and implications for banking activity.

---

### 8. Competitor Intelligence

Track what competing banks are doing:

- Mandate announcements: When a competitor wins a mandate, Signal logs it
- League table movements: Real-time league table position changes
- Personnel moves: Senior banker moves between institutions (affects coverage relationships)
- Product launches: New products or capabilities from competitor institutions

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| News synthesis | Summarize articles to 3–5 sentences | claude-haiku-4-5 |
| Relevance scoring | Score item relevance to banker's coverage | claude-haiku-4-5 |
| M&A signal classification | Classify trigger events by deal probability | claude-sonnet-4-6 |
| Market conditions assessment | Daily plain-English market narrative | claude-sonnet-4-6 |
| Macro brief | Weekly synthesis of macro conditions | claude-sonnet-4-6 |
| Sector theme extraction | Identify recurring themes in sector news | claude-sonnet-4-6 |
| Comp search (natural language) | Semantic search for comparable transactions | claude-sonnet-4-6 |

---

## Data Requirements

### External Data Feeds
- **News**: Reuters, Bloomberg News, Dow Jones, Financial Times, regional news sources
- **Public filings**: SEC EDGAR, Companies House, ESMA, regulatory databases
- **Market data**: Bloomberg B-PIPE or FactSet — prices, spreads, volumes
- **M&A databases**: Refinitiv, Dealogic, CapIQ — announced transactions
- **Rating agency feeds**: Moody's, S&P, Fitch — rating actions
- **Alternative data** (future): satellite data, web traffic, hiring signals

### Internal Data
- Banker coverage universe (from user profile + Intelligence module)
- Covered credit names (from Credit module)
- Active deals (from Pipeline — to prioritize relevant signals)

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Signal items enriched with company context from Intelligence; trigger events update company risk scores |
| Pipeline | Trigger events auto-create deal ideas; market condition signals inform deal timing |
| Forge | Transaction comps exported directly into pitch book sections |
| Credit | Credit event monitoring feeds EWI alerts in Credit module |
| Connect | High-priority alerts generate notifications in Connect |

---

## UX Principles for this Module

- **Curated over comprehensive**: Show less, but make every item matter. Bankers should not have to scroll through noise.
- **Signal over information**: Always lead with the interpretation, not the raw fact
- **Configurable by banker**: Every banker's coverage universe is different; the feed must reflect their world
- **Speed**: Feed should load instantly. News must feel current, not stale.
- **One-click action**: Every signal item should have an obvious next action (create deal idea, add to watchlist, share to colleague)
