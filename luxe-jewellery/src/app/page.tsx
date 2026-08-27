import Nav from "@/components/Nav";
import Hero from "@/components/Hero";
import Showcase from "@/components/Showcase";
import { Reveal, RevealWords } from "@/components/Reveal";

// One WebGL layer behind the whole document, so every section sits in 3D.
import SceneBackdrop from "@/components/SceneBackdropMount";

const CRAFT = [
  {
    n: "01",
    t: "The stone is chosen first",
    d: "We buy rough and cut in-house. Nothing is ordered from a catalogue, which is why no two Aurelia centre stones are identical.",
  },
  {
    n: "02",
    t: "One bench, one maker",
    d: "A piece is not passed between departments. The artisan who raises the setting is the one who polishes it and signs it.",
  },
  {
    n: "03",
    t: "Set under a loupe, by hand",
    d: "Every prong is raised and burnished by hand. Machine setting is faster, and we do not use it.",
  },
  {
    n: "04",
    t: "Signed, then kept on record",
    d: "Your piece is logged against its maker and its stones. Bring it back in forty years and we will know exactly what it is.",
  },
];

const JOURNAL = [
  { k: "Craft", t: "Why we still cut our own rough", d: "Six minutes" },
  { k: "Care", t: "How to store gold so it never needs re-polishing", d: "Four minutes" },
  { k: "Heritage", t: "The Jaipur bench, fifty years on", d: "Nine minutes" },
];

const PROOF: [string, string][] = [
  ["GIA / IGI", "Certified on every centre stone"],
  ["100%", "Conflict-free, documented origin"],
  ["50 yrs", "At the same Jaipur bench"],
  ["Lifetime", "Re-polish and resizing, at no cost"],
];

