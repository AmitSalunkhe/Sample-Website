# Sample Websites

Two production-grade reference sites built as client-facing demos.

| | Project | Stack |
|---|---|---|
| 💍 | [`luxe-jewellery/`](./luxe-jewellery), **Aurelia**, fine jewellery | Next.js 16 · React 19 · Tailwind v4 · Three.js / R3F · Framer Motion · Lenis |
| 📷 | [`lumiere-studio/`](./lumiere-studio), **Lumière**, photography & family films | Next.js 16 · React 19 · Tailwind v4 · Three.js / R3F · Framer Motion · Lenis |

## Running either one

```bash
cd luxe-jewellery   # or: cd lumiere-studio
npm install
npm run dev
```

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

1. **`luxe-jewellery`, the "Trinité" piece uses a Cartier product photograph**
   (the Cartier signature is visible on the pendant), presented as Aurelia's own
   work. Replace with the client's own product photography before any public use.
2. **`luxe-jewellery`, `ring-1` is only 400×400** and looks soft at hero size.
   Needs a re-shoot.
3. **`lumiere-studio`, all photography is Unsplash stock.** Replace with the
   studio's actual portfolio.

Neither site has real 3D product video or Spline scenes. The WebGL treatments
above are the substitute. For literal 360° spins the path is a turntable shoot
(36 frames per piece, scroll-scrubbed).
