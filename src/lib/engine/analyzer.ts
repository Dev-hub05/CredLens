import { AuditInput, AuditResult, Recommendation, ToolInput } from "./types";
import { PRICING_DATABASE, calculateInputCost } from "./pricing";

/**
 * Audit Engine Analyzer - Deterministic Financial Optimizer for AI Stacks
 */
export function runAudit(input: AuditInput): AuditResult {
  const { teamSize, useCase, tools } = input;
  const recommendations: Recommendation[] = [];
  
  // Calculate total current spend based on inputs
  let totalCurrentSpend = 0;
  const toolsMap = new Map<string, ToolInput>();
  
  for (const tool of tools) {
    const cost = calculateInputCost(tool);
    totalCurrentSpend += cost;
    toolsMap.set(tool.toolId, { ...tool, monthlySpend: cost }); // Store normalized cost
  }
  
  // Track tools being kept or replaced
  const activeToolIds = new Set(tools.map(t => t.toolId));
  
  // --- RULE 1: IDE OVERLAPS (Cursor vs GitHub Copilot vs Windsurf) ---
  const hasCursor = activeToolIds.has("cursor");
  const hasCopilot = activeToolIds.has("copilot");
  const hasWindsurf = activeToolIds.has("windsurf");
  
  if (hasCursor && hasCopilot) {
    const copilotInput = toolsMap.get("copilot")!;
    
    // Cursor is an IDE containing its own autocompletion and agent capabilities, making Copilot redundant.
    recommendations.push({
      toolId: "copilot",
      toolName: "GitHub Copilot",
      currentPlanName: PRICING_DATABASE.copilot.plans[copilotInput.planId]?.displayName || copilotInput.planId,
      recommendedPlanName: "None (Consolidated to Cursor)",
      action: "replace",
      reason: `Consolidate Copilot into Cursor. Your team is paying for both Cursor and GitHub Copilot. Cursor includes high-quality autocomplete and native AI chat, rendering standalone Copilot redundant for coding workflows.`,
      currentMonthlyCost: copilotInput.monthlySpend,
      optimizedMonthlyCost: 0,
      monthlySavings: copilotInput.monthlySpend,
      confidence: 0.95
    });
    
    // Mark copilot as consolidated/removed
    activeToolIds.delete("copilot");
  } else if (hasWindsurf && hasCursor) {
    const windsurfInput = toolsMap.get("windsurf")!;
    
    // Windsurf and Cursor are directly overlapping AI IDEs. Keep Cursor as standard if mixed/coding, else recommend picking one.
    recommendations.push({
      toolId: "windsurf",
      toolName: "Windsurf",
      currentPlanName: PRICING_DATABASE.windsurf.plans[windsurfInput.planId]?.displayName || windsurfInput.planId,
      recommendedPlanName: "None (Consolidated to Cursor)",
      action: "replace",
      reason: `Windsurf and Cursor are competing AI-powered IDEs. Standardizing on a single editor prevents dual license waste and ensures shared coding configurations across your ${teamSize}-person team.`,
      currentMonthlyCost: windsurfInput.monthlySpend,
      optimizedMonthlyCost: 0,
      monthlySavings: windsurfInput.monthlySpend,
      confidence: 0.90
    });
    activeToolIds.delete("windsurf");
  } else if (hasWindsurf && hasCopilot) {
    const copilotInput = toolsMap.get("copilot")!;
    
    recommendations.push({
      toolId: "copilot",
      toolName: "GitHub Copilot",
      currentPlanName: PRICING_DATABASE.copilot.plans[copilotInput.planId]?.displayName || copilotInput.planId,
      recommendedPlanName: "None (Consolidated to Windsurf)",
      action: "replace",
      reason: `Consolidate Copilot into Windsurf. Since Windsurf's Cascade provides powerful inline editing and code completions, a separate Copilot subscription is unnecessary.`,
      currentMonthlyCost: copilotInput.monthlySpend,
      optimizedMonthlyCost: 0,
      monthlySavings: copilotInput.monthlySpend,
      confidence: 0.95
    });
    activeToolIds.delete("copilot");
  }

  // --- RULE 2: CHAT INTERFACE OVERLAPS (Claude vs ChatGPT vs Gemini) ---
  const hasClaude = activeToolIds.has("claude");
  const hasChatGPT = activeToolIds.has("chatgpt");
  
  if (hasClaude && hasChatGPT) {
    const claudeInput = toolsMap.get("claude")!;
    const chatgptInput = toolsMap.get("chatgpt")!;
    
    // Only flag if both are paid subscriptions (cost > 0)
    if (claudeInput.planId !== "free" && chatgptInput.planId !== "free" && claudeInput.planId !== "api" && chatgptInput.planId !== "api") {
      if (useCase === "coding") {
        // Recommend keeping Claude (superior code logic) and downgrading ChatGPT to Free or dropping it
        recommendations.push({
          toolId: "chatgpt",
          toolName: "ChatGPT",
          currentPlanName: PRICING_DATABASE.chatgpt.plans[chatgptInput.planId]?.displayName || chatgptInput.planId,
          recommendedPlanName: "Free",
          action: "downgrade",
          reason: `For engineering-heavy teams, Claude (Pro/Team) is the superior tool for coding, reasoning, and documentation. You can safely downgrade ChatGPT to the Free tier and save license fees.`,
          currentMonthlyCost: chatgptInput.monthlySpend,
          optimizedMonthlyCost: 0,
          monthlySavings: chatgptInput.monthlySpend,
          confidence: 0.85
        });
        activeToolIds.delete("chatgpt");
      } else if (useCase === "writing" || useCase === "data" || useCase === "research") {
        // Keep ChatGPT, drop Claude
        recommendations.push({
          toolId: "claude",
          toolName: "Claude",
          currentPlanName: PRICING_DATABASE.claude.plans[claudeInput.planId]?.displayName || claudeInput.planId,
          recommendedPlanName: "Free",
          action: "downgrade",
          reason: `For teams focused primarily on ${useCase}, ChatGPT Plus or Business offers excellent utility, Deep Research, and custom GPTs. You can downgrade Claude to Free to eliminate overlap.`,
          currentMonthlyCost: claudeInput.monthlySpend,
          optimizedMonthlyCost: 0,
          monthlySavings: claudeInput.monthlySpend,
          confidence: 0.80
        });
        activeToolIds.delete("claude");
      } else {
        // Mixed usecase - suggest picking one, save the Claude license as default
        recommendations.push({
          toolId: "chatgpt",
          toolName: "ChatGPT",
          currentPlanName: PRICING_DATABASE.chatgpt.plans[chatgptInput.planId]?.displayName || chatgptInput.planId,
          recommendedPlanName: "Free",
          action: "downgrade",
          reason: `Your team has overlapping subscriptions to both Claude and ChatGPT. Consolidating onto one tool (like Claude) for general workflows will reduce subscription clutter without losing capabilities.`,
          currentMonthlyCost: chatgptInput.monthlySpend,
          optimizedMonthlyCost: 0,
          monthlySavings: chatgptInput.monthlySpend,
          confidence: 0.75
        });
        activeToolIds.delete("chatgpt");
      }
    }
  }

  // --- RULE 3: SEAT COUNT & TIER MISMATCHES ---
  for (const toolId of activeToolIds) {
    const tool = toolsMap.get(toolId)!;
    const toolPricing = PRICING_DATABASE[toolId];
    if (!toolPricing) continue;
    
    const plan = toolPricing.plans[tool.planId];
    if (!plan) continue;
    
    // Check if they are paying for a premium team tier with few seats (minimum seat limits overspend)
    if (toolId === "claude" && tool.planId === "team_standard") {
      // Claude Team has a 5 seat minimum ($125/mo). If teamSize is small, recommend Pro
      if (teamSize < 5 && tool.seats < 5) {
        const proCost = teamSize * 20; // 20 per seat for Pro
        const currentCost = tool.monthlySpend;
        const savings = currentCost - proCost;
        
        if (savings > 0) {
          recommendations.push({
            toolId,
            toolName: toolPricing.displayName,
            currentPlanName: "Team Standard (5-seat min)",
            recommendedPlanName: "Pro (Individual)",
            action: "downgrade",
            reason: `Claude Team Standard requires a 5-seat minimum ($125/mo). Since your team size is only ${teamSize}, downgrading to individual Pro accounts ($20/seat) maintains all pro features and saves $${savings}/mo.`,
            currentMonthlyCost: currentCost,
            optimizedMonthlyCost: proCost,
            monthlySavings: savings,
            confidence: 0.90
          });
          continue;
        }
      }
    }
    
    if (toolId === "chatgpt" && tool.planId === "business") {
      // ChatGPT Business/Team has a 2 seat minimum ($50/mo). If teamSize is 1, recommend ChatGPT Plus
      if (teamSize === 1 && tool.seats === 1) {
        const plusCost = 20; // ChatGPT Plus is $20
        const currentCost = tool.monthlySpend;
        const savings = currentCost - plusCost;
        
        if (savings > 0) {
          recommendations.push({
            toolId,
            toolName: toolPricing.displayName,
            currentPlanName: "Business / Team (2-seat min)",
            recommendedPlanName: "Plus",
            action: "downgrade",
            reason: `ChatGPT Business has a 2-seat minimum ($50/mo). For a single founder, switching to ChatGPT Plus ($20/mo) provides identical AI modeling access and saves $${savings}/mo.`,
            currentMonthlyCost: currentCost,
            optimizedMonthlyCost: plusCost,
            monthlySavings: savings,
            confidence: 0.95
          });
          continue;
        }
      }
    }

    // Check if they are paying for Cursor Business ($40) for a small team when Pro ($20) is enough
    if (toolId === "cursor" && tool.planId === "business") {
      if (teamSize <= 3 && !input.tools.some(t => t.toolId === "api")) { // small startup
        const proCost = tool.seats * 20;
        const currentCost = tool.monthlySpend;
        const savings = currentCost - proCost;
        
        if (savings > 0) {
          recommendations.push({
            toolId,
            toolName: toolPricing.displayName,
            currentPlanName: "Business",
            recommendedPlanName: "Pro",
            action: "downgrade",
            reason: `Cursor Business ($40/seat) is tailored for large org compliance. A ${teamSize}-person team can utilize Cursor Pro ($20/seat) to get identical coding capabilities and save $${savings}/mo.`,
            currentMonthlyCost: currentCost,
            optimizedMonthlyCost: proCost,
            monthlySavings: savings,
            confidence: 0.85
          });
          continue;
        }
      }
    }
    
    // Check if they are on a high-tier Ultra plan that could be optimized
    if (toolId === "gemini" && (tool.planId === "ultra_99" || tool.planId === "ultra_199") && teamSize > 1) {
      const workspaceStandardCost = tool.seats * 20; // Workspace Gemini is $20
      const currentCost = tool.monthlySpend;
      const savings = currentCost - workspaceStandardCost;
      
      if (savings > 0) {
        recommendations.push({
          toolId,
          toolName: toolPricing.displayName,
          currentPlanName: plan.displayName,
          recommendedPlanName: "Workspace Standard",
          action: "downgrade",
          reason: `Switch from consumer Gemini Ultra to Workspace Gemini Standard. You get enterprise-level security, administrative consoles, and Gmail integration for only $20/seat/mo, saving $${savings}/mo.`,
          currentMonthlyCost: currentCost,
          optimizedMonthlyCost: workspaceStandardCost,
          monthlySavings: savings,
          confidence: 0.80
        });
        continue;
      }
    }
  }

  // --- RULE 4: API WORKLOADS OPTIMIZATIONS (Caching & Batches) ---
  const hasAnthropicAPI = activeToolIds.has("claude") && toolsMap.get("claude")!.planId === "api" || activeToolIds.has("anthropic_api") || tools.some(t => t.toolId === "claude" && t.planId === "api");
  const hasOpenAIAPI = activeToolIds.has("chatgpt") && toolsMap.get("chatgpt")!.planId === "api" || activeToolIds.has("openai_api") || tools.some(t => t.toolId === "chatgpt" && t.planId === "api");
  
  if (hasAnthropicAPI) {
    const apiTool = tools.find(t => t.toolId === "claude" && t.planId === "api") || tools.find(t => t.toolId === "anthropic_api");
    if (apiTool && apiTool.monthlySpend > 100) {
      const currentCost = apiTool.monthlySpend;
      // Caching reduces input costs up to 90%, batching reduces costs by 50%. Let's assume a realistic 35% overall savings through code optimization.
      const savings = Math.round(currentCost * 0.35);
      const optimizedCost = currentCost - savings;
      
      recommendations.push({
        toolId: "claude",
        toolName: "Anthropic API",
        currentPlanName: "API Direct",
        recommendedPlanName: "API Direct (Optimized)",
        action: "upgrade", // Action represented as "upgrade" to indicate upgrading setup
        reason: `Implement Anthropic Prompt Caching and Batch APIs. Prompt caching reduces input costs by up to 90% for recurrent system prompts. Using the Batch API for non-realtime flows cuts token costs by a flat 50%.`,
        currentMonthlyCost: currentCost,
        optimizedMonthlyCost: optimizedCost,
        monthlySavings: savings,
        confidence: 0.90
      });
    }
  }
  
  if (hasOpenAIAPI) {
    const apiTool = tools.find(t => t.toolId === "chatgpt" && t.planId === "api") || tools.find(t => t.toolId === "openai_api");
    if (apiTool && apiTool.monthlySpend > 100) {
      const currentCost = apiTool.monthlySpend;
      const savings = Math.round(currentCost * 0.30); // 30% savings assumption
      const optimizedCost = currentCost - savings;
      
      recommendations.push({
        toolId: "chatgpt",
        toolName: "OpenAI API",
        currentPlanName: "API Direct",
        recommendedPlanName: "API Direct (Optimized)",
        action: "upgrade",
        reason: `Utilize OpenAI Prompt Caching and Batch API endpoints. This automatically cuts repeated context input tokens by 50% and slashes non-urgent async completions (like vector indexing or logs parsing) by half.`,
        currentMonthlyCost: currentCost,
        optimizedMonthlyCost: optimizedCost,
        monthlySavings: savings,
        confidence: 0.90
      });
    }
  }

  // --- RULE 5: CREDEX DISCOUNT EXCHANGE (The lead bridge!) ---
  // If the user has any retail subscriptions (total current spend > 0), they can source them via Credex credits
  let totalOptimizedSpend = totalCurrentSpend;
  let totalMonthlySavings = 0;
  
  // Calculate running optimized spend
  
  // Add savings from specific recommendations
  for (const rec of recommendations) {
    totalMonthlySavings += rec.monthlySavings;
  }
  
  totalOptimizedSpend = totalCurrentSpend - totalMonthlySavings;
  
  // Apply a secondary Credex Sourcing discount (e.g., additional 15% wholesale credit savings) for remaining active subscriptions
  let credexCreditSavings = 0;
  if (totalOptimizedSpend > 100) {
    // Sourcing through Credex wholesale channels gives an average of 20% discount on standard seats (ChatGPT Enterprise, Claude Enterprise, etc.)
    const eligibleSourcingSpend = totalOptimizedSpend;
    credexCreditSavings = Math.round(eligibleSourcingSpend * 0.20);
    
    // Add the Credex-specific recommendation
    recommendations.push({
      toolId: "credex_swap",
      toolName: "Credex Credit Sourcing",
      currentPlanName: "Retail Pricing",
      recommendedPlanName: "Credex Wholesale Credits",
      action: "consolidate",
      reason: `Source your remaining AI licenses through Credex compute exchange. We trade surplus company credits to supply retail tiers (Cursor, Claude Team, ChatGPT Enterprise) at a flat 20% discount.`,
      currentMonthlyCost: totalOptimizedSpend,
      optimizedMonthlyCost: totalOptimizedSpend - credexCreditSavings,
      monthlySavings: credexCreditSavings,
      confidence: 0.95
    });
    
    totalMonthlySavings += credexCreditSavings;
    totalOptimizedSpend -= credexCreditSavings;
  }

  // If no recommendations could be made (already optimal), push a default "keep" recommendation
  if (recommendations.length === 0) {
    for (const tool of tools) {
      const toolPricing = PRICING_DATABASE[tool.toolId];
      if (!toolPricing) continue;
      recommendations.push({
        toolId: tool.toolId,
        toolName: toolPricing.displayName,
        currentPlanName: toolPricing.plans[tool.planId]?.displayName || tool.planId,
        recommendedPlanName: toolPricing.plans[tool.planId]?.displayName || tool.planId,
        action: "keep",
        reason: `Your current tier configuration is fully optimal for a team of ${teamSize} with a ${useCase} use case. Excellent spend management!`,
        currentMonthlyCost: tool.monthlySpend,
        optimizedMonthlyCost: tool.monthlySpend,
        monthlySavings: 0,
        confidence: 1.0
      });
    }
  }
  
  const totalAnnualSavings = totalMonthlySavings * 12;
  const isOptimal = totalMonthlySavings === 0;
  
  // Health Score logic: 100 is perfect (0 savings possible). It drops proportionally based on the wasted spend fraction.
  let score = 100;
  if (totalCurrentSpend > 0) {
    const wastePercent = (totalMonthlySavings / totalCurrentSpend) * 100;
    score = Math.max(0, Math.round(100 - wastePercent));
  }

  return {
    input,
    recommendations,
    totalCurrentSpend,
    totalOptimizedSpend,
    totalMonthlySavings,
    totalAnnualSavings,
    isOptimal,
    score
  };
}
