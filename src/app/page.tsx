import Link from "next/link";
import Navbar from "../components/Navbar";
import { ArrowRight, ShieldCheck, Zap, Activity, HelpCircle, AlertTriangle } from "lucide-react";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar />

      {/* Hero Section */}
      <main className="flex-1 flex flex-col items-center pt-20 pb-24 px-4 sm:px-6 lg:px-8 max-w-7xl mx-auto w-full text-center space-y-16">
        
        {/* Headline & Pitch */}
        <div className="space-y-6 max-w-3xl mx-auto">
          <span className="inline-flex items-center gap-1.5 text-xs font-semibold text-zinc-400 bg-white/5 border border-white/10 px-3 py-1.5 rounded-full">
            <Zap className="h-3.5 w-3.5 text-yellow-400 fill-yellow-400/20" />
            Optimize your SaaS overhead immediately
          </span>
          
          <h1 className="text-4xl sm:text-6xl font-extrabold tracking-tight text-white leading-[1.05]">
            You're Probably Overspending on AI
          </h1>
          
          <p className="max-w-xl mx-auto text-base sm:text-lg text-zinc-450 leading-relaxed font-normal text-zinc-400">
            Audit Cursor, Claude, ChatGPT, and API spend in 60 seconds.
          </p>

          <div className="pt-4 flex flex-wrap justify-center items-center gap-4">
            <Link
              href="/audit"
              className="group inline-flex items-center gap-2 rounded-xl bg-white px-6 py-3.5 text-base font-bold text-black hover:bg-zinc-100 transition-all active:scale-98"
            >
              Run Free Audit
              <ArrowRight className="h-5 w-5 text-zinc-650 group-hover:translate-x-0.5 transition-transform" />
            </Link>
            <Link
              href="#faq"
              className="inline-flex items-center gap-2 rounded-xl border border-white/10 bg-zinc-900/60 px-6 py-3.5 text-base font-semibold text-zinc-300 hover:text-white hover:bg-zinc-800 transition-all"
            >
              How It Works
            </Link>
          </div>
        </div>

        {/* INTERACTIVE DEMO FEEL - MOCK REPORT SCREENSHOT PREVIEW */}
        <div className="relative w-full max-w-4xl mx-auto rounded-2xl border border-white/10 bg-zinc-900/40 p-4 sm:p-6 glow-indigo overflow-hidden">
          {/* Header Bar */}
          <div className="flex items-center justify-between border-b border-white/5 pb-4 mb-6">
            <div className="flex items-center gap-2.5">
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <span className="h-3 w-3 rounded-full bg-zinc-800" />
              <span className="text-xs font-semibold text-zinc-500 font-mono pl-2">CRED-LENS-DEMO-2026.report</span>
            </div>
            <span className="text-xs font-semibold text-emerald-400 uppercase tracking-widest bg-emerald-500/10 px-2 rounded border border-emerald-500/20">
              Mock Analysis
            </span>
          </div>

          {/* Dummy Results */}
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4 text-left">
            <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Identified Savings</span>
              <span className="block text-3xl font-extrabold text-emerald-400 font-mono mt-1">$125/mo</span>
              <span className="block text-[10px] text-zinc-500 mt-1">Consolidation of Cursor & Copilot</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Annual Value</span>
              <span className="block text-3xl font-extrabold text-emerald-400 font-mono mt-1">$1,500/yr</span>
              <span className="block text-[10px] text-zinc-500 mt-1">Added operating cash flow</span>
            </div>
            <div className="rounded-xl border border-white/5 bg-zinc-950/60 p-4">
              <span className="block text-[10px] font-bold text-zinc-500 uppercase tracking-wider">Health Index</span>
              <span className="block text-3xl font-extrabold text-white font-mono mt-1">72%</span>
              <span className="block text-[10px] text-zinc-500 mt-1">Moderate license redundancy</span>
            </div>
          </div>

          {/* Fake Recommendation Snippet */}
          <div className="mt-4 border border-white/5 bg-zinc-950/40 rounded-xl p-4 text-left space-y-2">
            <div className="flex items-center justify-between text-xs">
              <div className="flex items-center gap-2">
                <span className="font-bold text-white">GitHub Copilot</span>
                <span className="bg-red-500/10 text-red-400 px-1.5 py-0.5 rounded text-[10px] uppercase font-bold">Replace</span>
              </div>
              <span className="text-emerald-400 font-mono font-bold">+$20/mo savings</span>
            </div>
            <p className="text-xs text-zinc-400 leading-relaxed">
              Consolidate Copilot into Cursor. Your team is paying for both Cursor and Copilot. Cursor includes high-quality autocomplete and native AI chat, rendering standalone Copilot redundant.
            </p>
          </div>
        </div>

        {/* SOCIAL PROOF BLOCK */}
        <div id="features" className="space-y-6 pt-10">
          <p className="text-xs font-semibold text-zinc-500 uppercase tracking-widest">
            Loved by seed founders & early builders
          </p>
          <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-6 max-w-4xl mx-auto text-left">
            <div className="border border-white/5 bg-zinc-900/30 rounded-xl p-5 space-y-3">
              <p className="text-zinc-300 text-sm leading-relaxed">
                "We saved $180/mo in under two minutes. Realized we had four developers paying for both Cursor and standalone Copilot licenses."
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">M.K.</span>
                <span className="text-[10px] text-zinc-500">Founder, Pre-Seed DevTool</span>
              </div>
            </div>
            <div className="border border-white/5 bg-zinc-900/30 rounded-xl p-5 space-y-3">
              <p className="text-zinc-300 text-sm leading-relaxed">
                "Our AI API bill was hitting $4k. The caching suggestions on CredLens alone showed us how to cut input token spend by 40%."
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">L.D.</span>
                <span className="text-[10px] text-zinc-500">AI Architect, Series A HealthTech</span>
              </div>
            </div>
            <div className="border border-white/5 bg-zinc-900/30 rounded-xl p-5 space-y-3">
              <p className="text-zinc-300 text-sm leading-relaxed">
                "We were overpaying on Claude Team seat minimums for a team of three. Switching to Pro saved us a clean $85 every month."
              </p>
              <div className="flex items-center gap-2">
                <span className="text-xs font-bold text-white">A.S.</span>
                <span className="text-[10px] text-zinc-500">Lead Dev, Seed FinTech</span>
              </div>
            </div>
          </div>
        </div>

        {/* FAQ SECTION */}
        <div id="faq" className="space-y-8 pt-10 text-left max-w-3xl mx-auto">
          <h2 className="text-2xl sm:text-3xl font-extrabold text-white text-center">Frequently Asked Questions</h2>
          
          <div className="space-y-4">
            <div className="border border-white/5 bg-zinc-900/20 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                Why should I audit my team's AI spend?
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Most startups deploy AI tools piece-meal. Individual developers request Cursor, managers assign Copilot, and product teams spin up ChatGPT Team plans. This results in heavy overlap, double-licensing the exact same LLM capabilities, and paying seat minimum penalties.
              </p>
            </div>

            <div className="border border-white/5 bg-zinc-900/20 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                Does CredLens use AI for cost calculations?
              </h4>
              <p className="text-zinc-450 text-xs sm:text-sm leading-relaxed text-zinc-400">
                No. Cost calculations and plan optimization benchmarks use a fully deterministic, finance-literate rule engine. Financial audit results must be explainable, accurate, and reproducible. We utilize LLMs solely to synthesize the findings into a personalized text summary.
              </p>
            </div>

            <div className="border border-white/5 bg-zinc-900/20 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                What is the connection between CredLens and Credex?
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                CredLens is a free tooling asset built by Credex. Credex provides discounted AI infrastructure credits sourced from companies that overforecast compute commitments. If your audit reveals high savings opportunities, Credex provides the credit sourcing to claim those discounts.
              </p>
            </div>

            <div className="border border-white/5 bg-zinc-900/20 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                Are my company details secure?
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Absolutely. We do not require any account signup or login to generate an audit. Private contact information (emails or companies) is captured separately and fully stripped from all public shared audit report URL previews.
              </p>
            </div>

            <div className="border border-white/5 bg-zinc-900/20 rounded-xl p-5 space-y-2">
              <h4 className="text-sm font-bold text-white flex items-center gap-2">
                <HelpCircle className="h-4 w-4 text-emerald-400" />
                How current is the pricing data?
              </h4>
              <p className="text-zinc-400 text-xs sm:text-sm leading-relaxed">
                Our database is updated continuously to match official developer pricing sheets (e.g. Cursor Pro $20, Claude Team $25, ChatGPT Business $25/mo). Specific verification dates and sources are transparently documented in our database references.
              </p>
            </div>
          </div>
        </div>

      </main>

      <footer className="border-t border-white/5 bg-zinc-950 py-8 text-center text-xs text-zinc-500 leading-normal">
        <p>© 2026 CredLens — Powered by Credex. Sourcing surplus compute credits at startup economics.</p>
      </footer>
    </div>
  );
}
