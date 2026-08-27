"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { EffectComposer, Bloom, Vignette, Noise } from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import { useInView, usePrefersReducedMotion } from "@/lib/perf";

/**
 * A photograph rendered as film rather than as a flat asset.
 *
 * Every frame of the sequence is preloaded and the cut is a crossfade between
 * two samplers, so this canvas mounts once and its WebGL context is never torn
 * down. Remounting per shot, as this did before, churned contexts until the
 * browser began dropping them, which is what made the page blink.
 *
 * Scroll velocity bends the frame, halation blooms in the highlights, the
 * emulsion grain moves, and a Ken Burns push runs off the shot's progress.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  uniform float uVel;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    float bend = sin(uv.x * 3.14159) * uVel * 0.55;
    p.y += bend;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform float uTime;
  uniform float uVel;
  uniform float uReveal;
  uniform float uProgress;
  uniform vec2  uCoverA;
  uniform vec2  uCoverB;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  void main() {
    // Ken Burns: a slow push with a touch of drift, tied to the sequence
    float zoom = 1.0 - uProgress * 0.14;
    vec2 pan = vec2(uProgress * 0.03, uProgress * -0.02);

    vec2 base = (vUv - 0.5);
    // lens breathing on fast scroll
    base *= (1.0 - abs(uVel) * 0.06);

    vec2 uvA = base * uCoverA * zoom + 0.5 + pan;
    vec2 uvB = base * uCoverB * zoom + 0.5 + pan;

    float r2 = dot(base, base);
    float ca = (0.0016 + abs(uVel) * 0.008) * r2 * 4.0;
    vec2 dir = normalize(base + 1e-5);

    // aberration applied on the mixed result: three taps, not six
    vec3 a = vec3(
      texture2D(uTexA, uvA + dir * ca).r,
      texture2D(uTexA, uvA).g,
      texture2D(uTexA, uvA - dir * ca).b
    );
    vec3 b = vec3(
      texture2D(uTexB, uvB + dir * ca).r,
      texture2D(uTexB, uvB).g,
      texture2D(uTexB, uvB - dir * ca).b
    );
    vec3 col = mix(a, b, uMix);

    float hi = smoothstep(0.62, 1.0, lum(col));
    col += vec3(0.85, 0.42, 0.16) * hi * 0.16;

    float l = lum(col);
    col = mix(col, col * vec3(1.06, 0.98, 0.90), 1.0 - l);
    col = mix(col, col * vec3(0.97, 1.0, 1.04), l * 0.5);

    col = clamp((col - 0.5) * 1.07 + 0.5, 0.0, 1.0);

    float g = hash(vUv * 900.0 + fract(uTime * 24.0) * 100.0);
    col += (g - 0.5) * 0.055;

    float wipe = smoothstep(uReveal - 0.28, uReveal + 0.02, 1.0 - vUv.y);
    col = mix(col, vec3(0.965, 0.949, 0.925), wipe);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Frame({
  sources,
  index,
  vel,
  progressRef,
}: {
  sources: string[];
  index: number;
  vel: React.RefObject<number>;
  progressRef?: React.RefObject<number>;
}) {
  const textures = useTexture(sources);
  const list = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]),
    [textures]
  ) as THREE.Texture[];

  const mat = useRef<THREE.ShaderMaterial>(null);
  const from = useRef(index);
  const to = useRef(index);

  const uniforms = useMemo(
    () => ({
      uTexA: { value: list[index] },
      uTexB: { value: list[index] },
      uMix: { value: 1 },
      uTime: { value: 0 },
      uVel: { value: 0 },
      uReveal: { value: 0 },
      uProgress: { value: 0 },
      uCoverA: { value: new THREE.Vector2(1, 1) },
      uCoverB: { value: new THREE.Vector2(1, 1) },
    }),
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  useEffect(() => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    from.current = to.current;
    to.current = index;
    u.uTexA.value = list[from.current];
    u.uTexB.value = list[to.current];
    u.uMix.value = 0;
  }, [index, list]);

  const cover = (t: THREE.Texture, w: number, h: number, out: THREE.Vector2) => {
    const img = t.image as { width?: number; height?: number } | undefined;
    if (!img?.width || !img?.height) return;
    const screenAR = w / h;
    const imgAR = img.width / img.height;
    if (screenAR > imgAR) out.set(1, imgAR / screenAR);
    else out.set(screenAR / imgAR, 1);
  };

  useFrame((state, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uVel.value = THREE.MathUtils.lerp(u.uVel.value, vel.current ?? 0, Math.min(dt * 5, 1));
    u.uReveal.value = THREE.MathUtils.lerp(u.uReveal.value, 1.35, Math.min(dt * 1.1, 1));
    u.uMix.value = THREE.MathUtils.lerp(u.uMix.value, 1, Math.min(dt * 2.2, 1));
    u.uProgress.value = THREE.MathUtils.lerp(
      u.uProgress.value,
      progressRef?.current ?? 0,
      Math.min(dt * 2, 1)
    );

    const { width, height } = state.size;
    cover(list[from.current], width, height, u.uCoverA.value as THREE.Vector2);
    cover(list[to.current], width, height, u.uCoverB.value as THREE.Vector2);
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 32, 32]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export default function FilmFrame({
  sources,
  index,
  className = "",
  progressRef,
}: {
  sources: string[];
  index: number;
  className?: string;
  progressRef?: React.RefObject<number>;
}) {
  const vel = useRef(0);
  const { ref, inView } = useInView<HTMLDivElement>("200px");
  const reduced = usePrefersReducedMotion();

  useEffect(() => {
    if (!inView) return;
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      const now = window.scrollY;
      vel.current = THREE.MathUtils.clamp(
        ((now - last) / Math.max(window.innerHeight, 1)) * 3.2,
        -1,
        1
      );
      last = now;
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, [inView]);

  return (
    <div ref={ref} className={className}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={reduced ? "demand" : inView ? "always" : "never"}
        gl={{ antialias: false, powerPreference: "high-performance" }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1 }}
      >
        <Suspense fallback={null}>
          <Frame sources={sources} index={index} vel={vel} progressRef={progressRef} />

          <EffectComposer multisampling={0}>
            <Bloom
              intensity={0.5}
              luminanceThreshold={0.7}
              luminanceSmoothing={0.35}
              mipmapBlur
            />
            <Vignette eskil={false} offset={0.26} darkness={0.72} />
            <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.28} />
          </EffectComposer>
        </Suspense>
      </Canvas>
    </div>
  );
}
