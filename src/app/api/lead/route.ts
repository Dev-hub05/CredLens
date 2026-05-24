import { NextRequest, NextResponse } from "next/server";
import { Resend } from "resend";
import { db } from "../../../lib/db/client";

const resendApiKey = process.env.RESEND_API_KEY;
const resend = resendApiKey ? new Resend(resendApiKey) : null;

export async function POST(req: NextRequest) {
  try {
    const { email, company, role, auditId, totalSavings } = await req.json();

    if (!email || !auditId) {
      return NextResponse.json({ error: "Missing required details: email or auditId." }, { status: 400 });
    }

    // Save lead to database (handles Supabase insert / local storage mock fallback)
    const saved = await db.saveLead(email, { company, role, auditId });
    if (!saved) {
      return NextResponse.json({ error: "Failed to persist lead record." }, { status: 500 });
    }

    // Send transaction email if Resend is configured
    if (resend && resendApiKey) {
      try {
        const emailResponse = await resend.emails.send({
          from: "CredLens Audits <onboarding@resend.dev>", // default sandbox sender
          to: email,
          subject: "Your AI Spend Audit Report — CredLens",
          html: `
            <div style="font-family: sans-serif; max-width: 600px; margin: 0 auto; padding: 20px; background-color: #09090b; color: #fafafa; border-radius: 12px; border: 1px solid #27272a;">
              <div style="text-align: center; margin-bottom: 30px;">
                <h1 style="color: #ffffff; margin: 0; font-size: 24px; font-weight: 800;">CredLens Report</h1>
                <p style="color: #a1a1aa; font-size: 14px; margin-top: 5px;">AI Spend Optimization & Benchmarking</p>
              </div>
              
              <div style="background-color: #18181b; padding: 20px; border-radius: 8px; border: 1px solid #27272a; margin-bottom: 25px; text-align: center;">
                <span style="font-size: 12px; font-weight: 600; color: #a1a1aa; text-transform: uppercase; letter-spacing: 1.5px;">Identified Savings Leverage</span>
                <h2 style="font-size: 36px; font-weight: 800; color: #10b981; margin: 10px 0;">$${totalSavings || 0}/mo</h2>
                <p style="color: #d4d4d8; font-size: 14px; margin: 0;">Up to $${(Number(totalSavings || 0) * 12).toLocaleString()}/year in potential savings.</p>
              </div>

              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">Hi there,</p>
              <p style="font-size: 15px; line-height: 1.6; color: #d4d4d8;">
                Your AI spend audit has been compiled and is ready for review. By optimizing license overlaps (like Cursor + Copilot) and utilizing wholesale credits, your team can immediately reclaim cash flow.
              </p>
              
              <div style="margin: 30px 0; text-align: center;">
                <a href="${req.nextUrl.origin}/audit/${auditId}" style="background-color: #ffffff; color: #09090b; text-decoration: none; padding: 12px 24px; font-size: 14px; font-weight: 700; border-radius: 6px; display: inline-block;">
                  View Live Audit Report
                </a>
              </div>

              ${Number(totalSavings) >= 500 ? `
              <div style="background-color: rgba(16, 185, 129, 0.05); border: 1px dashed rgba(16, 185, 129, 0.2); padding: 15px; border-radius: 6px; margin-bottom: 25px;">
                <h4 style="color: #10b981; margin: 0 0 5px 0; font-size: 14px; font-weight: 700;">Credex Sourcing Consultation Eligible</h4>
                <p style="color: #a1a1aa; margin: 0; font-size: 13px; line-height: 1.5;">
                  Since your potential savings exceed $500/mo, you are eligible for the Credex Wholesale compute exchange. A representative will review your profile to schedule a credit transfer.
                </p>
              </div>
              ` : ""}

              <hr style="border: 0; border-top: 1px solid #27272a; margin: 30px 0;" />
              <p style="font-size: 11px; text-align: center; color: #71717a; margin: 0;">
                CredLens — Powered by Credex. Sourcing surplus compute credits at startup economics.
              </p>
            </div>
          `
        });
        console.log("Resend email dispatch successful:", emailResponse);
      } catch (e) {
        console.error("Resend API dispatch failed:", e);
      }
    }

    return NextResponse.json({ success: true });
  } catch (error) {
    console.error("Lead submission error:", error);
    return NextResponse.json({ error: "Failed to process lead." }, { status: 500 });
  }
}
