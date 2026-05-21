import { ToolInput } from "./types";

export interface PricingPlan {
  planId: string;
  displayName: string;
  pricePerSeatMonth: number;
  minSeats?: number;
  features: string[];
}

export interface ToolPricing {
  toolId: string;
  displayName: string;
  pricingPageUrl: string;
  lastUpdated: string;
  plans: Record<string, PricingPlan>;
}

export const PRICING_DATABASE: Record<string, ToolPricing> = {
  cursor: {
    toolId: "cursor",
    displayName: "Cursor",
    pricingPageUrl: "https://cursor.sh/pricing",
    lastUpdated: "2026-05-21",
    plans: {
      hobby: { planId: "hobby", displayName: "Hobby", pricePerSeatMonth: 0, features: ["Limited Tab completions", "25 daily agent requests"] },
      pro: { planId: "pro", displayName: "Pro", pricePerSeatMonth: 20, features: ["Unlimited Tab completions", "500 fast requests", "$20 credit pool"] },
      business: { planId: "business", displayName: "Business", pricePerSeatMonth: 40, features: ["Centralized billing", "Admin dashboard", "SAML SSO", "Shared rules"] },
      enterprise: { planId: "enterprise", displayName: "Enterprise", pricePerSeatMonth: 100, minSeats: 5, features: ["Granular admin controls", "Pooled usage", "SCIM provisioning"] }
    }
  },
  copilot: {
    toolId: "copilot",
    displayName: "GitHub Copilot",
    pricingPageUrl: "https://github.com/features/copilot#pricing",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["Basic code completions", "Light chat use"] },
      pro: { planId: "pro", displayName: "Pro (Individual)", pricePerSeatMonth: 10, features: ["Unlimited code completions", "Advanced Chat", "$10 AI credits"] },
      business: { planId: "business", displayName: "Business", pricePerSeatMonth: 19, features: ["SSO", "IP filtering", "Organization management", "Pooled credits"] },
      enterprise: { planId: "enterprise", displayName: "Enterprise", pricePerSeatMonth: 39, features: ["Custom fine-tuning", "GitHub Enterprise Cloud required", "Advanced compliance"] }
    }
  },
  claude: {
    toolId: "claude",
    displayName: "Claude",
    pricingPageUrl: "https://www.anthropic.com/claude",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["Basic access to Claude Sonnet"] },
      pro: { planId: "pro", displayName: "Pro", pricePerSeatMonth: 20, features: ["5x usage vs Free", "Opus access", "Claude Code access"] },
      max_5x: { planId: "max_5x", displayName: "Max (5x)", pricePerSeatMonth: 100, features: ["Priority access", "5x Pro usage limits"] },
      max_20x: { planId: "max_20x", displayName: "Max (20x)", pricePerSeatMonth: 200, features: ["Highest capacity", "20x Pro usage limits"] },
      team_standard: { planId: "team_standard", displayName: "Team Standard", pricePerSeatMonth: 25, minSeats: 5, features: ["Admin tools", "SSO integration", "Shared workspaces"] },
      team_premium: { planId: "team_premium", displayName: "Team Premium", pricePerSeatMonth: 125, minSeats: 5, features: ["5x Team Standard usage limits", "Admin tools"] },
      enterprise: { planId: "enterprise", displayName: "Enterprise", pricePerSeatMonth: 60, minSeats: 10, features: ["SSO/SCIM", "Custom data retention", "Contractual indemnity"] },
      api: { planId: "api", displayName: "API Direct", pricePerSeatMonth: 0, features: ["Pay-as-you-go token access"] }
    }
  },
  chatgpt: {
    toolId: "chatgpt",
    displayName: "ChatGPT",
    pricingPageUrl: "https://openai.com/chatgpt/pricing",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["Basic access", "Standard GPT-4o"] },
      go: { planId: "go", displayName: "Go", pricePerSeatMonth: 8, features: ["Medium usage", "No advanced reasoning features"] },
      plus: { planId: "plus", displayName: "Plus", pricePerSeatMonth: 20, features: ["Advanced reasoning", "Deep Research access", "5x usage vs Free"] },
      business: { planId: "business", displayName: "Business (Team)", pricePerSeatMonth: 25, minSeats: 2, features: ["Shared workspace", "No training on data", "SSO", "Admin panel"] },
      enterprise: { planId: "enterprise", displayName: "Enterprise", pricePerSeatMonth: 50, minSeats: 150, features: ["Custom data residency", "Dedicated admin support", "SOC 2 Type II"] },
      pro_100: { planId: "pro_100", displayName: "Pro Tier 1", pricePerSeatMonth: 100, features: ["5x Plus message limits", "Expanded Codex usage"] },
      pro_200: { planId: "pro_200", displayName: "Pro Tier 2", pricePerSeatMonth: 200, features: ["20x Plus limits", "1M context window", "Extra Deep Research"] },
      api: { planId: "api", displayName: "API Direct", pricePerSeatMonth: 0, features: ["Pay-as-you-go model execution"] }
    }
  },
  gemini: {
    toolId: "gemini",
    displayName: "Google Gemini",
    pricingPageUrl: "https://gemini.google.com/advanced",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["Basic web Gemini access"] },
      plus: { planId: "plus", displayName: "AI Plus", pricePerSeatMonth: 8, features: ["Slightly enhanced limits", "No advanced storage"] },
      pro: { planId: "pro", displayName: "AI Pro (Advanced)", pricePerSeatMonth: 20, features: ["Gemini 3.1 Pro", "1M context window", "2TB storage"] },
      ultra_99: { planId: "ultra_99", displayName: "AI Ultra (Entry)", pricePerSeatMonth: 100, features: ["5x Pro limits", "20TB storage", "YouTube Premium bundled"] },
      ultra_199: { planId: "ultra_199", displayName: "AI Ultra (Top)", pricePerSeatMonth: 200, features: ["20x Pro limits", "Access to Project Genie"] },
      business: { planId: "business", displayName: "Workspace Standard", pricePerSeatMonth: 20, features: ["Gemini integrated in Workspace apps", "Basic admin controls"] },
      enterprise: { planId: "enterprise", displayName: "Workspace Plus", pricePerSeatMonth: 30, features: ["Enterprise-grade security", "Advanced data privacy controls"] }
    }
  },
  windsurf: {
    toolId: "windsurf",
    displayName: "Windsurf",
    pricingPageUrl: "https://codeium.com/windsurf/pricing",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["25 monthly credits", "Unlimited code completions"] },
      pro: { planId: "pro", displayName: "Pro", pricePerSeatMonth: 15, features: ["500 monthly credits", "Cascade multi-file editing"] },
      teams: { planId: "teams", displayName: "Teams", pricePerSeatMonth: 30, features: ["Centralized admin", "500 pooled credits/user", "Priority support"] },
      enterprise: { planId: "enterprise", displayName: "Enterprise", pricePerSeatMonth: 60, minSeats: 15, features: ["SSO", "RBAC compliance", "SOC 2, HIPAA"] }
    }
  },
  v0: {
    toolId: "v0",
    displayName: "v0.dev",
    pricingPageUrl: "https://v0.dev/pricing",
    lastUpdated: "2026-05-21",
    plans: {
      free: { planId: "free", displayName: "Free", pricePerSeatMonth: 0, features: ["$5 monthly credits", "7 messages/day limit"] },
      premium: { planId: "premium", displayName: "Premium", pricePerSeatMonth: 20, features: ["$20 monthly credits", "Unlimited messages", "Figma imports"] },
      team: { planId: "team", displayName: "Team", pricePerSeatMonth: 30, features: ["$30 pooled credits/user", "Shared workspaces"] },
      business: { planId: "business", displayName: "Business", pricePerSeatMonth: 100, features: ["Data privacy (opt-out of AI training)", "Figma, unlimited usage"] }
    }
  }
};

/**
 * Helper to calculate cost for a given ToolInput using the pricing database
 */
export function calculateInputCost(input: ToolInput): number {
  // If the user manually provided a custom API spend or customized spend, respect it
  if (input.planId === "api" || input.monthlySpend > 0 && input.seats === 0) {
    return input.monthlySpend;
  }
  
  const toolPricing = PRICING_DATABASE[input.toolId];
  if (!toolPricing) return 0;
  
  const plan = toolPricing.plans[input.planId];
  if (!plan) return input.monthlySpend || 0;
  
  const price = plan.pricePerSeatMonth;
  const seats = input.seats || 1;
  
  // Handlers for plans with minimum seat limits
  let activeSeats = seats;
  if (plan.minSeats && seats < plan.minSeats) {
    activeSeats = plan.minSeats;
  }
  
  return activeSeats * price;
}
