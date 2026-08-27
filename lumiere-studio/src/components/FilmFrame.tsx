"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";

/**
 * A photograph rendered as film rather than as a flat asset.
 * Scroll velocity bends the frame, halation blooms in the highlights and
 * the emulsion grain moves — so a still image behaves like a running projector.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  uniform float uVel;
  uniform float uTime;
  void main() {
    vUv = uv;
    vec3 p = position;
    // the frame bows with scroll momentum, like film under tension
    float bend = sin(uv.x * 3.14159) * uVel * 0.55;
    p.y += bend;
    p.z += sin(uv.x * 6.0 + uTime * 0.5) * abs(uVel) * 0.35;
    gl_Position = projectionMatrix * modelViewMatrix * vec4(p, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform float uVel;
  uniform float uReveal;
  uniform vec2  uCover;

  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }
  float lum(vec3 c){ return dot(c, vec3(0.2126, 0.7152, 0.0722)); }

  void main() {
    // object-fit: cover, done in the shader
    vec2 uv = (vUv - 0.5) * uCover + 0.5;

    // lens breathing on fast scroll
    uv = (uv - 0.5) * (1.0 - abs(uVel) * 0.06) + 0.5;

    // chromatic aberration, strongest at the edges as a real lens behaves
    float r2 = dot(uv - 0.5, uv - 0.5);
    float ca = (0.0016 + abs(uVel) * 0.008) * r2 * 4.0;
    vec2 dir = normalize(uv - 0.5 + 1e-5);
    vec3 col;
    col.r = texture2D(uTex, uv + dir * ca).r;
    col.g = texture2D(uTex, uv).g;
    col.b = texture2D(uTex, uv - dir * ca).b;

    // halation: highlights bleed warm, the way film shoulder rolls off
    float hi = smoothstep(0.62, 1.0, lum(col));
    col += vec3(0.85, 0.42, 0.16) * hi * 0.16;

    // warm-shadow / cool-highlight split tone
    float l = lum(col);
    col = mix(col, col * vec3(1.06, 0.98, 0.90), 1.0 - l);
    col = mix(col, col * vec3(0.97, 1.0, 1.04), l * 0.5);

    // gentle S-curve
    col = clamp((col - 0.5) * 1.07 + 0.5, 0.0, 1.0);

    // moving emulsion grain
    float g = hash(uv * 900.0 + fract(uTime * 24.0) * 100.0);
    col += (g - 0.5) * 0.055;

    // vignette
    col *= 1.0 - r2 * 0.55;

    // wipe-in reveal from the bottom edge
    float wipe = smoothstep(uReveal - 0.28, uReveal + 0.02, 1.0 - vUv.y);
    col = mix(col, vec3(0.965, 0.949, 0.925), wipe);

    gl_FragColor = vec4(col, 1.0);
  }
`;

function Frame({ src, vel }: { src: string; vel: React.RefObject<number> }) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uVel: { value: 0 },
      uReveal: { value: 0 },
      uCover: { value: new THREE.Vector2(1, 1) },
    }),
    [tex]
  );

  useFrame((state, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uVel.value = THREE.MathUtils.lerp(u.uVel.value, vel.current ?? 0, Math.min(dt * 5, 1));
    u.uReveal.value = THREE.MathUtils.lerp(u.uReveal.value, 1.35, Math.min(dt * 1.1, 1));

    // recompute cover ratio against the live viewport
    const img = tex.image as HTMLImageElement | undefined;
    if (img?.width) {
      const { width, height } = state.size;
      const screenAR = width / height;
      const imgAR = img.width / img.height;
      const c = u.uCover.value as THREE.Vector2;
      if (screenAR > imgAR) c.set(1, imgAR / screenAR);
      else c.set(screenAR / imgAR, 1);
    }
  });

  return (
    <mesh>
      <planeGeometry args={[2, 2, 64, 64]} />
      <shaderMaterial ref={mat} vertexShader={vert} fragmentShader={frag} uniforms={uniforms} />
    </mesh>
  );
}

export default function FilmFrame({
  src,
  className = "",
}: {
  src: string;
  className?: string;
}) {
  const vel = useRef(0);

  useEffect(() => {
    let last = window.scrollY;
    let raf = 0;
    const tick = () => {
      const now = window.scrollY;
      const d = (now - last) / Math.max(window.innerHeight, 1);
      last = now;
      vel.current = THREE.MathUtils.clamp(d * 3.2, -1, 1);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(raf);
  }, []);

  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true }}
        orthographic
        camera={{ position: [0, 0, 1], zoom: 1, left: -1, right: 1, top: 1, bottom: -1 }}
      >
        <Suspense fallback={null}>
          <Frame src={src} vel={vel} />
        </Suspense>
      </Canvas>
    </div>
  );
}
