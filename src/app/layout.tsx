import type { Metadata } from "next";
import { Geist, Geist_Mono } from "next/font/google";
import "./globals.css";

const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const geistMono = Geist_Mono({
  variable: "--font-geist-mono",
  subsets: ["latin"],
});

export const metadata: Metadata = {
  title: "CredLens — Free AI Spend Audit for Startups",
  description:
    "Audit your team's Cursor, Claude, ChatGPT, and API spend in 60 seconds. Find overspending, consolidate licenses, and save money. No signup required.",
  openGraph: {
    title: "CredLens — Free AI Spend Audit",
    description: "Stop overpaying for AI tools. Get a free, instant spend audit.",
    type: "website",
  },
  twitter: {
    card: "summary_large_image",
    title: "CredLens — Free AI Spend Audit",
    description: "Stop overpaying for AI tools. Get a free, instant spend audit.",
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html
      lang="en"
      className={`${geistSans.variable} ${geistMono.variable} h-full antialiased`}
    >
      <body className="min-h-full flex flex-col">{children}</body>
    </html>
  );
}
