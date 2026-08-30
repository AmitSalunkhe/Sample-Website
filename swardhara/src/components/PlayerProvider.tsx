"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { loadYouTubeApi, YT_STATE, type YTPlayer } from "@/lib/youtube";
import { isPlayable, trackBySlug, type Track } from "@/lib/content";

/**
 * The playback engine.
 *
 * It lives in the root layout so the iframe is created once and survives route
 * changes: navigating from a playlist to a poet must not restart the song.
 *
 * The iframe itself is parked off screen and the whole UI is ours. YouTube's own
 * chrome never appears, but the audio still comes from the label's upload, which
 * is the arrangement that lets this site exist at all.
 */

type PlayerState = {
  current: Track | null;
  queue: Track[];
  playing: boolean;
  ready: boolean;
  failed: boolean;
  position: number;
  duration: number;
  play: (track: Track, queue?: Track[]) => void;
  toggle: () => void;
  next: () => void;
  previous: () => void;
  seek: (seconds: number) => void;
  close: () => void;
};

const Ctx = createContext<PlayerState | null>(null);

export function usePlayer() {
  const ctx = useContext(Ctx);
  if (!ctx) throw new Error("usePlayer must be used inside <PlayerProvider>");
  return ctx;
}

export default function PlayerProvider({ children }: { children: ReactNode }) {
  const host = useRef<HTMLDivElement>(null);
  const player = useRef<YTPlayer | null>(null);

  const [current, setCurrent] = useState<Track | null>(null);
  const [queue, setQueue] = useState<Track[]>([]);
  const [playing, setPlaying] = useState(false);
  const [ready, setReady] = useState(false);
  const [failed, setFailed] = useState(false);
  const [position, setPosition] = useState(0);
  const [duration, setDuration] = useState(0);

  /* Mirrored into refs so the YouTube event callbacks, which are created once
     and never re-bound, can read the live queue instead of the values captured
     when the player was constructed. Synced in an effect rather than during
     render, which is not safe under concurrent React. */
  const queueRef = useRef<Track[]>([]);
  const currentRef = useRef<Track | null>(null);
  useEffect(() => {
    queueRef.current = queue;
    currentRef.current = current;
  }, [queue, current]);

  const advance = useCallback((step: number) => {
    const q = queueRef.current;
    const here = currentRef.current;
    if (!here || q.length === 0) return;

    const i = q.findIndex((t) => t.slug === here.slug);
    if (i === -1) return;

    /* Walk past anything unplayable rather than stalling on it. */
    for (let n = i + step; n >= 0 && n < q.length; n += step) {
      if (isPlayable(q[n])) {
        setCurrent(q[n]);
        return;
      }
    }
    setPlaying(false);
  }, []);

  const play = useCallback(
    (track: Track, nextQueue?: Track[]) => {
      if (!isPlayable(track)) return;
      if (nextQueue) setQueue(nextQueue);
      else if (queueRef.current.length === 0) setQueue([track]);

      if (currentRef.current?.slug === track.slug) {
        player.current?.playVideo();
        return;
      }
      setCurrent(track);
      setPosition(0);
      setDuration(0);
    },
    []
  );

  /* Create the player on first use, then load each new track into it. */
  useEffect(() => {
    if (!current?.youtubeId || !host.current) return;
    const videoId = current.youtubeId;
    let cancelled = false;

    loadYouTubeApi()
      .then((YT) => {
        if (cancelled || !host.current) return;

        if (player.current) {
          player.current.loadVideoById(videoId);
          return;
        }

        player.current = new YT.Player(host.current, {
          videoId,
          playerVars: { autoplay: 1, playsinline: 1, origin: window.location.origin },
          events: {
            onReady: (e) => {
              if (cancelled) return;
              setReady(true);
              setDuration(e.target.getDuration());
              e.target.playVideo();
            },
            onStateChange: (e) => {
              if (cancelled) return;
              setPlaying(e.data === YT_STATE.PLAYING);
              if (e.data === YT_STATE.PLAYING || e.data === YT_STATE.CUED) {
                setDuration(e.target.getDuration());
              }
              if (e.data === YT_STATE.ENDED) advance(1);
            },
            /* An upload can be pulled or made non-embeddable at any time, and
               that is the label's right. Say so rather than sitting silent. */
            onError: () => !cancelled && setFailed(true),
          },
        });
      })
      .catch(() => !cancelled && setFailed(true));

    return () => {
      cancelled = true;
    };
  }, [current, advance]);

  /* Poll position only while something is actually playing. */
  useEffect(() => {
    if (!playing || !player.current) return;
    const id = window.setInterval(() => {
      const p = player.current;
      if (!p) return;
      setPosition(p.getCurrentTime());
    }, 500);
    return () => window.clearInterval(id);
  }, [playing]);

  useEffect(() => {
    return () => {
      player.current?.destroy();
      player.current = null;
    };
  }, []);

  const toggle = useCallback(() => {
    const p = player.current;
    if (!p) return;
    if (playing) p.pauseVideo();
    else p.playVideo();
  }, [playing]);

  const seek = useCallback((seconds: number) => {
    player.current?.seekTo(seconds, true);
    setPosition(seconds);
  }, []);

  const close = useCallback(() => {
    player.current?.pauseVideo();
    setPlaying(false);
    setCurrent(null);
    setQueue([]);
  }, []);

  const value: PlayerState = {
    current,
    queue,
    playing,
    ready,
    failed,
    position,
    duration,
    play,
    toggle,
    next: useCallback(() => advance(1), [advance]),
    previous: useCallback(() => advance(-1), [advance]),
    seek,
    close,
  };

  return (
    <Ctx.Provider value={value}>
      {children}
      {/* The real iframe. Off screen rather than display:none, because a hidden
          iframe is not allowed to play on some browsers. */}
      <div
        aria-hidden
        style={{
          position: "fixed",
          width: 1,
          height: 1,
          left: -9999,
          top: 0,
          pointerEvents: "none",
        }}
      >
        <div ref={host} />
      </div>
    </Ctx.Provider>
  );
}

/** Convenience for pages that only have a slug to hand. */
export function trackFor(slug: string) {
  return trackBySlug(slug) ?? null;
}
