"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  Vignette,
  Noise,
  DepthOfField,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";
import { useInView } from "@/lib/useInView";

const GOLD = "#d4a244";

/* ------------------------------------------------------------------ */
/* Scroll progress of the pinned stage, 0 -> 1                         */
/* ------------------------------------------------------------------ */

function useStageProgress(targetId: string) {
  const p = useRef(0);
  useFrame(() => {
    const el = document.getElementById(targetId);
    if (!el) return;
    const r = el.getBoundingClientRect();
    const travel = r.height - window.innerHeight;
    p.current = travel > 0 ? THREE.MathUtils.clamp(-r.top / travel, 0, 1) : 0;
  });
  return p;
}

/* ------------------------------------------------------------------ */
/* Materials                                                           */
/* ------------------------------------------------------------------ */
/*
 * The stone used to be MeshTransmissionMaterial, which re-renders the scene
 * into a buffer every single frame, and the eighteen pave stones each carried
 * their own transmission pass on top of that. Together they were the largest
 * cost on the page. A polished dielectric that simply reflects the environment
 * hard reads almost identically at this scale and costs nothing per frame.
 */

function Diamond() {
  const geo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(0.3, 0);
    g.scale(1, 1.45, 1);
    g.translate(0, 0.06, 0);
    return g;
  }, []);

  return (
    <mesh geometry={geo}>
      <meshPhysicalMaterial
        color="#ffffff"
        metalness={0.05}
        roughness={0.02}
        clearcoat={1}
        clearcoatRoughness={0}
        envMapIntensity={3.2}
        iridescence={0.6}
        iridescenceIOR={2.0}
        flatShading
      />
    </mesh>
  );
}

function Pave({ count = 18, radius = 0.86 }) {
  const stones = useMemo(() => {
    const out: [number, number, number][] = [];
    for (let i = 0; i < count; i++) {
      const side = i < count / 2 ? 1 : -1;
      const t = ((i % (count / 2)) / (count / 2 - 1) - 0.5) * 0.62;
      const a = Math.PI / 2 + side * (0.42 + Math.abs(t) * 0.9) * (t < 0 ? -1 : 1);
      out.push([Math.cos(a) * radius, Math.sin(a) * radius, 0]);
    }
    return out;
  }, [count, radius]);

  // one geometry and one material shared across every stone
  const geo = useMemo(() => new THREE.OctahedronGeometry(0.05, 0), []);
  const mat = useMemo(
    () =>
      new THREE.MeshPhysicalMaterial({
        color: "#ffffff",
        metalness: 0.05,
        roughness: 0.02,
        clearcoat: 1,
        envMapIntensity: 3,
        flatShading: true,
      }),
    []
  );

  return (
    <group>
      {stones.map((p, i) => (
        <mesh key={i} position={p} geometry={geo} material={mat} />
      ))}
    </group>
  );
}

function Ring({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  const goldMat = useMemo(
    () => new THREE.MeshStandardMaterial({ color: GOLD, metalness: 1, roughness: 0.13 }),
    []
  );
  const prongGeo = useMemo(() => new THREE.CapsuleGeometry(0.022, 0.3, 3, 6), []);

  useFrame((state, dt) => {
    if (!group.current) return;
    const p = progress.current ?? 0;
    group.current.rotation.y += dt * 0.3 + p * dt * 1.2;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.16 + Math.sin(state.clock.elapsedTime * 0.35) * 0.05,
      Math.min(dt * 2, 1)
    );
  });

  return (
    <group ref={group}>
      <mesh material={goldMat}>
        <torusGeometry args={[0.86, 0.085, 24, 96]} />
      </mesh>

      <Pave />

      <group position={[0, 0.94, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh
              key={i}
              position={[Math.cos(a) * 0.2, 0.06, Math.sin(a) * 0.2]}
              geometry={prongGeo}
              material={goldMat}
            />
          );
        })}
        <mesh material={goldMat} position={[0, -0.09, 0]}>
          <cylinderGeometry args={[0.19, 0.13, 0.12, 16]} />
        </mesh>
        <group position={[0, 0.16, 0]}>
          <Diamond />
        </group>
      </group>
    </group>
  );
}

/* ------------------------------------------------------------------ */
/* Camera choreography, three shots, cut on scroll                     */
/* ------------------------------------------------------------------ */

type Shot = { pos: [number, number, number]; look: [number, number, number]; focus: number };

const SHOTS: Shot[] = [
  // establishing wide, the piece sits small in a lot of darkness
  { pos: [0, 0.5, 7.6], look: [0, 0.1, 0], focus: 7.4 },
  // push in and orbit, catching the light across the band
  { pos: [2.1, 0.15, 3.9], look: [0, 0.15, 0], focus: 4.0 },
  // macro on the head, prongs and stone fill the frame
  { pos: [0.35, 1.05, 2.15], look: [0, 0.92, 0], focus: 2.0 },
];

