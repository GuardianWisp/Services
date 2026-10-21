// TETSAB Lab — Three.js WebGPU scene written in TSL, so the same node graph
// compiles to WGSL on WebGPU and to GLSL on the automatic WebGL2 fallback.
//
// Scene layout (camera at z=4.2, looking down -z, vertical FOV ≈ 31.9°):
//   background  — domain-warped gradient field + 12-column hairline grid +
//                 the TETSAB wordmark texture (scene.backgroundNode)
//   particles   — GPU compute swarm (instancedArray + compute shader)
//   iris        — a bounding box whose fragment shader raymarches an SDF that
//                 morphs between eight shapes; refracts the frame behind it
//   wave        — full-screen quad for the liquid case-transition

import * as THREE from "three/webgpu";
import {
  Fn, float, vec2, vec3, vec4, uniform, Loop, Break, If, Discard, select, varying,
  positionLocal, positionGeometry, modelWorldMatrix, modelWorldMatrixInverse, cameraPosition,
  screenUV, screenCoordinate, viewportSharedTexture, viewportTexture, texture, uv,
  instancedArray, instanceIndex, hash,
  mix, smoothstep, step, length, normalize, dot, abs, max, min, clamp, sin, cos, acos, exp, pow,
  sqrt, floor, fract, atan, refract, reflect,
} from "three/tsl";

const VOID = vec3(0.027, 0.027, 0.031);
const NILE = vec3(0.118, 0.227, 0.227);
const ROSE = vec3(0.91, 0.64, 0.68);
const TAP = vec3(1.0, 0.706, 0.353);
const BONE = vec3(0.93, 0.91, 0.89);

