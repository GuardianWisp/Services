import { readFileSync } from "node:fs";
import path from "node:path";

// Shell for the site's small text pages (privacy policy, 404): the same fonts, tokens, logo pill and footer
// as the hand-built homepage, without its scripts. The font block is taken from home.html so both stay in sync.

const raw = readFileSync(path.join(process.cwd(), "src/app/_home/home.html"), "utf8");
const fonts = raw.match(/<link rel="preload" href="\/fonts\/[\s\S]*?<\/style>/)?.[0];
if (!fonts) throw new Error("home.html: font block not found");

export const docFonts = fonts;

export const docCss = `
:root{color-scheme:light;--bg:#F5F5F5;--tx:#434343;--blk:#000;--sec:#5E5E5E;--mute:#9A9A9A;--line:rgba(0,0,0,.1);--lime:#B8E23A;--card:#fff;
  --gut:clamp(16px,6vw,48px);--f:"Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif;--ease:cubic-bezier(.16,1,.3,1)}
html{background:var(--bg)}
body.doc{margin:0;background:var(--bg);color:var(--tx);font:400 16px/1.5 var(--f);-webkit-font-smoothing:antialiased;min-height:100svh;display:flex;flex-direction:column}
.doc ::selection{background:var(--blk);color:var(--bg)}
.doc a{color:inherit;text-decoration:none}
.doc p,.doc h1,.doc h2{margin:0;font-weight:400}
.doc :focus-visible{outline:1px solid var(--blk);outline-offset:3px}
.d-wrap{padding-inline:var(--gut)}
.d-top{display:flex;justify-content:space-between;align-items:center;gap:12px;padding:calc(12px + env(safe-area-inset-top,0px)) var(--gut) 0}
.d-pill{display:inline-flex;align-items:center;gap:8px;height:44px;padding:0 16px 0 14px;border-radius:12px;background:#1c1c1c;color:#fff!important;font-size:14px;letter-spacing:.02em;transition:border-radius .5s var(--ease)}
.d-pill:hover,.d-pill:focus-visible{border-radius:22px}
.d-pill svg{width:16px;height:16px}
.d-pill.ghost{background:transparent;color:var(--blk)!important;box-shadow:inset 0 0 0 1px rgba(0,0,0,.25);padding:0 16px}
.d-pill.ghost:hover,.d-pill.ghost:focus-visible{background:var(--blk);color:#fff!important}
.d-pill.lime:hover,.d-pill.lime:focus-visible{background:var(--lime);color:var(--blk)!important}
.d-lab{display:block;font-size:14px;color:var(--tx);margin:0 0 16px 18px}
.d-foot{display:flex;justify-content:space-between;gap:16px;flex-wrap:wrap;margin-top:auto;padding:24px var(--gut) calc(24px + env(safe-area-inset-bottom,0px));border-top:1px solid var(--line);font-size:14px}
.d-foot .sec{color:var(--sec)}
.d-in{animation:dIn 1s var(--ease) both}
.d-in:nth-child(2){animation-delay:.08s}.d-in:nth-child(3){animation-delay:.16s}
@keyframes dIn{from{opacity:0;transform:translateY(24px)}}
@media (prefers-reduced-motion:reduce){.d-in{animation:none}}
`;

const cat =
  '<svg viewBox="0 0 24 24" aria-hidden="true"><path d="M3 21V4l5.5 5h7L21 4v17z" fill="currentColor"/><g fill="#1c1c1c"><ellipse cx="9" cy="14" rx="1.7" ry="1.9"/><ellipse cx="15" cy="14" rx="1.7" ry="1.9"/></g></svg>';

export const docHeader = (right = '<a class="d-pill ghost" href="/">На главную</a>') =>
  `<header class="d-top"><a class="d-pill" href="/" aria-label="TETSAB — на главную">${cat}TETSAB</a>${right}</header>`;

export const docFooter =
  '<footer class="d-foot"><span>© 2026 TETSAB</span><span class="sec">Сайты и цифровые инструменты для бизнеса</span><a href="https://t.me/tetsab" target="_blank" rel="noopener">t.me/tetsab ↗</a></footer>';

/** A complete HTML document for a text page. `head` goes after the fonts (meta tags, analytics). */
export function docPage(o: { title: string; description: string; canonical: string; css: string; body: string; head?: string }) {
  const esc = (s: string) => s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");
  return `<!doctype html>
<html lang="ru">
<head>
<meta charset="utf-8">
<meta name="viewport" content="width=device-width,initial-scale=1,viewport-fit=cover">
<title>${esc(o.title)}</title>
<meta name="description" content="${esc(o.description)}">
<meta name="theme-color" content="#F5F5F5">
<link rel="canonical" href="${o.canonical}">
<meta property="og:type" content="website">
<meta property="og:locale" content="ru_RU">
<meta property="og:site_name" content="TETSAB">
<meta property="og:url" content="${o.canonical}">
<meta property="og:title" content="${esc(o.title)}">
<meta property="og:description" content="${esc(o.description)}">
<meta property="og:image" content="https://tetsab.ru/og.jpg">
<meta property="og:image:width" content="2400">
<meta property="og:image:height" content="1260">
<meta name="twitter:card" content="summary_large_image">
<link rel="icon" href="/icon">
<link rel="apple-touch-icon" href="/apple-icon">
${docFonts}
${o.head ?? ""}
<style>${docCss}${o.css}</style>
</head>
<body class="doc">
${o.body}
</body>
</html>
`;
}
