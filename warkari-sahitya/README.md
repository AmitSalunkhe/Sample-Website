# मराठी वारकरी साहित्य

A single-page site: one `index.html`, no build step, no dependencies to install.
Open the file, or serve the folder:

```bash
python -m http.server 8080 --directory warkari-sahitya
```

Tailwind comes from the Play CDN and Mukta from Google Fonts, so the page needs
a network connection the first time it loads.

## What is in it

- Hero with the Marathi title and a live search box, filtering on title, saint,
  category and raga
- Four category cards (अभंग, भजन, गौळण, हरिपाठ) that filter the list; pressing
  the active card again clears the filter
- A fixed bottom player: play and pause, previous and next, a seekable
  progress bar, and a running clock

## The player is simulated

As the brief asks. A one second timer advances the clock; there is no audio
element and no file is fetched. Wiring in real audio means replacing `tick()`
and the transport handlers, and nothing else in the file has to change.

The 27 verified YouTube ids in `../swardhara/src/lib/content.ts` can be dropped
in whenever real playback is wanted.

## Colour

The brief's saffron `#FF9933` sits at roughly 2:1 on cream, so it can never
carry text. It is used for fills, borders and the player button, and a darker
`#9A4A06` carries the words that need to be saffron. Every piece of text on the
page was measured against its composited background: nothing falls below WCAG
AA.
