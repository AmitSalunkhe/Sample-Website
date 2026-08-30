"use client";

import { usePlayer } from "@/components/PlayerProvider";
import { formatTime } from "@/lib/youtube";
import { trackCredit } from "@/lib/content";

/**
 * The bar that sits at the bottom once something is playing.
 *
 * It renders nothing at all until there is a track, so it never occupies space
 * on a first visit.
 */
export default function PlayerBar() {
  const { current, playing, position, duration, toggle, next, previous, seek, close, failed } =
    usePlayer();

  if (!current) return null;

  const pct = duration > 0 ? (position / duration) * 100 : 0;

  return (
    <div
      role="region"
      aria-label="सध्या वाजणारं गाणं"
      className="fixed inset-x-0 bottom-0 z-40 border-t border-paper-edge bg-paper/95 backdrop-blur-sm"
    >
      <div className="mx-auto flex max-w-6xl items-center gap-3 px-4 py-3 sm:gap-4 sm:px-8">
        <button
          type="button"
          onClick={previous}
          aria-label="मागचं गाणं"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink sm:flex"
        >
          <Icon d="M16 5v14l-9-7zM6 5h2v14H6z" />
        </button>

        <button
          type="button"
          onClick={toggle}
          aria-label={playing ? "थांबव" : "वाजव"}
          className="flex h-12 w-12 shrink-0 items-center justify-center rounded-full bg-ink text-paper transition-opacity hover:opacity-90"
        >
          {playing ? <Icon d="M7 5h4v14H7zM13 5h4v14h-4z" /> : <Icon d="M8 5v14l11-7z" />}
        </button>

        <button
          type="button"
          onClick={next}
          aria-label="पुढचं गाणं"
          className="hidden h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink sm:flex"
        >
          <Icon d="M8 5v14l9-7zM16 5h2v14h-2z" />
        </button>

        <div className="min-w-0 flex-1">
          <p className="truncate font-display text-lg leading-tight text-ink">
            {current.title}
          </p>
          <p className="truncate text-sm text-ink-soft">
            {failed ? "हे गाणं सध्या वाजवता येत नाही" : trackCredit(current)}
          </p>

          <div className="mt-1.5 flex items-center gap-2">
            <span className="w-9 shrink-0 text-xs text-ink-soft tabular-nums">
              {formatTime(position)}
            </span>

            {/* A range input rather than a styled div: it is keyboard operable
                and announced as a slider without any extra work. */}
            <input
              type="range"
              min={0}
              max={Math.max(1, Math.floor(duration))}
              value={Math.floor(position)}
              onChange={(e) => seek(Number(e.target.value))}
              aria-label="गाण्यात पुढे-मागे जा"
              className="h-1.5 w-full cursor-pointer appearance-none rounded-full outline-offset-4"
              style={{
                background: `linear-gradient(to right, var(--geru-deep) ${pct}%, var(--paper-edge) ${pct}%)`,
              }}
            />

            <span className="w-9 shrink-0 text-right text-xs text-ink-soft tabular-nums">
              {formatTime(duration)}
            </span>
          </div>
        </div>

        <button
          type="button"
          onClick={close}
          aria-label="बंद कर"
          className="flex h-11 w-11 shrink-0 items-center justify-center rounded-full text-ink-soft transition-colors hover:text-ink"
        >
          <Icon d="M18.3 5.7 12 12l6.3 6.3-1.4 1.4L10.6 13.4 4.3 19.7 2.9 18.3 9.2 12 2.9 5.7l1.4-1.4 6.3 6.3 6.3-6.3z" />
        </button>
      </div>
    </div>
  );
}

function Icon({ d }: { d: string }) {
  return (
    <svg viewBox="0 0 24 24" width="20" height="20" fill="currentColor" aria-hidden>
      <path d={d} />
    </svg>
  );
}
