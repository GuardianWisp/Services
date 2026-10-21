// Procedural cover art for the concept case studies (no image assets).

function rng(seed: number) {
  return () => {
    seed |= 0;
    seed = (seed + 0x6d2b79f5) | 0;
    let t = Math.imul(seed ^ (seed >>> 15), 1 | seed);
    t = (t + Math.imul(t ^ (t >>> 7), 61 | t)) ^ t;
    return ((t ^ (t >>> 14)) >>> 0) / 4294967296;
  };
}

export function drawArt(ctx: CanvasRenderingContext2D, w: number, h: number, i: number) {
  const R = rng(97 + i * 131);
  const m = Math.min(w, h);
  ctx.save();
  ctx.globalCompositeOperation = "source-over";
  let g: CanvasGradient;
  if (i === 0) {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#07100f");
    g.addColorStop(1, "#1E3A3A");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const rg = ctx.createRadialGradient(w * 0.68, h * 0.3, 0, w * 0.68, h * 0.3, m * 0.55);
    rg.addColorStop(0, "rgba(255,180,90,.6)");
    rg.addColorStop(1, "rgba(255,180,90,0)");
    ctx.fillStyle = rg;
    ctx.fillRect(0, 0, w, h);
    const pts: [number, number, number][] = [];
    for (let k = 0; k < 90; k++) pts.push([R() * w, R() * h, R()]);
    ctx.lineWidth = Math.max(1, m / 500);
    for (let a = 0; a < pts.length; a++)
      for (let b = a + 1; b < pts.length; b++) {
        const d = Math.hypot(pts[a][0] - pts[b][0], pts[a][1] - pts[b][1]);
        if (d < m * 0.15) {
          ctx.strokeStyle = `rgba(255,200,140,${0.3 * (1 - d / (m * 0.15))})`;
          ctx.beginPath();
          ctx.moveTo(pts[a][0], pts[a][1]);
          ctx.lineTo(pts[b][0], pts[b][1]);
          ctx.stroke();
        }
      }
    pts.forEach((p) => {
      ctx.fillStyle = `rgba(237,232,227,${0.4 + p[2] * 0.6})`;
      ctx.beginPath();
      ctx.arc(p[0], p[1], m * (0.002 + p[2] * 0.006), 0, 7);
      ctx.fill();
    });
  } else if (i === 1) {
    g = ctx.createLinearGradient(0, 0, w, h);
    g.addColorStop(0, "#6b3a45");
    g.addColorStop(1, "#1d0c10");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const cols = 5;
    const cell = w / cols;
    const rows = Math.ceil(h / cell);
    for (let r = 0; r < rows; r++)
      for (let c = 0; c < cols; c++) {
        const x = c * cell;
        const y = r * cell;
        const pad = cell * 0.2;
        const s = cell - pad * 2;
        const cx = x + cell / 2;
        const cy = y + cell / 2;
        const t = Math.floor(R() * 5);
        ctx.fillStyle = R() > 0.78 ? "#E8A3AE" : "rgba(237,232,227,.86)";
        ctx.strokeStyle = ctx.fillStyle;
        ctx.lineWidth = Math.max(1.5, cell * 0.03);
        ctx.beginPath();
        if (t === 0) {
          ctx.arc(cx, cy, s / 2, 0, 7);
          ctx.fill();
        } else if (t === 1) {
          ctx.arc(cx, cy + s / 4, s / 2, Math.PI, 0);
          ctx.fill();
        } else if (t === 2) {
          ctx.ellipse(cx, cy, s * 0.14, s / 2, 0, 0, 7);
          ctx.fill();
        } else if (t === 3) {
          ctx.rect(x + pad, y + pad, s, s);
          ctx.stroke();
        } else {
          ctx.arc(x + pad, y + pad + s, s, -Math.PI / 2, 0);
          ctx.stroke();
        }
      }
  } else if (i === 2) {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#0b0f13");
    g.addColorStop(1, "#22333a");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    ctx.lineWidth = Math.max(1, m / 420);
    for (let k = 0; k < 46; k++) {
      ctx.strokeStyle = k % 7 === 0 ? "rgba(232,163,174,.8)" : "rgba(169,199,193,.22)";
      ctx.beginPath();
      for (let x = 0; x <= w; x += w / 90) {
        const y = h * (k / 46) + Math.sin((x / w) * 9.4 + k * 0.3) * h * 0.05 + Math.sin((x / w) * 21 + k) * h * 0.012;
        if (x === 0) ctx.moveTo(x, y);
        else ctx.lineTo(x, y);
      }
      ctx.stroke();
    }
  } else {
    g = ctx.createLinearGradient(0, 0, 0, h);
    g.addColorStop(0, "#120c05");
    g.addColorStop(1, "#3a2508");
    ctx.fillStyle = g;
    ctx.fillRect(0, 0, w, h);
    const cx = w * 0.5;
    const cy = h * 0.96;
    for (let k = 0; k < 9; k++) {
      const rad = m * (0.12 + k * 0.1);
      ctx.strokeStyle = `rgba(232,192,122,${0.85 - k * 0.08})`;
      ctx.lineWidth = Math.max(1, m * (0.004 + (k % 3) * 0.003));
      ctx.beginPath();
      ctx.arc(cx, cy, rad, Math.PI, 0);
      ctx.stroke();
      const a = Math.PI + R() * Math.PI;
      ctx.fillStyle = "#EDE8E3";
      ctx.beginPath();
      ctx.arc(cx + Math.cos(a) * rad, cy + Math.sin(a) * rad, m * 0.009, 0, 7);
      ctx.fill();
    }
  }
  ctx.restore();
}

/** The "before" state of the before/after slider: desaturated, dimmed, gridded. */
export function dullArt(ctx: CanvasRenderingContext2D, w: number, h: number) {
  ctx.save();
  ctx.globalCompositeOperation = "saturation";
  ctx.fillStyle = "#808080";
  ctx.fillRect(0, 0, w, h);
  ctx.globalCompositeOperation = "source-over";
  ctx.fillStyle = "rgba(12,12,14,.5)";
  ctx.fillRect(0, 0, w, h);
  ctx.strokeStyle = "rgba(237,232,227,.12)";
  ctx.lineWidth = 1;
  for (let x = w / 8; x < w; x += w / 8) {
    ctx.beginPath();
    ctx.moveTo(x, 0);
    ctx.lineTo(x, h);
    ctx.stroke();
  }
  ctx.restore();
}
