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

## Audio, and why nothing plays yet

**The site hosts no recordings and never will.** Almost every well-known
recording of these songs belongs to Saregama/HMV, Times Music or a similar
label. Self-hosting MP3s would earn a takedown, deservedly. So a track is a
*pointer* to a video the label itself published on YouTube, played through the
YouTube IFrame API behind our own UI.

Because of that, **every `youtubeId` in `content.ts` is currently `null`** and
each track renders as `लवकरच`. Those ids are deliberately not guessed: a wrong
id plays the wrong song, silently. Phase 3 fills them in only after each one is
checked against a label-published upload.

The song titles, poets, singers and composers in `content.ts` are real and
well-documented. It is the *links* that are pending, not the facts.

## Phases

- [x] **1. Foundation.** Scaffold, tokens, Devanagari fonts, content model, static home (hero, genres, playlists, poets), a11y baseline.
- [x] **2. Motion.** Tanpura hero in GLSL/R3F, motes, scroll-velocity tilt on the genre cards. Real-time WebGL, not baked video (see below).
- [ ] **3. Player.** YouTube IFrame API, custom chrome, persistent across routes, queue. Verify and fill every `youtubeId`.
- [ ] **4. Routes.** `/prakar/[slug]`, `/yadi/[slug]`, `/kavi/[slug]`.
- [ ] **5. Polish.** Mobile, full a11y audit, Lighthouse, perf budget, PWA install.

### On Blender

Motion is real-time WebGL, not Blender renders. Blender is not installed on this
machine, and pre-rendered video would cost tens of megabytes for something a
shader does at 60fps and at any viewport size. If a scene genuinely needs
modelled geometry later, the path is: author in Blender, export glTF, load
through R3F. The shader work stays either way.

## Before this goes live

1. Fill every `youtubeId` (Phase 3). Until then nothing is playable.
2. No poet portraits yet. Most of these figures are long dead and their images
   are likely public domain, but confirm each one before publishing it.
3. Decide the real domain and site name; `site` in `content.ts` is the single
   place to change them.
