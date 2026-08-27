"use client";

import dynamic from "next/dynamic";
import { useEffect, useRef, useState } from "react";
import { U } from "@/lib/content";

const FilmFrame = dynamic(() => import("./FilmFrame"), { ssr: false });

const STAGE_ID = "film-stage";

/** Three frames, cut in sequence, like the opening of a reel. */
const SHOTS = [
  {
    img: "1522673607200-164d1b6ce486",
    kicker: "Photography and Cinematic Family Films",
    lines: ["A photograph remembers", "the moment. A film"],
    accent: "remembers how it felt.",
  },
  {
    img: "1490578474895-699cd4e2cf59",
    kicker: "First birthdays",
    lines: ["One tiny candle.", "A room"],
    accent: "full of love.",
  },
  {
    img: "1460364157752-926555421a7e",
    kicker: "Restorations",
    lines: ["Send us a shoebox.", "We will send back"],
    accent: "a lifetime.",
  },
];

function useStageProgress() {
  const [p, setP] = useState(0);
  const ref = useRef(0);

  useEffect(() => {
    let raf = 0;
    const tick = () => {
      const el = document.getElementById(STAGE_ID);
      if (el) {
        const r = el.getBoundingClientRect();
        const travel = r.height - window.innerHeight;
        const next = travel > 0 ? Math.min(Math.max(-r.top / travel, 0), 1) : 0;
        ref.current = next;
        setP((cur) => (Math.abs(cur - next) > 0.003 ? next : cur));
      }
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return { p, ref };
}

export default function Hero() {
  const { p, ref } = useStageProgress();
  const [bars, setBars] = useState(false);
  const once = useRef(false);

  // progress within the current shot, handed to the shader for the Ken Burns push
  const shotProgress = useRef(0);

  useEffect(() => {
    if (once.current) return;
    once.current = true;
    const t = window.setTimeout(() => setBars(true), 240);
    return () => window.clearTimeout(t);
  }, []);

  const scaled = p * SHOTS.length;
  const idx = Math.min(SHOTS.length - 1, Math.floor(scaled));
  shotProgress.current = Math.min(Math.max(scaled - idx, 0), 1);

  const shot = SHOTS[idx];
  const barH = bars ? "6vh" : "0vh";

  return (
    <section id={STAGE_ID} className="relative h-[300vh]">
      <div className="sticky top-0 h-screen overflow-hidden bg-ink">
        {/* the frame itself, remounted on each cut so the wipe replays */}
        <div key={shot.img} className="absolute inset-0 animate-[fadeCut_1s_ease-out]">
          <FilmFrame
            src={U(shot.img, 2000)}
            className="h-full w-full"
            progressRef={shotProgress}
          />
        </div>

        {/* letterbox */}
        <div
          className="pointer-events-none absolute inset-x-0 top-0 z-20 bg-ink"
          style={{ height: barH, transition: "height 1.6s cubic-bezier(.16,1,.3,1)" }}
        />
        <div
          className="pointer-events-none absolute inset-x-0 bottom-0 z-20 bg-ink"
          style={{ height: barH, transition: "height 1.6s cubic-bezier(.16,1,.3,1)" }}
        />

        {/* legibility scrim */}
        <div className="pointer-events-none absolute inset-0 z-10 bg-gradient-to-t from-ink/90 via-ink/25 to-ink/45" />

        {/* caption */}
        <div className="relative z-30 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-[16vh] md:px-12">
          <div key={idx} className="animate-[riseIn_1.1s_cubic-bezier(.16,1,.3,1)]">
            <p className="text-[10px] uppercase tracking-wide-xs text-bone/70">
              {shot.kicker}
            </p>
            <h1 className="font-display mt-6 max-w-4xl text-[10vw] font-light leading-[0.94] text-bone md:text-[5.2vw]">
              {shot.lines.map((l) => (
                <span key={l} className="block">
                  {l}
                </span>
              ))}
              <span className="block italic text-clay-light">{shot.accent}</span>
            </h1>
          </div>

          <div
            className="mt-10 flex flex-wrap items-center gap-4"
            style={{
              opacity: bars ? 1 : 0,
              transition: "opacity 1.2s ease .9s",
            }}
          >
            <a
              href="#start"
              className="rounded-full bg-bone px-9 py-4 text-[10px] uppercase tracking-wide-xs text-ink transition-colors hover:bg-clay hover:text-bone"
            >
              Begin the journey
            </a>
            <a
              href="#stories"
              className="rounded-full border border-bone/35 px-9 py-4 text-[10px] uppercase tracking-wide-xs text-bone transition-colors hover:bg-bone/10"
            >
              See the work
            </a>
          </div>
        </div>

        {/* shot scrubber */}
        <div className="absolute bottom-[6vh] left-1/2 z-30 hidden -translate-x-1/2 items-center gap-3 md:flex">
          {SHOTS.map((s, i) => (
            <span
              key={s.img}
              className="h-px transition-all duration-700"
              style={{
                width: i === idx ? 44 : 18,
                background: i === idx ? "var(--color-clay-light)" : "rgba(246,242,236,.25)",
              }}
            />
          ))}
        </div>
      </div>
    </section>
  );
}
