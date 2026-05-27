import Link from "next/link";
import Navbar from "../components/Navbar";

export default function Home() {
  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient background glow rings */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[600px] bg-teal-500/5 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />

      <main className="flex-1 flex flex-col items-center px-4 sm:px-6 relative z-10">

        {/* Hero */}
        <section className="pt-24 sm:pt-36 pb-20 text-center max-w-4xl mx-auto">
          <div className="inline-flex items-center gap-2 px-3 py-1.5 rounded-full border border-emerald-500/20 bg-emerald-500/5 text-xs text-emerald-400 font-medium mb-8 shadow-[0_0_15px_rgba(16,185,129,0.05)]">
            <span className="h-1.5 w-1.5 rounded-full bg-emerald-400 animate-pulse" />
            <span>Free AI Spend Audit</span>
          </div>

          <h1 className="text-5xl sm:text-7xl font-extrabold tracking-tight leading-[1.05] bg-gradient-to-b from-white via-zinc-100 to-zinc-400 bg-clip-text text-transparent">
            Stop Overpaying for <br className="hidden sm:inline" />
            <span className="bg-gradient-to-r from-emerald-400 to-teal-400 bg-clip-text text-transparent">
              AI Tools
            </span>
          </h1>

          <p className="mt-6 text-lg text-zinc-400 leading-relaxed max-w-2xl mx-auto">
            Audit your Cursor, Claude, ChatGPT &amp; API spend in 60 seconds.
            Get actionable savings — no signup required.
          </p>

          <div className="mt-10">
            <Link
              href="/audit"
              className="inline-block bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 text-zinc-950 text-base font-semibold px-8 py-4 rounded-xl shadow-[0_4px_20px_rgba(16,185,129,0.15)] hover:shadow-[0_4px_25px_rgba(16,185,129,0.3)] transition-all duration-300 transform hover:-translate-y-0.5"
            >
              Start Free Audit →
            </Link>
          </div>

          <p className="mt-4 text-xs text-zinc-600">
            No account needed · Results in 60 seconds
          </p>
        </section>

        {/* How It Works */}
        <section id="how-it-works" className="py-24 w-full max-w-4xl mx-auto border-t border-zinc-900/60">
          <p className="text-xs uppercase tracking-widest text-emerald-500/70 font-semibold text-center mb-16">
            How It Works
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
            <div className="group p-6 rounded-2xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
              <span className="text-5xl font-black bg-gradient-to-br from-emerald-400/20 to-teal-500/20 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-500">01</span>
              <h3 className="text-lg font-semibold text-white mt-4">Input Your Stack</h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Tell us what AI tools your team pays for, which plans, and how many seats.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
              <span className="text-5xl font-black bg-gradient-to-br from-emerald-400/20 to-teal-500/20 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-500">02</span>
              <h3 className="text-lg font-semibold text-white mt-4">Get Your Audit</h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                Our deterministic engine benchmarks your spend against optimal configurations.
              </p>
            </div>
            <div className="group p-6 rounded-2xl bg-zinc-900/20 border border-zinc-900 hover:border-zinc-800 transition-all duration-300">
              <span className="text-5xl font-black bg-gradient-to-br from-emerald-400/20 to-teal-500/20 bg-clip-text text-transparent group-hover:from-emerald-400 group-hover:to-teal-400 transition-all duration-500">03</span>
              <h3 className="text-lg font-semibold text-white mt-4">Save Money</h3>
              <p className="text-sm text-zinc-400 mt-2 leading-relaxed">
                See exactly where to downgrade, consolidate, or switch — with dollar amounts.
              </p>
            </div>
          </div>
        </section>

        {/* Social Proof */}
        <section id="proof" className="py-24 w-full max-w-4xl mx-auto border-t border-zinc-900/60">
          <p className="text-xs uppercase tracking-widest text-emerald-500/70 font-semibold text-center mb-16">
            What founders are saying
          </p>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
            <div className="border border-zinc-800/80 rounded-2xl p-6 bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-zinc-700/80 hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;Saved $180/mo in under two minutes. We had four devs paying for both Cursor and Copilot.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm font-bold text-white">M.K.</span>
                <span className="text-xs text-zinc-500">— Founder, Pre-Seed DevTool</span>
              </div>
            </div>

            <div className="border border-zinc-800/80 rounded-2xl p-6 bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-zinc-700/80 hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;The caching suggestions alone showed us how to cut API token spend by 40%.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm font-bold text-white">L.D.</span>
                <span className="text-xs text-zinc-500">— AI Architect, Series A HealthTech</span>
              </div>
            </div>

            <div className="border border-zinc-800/80 rounded-2xl p-6 bg-gradient-to-b from-zinc-900/40 to-zinc-950/60 shadow-[0_4px_20px_rgba(0,0,0,0.3)] hover:border-zinc-700/80 hover:shadow-[0_4px_30px_rgba(0,0,0,0.5)] transition-all duration-300 transform hover:-translate-y-0.5">
              <p className="text-sm text-zinc-300 italic leading-relaxed">
                &ldquo;Switching from Claude Team to Pro saved us $85/mo for a three-person team.&rdquo;
              </p>
              <div className="mt-6 flex items-center gap-2">
                <span className="text-sm font-bold text-white">A.S.</span>
                <span className="text-xs text-zinc-500">— Lead Dev, Seed FinTech</span>
              </div>
            </div>
          </div>

          <p className="text-[10px] text-zinc-600 text-center mt-8">
            (Mocked social proof for demonstration)
          </p>
        </section>

        {/* FAQ */}
        <section id="faq" className="py-24 w-full max-w-2xl mx-auto border-t border-zinc-900/60">
          <h2 className="text-2xl font-bold text-white text-center mb-12">
            Frequently Asked Questions
          </h2>

          <div className="divide-y divide-zinc-900">
            <details className="group py-5">
              <summary className="flex items-center justify-between text-base font-medium text-white transition-colors duration-200 hover:text-emerald-400">
                Why should I audit my AI spend?
                <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-300 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed pl-1">
                Most startups deploy AI tools piecemeal — individual devs get Cursor, managers assign Copilot,
                product teams spin up ChatGPT Team plans. The result is overlapping licenses and wasted seat minimums.
              </p>
            </details>

            <details className="group py-5">
              <summary className="flex items-center justify-between text-base font-medium text-white transition-colors duration-200 hover:text-emerald-400">
                Does CredLens use AI for the calculations?
                <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-300 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed pl-1">
                No. All cost calculations use a deterministic rules engine. Financial results must be accurate
                and reproducible. We only use AI to generate a personalized text summary of findings.
              </p>
            </details>

            <details className="group py-5">
              <summary className="flex items-center justify-between text-base font-medium text-white transition-colors duration-200 hover:text-emerald-400">
                What&apos;s the connection to Credex?
                <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-300 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed pl-1">
                CredLens is a free tool by Credex. Credex sources discounted AI infrastructure credits from
                companies that overforecast compute. If your audit shows big savings, Credex can help capture them.
              </p>
            </details>

            <details className="group py-5">
              <summary className="flex items-center justify-between text-base font-medium text-white transition-colors duration-200 hover:text-emerald-400">
                Is my data secure?
                <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-300 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed pl-1">
                Yes. No account or login required. Contact information is captured separately and stripped
                from all public shared report URLs.
              </p>
            </details>

            <details className="group py-5">
              <summary className="flex items-center justify-between text-base font-medium text-white transition-colors duration-200 hover:text-emerald-400">
                How current is the pricing?
                <span className="text-zinc-500 group-open:rotate-45 transition-transform duration-300 text-xl leading-none">+</span>
              </summary>
              <p className="mt-3 text-sm text-zinc-400 leading-relaxed pl-1">
                Updated continuously against official vendor pricing pages. All sources documented in our
                pricing database with verification dates.
              </p>
            </details>
          </div>
        </section>
      </main>

      <footer className="border-t border-zinc-900/60 py-10 text-center relative z-10 bg-zinc-950/80">
        <p className="text-xs text-zinc-600">© 2026 CredLens — A Credex product</p>
      </footer>
    </div>
  );
}
