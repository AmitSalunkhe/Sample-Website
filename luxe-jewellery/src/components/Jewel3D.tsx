"use client";

import { Canvas, useFrame } from "@react-three/fiber";
import {
  Environment,
  Lightformer,
  ContactShadows,
  Float,
  MeshTransmissionMaterial,
} from "@react-three/drei";
import { Suspense, useMemo, useRef } from "react";
import * as THREE from "three";

/**
 * Real 3D geometry — a solitaire ring built from actual meshes, not a photograph.
 * Gold is a physical metal material; the stone uses transmission so it refracts
 * whatever is behind it. Lighting comes from inline Lightformers, so nothing is
 * fetched from a CDN and the scene is identical offline.
 */

const GOLD = "#d4a244";

function Diamond({ radius = 0.30 }: { radius?: number }) {
  // A brilliant cut reads as: shallow crown, sharp pavilion. An octahedron
  // scaled asymmetrically gives exactly that silhouette with very few faces.
  const geo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(radius, 0);
    g.scale(1, 1.45, 1);
    g.translate(0, 0.06, 0);
    return g;
  }, [radius]);

  return (
    <mesh geometry={geo} castShadow>
      <MeshTransmissionMaterial
        samples={6}
        resolution={256}
        transmission={1}
        thickness={0.55}
        ior={2.42}
        chromaticAberration={0.32}
        anisotropy={0.25}
        distortion={0.15}
        distortionScale={0.3}
        temporalDistortion={0.05}
        clearcoat={1}
        attenuationDistance={2}
        attenuationColor="#ffffff"
        color="#ffffff"
      />
    </mesh>
  );
}

function Prongs() {
  const prongs = [0, 1, 2, 3, 4, 5].map((i) => {
    const a = (i / 6) * Math.PI * 2;
    return [Math.cos(a) * 0.2, 0.06, Math.sin(a) * 0.2] as const;
  });
  return (
    <group>
      {prongs.map((p, i) => (
        <mesh key={i} position={[p[0], p[1], p[2]]} castShadow>
          <capsuleGeometry args={[0.022, 0.3, 4, 8]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.16} />
        </mesh>
      ))}
    </group>
  );
}

/** Small pavé stones set into the shoulders of the band. */
function Pave({ count = 18, radius = 0.86 }: { count?: number; radius?: number }) {
  const stones = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      // cluster them on the two shoulders, away from the centre stone
      const spread = 0.62;
      const side = i < count / 2 ? 1 : -1;
      const t = ((i % (count / 2)) / (count / 2 - 1) - 0.5) * spread;
      const a = Math.PI / 2 + side * (0.42 + Math.abs(t) * 0.9) * (t < 0 ? -1 : 1);
      out.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return out;
  }, [count, radius]);

  return (
    <group>
      {stones.map((p, i) => (
        <mesh key={i} position={p} castShadow>
          <octahedronGeometry args={[0.05, 0]} />
          <meshPhysicalMaterial
            color="#ffffff"
            metalness={0}
            roughness={0}
            transmission={0.9}
            thickness={0.2}
            ior={2.42}
            clearcoat={1}
          />
        </mesh>
      ))}
    </group>
  );
}

function Ring() {
  const group = useRef<THREE.Group>(null);
  const target = useRef(new THREE.Vector2());

  useFrame((state, dt) => {
    if (!group.current) return;
    // continuous turn, so the piece is visibly 3D the moment the page loads
    group.current.rotation.y += dt * 0.42;

    // pointer adds a gentle lean on top of the spin
    target.current.lerp(state.pointer, Math.min(dt * 2.5, 1));
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      -target.current.y * 0.35 + 0.18,
      Math.min(dt * 3, 1)
    );
    group.current.position.x = target.current.x * 0.12;
  });

  return (
    <group ref={group} scale={1.25}>
      {/* band */}
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.86, 0.085, 48, 160]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.14} />
      </mesh>

      {/* inner polished sleeve, so the band reads as solid rather than a tube */}
      <mesh>
        <torusGeometry args={[0.86, 0.055, 32, 120]} />
        <meshStandardMaterial color="#b8873a" metalness={1} roughness={0.3} />
      </mesh>

      <Pave />

      {/* head: prongs + centre stone, sitting proud of the band */}
      <group position={[0, 0.94, 0]}>
        <Prongs />
        <mesh position={[0, -0.09, 0]} castShadow>
          <cylinderGeometry args={[0.19, 0.13, 0.12, 24]} />
          <meshStandardMaterial color={GOLD} metalness={1} roughness={0.18} />
        </mesh>
        <group position={[0, 0.16, 0]}>
          <Diamond />
        </group>
      </group>
    </group>
  );
}

function Rig() {
  return (
    <>
      {/* Key, fill and rim — the standard three-point setup jewellers shoot with */}
      <ambientLight intensity={0.35} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.35}
        penumbra={1}
        intensity={110}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 2, -3]} intensity={35} color="#ffd9a0" />
      <pointLight position={[0, -3, 3]} intensity={18} color="#fff2d8" />

      {/* Procedural studio environment — no CDN fetch, works offline */}
      <Environment resolution={256}>
        <Lightformer
          form="rect"
          intensity={5}
          position={[0, 4, 2]}
          scale={[8, 3, 1]}
          color="#fff6e6"
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[-4, 1, 2]}
          scale={[3, 6, 1]}
          rotation-y={Math.PI / 4}
          color="#ffe3b0"
        />
        <Lightformer
          form="rect"
          intensity={3}
          position={[4, 1, 2]}
          scale={[3, 6, 1]}
          rotation-y={-Math.PI / 4}
          color="#ffffff"
        />
        <Lightformer
          form="ring"
          intensity={2.2}
          position={[0, 0, -5]}
          scale={6}
          color="#c9a227"
        />
      </Environment>
    </>
  );
}

export default function Jewel3D({ className = "" }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
        camera={{ position: [0, 0.35, 5.2], fov: 38 }}
      >
        <Suspense fallback={null}>
          <Float speed={1.4} rotationIntensity={0.15} floatIntensity={0.5}>
            <Ring />
          </Float>
          <ContactShadows
            position={[0, -1.75, 0]}
            opacity={0.55}
            scale={9}
            blur={2.6}
            far={4}
            color="#000000"
          />
          <Rig />
        </Suspense>
      </Canvas>
    </div>
  );
}
