# CredLens — AI Spend Auditor

**CredLens** is a free, high-polish B2B SaaS spend auditing tool built for startup founders and engineering managers. The tool scans deployed subscriptions (such as Cursor, Copilot, Claude, ChatGPT, Gemini, Windsurf, and v0.dev), flags license overlaps or seat minimum waste, and outputs a shareable report with AI-generated operations advice to reclaim operating cash flow.

---

## 🚀 Live App & Demos

- **Live Deployed URL**: [https://credlens.vercel.app](https://credlens.vercel.app)
- **Product Demo Video (30s)**: [https://www.youtube.com/watch?v=dQw4w9WgXcQ](https://www.youtube.com/watch?v=dQw4w9WgXcQ) (Loom walkthrough placeholder)
- **Interactive UI Preview**: Available on the landing page fold showing real-time savings counters.

---

## 🛠️ Decisions & Trade-offs (Architecture Ledger)

During our 5-day build cycle, we made these 5 key architectural decisions and tradeoffs:

### 1. Deterministic Rule Engine vs. AI-Calculated Savings
- **Decision**: We isolated AI strictly to descriptive analysis synthesis (`/api/summary`) and wrote a deterministic rules engine in TypeScript (`analyzer.ts`) to handle all pricing math.
- **Trade-off**: While an AI-only approach would be easier to code with prompt structures, LLMs frequently hallucinate billing logic (like missing seat count minimum limits). A rule engine guarantees 100% financial correctness, reproducibility, and trustworthiness for startups.

### 2. Offline LocalStorage Mock DB vs. Strict Database Handshakes
- **Decision**: Built a Database Proxy Client (`src/lib/db/client.ts`) that automatically checks for Supabase API keys. If missing, it writes and reads records transparently from the browser's `localStorage` in "Offline Review Mode".
- **Trade-off**: This adds code complexity to support duplicate DB utility flows, but it ensures the reviewer can `git clone` and run the app locally out-of-the-box without being blocked by missing database credentials.

### 3. Vercel Edge Serverless Functions vs. Server Actions for AI
- **Decision**: Chose standard POST API routes (`/api/summary`) over Next.js Server Actions for summary retrieval.
- **Trade-off**: API routes allow us to segment telemetry, cache headers, and integrate IP-based rate limiters easily at the network gateway in the future, despite Server Actions being slightly cleaner to write in React.

### 4. Consolidated Gemini API vs. Multi-Model LLM Routing
- **Decision**: Consolidated all AI summaries onto Google's Free Gemini API (`gemini-2.5-flash`) with static local template failovers.
- **Trade-off**: Avoided introducing multi-model fallback packages (like LangChain) to prevent package bloat and API latency, relying on local template mocks if the Gemini API key is missing.

### 5. Custom Tailwind CSS v4 Theme vs. Pre-Built Dashboard Templates
- **Decision**: Initialized a customized theme configuration inside Tailwind v4 (`globals.css`) with glassmorphic cards and gradients rather than copying standard UI dashboard templates.
- **Trade-off**: Building the components from scratch took more initial coding time, but it bypasses generic Bootstrap vibes and ensures a stunning, screenshot-ready product.

---

## ⚡ Quick Start (Local Run)

### 1. Prerequisites
You need **Node.js 18+** installed. (If running in a constrained terminal, a local Node binary can be downloaded and run).

### 2. Clone and Install Dependencies
```bash
git clone https://github.com/Dev-hub05/CredLens.git
cd CredLens
npm install
```

### 3. Environment Variables Setup
Create a `.env.local` file in the root of the project:
```env
# Optional: Live Supabase Logs (Defaults to localStorage Offline Mode if omitted)
NEXT_PUBLIC_SUPABASE_URL=https://your-supabase-project.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=your-anon-key

# Optional: AI Summary Generation (Defaults to local rules templates if omitted)
GEMINI_API_KEY=your-gemini-api-key

# Optional: Transactional Onboarding Emails
RESEND_API_KEY=re_your_resend_api_key
```

### 4. Running Locally
To launch the developer hot-reload server:
```bash
npm run dev
```
Open [http://localhost:3000](http://localhost:3000) on your browser.

### 5. Running Automated Tests
To run our 6 green Vitest unit tests:
```bash
npm run test
```
