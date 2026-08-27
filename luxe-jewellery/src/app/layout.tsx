import type { Metadata } from "next";
import { Cormorant_Garamond, Jost } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import "./globals.css";

const cormorant = Cormorant_Garamond({
  subsets: ["latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-cormorant",
  display: "swap",
});

const jost = Jost({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500"],
  variable: "--font-jost",
  display: "swap",
});

export const metadata: Metadata = {
  title: "Aurelia — Fine Jewellery, Made to Outlive Us",
  description:
    "Hand-finished gold and certified diamonds. Every Aurelia piece is cut, set and polished by a single artisan, then signed.",
  openGraph: {
    title: "Aurelia — Fine Jewellery",
    description: "Hand-finished gold and certified diamonds, signed by the artisan who made them.",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en" className={`${cormorant.variable} ${jost.variable}`}>
      <body className="grain antialiased">
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
