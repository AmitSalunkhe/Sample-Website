import Link from "next/link";

/** Back link at the top of every detail page. */
export default function Crumb({ to, label }: { to: string; label: string }) {
  return (
    <Link
      href={to}
      className="inline-flex items-center gap-1.5 py-2 text-sm text-ink-soft transition-colors hover:text-ink"
    >
      <svg viewBox="0 0 24 24" width="14" height="14" fill="currentColor" aria-hidden>
        <path d="M15.4 7.4 14 6l-6 6 6 6 1.4-1.4L10.8 12z" />
      </svg>
      {label}
    </Link>
  );
}
