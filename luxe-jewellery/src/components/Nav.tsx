"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

const LINKS = [
  { label: "Collections", href: "#collections" },
  { label: "The Atelier", href: "#atelier" },
  { label: "Provenance", href: "#provenance" },
  { label: "Journal", href: "#journal" },
];

export default function Nav() {
  const [solid, setSolid] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setSolid(window.scrollY > 40);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <>
      <motion.header
        initial={{ y: -80, opacity: 0 }}
        animate={{ y: 0, opacity: 1 }}
        transition={{ duration: 1.2, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
        className={`fixed inset-x-0 top-0 z-50 transition-all duration-500 ${
          solid ? "bg-obsidian/85 backdrop-blur-xl border-b border-champagne/10" : ""
        }`}
      >
        <nav className="mx-auto flex max-w-[1400px] items-center justify-between px-6 py-5 md:px-12">
          <a
            href="#top"
            className="font-display gold-text inline-flex min-h-11 items-center text-2xl tracking-[0.2em]"
          >
            AURELIA
          </a>

          <ul className="hidden items-center gap-10 md:flex">
            {LINKS.map((l) => (
              <li key={l.href}>
                <a
                  href={l.href}
                  className="group relative inline-flex min-h-11 items-center text-[11px] uppercase tracking-luxe text-ivory/70 transition-colors hover:text-ivory"
                >
                  {l.label}
                  <span className="absolute -bottom-1.5 left-0 h-px w-0 bg-champagne transition-all duration-500 group-hover:w-full" />
                </a>
              </li>
            ))}
          </ul>

          <div className="flex items-center gap-5">
            <a
              href="#appointment"
              className="hidden border border-champagne/40 px-6 py-3 text-[11px] uppercase tracking-luxe text-champagne transition-colors hover:bg-champagne hover:text-obsidian md:block"
            >
              Book a Viewing
            </a>
            <button
              onClick={() => setOpen((v) => !v)}
              aria-label="Menu"
              aria-expanded={open}
              className="-mr-3 flex h-11 w-11 flex-col items-center justify-center gap-2 md:hidden"
            >
              <span className="block h-px w-7 bg-ivory" />
              <span className="mt-2 block h-px w-7 bg-ivory" />
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
            className="fixed inset-0 z-40 flex flex-col items-center justify-center gap-8 bg-obsidian md:hidden"
          >
            {LINKS.map((l) => (
              <a
                key={l.href}
                href={l.href}
                onClick={() => setOpen(false)}
                className="font-display text-4xl text-ivory"
              >
                {l.label}
              </a>
            ))}
            <a
              href="#appointment"
              onClick={() => setOpen(false)}
              className="mt-6 border border-champagne/40 px-8 py-4 text-[11px] uppercase tracking-luxe text-champagne"
            >
              Book a Viewing
            </a>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
