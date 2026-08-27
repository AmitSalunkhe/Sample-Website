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
