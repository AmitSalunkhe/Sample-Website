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

### Why the image is sized by width, not `cover`

Measured against the real file: the painted title spans the middle 52% of the
image. `object-fit: cover` keeps only 84% of the width on a 3:2 laptop and 32%
on a phone, so the title loses its edges on everything narrower than 16:9.

Instead the image is sized to 100% width and pinned to the top, and the page
continues below it in `#af7b50`, sampled from the artwork's own bottom edge.
On ultrawide the overflow falls off the bottom, where there is only floor.

On portrait the image scales to 188% of the viewport, which leaves 53% of it
visible: the widest the art can go before the title starts to clip. That makes
the band `105.8vw` tall, and the nav and panels are positioned against that
number rather than eyeballed.

## Audio is real

27 tracks, each id checked in a live player. Playback runs through YouTube's
IFrame API behind our own controls; the site stores no audio and the API script
is only fetched when someone presses play. Track data comes from
`../swardhara/src/lib/content.ts`.

## Contrast

Every zone of the artwork was sampled before any UI was placed. The bottom is
light enough (mean `rgb(187,131,84)`) that white text on it reaches only
3.2:1, and the top right swings between bright sky and dark tree. That is why
every floating element carries its own dark glass background instead of sitting
directly on the painting.

Measured on the rendered page at 375px and 1440px: nothing below its AA
threshold, no target under 24px, no horizontal scroll.

## Image files

`img/hero-{800,1200,1672}.{avif,webp}`. One file is fetched per screen, chosen
by media query and served as AVIF where the browser takes it: 75 KB on a phone,
175 KB on a desktop. The original PNG was 2.6 MB and is not in the repo.

## Deploying

The repo holds three separate sites, so a Vercel project must be pointed at one
of them. This page needs **Root Directory `warkari-sahitya`** and no framework
preset: it is static files. `swardhara.vercel.app` points at `swardhara/` and
serves the Next.js app, which is why changes here never appear there.
