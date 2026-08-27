"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useMemo, Suspense, useEffect } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

/**
 * One persistent canvas for the whole collection.
 *
 * Every piece is preloaded as a texture up front and the change of piece is a
 * crossfade between two samplers, so the WebGL context is created once and never
 * torn down. The previous version remounted the <Canvas> on each piece, which
 * churned through contexts until the browser started dropping them, and that was
 * what made the page blink.
 *
 * A Sobel pass over the photo's own luminance reconstructs a surface normal, so
 * the key light lands on the metal that is genuinely there and the sparkle
 * follows the real stones.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uPointer;
  void main() {
    vUv = uv;
    vec3 p = position;
    float tilt = sin(uTime * 0.35) * 0.03 + uPointer.x * 0.06;
    float pitch = cos(uTime * 0.28) * 0.02 - uPointer.y * 0.05;
    mat3 ry = mat3(cos(tilt),0.0,sin(tilt), 0.0,1.0,0.0, -sin(tilt),0.0,cos(tilt));
    mat3 rx = mat3(1.0,0.0,0.0, 0.0,cos(pitch),-sin(pitch), 0.0,sin(pitch),cos(pitch));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(ry * rx * p, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTexA;
  uniform sampler2D uTexB;
  uniform float uMix;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform vec2  uTexel;
  uniform vec2  uArA;
  uniform vec2  uArB;

  float lum(vec3 c){ return dot(c, vec3(0.2126,0.7152,0.0722)); }
  float hash(vec2 p){ return fract(sin(dot(p, vec2(127.1, 311.7))) * 43758.5453); }

  // fit each photo inside the plane on its own aspect ratio
  vec4 sampleFit(sampler2D t, vec2 uv, vec2 ar) {
    vec2 p = (uv - 0.5) / ar + 0.5;
    if (p.x < 0.0 || p.x > 1.0 || p.y < 0.0 || p.y > 1.0) return vec4(0.0);
    return texture2D(t, p);
  }

  void main() {
    vec2 uv = vUv;

    vec4 a = sampleFit(uTexA, uv, uArA);
    vec4 b = sampleFit(uTexB, uv, uArB);
    vec4 base = mix(a, b, uMix);

    if (base.a < 0.02) { discard; }

    // Sobel on the mixed frame: one set of taps instead of one per texture
    float l = lum(base.rgb);
    vec2 e = uTexel;
    float lx1 = lum(mix(sampleFit(uTexA, uv + vec2(e.x,0.0), uArA), sampleFit(uTexB, uv + vec2(e.x,0.0), uArB), uMix).rgb);
    float lx0 = lum(mix(sampleFit(uTexA, uv - vec2(e.x,0.0), uArA), sampleFit(uTexB, uv - vec2(e.x,0.0), uArB), uMix).rgb);
    float ly1 = lum(mix(sampleFit(uTexA, uv + vec2(0.0,e.y), uArA), sampleFit(uTexB, uv + vec2(0.0,e.y), uArB), uMix).rgb);
    float ly0 = lum(mix(sampleFit(uTexA, uv - vec2(0.0,e.y), uArA), sampleFit(uTexB, uv - vec2(0.0,e.y), uArB), uMix).rgb);
    vec3 n = normalize(vec3((lx0 - lx1) * 3.2, (ly0 - ly1) * 3.2, 1.0));

    vec3 key  = normalize(vec3(sin(uTime * 0.45) * 0.7 + uPointer.x, cos(uTime * 0.37) * 0.5 + uPointer.y, 0.85));
    vec3 view = vec3(0.0, 0.0, 1.0);

    float dKey = max(dot(n, key), 0.0);
    vec3 h = normalize(key + view);
    float spec = pow(max(dot(n, h), 0.0), 46.0);

    float facet = smoothstep(0.74, 0.98, l);
    float twinkle = pow(max(dot(n, key), 0.0), 90.0);
    float sparkle = facet * twinkle * (0.65 + 0.35 * sin(uTime * 3.1 + uv.x * 60.0 + uv.y * 44.0));

    vec3 goldWarm = vec3(1.00, 0.84, 0.53);

    vec3 col = base.rgb;
    col += goldWarm * dKey * 0.30;
    col += goldWarm * spec * 0.85;
    col += vec3(1.0, 0.97, 0.92) * sparkle * 1.4;

    // travelling polish band
    float band = smoothstep(0.045, 0.0, abs(fract((uv.x + uv.y) * 0.5 - uTime * 0.09) - 0.5));
    col += goldWarm * band * l * 0.42;

    // Halation and grain done in the shader rather than as composer passes.
    // Same film character, no extra render target for this canvas.
    float hi = smoothstep(0.78, 1.0, l);
    col += vec3(1.0, 0.62, 0.28) * hi * 0.20;

    col = (col - 0.5) * 1.09 + 0.5;

    float g = hash(uv * 900.0 + fract(uTime * 24.0) * 100.0);
    col += (g - 0.5) * 0.05;

    gl_FragColor = vec4(col, base.a);
  }
`;

function Pieces({
  sources,
  index,
  progressRef,
}: {
  sources: string[];
  index: number;
  progressRef?: React.RefObject<number>;
}) {
  const textures = useTexture(sources);
  const list = useMemo(
    () => (Array.isArray(textures) ? textures : [textures]),
    [textures]
  ) as THREE.Texture[];

  const mat = useRef<THREE.ShaderMaterial>(null);
  const group = useRef<THREE.Group>(null);
  const { viewport, camera } = useThree();
  const pointer = useRef(new THREE.Vector2());

  const from = useRef(index);
  const to = useRef(index);

  const uniforms = useMemo(
    () => ({
      uTexA: { value: list[index] },
      uTexB: { value: list[index] },
      uMix: { value: 1 },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2() },
      uTexel: { value: new THREE.Vector2(1 / 900, 1 / 900) },
      uArA: { value: new THREE.Vector2(1, 1) },
      uArB: { value: new THREE.Vector2(1, 1) },
    }),
    // built once; the values are driven imperatively below
    // eslint-disable-next-line react-hooks/exhaustive-deps
    []
  );

  const arOf = (t: THREE.Texture) => {
    const img = t.image as { width?: number; height?: number } | undefined;
    const ar = img?.width && img?.height ? img.width / img.height : 1;
    return ar >= 1 ? new THREE.Vector2(1, 1 / ar) : new THREE.Vector2(ar, 1);
  };

  // start a crossfade whenever the framed piece changes
  useEffect(() => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    from.current = to.current;
    to.current = index;
    u.uTexA.value = list[from.current];
    u.uTexB.value = list[to.current];
    (u.uArA.value as THREE.Vector2).copy(arOf(list[from.current]));
    (u.uArB.value as THREE.Vector2).copy(arOf(list[to.current]));
    u.uMix.value = 0;
  }, [index, list]);

  const size = Math.min(viewport.height, viewport.width) * 0.78;

  useFrame((state, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    u.uMix.value = THREE.MathUtils.lerp(u.uMix.value, 1, Math.min(dt * 2.6, 1));

    pointer.current.lerp(state.pointer, Math.min(dt * 3, 1));
    (u.uPointer.value as THREE.Vector2).copy(pointer.current);

    const p = progressRef?.current ?? 0;
    camera.position.z = THREE.MathUtils.lerp(camera.position.z, 3.35 - p * 0.7, Math.min(dt * 2, 1));

    if (group.current) {
      group.current.rotation.z = THREE.MathUtils.lerp(group.current.rotation.z, (p - 0.5) * 0.06, Math.min(dt * 2, 1));
      group.current.position.y = THREE.MathUtils.lerp(group.current.position.y, (0.5 - p) * 0.12, Math.min(dt * 2, 1));
    }
  });

  return (
    <group ref={group}>
      <mesh>
        <planeGeometry args={[size, size, 1, 1]} />
        <shaderMaterial
          ref={mat}
          vertexShader={vert}
          fragmentShader={frag}
          uniforms={uniforms}
          transparent
          depthWrite={false}
        />
      </mesh>
    </group>
  );
}

export default function JewelCanvas({
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
  const { ref, inView } = useInView<HTMLDivElement>("250px");

  return (
    <div ref={ref} className={className}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 3.35], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Pieces sources={sources} index={index} progressRef={progressRef} />
        </Suspense>
      </Canvas>
    </div>
  );
}
