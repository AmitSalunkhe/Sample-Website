# आपले भजन मंडळ

One page, one file. No build step, nothing to install.

```bash
python -m http.server 8080 --directory warkari-sahitya
```

Tailwind comes from the Play CDN and Mukta from Google Fonts, so the first load
needs a network connection.

## The artwork is the design

The page is the painting. Everything else floats over it as small dark glass
panels, because the artwork has to be the thing you see.

The site's name is painted into the image, so there is no HTML title over it.
The `<h1>` is screen-reader only, which keeps the name available to search
engines and assistive tech without printing it twice.

### Two paintings, one scene

The landscape file is 16:9 and the portrait file is 0.463, within a hair of a
modern phone. Each shape gets the artwork drawn for it, so the composition holds
either way instead of a phone getting a letterboxed band with filler under it.

Landscape is sized by width and pinned to the top rather than `cover`, because
the painted title spans the middle 52% of that file and `cover` clips it on
anything narrower than 16:9, a laptop included. Portrait is `cover`, anchored
to the top: a wider portrait such as a tablet then crops from the bottom, where
there is only floor, and never from the title.

## Audio is real

27 tracks, each id checked in a live player. Playback runs through YouTube's
IFrame API behind our own controls; the site stores no audio and the API script
is only fetched when someone presses play. Track data comes from
`../swardhara/src/lib/content.ts`.

## Installable

`manifest.webmanifest` plus `sw.js`. Chrome will not offer to install a site
without a service worker that handles fetch, so the worker is what makes the
Install button possible at all; the button itself only appears once the browser
fires `beforeinstallprompt`, and hides again on `appinstalled`.

The worker precaches the shell only: the page, the manifest and two icons. The
artwork is left out on purpose. There are six variants and a device uses exactly
one, picked by media query and density, so precaching the set would pull about a
megabyte of paintings nobody asked for. The fetch handler caches whichever one
the page actually requests instead. It never touches cross-origin requests, so
YouTube, Google Fonts and the Tailwind CDN are left to the network.

Icons are cropped from the portrait painting, tight on the tanpura and the man
holding it, which is the part of the scene that still reads at 48px in a
launcher. The maskable icon sits inside the 60% safe zone on the artwork's clay,
since Android crops up to 20% off every edge.

## It remembers where you were

A forty minute kirtan is not something you finish in one sitting, so the track
and the second you reached are kept in `localStorage` and restored on the next
visit.

It does not resume playing by itself. Browsers refuse audio without a gesture,
and a page that starts sounding the moment it opens has earned the reaction it
gets. The bar comes back filled in, reading "3:20 पासून", and the first press of
play picks up from there via the player's own `start` parameter.

Written every five seconds while playing, on pause, on any seek, and on
`pagehide` and `visibilitychange` — the last two because a phone being switched
away from often gives no other warning. Every read is validated: corrupt JSON, a
video no longer in the collection, a note older than a fortnight, or a position
within thirty seconds of the end all fall back to a clean start rather than
throwing. Storage access is wrapped throughout, since it throws outright in a
private window.

## Contrast

Every zone of the artwork was sampled before any UI was placed. The bottom is
light enough (mean `rgb(187,131,84)`) that white text on it reaches only
3.2:1, and the top right swings between bright sky and dark tree. That is why
every floating element carries its own dark glass background instead of sitting
directly on the painting.

Measured on the rendered page at 375px and 1440px: nothing below its AA
threshold, no target under 24px, no horizontal scroll.

## Image files

`img/hero-{800,1200,1672}` landscape and `img/hero-p-{540,800,1080}` portrait,
each as AVIF and WebP. One file is fetched per screen, chosen by media query and
density: 92 KB on a 1x phone, 175 KB on a desktop. The source PNGs were 2.6 MB
each and are not in the repo.

## Deploying

The repo holds three separate sites, so a Vercel project must be pointed at one
of them. This page needs **Root Directory `warkari-sahitya`** and no framework
preset: it is static files. `swardhara.vercel.app` points at `swardhara/` and
serves the Next.js app, which is why changes here never appear there.
