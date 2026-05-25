# ECONOMICS — CredLens Unit Economics & Scaling Math

This document details the financial metrics, customer acquisition costs, and scaling roadmap to generate $1M ARR via CredLens lead generation.

---

## 💰 Unit Economics: Value of a Converted Lead

To calculate the value of a converted lead to **Credex**, we look at the monetization funnel:
- **Core Action**: A startup completes an audit and books a Credex consultation to procure discounted AI credits.
- **Transaction**: Credex sells wholesale AI credits (AWS compute credits, Claude/OpenAI tokens, Cursor team licenses) at a 20% discount. 
- **Margin**: Credex acquires these credits from pivoted/overforecasted companies at a 50% discount. Credex captures a **30% gross margin** on all transacted credits.
- **Contract Size**: An average 10-person startup spends ~$600/month ($7,200/year) on AI tools. Procuring this stack through Credex generates:
  - Monthly compute volume: $480 (after 20% customer discount)
  - Monthly gross profit for Credex (30% margin): **$144/month**
  - **Annual Contract Value (ACV) Profit**: **$1,728/year** per converted startup.
  - **Customer Lifetime Value (LTV)**: Assuming an average B2B SaaS startup retention of 30 months (2.5 years), a converted startup represents **$4,320 in LTV**.

---

## 🎯 Customer Acquisition Cost (CAC) Targets

Using our $0 budget organic channels from the GTM plan:
- **Hacker News Launch**: $0 media spend. Internal engineering time: 5 hours (~$250 soft cost). Expected leads: 30. **Effective CAC: $8.33**.
- **Twitter/X Micro-Auditing**: $0 media spend. Ops team outreach: 15 hours/week (~$300 soft cost). Expected leads: 15/week. **Effective CAC: $20.00**.
- **CTO Cold Email Outreach**: Email domain setup & tools: $100/mo. Expected leads: 10/mo. **Effective CAC: $10.00**.

**Blended CAC Target**: **$12.77 per lead**. Since our LTV per converted customer is $4,320, we maintain a highly lucrative LTV:CAC ratio.

---

## 📊 Conversion Funnel: Profitability Thresholds

To run a profitable lead generation loop, we evaluate the conversion thresholds:

```text
[1,000 Visitors] 
       ↓ 20% conversion (SaaS industry standard for interactive calculators)
  [200 Audits Completed]
       ↓ 15% conversion (SaaS lead gate conversion)
    [30 Lead Emails Captured]
         ↓ 10% conversion (High-savings consultation booking rate)
      [3 Consultations Booked]
           ↓ 33% close rate (Consultation to active transaction conversion)
        [1 Converted Customer (LTV: $4,320)]
```

### Break-Even Analysis
- Total Cost to acquire 1,000 visitors (assuming paid advertising scale at $1.50 CPC in future): **$1,500**.
- Converted customer LTV profit generated: **$4,320**.
- **Net Profit**: **$2,820** per 1,000 visitors.
- **Minimum Conversion Rate to Break Even**: An overall visitor-to-customer conversion rate of **0.035%** (1 customer out of 2,850 visitors) makes the loop profitable.

---

## 📈 Roadmap to $1M ARR in 18 Months

To scale CredLens + Credex to $1M in Annual Recurring Revenue (ARR), we need to reach **$83,333 in monthly transacted compute margins**.

### The Math:
1. **Target Startup Profile**: Average 15-person engineering team spending $900/mo on AI seats.
2. **Gross Margin per Startup**: $270/mo ($3,240/year).
3. **Active Startup Customers Required**: **308 active startups** transacting their AI credits through Credex.

### Phase 1: Months 1–6 (The Organic Baseline)
- Target: Acquire first 50 startup customers using GTM methods.
- Focus: Highly manual founder cold-DMs, Hacker News launches, and YC community distribution.
- Run-Rate: Reach $13,500/mo margin ($162k ARR).

### Phase 2: Months 7–12 (Paid Scale & Integrations)
- Target: Reach 150 startup customers.
- Channels: Paid LinkedIn/X ads targeting CTOs with copy matching audit benchmarks: *"Is your team overspending on Cursor? Run a free stack audit: [URL]"*.
- Run-Rate: Reach $40,500/mo margin ($486k ARR).

### Phase 3: Months 13–18 (The Developer Widget Loop)
- Target: Reach 308 startup customers.
- Channel: Deploy our **Free AI Audit Widget** (from our bonus deliverables). Partner with popular tech blogs, SaaS directories, and credit providers (like Brex or Ramp) to embed our spend auditor on their partner portals.
- Run-Rate: Reach $83,333/mo margin ($1.0M ARR).
