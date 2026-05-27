import { createClient } from "@supabase/supabase-js";
import { AuditInput, AuditResult } from "../engine/types";
import { runAudit } from "../engine/analyzer";

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL;
const supabaseAnonKey = process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY;

// Export status flag so UI can display a badge like "Database: Offline Mode (Local Storage)" or "Database: Connected"
export const isSupabaseConfigured = !!(supabaseUrl && supabaseAnonKey);

export const supabase = isSupabaseConfigured
  ? createClient(supabaseUrl!, supabaseAnonKey!)
  : null;

// Mock Storage Helper for Offline Review Mode
const LOCAL_AUDITS_KEY = "credlens_local_audits";
const LOCAL_LEADS_KEY = "credlens_local_leads";

export interface DBClient {
  saveAudit: (input: AuditInput) => Promise<AuditResult>;
  getAudit: (id: string) => Promise<AuditResult | null>;
  saveLead: (email: string, details: { company?: string; role?: string; auditId: string }) => Promise<boolean>;
}

export const db: DBClient = {
  saveAudit: async (input) => {
    const auditResult = runAudit(input);
    const id = typeof crypto !== "undefined" && crypto.randomUUID ? crypto.randomUUID() : Math.random().toString(36).substring(2, 15);
    const newRecord: AuditResult = {
      ...auditResult,
      id,
      createdAt: new Date().toISOString()
    };

    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("audits")
        .insert({
          id,
          team_size: input.teamSize,
          use_case: input.useCase,
          total_spend: auditResult.totalCurrentSpend,
          total_savings: auditResult.totalMonthlySavings,
          audit_json: newRecord
        })
        .select()
        .single();
      
      if (error) {
        console.error("Supabase insert error, falling back to mock save", error);
      } else {
        return newRecord;
      }
    }

    // Local Storage Mock Database fallback
    try {
      const local = localStorage.getItem(LOCAL_AUDITS_KEY);
      const list = local ? JSON.parse(local) : {};
      list[id] = newRecord;
      localStorage.setItem(LOCAL_AUDITS_KEY, JSON.stringify(list));
    } catch (e) {
      console.error("Failed to write to local storage", e);
    }
    return newRecord;
  },

  getAudit: async (id) => {
    if (isSupabaseConfigured && supabase) {
      const { data, error } = await supabase
        .from("audits")
        .select("audit_json")
        .eq("id", id)
        .single();
      
      if (error) {
        console.error("Supabase fetch error, falling back to mock read", error);
      } else if (data && data.audit_json) {
        return data.audit_json as AuditResult;
      }
    }

    // Local Storage Mock Database fallback
    try {
      const local = localStorage.getItem(LOCAL_AUDITS_KEY);
      const list = local ? JSON.parse(local) : {};
      return list[id] || null;
    } catch (e) {
      console.error("Failed to read from local storage", e);
      return null;
    }
  },

  saveLead: async (email, details) => {
    if (isSupabaseConfigured && supabase) {
      const { error } = await supabase
        .from("leads")
        .insert({
          email,
          company: details.company || null,
          role: details.role || null,
          audit_id: details.auditId
        });
      
      if (error) {
        console.error("Supabase lead save failed, falling back to mock", error);
      } else {
        return true;
      }
    }

    // Local Storage Mock Database fallback
    try {
      const local = localStorage.getItem(LOCAL_LEADS_KEY);
      const list = local ? JSON.parse(local) : [];
      list.push({ email, ...details, createdAt: new Date().toISOString() });
      localStorage.setItem(LOCAL_LEADS_KEY, JSON.stringify(list));
      return true;
    } catch (e) {
      console.error("Failed to write lead to local storage", e);
      return false;
    }
  }
};
