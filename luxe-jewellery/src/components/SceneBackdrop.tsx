"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import { Environment, Lightformer } from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * A single 3D layer that sits behind the entire page and reacts to scroll.
 * This is what makes the site read as three-dimensional end to end rather than
 * as one 3D hero followed by flat sections: gold dust drifts through depth, and
 * three large gold bands tumble and travel as you move down the document.
 *
 * Rendered once, fixed to the viewport, and pointer-events-none, so it costs a
 * single WebGL context for the whole page.
 */

const GOLD = "#d4a244";

/** Normalised scroll position of the whole document, 0 -> 1. */
function useScrollRef() {
  const v = useRef(0);
  useFrame(() => {
    const max = document.documentElement.scrollHeight - window.innerHeight;
    v.current = max > 0 ? window.scrollY / max : 0;
  });
  return v;
}

function Dust({ count = 700 }: { count?: number }) {
  const mesh = useRef<THREE.InstancedMesh>(null);
  const dummy = useMemo(() => new THREE.Object3D(), []);

  const seeds = useMemo(
    () =>
      Array.from({ length: count }, () => ({
        x: (Math.random() - 0.5) * 26,
        y: (Math.random() - 0.5) * 22,
        z: (Math.random() - 0.5) * 18,
        s: 0.006 + Math.random() * 0.026,
        drift: 0.1 + Math.random() * 0.55,
        phase: Math.random() * Math.PI * 2,
      })),
    [count]
  );

  useFrame((state) => {
    if (!mesh.current) return;
    const t = state.clock.elapsedTime;
    seeds.forEach((p, i) => {
      // slow upward drift that wraps, plus a lateral sway
      const y = ((p.y + t * p.drift + 11) % 22) - 11;
      dummy.position.set(p.x + Math.sin(t * 0.25 + p.phase) * 0.5, y, p.z);
      const tw = 0.65 + 0.35 * Math.sin(t * 2.2 + p.phase);
      dummy.scale.setScalar(p.s * tw);
      dummy.updateMatrix();
      mesh.current!.setMatrixAt(i, dummy.matrix);
    });
    mesh.current.instanceMatrix.needsUpdate = true;
  });

  return (
    <instancedMesh ref={mesh} args={[undefined, undefined, count]}>
      <octahedronGeometry args={[1, 0]} />
      <meshStandardMaterial
        color={GOLD}
        metalness={1}
        roughness={0.2}
        emissive={GOLD}
        emissiveIntensity={0.35}
        transparent
        opacity={0.85}
      />
    </instancedMesh>
  );
}

/** A large gold band that tumbles and travels down as the page scrolls. */
function Band({
  offset,
  radius,
  position,
  speed,
}: {
  offset: number;
  radius: number;
  position: [number, number, number];
  speed: number;
}) {
  const ref = useRef<THREE.Mesh>(null);
  const scroll = useScrollRef();

  useFrame((state, dt) => {
    if (!ref.current) return;
    const t = state.clock.elapsedTime;
    ref.current.rotation.x += dt * speed * 0.5;
    ref.current.rotation.y += dt * speed;
    // scroll pushes the bands upward and slightly toward the camera
    const s = scroll.current;
    ref.current.position.y = position[1] + s * 26 - offset;
    ref.current.position.z = position[2] + Math.sin(t * 0.3 + offset) * 1.2 + s * 3;
  });

  return (
    <mesh ref={ref} position={position}>
      <torusGeometry args={[radius, radius * 0.075, 28, 120]} />
      <meshStandardMaterial color={GOLD} metalness={1} roughness={0.22} />
    </mesh>
  );
}

function Scene() {
  return (
    <>
      <ambientLight intensity={0.4} />
      <pointLight position={[6, 6, 6]} intensity={90} color="#fff0d0" />
      <pointLight position={[-7, -3, -4]} intensity={45} color="#c9a227" />

      <Dust />

      <Band offset={0} radius={2.6} position={[-6.5, -6, -6]} speed={0.22} />
      <Band offset={9} radius={1.7} position={[7, -12, -4]} speed={0.34} />
      <Band offset={17} radius={3.4} position={[2, -20, -9]} speed={0.16} />

      <Environment resolution={128}>
        <Lightformer
          form="rect"
          intensity={3}
          position={[0, 5, 3]}
          scale={[10, 4, 1]}
          color="#fff4e0"
        />
        <Lightformer
          form="ring"
          intensity={2}
          position={[0, -2, -6]}
          scale={8}
          color="#c9a227"
        />
      </Environment>
    </>
  );
}

export default function SceneBackdrop() {
  return (
    <div aria-hidden className="pointer-events-none fixed inset-0 -z-10">
      <Canvas
        dpr={[1, 1.75]}
        gl={{ antialias: true, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0, 12], fov: 45 }}
      >
        <Suspense fallback={null}>
          <Scene />
        </Suspense>
      </Canvas>
    </div>
  );
}
