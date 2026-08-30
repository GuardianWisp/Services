"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";

// A matcap is a texture that already has lighting "baked" into it — the
// material just samples it by the fragment's view-space normal, so there's
// no runtime lighting math at all. This paints one on a canvas at runtime
// instead of shipping an image asset: a radial base tone fading to a dark
// rim (the sphere's own shading) plus an offset soft highlight (the "baked"
// key light).
function createMatcapTexture(base: string, highlight: string, shadow: string) {
  const size = 256;
  const canvas = document.createElement("canvas");
  canvas.width = size;
  canvas.height = size;
  const ctx = canvas.getContext("2d");
  if (!ctx) return null;

  const body = ctx.createRadialGradient(
    size * 0.5,
    size * 0.5,
    size * 0.02,
    size * 0.5,
    size * 0.5,
    size * 0.5,
  );
  body.addColorStop(0, base);
  body.addColorStop(0.68, base);
  body.addColorStop(1, shadow);
  ctx.fillStyle = body;
  ctx.fillRect(0, 0, size, size);

  ctx.save();
  ctx.beginPath();
  ctx.arc(size * 0.5, size * 0.5, size * 0.5, 0, Math.PI * 2);
  ctx.clip();
  const glow = ctx.createRadialGradient(
    size * 0.34,
    size * 0.28,
    0,
    size * 0.34,
    size * 0.28,
    size * 0.32,
  );
  glow.addColorStop(0, highlight);
  glow.addColorStop(1, "transparent");
  ctx.fillStyle = glow;
  ctx.fillRect(0, 0, size, size);
  ctx.restore();

  const texture = new THREE.CanvasTexture(canvas);
  texture.colorSpace = THREE.SRGBColorSpace;
  texture.needsUpdate = true;
  return texture;
}

// Cheap deterministic "noise" (a handful of summed sines) — just enough to
// nudge a sphere into an organic, non-uniform blob without pulling in a
// noise library for a one-off static displacement.
function bump(x: number, y: number, z: number) {
  return (
    Math.sin(x * 3.1 + y * 1.7) * 0.5 +
    Math.sin(y * 2.3 + z * 3.3) * 0.3 +
    Math.sin(z * 4.1 + x * 2.1) * 0.2
  );
}

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);

  const geometry = useMemo(() => {
    const geo = new THREE.IcosahedronGeometry(1.3, 5);
    const pos = geo.attributes.position;
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i);
      const n = v.clone().normalize();
      const displacement = bump(n.x * 2, n.y * 2, n.z * 2) * 0.16;
      v.addScaledVector(n, displacement);
      pos.setXYZ(i, v.x, v.y, v.z);
    }
    geo.computeVertexNormals();
    return geo;
  }, []);

  const matcap = useMemo(
    () => createMatcapTexture("#ff5fa8", "#ffffff", "#7a1150"),
    [],
  );

  useEffect(() => {
    reducedMotion.current = window.matchMedia(
      "(prefers-reduced-motion: reduce)",
    ).matches;

    const handlePointerMove = (event: PointerEvent) => {
      pointer.current.x = (event.clientX / window.innerWidth) * 2 - 1;
      pointer.current.y = (event.clientY / window.innerHeight) * 2 - 1;
    };
    window.addEventListener("pointermove", handlePointerMove);
    return () => window.removeEventListener("pointermove", handlePointerMove);
  }, []);

  useFrame((_, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!reducedMotion.current) {
      mesh.rotation.y += delta * 0.25;
    }
    mesh.rotation.x = THREE.MathUtils.lerp(
      mesh.rotation.x,
      pointer.current.y * 0.3,
      0.05,
    );
    mesh.rotation.z = THREE.MathUtils.lerp(
      mesh.rotation.z,
      -pointer.current.x * 0.2,
      0.05,
    );
  });

  if (!matcap) return null;

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshMatcapMaterial matcap={matcap} />
    </mesh>
  );
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <Blob />
      </Canvas>
    </div>
  );
}
