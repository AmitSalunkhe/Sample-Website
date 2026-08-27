"use client";

import { useRef } from "react";
import Image from "next/image";
import { motion, useScroll, useTransform } from "framer-motion";
import { STORIES, U } from "@/lib/content";

/**
 * Vertical scroll drives a horizontal reel of occasions.
 * The section pins, the film moves sideways — the way a strip runs past a gate.
 */
export default function Stories() {
  const wrap = useRef<HTMLDivElement>(null);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  // travel far enough to bring the last card fully into frame
  const x = useTransform(scrollYProgress, [0, 1], ["2%", "-78%"]);

  return (
    <section id="stories" ref={wrap} className="relative h-[420vh] bg-ink text-bone">
      <div className="sticky top-0 flex h-screen flex-col justify-center overflow-hidden">
        <div className="mx-auto mb-10 w-full max-w-[1440px] px-6 md:mb-14 md:px-12">
          <p className="text-[10px] uppercase tracking-wide-xs text-clay-light">
            What we photograph
          </p>
          <h2 className="font-display mt-4 max-w-2xl text-3xl font-light leading-tight md:text-5xl">
            Every family has a handful of days it never wants to lose.
          </h2>
        </div>

        <motion.div style={{ x }} className="flex gap-6 pl-6 md:gap-9 md:pl-12">
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
                  <span className="text-[9px] uppercase tracking-wide-xs text-bone/50">
                    {s.place}
                  </span>
                </div>
                <p className="mt-3 max-w-xs text-[13px] font-light leading-relaxed text-bone/70">
                  {s.line}
                </p>
              </div>

              <span className="absolute left-7 top-7 text-[10px] uppercase tracking-wide-xs text-bone/45 md:left-8 md:top-8">
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
