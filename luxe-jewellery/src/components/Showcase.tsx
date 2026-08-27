"use client";

import { useRef, useState } from "react";
import { motion, useScroll, useMotionValueEvent, AnimatePresence } from "framer-motion";
import dynamic from "next/dynamic";
import { PIECES } from "@/lib/pieces";

const JewelCanvas = dynamic(() => import("./JewelCanvas"), { ssr: false });

/**
 * A pinned stage. Scroll advances through the collection while the piece
 * stays centred and lit — the camera moves, the jewellery does not.
 */
export default function Showcase() {
  const wrap = useRef<HTMLDivElement>(null);
  const [i, setI] = useState(0);
  const { scrollYProgress } = useScroll({
    target: wrap,
    offset: ["start start", "end end"],
  });

  useMotionValueEvent(scrollYProgress, "change", (p) => {
    const next = Math.min(PIECES.length - 1, Math.floor(p * PIECES.length));
    setI((cur) => (cur === next ? cur : next));
  });

  const piece = PIECES[i];

  return (
    <section id="collections" ref={wrap} style={{ height: `${PIECES.length * 100}vh` }}>
      <div className="sticky top-0 flex h-screen items-center overflow-hidden">
        {/* pooled light behind the piece */}
        <div
          className="pointer-events-none absolute left-1/2 top-1/2 h-[110vh] w-[110vh] -translate-x-1/2 -translate-y-1/2 rounded-full opacity-60"
          style={{
            background:
              "radial-gradient(circle, rgba(212,180,131,0.16) 0%, rgba(201,162,39,0.05) 38%, transparent 68%)",
          }}
        />

        <div className="relative mx-auto grid w-full max-w-[1400px] items-center gap-8 px-6 md:grid-cols-12 md:px-12">
          {/* counter */}
          <div className="order-2 hidden md:order-1 md:col-span-2 md:block">
            <div className="flex flex-col gap-3">
              {PIECES.map((p, idx) => (
                <button
                  key={p.id}
                  onClick={() =>
                    window.scrollTo({
                      top:
                        (wrap.current?.offsetTop ?? 0) +
                        (idx + 0.5) * window.innerHeight,
                      behavior: "smooth",
                    })
                  }
                  className="group flex items-center gap-3 text-left"
                  aria-label={p.name}
                >
                  <span
                    className={`h-px transition-all duration-500 ${
                      idx === i ? "w-10 bg-champagne" : "w-4 bg-ivory/25 group-hover:w-7"
                    }`}
                  />
                  <span
                    className={`text-[10px] uppercase tracking-luxe transition-colors ${
                      idx === i ? "text-champagne" : "text-ivory/35"
                    }`}
                  >
                    {String(idx + 1).padStart(2, "0")}
                  </span>
                </button>
              ))}
            </div>
          </div>

          {/* the piece */}
          <div className="order-1 md:order-2 md:col-span-6">
            <div className="relative h-[46vh] md:h-[76vh]">
              <AnimatePresence mode="wait">
                <motion.div
                  key={piece.id}
                  initial={{ opacity: 0, scale: 0.94, filter: "blur(10px)" }}
                  animate={{ opacity: 1, scale: 1, filter: "blur(0px)" }}
                  exit={{ opacity: 0, scale: 1.04, filter: "blur(10px)" }}
                  transition={{ duration: 0.85, ease: [0.16, 1, 0.3, 1] }}
                  className="absolute inset-0"
                >
                  <JewelCanvas src={piece.src} scale={piece.scale ?? 1} className="h-full w-full" />
                </motion.div>
              </AnimatePresence>
            </div>
          </div>

          {/* detail */}
          <div className="order-3 md:col-span-4">
            <AnimatePresence mode="wait">
              <motion.div
                key={piece.id}
                initial={{ opacity: 0, y: 24 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -18 }}
                transition={{ duration: 0.7, ease: [0.16, 1, 0.3, 1] }}
              >
                <p className="text-[10px] uppercase tracking-luxe text-champagne/80">
                  {piece.collection}
                </p>
                <h3 className="font-display mt-3 text-5xl font-light md:text-6xl">{piece.name}</h3>
                <div className="hairline my-7 max-w-[220px]" />
                <p className="max-w-md text-[15px] font-light leading-relaxed text-ivory/65">
                  {piece.note}
                </p>

                <dl className="mt-8 space-y-3 text-[13px]">
                  <div className="flex gap-4">
                    <dt className="w-20 shrink-0 text-[10px] uppercase tracking-[0.18em] text-ivory/35">
                      Metal
                    </dt>
                    <dd className="text-ivory/75">{piece.metal}</dd>
                  </div>
                  <div className="flex gap-4">
                    <dt className="w-20 shrink-0 text-[10px] uppercase tracking-[0.18em] text-ivory/35">
                      Stones
                    </dt>
                    <dd className="text-ivory/75">{piece.stones}</dd>
                  </div>
                </dl>

                <div className="mt-9 flex items-center gap-7">
                  <span className="font-display text-2xl text-champagne">{piece.price}</span>
                  <a
                    href="#appointment"
                    className="border-b border-champagne/45 pb-1 text-[10px] uppercase tracking-luxe text-ivory/85 transition-colors hover:text-champagne"
                  >
                    Enquire
                  </a>
                </div>
              </motion.div>
            </AnimatePresence>
          </div>
        </div>
      </div>
    </section>
  );
}
