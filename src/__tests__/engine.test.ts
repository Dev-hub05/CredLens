import { describe, it, expect } from "vitest";
import { runAudit } from "../lib/engine/analyzer";
import { AuditInput } from "../lib/engine/types";

describe("CredLens Audit Engine Tests", () => {
  
  it("detects Cursor and Copilot overlap and recommends dropping Copilot", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      tools: [
        { toolId: "cursor", planId: "pro", seats: 2, monthlySpend: 40 },
        { toolId: "copilot", planId: "pro", seats: 2, monthlySpend: 20 }
      ]
    };
    
    const result = runAudit(input);
    
    // Check that we identified the copilot redundancy
    const copilotRec = result.recommendations.find(r => r.toolId === "copilot");
    expect(copilotRec).toBeDefined();
    expect(copilotRec?.action).toBe("replace");
    expect(copilotRec?.monthlySavings).toBe(20);
    expect(result.totalMonthlySavings).toBeGreaterThanOrEqual(20); // Includes Credex Swap savings if spend > 100
    expect(result.score).toBeLessThan(100);
  });

  it("recommends downgrading ChatGPT for coding-heavy teams who also pay for Claude Pro", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "coding",
      tools: [
        { toolId: "claude", planId: "pro", seats: 1, monthlySpend: 20 },
        { toolId: "chatgpt", planId: "plus", seats: 1, monthlySpend: 20 }
      ]
    };
    
    const result = runAudit(input);
    
    // Coding team should keep Claude and downgrade ChatGPT
    const chatgptRec = result.recommendations.find(r => r.toolId === "chatgpt");
    expect(chatgptRec).toBeDefined();
    expect(chatgptRec?.action).toBe("downgrade");
    expect(chatgptRec?.recommendedPlanName).toBe("Free");
    expect(chatgptRec?.monthlySavings).toBe(20);
  });

  it("detects Claude Team seat minimum overspend for small teams", () => {
    const input: AuditInput = {
      teamSize: 2,
      useCase: "coding",
      tools: [
        { toolId: "claude", planId: "team_standard", seats: 2, monthlySpend: 125 } // 5 seat min
      ]
    };
    
    const result = runAudit(input);
    
    // Recommends switching to Claude Pro (2 seats * $20 = $40)
    const claudeRec = result.recommendations.find(r => r.toolId === "claude");
    expect(claudeRec).toBeDefined();
    expect(claudeRec?.action).toBe("downgrade");
    expect(claudeRec?.recommendedPlanName).toBe("Pro (Individual)");
    expect(claudeRec?.monthlySavings).toBe(85); // $125 - $40 = $85
  });

  it("detects ChatGPT Business 2-seat minimum waste for solo builders", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "mixed",
      tools: [
        { toolId: "chatgpt", planId: "business", seats: 1, monthlySpend: 50 } // 2 seat min
      ]
    };
    
    const result = runAudit(input);
    
    // Recommends switching to Plus ($20)
    const chatgptRec = result.recommendations.find(r => r.toolId === "chatgpt");
    expect(chatgptRec).toBeDefined();
    expect(chatgptRec?.action).toBe("downgrade");
    expect(chatgptRec?.recommendedPlanName).toBe("Plus");
    expect(chatgptRec?.monthlySavings).toBe(30); // $50 - $20 = $30
  });

  it("optimizes raw API workloads with prompt caching and batch pricing flags", () => {
    const input: AuditInput = {
      teamSize: 5,
      useCase: "coding",
      tools: [
        { toolId: "claude", planId: "api", seats: 0, monthlySpend: 400 } // $400 API spend
      ]
    };
    
    const result = runAudit(input);
    
    // API optimizes with custom prompt caching suggestion
    const claudeRec = result.recommendations.find(r => r.toolId === "claude");
    expect(claudeRec).toBeDefined();
    expect(claudeRec?.action).toBe("upgrade");
    expect(claudeRec?.recommendedPlanName).toContain("Optimized");
    expect(claudeRec?.monthlySavings).toBe(140); // 35% of $400
  });

  it("handles a fully optimal stack with no savings and maintains a health score of 100", () => {
    const input: AuditInput = {
      teamSize: 1,
      useCase: "writing",
      tools: [
        { toolId: "chatgpt", planId: "go", seats: 1, monthlySpend: 8 }
      ]
    };
    
    const result = runAudit(input);
    
    // Healthy stack, no savings, score = 100
    expect(result.totalMonthlySavings).toBe(0);
    expect(result.isOptimal).toBe(true);
    expect(result.score).toBe(100);
    
    const chatgptRec = result.recommendations.find(r => r.toolId === "chatgpt");
    expect(chatgptRec?.action).toBe("keep");
  });
  
});
