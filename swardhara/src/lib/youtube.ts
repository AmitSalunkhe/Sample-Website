/**
 * Loads YouTube's IFrame API once, lazily.
 *
 * The script is only fetched when someone actually presses play, so a visitor
 * who never starts a track never pays for it. The API signals readiness through
 * a single global callback, which is why this has to be a module-level promise
 * rather than anything per-component.
 */

export type YTPlayer = {
  playVideo(): void;
  pauseVideo(): void;
  loadVideoById(id: string): void;
  seekTo(seconds: number, allowSeekAhead: boolean): void;
  getCurrentTime(): number;
  getDuration(): number;
  setVolume(volume: number): void;
  destroy(): void;
};

export type YTEvent = { target: YTPlayer; data: number };

type YTNamespace = {
  Player: new (
    el: HTMLElement,
    opts: {
      videoId?: string;
      host?: string;
      playerVars?: Record<string, string | number>;
      events?: {
        onReady?: (e: YTEvent) => void;
        onStateChange?: (e: YTEvent) => void;
        onError?: (e: YTEvent) => void;
      };
    }
  ) => YTPlayer;
};

declare global {
  interface Window {
    YT?: YTNamespace;
    onYouTubeIframeAPIReady?: () => void;
  }
}

/** YouTube's numeric player states, named. */
export const YT_STATE = {
  UNSTARTED: -1,
  ENDED: 0,
  PLAYING: 1,
  PAUSED: 2,
  BUFFERING: 3,
  CUED: 5,
} as const;

let pending: Promise<YTNamespace> | null = null;

export function loadYouTubeApi(): Promise<YTNamespace> {
  if (pending) return pending;

  pending = new Promise((resolve, reject) => {
    if (window.YT?.Player) {
      resolve(window.YT);
      return;
    }

    /* Another caller may already have queued the script. Chain onto the global
       callback rather than injecting a second copy. */
    const previous = window.onYouTubeIframeAPIReady;
    window.onYouTubeIframeAPIReady = () => {
      previous?.();
      if (window.YT?.Player) resolve(window.YT);
      else reject(new Error("YouTube API loaded without a Player constructor"));
    };

    if (!document.querySelector('script[data-yt-api]')) {
      const s = document.createElement("script");
      s.src = "https://www.youtube.com/iframe_api";
      s.async = true;
      s.dataset.ytApi = "true";
      s.onerror = () => reject(new Error("Could not load the YouTube IFrame API"));
      document.head.appendChild(s);
    }
  });

  /* A failed load must not poison every later attempt: clear the cache so a
     retry can start clean. */
  pending.catch(() => {
    pending = null;
  });

  return pending;
}

/** Seconds to m:ss, the way a player shows it. */
export function formatTime(seconds: number) {
  if (!Number.isFinite(seconds) || seconds < 0) return "0:00";
  const m = Math.floor(seconds / 60);
  const s = Math.floor(seconds % 60);
  return `${m}:${s.toString().padStart(2, "0")}`;
}
