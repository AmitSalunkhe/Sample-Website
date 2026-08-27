"use client";

import { useEffect, useRef, useState } from "react";

/* ------------------------------------------------------------------ */
/* One shared rAF loop for the whole page                              */
/* ------------------------------------------------------------------ */
/*
 * Every scroll-reactive component used to run its own requestAnimationFrame.
 * With the progress bar, eight parallax figures and the hero all ticking
 * separately, the page was scheduling a dozen independent loops per frame.
 * They now share one, which starts on the first subscriber and stops on the
 * last, so an idle page schedules nothing at all.
 */

type Sub = () => void;
const subs = new Set<Sub>();
let raf = 0;

function loop() {
  subs.forEach((fn) => fn());
  raf = subs.size ? requestAnimationFrame(loop) : 0;
}

function subscribe(fn: Sub) {
  subs.add(fn);
  if (!raf) raf = requestAnimationFrame(loop);
  return () => {
    subs.delete(fn);
    if (!subs.size && raf) {
      cancelAnimationFrame(raf);
      raf = 0;
    }
  };
}

/** Runs `fn` on the shared frame loop, but only while `active` is true. */
export function useTicker(fn: () => void, active = true) {
  const saved = useRef(fn);
  saved.current = fn;

  useEffect(() => {
    if (!active) return;
    return subscribe(() => saved.current());
  }, [active]);
}

/* ------------------------------------------------------------------ */
/* Viewport tracking                                                   */
/* ------------------------------------------------------------------ */

/**
 * Tracks whether an element is on screen. Used to park WebGL canvases with
 * `frameloop="never"` while off screen, and to stop parallax maths for figures
 * nobody is looking at.
 */
export function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(([e]) => setInView(e.isIntersecting), {
      rootMargin: margin,
    });
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, inView };
}

export const prefersReducedMotion = () =>
  typeof window !== "undefined" &&
  window.matchMedia("(prefers-reduced-motion: reduce)").matches;
