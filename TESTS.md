# TESTS — CredLens Automated Verification Suite

This document lists all automated test cases written for the **CredLens** deterministic spend optimization engine.

---

## 🧪 Vitest Test Suite: `src/__tests__/engine.test.ts`

### 1. IDE Redundancy Test
- **Description**: Validates that if a team has both Cursor Pro and GitHub Copilot Pro active, the engine identifies the duplication and recommends replacing/dropping Copilot to save licensing costs.
- **Assertions**: Matches recommended action as `"replace"` and checks that monthly savings match the Copilot Pro baseline cost ($20/mo).

### 2. Chat Interface Overlap Test
- **Description**: Validates use case alignment. For coding-heavy teams, the engine recommends keeping Claude Pro and downgrading ChatGPT Plus to the Free plan.
- **Assertions**: Verifies ChatGPT is recommended for a `"downgrade"` with recommended plan `"Free"`.

### 3. Claude Team Minimum Seat Waste Test
- **Description**: Claude Team Standard has a 5-seat minimum limit ($125/mo). This test checks if a team size of 2 on Claude Team is flagged to downgrade to individual Pro accounts.
- **Assertions**: Verifies recommended plan `"Pro (Individual)"` and checks that savings equal $85/mo ($125 current - $40 optimized).

### 4. ChatGPT Business Minimum Seat Waste Test
- **Description**: ChatGPT Business has a 2-seat minimum limit ($50/mo). This test checks if a single founder on ChatGPT Business is recommended to switch to ChatGPT Plus ($20/mo).
- **Assertions**: Verifies recommended action as `"downgrade"`, recommended plan as `"Plus"`, and savings of $30/mo.

### 5. API Direct Workspace Optimization Test
- **Description**: Startups with large raw API consumption are flagged for token optimizations.
- **Assertions**: Verifies API tools recommend an upgrade to `"API Direct (Optimized)"` and suggest a 35% cost reduction from raw input volumes via Caching and Batch protocols.

### 6. Healthy Stack Verification Test
- **Description**: Validates that if a user has a fully optimal stack (e.g. 1 user on a lightweight ChatGPT Go plan), no false savings are manufactured.
- **Assertions**: Verifies total savings equal $0, `isOptimal` is `true`, health score is `100%`, and the recommended action is `"keep"`.

---

## 🚀 How to Run the Tests

### Local Execution
To run the Vitest test suite locally in execution mode, run:
```bash
npm run test
```

To run the tests in interactive watch mode:
```bash
npx vitest
```

### CI/CD Pipeline
Tests are executed automatically on every commit push or pull request to the `main` or `master` branches via GitHub Actions.
Workflow File: `.github/workflows/ci.yml`
