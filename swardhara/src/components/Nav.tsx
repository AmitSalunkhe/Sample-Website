import Link from "next/link";
import { site } from "@/lib/content";

const links = [
  { href: "/#prakar", label: "प्रकार" },
  { href: "/#yadya", label: "याद्या" },
  { href: "/#kavi", label: "कवी" },
];

export default function Nav() {
  return (
    <header className="sticky top-0 z-40 border-b border-paper-edge bg-paper/85 backdrop-blur-sm">
      <nav
        aria-label="मुख्य"
        className="mx-auto flex max-w-6xl items-baseline gap-6 px-5 py-4 sm:px-8"
      >
        <Link
          href="/"
          className="-my-2.5 inline-block py-2.5 font-display text-2xl leading-none text-ink"
        >
          {site.name}
          <span className="sr-only">, {site.roman}</span>
        </Link>

        <span className="hidden text-sm text-ink-faint sm:inline">{site.tagline}</span>

        <ul className="ml-auto flex items-center gap-5 text-[0.95rem] text-ink-soft">
          {links.map((l) => (
            <li key={l.href}>
              <Link
                href={l.href}
                /* Negative margin cancels the padding visually, so the
                   row keeps its height while the tap area reaches ~45px. */
                className="-mx-2 -my-2.5 inline-block px-2 py-2.5 transition-colors hover:text-geru-deep"
              >
                {l.label}
              </Link>
            </li>
          ))}
        </ul>
      </nav>
    </header>
  );
}
