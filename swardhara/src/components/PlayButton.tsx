"use client";

import { usePlayer } from "@/components/PlayerProvider";
import { isPlayable, type Track } from "@/lib/content";

/**
 * The control on a track row.
 *
 * A track whose link has not been verified yet renders as plain text, not as a
 * disabled button: there is nothing to press, and a dead control is worse than
 * an honest label.
 */
export default function PlayButton({
  track,
  queue,
}: {
  track: Track;
  queue: Track[];
}) {
  const { current, playing, play, toggle } = usePlayer();

  if (!isPlayable(track)) {
    return <span className="shrink-0 text-xs text-ink-soft">लवकरच</span>;
  }

  const isCurrent = current?.slug === track.slug;
  const isPlayingThis = isCurrent && playing;

  return (
    <button
      type="button"
      onClick={() => (isCurrent ? toggle() : play(track, queue))}
      aria-label={`${track.title} ${isPlayingThis ? "थांबव" : "वाजव"}`}
      aria-pressed={isPlayingThis}
      className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full border border-paper-edge text-ink-soft transition-colors hover:border-ink hover:text-ink"
    >
      <svg viewBox="0 0 24 24" width="15" height="15" fill="currentColor" aria-hidden>
        {isPlayingThis ? (
          <path d="M7 5h4v14H7zM13 5h4v14h-4z" />
        ) : (
          <path d="M8 5v14l11-7z" />
        )}
      </svg>
    </button>
  );
}
