"use client";

import React, { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { 
  Users, 
  Terminal, 
  Cpu, 
  Check, 
  ArrowRight, 
  ArrowLeft, 
  Info,
  DollarSign,
  AlertCircle
} from "lucide-react";
import { AuditInput, ToolInput, PrimaryUseCase } from "../lib/engine/types";
import { PRICING_DATABASE, calculateInputCost } from "../lib/engine/pricing";

interface AuditFormProps {
  onSubmit: (data: AuditInput) => void;
  isSubmitting: boolean;
}

const USE_CASES: { id: PrimaryUseCase; name: string; desc: string; icon: any }[] = [
  { id: "coding", name: "Software Development", desc: "Writing code, review, API integration", icon: Terminal },
  { id: "writing", name: "Content & Writing", desc: "Copywriting, blog posts, documentation", icon: Terminal },
  { id: "data", name: "Data & Analytics", desc: "SQL generation, python models, analysis", icon: Cpu },
  { id: "research", name: "Research & Strategy", desc: "Competitive analysis, summarization", icon: Info },
  { id: "mixed", name: "Mixed Operations", desc: "General multi-role productivity stacks", icon: Users }
];

const AVAILABLE_TOOLS = [
  { id: "cursor", name: "Cursor", desc: "AI First Code Editor", color: "from-zinc-900 to-zinc-800" },
  { id: "copilot", name: "GitHub Copilot", desc: "Coding Assistant", color: "from-slate-900 to-slate-800" },
  { id: "claude", name: "Claude (Anthropic)", desc: "Web chat and API direct usage", color: "from-amber-950/20 to-orange-950/30" },
  { id: "chatgpt", name: "ChatGPT (OpenAI)", desc: "Conversational & Custom GPTs", color: "from-emerald-950/20 to-teal-950/30" },
  { id: "gemini", name: "Google Gemini", desc: "Advanced multimodal assistant", color: "from-blue-950/20 to-indigo-950/30" },
  { id: "windsurf", name: "Windsurf", desc: "Agentic Developer Environment", color: "from-zinc-900 to-neutral-900" },
  { id: "v0", name: "v0.dev (Vercel)", desc: "AI UI Generation Engine", color: "from-neutral-900 to-zinc-900" }
];

export default function AuditForm({ onSubmit, isSubmitting }: AuditFormProps) {
  const [step, setStep] = useState(1);
  const [teamSize, setTeamSize] = useState<number>(1);
  const [useCase, setUseCase] = useState<PrimaryUseCase>("coding");
  const [selectedTools, setSelectedTools] = useState<string[]>([]);
  const [toolInputs, setToolInputs] = useState<Record<string, { planId: string; seats: number; monthlySpend: number }>>({});

  // 1. Persist state to localstorage
  useEffect(() => {
    try {
      const saved = localStorage.getItem("credlens_draft");
      if (saved) {
        const parsed = JSON.parse(saved);
        if (parsed.teamSize) setTeamSize(parsed.teamSize);
        if (parsed.useCase) setUseCase(parsed.useCase);
        if (parsed.selectedTools) setSelectedTools(parsed.selectedTools);
        if (parsed.toolInputs) setToolInputs(parsed.toolInputs);
        if (parsed.step) setStep(parsed.step);
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

  // Initializing tool configurations when a tool is selected
  const handleToggleTool = (toolId: string) => {
    if (selectedTools.includes(toolId)) {
      setSelectedTools(prev => prev.filter(id => id !== toolId));
    } else {
      setSelectedTools(prev => [...prev, toolId]);
      // Initialize inputs if not already defined
      if (!toolInputs[toolId]) {
        const toolPricing = PRICING_DATABASE[toolId];
        const defaultPlan = Object.keys(toolPricing?.plans || {})[0] || "free";
        setToolInputs(prev => ({
          ...prev,
          [toolId]: {
            planId: defaultPlan,
            seats: teamSize,
            monthlySpend: 0
          }
        }));
      }
    }
  };

  const handleUpdateToolInput = (toolId: string, field: "planId" | "seats" | "monthlySpend", value: any) => {
    setToolInputs(prev => {
      const current = prev[toolId] || { planId: "free", seats: teamSize, monthlySpend: 0 };
      const updated = { ...current, [field]: value };
      
      // Calculate real cost if plan or seats changes
      if (field === "planId" || field === "seats") {
        const inputObj: ToolInput = {
          toolId,
          planId: field === "planId" ? value : current.planId,
          seats: field === "seats" ? Number(value) : current.seats,
          monthlySpend: current.monthlySpend
        };
        updated.monthlySpend = calculateInputCost(inputObj);
      }
      return {
        ...prev,
        [toolId]: updated
      };
    });
  };

  // Sync tool seat counts to team size if tool seats match old team size
  const handleTeamSizeChange = (newSize: number) => {
    setTeamSize(newSize);
    setSelectedTools(prevTools => {
      // For each active tool, update default seat count if it matched previous value
      prevTools.forEach(toolId => {
        setToolInputs(prevInputs => {
          const current = prevInputs[toolId];
          if (current) {
            const inputObj: ToolInput = {
              toolId,
              planId: current.planId,
              seats: newSize,
              monthlySpend: current.monthlySpend
            };
            return {
              ...prevInputs,
              [toolId]: {
                ...current,
                seats: newSize,
                monthlySpend: calculateInputCost(inputObj)
              }
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
      monthlySpend: toolInputs[toolId]?.monthlySpend || 0
    }));

    onSubmit({
      teamSize,
      useCase,
      tools: toolsPayload
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
    <div className="relative w-full max-w-4xl mx-auto rounded-2xl glass-panel glow-indigo p-6 sm:p-10 border border-white/10">
      {/* Progress Header */}
      <div className="mb-8">
        <div className="flex items-center justify-between text-xs font-semibold text-zinc-500 uppercase tracking-widest mb-3">
          <span>Step {step} of 3</span>
          <span>{step === 1 ? "Profile" : step === 2 ? "Stack Selection" : "Cost Breakdown"}</span>
        </div>
        <div className="h-1.5 w-full bg-zinc-800/80 rounded-full overflow-hidden">
          <motion.div 
            className="h-full bg-gradient-to-r from-emerald-500 to-teal-400"
            initial={{ width: "33%" }}
            animate={{ width: step === 1 ? "33%" : step === 2 ? "66%" : "100%" }}
            transition={{ duration: 0.3, ease: "easeInOut" }}
          />
        </div>
      </div>

      <form onSubmit={handleSubmit}>
        <AnimatePresence mode="wait">
          {/* STEP 1: TEAM PROFILE */}
          {step === 1 && (
            <motion.div
              key="step1"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Define your team profile</h2>
                <p className="mt-2 text-zinc-400 text-sm sm:text-base">We use team characteristics to evaluate licensing fits and plan structures.</p>
              </div>

              <div className="space-y-6">
                <div>
                  <label htmlFor="team-size" className="block text-sm font-semibold text-zinc-300 mb-2">Team Seats (Active Users)</label>
                  <div className="relative flex items-center max-w-xs">
                    <span className="absolute left-3 text-zinc-500"><Users className="h-5 w-5" /></span>
                    <input 
                      type="number" 
                      id="team-size"
                      min={1}
                      max={1000}
                      value={teamSize}
                      onChange={(e) => handleTeamSizeChange(Math.max(1, Number(e.target.value)))}
                      className="w-full bg-zinc-900 border border-zinc-850 rounded-lg py-2.5 pl-10 pr-4 text-white text-base focus:border-white focus:outline-none transition-colors"
                      placeholder="e.g. 5"
                      required
                    />
                  </div>
                </div>

                <div>
                  <span className="block text-sm font-semibold text-zinc-300 mb-3">Primary AI Use Case</span>
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-3.5">
                    {USE_CASES.map((item) => {
                      const IconComponent = item.icon;
                      const isSelected = useCase === item.id;
                      return (
                        <div
                          key={item.id}
                          onClick={() => setUseCase(item.id)}
                          className={`cursor-pointer rounded-xl p-4 border transition-all text-left flex items-start gap-3.5 ${
                            isSelected 
                              ? "bg-zinc-850 border-white/20 shadow-lg shadow-white/5" 
                              : "bg-zinc-900/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/60"
                          }`}
                        >
                          <div className={`p-2.5 rounded-lg border ${isSelected ? "border-emerald-500/20 bg-emerald-500/10 text-emerald-400" : "border-white/5 bg-white/5 text-zinc-400"}`}>
                            <IconComponent className="h-5 w-5" />
                          </div>
                          <div>
                            <span className="block text-sm font-semibold text-white">{item.name}</span>
                            <span className="block text-xs text-zinc-400 mt-0.5 leading-normal">{item.desc}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              <div className="flex justify-end pt-4">
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors active:scale-98"
                >
                  Configure Stack
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 2: STACK SELECTION */}
          {step === 2 && (
            <motion.div
              key="step2"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div>
                <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Select your AI Tools</h2>
                <p className="mt-2 text-zinc-400 text-sm sm:text-base">Toggle the paid subscription tools currently deployed in your workspace.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-3.5">
                {AVAILABLE_TOOLS.map((tool) => {
                  const isSelected = selectedTools.includes(tool.id);
                  return (
                    <div
                      key={tool.id}
                      onClick={() => handleToggleTool(tool.id)}
                      className={`relative cursor-pointer rounded-xl p-4 border transition-all text-left overflow-hidden flex flex-col justify-between h-36 ${
                        isSelected 
                          ? "bg-zinc-900 border-white/20 shadow-lg shadow-white/5" 
                          : "bg-zinc-950/40 border-white/5 hover:border-white/10 hover:bg-zinc-900/40"
                      }`}
                    >
                      {/* Accent glow on selection */}
                      {isSelected && (
                        <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 blur-xl rounded-full" />
                      )}
                      
                      <div>
                        <div className="flex items-center justify-between">
                          <span className="text-base font-bold text-white tracking-tight">{tool.name}</span>
                          {isSelected && (
                            <span className="flex h-5 w-5 items-center justify-center rounded-full bg-emerald-500 text-black text-xs font-semibold">
                              <Check className="h-3.5 w-3.5 stroke-[3]" />
                            </span>
                          )}
                        </div>
                        <p className="text-xs text-zinc-400 mt-1.5 leading-snug">{tool.desc}</p>
                      </div>

                      <div className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
                        {isSelected ? (
                          <span className="text-emerald-400">Selected</span>
                        ) : (
                          <span>+ Add Tool</span>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="button"
                  onClick={nextStep}
                  className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-3 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors active:scale-98"
                >
                  Configure Details
                  <ArrowRight className="h-4 w-4" />
                </button>
              </div>
            </motion.div>
          )}

          {/* STEP 3: DETAILS & COSTS */}
          {step === 3 && (
            <motion.div
              key="step3"
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: -20 }}
              transition={{ duration: 0.25 }}
              className="space-y-8"
            >
              <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4">
                <div>
                  <h2 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Seat counts & plans</h2>
                  <p className="mt-2 text-zinc-400 text-sm sm:text-base">Configure active licenses for each tool to calculate your baseline spend.</p>
                </div>
                {/* Running Live Total Display */}
                <div className="bg-zinc-900 border border-white/5 px-4 py-2.5 rounded-lg text-right flex items-center gap-3">
                  <span className="text-xs font-semibold text-zinc-400 tracking-wider uppercase">Baseline Spend:</span>
                  <span className="text-xl font-extrabold text-emerald-400 font-mono">${calculateTotalSpend()}/mo</span>
                </div>
              </div>

              <div className="space-y-4">
                {selectedTools.map((toolId) => {
                  const toolPricing = PRICING_DATABASE[toolId];
                  const currentInput = toolInputs[toolId] || { planId: "free", seats: teamSize, monthlySpend: 0 };
                  const isAPI = currentInput.planId === "api";
                  
                  return (
                    <div key={toolId} className="bg-zinc-900/60 border border-white/5 rounded-xl p-5 sm:p-6 space-y-4">
                      <div className="flex items-center justify-between">
                        <span className="text-base font-bold text-white tracking-tight">{toolPricing.displayName}</span>
                        <span className="text-sm font-semibold text-zinc-400 font-mono">${currentInput.monthlySpend || 0}/mo</span>
                      </div>

                      <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
                        {/* Plan Select */}
                        <div>
                          <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Active Plan</label>
                          <select
                            value={currentInput.planId}
                            onChange={(e) => handleUpdateToolInput(toolId, "planId", e.target.value)}
                            className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-zinc-500"
                          >
                            {Object.entries(toolPricing.plans).map(([key, plan]) => (
                              <option key={key} value={plan.planId}>{plan.displayName}</option>
                            ))}
                          </select>
                        </div>

                        {/* Cost/Seats Inputs depending on API plan */}
                        {isAPI ? (
                          <div className="sm:col-span-2">
                            <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Direct API Monthly Spend ($)</label>
                            <div className="relative">
                              <span className="absolute left-3 top-2 text-zinc-500 text-sm"><DollarSign className="h-4 w-4" /></span>
                              <input
                                type="number"
                                min={0}
                                value={currentInput.monthlySpend === 0 ? "" : currentInput.monthlySpend}
                                onChange={(e) => handleUpdateToolInput(toolId, "monthlySpend", Math.max(0, Number(e.target.value)))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-8 pr-3 text-sm text-white focus:outline-none focus:border-zinc-500 font-mono"
                                placeholder="e.g. 500"
                                required
                              />
                            </div>
                          </div>
                        ) : (
                          <>
                            {/* Seat input */}
                            <div>
                              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Active Seats</label>
                              <input
                                type="number"
                                min={1}
                                value={currentInput.seats}
                                onChange={(e) => handleUpdateToolInput(toolId, "seats", Math.max(1, Number(e.target.value)))}
                                className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 px-3 text-sm text-white focus:outline-none focus:border-zinc-500 font-mono"
                                placeholder="Seats"
                                required
                              />
                            </div>
                            {/* Cost display */}
                            <div>
                              <label className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest mb-1.5">Calculated Cost</label>
                              <div className="w-full bg-zinc-950 border border-zinc-850 rounded-lg py-2 px-3 text-sm text-zinc-400 font-mono">
                                ${toolPricing.plans[currentInput.planId]?.pricePerSeatMonth || 0} / seat
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </div>
                  );
                })}
              </div>

              {/* Warnings / Flags for redundancy before submitting */}
              {selectedTools.includes("cursor") && selectedTools.includes("copilot") && (
                <div className="flex items-start gap-3 rounded-lg bg-yellow-500/10 border border-yellow-500/20 p-4 text-xs sm:text-sm text-yellow-400">
                  <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
                  <div>
                    <span className="font-bold block mb-0.5">Potential Stack Overlap Flagged</span>
                    Cursor and Copilot are both active in your selections. Our audit logic will detail consolidation options.
                  </div>
                </div>
              )}

              <div className="flex justify-between items-center pt-4">
                <button
                  type="button"
                  onClick={prevStep}
                  className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
                >
                  <ArrowLeft className="h-4 w-4" />
                  Back
                </button>
                <button
                  type="submit"
                  disabled={isSubmitting}
                  className="inline-flex items-center gap-2 rounded-lg bg-gradient-to-r from-emerald-500 to-teal-400 px-6 py-3 text-sm font-bold text-black hover:opacity-90 transition-all active:scale-98 disabled:opacity-50"
                >
                  {isSubmitting ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border border-black border-t-transparent" />
                      Analyzing Stack...
                    </>
                  ) : (
                    <>
                      Run Free Audit
                      <ArrowRight className="h-4 w-4" />
                    </>
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
