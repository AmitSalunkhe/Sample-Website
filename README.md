# Sample Websites

Production-grade reference sites built as client-facing demos.

| | Project | Stack |
|---|---|---|
| 💍 | [`luxe-jewellery/`](./luxe-jewellery), **Aurelia**, fine jewellery | Next.js 16 · React 19 · Tailwind v4 · Three.js / R3F · Framer Motion · Lenis |
| 📷 | [`lumiere-studio/`](./lumiere-studio), **Lumière**, photography & family films | Next.js 16 · React 19 · Tailwind v4 · Three.js / R3F · Framer Motion · Lenis |
| 🪕 | [`swardhara/`](./swardhara), **स्वरधारा**, Marathi music | Next.js 16 · React 19 · Tailwind v4 · Three.js / R3F · Framer Motion · Lenis |

## Running any of them

```bash
cd luxe-jewellery   # or: cd lumiere-studio, cd swardhara
npm install
npm run dev
```

---

## स्वरधारा, Marathi music

Abhang, gaulan, bhavgeet, bhaktigeet, natyasangeet, lavani and koligeet on a
warm-paper, Devanagari-first site. Phase 2 (motion) is in too; the player is Phase 3. See
[`swardhara/README.md`](./swardhara/README.md).

It hosts no audio: tracks point at label-published YouTube uploads, played
through the IFrame API behind custom UI. Every `youtubeId` is still `null` and
tracks render as `लवकरच` until each link is verified.

---

## Aurelia, fine jewellery

A dark, gold-on-obsidian luxury site built around real product photography.

**`src/components/JewelCanvas.tsx`** is the centrepiece. Rather than overlaying a
canned shine effect, it runs a Sobel pass over each photograph's own luminance to
reconstruct a surface normal, then lights that normal in real time. The result is
that the moving key light lands on the metal that is genuinely in the image, and
the sparkle tracks the actual stones. It also applies chromatic refraction, a
travelling polish band, and pointer-driven tilt.

**`src/components/Showcase.tsx`** pins the stage and scroll-scrubs through the
collection, the camera moves, the piece stays lit and centred.

Product images are WebP at 900px (~411 KB total, down from ~13 MB of PNG).
The original PNGs are kept alongside them in `public/jewels/`.

## Lumière, photography and cinematic family films

A warm, bone-and-clay editorial site in a memory/legacy register.

**`src/components/FilmFrame.tsx`** renders photographs as film rather than as flat
assets: scroll velocity bends the frame, highlights halate warm, emulsion grain
moves, and chromatic aberration increases toward the edges the way a real lens
behaves.

**`src/components/Stories.tsx`** pins vertically and runs the occasions sideways,
like a strip passing a gate.

---

## Known gaps before either goes live

These are demo builds. Three things need real assets swapped in:

1. **Branded product photography has been removed.** Two of the supplied images
   were Cartier product shots: `Necklece 1` (signature visible on the pendant)
   and `Ring2` (the C de Cartier ring, where the interlocking logo *is* the
   design). Both are deleted from `public/jewels/` and neither is referenced.
   The piece that used the first is now **Mayura**, a kundan and meenakari
   bridal necklace, which also suits a Jaipur house far better.

   Note that both files remain in this repository's git history. If that matters
   for your use, the history needs rewriting; removing them from the working
   tree does not erase earlier commits.

   Still worth checking: the remaining images are catalogue-style product shots
   of unknown origin. Confirm the client owns or has licensed each one before
   any public launch.
2. **`luxe-jewellery`, `ring-1` is only 400×400** and looks soft at hero size.
   Needs a re-shoot.
3. **`lumiere-studio`, all photography is Unsplash stock.** Replace with the
   studio's actual portfolio.

Neither site has real 3D product video or Spline scenes. The WebGL treatments
above are the substitute. For literal 360° spins the path is a turntable shoot
(36 frames per piece, scroll-scrubbed).
