"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/db/client";
import { AuditInput } from "../../lib/engine/types";
import Navbar from "../../components/Navbar";
import AuditForm from "../../components/AuditForm";
import { ShieldCheck, BarChart3, Database } from "lucide-react";
import { isSupabaseConfigured } from "../../lib/db/client";

export default function AuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (input: AuditInput) => {
    setIsSubmitting(true);
    try {
      const savedAudit = await db.saveAudit(input);
      if (savedAudit.id) {
        // Navigate to the results page
        router.push(`/audit/${savedAudit.id}`);
      } else {
        alert("Failed to save audit result.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting audit stack.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white selection:bg-white selection:text-black">
      <Navbar />

      <main className="flex-1 flex flex-col items-center justify-center py-12 px-4 sm:px-6 lg:px-8">
        <div className="w-full max-w-4xl space-y-8 text-center">
          <div className="space-y-4">
            <h1 className="text-3xl sm:text-5xl font-extrabold tracking-tight text-white leading-none">
              AI Spend Auditor
            </h1>
            <p className="max-w-xl mx-auto text-sm sm:text-base text-zinc-400">
              Complete the quick configuration wizard to identify double licensing, seat count waste, and direct API optimizations.
            </p>
          </div>

          <AuditForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />

          {/* Security & Offline Badges */}
          <div className="flex flex-wrap justify-center items-center gap-4 text-xs font-medium text-zinc-500 pt-4">
            <span className="flex items-center gap-1.5 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full">
              <ShieldCheck className="h-4 w-4 text-emerald-400" />
              100% Secure & Compliant
            </span>
            <span className="flex items-center gap-1.5 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full">
              <BarChart3 className="h-4 w-4 text-emerald-400" />
              Optimized for 2026 Tiers
            </span>
            <span className="flex items-center gap-1.5 border border-white/5 bg-white/5 px-3 py-1.5 rounded-full">
              <Database className="h-4 w-4 text-emerald-400" />
              Database Mode: {isSupabaseConfigured ? "Connected (Supabase)" : "Offline (Local Storage)"}
            </span>
          </div>
        </div>
      </main>
    </div>
  );
}
