"use client";

import { useEffect, useRef, useState } from "react";

/**
 * Tracks whether an element is on screen. Used to park WebGL canvases with
 * `frameloop="never"` while they are scrolled out of view, so an idle canvas
 * costs nothing instead of rendering every frame for no one.
 */
export function useInView<T extends HTMLElement>(margin = "200px") {
  const ref = useRef<T | null>(null);
  const [inView, setInView] = useState(true);

  useEffect(() => {
    const el = ref.current;
    if (!el || typeof IntersectionObserver === "undefined") return;

    const io = new IntersectionObserver(
      ([e]) => setInView(e.isIntersecting),
      { rootMargin: margin }
    );
    io.observe(el);
    return () => io.disconnect();
  }, [margin]);

  return { ref, inView };
}

/**
 * Honours the OS "reduce motion" setting, and reacts if the user changes it
 * without reloading. WebGL canvases use this to render a single frame and stop,
 * rather than animating continuously at someone who asked for stillness.
 */
export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(false);

  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    setReduced(mq.matches);
    const on = (e: MediaQueryListEvent) => setReduced(e.matches);
    mq.addEventListener("change", on);
    return () => mq.removeEventListener("change", on);
  }, []);

  return reduced;
}
