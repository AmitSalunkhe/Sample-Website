"use client";

import dynamic from "next/dynamic";
import { motion, useScroll, useTransform } from "framer-motion";
import { useRef } from "react";

const JewelCanvas = dynamic(() => import("./JewelCanvas"), { ssr: false });

export default function Hero() {
  const ref = useRef<HTMLElement>(null);
  const { scrollYProgress } = useScroll({ target: ref, offset: ["start start", "end start"] });
  const y = useTransform(scrollYProgress, [0, 1], [0, 160]);
  const fade = useTransform(scrollYProgress, [0, 0.7], [1, 0]);

  return (
    <section id="top" ref={ref} className="relative flex h-screen items-center justify-center overflow-hidden">
      <div
        className="pointer-events-none absolute left-1/2 top-1/2 h-[130vh] w-[130vh] -translate-x-1/2 -translate-y-1/2 rounded-full"
        style={{
          background:
            "radial-gradient(circle, rgba(212,180,131,0.20) 0%, rgba(201,162,39,0.06) 35%, transparent 65%)",
        }}
      />

      <motion.div style={{ y, opacity: fade }} className="absolute inset-0">
        <JewelCanvas src="/jewels/necklace-4.webp" scale={1.25} className="h-full w-full" />
      </motion.div>

      <motion.div
        style={{ opacity: fade }}
        className="pointer-events-none relative z-10 px-6 text-center"
      >
        <motion.p
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 1.2, delay: 0.3 }}
          className="text-[10px] uppercase tracking-luxe text-champagne/85"
        >
          Established Jaipur · 1974
        </motion.p>

        <h1 className="font-display mt-7 text-[13vw] font-light leading-[0.88] md:text-[8.5vw]">
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, delay: 0.45, ease: [0.16, 1, 0.3, 1] }}
              className="block gold-text"
            >
              Made to
            </motion.span>
          </span>
          <span className="block overflow-hidden">
            <motion.span
              initial={{ y: "110%" }}
              animate={{ y: 0 }}
              transition={{ duration: 1.4, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
              className="block italic text-ivory/95"
            >
              outlive us
            </motion.span>
          </span>
        </h1>

        <motion.p
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ duration: 1.4, delay: 1 }}
          className="mx-auto mt-9 max-w-lg text-sm font-light leading-relaxed text-ivory/55"
        >
          Every Aurelia piece is cut, set and polished by one artisan from
          start to finish — then signed on the inner band with their mark.
        </motion.p>
      </motion.div>

      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.8, duration: 1 }}
        style={{ opacity: fade }}
        className="absolute bottom-10 left-1/2 z-10 -translate-x-1/2"
      >
        <div className="flex flex-col items-center gap-3">
          <span className="text-[9px] uppercase tracking-luxe text-ivory/40">Scroll</span>
          <motion.span
            animate={{ scaleY: [0, 1, 0], originY: [0, 0, 1] }}
            transition={{ duration: 2.4, repeat: Infinity, ease: "easeInOut" }}
            className="block h-12 w-px bg-champagne/60"
          />
        </div>
      </motion.div>
    </section>
  );
}
