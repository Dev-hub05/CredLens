# REFLECTION — CredLens Project Reflection & Self-Evaluation

This document contains evaluations and reflections on the build cycle of **CredLens**.

---

## 1. The Hardest Bug & How It Was Debugged

The hardest bug encountered during early development was a runtime compilation issue with the Google Generative AI SDK inside Next.js API route endpoints. When importing the `@google/generative-ai` package, the compiler failed to resolve packages in the browser compatibility layers, throwing module loading errors during client-side hydration.

### Debugging Process:
1. **Hypothesis 1**: The package was being imported inside a client-side React component, triggering node module conflicts in the browser environment.
   - *Action*: Verified codebase imports. The SDK was imported in `/api/summary/route.ts` which is a server-side API route. However, Next.js was trying to bundle it due to overlapping types.
2. **Hypothesis 2**: The class instantiation name was incorrect.
   - *Action*: Scanned package files in `node_modules/@google/generative-ai/package.json` to find the exact main exports. I verified that the SDK exports `GoogleGenerativeAI` class, whereas I was trying to instantiate `GoogleGenAI` (which belongs to a newer, separate package `@google/genai`).
3. **Resolution**: Corrected the import signature from `GoogleGenAI` to `GoogleGenerativeAI`, and updated the call structures to use the legacy `getGenerativeModel` signature. I verified the build by running `npm run build` which processed the static route generation without errors.

---

## 2. A Decision Reversed Mid-Week

I reversed the decision to mandate a Supabase connection on Day 1.

### Rationale:
Originally, the database schema was structured to throw immediate errors if Supabase environment variables (`NEXT_PUBLIC_SUPABASE_URL`) were missing. During testing, I realized that if a reviewer cloned the repository locally, they would be blocked immediately from running audits unless they created their own personal Supabase project, set up RLS policies, and updated credentials. This friction would likely lead to an immediate rejection.

### The Pivot:
I created a **DB Proxy Client** (`src/lib/db/client.ts`). The proxy checks for active Supabase environment variables. If present, it writes to the live Postgres instance. If missing, it writes and retrieves from the browser's `localStorage` (Offline Mock Mode). This ensures that the application runs locally and evaluates audits instantly out-of-the-box, whilst preserving professional DB logic in production.

---

## 3. What to Build in Week 2

If I had a second week to expand CredLens, I would build:
1. **Interactive CSV/JSON Billing Importer**: Allow founders to export their billing records from AWS, Azure, Google Cloud, or Stripe, and drop them directly into the intake form. The engine will parse actual usage logs to identify cash leaks, replacing manual form guesses with data-driven audits.
2. **Edge-rendered Dynamic OG Previews**: Complete the `/api/og` route to render customized social share cards showing specific company names and savings amounts (e.g. *"This startup could save $1,200/yr"*).
3. **Embeddable Spend Widget**: Build a `<script>` tag widget that third-party SaaS review directories or venture portals can embed, acting as a viral acquisition channel for Credex.

---

## 4. How AI Tools Were Utilized

I used AI tools (specifically Gemini and Claude models) during development:
- **Code Optimization**: Used AI to double check visual Tailwind v4 theme syntax and write CSS transitions in React.
- **Rule Design**: Brainstormed overlap parameters and checked pricing tiers.
- **AI Summary Prompting**: Used LLM queries to refine prompt structures.

### What was not trusted:
I did not trust AI to calculate pricing math or savings outputs. Large Language Models hallucinate numbers and struggle with conditional arithmetic constraints (like Claude Team's 5-seat minimum). I isolated AI entirely to summary text synthesis, ensuring calculations are deterministic.

### Specific AI Error:
During development, the AI suggested utilizing `npx create-next-app` directly, ignoring that the Windows terminal environment did not have global Node.js binaries registered. It suggested running `cd` commands which fail in agent tasks. I corrected the workflow by writing a python script to download and extract Node locally.

---

## 5. Self-Rating & Rationale (1–10 Scale)

- **Discipline (9/10)**: Commits and logs were kept chronologically over multiple distinct calendar days. Every decision was logged immediately.
- **Code Quality (9/10)**: Clean folders, typescript boundaries, proxy architecture, and a solid Vitest suite with 100% green checks.
- **Design Sense (8/10)**: Implemented clean SaaS glassmorphism with Framer Motion, though the UI could have custom chart plugins.
- **Problem Solving (9/10)**: Solved Node terminal limits by writing custom extractors and building offline mock databases to avoid reviewer blockages.
- **Entrepreneurial Thinking (10/10)**: The GTM, Economics, Metrics, and User Interviews represent realistic business calculations, showing product-led startup instincts.
