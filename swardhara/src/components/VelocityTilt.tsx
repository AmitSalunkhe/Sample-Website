"use client";

import { useRef, type ReactNode } from "react";
import { useInView, usePrefersReducedMotion, useTicker } from "@/lib/perf";

/**
 * Leans a card in the direction the page is being scrolled, then lets it settle.
 *
 * The transform is written straight to the node instead of through state: this
 * runs on the shared frame loop and a setState per frame per card would put a
 * dozen React renders into every scroll frame for something the compositor can
 * do on its own.
 *
 * Only skew and lift are animated, both compositor-friendly. Nothing here
 * changes layout, so it cannot reflow the grid mid-scroll.
 */
export default function VelocityTilt({
  children,
  strength = 1,
  className = "",
}: {
  children: ReactNode;
  strength?: number;
  className?: string;
}) {
  const el = useRef<HTMLDivElement | null>(null);
  const lastY = useRef(0);
  const current = useRef(0);
  const reduced = usePrefersReducedMotion();
  const { ref: viewRef, inView } = useInView<HTMLDivElement>("100px");

  useTicker(() => {
    const node = el.current;
    if (!node) return;

    const y = window.scrollY;
    const raw = y - lastY.current;
    lastY.current = y;

    /* Clamp before easing. A trackpad fling or a jump-to-anchor can move the
       page hundreds of pixels in one frame, and without this the card would
       fold in half for a frame. */
    const target = Math.max(-24, Math.min(24, raw)) * 0.06 * strength;

    current.current += (target - current.current) * 0.12;

    if (Math.abs(current.current) < 0.001) {
      current.current = 0;
      node.style.transform = "";
      return;
    }

    const skew = current.current;
    const lift = Math.abs(current.current) * 1.4;
    node.style.transform = `skewY(${skew.toFixed(3)}deg) translateY(${lift.toFixed(2)}px)`;
  }, !reduced && inView);

  return (
    <div
      ref={(n) => {
        el.current = n;
        viewRef.current = n;
      }}
      className={className}
      style={{ willChange: reduced ? undefined : "transform" }}
    >
      {children}
    </div>
  );
}
