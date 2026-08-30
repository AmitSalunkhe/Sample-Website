"use client";

import PlayButton from "@/components/PlayButton";
import { usePlayer } from "@/components/PlayerProvider";
import {
  isLongForm,
  isPlayable,
  trackCredit,
  trackLength,
  type Track,
} from "@/lib/content";

/**
 * One list of tracks, used by the home page and every route that shows songs.
 *
 * The whole list is handed to the player as the queue, so pressing play on the
 * fourth track still leaves the fifth to follow.
 */
export default function TrackList({
  tracks,
  numbered = true,
}: {
  tracks: Track[];
  numbered?: boolean;
}) {
  const { current, playing, play } = usePlayer();
  const firstPlayable = tracks.find(isPlayable);

  return (
    <div>
      {firstPlayable && (
        <button
          type="button"
          onClick={() => play(firstPlayable, tracks)}
          className="mb-5 inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-paper transition-opacity hover:opacity-90"
        >
          <svg viewBox="0 0 24 24" width="16" height="16" fill="currentColor" aria-hidden>
            <path d="M8 5v14l11-7z" />
          </svg>
          सगळं ऐका
        </button>
      )}

      <ol className="divide-y divide-paper-edge border-t border-paper-edge">
        {tracks.map((t, n) => {
          const isCurrent = current?.slug === t.slug;
          return (
            <li
              key={t.slug}
              aria-current={isCurrent ? "true" : undefined}
              className={`flex items-center gap-4 py-3 ${
                isCurrent ? "bg-paper-deep/50" : ""
              }`}
            >
              {numbered && (
                <span className="w-6 shrink-0 text-right text-sm text-ink-soft tabular-nums">
                  {isCurrent && playing ? (
                    /* A bar of the equaliser, so the playing row is obvious
                       without relying on the colour change alone. */
                    <span aria-label="वाजत आहे" className="text-geru-deep">
                      ♪
                    </span>
                  ) : (
                    n + 1
                  )}
                </span>
              )}

              <span className="min-w-0 flex-1">
                <span className="text-ink">{t.title}</span>
                {isLongForm(t) && (
                  <span className="ml-2 align-middle text-xs text-ink-soft">
                    पूर्ण सत्र
                  </span>
                )}
                <span className="block truncate text-sm text-ink-soft">
                  {trackCredit(t)}
                </span>
              </span>

              <span className="shrink-0 text-sm text-ink-soft tabular-nums">
                {trackLength(t)}
              </span>

              <PlayButton track={t} queue={tracks} />
            </li>
          );
        })}
      </ol>
    </div>
  );
}
