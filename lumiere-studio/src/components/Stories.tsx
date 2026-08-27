"use client";

import { useEffect, useRef, useState } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORIES, U } from "@/lib/content";

/**
 * Vertical scroll drives a horizontal reel of occasions.
 * The section pins, the film moves sideways, the way a strip runs past a gate.
 */
export default function Stories() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  /*
   * Travel is measured, not guessed. It used to be a hardcoded -78%, tuned to
   * the 30vw desktop cards; on a phone the cards are 76vw, so the track is far
   * wider relative to the viewport and the last cards were never reachable.
   * Measuring the real track width makes the reel land correctly on any screen.
   */
  const track = useRef<HTMLDivElement>(null);
  const [travel, setTravel] = useState(0);

  useEffect(() => {
    const measure = () => {
      const el = track.current;
      const last = el?.lastElementChild as HTMLElement | null;
      if (!el || !last) return;
      // offsetLeft/offsetWidth are layout values, unaffected by the x transform
      // already applied to this track. scrollWidth is useless here: the track
      // does not scroll, so it never reports the overflowing children.
      const contentWidth = last.offsetLeft + last.offsetWidth;
      const pad = window.innerWidth < 768 ? 24 : 48;
      setTravel(Math.max(0, contentWidth - window.innerWidth + pad));
    };
    measure();
    // remeasure once images have laid out, and on rotation
    const t = window.setTimeout(measure, 600);
    window.addEventListener("resize", measure);
    return () => {
      window.clearTimeout(t);
      window.removeEventListener("resize", measure);
    };
  }, []);

  const x = useTransform(scrollYProgress, [0, 1], [0, -travel]);

  return (
    <section id="stories" ref={wrap} className="relative h-[420vh] bg-ink text-bone">
      <div className="sticky top-0 flex h-[100svh] flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-[1440px] px-6 md:mb-14 md:px-12">
          <p className="text-[11px] uppercase tracking-wide-xs text-clay-light">
            What we photograph
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-light leading-tight md:text-5xl">
            Every family has a handful of days it never wants to lose.
          </h2>
        </div>

        <motion.div ref={track} style={{ x }} className="flex gap-6 pl-6 md:gap-9 md:pl-12">
          {STORIES.map((s, i) => (
            <article
              key={s.id}
              className="group relative h-[52vh] w-[76vw] shrink-0 overflow-hidden rounded-sm sm:w-[46vw] md:h-[58vh] md:w-[30vw]"
            >
              <Image
                src={U(s.img, 1200)}
                alt={s.title}
                fill
                sizes="(max-width: 640px) 76vw, (max-width: 768px) 46vw, 30vw"
                className="object-cover transition-transform duration-[1.2s] ease-out group-hover:scale-[1.06]"
                priority={i < 2}
              />
              <div className="absolute inset-0 bg-gradient-to-t from-ink/90 via-ink/20 to-transparent" />

              <div className="absolute inset-x-0 bottom-0 p-7 md:p-8">
                <div className="flex items-baseline justify-between">
                  <h3 className="font-display text-3xl font-light md:text-4xl">{s.title}</h3>
                  <span className="text-[11px] uppercase tracking-wide-xs text-bone/65">
                    {s.place}
                  </span>
                </div>
                <p className="mt-3 max-w-xs text-[13px] font-light leading-relaxed text-bone/70">
                  {s.line}
                </p>
              </div>

              <span className="absolute left-7 top-7 text-[11px] uppercase tracking-wide-xs text-bone/65 md:left-8 md:top-8">
                {String(i + 1).padStart(2, "0")} / {String(STORIES.length).padStart(2, "0")}
              </span>
            </article>
          ))}
        </motion.div>

        <div className="mx-auto mt-10 w-full max-w-[1440px] px-6 md:px-12">
          <div className="h-px w-full bg-bone/15">
            <motion.div
              style={{ scaleX: scrollYProgress }}
              className="h-full origin-left bg-clay-light"
            />
          </div>
        </div>
      </div>
    </section>
  );
}
