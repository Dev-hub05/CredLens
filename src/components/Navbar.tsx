"use client";

import Link from "next/link";

export default function Navbar() {
  return (
    <header className="sticky top-0 z-50 w-full border-b border-zinc-900/80 bg-zinc-950/60 backdrop-blur-md">
      <div className="mx-auto flex h-14 max-w-6xl items-center justify-between px-4 sm:px-6">
        <Link href="/" className="text-lg font-bold tracking-tight bg-gradient-to-r from-white via-zinc-100 to-emerald-400 bg-clip-text text-transparent">
          CredLens
        </Link>

        <nav className="hidden md:flex items-center gap-8 text-sm font-medium text-zinc-400">
          <Link href="/#how-it-works" className="hover:text-white transition-colors">
            How It Works
          </Link>
          <Link href="/#faq" className="hover:text-white transition-colors">
            FAQ
          </Link>
        </nav>

        <Link
          href="/audit"
          className="text-xs font-semibold text-zinc-950 bg-gradient-to-r from-emerald-400 to-teal-400 hover:from-emerald-500 hover:to-teal-500 px-4 py-2 rounded-lg shadow-[0_0_15px_rgba(16,185,129,0.15)] transition-all duration-300 transform hover:-translate-y-0.5"
        >
          Start Audit
        </Link>
      </div>
    </header>
  );
}
