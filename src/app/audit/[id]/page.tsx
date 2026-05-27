"use client";

import React, { useState, useEffect } from "react";
import { useParams, useRouter } from "next/navigation";
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

  const [email, setEmail] = useState("");
  const [company, setCompany] = useState("");
  const [role, setRole] = useState("");
  const [leadSaved, setLeadSaved] = useState(false);
  const [leadSaving, setLeadSaving] = useState(false);

  const [copied, setCopied] = useState(false);

  function triggerConfetti() {
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
  }

  async function fetchAiSummary(auditData: AuditResult) {
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
  }

  useEffect(() => {
    async function loadAudit() {
      if (!id) return;
      try {
        const data = await db.getAudit(id);
        if (data) {
          setAudit(data);

          if (data.totalMonthlySavings > 0) {
            triggerConfetti();
          }

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

  function handleCopyLink() {
    try {
      const url = window.location.href;
      navigator.clipboard.writeText(url);
      setCopied(true);
      setTimeout(() => setCopied(false), 2000);
    } catch (e) {
      console.error(e);
    }
  }

  async function handleLeadSubmit(e: React.FormEvent) {
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
        <div className="flex-1 flex flex-col items-center justify-center gap-3">
          <div className="h-6 w-6 animate-spin rounded-full border-2 border-emerald-500 border-t-transparent" />
          <p className="text-sm text-zinc-500">Loading report...</p>
        </div>
      </div>
    );
  }

  if (!audit) {
    return (
      <div className="min-h-screen flex flex-col bg-zinc-950 text-white">
        <Navbar />
        <div className="flex-1 flex flex-col items-center justify-center gap-4 text-center px-4">
          <h2 className="text-2xl font-bold text-white">Report not found</h2>
          <button
            onClick={() => router.push("/audit")}
            className="text-sm font-medium text-emerald-400 hover:text-emerald-300 underline underline-offset-4"
          >
            Run a new audit →
          </button>
        </div>
      </div>
    );
  }

  const { teamSize, useCase } = audit.input;
  const isHighSavings = audit.totalMonthlySavings >= 500;
  const isOptimal = audit.isOptimal;

  const getActionBadgeClasses = (action: string): string => {
    switch (action) {
      case "replace":
      case "downgrade":
        return "bg-amber-500/10 text-amber-400 border border-amber-500/20";
      case "keep":
        return "bg-zinc-800 text-zinc-500 border border-zinc-700";
      case "consolidate":
        return "bg-blue-500/10 text-blue-400 border border-blue-500/20";
      default:
        return "bg-emerald-500/10 text-emerald-400 border border-emerald-500/20";
    }
  };

  const getScoreLabel = (score: number): string => {
    if (score >= 90) return "Excellent";
    if (score >= 70) return "Room to improve";
    return "Needs attention";
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[600px] bg-teal-500/5 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 py-12 px-4 sm:px-6 max-w-4xl mx-auto w-full relative z-10">

        <div className="flex items-center justify-between pb-8">
          <div>
            <p className="text-xs uppercase tracking-widest text-emerald-500 font-semibold">
              Audit Complete
            </p>
            <h1 className="text-2xl sm:text-3xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent mt-1">
              Spend Audit Report
            </h1>
            <p className="text-sm text-zinc-400 mt-1">
              Team of {teamSize} · {useCase} workload
            </p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={handleCopyLink}
              className="border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              {copied ? "Copied!" : "Copy Link"}
            </button>
            <button
              onClick={() => router.push("/audit")}
              className="border border-zinc-800 bg-zinc-900/60 hover:bg-zinc-900 text-zinc-400 hover:text-white px-3 py-1.5 rounded-lg text-xs font-medium transition-colors"
            >
              New Audit
            </button>
          </div>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
          <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-zinc-850/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Monthly Savings
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono mt-2 text-emerald-400">
              ${audit.totalMonthlySavings.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-600 mt-1">per month</p>
          </div>

          <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-zinc-850/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Annual Savings
            </p>
            <p className="text-3xl sm:text-4xl font-bold font-mono mt-2 text-emerald-400">
              ${audit.totalAnnualSavings.toLocaleString()}
            </p>
            <p className="text-xs text-zinc-600 mt-1">projected yearly</p>
          </div>

          <div className="bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 border border-zinc-850/80 rounded-2xl p-6 shadow-md">
            <p className="text-xs uppercase tracking-widest text-zinc-500 font-medium">
              Health Score
            </p>
            <p className={`text-3xl sm:text-4xl font-bold font-mono mt-2 ${
              audit.score >= 90 ? "text-emerald-400" : audit.score >= 70 ? "text-amber-400" : "text-red-400"
            }`}>
              {audit.score}/100
            </p>
            <p className="text-xs text-zinc-600 mt-1">{getScoreLabel(audit.score)}</p>
          </div>
        </div>

        <div className="mt-8 bg-gradient-to-b from-zinc-900/20 to-zinc-950/40 border border-zinc-850/60 rounded-2xl p-6 shadow-sm">
          <p className="text-sm font-semibold bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">✨ AI-Generated Summary</p>
          {aiLoading ? (
            <div className="space-y-2 mt-3">
              <div className="h-3 w-full bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-[90%] bg-zinc-800 rounded animate-pulse" />
              <div className="h-3 w-[80%] bg-zinc-800 rounded animate-pulse" />
            </div>
          ) : (
            <p className="text-sm text-zinc-300 leading-relaxed mt-3">{aiSummary}</p>
          )}
        </div>

        <div className="mt-8">
          <h2 className="text-lg font-semibold text-white mb-4">Recommendations</h2>

          {audit.recommendations.map((rec, index) => (
            <div
              key={index}
              className="bg-gradient-to-b from-zinc-900/20 to-zinc-950/40 border border-zinc-850/80 rounded-2xl p-5 mb-4 shadow-sm hover:border-zinc-700/80 transition-colors duration-300"
            >
              <div className="flex justify-between items-start">
                <div className="flex items-center gap-2">
                  <span className="text-base font-medium text-white">{rec.toolName}</span>
                  <span
                    className={`text-[11px] font-medium px-2 py-0.5 rounded-full uppercase ${getActionBadgeClasses(rec.action)}`}
                  >
                    {rec.action}
                  </span>
                </div>
                {rec.monthlySavings > 0 && (
                  <span className="text-emerald-400 font-mono font-semibold text-sm">
                    -${rec.monthlySavings}/mo
                  </span>
                )}
              </div>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">{rec.reason}</p>
              <p className="text-xs text-zinc-600 mt-3">
                Current: {rec.currentPlanName} → Recommended: {rec.recommendedPlanName}
              </p>
            </div>
          ))}
        </div>

        <div className="mt-10 border-t border-zinc-900/60 pt-10">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <div className="flex flex-col justify-center">
              {isOptimal ? (
                <>
                  <h3 className="text-xl font-semibold text-white">
                    You&apos;re spending well
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Your stack is already optimized. Enter your email to get notified when vendor pricing changes or new cost-saving opportunities emerge.
                  </p>
                </>
              ) : isHighSavings ? (
                <>
                  <h3 className="text-xl font-semibold text-white">
                    Significant savings available
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Your audit qualifies for the Credex Credit Exchange — surplus corporate credits redistributed at wholesale rates, saving up to 40% on enterprise AI tiers.
                  </p>
                </>
              ) : (
                <>
                  <h3 className="text-xl font-semibold text-white">
                    Save on your AI tools
                  </h3>
                  <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                    Execute the recommendations in this report to eliminate redundant licensing and reclaim wasted spend across your stack.
                  </p>
                </>
              )}
            </div>

            <div>
              {leadSaved ? (
                <div className="flex flex-col items-center justify-center text-center py-8">
                  <p className="text-emerald-400 text-lg font-medium">✓ Report saved!</p>
                  <p className="text-sm text-zinc-500 mt-1">Check your inbox</p>
                </div>
              ) : (
                <form onSubmit={handleLeadSubmit} className="space-y-3">
                  <input
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    placeholder="Work email"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                  />
                  <input
                    type="text"
                    value={company}
                    onChange={(e) => setCompany(e.target.value)}
                    placeholder="Company (optional)"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                  />
                  <input
                    type="text"
                    value={role}
                    onChange={(e) => setRole(e.target.value)}
                    placeholder="Role (optional)"
                    className="w-full bg-zinc-900/60 border border-zinc-800 rounded-xl py-3 px-4 text-sm text-white placeholder:text-zinc-600 focus:border-emerald-500 focus:ring-1 focus:ring-emerald-500/20 focus:outline-none transition-all duration-200"
                  />
                  <button
                    type="submit"
                    disabled={leadSaving}
                    className="w-full bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 rounded-xl py-3 text-sm font-semibold transition-all duration-300 shadow-[0_4px_15px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_20px_rgba(16,185,129,0.25)] transform hover:-translate-y-0.5 disabled:opacity-50"
                  >
                    {leadSaving
                      ? "Saving..."
                      : isHighSavings
                        ? "Book Credex Consultation"
                        : "Save Report"}
                  </button>
                  <p className="text-[11px] text-zinc-600 mt-2 text-center">
                    We respect your privacy. No spam, ever.
                  </p>
                </form>
              )}
            </div>
          </div>
        </div>

      </main>
    </div>
  );
}
