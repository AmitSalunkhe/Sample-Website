import Nav from "@/components/Nav";
import TanpuraCanvas from "@/components/TanpuraCanvas";
import VelocityTilt from "@/components/VelocityTilt";
import PlayButton from "@/components/PlayButton";
import Footer from "@/components/Footer";
import { Reveal, RevealWords } from "@/components/Reveal";
import {
  genres,
  playlists,
  playlistTracks,
  poets,
  site,
  tracksInGenre,
  trackCredit,
  trackLength,
  isLongForm,
  type Genre,
} from "@/lib/content";

/*
 * Tailwind scans source for complete class strings, so accent classes are
 * looked up from a literal map rather than built with template strings, since
 * `text-${accent}-deep` would compile to nothing.
 */
const accentText: Record<Genre["accent"], string> = {
  geru: "text-geru-deep",
  tulsi: "text-tulsi-deep",
  haldi: "text-haldi-deep",
  nil: "text-nil-deep",
  gulal: "text-gulal-deep",
};

const accentRule: Record<Genre["accent"], string> = {
  geru: "bg-geru",
  tulsi: "bg-tulsi",
  haldi: "bg-haldi",
  nil: "bg-nil",
  gulal: "bg-gulal",
};

function Hero() {
  return (
    <section className="relative overflow-hidden border-b border-paper-edge">
      <TanpuraCanvas />

      {/* Above the canvas, and carrying its own stacking context so the strings
          can never end up painted over the headline. */}
      <div className="relative z-10 mx-auto max-w-6xl px-5 py-24 sm:px-8 sm:py-32">
        {/* ink-soft, not ink-faint: this is a brand label rather than metadata,
            and on a narrow screen it is the one piece of hero type the canvas
            can still sit behind. Measured at 5.8:1 there, against 4.1:1 for
            ink-faint. */}
        <p className="text-sm tracking-[0.2em] text-ink-soft uppercase">
          {site.roman}
        </p>

        <h1 className="mt-4 font-display text-5xl text-ink sm:text-7xl">
          <RevealWords text="एकच अभंग, अनेक चाली" />
        </h1>

        <Reveal delay={0.15}>
          <p className="mt-6 max-w-2xl text-lg text-ink-soft">
            एकच अभंग, अनेक राग आणि अनेक गळे. वारकरी परंपरेतली कीर्तनं, भजनं,
            पंचपदी आणि स्तोत्रं, एकाच ठिकाणी.
          </p>
        </Reveal>

        <Reveal delay={0.3}>
          <div className="mt-10 flex flex-wrap gap-3">
            <a
              href="#prakar"
              className="rounded-full bg-ink px-6 py-3 text-paper transition-opacity hover:opacity-90"
            >
              प्रकार पहा
            </a>
            <a
              href="#yadya"
              className="rounded-full border border-paper-edge px-6 py-3 text-ink-soft transition-colors hover:border-ink hover:text-ink"
            >
              याद्या ऐका
            </a>
          </div>
        </Reveal>
      </div>
    </section>
  );
}

function Genres() {
  return (
    <section id="prakar" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <h2 className="font-display text-3xl text-ink sm:text-4xl">प्रकार</h2>
      <p className="mt-2 text-ink-soft">
        प्रत्येक प्रकाराची स्वतःची लय, स्वतःचा काळ आणि स्वतःचं कारण आहे.
      </p>

      <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
        {genres.map((g, i) => {
          const count = tracksInGenre(g.slug).length;
          return (
            <li key={g.slug}>
              <Reveal delay={i * 0.05}>
                <VelocityTilt strength={1 + (i % 3) * 0.25}>
                  <article className="h-full rounded-lg border border-paper-edge bg-paper-deep/60 p-6">
                    <span
                      className={`block h-1 w-10 rounded-full ${accentRule[g.accent]}`}
                      aria-hidden
                    />
                    <h3 className="mt-4 font-display text-2xl text-ink">{g.name}</h3>
                    <p className={`mt-1 text-sm ${accentText[g.accent]}`}>
                      {g.tagline}
                    </p>
                    <p className="mt-4 text-[0.95rem] leading-relaxed text-ink-soft">
                      {g.blurb}
                    </p>
                    <p className="mt-5 text-sm text-ink-faint">
                      {count} {count === 1 ? "गाणं" : "गाणी"}
                    </p>
                  </article>
                </VelocityTilt>
              </Reveal>
            </li>
          );
        })}
      </ul>
    </section>
  );
}

