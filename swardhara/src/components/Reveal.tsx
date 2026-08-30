"use client";

import {
  useEffect,
  useLayoutEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";

/**
 * Scroll reveal that fails safe.
 *
 * The server renders content VISIBLE, so the HTML a visitor receives is readable
 * even if JavaScript never runs, is blocked, or throws. The hidden start state is
 * applied on the client in a layout effect (before paint, so there is no flash),
 * and a watchdog forces everything visible after 1.5s in case IntersectionObserver
 * never fires. Nothing here can leave the page permanently blank.
 */

const useIsoLayoutEffect = typeof window !== "undefined" ? useLayoutEffect : useEffect;

function useReveal<T extends HTMLElement>(delay: number) {
  const ref = useRef<T | null>(null);
  // "open" on the server and on first paint of a no-JS client
  const [shown, setShown] = useState(true);
  const armed = useRef(false);

  useIsoLayoutEffect(() => {
    // Client took over before paint, so it is safe to start from the hidden
    // state, but only if we can actually observe our way back out of it.
    // If we cannot animate, we never hide, rather than hiding and immediately
    // un-hiding (which costs a second render and can flash).
    const canAnimate =
      typeof IntersectionObserver !== "undefined" &&
      !window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    if (!armed.current && canAnimate) {
      armed.current = true;
      setShown(false);
    }
  }, []);

  useEffect(() => {
    const el = ref.current;
    // Not armed means we are already visible and have nothing to observe for.
    if (!el || !armed.current) return;

    const io = new IntersectionObserver(
      (entries) => {
        if (entries.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.12 }
    );
    io.observe(el);

    // watchdog: never let anything stay hidden
    const t = window.setTimeout(() => {
      setShown(true);
      io.disconnect();
    }, 1500 + delay * 1000);

    return () => {
      io.disconnect();
      window.clearTimeout(t);
    };
  }, [delay]);

  return { ref, shown };
}

export function Reveal({
  children,
  delay = 0,
  y = 28,
  className = "",
}: {
  children: ReactNode;
  delay?: number;
  y?: number;
  className?: string;
}) {
  const { ref, shown } = useReveal<HTMLDivElement>(delay);

  return (
    <div
      ref={ref}
      className={className}
      style={{
        opacity: shown ? 1 : 0,
        transform: shown ? "none" : `translateY(${y}px)`,
        transition: `opacity .9s cubic-bezier(.16,1,.3,1) ${delay}s, transform .9s cubic-bezier(.16,1,.3,1) ${delay}s`,
        willChange: "opacity, transform",
      }}
    >
      {children}
    </div>
  );
}

/** Splits a line into words that rise independently, used on display headings. */
export function RevealWords({
  text,
  className = "",
  delay = 0,
}: {
  text: string;
  className?: string;
  delay?: number;
}) {
  const { ref, shown } = useReveal<HTMLSpanElement>(delay);
  const words = text.split(" ");

  return (
    <span ref={ref} className={className}>
      {words.map((w, i) => (
        <span key={i} className="inline-block overflow-hidden align-bottom">
          <span
            className="inline-block"
            style={{
              transform: shown ? "none" : "translateY(110%)",
              transition: `transform 1s cubic-bezier(.16,1,.3,1) ${delay + i * 0.06}s`,
              willChange: "transform",
            }}
          >
            {w}&nbsp;
          </span>
        </span>
      ))}
    </span>
  );
}
