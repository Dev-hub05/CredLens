"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { db } from "../../lib/db/client";
import { AuditInput } from "../../lib/engine/types";
import Navbar from "../../components/Navbar";
import AuditForm from "../../components/AuditForm";

export default function AuditPage() {
  const router = useRouter();
  const [isSubmitting, setIsSubmitting] = useState(false);

  const handleSubmit = async (input: AuditInput) => {
    setIsSubmitting(true);
    try {
      const savedAudit = await db.saveAudit(input);
      if (savedAudit.id) {
        router.push(`/audit/${savedAudit.id}`);
      } else {
        alert("Failed to save audit result.");
      }
    } catch (e) {
      console.error(e);
      alert("Error submitting audit. Please try again.");
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="min-h-screen flex flex-col bg-zinc-950 text-white relative overflow-hidden">
      {/* Ambient background glows */}
      <div className="absolute top-[-10%] left-[-10%] w-[50%] h-[500px] bg-emerald-500/5 rounded-full blur-[160px] pointer-events-none" />
      <div className="absolute bottom-[20%] right-[-10%] w-[60%] h-[600px] bg-teal-500/5 rounded-full blur-[200px] pointer-events-none" />

      <Navbar />
      <main className="flex-1 flex flex-col items-center py-16 px-4 sm:px-6 relative z-10">
        <div className="w-full max-w-2xl">
          <div className="text-center mb-12">
            <h1 className="text-3xl sm:text-4xl font-extrabold tracking-tight bg-gradient-to-b from-white to-zinc-400 bg-clip-text text-transparent">
              Audit Your AI Spend
            </h1>
            <p className="mt-3 text-sm text-zinc-400 max-w-md mx-auto">
              Answer a few questions about your team&apos;s AI tools. Takes under 60 seconds.
            </p>
          </div>
          <AuditForm onSubmit={handleSubmit} isSubmitting={isSubmitting} />
        </div>
      </main>
    </div>
  );
}
