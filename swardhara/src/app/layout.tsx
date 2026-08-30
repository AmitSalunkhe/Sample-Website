import type { Metadata } from "next";
import { Tiro_Devanagari_Marathi, Mukta } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import { site } from "@/lib/content";
import "./globals.css";

/* Tiro is drawn specifically for Marathi and keeps conjuncts and the eyebrow
 * line intact at display size. It ships one weight, which is fine for a serif
 * used only on headings. */
const tiro = Tiro_Devanagari_Marathi({
  subsets: ["devanagari", "latin"],
  weight: ["400"],
  variable: "--font-tiro",
  display: "swap",
});

const mukta = Mukta({
  subsets: ["devanagari", "latin"],
  weight: ["300", "400", "500", "600"],
  variable: "--font-mukta",
  display: "swap",
});

export const metadata: Metadata = {
  title: `${site.name} | ${site.tagline}`,
  description: site.description,
  openGraph: {
    title: `${site.name} · ${site.roman}`,
    description: site.description,
    locale: "mr_IN",
    type: "website",
  },
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" className={`${tiro.variable} ${mukta.variable}`}>
      <body className="grain antialiased">
        <a href="#main" className="skip-link">
          मुख्य मजकुराकडे जा
        </a>
        <SmoothScroll />
        {children}
      </body>
    </html>
  );
}
