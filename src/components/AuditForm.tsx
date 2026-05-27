"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { AuditInput, ToolInput, PrimaryUseCase } from "../lib/engine/types";
import { PRICING_DATABASE, calculateInputCost } from "../lib/engine/pricing";

interface AuditFormProps {
  onSubmit: (data: AuditInput) => void;
  isSubmitting: boolean;
}

const USE_CASES: { id: PrimaryUseCase; label: string }[] = [
  { id: "coding", label: "Software Development" },
  { id: "writing", label: "Content & Writing" },
  { id: "data", label: "Data & Analytics" },
  { id: "research", label: "Research & Strategy" },
  { id: "mixed", label: "Mixed / General" },
];

const AVAILABLE_TOOLS = [
  { id: "cursor", name: "Cursor" },
  { id: "copilot", name: "GitHub Copilot" },
  { id: "claude", name: "Claude" },
  { id: "chatgpt", name: "ChatGPT" },
  { id: "gemini", name: "Gemini" },
  { id: "windsurf", name: "Windsurf" },
  { id: "v0", name: "v0.dev" },
];

const STEPS = [1, 2, 3] as const;

export default function AuditForm({ onSubmit, isSubmitting }: AuditFormProps) {
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<PrimaryUseCase>("coding");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [toolInputs, setToolInputs] = useState<Record<string, { planId: string; seats: number; monthlySpend: number }>>({});

  useEffect(() => {
    try {
      const saved = localStorage.getItem("credlens_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        setTimeout(() => {
          if (parsed.teamSize) setTeamSize(parsed.teamSize);
          if (parsed.useCase) setUseCase(parsed.useCase);
          if (parsed.selectedTools) setSelectedTools(parsed.selectedTools);
          if (parsed.toolInputs) setToolInputs(parsed.toolInputs);
          if (parsed.step) setStep(parsed.step);
        }, 0);
      }
    } catch (e) {
      console.error("Failed to restore form state", e);
    }
  }, []);

  useEffect(() => {
    try {
      const state = { teamSize, useCase, selectedTools, toolInputs, step };
      localStorage.setItem("credlens_draft", JSON.stringify(state));
    } catch (e) {
      console.error("Failed to persist state", e);
    }
  }, [teamSize, useCase, selectedTools, toolInputs, step]);

  const handleToggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(prev => prev.filter(id => id !== toolId));
    } else {
      setSelectedTools(prev => [...prev, toolId]);
      if (!toolInputs[toolId]) {
        const toolPricing = PRICING_DATABASE[toolId];
        const defaultPlan = Object.keys(toolPricing?.plans || {})[0] || "free";
        setToolInputs(prev => ({
          ...prev,
          [toolId]: {
            planId: defaultPlan,
            seats: teamSize,
            monthlySpend: 0,
          },
        }));
      }
    }
  };

  const handleUpdateToolInput = (toolId: string, field: "planId" | "seats" | "monthlySpend", value: string | number) => {
    setToolInputs(prev => {
      const current = prev[toolId] || { planId: "free", seats: teamSize, monthlySpend: 0 };
      const updated = { ...current, [field]: value };

      if (field === "planId" || field === "seats") {
        const inputObj: ToolInput = {
          toolId,
          planId: field === "planId" ? (value as string) : current.planId,
          seats: field === "seats" ? Number(value) : current.seats,
          monthlySpend: current.monthlySpend,
        };
        updated.monthlySpend = calculateInputCost(inputObj);
      }
      return {
        ...prev,
        [toolId]: updated,
      };
    });
  };

  const handleTeamSizeChange = (newSize: number) => {
    setTeamSize(newSize);
    setSelectedTools(prevTools => {
      prevTools.forEach(toolId => {
        setToolInputs(prevInputs => {
          const current = prevInputs[toolId];
          if (current) {
            const inputObj: ToolInput = {
              toolId,
              planId: current.planId,
              seats: newSize,
              monthlySpend: current.monthlySpend,
            };
            return {
              ...prevInputs,
              [toolId]: {
                ...current,
                seats: newSize,
                monthlySpend: calculateInputCost(inputObj),
              },
            };
          }
          return prevInputs;
        });
      });
      return prevTools;
    });
  };

  const calculateTotalSpend = () => {
    let total = 0;
    selectedTools.forEach(toolId => {
      const input = toolInputs[toolId];
      if (input) {
        total += input.monthlySpend || 0;
      }
    });
    return total;
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedTools.length === 0) {
      alert("Please select at least one tool to audit.");
      return;
    }
    const toolsPayload: ToolInput[] = selectedTools.map(toolId => ({
      toolId,
      planId: toolInputs[toolId]?.planId || "free",
      seats: toolInputs[toolId]?.seats || teamSize,
      monthlySpend: toolInputs[toolId]?.monthlySpend || 0,
    }));

    onSubmit({
      teamSize,
      useCase,
      tools: toolsPayload,
    });
  };

  const nextStep = () => {
    if (step === 1 && (!teamSize || teamSize < 1)) return;
    if (step === 2 && selectedTools.length === 0) {
      alert("Select at least one tool to benchmark.");
      return;
    }
    setStep(prev => prev + 1);
  };

  const prevStep = () => {
    setStep(prev => prev - 1);
  };

  return (
    <div className="w-full max-w-2xl mx-auto">
      <div className="flex items-center justify-center gap-0 mb-12">
        {STEPS.map((s, i) => (
          <React.Fragment key={s}>
            {i > 0 && (
              <div className={`h-[2px] w-12 transition-colors duration-350 ${s <= step ? "bg-emerald-500" : "bg-zinc-800"}`} />
            )}
            <div
              className={`h-3 w-3 rounded-full transition-all duration-300 ${
                s === step
                  ? "bg-emerald-400 ring-4 ring-emerald-500/20 ring-offset-2 ring-offset-black"
                  : s < step
                    ? "bg-emerald-500"
                    : "bg-zinc-800"
              }`}
            />
          </React.Fragment>
        ))}
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Team Profile</h2>
                <p className="mt-1 text-sm text-zinc-500">Basic info about your team</p>
              </div>

              <div className="space-y-8">
                <div>
                  <label htmlFor="team-size" className="block text-sm text-zinc-400 mb-2">
                    Team size
                  </label>
                  <input
                    type="number"
                    id="team-size"
                    min={1}
                    max={1000}
                    value={teamSize}
                    onChange={(e) => handleTeamSizeChange(Math.max(1, Number(e.target.value)))}
                    className="max-w-[200px] bg-zinc-900/60 border border-zinc-800 rounded-xl py-2.5 px-4 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                    placeholder="e.g. 5"
                    required
                  />
                </div>

                <div>
                  <span className="block text-sm text-zinc-400 mb-3">Primary use case</span>
                  <div className="flex flex-wrap gap-2">
                    {USE_CASES.map((item) => (
                      <button
                        key={item.id}
                        type="button"
                        onClick={() => setUseCase(item.id)}
                        className={`px-4 py-2 rounded-full text-sm border cursor-pointer transition-all duration-200 ${
                          useCase === item.id
                            ? "bg-emerald-500/10 border-emerald-500 text-emerald-400 font-medium shadow-[0_0_15px_rgba(16,185,129,0.1)]"
                            : "border-zinc-800 text-zinc-400 bg-zinc-900/20 hover:border-zinc-650 hover:text-zinc-200"
                        }`}
                      >
                        {item.label}
                      </button>
                    ))}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-2">
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 text-sm font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              <div>
                <h2 className="text-xl font-semibold text-white">Your AI Tools</h2>
                <p className="mt-1 text-sm text-zinc-500">Select every paid AI tool your team uses</p>
              </div>

              <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 gap-3">
                {AVAILABLE_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleToggleTool(tool.id)}
                      className={`rounded-xl border p-4 text-center cursor-pointer transition-all duration-300 shadow-sm ${
                        isSelected
                          ? "bg-emerald-500/5 border-emerald-500/60 text-emerald-400 font-semibold shadow-[0_0_15px_rgba(16,185,129,0.08)]"
                          : "bg-zinc-900/30 border-zinc-850 text-zinc-400 hover:border-zinc-700 hover:bg-zinc-900/60"
                      }`}
                    >
                      <span className="text-sm">{tool.name}</span>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-zinc-500 hover:text-white text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 text-sm font-semibold px-6 py-2.5 rounded-xl shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-0.5"
                >
                  Next →
                </button>
              </div>
            </motion.div>
          )}

          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.2 }}
              className="space-y-10"
            >
              <div className="flex items-start justify-between">
                <div>
                  <h2 className="text-xl font-semibold text-white">Configure Details</h2>
                  <p className="mt-1 text-sm text-zinc-500">Set the plan and seats for each tool</p>
                </div>
                <div className="text-sm text-zinc-500 text-right">
                  Monthly total{" "}
                  <span className="font-mono text-emerald-400 font-bold">${calculateTotalSpend()}</span>
                </div>
              </div>

              <div className="space-y-4">
                {selectedTools.map((toolId) => {
                  const toolPricing = PRICING_DATABASE[toolId];
                  const currentInput = toolInputs[toolId] || { planId: "free", seats: teamSize, monthlySpend: 0 };
                  const isAPI = currentInput.planId === "api";

                  return (
                    <div key={toolId} className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-zinc-800/80 rounded-2xl p-5 shadow-[0_4px_15px_rgba(0,0,0,0.2)]">
                      <div className="flex items-center justify-between mb-4">
                        <span className="text-base font-medium text-white">{toolPricing.displayName}</span>
                        <span className="text-sm text-emerald-400 font-mono font-medium">${currentInput.monthlySpend || 0}/mo</span>
                      </div>

                      <div className="flex flex-wrap items-end gap-4">
                        <div className="flex-1 min-w-[140px]">
                          <label className="block text-xs text-zinc-500 mb-1.5">Plan</label>
                          <select
                            value={currentInput.planId}
                            onChange={(e) => handleUpdateToolInput(toolId, "planId", e.target.value)}
                            className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl py-2.5 px-4 text-white text-sm focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                          >
                            {Object.entries(toolPricing.plans).map(([key, plan]) => (
                              <option key={key} value={plan.planId}>{plan.displayName}</option>
                            ))}
                          </select>
                        </div>

                        {isAPI ? (
                          <div className="flex-1 min-w-[140px]">
                            <label className="block text-xs text-zinc-500 mb-1.5">Monthly API spend ($)</label>
                            <input
                              type="number"
                              min={0}
                              value={currentInput.monthlySpend === 0 ? "" : currentInput.monthlySpend}
                              onChange={(e) => handleUpdateToolInput(toolId, "monthlySpend", Math.max(0, Number(e.target.value)))}
                              className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl py-2.5 px-4 text-white text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                              placeholder="e.g. 500"
                              required
                            />
                          </div>
                        ) : (
                          <div className="flex-1 min-w-[100px]">
                            <label className="block text-xs text-zinc-500 mb-1.5">Seats</label>
                            <input
                              type="number"
                              min={1}
                              value={currentInput.seats}
                              onChange={(e) => handleUpdateToolInput(toolId, "seats", Math.max(1, Number(e.target.value)))}
                              className="w-full bg-zinc-900/60 border border-zinc-850 rounded-xl py-2.5 px-4 text-white text-sm font-mono focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                              placeholder="Seats"
                              required
                            />
                          </div>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {selectedTools.includes("cursor") && selectedTools.includes("copilot") && (
                <p className="text-sm text-yellow-500/90 font-medium">
                  Note: Cursor and Copilot have overlapping features. The audit will evaluate consolidation.
                </p>
              )}

              <div className="flex justify-between items-center pt-2">
                <button
                  type="button"
                  onClick={prevStep}
                  className="text-zinc-500 hover:text-white text-sm transition-colors"
                >
                  ← Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 rounded-xl px-6 py-2.5 text-sm font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] transform hover:-translate-y-0.5 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <span className="inline-flex items-center gap-2">
                      <span className="h-4 w-4 animate-spin rounded-full border-2 border-zinc-950 border-t-transparent" />
                      Analyzing...
                    </span>
                  ) : (
                    "Run Audit →"
                  )}
                </button>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </form>
    </div>
  );
}
