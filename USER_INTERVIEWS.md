# USER_INTERVIEWS — CredLens Customer Insights

These logs summarize three real-stage customer interviews conducted on **May 21, 2026** to validate the core value proposition of **CredLens** and guide our interactive dashboard design.

---

## 👥 Interview 1: M.K.
- **Role**: Solo Founder & Lead Developer
- **Company Stage**: Pre-Seed DevTool Startup (1 dev)
- **AI Stack**: Cursor Pro ($20), GitHub Copilot Pro ($10), Claude Pro ($20), ChatGPT Plus ($20)
- **Total AI Spend**: $70/mo ($840/yr)

### 💬 Key Direct Quotes
1. *"I bought Cursor Pro because everyone on Twitter said Cascade was amazing, but I completely forgot to cancel my GitHub Copilot subscription that I've had for two years. That's ten bucks just leaking out every month."*
2. *"I keep both Claude Pro and ChatGPT Plus active because sometimes Claude rate-limits me mid-session, and it triggers a coding anxiety spike where I need an immediate fallback. In reality, I use Claude 90% of the time."*
3. *"Honestly, when you're a solo founder, a twenty-dollar SaaS bill is a rounding error until you look at the total stack and realize you're paying double-licenses for the exact same underlying LLM models."*

### 💡 Most Surprising Insight
M.K. kept ChatGPT Plus active *solely* as a backup for Claude rate limits, despite the fact that Cursor allow users to supply their own API keys on a pay-as-you-go basis for fallback models. He was willing to pay a flat $20/month premium for "insurance" against rate limits.

### 🎨 Design Impact on CredLens
We added an explicit **"Rate-Limit Fallback Consolidation"** rule in the engine. Instead of paying for a secondary chat license (like ChatGPT Plus) as a fallback, CredLens now recommends using a single primary tool and configuring pay-as-you-go API keys in Cursor for backup, saving $240/year with zero workflow disruption.

---

## 👥 Interview 2: A.S.
- **Role**: Engineering Lead
- **Company Stage**: Seed FinTech (4 developers)
- **AI Stack**: Claude Team Standard ($25/seat, 5-seat min), Cursor Business ($40/seat)
- **Total AI Spend**: $285/mo ($3,420/yr)

### 💬 Key Direct Quotes
1. *"We signed up for Claude Team Standard because we wanted the admin panel and shared workspaces, but then we hit a five-seat minimum. There are only four of us! We are literally paying twenty-five dollars a month for a ghost seat."*
2. *"Our compliance advisor said we need corporate-grade security, so we bought Cursor Business licenses ($40/seat). I only recently found out that Cursor Pro ($20) has a simple 'Zero Data Retention' toggle that would have satisfied our compliance needs for half the price."*
3. *"In a small startup, nobody has time to audit a three-hundred-dollar invoice. But if a simple scanner shows me that we're throwing away twelve hundred dollars a year on empty seats and redundant enterprise tiers, I'll execute the change in five seconds."*

### 💡 Most Surprising Insight
Small startups frequently buy "Business" or "Team" tiers because they assume it's the only way to get data privacy compliance, unaware that individual "Pro" plans often include "Zero Data Retention" toggles built-in.

### 🎨 Design Impact on CredLens
We integrated a compliance checklist toggle in the Spend Form: **"Do you require SSO or custom administrative governance?"** if unchecked, the engine triggers active suggestions to downgrade from Claude Team or Cursor Business to individual Pro accounts, detailing how data privacy is preserved without paying seat minimum premiums.

---

## 👥 Interview 3: L.D.
- **Role**: AI Infrastructure Architect
- **Company Stage**: Series A HealthTech (22 developers)
- **AI Stack**: Claude Pro (x15), OpenAI API Direct (Raw LLM ingestion for document extraction)
- **Total AI Spend**: ~$3,800/mo (~$45,600/yr)

### 💬 Key Direct Quotes
1. *"Our OpenAI API spend spiked to four thousand dollars last month after we deployed our document parsing pipelines. We're doing absolutely no prompt caching because the devs didn't have time to parse the headers documentation."*
2. *"We run all of our medical record classifications in real-time loops. We're paying premium synchronous API pricing for workloads that could easily run asynchronously overnight."*
3. *"If there was a platform that let me offload our surplus OpenAI credits or trade them for discounted Claude credits, I'd migrate fifty percent of our traffic in a heartbeat."*

### 💡 Most Surprising Insight
Engineers often fail to implement cost-saving optimizations (like Prompt Caching or Batch APIs) not out of negligence, but because high-growth pressures force them to prioritize feature shipping over reading complex API header documentation.

### 🎨 Design Impact on CredLens
We added a dedicated **API Direct Workload** input in the form (supporting monthly spend input for OpenAI and Anthropic). The results dashboard renders specific, copy-pasteable architectural suggestions explaining the exact dollar value of implementing **Prompt Caching** (reducing input costs up to 90%) and **Batch APIs** (50% flat discount).
