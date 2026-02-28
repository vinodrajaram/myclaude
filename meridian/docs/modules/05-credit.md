# Module 05: Meridian Credit — Risk Co-pilot

## Purpose

Meridian Credit is the AI co-pilot for credit analysis and portfolio risk management. It makes credit analysis faster, more consistent, and more proactive — from initial underwriting through ongoing monitoring across the entire portfolio.

The defining question Credit answers: **"What is the credit quality of this borrower, and is it getting better or worse?"**

---

## Target Personas

| Persona | Usage Pattern |
|---------|--------------|
| Credit Analyst | Primary user — credit memos, financial spreading, annual reviews |
| Credit Officer | Portfolio oversight, approval preparation, early warning monitoring |
| RM (Corporate Banking) | Understanding credit appetite, client credit health, renewal timing |
| Portfolio Manager | Portfolio risk analytics, concentration monitoring, stress testing |

---

## Key Features

### 1. AI Credit Memo Population

The most time-consuming task in corporate banking — automated:

**Process flow:**
1. Credit analyst opens a new credit application
2. Links the borrower (from Intelligence module)
3. Uploads client-provided financial statements and management accounts (PDF/Excel)
4. Clicks "Generate Draft"

**What Claude produces:**
- **Borrower description**: Business overview, ownership, management — sourced from Intelligence
- **Purpose and use of proceeds**: Pre-populated from deal context (Pipeline)
- **Financial analysis**: 3-year spreading with ratio analysis and commentary — extracted from uploaded docs
- **Industry and market context**: Sector overview, peer comparison — sourced from Signal
- **Risk assessment**: SWOT-style credit risk analysis with evidence
- **Covenant recommendation**: Suggested financial covenants based on financial profile and market precedent
- **Credit recommendation**: Summary and recommended rating

**Human review is mandatory**: Every AI-drafted section is clearly marked as AI-generated. The credit analyst reviews, edits, and owns the final document.

---

### 2. Financial Spreading (AI Extraction)

Manual financial spreading (entering client financials into a credit model) takes 4–6 hours per company. Forge's AI extraction reduces this to minutes:

- **Upload documents**: PDF financial statements, management accounts, Excel files
- **AI extracts**: Income statement, balance sheet, cash flow — per period
- **Normalizes**: Adjusts for one-offs, classifies line items to standard schema
- **Calculates ratios**: Leverage, coverage, liquidity, profitability — automatically
- **Flags anomalies**: Unusual items, inconsistencies, missing periods flagged for analyst review

**Accuracy**: AI extraction reviewed by analyst before acceptance. Every extracted figure shows source document page reference.

---

### 3. Covenant Monitoring Dashboard

Real-time view of covenant compliance across the portfolio:

**Per facility view:**
- Each financial covenant with threshold, current value, headroom (%)
- Headroom trend (last 4 test periods)
- Next test date countdown
- Waiver history

**Breach probability forecast:**
- Based on current financial trajectory, estimates probability of covenant breach at next test date
- Flags names where breach probability > 25% for proactive management

**Portfolio covenant summary:**
- How many facilities have covenants testing in next 30 / 60 / 90 days
- Distribution of headroom across portfolio (histogram)
- Names with tight headroom requiring active monitoring

**Alert system:**
- Automatic alert to Credit Analyst and RM when headroom drops below configurable threshold (default: 15%)
- Escalation to Credit Officer when below critical threshold (default: 5%)

---

### 4. Portfolio Risk Dashboard

Aggregate view of the entire credit portfolio for Credit Officers and Portfolio Managers:

**Portfolio composition:**
- Exposure by sector, geography, product type, facility type
- Exposure by internal rating band
- Tenor profile: maturity wall visualization

**Risk quality:**
- EWI score distribution across portfolio
- Watchlist names and counts
- Names in waiver or amendment
- Potential breach names (covenant headroom tight)

**Concentration risk:**
- Sector concentration vs. risk appetite limits
- Single-name concentration vs. limits
- Country exposure

**Portfolio trend:**
- Month-over-month portfolio quality change
- Upgrades and downgrades in the period
- New credits added vs. repaid/expired

---

### 5. Early Warning Indicator (EWI) System

Proactive credit deterioration detection:

**EWI score components (0-100, lower is better):**

