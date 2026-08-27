"use client";

import { Canvas, useFrame, useThree } from "@react-three/fiber";
import { Environment, Lightformer, ContactShadows, MeshTransmissionMaterial } from "@react-three/drei";
import {
  EffectComposer,
  Bloom,
  DepthOfField,
  Vignette,
  Noise,
  ChromaticAberration,
} from "@react-three/postprocessing";
import { BlendFunction } from "postprocessing";
import { Suspense, useMemo, useRef, useState } from "react";
import * as THREE from "three";

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
/* The ring                                                            */
/* ------------------------------------------------------------------ */

function Diamond() {
  const geo = useMemo(() => {
    const g = new THREE.OctahedronGeometry(0.3, 0);
    g.scale(1, 1.45, 1);
    g.translate(0, 0.06, 0);
    return g;
  }, []);

  return (
    <mesh geometry={geo} castShadow>
      <MeshTransmissionMaterial
        samples={6}
        resolution={256}
        transmission={1}
        thickness={0.55}
        ior={2.42}
        chromaticAberration={0.38}
        anisotropy={0.3}
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

function Ring({ progress }: { progress: React.RefObject<number> }) {
  const group = useRef<THREE.Group>(null);

  useFrame((state, dt) => {
    if (!group.current) return;
    const p = progress.current ?? 0;
    // a slow constant turn, accelerated slightly by scroll, the piece is always
    // moving, so a still frame never looks like a static image
    group.current.rotation.y += dt * 0.3 + p * dt * 1.2;
    group.current.rotation.x = THREE.MathUtils.lerp(
      group.current.rotation.x,
      0.16 + Math.sin(state.clock.elapsedTime * 0.35) * 0.05,
      Math.min(dt * 2, 1)
    );
  });

  return (
    <group ref={group}>
      <mesh castShadow receiveShadow>
        <torusGeometry args={[0.86, 0.085, 48, 160]} />
        <meshStandardMaterial color={GOLD} metalness={1} roughness={0.13} />
      </mesh>
      <mesh>
        <torusGeometry args={[0.86, 0.055, 32, 120]} />
        <meshStandardMaterial color="#b8873a" metalness={1} roughness={0.3} />
      </mesh>

      <Pave />

      <group position={[0, 0.94, 0]}>
        {[0, 1, 2, 3, 4, 5].map((i) => {
          const a = (i / 6) * Math.PI * 2;
          return (
            <mesh key={i} position={[Math.cos(a) * 0.2, 0.06, Math.sin(a) * 0.2]} castShadow>
              <capsuleGeometry args={[0.022, 0.3, 4, 8]} />
              <meshStandardMaterial color={GOLD} metalness={1} roughness={0.16} />
            </mesh>
          );
        })}
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

/* ------------------------------------------------------------------ */
/* Camera choreography, three shots, cut on scroll                    */
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

function lerpShot(a: Shot, b: Shot, t: number): Shot {
  const m = (x: number, y: number) => THREE.MathUtils.lerp(x, y, t);
  return {
    pos: [m(a.pos[0], b.pos[0]), m(a.pos[1], b.pos[1]), m(a.pos[2], b.pos[2])],
    look: [m(a.look[0], b.look[0]), m(a.look[1], b.look[1]), m(a.look[2], b.look[2])],
    focus: m(a.focus, b.focus),
  };
}

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

  useFrame((state, dt) => {
    const p = progress.current ?? 0;

    // ease the raw scroll so the camera has weight instead of tracking 1:1
    const eased = p < 0.5 ? 2 * p * p : 1 - Math.pow(-2 * p + 2, 2) / 2;

    const seg = eased * (SHOTS.length - 1);
    const i = Math.min(Math.floor(seg), SHOTS.length - 2);
    const shot = lerpShot(SHOTS[i], SHOTS[i + 1], seg - i);

    // a little parallax from the cursor, damped so it reads as a handheld drift
    pointer.current.lerp(state.pointer, Math.min(dt * 1.5, 1));

    camera.position.lerp(
      new THREE.Vector3(
        shot.pos[0] + pointer.current.x * 0.35,
        shot.pos[1] + pointer.current.y * 0.2,
        shot.pos[2]
      ),
      Math.min(dt * 2.4, 1)
    );

    look.current.lerp(new THREE.Vector3(...shot.look), Math.min(dt * 2.4, 1));
    camera.lookAt(look.current);

    focusRef.current = shot.focus;
  });

  return null;
}

function Lights() {
  return (
    <>
      <ambientLight intensity={0.22} />
      <spotLight
        position={[4, 6, 4]}
        angle={0.34}
        penumbra={1}
        intensity={130}
        castShadow
        shadow-mapSize={[1024, 1024]}
      />
      <pointLight position={[-4, 1.5, -3]} intensity={40} color="#ffcf8a" />
      <pointLight position={[0, -2.5, 3]} intensity={20} color="#fff2d8" />

      <Environment resolution={256}>
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
  return (
    <div className={className}>
      <Canvas
        shadows
        dpr={[1, 1.75]}
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

  // Focus is driven through DepthOfField's public prop rather than by reaching
  // into the effect's internals. Committed only when it moves enough to matter,
  // so this re-renders a handful of times per shot, not every frame.
  const [focus, setFocus] = useState(7.4);
  const committed = useRef(7.4);

  useFrame(() => {
    const f = focusRef.current ?? 7.4;
    if (Math.abs(f - committed.current) > 0.1) {
      committed.current = f;
      setFocus(f);
    }
  });

  return (
    <>
      <Ring progress={progress} />
      <ContactShadows position={[0, -1.6, 0]} opacity={0.6} scale={9} blur={2.8} far={4} />
      <Lights />
      <Rig progress={progress} focusRef={focusRef} />

      {/* The grade. This is what makes it read as film rather than as a render. */}
      <EffectComposer multisampling={0}>
        <DepthOfField
          focusDistance={focus / CAMERA_FAR}
          focalLength={0.05}
          bokehScale={5}
          height={480}
        />
        <Bloom intensity={0.85} luminanceThreshold={0.55} luminanceSmoothing={0.3} mipmapBlur />
        <ChromaticAberration
          offset={new THREE.Vector2(0.0006, 0.0009)}
          blendFunction={BlendFunction.NORMAL}
          radialModulation={false}
          modulationOffset={0}
        />
        <Vignette eskil={false} offset={0.22} darkness={0.85} />
        <Noise premultiply blendFunction={BlendFunction.SOFT_LIGHT} opacity={0.42} />
      </EffectComposer>
    </>
  );
}
