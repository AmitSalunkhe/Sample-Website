"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";

const CinematicStage = dynamic(() => import("./CinematicStage"), { ssr: false });

const STAGE_ID = "hero-stage";

/** Scroll progress through the pinned stage, 0 -> 1, on the React side. */
function useStageProgress() {
  const [p, setP] = useState(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = document.getElementById(STAGE_ID);
      if (el) {
        const r = el.getBoundingClientRect();
        const travel = r.height - window.innerHeight;
        const next = travel > 0 ? Math.min(Math.max(-r.top / travel, 0), 1) : 0;
        setP((cur) => (Math.abs(cur - next) > 0.002 ? next : cur));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return p;
}

/** Crossfades one caption in over its slice of the timeline. */
function Shot({
  from,
  to,
  p,
  children,
}: {
  from: number;
  to: number;
  p: number;
  children: React.ReactNode;
}) {
  const fade = 0.09;
  let o = 0;
  if (p >= from - fade && p <= to + fade) {
    if (p < from) o = (p - (from - fade)) / fade;
    else if (p > to) o = 1 - (p - to) / fade;
    else o = 1;
  }
  o = Math.min(Math.max(o, 0), 1);

  return (
    <div
      className="absolute inset-x-0 bottom-[16vh] px-6 md:px-12"
      style={{
        opacity: o,
        transform: `translateY(${(1 - o) * 26}px)`,
        pointerEvents: o > 0.6 ? "auto" : "none",
        transition: "opacity .35s linear, transform .5s cubic-bezier(.16,1,.3,1)",
      }}
      aria-hidden={o < 0.5}
    >
      {children}
    </div>
  );
}

export default function Hero() {
  const p = useStageProgress();
  const [bars, setBars] = useState(false);
  const once = useRef(false);

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    const t = window.setTimeout(() => setBars(true), 260);
    return () => window.clearTimeout(t);
  }, []);

  const barH = bars ? "7vh" : "0vh";

  return (
    <section id={STAGE_ID} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-obsidian">
        <CinematicStage targetId={STAGE_ID} className="absolute inset-0" />

        {/* letterbox, irises open on load, then frames the whole sequence */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-obsidian"
          style={{ height: barH, transition: "height 1.6s cubic-bezier(.16,1,.3,1)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-obsidian"
          style={{ height: barH, transition: "height 1.6s cubic-bezier(.16,1,.3,1)" }}
        />

        {/* floor shadow so the ring is grounded rather than floating in void */}
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-10 h-[42vh]"
          style={{
            background:
              "linear-gradient(to top, rgba(10,9,8,.92) 0%, rgba(10,9,8,.55) 38%, transparent 100%)",
          }}
        />

        {/* ── Shot 1: establishing ─────────────────────────── */}
        <div className="relative z-30 h-full">
          <Shot from={0} to={0.28} p={p}>
            <p
              className="text-[10px] uppercase tracking-luxe text-champagne/85"
              style={{
                opacity: bars ? 1 : 0,
                transition: "opacity 1.2s ease .6s",
              }}
            >
              Established Jaipur &middot; 1974
            </p>
            <h1 className="font-display mt-5 max-w-4xl text-[12vw] font-light leading-[0.9] md:text-[7vw]">
              <span className="block overflow-hidden">
                <span
                  className="block gold-text"
                  style={{
                    transform: bars ? "none" : "translateY(110%)",
                    transition: "transform 1.5s cubic-bezier(.16,1,.3,1) .5s",
                  }}
                >
                  Made to
                </span>
              </span>
              <span className="block overflow-hidden">
                <span
                  className="block italic text-ivory/95"
                  style={{
                    transform: bars ? "none" : "translateY(110%)",
                    transition: "transform 1.5s cubic-bezier(.16,1,.3,1) .66s",
                  }}
                >
                  outlive us
                </span>
              </span>
            </h1>
          </Shot>

          {/* ── Shot 2: the push in ────────────────────────── */}
          <Shot from={0.38} to={0.62} p={p}>
            <p className="text-[10px] uppercase tracking-luxe text-champagne/85">
              The Atelier
            </p>
            <h2 className="font-display mt-5 max-w-3xl text-[9vw] font-light leading-[0.95] md:text-[5vw]">
              Nine weeks.
              <br />
              <span className="italic text-champagne">One pair of hands.</span>
            </h2>
          </Shot>

          {/* ── Shot 3: the macro ─────────────────────────── */}
          <Shot from={0.72} to={1} p={p}>
            <p className="text-[10px] uppercase tracking-luxe text-champagne/85">
              1.10ct, cut in-house
            </p>
            <h2 className="font-display mt-5 max-w-3xl text-[9vw] font-light leading-[0.95] md:text-[5vw]">
              Photographs
              <br />
              <span className="italic text-champagne">flatten gold.</span>
            </h2>
            <a
              href="#appointment"
              className="mt-8 inline-block border border-champagne/40 px-10 py-4 text-[10px] uppercase tracking-luxe text-champagne transition-colors hover:bg-champagne hover:text-obsidian"
            >
              Come and hold it
            </a>
          </Shot>
        </div>

        {/* timeline scrubber */}
        <div className="absolute bottom-[7vh] left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 md:flex">
          {[0, 1, 2].map((i) => {
            const active = p >= [0, 0.34, 0.68][i] - 0.02;
            return (
              <span
                key={i}
                className="h-px transition-all duration-700"
                style={{
                  width: active ? 44 : 18,
                  background: active ? "var(--color-champagne)" : "rgba(244,239,230,.22)",
                }}
              />
            );
          })}
        </div>
      </div>
    </section>
  );
}