export default function Home() {
  return (
    <main>
      <SceneBackdrop />
      <Nav />
      <Hero />

      {/* Statement */}
      <section className="relative mx-auto max-w-[1400px] px-6 py-32 md:px-12 md:py-48">
        <div className="grid gap-12 md:grid-cols-12">
          <div className="md:col-span-4">
            <Reveal>
              <p className="text-[10px] uppercase tracking-luxe text-champagne/80">
                Our position
              </p>
            </Reveal>
          </div>
          <div className="md:col-span-8">
            <h2 className="font-display text-4xl font-light leading-[1.18] md:text-6xl">
              <RevealWords text="Jewellery became disposable when it stopped being made by hand." />
            </h2>
            <Reveal delay={0.25}>
              <p className="mt-10 max-w-xl text-[15px] font-light leading-relaxed text-ivory/60">
                We are a small house. We make roughly four hundred pieces a year,
                which is fewer than a factory makes before lunch. That constraint
                is the entire point &mdash; it is what lets one person stay with a
                piece from rough stone to final polish, and put their name inside it.
              </p>
            </Reveal>
          </div>
        </div>
      </section>

      <Showcase />

      {/* Atelier */}
      <section id="atelier" className="border-t border-champagne/10 py-32 md:py-44">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="max-w-2xl">
            <Reveal>
              <p className="text-[10px] uppercase tracking-luxe text-champagne/80">
                The Atelier
              </p>
            </Reveal>
            <h2 className="font-display mt-6 text-4xl font-light leading-tight md:text-6xl">
              <RevealWords text="Four hands, nine weeks, one piece." />
            </h2>
          </div>

          <div className="mt-20 grid gap-x-12 gap-y-16 md:grid-cols-2 lg:grid-cols-4">
            {CRAFT.map((c, i) => (
              <Reveal key={c.n} delay={i * 0.12}>
                <div className="group">
                  <span className="font-display text-6xl font-light text-champagne/25 transition-colors duration-500 group-hover:text-champagne/60">
                    {c.n}
                  </span>
                  <div className="hairline my-6" />
                  <h3 className="font-display text-2xl font-light">{c.t}</h3>
                  <p className="mt-4 text-[14px] font-light leading-relaxed text-ivory/55">
                    {c.d}
                  </p>
                </div>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Provenance */}
      <section
        id="provenance"
        className="relative overflow-hidden border-t border-champagne/10 py-32 md:py-44"
      >
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[80vh] w-[80vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-70"
          style={{
            background:
              "radial-gradient(circle, rgba(201,162,39,0.10) 0%, transparent 62%)",
          }}
        />
        <div className="relative mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="grid items-center gap-16 md:grid-cols-2">
            <div>
              <Reveal>
                <p className="text-[10px] uppercase tracking-luxe text-champagne/80">
                  Provenance
                </p>
              </Reveal>
              <h2 className="font-display mt-6 text-4xl font-light leading-tight md:text-5xl">
                <RevealWords text="Every stone can be traced to the ground it came out of." />
              </h2>
              <Reveal delay={0.2}>
                <p className="mt-8 max-w-lg text-[15px] font-light leading-relaxed text-ivory/60">
                  Each piece ships with a GIA or IGI certificate, a bench record
                  naming its maker, and a chain-of-custody document for the rough.
                  We do not deal in stones we cannot account for, and we will tell
                  you when we have turned a stone away.
                </p>
              </Reveal>
            </div>

            <div className="grid grid-cols-2 gap-px bg-champagne/12">
              {PROOF.map(([k, v], i) => (
                <Reveal key={k} delay={i * 0.1}>
                  <div className="h-full bg-obsidian p-8 md:p-10">
                    <p className="font-display text-3xl text-champagne md:text-4xl">{k}</p>
                    <p className="mt-3 text-[13px] font-light leading-relaxed text-ivory/50">
                      {v}
                    </p>
                  </div>
                </Reveal>
              ))}
            </div>
          </div>
        </div>
      </section>

      {/* Journal */}
      <section id="journal" className="border-t border-champagne/10 py-32 md:py-44">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <Reveal>
            <p className="text-[10px] uppercase tracking-luxe text-champagne/80">Journal</p>
          </Reveal>
          <div className="mt-14 divide-y divide-champagne/10 border-y border-champagne/10">
            {JOURNAL.map((j, i) => (
              <Reveal key={j.t} delay={i * 0.1}>
                <a
                  href="#"
                  className="group flex flex-col gap-3 py-9 md:flex-row md:items-center md:justify-between"
                >
                  <div className="flex flex-col gap-3 md:flex-row md:items-baseline md:gap-10">
                    <span className="w-24 shrink-0 text-[10px] uppercase tracking-luxe text-champagne/70">
                      {j.k}
                    </span>
                    <h3 className="font-display text-2xl font-light transition-colors duration-300 group-hover:text-champagne md:text-3xl">
                      {j.t}
                    </h3>
                  </div>
                  <span className="text-[11px] uppercase tracking-[0.16em] text-ivory/35">
                    {j.d}
                  </span>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </section>

      {/* Appointment */}
      <section
        id="appointment"
        className="relative overflow-hidden border-t border-champagne/10 py-36 md:py-52"
      >
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 h-[60vh]"
          style={{
            background:
              "radial-gradient(ellipse at 50% 100%, rgba(212,180,131,0.14) 0%, transparent 62%)",
          }}
        />
        <div className="relative mx-auto max-w-3xl px-6 text-center">
          <Reveal>
            <p className="text-[10px] uppercase tracking-luxe text-champagne/80">
              By appointment
            </p>
          </Reveal>
          <h2 className="font-display mt-8 text-5xl font-light leading-[1.05] md:text-7xl">
            <RevealWords text="Come and hold it." />
          </h2>
          <Reveal delay={0.3}>
            <p className="mx-auto mt-8 max-w-md text-[15px] font-light leading-relaxed text-ivory/60">
              Photographs flatten gold. Sit with us for an hour, in daylight, and
              see what the metal actually does. No obligation, and no salesperson
              in the room.
            </p>
          </Reveal>
          <Reveal delay={0.45}>
            <div className="mt-12 flex flex-col items-center justify-center gap-5 sm:flex-row">
              <a
                href="mailto:atelier@aurelia.example"
                className="bg-champagne px-12 py-5 text-[10px] uppercase tracking-luxe text-obsidian transition-opacity hover:opacity-85"
              >
                Request an appointment
              </a>
              <a
                href="tel:+910000000000"
                className="border border-champagne/30 px-12 py-5 text-[10px] uppercase tracking-luxe text-champagne transition-colors hover:bg-champagne/10"
              >
                Speak to the atelier
              </a>
            </div>
          </Reveal>
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-champagne/10 py-16">
        <div className="mx-auto max-w-[1400px] px-6 md:px-12">
          <div className="flex flex-col gap-10 md:flex-row md:items-end md:justify-between">
            <div>
              <p className="font-display gold-text text-3xl tracking-[0.2em]">AURELIA</p>
              <p className="mt-4 max-w-xs text-[13px] font-light leading-relaxed text-ivory/45">
                Johari Bazaar, Jaipur &middot; Est. 1974
                <br />
                Open Tuesday to Saturday, by appointment.
              </p>
            </div>
            <div className="flex flex-wrap gap-x-10 gap-y-3">
              {["Collections", "The Atelier", "Provenance", "Care", "Contact"].map((l) => (
                <a
                  key={l}
                  href="#"
                  className="text-[10px] uppercase tracking-luxe text-ivory/45 transition-colors hover:text-champagne"
                >
                  {l}
                </a>
              ))}
            </div>
          </div>
          <div className="hairline my-10" />
          <p className="text-[10px] uppercase tracking-[0.16em] text-ivory/25">
            &copy; 2026 Aurelia Fine Jewellery &middot; Hand-made &middot; Signed &middot;
            Guaranteed for life
          </p>
        </div>
      </footer>
    </main>
  );
}
