import type { MetadataRoute } from "next";
import { site } from "@/lib/content";

/**
 * Installable as an app. The collection is largely long-form listening, so a
 * standalone window without browser chrome is genuinely the better way to use
 * it on a phone.
 */
export default function manifest(): MetadataRoute.Manifest {
  return {
    name: `${site.name} · ${site.tagline}`,
    short_name: site.name,
    description: site.description,
    start_url: "/",
    display: "standalone",
    background_color: "#f6efe2",
    theme_color: "#f6efe2",
    lang: "mr",
    dir: "ltr",
    categories: ["music", "entertainment"],
    icons: [
      { src: "/icon.svg", sizes: "any", type: "image/svg+xml", purpose: "any" },
    ],
  };
}