| Indicator | Weight | Source |
|-----------|--------|--------|
| Revenue growth trend | 15% | Financial spreading data |
| EBITDA margin trend | 15% | Financial spreading data |
| Leverage trend | 20% | Financial spreading data |
| Liquidity position | 15% | Financial spreading data |
| Earnings vs. analyst consensus | 10% | Signal module |
| Credit rating trend | 10% | Signal module |
| News sentiment score | 5% | Signal module |
| Covenant headroom | 10% | Covenant monitoring |

**EWI categories:**
- `GREEN` (0–30): No elevated risk
- `AMBER` (31–60): Monitor closely — some indicators deteriorating
- `RED` (61–80): Elevated risk — proactive engagement required
- `CRITICAL` (81–100): Immediate attention — escalation to Credit Officer

**EWI trend tracking**: Score tracked quarterly. Deteriorating trend triggers automatic alert regardless of absolute score.

---

### 6. Credit Scenario Modelling

Stress test individual credits or the whole portfolio:

**Single-credit stress testing:**
- Apply revenue shock (-10%, -20%, -30%) → see covenant impact
- Apply rate increase scenario → see interest coverage impact
- Apply sector-specific stress → see combined impact on credit metrics
- Claude narrates the scenario output in plain English

**Portfolio stress testing:**
- Apply macro scenario (recession, rate shock) to entire portfolio
- See distribution shift in EWI scores and breach probability
- Identify most vulnerable names
- Estimate expected loss impact

---

### 7. Annual Review Automation (Corporate Banking)

Annual credit reviews pre-populated from existing data:

- Updated financials (from most recent spreading)
- Period-over-period financial comparison with commentary
- Covenant performance history
- EWI trend and current score
- Relationship activity summary (from Intelligence / Connect)
- Updated risk assessment with credit event annotations

Analyst provides credit judgment, updates recommendation, and finalizes. Estimated time saving: 3–4 hours per annual review.

---

### 8. Waiver and Amendment Tracking

Structured workflow for covenant waivers and facility amendments:

- **Waiver request**: Log reason, covenant affected, proposed new level or waiver period
- **Approval workflow**: Credit officer review and approval in Connect
- **History**: Full record of all waivers and amendments per facility
- **Pattern detection**: AI flags when a borrower has had 3+ waivers (systemic weakness signal)

---

## AI Touchpoints

| Feature | AI Role | Model |
|---------|---------|-------|
| Credit memo drafting | Full document generation from structured data | claude-opus-4-6 |
| Financial spreading | Extract and normalize financials from PDFs | claude-sonnet-4-6 |
| EWI narrative | Plain-English explanation of EWI score and trend | claude-haiku-4-5 |
| Scenario narrative | Describe stress test results in credit language | claude-sonnet-4-6 |
| Covenant recommendation | Suggest appropriate covenant levels from comps | claude-sonnet-4-6 |
| Waiver pattern alert | Flag serial waivers as structural concern | claude-haiku-4-5 |
| Annual review drafting | Pre-populate annual review from updated data | claude-sonnet-4-6 |

---

## Data Requirements

### Internal Data
- Credit facility records and covenant definitions
- Historical covenant test results
- Credit memo and annual review history
- EWI history per borrower
- Waiver and amendment history
- Deal records (from Pipeline)

### External Data
- Company financials: public filings (Signal/Intelligence) + client-provided documents
- Rating agency feeds: Moody's, S&P, Fitch (via Signal)
- News: credit-relevant company news (via Signal)
- Market data: industry benchmarks, loan market data
- Sector credit benchmarks: peer leverage, coverage ratios

---

## Module Interactions

| Module | Interaction |
|--------|------------|
| Intelligence | Company profile, financial data, management background populate credit memo |
| Pipeline | Deal context (purpose, amount, structure) pre-populates credit application |
| Signal | Credit events (rating changes, earnings misses) feed EWI; macro data for stress tests |
| Forge | Credit memo generated in Forge with Credit data; annual review documents produced |
| Connect | Waiver approvals and credit decisions flow through Connect workflow |
| Memory | Precedent credit structures, past credit memos searchable |

---

## Compliance Considerations

- All AI-generated credit assessments clearly marked as AI drafts
- Credit recommendation requires human signature/approval — AI does not make credit decisions
- Audit trail for every AI generation event
- Stress test assumptions documented and version-controlled
- Access to credit files restricted to credit analysts, credit officers, and relevant RMs
