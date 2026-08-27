"use client";

import dynamic from "next/dynamic";

/**
 * `ssr: false` is only permitted inside a Client Component, so the page (a
 * Server Component) mounts the WebGL backdrop through this wrapper.
 */
const SceneBackdrop = dynamic(() => import("./SceneBackdrop"), { ssr: false });

export default function SceneBackdropMount() {
  return <SceneBackdrop />;
}
