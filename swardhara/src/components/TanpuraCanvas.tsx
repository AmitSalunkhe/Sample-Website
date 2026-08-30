"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useEffect, useMemo, useRef } from "react";
import * as THREE from "three";
import { useInView, usePrefersReducedMotion } from "@/lib/perf";

/**
 * The hero's tanpura.
 *
 * Four strings under a standing wave, plus motes drifting up through them. It
 * is one plane and one fragment shader, so it costs a single draw call and
 * scales to any viewport without an asset request.
 *
 * The strings are NOT driven by the audio. Playback happens inside a YouTube
 * iframe, which is cross-origin, so the Web Audio API cannot reach the samples
 * and no amount of client code will change that. Motion here comes from time,
 * scroll and pointer instead, and Phase 3 will feed in each track's laya so the
 * strings move at the tempo of whatever is playing. That reads as sync without
 * pretending to analyse anything.
 */

const vertexShader = /* glsl */ `
  varying vec2 vUv;
  void main() {
    vUv = uv;
    gl_Position = vec4(position.xy, 0.0, 1.0);
  }
`;

const fragmentShader = /* glsl */ `
  precision mediump float;

  varying vec2 vUv;

  uniform float uTime;
  uniform float uAmp;      // overall movement, 0 when the user wants stillness
  uniform float uPointer;  // -1..1, horizontal pointer offset
  uniform float uAspect;
  uniform float uSpread;   // how much of the width the strings occupy
  uniform vec3  uGeru;
  uniform vec3  uHaldi;
  uniform vec3  uGulal;

  float hash(vec2 p) {
    return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453);
  }

  void main() {
    vec2 uv = vUv;
    vec3 col = vec3(0.0);
    float alpha = 0.0;

    /* Four strings, tucked into the right of the frame so the headline keeps a
       clean surface to sit on. */
    for (int i = 0; i < 4; i++) {
      float fi = float(i);
      float baseX = 1.0 - uSpread + fi * (uSpread / 5.0);

      /* Fixed at the bridge and the nut, free in the middle: a standing wave. */
      float env = sin(uv.y * 3.14159265);
      float freq = 1.6 + fi * 0.31;
      float phase = fi * 1.7;

      float disp = sin(uTime * freq + phase) * 0.020 * env * uAmp;
      disp += sin(uTime * freq * 2.7 + phase * 1.4) * 0.007 * env * uAmp;
      disp += uPointer * 0.012 * env;

      float d = abs(uv.x - (baseX + disp));

      float core = smoothstep(0.0018, 0.0, d);
      float glow = smoothstep(0.035, 0.0, d);

      vec3 tint = mix(uGeru, uGulal, fi / 3.0);
      col += tint * (core + glow * 0.20);
      alpha += core * 0.55 + glow * 0.10;
    }

    /* Motes: dust in a shaft of light, drifting up past the strings. */
    for (int i = 0; i < 14; i++) {
      float fi = float(i);
      vec2 seed = vec2(fi * 1.37, fi * 3.11);

      float sx = 0.06 + hash(seed) * 0.92;
      float speed = 0.010 + hash(seed + 7.0) * 0.028;
      float sy = fract(hash(seed + 2.0) + uTime * speed * mix(0.25, 1.0, uAmp));

      /* Correct for aspect so motes stay round rather than becoming ovals. */
      float d = distance(uv * vec2(uAspect, 1.0), vec2(sx, sy) * vec2(uAspect, 1.0));

      float m = smoothstep(0.0055, 0.0, d);
      float halo = smoothstep(0.020, 0.0, d);

      col += uHaldi * (m + halo * 0.18);
      alpha += m * 0.40 + halo * 0.06;
    }

    /* Hard clear zone on the left. The headline and the standfirst live there,
       and the motes scatter across the full width, so without this they drift
       behind the type. The ramp is deliberately short: measured against the
       real text colours, a wider fade let the first string's glow reach the
       standfirst and pull it under 4.5:1. Tied to uSpread so the zone moves
       with the strings when the layout narrows. */
    float leftEdge = 1.0 - uSpread;
    alpha *= smoothstep(leftEdge - 0.05, leftEdge + 0.01, uv.x);

    /* Fade out at the very top and bottom so the canvas dissolves into the page
       instead of ending on a hard edge. */
    float edge = smoothstep(0.0, 0.16, uv.y) * smoothstep(1.0, 0.84, uv.y);
    alpha *= edge;

    gl_FragColor = vec4(col, clamp(alpha, 0.0, 1.0));
  }
`;

/** Reads a CSS custom property as a linear-space colour for the shader. */
function tokenColor(name: string, fallback: string) {
  const raw =
    typeof window !== "undefined"
      ? getComputedStyle(document.documentElement).getPropertyValue(name).trim()
      : "";
  return new THREE.Color(raw || fallback).convertSRGBToLinear();
}

function Strings({ reduced }: { reduced: boolean }) {
  const material = useRef<THREE.ShaderMaterial>(null);
  const pointer = useRef(0);
  const amp = useRef(reduced ? 0 : 1);

  const uniforms = useMemo(
    () => ({
      uTime: { value: 0 },
      uAmp: { value: reduced ? 0 : 1 },
      uPointer: { value: 0 },
      uAspect: { value: 1 },
      uSpread: { value: 0.32 },
      uGeru: { value: tokenColor("--geru", "#c25022") },
      uHaldi: { value: tokenColor("--haldi", "#d9a129") },
      uGulal: { value: tokenColor("--gulal", "#b03a63") },
    }),
    [reduced]
  );

  useEffect(() => {
    if (reduced) return;
    const onMove = (e: PointerEvent) => {
      pointer.current = (e.clientX / window.innerWidth) * 2 - 1;
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => window.removeEventListener("pointermove", onMove);
  }, [reduced]);

  useFrame((state, delta) => {
    const u = material.current?.uniforms;
    if (!u) return;

    /* Size lives here rather than in an effect because R3F already re-renders
       on resize, even under frameloop="demand". Narrow viewports have no empty
       right-hand column, so the strings spread wider instead of crowding the
       headline. */
    const { width, height } = state.size;
    u.uAspect.value = width / height;
    u.uSpread.value = width < 640 ? 0.60 : 0.32;

    u.uTime.value += delta;

    /* Ease toward the pointer rather than snapping to it: a tanpura string
       does not teleport. */
    u.uPointer.value += (pointer.current - u.uPointer.value) * Math.min(1, delta * 3);
    u.uAmp.value += (amp.current - u.uAmp.value) * Math.min(1, delta * 2);
  });

  return (
    <mesh frustumCulled={false}>
      <planeGeometry args={[2, 2]} />
      <shaderMaterial
        ref={material}
        vertexShader={vertexShader}
        fragmentShader={fragmentShader}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function TanpuraCanvas() {
  const reduced = usePrefersReducedMotion();
  const { ref, inView } = useInView<HTMLDivElement>("120px");

  /* Off screen or reduced motion means the loop stops entirely: an idle hero
     schedules no frames at all. "demand" still renders once, so the strings are
     drawn and still rather than missing. */
  const frameloop = !reduced && inView ? "always" : "demand";

  return (
    <div
      ref={ref}
      aria-hidden
      className="pointer-events-none absolute inset-0 opacity-35 sm:opacity-100"
    >
      <Canvas
        frameloop={frameloop}
        dpr={[1, 1.75]}
        gl={{ antialias: false, alpha: true }}
        style={{ width: "100%", height: "100%" }}
      >
        <Strings reduced={reduced} />
      </Canvas>
    </div>
  );
}
