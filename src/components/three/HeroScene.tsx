"use client";

import { useEffect, useRef, useState } from "react";
import { Canvas, useFrame, useThree } from "@react-three/fiber";
import * as THREE from "three";
import { GLTFLoader } from "three/examples/jsm/loaders/GLTFLoader.js";
import { RoomEnvironment } from "three/examples/jsm/environments/RoomEnvironment.js";
import { EffectComposer } from "three/examples/jsm/postprocessing/EffectComposer.js";
import { RenderPass } from "three/examples/jsm/postprocessing/RenderPass.js";
import { UnrealBloomPass } from "three/examples/jsm/postprocessing/UnrealBloomPass.js";
import { OutputPass } from "three/examples/jsm/postprocessing/OutputPass.js";

// "Black cat" by Kanna-Nakajima (sketchfab.com/Kanna-nakajima),
// CC-BY-4.0 — https://sketchfab.com/3d-models/black-cat-98da5c4c2fff4c05898ba82c244b9eec
// Both materials use KHR_materials_unlit, so three.js maps them to
// MeshBasicMaterial — they don't react to scene lights, only to an
// explicit envMap (assigned by hand below once the room environment is
// ready), which is what gives the flat toon shading a bit of reflected
// sheen instead of full relighting.
const MODEL_URL = "/models/black-cat.glb";
const TARGET_SIZE = 2.7;

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
  const { gl } = useThree();

  useEffect(() => {
    let cancelled = false;

    // A tiny procedurally-rendered "room" — three.js's stock stand-in for
    // a real HDRI file when you just want soft, believable studio
    // reflections without shipping/loading an actual .hdr asset.
    const pmremGenerator = new THREE.PMREMGenerator(gl);
    const envMap = pmremGenerator.fromScene(
      new RoomEnvironment(),
      0.04,
    ).texture;

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

      scene.traverse((child) => {
        if (
          child instanceof THREE.Mesh &&
          child.material instanceof THREE.MeshBasicMaterial
        ) {
          child.material.envMap = envMap;
          child.material.combine = THREE.MixOperation;
          child.material.reflectivity = 0.25;
          child.material.needsUpdate = true;
        }
      });

      modelRef.current = scene;
      setModel(scene);
    });

    return () => {
      cancelled = true;
      pmremGenerator.dispose();
    };
  }, [gl]);

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
      pointer.current.y * 0.07,
      0.05,
    );
    model.rotation.z = THREE.MathUtils.lerp(
      model.rotation.z,
      -pointer.current.x * 0.06,
      0.05,
    );
  });

  return model ? <primitive object={model} /> : null;
}

// Bloom needs a full render pipeline (EffectComposer) instead of the
// default single gl.render() call, so this takes over the frame's render
// step itself — passing a numeric render priority to useFrame tells r3f
// to stop auto-rendering and defer to whichever callback claims it.
function Glow() {
  const { gl, scene, camera, size } = useThree();
  const composer = useRef<EffectComposer | null>(null);

  useEffect(() => {
    const instance = new EffectComposer(gl);
    instance.addPass(new RenderPass(scene, camera));
    const bloom = new UnrealBloomPass(
      new THREE.Vector2(size.width, size.height),
      0.55, // strength
      0.4, // radius
      0.2, // threshold — only genuinely bright pixels bloom
    );
    instance.addPass(bloom);
    instance.addPass(new OutputPass());
    composer.current = instance;
    return () => instance.dispose();
    // size.width/height intentionally excluded: this only needs to build
    // the composer once (recreating it on every resize would be wasteful),
    // and the effect below immediately corrects the size via setSize().
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [gl, scene, camera]);

  useEffect(() => {
    composer.current?.setSize(size.width, size.height);
  }, [size.width, size.height]);

  useFrame(
    (_, delta) => {
      composer.current?.render(delta);
    },
    1,
  );

  return null;
}

export function HeroScene({ className }: { className?: string }) {
  return (
    <div className={className}>
      <Canvas
        camera={{ position: [0, 0, 4.5], fov: 40 }}
        dpr={[1, 2]}
        gl={{ antialias: true, alpha: true }}
      >
        <CatModel />
        <Glow />
      </Canvas>
    </div>
  );
}
