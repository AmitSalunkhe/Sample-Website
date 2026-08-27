import type { Metadata } from "next";
import { Fraunces, Inter } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const fraunces = Fraunces({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-fraunces",
  display: "swap",
});

const inter = Inter({
  subsets: ["latin"],
  weight: ["300", "400", "500"],
  variable: "--font-inter",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Lumière | Photography & Cinematic Family Films",
  description:
    "A photograph remembers the moment. A film remembers how it felt. Weddings, first birthdays, festivals and the ordinary days worth keeping.",
  openGraph: {
    title: "Lumière | Photography & Cinematic Family Films",
    description:
      "Weddings, first birthdays, festivals and the ordinary days worth keeping. Photographed and filmed by people, not templates.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${fraunces.variable} ${inter.variable}`}>
      <body className="grain antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
