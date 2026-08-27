"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { useTexture } from "@react-three/drei";
import { useRef, useMemo, Suspense } from "react";
import * as THREE from "three";

/**
 * Drives a real product photograph through a live lighting model.
 * A Sobel pass over the photo's own luminance reconstructs a surface normal,
 * so the moving key light lands on the metal that is genuinely there —
 * the sparkle follows the real stones rather than a painted-on overlay.
 */
const vert = /* glsl */ `
  varying vec2 vUv;
  uniform float uTime;
  uniform vec2  uPointer;
  void main() {
    vUv = uv;
    vec3 p = position;
    // gentle breathing tilt, as if the piece rests on a turning display
    float tilt = sin(uTime * 0.35) * 0.03 + uPointer.x * 0.06;
    float pitch = cos(uTime * 0.28) * 0.02 - uPointer.y * 0.05;
    p.z += sin(p.x * 2.0 + uTime * 0.4) * 0.012;
    mat3 ry = mat3(cos(tilt),0.0,sin(tilt), 0.0,1.0,0.0, -sin(tilt),0.0,cos(tilt));
    mat3 rx = mat3(1.0,0.0,0.0, 0.0,cos(pitch),-sin(pitch), 0.0,sin(pitch),cos(pitch));
    gl_Position = projectionMatrix * modelViewMatrix * vec4(ry * rx * p, 1.0);
  }
`;

const frag = /* glsl */ `
  precision highp float;
  varying vec2 vUv;
  uniform sampler2D uTex;
  uniform float uTime;
  uniform vec2  uPointer;
  uniform vec2  uTexel;
  uniform float uReveal;

  float lum(vec3 c){ return dot(c, vec3(0.2126,0.7152,0.0722)); }

  void main() {
    vec2 uv = vUv;

    // --- chromatic refraction: split the channels along the light axis ---
    vec2 dir = normalize(vec2(uPointer.x + 0.35, uPointer.y + 0.2) + 1e-5);
    float disp = 0.0016;
    vec4 cr = texture2D(uTex, uv + dir * disp);
    vec4 cg = texture2D(uTex, uv);
    vec4 cb = texture2D(uTex, uv - dir * disp);
    vec4 base = vec4(cr.r, cg.g, cb.b, max(cg.a, max(cr.a, cb.a)));

    if (base.a < 0.01) { discard; }

    // --- Sobel over luminance -> surface normal of the actual metal ---
    float l  = lum(texture2D(uTex, uv).rgb);
    float lx1 = lum(texture2D(uTex, uv + vec2(uTexel.x, 0.0)).rgb);
    float lx0 = lum(texture2D(uTex, uv - vec2(uTexel.x, 0.0)).rgb);
    float ly1 = lum(texture2D(uTex, uv + vec2(0.0, uTexel.y)).rgb);
    float ly0 = lum(texture2D(uTex, uv - vec2(0.0, uTexel.y)).rgb);
    vec3 n = normalize(vec3((lx0 - lx1) * 3.2, (ly0 - ly1) * 3.2, 1.0));

    // --- moving key light + fixed warm fill ---
    vec3 key  = normalize(vec3(sin(uTime * 0.45) * 0.7 + uPointer.x, cos(uTime * 0.37) * 0.5 + uPointer.y, 0.85));
    vec3 fill = normalize(vec3(-0.5, -0.35, 0.7));
    vec3 view = vec3(0.0, 0.0, 1.0);

    float dKey  = max(dot(n, key), 0.0);
    float dFill = max(dot(n, fill), 0.0);

    vec3 h = normalize(key + view);
    float spec = pow(max(dot(n, h), 0.0), 46.0);

    // --- stone sparkle: only the brightest facets flare, and only near the light ---
    float facet = smoothstep(0.74, 0.98, l);
    float twinkle = pow(max(dot(n, key), 0.0), 90.0);
    float sparkle = facet * twinkle * (0.65 + 0.35 * sin(uTime * 3.1 + uv.x * 60.0 + uv.y * 44.0));

    vec3 goldWarm = vec3(1.00, 0.84, 0.53);
    vec3 goldCool = vec3(0.86, 0.72, 0.46);

    vec3 col = base.rgb;
    col += goldWarm * dKey  * 0.30;
    col += goldCool * dFill * 0.12;
    col += goldWarm * spec  * 0.85;
    col += vec3(1.0, 0.97, 0.92) * sparkle * 1.5;

    // sweeping polish band, like a light bar tracking across the metal
    float band = smoothstep(0.045, 0.0, abs(fract((uv.x + uv.y) * 0.5 - uTime * 0.09) - 0.5));
    col += goldWarm * band * l * 0.42;

    // slight contrast lift so the piece sits forward of the black ground
    col = (col - 0.5) * 1.06 + 0.5;

    float a = base.a * uReveal;
    gl_FragColor = vec4(col, a);
  }
`;

function Piece({ src, scale = 1 }: { src: string; scale?: number }) {
  const tex = useTexture(src);
  const mat = useRef<THREE.ShaderMaterial>(null);
  const { viewport } = useThree();
  const pointer = useRef(new THREE.Vector2(0, 0));

  const uniforms = useMemo(
    () => ({
      uTex: { value: tex },
      uTime: { value: 0 },
      uPointer: { value: new THREE.Vector2(0, 0) },
      uTexel: { value: new THREE.Vector2(1 / 1024, 1 / 1024) },
      uReveal: { value: 0 },
    }),
    [tex]
  );

  // keep the photo's own aspect ratio — never stretch a product shot
  const img = tex.image as HTMLImageElement | undefined;
  const ar = img && img.height ? img.width / img.height : 1;
  const h = Math.min(viewport.height * 0.72, viewport.width * 0.72 / ar) * scale;
  const w = h * ar;

  useFrame((state, dt) => {
    if (!mat.current) return;
    const u = mat.current.uniforms;
    u.uTime.value = state.clock.elapsedTime;
    pointer.current.lerp(state.pointer, Math.min(dt * 3, 1));
    (u.uPointer.value as THREE.Vector2).copy(pointer.current);
    u.uReveal.value = THREE.MathUtils.lerp(u.uReveal.value, 1, Math.min(dt * 1.6, 1));
    if (img?.width) (u.uTexel.value as THREE.Vector2).set(1 / img.width, 1 / img.height);
  });

  return (
    <mesh>
      <planeGeometry args={[w, h, 48, 48]} />
      <shaderMaterial
        ref={mat}
        vertexShader={vert}
        fragmentShader={frag}
        uniforms={uniforms}
        transparent
        depthWrite={false}
      />
    </mesh>
  );
}

export default function JewelCanvas({
  src,
  scale = 1,
  className = "",
}: {
  src: string;
  scale?: number;
  className?: string;
}) {
  return (
    <div className={className}>
      <Canvas
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0, 3.2], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Piece src={src} scale={scale} />
        </Suspense>
      </Canvas>
    </div>
  );
}
