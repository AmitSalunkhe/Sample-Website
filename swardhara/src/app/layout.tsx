import type { Metadata, Viewport } from "next";
import { Baloo_2, Mukta } from "next/font/google";
import SmoothScroll from "@/components/SmoothScroll";
import PlayerProvider from "@/components/PlayerProvider";
import PlayerBar from "@/components/PlayerBar";
import { site } from "@/lib/content";
import "./globals.css";

/* Baloo 2 is the Devanagari cut of the Baloo family: rounded terminals, a high
 * x-height and a bounce that suits a music site far better than a book serif.
 * It is a variable font, so asking for four weights costs one file. */
const baloo = Baloo_2({
  subsets: ["devanagari", "latin"],
  weight: ["400", "500", "600", "700"],
  variable: "--font-baloo",
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
  metadataBase: new URL("https://swardhara.vercel.app"),
  applicationName: site.name,
  openGraph: {
    title: `${site.name} · ${site.roman}`,
    description: site.description,
    locale: "mr_IN",
    type: "website",
  },
};

export const viewport: Viewport = {
  themeColor: "#f6efe2",
  /* No maximum-scale and no user-scalable=no: pinch zoom stays available,
     which matters more here than a tidy layout. */
  width: "device-width",
  initialScale: 1,
};

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="mr" className={`${baloo.variable} ${mukta.variable}`}>
      <body className="grain antialiased">
        <a href="#main" className="skip-link">
          मुख्य मजकुराकडे जा
        </a>
        <SmoothScroll />
        {/* The provider wraps everything so the iframe outlives route changes:
            walking from a playlist to a poet must not restart the song. */}
        <PlayerProvider>
          {children}
          <PlayerBar />
        </PlayerProvider>
      </body>
    </html>
  );
}
