"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";
import { U } from "@/lib/content";

const FilmFrame = dynamic(() => import("./FilmFrame"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], ["0%", "18%"]);
  const fade = useTransform(scrollYProgress, [0, 0.75], [1, 0]);
  const scale = useTransform(scrollYProgress, [0, 1], [1, 1.12]);

  return (
    <section id="top" ref={ref} className="relative h-[105vh] overflow-hidden bg-ink">
      <motion.div style={{ y, scale }} className="absolute inset-0">
        <FilmFrame src={U("1522673607200-164d1b6ce486", 2000)} className="h-full w-full" />
      </motion.div>

      {/* legibility scrim — weighted to the bottom where the type sits */}
      <div className="pointer-events-none absolute inset-0 bg-gradient-to-t from-ink/85 via-ink/25 to-ink/45" />

      <motion.div
        style={{ opacity: fade }}
        className="relative z-10 mx-auto flex h-full max-w-[1440px] flex-col justify-end px-6 pb-24 md:px-12 md:pb-28"
      >
        <motion.p
          initial={{ opacity: 0, y: 14 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.1, delay: 0.5 }}
          className="text-[10px] uppercase tracking-wide-xs text-bone/70"
        >
          Photography &amp; Cinematic Family Films
        </motion.p>

        <h1 className="font-display mt-6 max-w-4xl text-[10vw] font-light leading-[0.94] text-bone md:text-[5.6vw]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3, delay: 0.65, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              A photograph remembers
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3, delay: 0.78, ease: [0.16, 1, 0.3, 1] }}
              className="block"
            >
              the moment. A film
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.3, delay: 0.91, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-clay-light"
            >
              remembers how it felt.
            </motion.span>
          </span>
        </h1>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.3, delay: 1.3 }}
          className="mt-10 flex flex-col items-start gap-7 md:flex-row md:items-center md:justify-between"
        >
          <p className="max-w-md text-[15px] font-light leading-relaxed text-bone/70">
            Send us your photographs, your voice notes and the stories only you can
            tell. We weave them into a film your family will still be watching in
            fifty years.
          </p>

          <div className="flex flex-wrap items-center gap-4">
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
        </motion.div>
      </motion.div>
    </section>
  );
}
