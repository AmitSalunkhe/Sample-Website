"use client";

import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Stories", href: "#stories" },
  { label: "How it works", href: "#process" },
  { label: "Gallery", href: "#gallery" },
  { label: "Investment", href: "#packages" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 60);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -70, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.1, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "border-b border-ink/10 bg-bone/85 backdrop-blur-xl" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-[1440px] items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#top"
            className={`font-display text-2xl tracking-[0.14em] transition-colors ${
              solid ? "text-ink" : "text-bone"
            }`}
          >
            LUMIÈRE
          </a>

          <ul className="hidden items-center gap-9 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className={`group relative inline-flex min-h-11 items-center text-[11px] uppercase tracking-wide-xs transition-colors ${
                    solid ? "text-ink/65 hover:text-ink" : "text-bone/75 hover:text-bone"
                  }`}
                >
                  {l.label}
                  <span
                    className={`absolute -bottom-1.5 left-0 h-px w-0 transition-all duration-500 group-hover:w-full ${
                      solid ? "bg-clay" : "bg-bone"
                    }`}
                  />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href="#start"
              className={`hidden rounded-full px-6 py-3 text-[11px] uppercase tracking-wide-xs transition-colors md:block ${
                solid
                  ? "bg-clay text-bone hover:bg-ink"
                  : "border border-bone/45 text-bone hover:bg-bone hover:text-ink"
              }`}
            >
              Start your film
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-2 md:hidden"
            >
              <span className={`block h-px w-7 ${solid ? "bg-ink" : "bg-bone"}`} />
              <span className={`mt-2 block h-px w-7 ${solid ? "bg-ink" : "bg-bone"}`} />
            </button>
          </div>
        </nav>
      </motion.header>

      <AnimatePresence>
        {open && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-7 bg-bone md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-ink"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#start"
              onClick={() => setOpen(false)}
              className="mt-5 rounded-full bg-clay px-9 py-4 text-[11px] uppercase tracking-wide-xs text-bone"
            >
              Start your film
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
