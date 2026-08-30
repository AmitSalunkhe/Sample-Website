import type { MetadataRoute } from "next";
import { genres, playlists, poets } from "@/lib/content";

const BASE = "https://swardhara.vercel.app";

export default function sitemap(): MetadataRoute.Sitemap {
  return [
    { url: BASE, priority: 1 },
    ...genres.map((g) => ({ url: `${BASE}/prakar/${g.slug}`, priority: 0.8 })),
    ...playlists.map((p) => ({ url: `${BASE}/yadi/${p.slug}`, priority: 0.8 })),
    ...poets.map((p) => ({ url: `${BASE}/kavi/${p.slug}`, priority: 0.6 })),
  ];
}
