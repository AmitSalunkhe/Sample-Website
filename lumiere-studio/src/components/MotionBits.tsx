"use client";

import { useEffect, useRef, useState, type ReactNode } from "react";
import { useTicker, useInView, prefersReducedMotion } from "@/lib/perf";

/* ------------------------------------------------------------------ */
/* Scroll progress, a hairline that fills as you move down the page   */
/* ------------------------------------------------------------------ */

export function ScrollProgress() {
  const bar = useRef<HTMLDivElement>(null);

  useTicker(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    const p = max > 0 ? window.scrollY / max : 0;
    if (bar.current) bar.current.style.transform = `scaleX(${p})`;
  });

  return (
    <div className="fixed inset-x-0 top-0 z-[60] h-[2px] bg-transparent">
      <div
        ref={bar}
        className="h-full origin-left bg-clay"
        style={{ transform: "scaleX(0)" }}
      />
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Marquee, continuous horizontal drift, reverses direction on hover  */
/* ------------------------------------------------------------------ */

export function Marquee({
  items,
  speed = 42,
  className = "",
}: {
  items: string[];
  speed?: number;
  className?: string;
}) {
  // duplicated twice so the loop is seamless at any width
  const run = [...items, ...items];

  return (
    <div className={`group relative flex overflow-hidden ${className}`}>
      {[0, 1].map((copy) => (
        <div
          key={copy}
          aria-hidden={copy === 1}
          className="flex shrink-0 items-center gap-10 whitespace-nowrap pr-10 will-change-transform"
          style={{
            animation: `marquee ${speed}s linear infinite`,
          }}
        >
          {run.map((t, i) => (
            <span key={i} className="flex items-center gap-10">
              <span className="font-display text-4xl font-light md:text-6xl">{t}</span>
              <span className="text-clay">&#9679;</span>
            </span>
          ))}
        </div>
      ))}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Parallax, moves a layer against the scroll, at a chosen rate       */
/* ------------------------------------------------------------------ */

export function Parallax({
  children,
  speed = 0.18,
  className = "",
}: {
  children: ReactNode;
  speed?: number;
  className?: string;
}) {
  const { ref: wrap, inView } = useInView<HTMLDivElement>("200px");
  const inner = useRef<HTMLDivElement>(null);

  // shared frame loop, and only while this figure is actually on screen
  useTicker(() => {
    const el = wrap.current;
    const target = inner.current;
    if (!el || !target) return;
    const r = el.getBoundingClientRect();
    // 0 when the element is centred, negative above, positive below
    const fromCentre = r.top + r.height / 2 - window.innerHeight / 2;
    target.style.transform = `translate3d(0, ${(-fromCentre * speed).toFixed(2)}px, 0)`;
  }, inView && !prefersReducedMotion());

  return (
    <div ref={wrap} className={`overflow-hidden ${className}`}>
      <div ref={inner} className="h-full w-full will-change-transform">
        {children}
      </div>
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* TiltCard, the card leans toward the cursor in 3D                   */
/* ------------------------------------------------------------------ */

export function TiltCard({
  children,
  className = "",
  max = 9,
}: {
  children: ReactNode;
  className?: string;
  max?: number;
}) {
  const ref = useRef<HTMLDivElement>(null);

  const onMove = (e: React.MouseEvent) => {
    const el = ref.current;
    if (!el) return;
    const r = el.getBoundingClientRect();
    const px = (e.clientX - r.left) / r.width - 0.5;
    const py = (e.clientY - r.top) / r.height - 0.5;
    el.style.transform = `perspective(900px) rotateY(${px * max}deg) rotateX(${-py * max}deg) translateZ(0)`;
  };

  const reset = () => {
    if (ref.current)
      ref.current.style.transform =
        "perspective(900px) rotateY(0deg) rotateX(0deg) translateZ(0)";
  };

  return (
    <div
      ref={ref}
      onMouseMove={onMove}
      onMouseLeave={reset}
      className={className}
      style={{ transition: "transform .5s cubic-bezier(.16,1,.3,1)" }}
    >
      {children}
    </div>
  );
}

/* ------------------------------------------------------------------ */
/* Counter, counts up once it scrolls into view                       */
/* ------------------------------------------------------------------ */

export function Counter({
  to,
  suffix = "",
  duration = 1600,
  className = "",
}: {
  to: number;
  suffix?: string;
  duration?: number;
  className?: string;
}) {
  const ref = useRef<HTMLSpanElement>(null);
  // render the final value on the server so it is never blank
  const [n, setN] = useState(to);

  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    setN(0);
    let raf = 0;
    let start = 0;

    const io = new IntersectionObserver(
      ([e]) => {
        if (!e.isIntersecting) return;
        io.disconnect();
        const step = (ts: number) => {
          if (!start) start = ts;
          const p = Math.min((ts - start) / duration, 1);
          // ease-out cubic
          setN(Math.round(to * (1 - Math.pow(1 - p, 3))));
          if (p < 1) raf = requestAnimationFrame(step);
        };
        raf = requestAnimationFrame(step);
      },
      { threshold: 0.4 }
    );
    io.observe(el);

    const guard = window.setTimeout(() => setN(to), duration + 2500);

    return () => {
      io.disconnect();
      cancelAnimationFrame(raf);
      window.clearTimeout(guard);
    };
  }, [to, duration]);

  return (
    <span ref={ref} className={className}>
      {n.toLocaleString("en-IN")}
      {suffix}
    </span>
  );
}
