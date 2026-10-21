// Imperative runtime for /lab: scroll storytelling, loader, cursor + whiskers,
// adaptive profile, sound, case overlay, AI offer — and the per-frame state
// that drives the WebGPU scene in ./engine.js.

import gsap from "gsap";
import Lenis from "lenis";
import { createEngine } from "./engine";
import { Sound } from "./sound";
import { drawArt, dullArt } from "./art";
import { CASES, LIFE_GEO, LIFE_NAMES, LIFE_PARTICLES, SERVICES } from "../data";

type Engine = Awaited<ReturnType<typeof createEngine>>;
type Offer = Partial<Record<"title" | "sum" | "app" | "st" | "dir" | "kase", string>>;
type Profile = "reading" | "hunter" | "observer" | "player" | "still";

const clamp = (v: number, a = 0, b = 1) => Math.min(b, Math.max(a, v));
const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
const damp = (a: number, b: number, l: number, dt: number) => lerp(a, b, 1 - Math.exp(-l * dt));
const smooth = (e0: number, e1: number, x: number) => {
  const t = clamp((x - e0) / (e1 - e0));
  return t * t * (3 - 2 * t);
};
const wait = (ms: number) => new Promise((r) => setTimeout(r, ms));

const PROFILES: Record<Profile, { warm: number; speed: number }> = {
  reading: { warm: 1, speed: 1 },
  hunter: { warm: 0.55, speed: 1.25 },
  observer: { warm: 1.3, speed: 0.82 },
  player: { warm: 1.05, speed: 1.1 },
  still: { warm: 1, speed: 0.5 },
};

