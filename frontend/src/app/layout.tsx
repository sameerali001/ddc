import type { Metadata } from "next";
import { Inter, Outfit } from "next/font/google";
import "./globals.css";

const inter = Inter({
  subsets: ["latin"],
  variable: "--font-inter",
  display: "swap",
});

const outfit = Outfit({
  subsets: ["latin"],
  variable: "--font-outfit",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Doon Defence College | Premium Defence Coaching Institute",
  description:
    "Inspiring and training India's future officers through discipline, top-tier academic coaching, and leadership mentoring for NDA, CDS, AFCAT, and SSB.",
  keywords: [
    "Doon Defence College",
    "NDA Coaching",
    "CDS Coaching",
    "AFCAT Preparation",
    "SSB Interview Coaching",
    "Defence Academy Dehradun",
  ],
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" className={`${inter.variable} ${outfit.variable}`}>
      <head>
        <link rel="icon" href="/favicon.ico" sizes="any" />
      </head>
      <body className="antialiased bg-white text-primary">
        {children}
      </body>
    </html>
  );
}
