"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";

// "Black cat" by Kanna-Nakajima (sketchfab.com/Kanna-nakajima),
// CC-BY-4.0 — https://sketchfab.com/3d-models/black-cat-98da5c4c2fff4c05898ba82c244b9eec
// Both materials use KHR_materials_unlit, so it renders correctly with
// zero scene lights (three.js maps that extension to MeshBasicMaterial).
const MODEL_URL = "/models/black-cat.glb";
const TARGET_SIZE = 2.6; // roughly the footprint the previous blob had

function CatModel() {
  // Two handles to the same THREE.Group once loaded: `modelRef` is what
  // useFrame mutates every frame (refs are for exactly this — imperative
  // writes outside React's render pass), `model` state is only ever read,
  // never written, and exists purely so <primitive> has something to
  // render — React refs can't be read during render itself.
  const modelRef = useRef<THREE.Group | null>(null);
  const [model, setModel] = useState<THREE.Group | null>(null);
  const pointer = useRef({ x: 0, y: 0 });
  const reducedMotion = useRef(false);

  useEffect(() => {
    let cancelled = false;
    new GLTFLoader().load(MODEL_URL, (gltf) => {
      if (cancelled) return;
      const scene = gltf.scene;

      // Normalize whatever scale/pivot the source file shipped with so it
      // sits centered and consistently sized regardless of the export.
      const box = new THREE.Box3().setFromObject(scene);
      const size = box.getSize(new THREE.Vector3());
      const center = box.getCenter(new THREE.Vector3());
      const scale = TARGET_SIZE / Math.max(size.x, size.y, size.z);
      scene.scale.setScalar(scale);
      scene.position.set(
        -center.x * scale,
        -center.y * scale,
        -center.z * scale,
      );

      modelRef.current = scene;
      setModel(scene);
    });
    return () => {
      cancelled = true;
    };
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

  useFrame((_, delta) => {
    const model = modelRef.current;
    if (!model) return;

    if (!reducedMotion.current) {
      model.rotation.y += delta * 0.25;
    }
    model.rotation.x = THREE.MathUtils.lerp(
      model.rotation.x,
      pointer.current.y * 0.2,
      0.05,
    );
    model.rotation.z = THREE.MathUtils.lerp(
      model.rotation.z,
      -pointer.current.x * 0.15,
      0.05,
    );
  });

  return model ? <primitive object={model} /> : null;
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <CatModel />
      </Canvas>
    </div>
  );
}
