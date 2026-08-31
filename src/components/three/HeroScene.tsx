"use client";

import { useEffect, useMemo, useRef } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { mergeVertices } from "three/examples/jsm/utils/BufferGeometryUtils.js";

// Real baked-lighting matcap (a painterly brushed-metal sphere, converted
// from a 32-bit linear EXR/TIFF render down to a 256px sRGB PNG — see
// public/textures/README.md). MeshMatcapMaterial multiplies it by `color`,
// so the grayscale art still comes out tinted in the brand accent.
const MATCAP_URL = "/textures/brush-bw-matcap.png";

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

const BLOB_RADIUS = 1.3;

function Blob() {
  const meshRef = useRef<THREE.Mesh>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);
  const frame = useRef(0);

  // IcosahedronGeometry doesn't share vertices between adjacent faces, so
  // computeVertexNormals() alone only ever produces flat per-face normals.
  // Weld the coincident vertices into an indexed geometry first so normals
  // actually average across shared corners. Also bakes the initial (t=0)
  // bump displacement here, so the blob has its organic shape immediately —
  // and permanently, for prefers-reduced-motion — independent of whether
  // useFrame ever gets to animate it further.
  const { geometry, directions } = useMemo(() => {
    const geo = mergeVertices(new THREE.IcosahedronGeometry(BLOB_RADIUS, 6));
    const pos = geo.attributes.position;
    const dirs = new Float32Array(pos.count * 3);
    const v = new THREE.Vector3();
    for (let i = 0; i < pos.count; i++) {
      v.fromBufferAttribute(pos, i).normalize();
      dirs[i * 3] = v.x;
      dirs[i * 3 + 1] = v.y;
      dirs[i * 3 + 2] = v.z;
      const d = BLOB_RADIUS + bump(v.x * 2, v.y * 2, v.z * 2) * 0.16;
      pos.setXYZ(i, v.x * d, v.y * d, v.z * d);
    }
    geo.computeVertexNormals();
    return { geometry: geo, directions: dirs };
  }, []);

  const matcap = useMemo(() => {
    const texture = new THREE.TextureLoader().load(MATCAP_URL);
    texture.colorSpace = THREE.SRGBColorSpace;
    return texture;
  }, []);

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

  useFrame((state, delta) => {
    const mesh = meshRef.current;
    if (!mesh) return;

    if (!reducedMotion.current) {
      // Re-derive the displacement from the pristine sphere each update
      // (rather than nudging the previous frame's result) so the noise
      // gently flows across the surface instead of drifting/accumulating.
      // Updated every other frame — plenty smooth for a slow wobble, half
      // the CPU cost.
      frame.current++;
      if (frame.current % 2 === 0) {
        const t = state.clock.elapsedTime * 0.35;
        const pos = mesh.geometry.attributes.position;
        for (let i = 0; i < pos.count; i++) {
          const ix = i * 3;
          const nx = directions[ix];
          const ny = directions[ix + 1];
          const nz = directions[ix + 2];
          const d =
            BLOB_RADIUS +
            bump(nx * 2 + t, ny * 2 + t * 0.6, nz * 2) * 0.16;
          pos.setXYZ(i, nx * d, ny * d, nz * d);
        }
        pos.needsUpdate = true;
        mesh.geometry.computeVertexNormals();
      }

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

  return (
    <mesh ref={meshRef} geometry={geometry}>
      <meshMatcapMaterial matcap={matcap} color="#ff5fa8" />
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
