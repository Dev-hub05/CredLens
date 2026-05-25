# METRICS — CredLens Analytics & Instrumentation Strategy

This document details the tracking metrics, instrumentations, and data-driven pivot triggers to measure the operational value of **CredLens**.

---

## 🌟 The North Star Metric

Our single North Star Metric is:
> **Total Identified Monthly Savings (TIMS) from Captured Leads**

### Why this is the North Star:
- Unlike generic vanity metrics like "Daily Active Users" or "Page Views", TIMS directly aligns customer value (reclaimed SaaS budget) with Credex business value (potential compute credit swap pipeline).
- If a startup runs an audit, inputs their data, saves their email, and sees $300/mo in savings, that $300 represents both a delighted founder and a high-intent $300 credit acquisition pipeline for Credex. If TIMS is growing, our business pipeline is growing.

---

## 📊 The 3 Input Metrics

To drive our North Star, we track and optimize three input metrics:

### 1. Audit Completion Rate (ACR)
- **Definition**: The percentage of landing page visitors who complete the multi-step configuration form and generate a result report.
- **Goal**: > 25% conversion.
- **Impact**: Drives the overall volume of audits, feeding the top of our savings pipeline.

### 2. Lead Capture Rate (LCR)
- **Definition**: The percentage of audit-completed users who submit their email and company details inside our results panel.
- **Goal**: > 15% conversion.
- **Impact**: Connects anonymous audits to concrete pipeline opportunities for Credex representatives.

### 3. Average Savings Opportunity (ASO)
- **Definition**: The average monthly dollar savings identified per completed audit.
- **Goal**: > $150 per audit.
- **Impact**: Measures the optimization density of the stacks being audited. If ASO drops too low, it means we are driving users who already have optimal stacks (less valuable for credit swapping).

---

## 🛠️ Instrumentation Setup

We will instrument tracking on our Next.js pages using lightweight tools (Vercel Web Analytics & PostHog):

1. **Intake Flow Progressions**:
   - Event: `step_completed` (properties: `step_number`, `team_size`).
   - Diagnostic: Tracks step-by-step drop-offs to optimize form simplicity.
2. **Audit Submissions**:
   - Event: `audit_submitted` (properties: `total_spend`, `total_savings`, `tools_count`).
   - Diagnostic: Feeds our ASO calculation and segments leads.
3. **Lead Captures**:
   - Event: `lead_captured` (properties: `role`, `company_added: true/false`, `savings_bracket`).
   - Diagnostic: Triggers automated onboarding drips in PostHog.
4. **Copy Link Shares**:
   - Event: `report_copied` (properties: `savings_value`).
   - Diagnostic: Measures the viral sharing coefficient.

---

## 🚨 Quantitative Pivot Triggers

If after 60 days of launch we hit any of these thresholds, we will pivot:

| Observed Metric | Threshold | Diagnosis | Pivot Action |
|-----------------|-----------|-----------|--------------|
| **Audit Completion (ACR)** | < 10% | Form is too long or fields are confusing. | Reduce Step 3 detail fields; merge tool configuration inputs into a single slider. |
| **Lead Capture (LCR)** | < 5% | Value proposition of saving the report is weak. | Increase the strength of the lead gate; introduce a "Download PDF" hook or lock the full detailed breakdown. |
| **Consultation Rate** | < 2% of high-savings | Credex compute swap proposition isn't compelling. | Revise marketing copy to highlight AWS/GCP credit swap capability instead of custom consultation language. |
