"use client";

import { useEffect, useRef, useState, useSyncExternalStore } from "react";

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
  // Kept fresh in an effect, not during render: writing a ref while rendering
  // is not safe under concurrent React, which may render and discard a pass.
  useEffect(() => {
    saved.current = fn;
  });

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

/**
 * Honours the OS "reduce motion" setting, and reacts if the user changes it
 * without reloading. WebGL canvases use this to render a single frame and stop,
 * rather than animating continuously at someone who asked for stillness.
 */
const REDUCE_QUERY = "(prefers-reduced-motion: reduce)";

function subscribeToMotionPref(onChange: () => void) {
  const mq = window.matchMedia(REDUCE_QUERY);
  mq.addEventListener("change", onChange);
  return () => mq.removeEventListener("change", onChange);
}

export function usePrefersReducedMotion() {
  /*
   * A media query is an external store, so read it as one. useSyncExternalStore
   * gets the real value on the very first client render instead of rendering
   * `false` and correcting it in an effect, which would animate one frame at
   * someone who asked for stillness. The server snapshot is `false` because
   * there is no OS setting to read there.
   */
  return useSyncExternalStore(
    subscribeToMotionPref,
    () => window.matchMedia(REDUCE_QUERY).matches,
    () => false
  );
}
