"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
import { motion } from "framer-motion";
import { 
  TrendingDown, 
  ArrowRight, 
  Sparkles, 
  Mail, 
  Check, 
  Copy, 
  AlertCircle,
  TrendingUp,
  RotateCcw,
  ExternalLink,
  Calendar,
  Building,
  Briefcase,
  Users
} from "lucide-react";
import Navbar from "../../../components/Navbar";
import { db } from "../../../lib/db/client";
import { AuditResult } from "../../../lib/engine/types";
import confetti from "canvas-confetti";

export default function AuditResultsPage() {
  const params = useParams();
  const router = useRouter();
  const id = params.id as string;

  const [audit, setAudit] = useState<AuditResult | null>(null);
  const [loading, setLoading] = useState(true);
  const [aiSummary, setAiSummary] = useState<string>("");
  const [aiLoading, setAiLoading] = useState(true);
  
  // Lead state
  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadSaving, setLeadSaving] = useState(false);

  // Link copy state
  const [copied, setCopied] = useState(false);

  // Load audit data
  useEffect(() => {
    async function loadAudit() {
      if (!id) return;
      try {
        const data = await db.getAudit(id);
        if (data) {
          setAudit(data);
          
          // Trigger confetti if savings exist!
          if (data.totalMonthlySavings > 0) {
            triggerConfetti();
          }
          
          // Fetch AI summary
          fetchAiSummary(data);
        } else {
          console.error("Audit not found in DB");
        }
      } catch (e) {
        console.error(e);
      } finally {
        setLoading(false);
      }
    }
    loadAudit();
  }, [id]);

  const triggerConfetti = () => {
    try {
      confetti({
        particleCount: 100,
        spread: 70,
        origin: { y: 0.6 },
        colors: ["#10b981", "#34d399", "#059669", "#ffffff"]
      });
    } catch (e) {
      console.warn("Confetti failed", e);
    }
  };

  const fetchAiSummary = async (auditData: AuditResult) => {
    try {
      const response = await fetch("/api/summary", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(auditData)
      });
      const data = await response.json();
      if (data && data.summary) {
        setAiSummary(data.summary);
      } else {
        setAiSummary("Unable to compile AI analysis summary at this time.");
      }
    } catch (e) {
      console.error("Summary query failed", e);
      setAiSummary("Offline Mode: Analysis summary compiled using local template rules.");
    } finally {
      setAiLoading(false);
    }
  };

  const handleCopyLink = () => {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  };

  const handleLeadSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!email || !audit) return;
    
    setLeadSaving(true);
    try {
      const response = await fetch("/api/lead", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email,
          company,
          role,
          auditId: id,
          totalSavings: audit.totalMonthlySavings
        })
      });
      const resData = await response.json();
      if (resData.success) {
        setLeadSaved(true);
      } else {
        alert("Failed to submit details. Try again.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting details.");
    } finally {
      setLeadSaving(false);
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4">
          <span className="h-8 w-8 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-zinc-400 text-sm tracking-widest uppercase">Loading Audit Report...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-6 max-w-md mx-auto text-center px-4">
          <AlertCircle className="h-16 w-16 text-zinc-600" />
          <div>
            <h2 className="text-2xl font-bold tracking-tight text-white">Audit report not found</h2>
            <p className="text-zinc-400 text-sm mt-2 leading-relaxed">
              The requested audit identifier does not exist or may have been deleted. Run a new audit to get started.
            </p>
          </div>
          <button
            onClick={() => router.push("/audit")}
            className="inline-flex items-center gap-2 rounded-lg bg-white px-5 py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors"
          >
            <RotateCcw className="h-4 w-4" />
            Run New Audit
          </button>
        </div>
      </div>
    );
  }

  const { teamSize, useCase } = audit.input;
  const isHighSavings = audit.totalMonthlySavings >= 500;
  const isOptimal = audit.isOptimal;

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full space-y-10">
        
        {/* Results Hero (Shareable Dashboard Title) */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-6 pb-6 border-b border-white/5">
          <div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest border border-emerald-500/20 bg-emerald-500/5 px-2.5 py-1 rounded-full">
              Audit Complete
            </span>
            <h1 className="text-3xl sm:text-4xl font-extrabold text-white tracking-tight mt-3">
              AI Stack Audit Report
            </h1>
            <p className="text-zinc-400 text-sm sm:text-base mt-1.5 leading-relaxed max-w-xl">
              Spend benchmarking for a {teamSize}-person startup with a {useCase} primary workload.
            </p>
          </div>

          {/* Share Loop Button */}
          <div className="flex flex-wrap items-center gap-3">
            <button
              onClick={handleCopyLink}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-zinc-900 px-4 py-2.5 text-sm font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all active:scale-95"
            >
              {copied ? (
                <>
                  <Check className="h-4 w-4 text-emerald-400" />
                  Copied Report Link!
                </>
              ) : (
                <>
                  <Copy className="h-4 w-4 text-zinc-400" />
                  Copy Shareable Link
                </>
              )}
            </button>
            <button
              onClick={() => router.push("/audit")}
              className="inline-flex items-center gap-2 rounded-lg border border-white/10 bg-transparent px-4 py-2.5 text-sm font-semibold text-zinc-400 hover:text-white hover:bg-white/5 transition-all"
            >
              <RotateCcw className="h-4 w-4" />
              Re-run
            </button>
          </div>
        </div>

        {/* HERO CARDS: SAVINGS & SCORE */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          {/* Monthly Savings Card */}
          <div className="rounded-2xl glass-card glow-indigo p-6 flex flex-col justify-between h-44 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 blur-xl rounded-full" />
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-widest">
              <span>Potential Monthly Savings</span>
              <TrendingDown className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight font-mono">
                ${audit.totalMonthlySavings.toLocaleString()}
              </span>
              <p className="text-zinc-500 text-xs mt-1.5 leading-snug">Reduced from a baseline of ${audit.totalCurrentSpend}/mo.</p>
            </div>
          </div>

          {/* Annual Savings Card */}
          <div className="rounded-2xl glass-card glow-indigo p-6 flex flex-col justify-between h-44 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-emerald-500/10 blur-xl rounded-full" />
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-widest">
              <span>Estimated Annual Savings</span>
              <Calendar className="h-4 w-4 text-emerald-400" />
            </div>
            <div>
              <span className="text-4xl sm:text-5xl font-extrabold text-emerald-400 tracking-tight font-mono">
                ${audit.totalAnnualSavings.toLocaleString()}
              </span>
              <p className="text-zinc-500 text-xs mt-1.5 leading-snug">Annualized leverage mapped to your active seat count.</p>
            </div>
          </div>

          {/* Health Score Card */}
          <div className="rounded-2xl glass-card p-6 flex flex-col justify-between h-44 relative overflow-hidden">
            <div className="absolute top-0 right-0 h-10 w-10 bg-white/5 blur-xl rounded-full" />
            <div className="flex items-center justify-between text-zinc-400 text-xs font-semibold uppercase tracking-widest">
              <span>Stack Health Score</span>
              <span className="text-zinc-500 text-xs font-bold font-mono">Score: {audit.score}/100</span>
            </div>
            <div className="flex items-end justify-between">
              <div>
                <span className="text-4xl sm:text-5xl font-extrabold text-white tracking-tight font-mono">
                  {audit.score}%
                </span>
                <p className="text-zinc-500 text-xs mt-1.5 leading-snug">
                  {audit.score >= 90 
                    ? "Excellent spend optimization." 
                    : audit.score >= 70 
                    ? "Moderate optimization possible." 
                    : "Severe subscription leakages."}
                </p>
              </div>
              
              {/* Dynamic Health Circle Ring */}
              <div className="relative h-14 w-14 flex items-center justify-center">
                <svg className="absolute transform -rotate-90" width="56" height="56">
                  <circle cx="28" cy="28" r="24" stroke="rgba(255,255,255,0.05)" strokeWidth="4" fill="transparent" />
                  <circle 
                    cx="28" 
                    cy="28" 
                    r="24" 
                    stroke={audit.score >= 90 ? "#10b981" : audit.score >= 70 ? "#f59e0b" : "#ef4444"} 
                    strokeWidth="4" 
                    fill="transparent" 
                    strokeDasharray={2 * Math.PI * 24}
                    strokeDashoffset={2 * Math.PI * 24 * (1 - audit.score / 100)}
                    className="transition-all duration-1000 ease-out"
                  />
                </svg>
                <span className="text-xs font-bold text-white font-mono">{audit.score}%</span>
              </div>
            </div>
          </div>
        </div>

        {/* AI EXECUTIVE SUMMARY ANALYSIS */}
        <div className="rounded-2xl glass-panel p-6 sm:p-8 space-y-4 border border-emerald-500/10">
          <div className="flex items-center gap-2 text-emerald-400">
            <Sparkles className="h-5 w-5 fill-emerald-400/20" />
            <h3 className="text-lg font-bold tracking-tight text-white">AI-Generated Spend Summary</h3>
          </div>
          
          {aiLoading ? (
            <div className="space-y-2.5 py-2">
              <div className="h-4 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-[90%] bg-zinc-800 rounded animate-pulse" />
              <div className="h-4 w-[80%] bg-zinc-800 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-zinc-300 text-sm sm:text-base leading-relaxed font-normal">
              {aiSummary}
            </p>
          )}
        </div>

        {/* DETAILED RECONMEDATION CARD LIST */}
        <div className="space-y-4">
          <h3 className="text-xl font-extrabold tracking-tight text-white">Actionable Recommendations</h3>
          
          <div className="grid grid-cols-1 gap-4">
            {audit.recommendations.map((rec, index) => {
              const hasSavings = rec.monthlySavings > 0;
              return (
                <div 
                  key={index}
                  className={`rounded-xl border p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-6 transition-all ${
                    hasSavings 
                      ? "bg-zinc-900 border-white/10" 
                      : "bg-zinc-950/40 border-white/5 hover:border-white/10"
                  }`}
                >
                  <div className="space-y-2 max-w-3xl">
                    <div className="flex items-center gap-3">
                      <span className="text-base font-bold text-white tracking-tight">{rec.toolName}</span>
                      <span className={`text-xs font-bold px-2 py-0.5 rounded-full uppercase tracking-wider ${
                        rec.action === "downgrade" || rec.action === "replace"
                          ? "bg-red-500/10 text-red-400 border border-red-500/20"
                          : rec.action === "keep"
                          ? "bg-zinc-800 text-zinc-400 border border-zinc-700"
                          : "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20"
                      }`}>
                        {rec.action}
                      </span>
                    </div>

                    <p className="text-zinc-400 text-sm leading-relaxed">{rec.reason}</p>
                    
                    <div className="flex items-center gap-6 text-xs text-zinc-500 font-semibold uppercase tracking-wider pt-1">
                      <span>Baseline: {rec.currentPlanName}</span>
                      <span>Optimized: {rec.recommendedPlanName}</span>
                    </div>
                  </div>

                  {/* Savings segment */}
                  {hasSavings ? (
                    <div className="text-left md:text-right bg-emerald-500/5 border border-emerald-500/15 p-4 rounded-xl shrink-0 min-w-[160px]">
                      <span className="block text-xs font-semibold text-zinc-400 uppercase tracking-widest">Monthly Savings</span>
                      <span className="block text-2xl font-extrabold text-emerald-400 font-mono mt-0.5">${rec.monthlySavings}/mo</span>
                    </div>
                  ) : (
                    <div className="text-left md:text-right bg-zinc-900 border border-white/5 p-4 rounded-xl shrink-0 min-w-[160px]">
                      <span className="block text-xs font-semibold text-zinc-500 uppercase tracking-widest">Savings Status</span>
                      <span className="block text-sm font-bold text-zinc-400 mt-1 uppercase tracking-wider">Optimal</span>
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>

        {/* LEAD CAPTURE & LEAD GENERATION SECTION */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-8 pt-6">
          
          {/* Dynamic Marketing segment based on savings */}
          <div className="space-y-5 flex flex-col justify-center">
            {isOptimal ? (
              <>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Your AI Stack is optimal!</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Congratulations, your current AI selections and plan levels align perfectly with your team size and operational use case. 
                </p>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Enter your email to receive monthly updates when new vendor pricing discounts apply or when newer, cheaper models (like Gemini Pro caching updates) launch.
                </p>
              </>
            ) : isHighSavings ? (
              <>
                <div className="inline-flex max-w-fit items-center gap-1.5 text-xs font-semibold text-emerald-400 bg-emerald-500/10 px-2.5 py-1 rounded-full border border-emerald-500/20">
                  Credex Consultation Eligible
                </div>
                <h3 className="text-2xl sm:text-3xl font-extrabold text-white tracking-tight">Capture $500+ Wholesale Savings</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Your audit reveals significant spending leakages. Since your potential monthly savings exceed $500/mo, you are eligible for the **Credex Credit Exchange**.
                </p>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed font-normal">
                  Credex sources surplus corporate credits and redistributes active tiers (Cursor Business, Claude Enterprise, ChatGPT Enterprise) at up to a **40% wholesale discount**. Enter your email to claim the discounts.
                </p>
              </>
            ) : (
              <>
                <h3 className="text-2xl font-extrabold text-white tracking-tight">Reclaim lost SaaS budgets</h3>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  By executing the suggestions mapped out in this report, you immediately reclaim waste from double-licensing and seat minimum constraints.
                </p>
                <p className="text-zinc-400 text-sm sm:text-base leading-relaxed">
                  Save this report by entering your email. We will mail you a clean PDF copy of the recommendations along with action instructions to complete the downgrades.
                </p>
              </>
            )}
          </div>

          {/* Email Form Gate */}
          <div className="rounded-2xl glass-panel p-6 sm:p-8 border border-white/10 flex flex-col justify-between">
            {leadSaved ? (
              <div className="flex-1 flex flex-col items-center justify-center text-center py-8 space-y-3">
                <div className="h-12 w-12 rounded-full bg-emerald-500/10 border border-emerald-500/25 flex items-center justify-center text-emerald-400">
                  <Check className="h-6 w-6 stroke-[3]" />
                </div>
                <h4 className="text-lg font-bold text-white">Report saved successfully!</h4>
                <p className="text-zinc-400 text-xs sm:text-sm max-w-xs leading-relaxed">
                  Check your inbox. We have dispatched a copy of your spend recommendations and consultation access link.
                </p>
              </div>
            ) : (
              <form onSubmit={handleLeadSubmit} className="space-y-4">
                <h4 className="text-base font-bold text-white tracking-tight">
                  {isOptimal ? "Receive cost reduction alerts" : isHighSavings ? "Book Credex discount consultation" : "Email audit report copy"}
                </h4>
                
                <div className="space-y-3">
                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500"><Mail className="h-4 w-4" /></span>
                    <input
                      type="email"
                      required
                      value={email}
                      onChange={(e) => setEmail(e.target.value)}
                      placeholder="Enter work email"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500"><Building className="h-4 w-4" /></span>
                    <input
                      type="text"
                      value={company}
                      onChange={(e) => setCompany(e.target.value)}
                      placeholder="Company Name (optional)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>

                  <div className="relative">
                    <span className="absolute left-3 top-2.5 text-zinc-500"><Briefcase className="h-4 w-4" /></span>
                    <input
                      type="text"
                      value={role}
                      onChange={(e) => setRole(e.target.value)}
                      placeholder="Your Job Title / Role (optional)"
                      className="w-full bg-zinc-950 border border-zinc-800 rounded-lg py-2 pl-9 pr-3 text-sm text-white focus:outline-none focus:border-zinc-500"
                    />
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={leadSaving}
                  className="w-full inline-flex items-center justify-center gap-2 rounded-lg bg-white py-2.5 text-sm font-semibold text-black hover:bg-zinc-100 transition-colors disabled:opacity-50 active:scale-98"
                >
                  {leadSaving ? (
                    <>
                      <span className="h-4 w-4 animate-spin rounded-full border border-black border-t-transparent" />
                      Saving details...
                    </>
                  ) : (
                    <>
                      {isHighSavings ? "Claim Wholesale Discounts" : "Email PDF Report"}
                      <ArrowRight className="h-4 w-4" />
                    </>
                  )}
                </button>
                <span className="block text-[10px] text-zinc-500 text-center leading-normal">
                  We respect your data privacy. Identifying details are stripped from all public shared previews of this report.
                </span>
              </form>
            )}
          </div>

        </div>

      </main>
    </div>
  );
}
