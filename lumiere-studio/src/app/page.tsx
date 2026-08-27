import Image from "next/image";
import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Stories from "@/components/Stories";
import { Reveal, RevealWords } from "@/components/Reveal";
import {
  ScrollProgress,
  Marquee,
  Parallax,
  TiltCard,
  Counter,
} from "@/components/MotionBits";
import { GALLERY, PACKAGES, PROCESS, VOICES, U } from "@/lib/content";

const MARQUEE = [
  "Weddings",
  "First Birthdays",
  "Restorations",
  "Festivals",
  "Engagements",
  "Family Films",
];

export default function Home() {
  return (
    <main>
      <ScrollProgress />
      <Nav />
      <Hero />

      {/* Promise */}
      <section className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
        <div className="grid gap-14 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="text-[10px] uppercase tracking-wide-xs text-clay">
                Why we exist
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-3xl font-light leading-[1.2] md:text-5xl">
              <RevealWords text="Most families have thousands of photographs and not one story they can sit down and watch." />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-9 max-w-xl text-[15px] font-light leading-relaxed text-ink-soft/80">
                Phones made it easy to capture everything and impossible to find
                anything. We do the slow part: sitting with your material, listening
                to what actually happened, and shaping it into something with a
                beginning and an end.
              </p>
            </Reveal>
            <Reveal delay={0.35}>
              <div className="mt-12 grid gap-8 sm:grid-cols-3">
                {[
                  ["Private by default", "Your files are encrypted, never used as marketing, and deleted on request."],
                  ["Told by people", "A human editor, a human colourist. No template, no generated footage."],
                  ["Built to last", "Archival masters, backed up for twenty years and re-mastered as formats change."],
                ].map(([t, d]) => (
                  <div key={t}>
                    <div className="rule mb-5" />
                    <h3 className="font-display text-lg">{t}</h3>
                    <p className="mt-2 text-[13px] font-light leading-relaxed text-ink-soft/70">
                      {d}
                    </p>
                  </div>
                ))}
              </div>
            </Reveal>
          </div>
        </div>
      </section>

      {/* Marquee band — continuous drift, pauses when you hover it */}
      <section className="border-y border-ink/10 bg-bone-deep py-10 md:py-14">
        <Marquee items={MARQUEE} speed={46} className="text-ink/80" />
      </section>

      {/* Counters — numbers count up as they enter the frame */}
      <section className="mx-auto max-w-[1440px] px-6 py-24 md:px-12 md:py-32">
        <div className="grid gap-10 sm:grid-cols-3">
          {[
            { to: 412, suffix: "+", label: "Families filmed since 2016" },
            { to: 68000, suffix: "", label: "Photographs restored" },
            { to: 20, suffix: " yrs", label: "Archival backup on every film" },
          ].map((s, i) => (
            <Reveal key={s.label} delay={i * 0.1}>
              <div>
                <Counter
                  to={s.to}
                  suffix={s.suffix}
                  className="font-display block text-5xl font-light text-clay md:text-6xl"
                />
                <div className="rule my-5" />
                <p className="text-[13px] font-light leading-relaxed text-ink-soft/70">
                  {s.label}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      <Stories />

      {/* Process */}
      <section id="process" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[10px] uppercase tracking-wide-xs text-clay">How it works</p>
          </Reveal>
          <h2 className="font-display mt-5 text-3xl font-light leading-tight md:text-5xl">
            <RevealWords text="Four steps, and you only do the first one." />
          </h2>
        </div>

        <div className="mt-16 divide-y divide-ink/10 border-y border-ink/10">
          {PROCESS.map((p, i) => (
            <Reveal key={p.n} delay={i * 0.1}>
              <div className="grid gap-4 py-10 md:grid-cols-12 md:gap-10">
                <span className="font-display text-4xl font-light text-clay/45 md:col-span-2 md:text-5xl">
                  {p.n}
                </span>
                <h3 className="font-display text-2xl font-light md:col-span-4 md:text-3xl">
                  {p.t}
                </h3>
                <p className="text-[14px] font-light leading-relaxed text-ink-soft/75 md:col-span-6">
                  {p.d}
                </p>
              </div>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Featured film */}
      <section className="relative overflow-hidden bg-ink py-28 text-bone md:py-40">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="grid items-center gap-14 md:grid-cols-2">
            <Reveal>
              <div className="relative aspect-[4/5] overflow-hidden rounded-sm">
                <Image
                  src={U("1490578474895-699cd4e2cf59", 1200)}
                  alt="A first birthday, photographed"
                  fill
                  sizes="(max-width: 768px) 100vw, 50vw"
                  className="object-cover"
                />
                <div className="absolute inset-0 bg-ink/15" />
              </div>
            </Reveal>

            <div>
              <Reveal>
                <p className="text-[10px] uppercase tracking-wide-xs text-clay-light">
                  Our most requested film
                </p>
              </Reveal>
              <h2 className="font-display mt-5 text-3xl font-light leading-tight md:text-5xl">
                <RevealWords text="First birthdays" />
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-7 max-w-lg text-[15px] font-light leading-relaxed text-bone/70">
                  One tiny candle. A room full of love. We capture the giggles, the
                  cake-covered smiles and the grandparents&rsquo; happy tears, and
                  turn them into a film that grows more precious every year it
                  survives.
                </p>
              </Reveal>
              <Reveal delay={0.3}>
                <p className="mt-6 max-w-lg text-[15px] font-light leading-relaxed text-bone/70">
                  Your child will not remember the day. That is exactly the point of
                  filming it properly.
                </p>
              </Reveal>
              <Reveal delay={0.42}>
                <a
                  href="#start"
                  className="mt-10 inline-block rounded-full border border-bone/35 px-9 py-4 text-[10px] uppercase tracking-wide-xs text-bone transition-colors hover:bg-bone hover:text-ink"
                >
                  Enquire about a first birthday film
                </a>
              </Reveal>
            </div>
          </div>
        </div>
      </section>

      {/* Gallery */}
      <section id="gallery" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
        <Reveal>
          <p className="text-[10px] uppercase tracking-wide-xs text-clay">Gallery</p>
        </Reveal>
        <h2 className="font-display mt-5 max-w-2xl text-3xl font-light leading-tight md:text-5xl">
          <RevealWords text="Frames we could not bring ourselves to cut." />
        </h2>

        <div className="mt-14 columns-1 gap-5 sm:columns-2 lg:columns-3">
          {GALLERY.map((id, i) => (
            <Reveal key={id} delay={(i % 3) * 0.08} className="mb-5 break-inside-avoid">
              <Parallax
                speed={i % 3 === 1 ? 0.1 : 0.2}
                className={`relative rounded-sm ${
                  i % 3 === 0 ? "aspect-[4/5]" : i % 3 === 1 ? "aspect-square" : "aspect-[3/4]"
                }`}
              >
                {/* the image is oversized so the parallax shift never exposes an edge */}
                <div className="relative h-[130%] w-full -translate-y-[11%]">
                  <Image
                    src={U(id, 900)}
                    alt="Photography by Lumière"
                    fill
                    sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
                    className="object-cover transition-transform duration-[1.1s] ease-out hover:scale-[1.05]"
                  />
                </div>
              </Parallax>
            </Reveal>
          ))}
        </div>
      </section>

      {/* Voices */}
      <section className="border-y border-ink/10 bg-bone-deep py-28 md:py-36">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-wide-xs text-clay">
              From the families
            </p>
          </Reveal>
          <div className="mt-14 grid gap-12 md:grid-cols-3">
            {VOICES.map((v, i) => (
              <Reveal key={v.n} delay={i * 0.12}>
                <figure>
                  <span className="font-display text-5xl leading-none text-clay/40">&ldquo;</span>
                  <blockquote className="mt-4 text-[15px] font-light leading-relaxed text-ink-soft">
                    {v.q}
                  </blockquote>
                  <figcaption className="mt-6">
                    <p className="font-display text-lg">{v.n}</p>
                    <p className="mt-1 text-[10px] uppercase tracking-wide-xs text-ink-soft/50">
                      {v.m}
                    </p>
                  </figcaption>
                </figure>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Packages */}
      <section id="packages" className="mx-auto max-w-[1440px] px-6 py-28 md:px-12 md:py-40">
        <div className="max-w-2xl">
          <Reveal>
            <p className="text-[10px] uppercase tracking-wide-xs text-clay">Investment</p>
          </Reveal>
          <h2 className="font-display mt-5 text-3xl font-light leading-tight md:text-5xl">
            <RevealWords text="Priced plainly, because you have enough to think about." />
          </h2>
        </div>

        <div className="mt-16 grid gap-6 lg:grid-cols-3">
          {PACKAGES.map((p, i) => (
            <Reveal key={p.name} delay={i * 0.1}>
              <TiltCard
                className={`flex h-full flex-col rounded-sm border p-8 md:p-10 ${
                  p.featured
                    ? "border-transparent bg-ink text-bone"
                    : "border-ink/12 bg-transparent"
                }`}
              >
                {p.featured && (
                  <span className="mb-6 self-start rounded-full bg-clay px-4 py-1.5 text-[9px] uppercase tracking-wide-xs text-bone">
                    Most chosen
                  </span>
                )}
                <h3 className="font-display text-2xl font-light md:text-3xl">{p.name}</h3>
                <p
                  className={`mt-2 text-[12px] font-light leading-relaxed ${
                    p.featured ? "text-bone/60" : "text-ink-soft/60"
                  }`}
                >
                  {p.for}
                </p>
                <p
                  className={`font-display mt-7 text-4xl font-light ${
                    p.featured ? "text-clay-light" : "text-clay"
                  }`}
                >
                  {p.price}
                </p>

                <ul className="mt-8 flex-1 space-y-3">
                  {p.includes.map((inc) => (
                    <li
                      key={inc}
                      className={`flex gap-3 text-[13px] font-light leading-relaxed ${
                        p.featured ? "text-bone/75" : "text-ink-soft/75"
                      }`}
                    >
                      <span className={p.featured ? "text-clay-light" : "text-clay"}>&mdash;</span>
                      {inc}
                    </li>
                  ))}
                </ul>

                <a
                  href="#start"
                  className={`mt-10 rounded-full px-7 py-4 text-center text-[10px] uppercase tracking-wide-xs transition-colors ${
                    p.featured
                      ? "bg-bone text-ink hover:bg-clay hover:text-bone"
                      : "border border-ink/20 text-ink hover:bg-ink hover:text-bone"
                  }`}
                >
                  Enquire
                </a>
              </TiltCard>
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <p className="mt-10 text-[13px] font-light text-ink-soft/60">
            Travel outside Maharashtra is quoted separately, at cost. We take a
            limited number of weddings each season so that nobody is handed to a
            second team.
          </p>
        </Reveal>
      </section>

      {/* Start */}
      <section id="start" className="relative overflow-hidden bg-ink py-32 text-bone md:py-44">
        <div className="mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-wide-xs text-clay-light">
              Start your film
            </p>
          </Reveal>
          <h2 className="font-display mt-7 text-4xl font-light leading-[1.05] md:text-6xl">
            <RevealWords text="Tell us who you want to remember." />
          </h2>
          <Reveal delay={0.28}>
            <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-relaxed text-bone/65">
              One conversation, no obligation. Bring a date, a shoebox, or just the
              feeling you are trying to hold on to. We will tell you honestly whether
              we are the right people for it.
            </p>
          </Reveal>
          <Reveal delay={0.42}>
            <div className="mt-12 flex flex-col items-center justify-center gap-4 sm:flex-row">
              <a
                href="mailto:hello@lumiere.example"
                className="rounded-full bg-bone px-11 py-5 text-[10px] uppercase tracking-wide-xs text-ink transition-colors hover:bg-clay hover:text-bone"
              >
                Begin the journey
              </a>
              <a
                href="tel:+910000000000"
                className="rounded-full border border-bone/30 px-11 py-5 text-[10px] uppercase tracking-wide-xs text-bone transition-colors hover:bg-bone/10"
              >
                Call the studio
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="bg-ink pb-14 text-bone">
        <div className="mx-auto max-w-[1440px] px-6 md:px-12">
          <div className="h-px w-full bg-bone/12" />
          <div className="flex flex-col gap-9 pt-12 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display text-2xl tracking-[0.14em]">LUMIÈRE</p>
              <p className="mt-4 max-w-xs text-[13px] font-light leading-relaxed text-bone/50">
                Photography &amp; cinematic family films
                <br />
                Pune &middot; shooting across India
              </p>
            </div>
            <div className="flex flex-wrap gap-x-9 gap-y-3">
              {["Stories", "How it works", "Gallery", "FAQs", "Contact", "Privacy"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[10px] uppercase tracking-wide-xs text-bone/50 transition-colors hover:text-clay-light"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <p className="mt-12 text-[10px] uppercase tracking-[0.16em] text-bone/30">
            &copy; 2026 Lumière Studio &middot; Your story, beautifully told &middot; Human
            storytelling, made with care
          </p>
        </div>
      </footer>
    </main>
  );
}
