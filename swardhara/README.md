# स्वरधारा · Swardhara

A Marathi music site: अभंग, गौळण, भावगीत, भक्तिगीत, नाट्यसंगीत, लावणी, कोळीगीत.

Next.js 16, React 19, Tailwind v4, Three.js / R3F, Framer Motion and Lenis:
the same stack as `luxe-jewellery` and `lumiere-studio`, so `Reveal`,
`SmoothScroll` and `lib/perf.ts` are shared patterns rather than rewrites.

```bash
npm install
npm run dev
```

## Where things live

| Path | What |
|---|---|
| `src/lib/content.ts` | **The whole site's content.** Genres, tracks, poets, playlists. No component hard-codes a song title. |
| `src/app/globals.css` | Design tokens. Paper/ink surfaces, five accents, grain, focus, skip link. |
| `src/app/layout.tsx` | Devanagari fonts (Tiro display, Mukta text), `lang="mr"`, metadata. |
| `src/lib/perf.ts` | One shared rAF loop, viewport parking, reduced-motion. Phase 2's canvas hangs off this. |

## Design language

Not a "music app" look. The register is warkari and rangabhoomi: aged paper,
geru and haldi, tulsi green, a Pandharpur-evening blue. It is warm-light by
design and has **no dark variant**, because the entire palette rests on the
paper being lighter than the ink. Inverting it would not be the same site.

Every `-deep` accent clears WCAG AA (4.5:1) against *both* `--paper` and
`--paper-deep`, because cards tint the surface under their own text. Two tokens
were darkened during Phase 1 for exactly this reason (`--ink-faint` 3.96 → 5.26,
`--haldi-deep` 4.33 → 5.02 on `--paper-deep`).

Devanagari sets `line-height: 1.75` on body: matras sit above the line and
crowd at the leading Latin text gets away with.

## Audio

**The site hosts no recordings and never will.** Almost every well-known
recording of these songs belongs to Saregama/HMV, Times Music or a similar
label. Self-hosting MP3s would earn a takedown, deservedly. So a track is a
*pointer* to a video the label itself published on YouTube, played through the
YouTube IFrame API behind our own UI.

Every id in `content.ts` was checked in a live player: it constructs, fires
onReady and reports a real duration. Four videos from the source playlists are
absent because they are private and report 0:00, and a track that cannot play
is worse than one that is missing.

Attribution follows the same rule. `singer` is filled only where the video's
title or channel names the performer, `poet` only where the abhang's authorship
is not in doubt, and `channel` is always the real uploader so credit stays
traceable. Nothing is guessed.

## Phases

- [x] **1. Foundation.** Scaffold, tokens, Devanagari fonts, content model, static home (hero, genres, playlists, poets), a11y baseline.
- [x] **2. Motion.** Tanpura hero in GLSL/R3F, motes, scroll-velocity tilt on the genre cards. Real-time WebGL, not baked video (see below).
- [x] **3. Player.** Engine, custom chrome, persistent across routes, queue, and 27 verified tracks.
- [x] **4. Routes.** `/prakar/[slug]`, `/yadi/[slug]`, `/kavi/[slug]`, plus a 404. All static.
- [x] **5. Polish.** Mobile pass, contrast and touch-target audit, manifest, icon, sitemap, robots.

### On Blender

Motion is real-time WebGL, not Blender renders. Blender is not installed on this
machine, and pre-rendered video would cost tens of megabytes for something a
shader does at 60fps and at any viewport size. If a scene genuinely needs
modelled geometry later, the path is: author in Blender, export glTF, load
through R3F. The shader work stays either way.

## Verified

Audited on every route at 375px, with the player open: no text below its WCAG
AA threshold, no interactive target under 24px, no horizontal scroll. Playback
survives client-side navigation, checked across two route changes.

Two things could not be checked here. `prefers-reduced-motion` cannot be
emulated in this browser pane, so that path is code-reviewed rather than run.
And ResizeObserver does not fire in the pane at all, so R3F never sizes its
canvas: the hero shader was verified by compiling and rendering it in a
hand-sized WebGL2 context instead.

## Before this goes live

2. No poet portraits yet. Most of these figures are long dead and their images
   are likely public domain, but confirm each one before publishing it.
3. Decide the real domain and site name; `site` in `content.ts` is the single
   place to change them.