export async function createEngine(canvas, { forceWebGL = false } = {}) {
  const renderer = new THREE.WebGPURenderer({ canvas, antialias: false, forceWebGL, powerPreference: "high-performance" });
  await renderer.init();
  renderer.outputColorSpace = THREE.LinearSRGBColorSpace;
  const isWebGPU = Boolean(renderer.backend && renderer.backend.isWebGPUBackend);

  const scene = new THREE.Scene();
  const camera = new THREE.PerspectiveCamera((2 * Math.atan(0.5 / 1.75) * 180) / Math.PI, 1, 0.1, 50);
  camera.position.set(0, 0, 4.2);

  /* ---------------- uniforms ---------------- */
  const U = {
    time: uniform(0),
    dt: uniform(0.016),
    res: uniform(new THREE.Vector2(1, 1)),
    mouse: uniform(new THREE.Vector2()),
    mVel: uniform(0),
    wA: uniform(new THREE.Vector4(1, 0, 0, 0)), // mono, mirror, bloom, swarm
    wB: uniform(new THREE.Vector4(0, 0, 0, 0)), // membrane, lens, coil, signal
    textY: uniform(0),
    textA: uniform(0),
    pupil: uniform(0.08),
    pupilX: uniform(0),
    glow: uniform(0),
    warm: uniform(1),
    seed: uniform(0),
    gold: uniform(0),
    pulse: uniform(0),
    liquid: uniform(1),
    wave: uniform(new THREE.Vector4(0, 0, 0, 1)),
    waveCol: uniform(new THREE.Color(1, 0.7, 0.35)),
    obj: uniform(new THREE.Vector3(0, 0, 1)), // world centre (x, y) + scale
    pw: uniform(new THREE.Vector4(1, 0, 0, 0)), // particle targets: halo, bloom, swarm, membrane
    pSig: uniform(0), // particle target: signal rings
    pAlpha: uniform(0),
  };

  const textTex = new THREE.CanvasTexture(document.createElement("canvas"));
  textTex.flipY = false;
  textTex.colorSpace = THREE.NoColorSpace;
  textTex.minFilter = THREE.LinearFilter;
  textTex.generateMipmaps = false;

  /* ---------------- helpers ---------------- */
  const h21 = Fn(([p0]) => {
    const p = fract(p0.mul(vec2(123.34, 456.21))).toVar();
    p.addAssign(dot(p, p.add(45.32)));
    return fract(p.x.mul(p.y));
  }, { p0: "vec2", return: "float" });

  const n2 = Fn(([p]) => {
    const i = floor(p);
    const f = fract(p);
    const u = f.mul(f).mul(float(3).sub(f.mul(2)));
    const a = h21(i);
    const b = h21(i.add(vec2(1, 0)));
    const c = h21(i.add(vec2(0, 1)));
    const d = h21(i.add(vec2(1, 1)));
    return mix(mix(a, b, u.x), mix(c, d, u.x), u.y);
  }, { p: "vec2", return: "float" });

  const fbm = Fn(([p0]) => {
    const p = vec2(p0).toVar();
    const v = float(0).toVar();
    const a = float(0.5).toVar();
    Loop(4, () => {
      v.addAssign(a.mul(n2(p)));
      p.assign(p.mul(2.03).add(vec2(1.7, 9.2)));
      a.mulAssign(0.5);
    });
    return v;
  }, { p0: "vec2", return: "float" });

  const rot = Fn(([v, a]) => {
    const c = cos(a);
    const s = sin(a);
    return vec2(v.x.mul(c).sub(v.y.mul(s)), v.x.mul(s).add(v.y.mul(c)));
  }, { v: "vec2", a: "float", return: "vec2" });

  const smin = Fn(([a, b, k]) => {
    const h = clamp(float(0.5).add(float(0.5).mul(b.sub(a)).div(k)), 0, 1);
    return mix(b, a, h).sub(k.mul(h).mul(float(1).sub(h)));
  }, { a: "float", b: "float", k: "float", return: "float" });

  const sdRB = Fn(([p, b, r]) => {
    const q = abs(p).sub(b).add(r);
    return length(max(q, vec3(0))).add(min(max(q.x, max(q.y, q.z)), 0)).sub(r);
  }, { p: "vec3", b: "vec3", r: "float", return: "float" });

  const sdEl = Fn(([p, r]) => {
    const k0 = length(p.div(r));
    const k1 = length(p.div(r.mul(r)));
    return k0.mul(k0.sub(1)).div(k1);
  }, { p: "vec3", r: "vec3", return: "float" });

  // Petal count shared by the SDF bloom and the particle bloom: 5, 6 or 7.
  const petals = () => {
    const f = floor(U.seed.mul(7));
    return float(5).add(f.sub(float(3).mul(floor(f.div(3)))));
  };

  /* ---------------- the nine lives (eight shapes) ---------------- */
  const gMono = Fn(([p]) => {
    const tp = float(1).sub(p.y.mul(0.1));
    return sdRB(vec3(p.x.div(tp), p.y, p.z.div(tp)), vec3(0.46, 1.08, 0.3), float(0.26)).mul(tp);
  }, { p: "vec3", return: "float" });

  const gMirror = Fn(([p]) => sdRB(vec3(p.x, abs(p.y).sub(0.62), p.z), vec3(0.44, 0.44, 0.28), float(0.25)),
    { p: "vec3", return: "float" });

  const gBloom = Fn(([p]) => {
    const qxy = rot(p.xy, U.time.mul(0.12).add(U.seed.mul(2)));
    const q = vec3(qxy, p.z);
    const sec = float(6.2831853).div(petals());
    const a = atan(q.y, q.x).add(sec.mul(0.5));
    const af = a.sub(sec.mul(floor(a.div(sec)))).sub(sec.mul(0.5));
    const r = length(q.xy);
    const pp0 = vec3(cos(af).mul(r).sub(0.6), sin(af).mul(r), q.z);
    const pxz = rot(vec2(pp0.x, pp0.z), sin(U.time.mul(0.5).add(U.seed.mul(6))).mul(0.45));
    return smin(sdEl(vec3(pxz.x, pp0.y, pxz.y), vec3(0.52, 0.19, 0.09)), length(q).sub(0.3), float(0.2));
  }, { p: "vec3", return: "float" });

  const agent = (fi) => {
    const t = U.time.mul(fi.mul(0.045).add(0.3)).add(fi.mul(2.4));
    return vec3(cos(t).mul(sin(fi.mul(1.3)).mul(0.14).add(0.72)), sin(t.mul(1.3).add(fi)).mul(0.8), sin(t).mul(0.5));
  };

  const gSwarm = Fn(([p]) => {
    const d = length(p).sub(0.3).toVar();
    Loop(9, ({ i }) => {
      const fi = float(i);
      d.assign(smin(d, length(p.sub(agent(fi))).sub(fract(fi.mul(0.618)).mul(0.05).add(0.12)), float(0.2)));
    });
    return d;
  }, { p: "vec3", return: "float" });

  const gMemb = Fn(([p]) => {
    const s = length(p).sub(0.92);
    const g = sin(p.x.mul(5).add(U.time.mul(0.7))).mul(sin(p.y.mul(5).add(U.time.mul(0.5)))).mul(sin(p.z.mul(5).sub(U.time.mul(0.3))))
      .add(sin(p.x.mul(9).sub(U.time)).mul(sin(p.y.mul(8).add(U.time.mul(0.6)))).mul(0.5));
    return s.add(g.mul(U.mVel.mul(0.06).add(0.06))).mul(0.62);
  }, { p: "vec3", return: "float" });

  // Biconvex lens: intersection of two large spheres (radius ≈ 1.1, 0.3 thick).
  const gLens = Fn(([p]) => max(length(p.sub(vec3(0, 0, 3.96))).sub(4.11), length(p.add(vec3(0, 0, 3.96))).sub(4.11)).sub(0.02),
    { p: "vec3", return: "float" });

  const gCoil = Fn(([p]) => {
    const yz = rot(vec2(p.y, p.z), float(1.1));
    const xz = rot(vec2(p.x, yz.y), U.time.mul(0.18));
    const q = vec3(xz.x, yz.x, xz.y);
    const a = atan(q.z, q.x);
    const t = vec2(length(q.xz).sub(0.72), q.y.add(sin(a.mul(2).add(U.time)).mul(0.08)));
    return length(t).sub(cos(a).mul(0.07).add(0.22)).mul(0.9);
  }, { p: "vec3", return: "float" });

  const gSig = Fn(([p]) => length(p).sub(float(0.7).add(sin(U.time.mul(7)).mul(0.06).mul(U.pulse)).add(sin(U.time.mul(1.7)).mul(0.015))),
    { p: "vec3", return: "float" });

  const map = Fn(([p]) => {
    const d = float(0).toVar();
    If(U.wA.x.greaterThan(0.002), () => { d.addAssign(U.wA.x.mul(gMono(p))); });
    If(U.wA.y.greaterThan(0.002), () => { d.addAssign(U.wA.y.mul(gMirror(p))); });
    If(U.wA.z.greaterThan(0.002), () => { d.addAssign(U.wA.z.mul(gBloom(p))); });
    If(U.wA.w.greaterThan(0.002), () => { d.addAssign(U.wA.w.mul(gSwarm(p))); });
    If(U.wB.x.greaterThan(0.002), () => { d.addAssign(U.wB.x.mul(gMemb(p))); });
    If(U.wB.y.greaterThan(0.002), () => { d.addAssign(U.wB.y.mul(gLens(p))); });
    If(U.wB.z.greaterThan(0.002), () => { d.addAssign(U.wB.z.mul(gCoil(p))); });
    If(U.wB.w.greaterThan(0.002), () => { d.addAssign(U.wB.w.mul(gSig(p))); });
    const liquid = U.liquid.mul(U.mVel.mul(0.035).add(0.012))
      .mul(sin(p.x.mul(4).add(U.time.mul(1.3)))).mul(sin(p.y.mul(3.5).sub(U.time))).mul(sin(p.z.mul(4).add(U.time.mul(0.8))));
    return d.add(liquid);
  }, { p: "vec3", return: "float" });

  const nrm = Fn(([p]) => {
    const e = 0.0015;
    const k1 = vec3(1, -1, -1);
    const k2 = vec3(-1, -1, 1);
    const k3 = vec3(-1, 1, -1);
    const k4 = vec3(1, 1, 1);
    return normalize(
      k1.mul(map(p.add(k1.mul(e))))
        .add(k2.mul(map(p.add(k2.mul(e)))))
        .add(k3.mul(map(p.add(k3.mul(e)))))
        .add(k4.mul(map(p.add(k4.mul(e))))),
    );
  }, { p: "vec3", return: "vec3" });

  /* ---------------- background ---------------- */
  const field = Fn(([s]) => {
    const asp = U.res.x.div(U.res.y);
    const p = vec2(s.x.sub(0.5).mul(asp), float(0.5).sub(s.y));
    const t = U.time.mul(0.035);
    const q = vec2(fbm(p.mul(1.3).add(t)), fbm(p.mul(1.3).add(vec2(5.2, 1.3)).sub(t)));
    const f = fbm(p.mul(1.1).add(q.mul(1.7)).add(vec2(t.mul(0.7), t.negate())));
    const c = mix(VOID, NILE.mul(0.75), smoothstep(0.35, 0.95, f).mul(0.9)).toVar();
    c.addAssign(ROSE.mul(0.16).mul(U.warm).mul(smoothstep(0.5, 1, q.x.add(f.mul(0.45)))).mul(smoothstep(-0.6, 0.3, p.y)));
    c.addAssign(TAP.mul(0.05).mul(U.warm).mul(smoothstep(0.55, 1, q.y.mul(f).mul(1.9))));
    c.mulAssign(float(1).sub(dot(p.mul(0.9), p.mul(0.9)).mul(0.45)));
    const cx = fract(s.x.mul(12));
    const dpx = min(cx, float(1).sub(cx)).mul(U.res.x).div(12);
    c.addAssign(BONE.mul(0.028).mul(float(1).sub(smoothstep(0, 1.2, dpx))));
    return c;
  }, { s: "vec2", return: "vec3" });

  scene.backgroundNode = Fn(() => {
    const s = screenUV;
    const tu = vec2(s.x, s.y.add(U.textY));
    const inside = step(0, tu.y).mul(step(tu.y, 1));
    const tx = texture(textTex, clamp(tu, 0, 1)).r.mul(U.textA).mul(inside);
    const c = mix(field(s), BONE, tx);
    const grain = h21(screenCoordinate.xy.add(fract(U.time).mul(100))).sub(0.5).mul(0.03);
    return c.add(grain);
  })();

  /* ---------------- iris (raymarched glass) ---------------- */
  const irisColor = Fn(() => {
    const ro = modelWorldMatrixInverse.mul(vec4(cameraPosition, 1)).xyz;
    const rd = normalize(positionLocal.sub(ro));
    const p = positionLocal.toVar();
    const hit = float(0).toVar();
    Loop(96, () => {
      const d = map(p);
      If(d.lessThan(0.0012), () => { hit.assign(1); Break(); });
      p.addAssign(rd.mul(d.mul(0.85)));
      If(max(abs(p.x), max(abs(p.y), abs(p.z))).greaterThan(1.57), () => { Break(); });
    });
    Discard(hit.lessThan(0.5));

    const nL = nrm(p);
    const n = normalize(modelWorldMatrix.mul(vec4(nL, 0)).xyz);
    const pW = modelWorldMatrix.mul(vec4(p, 1)).xyz;
    const rdW = normalize(pW.sub(cameraPosition));
    const L = vec3(U.mouse.mul(2.4), 2.3);
    const hv = normalize(normalize(L.sub(pW)).sub(rdW));
    const ndh = max(dot(n, hv), 0);
    const spec = pow(ndh, 110).mul(1.6).add(pow(ndh, 14).mul(0.1));
    const fres = pow(float(1).sub(max(dot(n, rdW.negate()), 0)), 3);

    // Screen-space refraction of whatever is already in the frame (background,
    // wordmark, particles) with a small per-channel spread for dispersion.
    const rr = refract(rdW, n, float(1 / 1.45));
    const o = rr.xy.sub(rdW.xy).mul(0.34);
    const off = vec2(o.x.mul(U.res.y.div(U.res.x)), o.y.negate());
    const r = viewportSharedTexture(screenUV.add(off.mul(0.88)), float(0)).r;
    const g0 = viewportSharedTexture(screenUV.add(off), float(0)).g;
    const b = viewportSharedTexture(screenUV.add(off.mul(1.12)), float(0)).b;
    const refr = vec3(r, g0, b).mul(1.12).add(vec3(0.012, 0.01, 0.016));

    const rf = reflect(rdW, n);
    const env = mix(VOID.mul(2), vec3(0.16, 0.15, 0.17), smoothstep(-0.4, 0.9, rf.y)).toVar();
    env.addAssign(BONE.mul(0.55).mul(smoothstep(0.93, 0.995, dot(rf, normalize(vec3(-0.5, 0.55, 0.65))))));
    env.addAssign(ROSE.mul(0.4).mul(U.warm).mul(smoothstep(0.2, 1, rf.x)).mul(smoothstep(-0.2, 0.6, rf.y)));

    const col = mix(refr.mul(vec3(0.9, 0.9, 0.96)), env, fres.mul(0.8).add(0.1)).toVar();
    col.addAssign(mix(BONE, ROSE, 0.25).mul(spec));
    col.addAssign(ROSE.mul(fres).mul(0.18).mul(U.warm));

    // The pupil: a vertical slit on the object's axis, seen through the glass.
    // Glow is the tapetum lucidum catching the cursor's light.
    const dO = refract(rd, nL, float(1 / 1.45));
    const o2 = vec2(p.x.sub(U.pupilX), p.z);
    const l2 = length(dO.xz).add(1e-4);
    const d2 = dO.xz.div(l2);
    const sa = dot(o2, d2).negate();
    const dist = select(sa.greaterThan(0), abs(o2.x.mul(d2.y).sub(o2.y.mul(d2.x))), length(o2));
    const yc = p.y.add(dO.y.mul(max(sa, 0)).div(l2));
    const vf = float(1).sub(smoothstep(0.15, 0.95, abs(yc)));
    const slit = exp(dist.negate().div(U.pupil.add(0.003))).mul(vf);
    const gc = mix(mix(TAP, ROSE, sin(U.time.mul(0.7)).mul(0.2).add(0.3)), vec3(1, 0.82, 0.4), U.gold);
    col.addAssign(gc.mul(slit.mul(1.35).add(sqrt(slit).mul(0.12))).mul(U.glow));
    col.assign(mix(col, col.mul(vec3(1.08, 0.95, 0.7)).add(vec3(0.03, 0.02, 0)), U.gold.mul(0.6)));
    return vec4(col, 1);
  });

  const irisMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthWrite: false });
  irisMat.colorNode = irisColor();
  const iris = new THREE.Mesh(new THREE.BoxGeometry(3.14, 3.14, 3.14), irisMat);
  iris.rotation.order = "YXZ";
  iris.renderOrder = 2;
  scene.add(iris);

  /* ---------------- particles (GPU compute) ---------------- */
  const COUNT = isWebGPU ? 32768 : 8192;
  let particles = null;
  try {
    const pos = instancedArray(COUNT, "vec3");
    const vel = instancedArray(COUNT, "vec3");
    const rnd = (k) => hash(instanceIndex.add(k));

    const init = Fn(() => {
      const th = rnd(0).mul(6.2831853);
      const ph = acos(rnd(7919).mul(2).sub(1));
      const r = rnd(15485).mul(2.5).add(1.5);
      pos.element(instanceIndex).assign(vec3(sin(ph).mul(cos(th)), cos(ph), sin(ph).mul(sin(th))).mul(r));
      vel.element(instanceIndex).assign(vec3(0));
    })().compute(COUNT);

    const update = Fn(() => {
      const P = pos.element(instanceIndex);
      const V = vel.element(instanceIndex);
      const h1 = rnd(0), h2 = rnd(7919), h3 = rnd(15485), h4 = rnd(31337);
      const t = U.time;

      // halo: a slowly turning shell around the object
      const th = h1.mul(6.2831853).add(t.mul(h4.mul(0.12).add(0.04)));
      const ph = acos(h2.mul(2).sub(1));
      const dirv = vec3(sin(ph).mul(cos(th)), cos(ph).mul(0.8), sin(ph).mul(sin(th)));
      const halo = dirv.mul(h3.mul(h3).mul(0.55).add(1.02));

      // bloom: rose curve with the same petal count as the SDF
      const bt = h1.mul(6.2831853).add(t.mul(0.12)).add(U.seed.mul(2));
      const br = abs(cos(bt.mul(petals()).mul(0.5))).mul(h3.mul(0.7).add(0.75)).add(0.2);
      const bloom = vec3(cos(bt).mul(br), sin(bt).mul(br), h4.sub(0.5).mul(0.3));

      // swarm: particles orbit the nine agents; a quarter of them stream from
      // one agent to the next — tasks being handed over
      const ai = floor(h1.mul(9));
      const ca = agent(ai);
      const cb = agent(ai.add(1).sub(float(9).mul(floor(ai.add(1).div(9)))));
      const u = fract(t.mul(0.35).add(h3));
      const orbit = ca.add(vec3(cos(h4.mul(40).add(t.mul(2))), sin(h2.mul(40).add(t.mul(1.7))), cos(h3.mul(40).sub(t))).mul(h3.mul(0.18).add(0.2)));
      const stream = mix(ca, cb, u).add(vec3(sin(h4.mul(60)), cos(h2.mul(60)), 0).mul(0.03));
      const swarm = select(h2.lessThan(0.25), stream, orbit);

      // membrane: a rippling sphere
      const nd = normalize(dirv);
      const memb = nd.mul(float(1.08).add(sin(nd.x.mul(6).add(t)).mul(sin(nd.y.mul(6).sub(t.mul(0.8)))).mul(0.07)));

      // signal: rings radiating outwards
      const rr = fract(t.mul(0.35).add(h3)).mul(2.6).add(0.75);
      const sig = vec3(cos(th).mul(rr), sin(th).mul(rr), h4.sub(0.5).mul(0.1));

      const local = halo.mul(U.pw.x).add(bloom.mul(U.pw.y)).add(swarm.mul(U.pw.z)).add(memb.mul(U.pw.w)).add(sig.mul(U.pSig));
      const target = vec3(U.obj.x, U.obj.y, 0).add(local.mul(U.obj.z));

      const acc = target.sub(P).mul(7).toVar();
      acc.addAssign(vec3(
        sin(P.y.mul(3).add(t).add(h1.mul(6))),
        sin(P.z.mul(3).add(t.mul(1.1)).add(h2.mul(6))),
        sin(P.x.mul(3).add(t.mul(0.9)).add(h3.mul(6))),
      ).mul(0.35));
      const dm = P.sub(vec3(U.mouse.mul(2.4), 0));
      const dl = length(dm).add(1e-4);
      acc.addAssign(dm.div(dl).mul(float(1).sub(smoothstep(0, 0.7, dl))).mul(U.mVel.mul(14).add(4)));
      V.assign(V.add(acc.mul(U.dt)).mul(exp(U.dt.mul(-3.4))));
      P.addAssign(V.mul(U.dt));
    })().compute(COUNT);

    const pm = new THREE.SpriteNodeMaterial({ transparent: true, depthWrite: false, blending: THREE.AdditiveBlending });
    pm.positionNode = pos.toAttribute();
    const hv = varying(hash(instanceIndex.add(555)));
    pm.scaleNode = hash(instanceIndex.add(911)).mul(0.008).add(0.004);
    const circle = float(1).sub(smoothstep(0.15, 0.5, length(uv().sub(0.5))));
    pm.colorNode = vec4(mix(ROSE, TAP, step(0.72, hv)), 1);
    pm.opacityNode = circle.mul(U.pAlpha).mul(hv.mul(0.5).add(0.15));
    const sprite = new THREE.Sprite(pm);
    sprite.count = COUNT;
    sprite.frustumCulled = false;
    sprite.renderOrder = 1;
    scene.add(sprite);
    await renderer.computeAsync(init);
    particles = { update, sprite, material: pm };
  } catch (err) {
    console.warn("[lab] GPU particles disabled:", err);
  }

  /* ---------------- liquid transition ---------------- */
  const waveMat = new THREE.MeshBasicNodeMaterial({ transparent: true, depthTest: false, depthWrite: false });
  waveMat.vertexNode = vec4(positionGeometry.xy, 0, 1);
  waveMat.colorNode = Fn(() => {
    const s = screenUV;
    const asp = U.res.x.div(U.res.y);
    const p = vec2(s.x.sub(0.5).mul(asp), float(0.5).sub(s.y));
    const c = U.wave.xy;
    const R = U.wave.z.mul(U.wave.w);
    const d = length(p.sub(c)).add(n2(p.mul(7).add(U.time.mul(0.8))).sub(0.5).mul(0.035));
    const ring = exp(abs(d.sub(R)).mul(-16)).mul(float(1).sub(U.wave.z.mul(0.6)));
    const dir = normalize(p.sub(c).add(1e-5));
    const base = viewportTexture(s.add(vec2(dir.x.div(asp), dir.y.negate()).mul(ring).mul(0.035))).rgb;
    const inside = float(1).sub(smoothstep(R.sub(0.02), R.add(0.004), d));
    const gg = fbm(p.mul(2.2).add(U.time.mul(0.05)));
    const fill = mix(U.waveCol.mul(0.1), U.waveCol.mul(0.42), smoothstep(-0.7, 0.8, p.y.add(gg.mul(0.6))));
    return vec4(mix(base, fill, inside).add(ROSE.mul(ring).mul(0.25)), 1);
  })();
  const wave = new THREE.Mesh(new THREE.PlaneGeometry(2, 2), waveMat);
  wave.frustumCulled = false;
  wave.renderOrder = 10;
  wave.visible = false;
  scene.add(wave);

  /* ---------------- API ---------------- */
  const size = new THREE.Vector2();
  function setSize(w, h, pixelRatio) {
    renderer.setPixelRatio(pixelRatio);
    renderer.setSize(w, h, false);
    camera.aspect = w / h;
    camera.updateProjectionMatrix();
    renderer.getDrawingBufferSize(size);
    U.res.value.copy(size);
  }

  function setText(source) {
    const prev = textTex.image;
    if (prev && (prev.width !== source.width || prev.height !== source.height)) textTex.dispose();
    textTex.image = source;
    textTex.needsUpdate = true;
  }

  function frame(s) {
    U.time.value = s.t;
    U.dt.value = Math.min(s.dt, 1 / 30);
    U.mouse.value.set(s.mu[0], s.mu[1]);
    U.mVel.value = Math.min(1, s.mVel / 2.2);
    U.wA.value.set(s.w[0], s.w[1], s.w[2], s.w[3]);
    U.wB.value.set(s.w[4], s.w[5], s.w[6], s.w[7]);
    U.textY.value = s.textY;
    U.textA.value = s.textA;
    U.pupil.value = s.pupil;
    U.pupilX.value = s.pupilX;
    U.glow.value = s.glow;
    U.warm.value = s.warm;
    U.seed.value = s.seed;
    U.gold.value = s.gold;
    U.pulse.value = s.pulse;
    U.liquid.value = s.liquid;
    U.wave.value.set(s.wave.x, s.wave.y, s.wave.p, s.wave.maxR);
    U.waveCol.value.setRGB(s.wc.r, s.wc.g, s.wc.b);
    U.obj.value.set(s.obj.x * 2.4, s.obj.y * 2.4, s.obj.s);
    U.pw.value.set(s.pw[0], s.pw[1], s.pw[2], s.pw[3]);
    U.pSig.value = s.pw[4];
    U.pAlpha.value = s.pAlpha;

    iris.position.set(s.obj.x * 2.4, s.obj.y * 2.4, 0);
    iris.scale.setScalar(Math.max(0.001, s.obj.s));
    iris.rotation.set(s.pitch, s.yaw, 0);
    wave.visible = s.wave.p > 0.001;

    if (particles) {
      particles.sprite.visible = s.pAlpha > 0.002;
      renderer.compute(particles.update);
    }
    renderer.render(scene, camera);
  }

  function dispose() {
    iris.geometry.dispose();
    irisMat.dispose();
    wave.geometry.dispose();
    waveMat.dispose();
    if (particles) particles.material.dispose();
    textTex.dispose();
    renderer.dispose();
  }

  return { isWebGPU, particleCount: particles ? COUNT : 0, setSize, setText, frame, dispose };
}