function Rig({
  progress,
  focusRef,
}: {
  progress: React.RefObject<number>;
  focusRef: React.RefObject<number>;
}) {
  const { camera } = useThree();
  const look = useRef(new THREE.Vector3(0, 0.1, 0));
  const pointer = useRef(new THREE.Vector2());
  const targetPos = useRef(new THREE.Vector3());
  const targetLook = useRef(new THREE.Vector3());

  useFrame((state, dt) => {
    const p = progress.current ?? 0;
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    const seg = eased * (SHOTS.length - 1);
    const i = Math.min(Math.floor(seg), SHOTS.length - 2);
    const t = seg - i;
    const a = SHOTS[i];
    const b = SHOTS[i + 1];
    const L = THREE.MathUtils.lerp;

    pointer.current.lerp(state.pointer, Math.min(dt * 1.5, 1));

    // reused vectors instead of allocating two new ones every frame
    targetPos.current.set(
      L(a.pos[0], b.pos[0], t) + pointer.current.x * 0.35,
      L(a.pos[1], b.pos[1], t) + pointer.current.y * 0.2,
      L(a.pos[2], b.pos[2], t)
    );
    targetLook.current.set(
      L(a.look[0], b.look[0], t),
      L(a.look[1], b.look[1], t),
      L(a.look[2], b.look[2], t)
    );

    camera.position.lerp(targetPos.current, Math.min(dt * 2.4, 1));
    look.current.lerp(targetLook.current, Math.min(dt * 2.4, 1));
    camera.lookAt(look.current);

    focusRef.current = L(a.focus, b.focus, t);
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.25} />
      <pointLight position={[4, 5, 4]} intensity={120} color="#fff2d8" />
      <pointLight position={[-4, 1.5, -3]} intensity={40} color="#ffcf8a" />

      {/* frames={1}: the cubemap is rendered once at mount, not every frame */}
      <Environment resolution={128} frames={1}>
        <Lightformer form="rect" intensity={6} position={[0, 4, 2]} scale={[8, 3, 1]} color="#fff6e6" />
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[-4, 1, 2]}
          scale={[3, 6, 1]}
          rotation-y={Math.PI / 4}
          color="#ffe3b0"
        />
        <Lightformer
          form="rect"
          intensity={3.5}
          position={[4, 1, 2]}
          scale={[3, 6, 1]}
          rotation-y={-Math.PI / 4}
          color="#ffffff"
        />
        <Lightformer form="ring" intensity={2.4} position={[0, 0, -5]} scale={6} color="#c9a227" />
      </Environment>
    </>
  );
}

export default function CinematicStage({
  targetId,
  className = "",
}: {
  targetId: string;
  className?: string;
}) {
  const { ref, inView } = useInView<HTMLDivElement>("200px");

  return (
    <div ref={ref} className={className}>
      <Canvas
        dpr={[1, 1.5]}
        frameloop={inView ? "always" : "never"}
        gl={{ antialias: false, alpha: true, powerPreference: "high-performance" }}
        camera={{ position: [0, 0.5, 7.6], fov: 40, far: 100 }}
      >
        <Suspense fallback={null}>
          <StageContents targetId={targetId} />
        </Suspense>
      </Canvas>
    </div>
  );
}

const CAMERA_FAR = 100;

function StageContents({ targetId }: { targetId: string }) {
  const progress = useStageProgress(targetId);
  const focusRef = useRef(7.4);

  // Committed through DepthOfField's public prop, and only when it moves enough
  // to be visible, so this re-renders a few times per shot rather than per frame.
  const [focus, setFocus] = useState(7.4);
  const committed = useRef(7.4);
  useFrame(() => {
    const f = focusRef.current ?? 7.4;
    if (Math.abs(f - committed.current) > 0.12) {
      committed.current = f;
      setFocus(f);
    }
  });

  return (
    <>
      <Ring progress={progress} />
      {/* frames={1}: baked once rather than re-rendered every frame */}
      <ContactShadows
        position={[0, -1.6, 0]}
        opacity={0.6}
        scale={9}
        blur={2.8}
        far={4}
        frames={1}
      />
      <Lights />
      <Rig progress={progress} focusRef={focusRef} />

      {/*
        Depth of field is back, but at half the resolution and a smaller bokeh
        than before (height 240 / scale 3, was 480 / 5). It is the shallow focus
        that made this read as film, and with nineteen transmission passes and a
        whole extra context now gone there is budget for it again.
      */}
      <EffectComposer multisampling={0}>
        <DepthOfField
          focusDistance={focus / CAMERA_FAR}
          focalLength={0.05}
          bokehScale={3}
          height={240}
        />
        <Bloom intensity={0.8} luminanceThreshold={0.6} luminanceSmoothing={0.3} mipmapBlur />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0009)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.85} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.4} />
      </EffectComposer>
    </>
  );
}