export function startLab(root: HTMLElement): () => void {
  const $ = <T extends Element = HTMLElement>(s: string) => root.querySelector(s) as T;
  const $$ = <T extends Element = HTMLElement>(s: string, r: ParentNode = root) => [...r.querySelectorAll(s)] as T[];
  const ac = new AbortController();
  const on = <K extends keyof WindowEventMap>(t: K, fn: (e: WindowEventMap[K]) => void, o: AddEventListenerOptions = {}) =>
    window.addEventListener(t, fn, { ...o, signal: ac.signal });
  let disposed = false;

  const RM = matchMedia("(prefers-reduced-motion: reduce)").matches;
  const FINE = matchMedia("(pointer: fine)").matches;
  const night = (() => {
    const h = new Date().getHours();
    return h >= 21 || h < 6;
  })();

  const S = {
    t: 0, dt: 0.016, W: innerWidth, H: innerHeight,
    mx: innerWidth / 2, my: innerHeight * 0.42, mu: [0, 0] as [number, number], mVel: 0, lastMove: performance.now(), touched: 0,
    life: 1, sec: "hero", hoverSvc: null as number | null,
    w: [1, 0, 0, 0, 0, 0, 0, 0],
    pw: [1, 0, 0, 0, 0], pAlpha: 0,
    obj: { x: 0, y: -1.1, s: 0.78 },
    yaw: 0, pitch: 0, dragYaw: 0, dragging: false, dragMoved: 0, dragX: 0,
    pupil: 0.08, pupilX: 0, glow: 0, warm: 1, warmT: 1, gold: 0, pulse: 0, seed: 0, poke: 0, sleep: 0, liquid: RM ? 0 : 1,
    textY: 0, textA: 0, awake: false, loaded: false, loadTarget: 0, loadShown: 0, loadStart: performance.now(),
    wave: { x: 0, y: 0, p: 0, maxR: 1 }, wc: { r: 1, g: 0.7, b: 0.35 },
    speed: 1, vel: 0, lastY: scrollY, kw: 300,
    profile: "reading" as Profile, manual: null as Profile | null,
  };

  const sound = new Sound();
  let engine: Engine | null = null;
  let rs = 1;

  /* ---------------- smooth scroll ---------------- */
  const lenis = RM ? null : new Lenis({ lerp: 0.085, smoothWheel: true });
  lenis?.stop();
  const scrollToY = (y: number, duration = 1.6) => {
    if (lenis) lenis.scrollTo(y, { duration });
    else scrollTo({ top: y, behavior: RM ? "auto" : "smooth" });
  };
  const scrollToEl = (el: Element | null) => {
    if (el) scrollToY(el.getBoundingClientRect().top + scrollY);
  };
  $$<HTMLAnchorElement>("[data-nav]").forEach((a) =>
    a.addEventListener("click", (e) => {
      e.preventDefault();
      scrollToEl(root.querySelector("#" + a.dataset.nav));
    }, { signal: ac.signal }),
  );

  /* ---------------- toast ---------------- */
  let toastT: ReturnType<typeof setTimeout> | undefined;
  const toast = (msg: string) => {
    const t = $(".toast");
    t.textContent = msg;
    t.classList.add("show");
    clearTimeout(toastT);
    toastT = setTimeout(() => t.classList.remove("show"), 2400);
  };

  /* ---------------- renderer ---------------- */
  const cv = $<HTMLCanvasElement>(".tlab-gl");
  const setLd = (k: string, txt: string) => {
    const e = root.querySelector(`[data-ld="${k}"]`);
    if (!e) return;
    e.textContent = txt;
    e.classList.add("ok");
  };
  const pixelRatio = () => Math.min(devicePixelRatio || 1, 1.5) * rs;

  function drawText() {
    if (!engine) return;
    const k = Math.min(1.5, 2048 / Math.max(S.W, S.H));
    const c = document.createElement("canvas");
    c.width = Math.round(S.W * k);
    c.height = Math.round(S.H * k);
    const ctx = c.getContext("2d")!;
    const fam = getComputedStyle(root).getPropertyValue("--font-unbounded").trim() || '"Arial Black"';
    ctx.fillStyle = "#000";
    ctx.fillRect(0, 0, c.width, c.height);
    ctx.fillStyle = "#f00";
    ctx.textAlign = "center";
    ctx.textBaseline = "middle";
    const setFont = (fs: number) => {
      ctx.font = `800 ${fs}px ${fam}, "Arial Black", sans-serif`;
      if ("letterSpacing" in ctx) (ctx as CanvasRenderingContext2D & { letterSpacing: string }).letterSpacing = `${-0.04 * fs}px`;
    };
    setFont(100);
    const fs = (100 * c.width * (S.W < 760 ? 0.94 : 0.88)) / ctx.measureText("TETSAB").width;
    setFont(fs);
    ctx.fillText("TETSAB", c.width / 2, c.height * (S.W < 760 ? 0.44 : 0.5));
    engine.setText(c);
  }

  function resize() {
    S.W = innerWidth;
    S.H = innerHeight;
    engine?.setSize(S.W, S.H, pixelRatio());
    const d2 = Math.min(devicePixelRatio || 1, 2);
    wh.width = S.W * d2;
    wh.height = S.H * d2;
    whc.setTransform(d2, 0, 0, d2, 0, 0);
  }

  const wh = $<HTMLCanvasElement>(".tlab-wh");
  const whc = wh.getContext("2d")!;
  let rzT: ReturnType<typeof setTimeout> | undefined;
  resize();
  on("resize", () => {
    resize();
    clearTimeout(rzT);
    rzT = setTimeout(drawText, 150);
  });

  const fontsReady = Promise.race([
    Promise.all([document.fonts.load(`800 100px ${getComputedStyle(root).getPropertyValue("--font-unbounded").trim()}`), document.fonts.ready]),
    wait(3500),
  ]).then(() => {
    setLd("fonts", "loaded");
    S.loadTarget += 30;
  });

  const forceWebGL = new URLSearchParams(location.search).get("renderer") === "webgl";
  const t0 = performance.now();
  createEngine(cv, { forceWebGL })
    .then(async (e) => {
      if (disposed) {
        e.dispose();
        return;
      }
      engine = e;
      setLd("renderer", e.isWebGPU ? "WebGPU" : "WebGL2 fallback");
      S.loadTarget += 25;
      resize();
      setLd("particles", e.particleCount ? `${(e.particleCount / 1024).toFixed(0)}k · compute` : "off");
      S.loadTarget += 15;
      await fontsReady;
      drawText();
      // First frame compiles every pipeline; measure it honestly.
      e.frame({ ...S, textY: 0 });
      setLd("shader", `compiled · ${Math.round(performance.now() - t0)} ms`);
      S.loadTarget += 30;
    })
    .catch((err) => {
      console.warn("[lab] renderer unavailable, CSS fallback:", err);
      root.classList.add("no-gl");
      setLd("renderer", "CSS fallback");
      setLd("shader", "skipped");
      setLd("particles", "off");
      S.loadTarget += 70;
    });

  /* ---------------- services ---------------- */
  const svcItems = $$(".svc-item");
  const svcDetail = $(".svc-detail");
  svcItems.forEach((li, i) => {
    const b = li.querySelector("button")!;
    b.addEventListener("pointerenter", () => { if (FINE) S.hoverSvc = i; }, { signal: ac.signal });
    b.addEventListener("focus", () => { S.hoverSvc = i; }, { signal: ac.signal });
    b.addEventListener("blur", () => { S.hoverSvc = null; }, { signal: ac.signal });
    b.addEventListener("click", () => {
      const r = $("#services").getBoundingClientRect();
      scrollToY(r.top + scrollY + (r.height - S.H) * ((i + 0.5) / 3), 1.2);
    }, { signal: ac.signal });
  });
  $(".svc-list").addEventListener("pointerleave", () => { S.hoverSvc = null; }, { signal: ac.signal });

  let shownSvc = -1;
  function renderSvc(i: number) {
    if (i === shownSvc) return;
    shownSvc = i;
    svcItems.forEach((li, k) => li.classList.toggle("active", k === i));
    const s = SERVICES[i];
    const fill = () => {
      svcDetail.replaceChildren();
      const p = (cls: string, txt: string) => {
        const e = document.createElement("p");
        e.className = cls;
        e.textContent = txt;
        svcDetail.appendChild(e);
      };
      p("svc-text", s.text);
      p("more", s.more);
      p("mono tldr", s.tldr);
      const tags = document.createElement("div");
      tags.className = "tags";
      s.tags.forEach((t) => {
        const e = document.createElement("span");
        e.className = "mono tag";
        e.textContent = t;
        tags.appendChild(e);
      });
      svcDetail.appendChild(tags);
      p("mono svc-hint", "◐ " + s.hint);
      const a = document.createElement("button");
      a.type = "button";
      a.className = "linkbtn mono";
      a.dataset.w = "";
      a.textContent = "Собрать офер под эту задачу →";
      a.addEventListener("click", () => {
        brief.value = s.brief;
        scrollToEl($("#contact"));
        setTimeout(() => brief.focus({ preventScroll: true }), 1400);
      });
      svcDetail.appendChild(a);
      refreshWhiskerTargets();
    };
    if (RM) fill();
    else
      gsap.to(svcDetail, {
        opacity: 0, y: 6, duration: 0.18,
        onComplete() {
          fill();
          gsap.to(svcDetail, { opacity: 1, y: 0, duration: 0.45, ease: "power2.out" });
        },
      });
  }

  /* ---------------- works + case overlay ---------------- */
  const track = $(".track");
  const cards = $$<HTMLButtonElement>(".card");
  cards.forEach((b, i) => {
    drawArt(b.querySelector("canvas")!.getContext("2d")!, 480, 600, i);
    b.addEventListener("click", (e) => {
      const r = b.getBoundingClientRect();
      const kb = e.detail === 0;
      openCase(i, kb ? r.left + r.width / 2 : e.clientX, kb ? r.top + r.height / 2 : e.clientY, b);
    }, { signal: ac.signal });
  });

  const caseEl = $(".case");
  const app = $(".app");
  let caseIdx = -1;
  let busy = false;
  let lastFocus: HTMLElement | null = null;
  const fmtNum = (v: number) => {
    const a = Math.abs(v);
    const s = Number.isInteger(a) ? Math.round(a).toLocaleString("ru-RU") : a.toFixed(1).replace(".", ",");
    return (v < 0 ? "−" : "") + s;
  };

  function fillCase(i: number) {
    const c = CASES[i];
    caseIdx = i;
    $(".cs-idx").textContent = `Case 0${i + 1}/04 · ${c.svc}`;
    $(".cs-kind").textContent = c.kind;
    const title = $(".case-title");
    title.replaceChildren(
      ...c.name.split(" ").flatMap((word, wi) => {
        const w = document.createElement("span");
        w.className = "word";
        w.append(
          ...[...word].map((ch) => {
            const s = document.createElement("span");
            s.className = "ch";
            s.textContent = ch;
            return s;
          }),
        );
        return wi ? [" ", w] : [w];
      }),
    );
    $(".cs-svc").textContent = c.svc;
    $(".cs-role").textContent = c.role;
    $(".cs-prob").textContent = c.problem;
    $(".cs-ctx").textContent = c.ctx;
    $(".cs-core").textContent = c.core;
    $(".cs-steps").replaceChildren(
      ...c.steps.map((s, k) => {
        const li = document.createElement("li");
        const n = document.createElement("span");
        n.className = "mono";
        n.textContent = `0${k + 1}`;
        const t = document.createElement("span");
        t.textContent = s;
        li.append(n, t);
        return li;
      }),
    );
    $(".cs-res").replaceChildren(
      ...c.results.map(([v, suf, label]) => {
        const d = document.createElement("div");
        const val = document.createElement("div");
        val.className = "res-v";
        val.textContent = fmtNum(0) + suf;
        val.dataset.v = String(v);
        val.dataset.suf = suf;
        const l = document.createElement("p");
        l.className = "res-l";
        l.textContent = label;
        d.append(val, l);
        return d;
      }),
    );
    $(".cs-next-name").textContent = CASES[(i + 1) % CASES.length].name;
    const cc = $<HTMLCanvasElement>(".cs-cv");
    cc.width = Math.max(600, Math.min(1600, innerWidth));
    cc.height = Math.round(cc.width * Math.min(1, innerHeight / innerWidth) * 0.9);
    drawArt(cc.getContext("2d")!, cc.width, cc.height, i);
    const A = $<HTMLCanvasElement>(".ba-a");
    const B = $<HTMLCanvasElement>(".ba-b");
    A.width = B.width = 1280;
    A.height = B.height = 720;
    drawArt(A.getContext("2d")!, 1280, 720, i);
    drawArt(B.getContext("2d")!, 1280, 720, i);
    dullArt(B.getContext("2d")!, 1280, 720);
    $<HTMLInputElement>(".ba input").value = "50";
    $(".ba").style.setProperty("--cut", "50%");
  }
  $<HTMLInputElement>(".ba input").addEventListener("input", (e) => {
    $(".ba").style.setProperty("--cut", (e.target as HTMLInputElement).value + "%");
  }, { signal: ac.signal });

  function revealCase() {
    caseEl.scrollTop = 0;
    if (RM) caseEl.style.opacity = "1";
    else {
      gsap.fromTo(caseEl, { opacity: 0 }, { opacity: 1, duration: 0.5 });
      gsap.fromTo(".tlab .case-title .ch", { yPercent: 110 }, { yPercent: 0, stagger: 0.035, duration: 1, ease: "expo.out", delay: 0.1 });
    }
    $$(".res-v").forEach((el, k) => {
      const v = Number(el.dataset.v);
      const suf = el.dataset.suf ?? "";
      if (RM) {
        el.textContent = fmtNum(v) + suf;
        return;
      }
      const o = { v: 0 };
      gsap.to(o, {
        v, duration: 1.6, delay: 0.5 + k * 0.12, ease: "power3.out",
        onUpdate() {
          el.textContent = fmtNum(Number.isInteger(v) ? Math.round(o.v) : Math.round(o.v * 10) / 10) + suf;
        },
      });
    });
  }

  function openCase(i: number, cx: number, cy: number, from: HTMLElement) {
    if (busy) return;
    busy = true;
    lastFocus = from;
    const c = CASES[i];
    [S.wc.r, S.wc.g, S.wc.b] = c.rgb;
    S.wave.x = (cx - S.W / 2) / S.H;
    S.wave.y = -(cy - S.H / 2) / S.H;
    sound.whoosh();
    fillCase(i);
    gsap.to(app, { opacity: 0, duration: 0.45, ease: "power2.out" });
    gsap.to(S.wave, {
      p: 1, duration: RM || !engine ? 0.01 : 1.05, ease: "power3.inOut",
      onComplete() {
        app.style.visibility = "hidden";
        app.inert = true;
        caseEl.classList.add("open");
        root.classList.add("case-open");
        revealCase();
        caseEl.focus({ preventScroll: true });
        busy = false;
      },
    });
  }

  function closeCase() {
    if (busy || caseIdx < 0) return;
    busy = true;
    sound.whoosh();
    gsap.to(caseEl, {
      opacity: 0, duration: 0.35,
      onComplete() {
        caseEl.classList.remove("open");
        root.classList.remove("case-open");
        app.style.visibility = "";
        app.inert = false;
        S.wave.x = 0;
        S.wave.y = 0;
        gsap.to(S.wave, { p: 0, duration: RM ? 0.01 : 0.95, ease: "power3.inOut" });
        gsap.to(app, { opacity: 1, duration: 0.6, delay: 0.3, onComplete: () => { busy = false; } });
        caseIdx = -1;
        lastFocus?.focus({ preventScroll: true });
      },
    });
  }

  function nextCase() {
    if (busy) return;
    busy = true;
    const n = (caseIdx + 1) % CASES.length;
    const c = CASES[n];
    sound.whoosh();
    gsap.to(caseEl, {
      opacity: 0, duration: 0.35,
      onComplete() {
        gsap.to(S.wc, { r: c.rgb[0], g: c.rgb[1], b: c.rgb[2], duration: 0.8 });
        fillCase(n);
        revealCase();
        busy = false;
      },
    });
  }
  $(".cs-close").addEventListener("click", closeCase, { signal: ac.signal });
  $(".cs-next").addEventListener("click", nextCase, { signal: ac.signal });
  on("keydown", (e) => { if (e.key === "Escape" && caseIdx >= 0) closeCase(); });

  /* ---------------- loader ---------------- */
  let finishing = false;
  function updateLoader(now: number) {
    if (S.loaded || finishing) return;
    const cap = ((now - S.loadStart) / (RM ? 300 : 1900)) * 100;
    S.loadShown = Math.min(S.loadTarget, cap, 100);
    $(".ld-count").textContent = String(Math.floor(S.loadShown)).padStart(3, "0");
    if (S.loadShown >= 100) finishLoader();
  }
  function finishLoader() {
    finishing = true;
    const word = $(".ld-word");
    const spans = $$("span", word);
    const done = () => {
      root.classList.remove("is-loading");
      $(".loader").remove();
      S.loaded = true;
      lenis?.start();
      refreshWhiskerTargets();
    };
    if (RM) {
      S.textA = 1;
      S.awake = true;
      done();
      return;
    }
    const flip = () => {
      const first = spans.map((s) => s.getBoundingClientRect().left);
      word.append(...spans.slice().reverse());
      spans.forEach((s, k) => gsap.set(s, { x: first[k] - s.getBoundingClientRect().left }));
      $(".ld-refl").style.opacity = "0";
    };
    gsap
      .timeline()
      .to(".tlab .lid", { scaleY: 1, duration: 0.17, ease: "power2.in" })
      .add(() => {
        flip();
        S.awake = true;
        sound.tick();
      })
      .to(".tlab .lid", { scaleY: 0, duration: 0.28, ease: "power2.out" }, "+=.06")
      .to(spans, { x: 0, duration: 1, ease: "expo.inOut", stagger: { each: 0.04, from: "center" } })
      .to(spans, { keyframes: [{ y: -14, duration: 0.5 }, { y: 0, duration: 0.5 }], ease: "sine.inOut", stagger: { each: 0.04, from: "center" } }, "<")
      .to(S, { textA: 1, duration: 1.2, ease: "power2.out" }, "+=.15")
      .to(".tlab .ld-mark", { opacity: 0, y: -24, duration: 0.6, ease: "power2.in" }, "<")
      .to([".tlab .ld-count", ".tlab .ld-status"], { opacity: 0, duration: 0.4 }, "<")
      .add(done, "-=.5");
  }

  /* ---------------- pointer ---------------- */
  const cur = $(".cur");
  if (FINE) root.classList.add("cursor-on");
  let hoverEl: Element | null = null;
  const P = { velE: 0, move: 0, moveE: 0, pokes: 0, drags: 0, since: performance.now() };
  const INTERACTIVE = "a,button,input,textarea,label,select,[data-w]";
  const objProx = () => smooth(0.42 * S.obj.s + 0.08, 0.04, Math.hypot(S.mu[0] - S.obj.x, S.mu[1] - S.obj.y));

  on("pointermove", (e) => {
    const now = performance.now();
    const dt = Math.max(1, now - S.lastMove);
    const d = Math.hypot(e.clientX - S.mx, e.clientY - S.my);
    S.mVel = Math.min(6, lerp(S.mVel, d / dt, 0.35));
    S.mx = e.clientX;
    S.my = e.clientY;
    S.lastMove = now;
    if (e.pointerType !== "mouse") S.touched = now;
    P.move += d;
    if (S.dragging) {
      const dx = e.clientX - S.dragX;
      S.dragX = e.clientX;
      S.dragYaw += dx * 0.009;
      S.dragMoved += Math.abs(dx);
    }
  }, { passive: true });
  on("pointerover", (e) => { hoverEl = e.target as Element; });
  on("pointerdown", (e) => {
    S.lastMove = performance.now();
    if ((e.target as Element).closest?.(INTERACTIVE) || caseIdx >= 0) return;
    if (objProx() > 0.45) {
      S.dragging = true;
      S.dragMoved = 0;
      S.dragX = e.clientX;
    }
  });
  on("pointerup", () => {
    if (!S.dragging) return;
    S.dragging = false;
    if (S.dragMoved < 6) pokeObject();
    else P.drags++;
    gsap.to(S, { dragYaw: 0, duration: 1.8, ease: "elastic.out(1,.45)" });
  });

  function pokeObject() {
    P.pokes++;
    sound.chime(S.mx / S.W, 0.8);
    if (S.life === 4) {
      gsap.to(S, { seed: S.seed + 0.37 + Math.random() * 0.5, duration: 1.4, ease: "expo.inOut" });
      toast("New seed · " + Math.floor(Math.random() * 9000 + 1000));
    }
    S.poke = 1;
    if (sound.on) {
      sound.purr(0.7);
      setTimeout(() => { if (!gen.busy) sound.purr(0); }, 900);
    }
  }

  $$(".mag").forEach((el) => {
    el.addEventListener("pointermove", (e) => {
      const r = el.getBoundingClientRect();
      const dx = e.clientX - (r.left + r.width / 2);
      const dy = e.clientY - (r.top + r.height / 2);
      el.style.transform = `translate(${clamp(dx * 0.22, -12, 12)}px, ${clamp(dy * 0.35, -10, 10)}px)`;
    }, { signal: ac.signal });
    el.addEventListener("pointerleave", () => { el.style.transform = ""; }, { signal: ac.signal });
  });
  root.addEventListener("pointerover", (e) => {
    const b = (e.target as Element).closest?.(".btn") as HTMLElement | null;
    if (!b) return;
    const r = b.getBoundingClientRect();
    b.style.setProperty("--x", e.clientX - r.left + "px");
    b.style.setProperty("--y", e.clientY - r.top + "px");
  }, { signal: ac.signal });
  root.addEventListener("click", (e) => {
    if ((e.target as Element).closest?.("a,button")) sound.chime(e.clientX / S.W || 0.5);
  }, { signal: ac.signal });

  let wTargets: HTMLElement[] = [];
  function refreshWhiskerTargets() {
    wTargets = $$("[data-w]");
  }
  refreshWhiskerTargets();
  function drawWhiskers() {
    whc.clearRect(0, 0, S.W, S.H);
    if (!FINE || !S.loaded || performance.now() - S.lastMove > 2500) return;
    const x = S.mx;
    const y = S.my;
    const R = 170;
    const near: [number, number, number][] = [];
    for (const el of wTargets) {
      const r = el.getBoundingClientRect();
      if (r.bottom < 0 || r.top > S.H || r.width === 0) continue;
      const nx = clamp(x, r.left, r.right);
      const ny = clamp(y, r.top, r.bottom);
      const d = Math.hypot(nx - x, ny - y);
      if (d > 2 && d < R) near.push([d, nx, ny]);
    }
    near.sort((a, b) => a[0] - b[0]);
    whc.lineWidth = 1;
    near.slice(0, 3).forEach(([d, nx, ny]) => {
      const a = (1 - d / R) * 0.5;
      whc.strokeStyle = `rgba(237,232,227,${a})`;
      whc.beginPath();
      whc.moveTo(x, y);
      whc.lineTo(nx, ny);
      whc.stroke();
      whc.fillStyle = `rgba(232,163,174,${a * 1.6})`;
      whc.beginPath();
      whc.arc(nx, ny, 1.8, 0, 7);
      whc.fill();
    });
  }

  /* ---------------- adaptive profile ---------------- */
  function applyProfile(p: Profile) {
    S.profile = p;
    root.dataset.profile = p;
    S.warmT = PROFILES[p].warm * (night ? 1.15 : 1);
    $(".mode-l").textContent = p + (S.manual ? " · manual" : "") + (night ? " · night" : "");
  }
  const profileTimer = setInterval(() => {
    P.moveE = lerp(P.moveE, P.move, 0.35);
    P.move = 0;
    if (S.manual) return;
    if (RM) return applyProfile("still");
    let p: Profile = "reading";
    if (performance.now() - P.since > 4000) {
      if (P.velE > 1500) p = "hunter";
      else if (P.drags + P.pokes >= 3 || (P.moveE > 1400 && P.velE < 200)) p = "player";
      else p = "observer";
    }
    if (p !== S.profile) applyProfile(p);
  }, 1000);
  $(".mode").addEventListener("click", () => {
    const order: (Profile | null)[] = [null, "hunter", "observer", "player"];
    S.manual = order[(order.indexOf(S.manual) + 1) % order.length];
    applyProfile(S.manual ?? S.profile);
    toast(S.manual ? `Режим вручную: ${S.manual}` : "Режим: авто — страница снова читает вас");
  }, { signal: ac.signal });
  applyProfile(RM ? "still" : "reading");

  let keys = "";
  on("keydown", (e) => {
    if ((e.target as Element).closest?.("input,textarea") || e.key.length !== 1) return;
    keys = (keys + e.key.toLowerCase()).slice(-6);
    if (keys !== "bastet") return;
    keys = "";
    root.classList.add("mirrored");
    toast("☾ BASTET — зеркало открыто");
    sound.chime(0.5, 0.6);
    sound.chime(0.5, 1.2);
    gsap.to(S, { gold: 1, duration: 1 });
    setTimeout(() => {
      root.classList.remove("mirrored");
      gsap.to(S, { gold: 0, duration: 1.5 });
    }, 6500);
  });

  const sndBtn = $(".snd");
  sndBtn.addEventListener("click", async () => {
    const isOn = await sound.toggle();
    sndBtn.setAttribute("aria-pressed", String(isOn));
    $(".snd-l").textContent = isOn ? "Звук · вкл" : "Звук · выкл";
    if (isOn) sound.chime(0.8, 1.1);
  }, { signal: ac.signal });

  /* ---------------- AI offer ---------------- */
  const brief = $<HTMLTextAreaElement>("#lab-brief");
  $$(".chips").forEach((g) =>
    g.addEventListener("click", (e) => {
      const b = (e.target as Element).closest(".chip");
      if (!b) return;
      $$(".chip", g).forEach((c) => c.setAttribute("aria-pressed", String(c === b)));
    }, { signal: ac.signal }),
  );
  const chipVal = (g: string) => root.querySelector(`.chips[data-group="${g}"] .chip[aria-pressed="true"]`)?.textContent ?? "";

  const gen = { busy: false, ctl: null as AbortController | null, n: 0, last: {} as Offer };
  const KEYS: Record<string, keyof Offer> = { ЗАГОЛОВОК: "title", СУТЬ: "sum", ПОДХОД: "app", ЭТАПЫ: "st", НАПРАВЛЕНИЕ: "dir", КЕЙС: "kase" };
  function parseOffer(text: string): Offer {
    const o: Offer = {};
    for (const line of text.split("\n")) {
      const m = line.replace(/^[\s*#-]+/, "").match(/^(ЗАГОЛОВОК|СУТЬ|ПОДХОД|ЭТАПЫ|НАПРАВЛЕНИЕ|КЕЙС)\s*[:：]\s*(.*)$/i);
      if (m) o[KEYS[m[1].toUpperCase()]] = m[2].replace(/\*\*/g, "").trim();
    }
    return o;
  }
  function localOffer(text: string, fmt: string, time: string): Offer {
    const b = text.toLowerCase();
    const dir = /агент|поддерж|чат|бот|звон|оператор|заяв|обращен|голос/.test(b) ? 1 : /бренд|упаков|генер|контент|айдент|визуал|картин|sku|коллекц/.test(b) ? 0 : 2;
    const d = (a: string, m: string, c: string) => (/срочно/i.test(time) ? a : /не горит/i.test(time) ? c : m);
    const T = [
      { title: "Генеративная система под ваш визуальный язык", sum: "Опишем стиль бренда как правила и соберём генератор, который выпускает вариации внутри них.", app: ["Разбор визуального языка и ограничений", "Генератор, обученный на ваших материалах", "Пайплайн отбора и выгрузки в производство"], kase: "GLYPH ENGINE" },
      { title: "AI-агент, который берёт на себя рутину", sum: "Агент отвечает по базе знаний, работает с вашими системами через API и передаёт людям только сложные случаи.", app: ["Аудит обращений и карта намерений", "Агент с инструментами и границами полномочий", "Человек в контуре и метрики качества"], kase: "NOCTURNE" },
      { title: "Интерфейс, который подстраивается под человека", sum: "Найдём поведенческие паттерны и соберём адаптивные сценарии с A/B-контролем.", app: ["Поведенческая аналитика и интервью", "Кластеры сценариев и адаптивные потоки", "Эксперименты и объяснимость для команды"], kase: "MERIDIAN" },
    ][dir];
    return {
      title: T.title,
      sum: T.sum,
      app: T.app.join("; "),
      st: [`Observe — ${d("3 дня", "1–2 недели", "2 недели")}`, `Stalk: прототип — ${d("1 неделя", "2–3 недели", "3–4 недели")}`, `Pounce: ${fmt.toLowerCase()} — ${d("2 недели", "4–8 недель", "8–12 недель")}`].join("; "),
      dir: SERVICES[dir].name,
      kase: T.kase,
    };
  }
  function renderOffer(o: Offer, streaming: boolean) {
    $(".of-title").textContent = o.title ?? "";
    $(".of-sum").textContent = o.sum ?? "";
    const list = (sel: string, v?: string) =>
      $(sel).replaceChildren(
        ...(v ?? "")
          .split(/;|\s\|\s/)
          .map((x) => x.trim())
          .filter(Boolean)
          .map((x) => {
            const li = document.createElement("li");
            const sp = document.createElement("span");
            sp.textContent = x;
            li.appendChild(sp);
            return li;
          }),
      );
    list(".of-app", o.app);
    list(".of-st", o.st);
    const dir = $(".of-dir");
    dir.hidden = !o.dir;
    dir.textContent = o.dir ?? "";
    const k = CASES.findIndex((c) => o.kase?.toUpperCase().includes(c.name));
    const cb = $(".of-case");
    cb.hidden = k < 0;
    if (k >= 0) {
      cb.textContent = `Похожий кейс: ${CASES[k].name} →`;
      cb.dataset.k = String(k);
    }
    const order = [".of-title", ".of-sum", ".of-app", ".of-st"];
    order.forEach((s) => $(s).classList.remove("caret"));
    $$(".of-app li, .of-st li").forEach((li) => li.classList.remove("caret"));
    if (streaming) {
      const last = (["title", "sum", "app", "st"] as const).reduce((acc, f, i) => (o[f] ? i : acc), 0);
      const el = $(order[last]);
      (el.tagName === "OL" ? (el.lastElementChild as HTMLElement | null) ?? el : el).classList.add("caret");
    }
    gen.last = o;
  }
  $(".of-case").addEventListener("click", (e) => {
    const b = e.currentTarget as HTMLElement;
    const r = b.getBoundingClientRect();
    openCase(Number(b.dataset.k), r.left + r.width / 2, r.top + r.height / 2, b);
  }, { signal: ac.signal });

  async function localStream(text: string, fmt: string, time: string, note: string) {
    const o = localOffer(text, fmt, time);
    const acc: Offer = {};
    for (const f of ["title", "sum", "app", "st", "dir", "kase"] as const) {
      if (gen.ctl?.signal.aborted) break;
      acc[f] = o[f];
      renderOffer(acc, true);
      await wait(RM ? 0 : 380);
    }
    renderOffer(acc, false);
    $(".of-state").textContent = "Готово · шаблон";
    $(".of-note").textContent = note;
  }

  function setGenUI(busyNow: boolean) {
    gen.busy = busyNow;
    S.pulse = busyNow ? 1 : 0;
    sound.purr(busyNow ? 1 : 0);
    $<HTMLButtonElement>(".gen").disabled = busyNow;
    $(".stop").hidden = !busyNow;
    $<HTMLButtonElement>(".of-re").disabled = busyNow;
  }

  async function generate() {
    const text = brief.value.trim();
    const note = $(".form-note");
    if (text.length < 12) {
      note.textContent = "Опишите задачу хотя бы одним предложением — так офер получится точнее.";
      brief.focus();
      return;
    }
    note.textContent = "";
    const fmt = chipVal("fmt");
    const time = chipVal("time");
    gen.n++;
    $(".of-id").textContent = `Offer · draft ${String(gen.n).padStart(3, "0")} · ${new Date().toLocaleDateString("ru-RU")}`;
    const off = $(".offer");
    off.hidden = false;
    renderOffer({}, true);
    $(".of-state").textContent = "Думаю…";
    $(".of-note").textContent = "";
    gen.ctl = new AbortController();
    setGenUI(true);
    refreshWhiskerTargets();
    if (!RM) gsap.fromTo(off, { opacity: 0, y: 16 }, { opacity: 1, y: 0, duration: 0.6, ease: "power3.out" });
    try {
      const res = await fetch("/api/lab-offer", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ brief: text, format: fmt, timeline: time }),
        signal: gen.ctl.signal,
      });
      if (res.status === 429) {
        $(".of-state").textContent = "Пауза";
        $(".of-note").textContent = "Слишком много запросов подряд. Подождите минуту и нажмите «Пересобрать».";
        return;
      }
      if (!res.ok || !res.body) throw new Error(res.status === 503 ? "unconfigured" : `http_${res.status}`);
      const reader = res.body.getReader();
      const dec = new TextDecoder();
      let acc = "";
      for (;;) {
        const { done, value } = await reader.read();
        if (done) break;
        acc += dec.decode(value, { stream: true });
        $(".of-state").textContent = "Пишу…";
        renderOffer(parseOffer(acc), true);
      }
      const o = parseOffer(acc);
      if (!o.title || !o.sum || acc.includes("[refusal]")) throw new Error("parse");
      renderOffer(o, false);
      $(".of-state").textContent = "Готово · Claude";
      $(".of-note").textContent = "Черновик сгенерирован Claude по вашему описанию. Это демо: заявка никуда не отправляется.";
    } catch (err) {
      if (gen.ctl.signal.aborted) {
        renderOffer(gen.last, false);
        $(".of-state").textContent = "Остановлено";
      } else {
        await localStream(
          text, fmt, time,
          err instanceof Error && err.message === "unconfigured"
            ? "AI-ключ не настроен на сервере — собран локальный шаблон по ключевым словам."
            : "Claude сейчас недоступен — собран локальный шаблон по ключевым словам.",
        );
      }
    } finally {
      setGenUI(false);
    }
  }
  $(".ask").addEventListener("submit", (e) => { e.preventDefault(); generate(); }, { signal: ac.signal });
  $(".stop").addEventListener("click", () => gen.ctl?.abort(), { signal: ac.signal });
  $(".of-re").addEventListener("click", generate, { signal: ac.signal });
  $(".of-copy").addEventListener("click", () => {
    const o = gen.last;
    const txt = [o.title, "", o.sum, "", "Подход: " + (o.app ?? ""), "Этапы: " + (o.st ?? ""), "Направление: " + (o.dir ?? ""), "Похожий кейс: " + (o.kase ?? "")].join("\n");
    navigator.clipboard.writeText(txt).then(
      () => toast("Офер скопирован"),
      () => toast("Не удалось скопировать — выделите текст вручную"),
    );
  }, { signal: ac.signal });

  /* ---------------- per-frame ---------------- */
  const secIds = ["hero", "manifesto", "services", "works", "process", "contact"] as const;
  const secEls = secIds.map((id) => $("#" + id));
  const manLines = $$(".man-line");
  const manState = manLines.map(() => 0);
  const procRows = $$(".proc-row");
  const railSpans = $$(".rail span");
  const navs = $$<HTMLAnchorElement>(".nav");
  let shownLife = 0;
  const secProgress = (el: HTMLElement) => {
    const r = el.getBoundingClientRect();
    return clamp(-r.top / Math.max(1, r.height - S.H));
  };

  function updateScroll(dt: number) {
    const y = scrollY;
    const v = (y - S.lastY) / Math.max(dt, 0.001);
    S.lastY = y;
    S.vel = damp(S.vel, v, 6, dt);
    const av = Math.abs(S.vel);
    if (av > 60) P.velE = lerp(P.velE, av, 0.04);
    sound.scroll(av);
    const kw = Math.round(300 + Math.min(400, av * 0.12));
    if (Math.abs(kw - S.kw) > 4) {
      S.kw = kw;
      root.style.setProperty("--kw", String(kw));
    }

    let sec: string = "hero";
    for (let i = 0; i < secEls.length; i++) {
      const r = secEls[i].getBoundingClientRect();
      if (r.top <= S.H * 0.5 && r.bottom > S.H * 0.5) {
        sec = secIds[i];
        break;
      }
    }
    if (y + S.H >= document.documentElement.scrollHeight - 4) sec = "contact";
    S.sec = sec;

    const mp = secProgress(secEls[1]);
    manLines.forEach((el, i) => {
      const li = smooth(i * 0.21 + 0.04, i * 0.21 + 0.2, mp);
      el.style.transform = `rotateY(${(1 - li) * 180}deg)`;
      el.style.opacity = String(0.3 + 0.7 * li);
      const st = li > 0.5 ? 1 : 0;
      if (st !== manState[i]) {
        manState[i] = st;
        if (st) sound.tick();
      }
    });

    const svcIdx = Math.min(2, Math.floor(secProgress(secEls[2]) * 3));
    const svc = S.hoverSvc ?? svcIdx;
    renderSvc(svc);

    const wp = secProgress(secEls[3]);
    track.style.transform = `translate3d(${-wp * Math.max(0, track.scrollWidth - S.W)}px,0,0)`;
    let best = -1;
    let bd = 1e9;
    cards.forEach((c, i) => {
      const r = c.getBoundingClientRect();
      const d = Math.abs(r.left + r.width / 2 - S.W / 2);
      if (d < bd) {
        bd = d;
        best = i;
      }
    });
    cards.forEach((c, i) => c.classList.toggle("focus", i === best));

    procRows.forEach((r) => r.classList.toggle("lit", r.getBoundingClientRect().top < S.H * 0.66));

    let life = 1;
    if (S.awake) life = ({ hero: 2, manifesto: 3, services: 4 + svc, works: 7, process: 8, contact: 9 } as Record<string, number>)[sec];
    if (caseIdx >= 0) life = 7;
    S.life = life;
    if (life !== shownLife) {
      if (shownLife) sound.chime(0.5, 1.2 + life * 0.05, 0.5);
      shownLife = life;
      $(".h-life").innerHTML = `Life <b>${String(life).padStart(2, "0")}</b>/09 · ${LIFE_NAMES[life - 1]}`;
      railSpans.forEach((sp, i) => {
        sp.classList.toggle("on", i < life);
        sp.classList.toggle("cur-l", i === life - 1);
      });
    }
    navs.forEach((a) => a.classList.toggle("on", a.dataset.nav === sec));
  }

  function updateObject(dt: number, now: number) {
    const mob = S.W < 760;
    const asp = S.W / S.H;
    if (!FINE && now - S.touched > 3000) {
      S.mx = S.W * (0.5 + Math.sin(S.t * 0.4) * 0.25);
      S.my = S.H * (0.45 + Math.cos(S.t * 0.3) * 0.15);
    }
    S.mu = [(S.mx - S.W / 2) / S.H, -(S.my - S.H / 2) / S.H];
    S.mVel = damp(S.mVel, 0, 2.2, dt);

    const heroP = clamp(scrollY / S.H);
    let T: { x: number; y: number; s: number };
    switch (S.sec) {
      case "manifesto": T = { x: 0, y: 0, s: mob ? 0.5 : 0.62 }; break;
      case "services": T = mob ? { x: 0, y: 0.31, s: 0.3 } : { x: asp * 0.24, y: 0, s: 0.72 }; break;
      case "works": T = { x: 0, y: 0.02, s: mob ? 0.55 : 0.9 }; break;
      case "process": T = mob ? { x: 0, y: 0.3, s: 0.34 } : { x: -asp * 0.26, y: -0.02, s: 0.62 }; break;
      case "contact": T = mob ? { x: 0, y: 0.34, s: 0.32 } : { x: asp * 0.27, y: 0, s: 0.6 }; break;
      default: T = { x: 0, y: mob ? 0.06 : 0.02, s: (mob ? 0.62 : 0.78) - 0.16 * heroP };
    }
    if (!S.awake) {
      const k = S.loadShown / 100;
      T = { x: 0, y: lerp(-1.05, 0.02, 1 - Math.pow(1 - k, 3)), s: mob ? 0.62 : 0.78 };
    }
    const lam = S.loaded ? 3 : 5;
    S.obj.x = damp(S.obj.x, T.x, lam, dt);
    S.obj.y = damp(S.obj.y, T.y, lam, dt);
    S.obj.s = damp(S.obj.s, T.s, lam, dt);

    const geo = LIFE_GEO[S.life];
    let sum = 0;
    for (let i = 0; i < 8; i++) {
      S.w[i] = damp(S.w[i], i === geo ? 1 : 0, 3.4, dt);
      if (S.w[i] < 0.002) S.w[i] = 0;
      sum += S.w[i];
    }
    for (let i = 0; i < 8; i++) S.w[i] /= sum || 1;
    const pt = LIFE_PARTICLES[S.life];
    for (let i = 0; i < 5; i++) S.pw[i] = damp(S.pw[i], pt[i], 2.2, dt);
    S.pAlpha = damp(S.pAlpha, S.awake ? (S.sec === "works" ? 0.45 : 0.9) * (1 - S.sleep * 0.7) : 0.25, 1.5, dt);

    const sw = RM ? 0 : 1;
    S.yaw = sw * (Math.sin(S.t * 0.3) * 0.16 + S.mu[0] * 0.45) + S.dragYaw;
    S.pitch = sw * (-S.mu[1] * 0.3 + Math.sin(S.t * 0.23) * 0.05);

    const idle = (now - S.lastMove) / 1000;
    const prox = objProx();
    const bottom = scrollY + S.H >= document.documentElement.scrollHeight - 6;
    const sleepT = S.sec === "contact" && bottom && idle > 5 && !gen.busy ? 1 : 0;
    S.sleep = damp(S.sleep, sleepT, sleepT ? 0.7 : 4, dt);
    S.poke = damp(S.poke, 0, 2.5, dt);
    const wide = 0.085 + smooth(3, 9, idle) * 0.06;
    const pupilT = lerp(lerp(wide, 0.012, prox), 0.004, Math.max(S.poke, S.sleep));
    S.pupil = damp(S.pupil, pupilT, 4, dt);
    S.pupilX = clamp(((S.mu[0] - S.obj.x) * 2.4) / Math.max(S.obj.s, 0.1) * 0.08, -0.12, 0.12);
    let glowT = S.awake ? (0.75 + prox * 1.1) * (night ? 1.3 : 1) : 0;
    if (S.life === 5) glowT *= 0.7 + Math.pow(Math.sin(S.t * 2.2), 8) * 0.9;
    if (gen.busy) glowT *= 0.7 + 0.6 * Math.abs(Math.sin(S.t * 4));
    glowT = (glowT + S.poke * 1.4) * (1 - S.sleep);
    S.glow = damp(S.glow, glowT, 3, dt);
    S.warm = damp(S.warm, S.warmT, 1.2, dt);
    S.speed = damp(S.speed, PROFILES[S.profile].speed, 1, dt);
    S.textY = scrollY / S.H;
    const asp2 = S.W / S.H;
    S.wave.maxR = Math.max(Math.hypot(asp2 / 2 + Math.abs(S.wave.x), 0.5 + Math.abs(S.wave.y)), 0.6) + 0.15;

    let cls = "";
    if (S.dragging) cls = "drag";
    else if (hoverEl?.closest) {
      if (hoverEl.closest("textarea,input[type=text]")) cls = "text";
      else if (hoverEl.closest(INTERACTIVE)) cls = "link";
    }
    if (!cls && caseIdx < 0 && prox > 0.55 && S.loaded) cls = "obj";
    if (cur.dataset.c !== cls) {
      cur.className = "cur " + cls;
      cur.dataset.c = cls;
    }
    cur.style.transform = `translate3d(${S.mx}px,${S.my}px,0)`;
  }

  let raf = 0;
  let last = performance.now();
  let fN = 0;
  let fT = 0;
  let low = 0;
  let high = 0;
  const hXY = $(".h-xy");
  const hFps = $(".h-fps");
  const hR = $(".h-r");
  const clock = $(".clock");
  function frame(now: number) {
    raf = requestAnimationFrame(frame);
    const dt = Math.min(0.05, (now - last) / 1000);
    last = now;
    S.dt = dt;
    S.t += dt * S.speed;
    lenis?.raf(now);
    fN++;
    fT += dt;
    if (fT >= 1) {
      const fps = Math.round(fN / fT);
      fN = 0;
      fT = 0;
      hFps.textContent = `${fps} FPS`;
      if (engine && S.loaded) {
        if (fps < 48) { low++; high = 0; } else if (fps > 58) { high++; low = 0; } else { low = high = 0; }
        if (low >= 2 && rs > 0.5) { rs = Math.max(0.5, rs - 0.15); resize(); low = 0; }
        if (high >= 4 && rs < 1) { rs = Math.min(1, rs + 0.1); resize(); high = 0; }
      }
      hR.textContent = engine ? `${engine.isWebGPU ? "WebGPU" : "WebGL2"} · TSL · ${(engine.particleCount / 1024).toFixed(0)}k · ${rs.toFixed(2)}×` : "CSS fallback";
      clock.textContent = "Local " + new Date().toLocaleTimeString("ru-RU", { hour: "2-digit", minute: "2-digit" }) + (night ? " · night mode" : "");
    }
    hXY.textContent = `X ${String(Math.round(S.mx)).padStart(4, "0")} · Y ${String(Math.round(S.my)).padStart(4, "0")}`;
    updateLoader(now);
    updateScroll(dt);
    updateObject(dt, now);
    engine?.frame(S);
    drawWhiskers();
  }
  raf = requestAnimationFrame(frame);

  return () => {
    disposed = true;
    cancelAnimationFrame(raf);
    ac.abort();
    gen.ctl?.abort();
    clearInterval(profileTimer);
    clearTimeout(toastT);
    clearTimeout(rzT);
    gsap.killTweensOf(S);
    gsap.killTweensOf(S.wave);
    lenis?.destroy();
    sound.dispose();
    engine?.dispose();
    engine = null;
  };
}