function Playlists() {
  return (
    <section
      id="yadya"
      className="scroll-mt-20 border-y border-paper-edge bg-paper-deep/40 py-20"
    >
      <div className="mx-auto max-w-6xl px-5 sm:px-8">
        <h2 className="font-display text-3xl text-ink sm:text-4xl">याद्या</h2>
        <p className="mt-2 text-ink-soft">वेळेप्रमाणे आणि मूडप्रमाणे बांधलेल्या.</p>

        <div className="mt-10 grid gap-8 lg:grid-cols-2">
          {playlists.map((p, i) => (
            <Reveal key={p.slug} delay={i * 0.06}>
              <article className="rounded-lg border border-paper-edge bg-paper p-6">
                <h3 className="font-display text-2xl text-ink">{p.name}</h3>
                <p className="mt-1 text-[0.95rem] text-ink-soft">{p.blurb}</p>

                <ol className="mt-5 divide-y divide-paper-edge">
                  {playlistTracks(p).map((t, n, list) => (
                    <li
                      key={t.slug}
                      className="flex items-center gap-4 py-2.5 text-[0.95rem]"
                    >
                      <span className="w-5 shrink-0 text-right text-ink-faint tabular-nums">
                        {n + 1}
                      </span>
                      <span className="min-w-0">
                        <span className="text-ink">{t.title}</span>
                        {isLongForm(t) && (
                          <span className="ml-2 align-middle text-xs text-ink-soft">
                            पूर्ण सत्र
                          </span>
                        )}
                        <span className="block text-sm text-ink-soft">
                          {trackCredit(t)}
                        </span>
                      </span>

                      <span className="ml-auto shrink-0 text-sm text-ink-soft tabular-nums">
                        {trackLength(t)}
                      </span>
                      <span className="flex shrink-0 items-center">
                        <PlayButton track={t} queue={list} />
                      </span>
                    </li>
                  ))}
                </ol>
              </article>
            </Reveal>
          ))}
        </div>
      </div>
    </section>
  );
}

function Poets() {
  return (
    <section id="kavi" className="mx-auto max-w-6xl scroll-mt-20 px-5 py-20 sm:px-8">
      <h2 className="font-display text-3xl text-ink sm:text-4xl">संत कवी</h2>
      <p className="mt-2 text-ink-soft">
        ज्यांनी हे शब्द लिहिले. सातशे वर्षांनंतरही तेच गायले जातात.
      </p>

      <ul className="mt-10 grid gap-6 sm:grid-cols-2 lg:grid-cols-4">
        {poets.map((p, i) => (
          <li key={p.slug}>
            <Reveal delay={i * 0.04}>
              <article className="h-full border-t border-ink/15 pt-4">
                <h3 className="font-display text-xl text-ink">{p.name}</h3>
                <p className="text-sm text-geru-deep">{p.epithet}</p>
                {p.years && (
                  <p className="mt-1 text-sm text-ink-faint">{p.years}</p>
                )}
                <p className="mt-3 text-[0.9rem] leading-relaxed text-ink-soft">
                  {p.blurb}
                </p>
              </article>
            </Reveal>
          </li>
        ))}
      </ul>
    </section>
  );
}

export default function Home() {
  return (
    <>
      <Nav />
      <main id="main">
        <Hero />
        <Genres />
        <Playlists />
        <Poets />
      </main>
      <Footer />
    </>
  );
}
