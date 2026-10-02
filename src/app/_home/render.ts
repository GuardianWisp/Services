import { readFileSync } from "node:fs";
import path from "node:path";
import vm from "node:vm";

// The homepage is a single hand-built HTML page (src/app/_home/home.html).
// Case pages (/cases/[slug]) are the same page with the case sheet already
// open: the page's own case renderer (the <script id="tsdata"> block, which
// has no DOM code) runs here so the case is in the HTML for search engines
// and link previews. After load the page takes over and switches between
// cases and the homepage without reloading.

const SITE = "https://tetsab.ru";
const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

type Work = { slug: string; n: string; k: string; url?: string };
type Case = { lead: string; real?: { desk: string } };
type Data = {
  renderCase: (slug: string) => string;
  caseCnt: (slug: string) => string;
  WORKS: Work[];
  CASES: Record<string, Case>;
};

export function analytics() {
  let head = "";
  let body = "";
  if (GA_MEASUREMENT_ID) {
    head += `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');</script>`;
  }
  if (YANDEX_METRIKA_ID) {
    head += `<script>window.__ymId=${YANDEX_METRIKA_ID};(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}","ym");ym(${YANDEX_METRIKA_ID},"init",{ssr:true,webvisor:true,clickmap:true,ecommerce:"dataLayer",referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});</script>`;
    body += `<noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute;left:-9999px" alt=""></div></noscript>`;
  }
  return { head, body };
}

const raw = readFileSync(path.join(process.cwd(), "src/app/_home/home.html"), "utf8");

const homeHtml = (() => {
  const { head, body } = analytics();
  return raw.replace("<!--HEAD_EXTRA-->", head).replace("<!--BODY_EXTRA-->", body);
})();

const data: Data = (() => {
  const code = raw.match(/<script id="tsdata">([\s\S]*?)<\/script>/)?.[1];
  if (!code) throw new Error("home.html: no <script id=\"tsdata\"> block");
  const ctx = vm.createContext({ __paths: true });
  return vm.runInContext(`${code}\n;({renderCase,caseCnt,WORKS,CASES})`, ctx) as Data;
})();

const attr = (s: string) =>
  s.replace(/&/g, "&amp;").replace(/"/g, "&quot;").replace(/</g, "&lt;");

/** Swaps one exact fragment and fails loudly if the page markup has drifted. */
function swap(html: string, from: string, to: string) {
  if (!html.includes(from)) throw new Error(`home.html: "${from.slice(0, 60)}" not found`);
  return html.replace(from, () => to);
}

export const caseSlugs = () => data.WORKS.filter((w) => data.CASES[w.slug]).map((w) => w.slug);

export function homePage() {
  return homeHtml;
}

export function casePage(slug: string): string | null {
  const work = data.WORKS.find((w) => w.slug === slug);
  const c = data.CASES[slug];
  if (!work || !c) return null;

  const url = `${SITE}/cases/${slug}`;
  const title = `${work.n} — кейс TETSAB`;
  const description = c.lead;
  const image = c.real ? `${SITE}${c.real.desk}` : `${SITE}/og.jpg`;

  let html = homeHtml;
  const homeTitle = html.match(/<title>([^<]*)<\/title>/)?.[1] ?? "TETSAB";
  html = html.replace(/<title>[^<]*<\/title>/, `<title>${attr(title)}</title>`);
  html = html.replace(/(<meta name="description" content=")[^"]*"/, `$1${attr(description)}"`);
  html = html.replace(/(<link rel="canonical" href=")[^"]*"/, `$1${url}"`);
  html = html.replace(/(<meta property="og:type" content=")[^"]*"/, `$1article"`);
  html = html.replace(/(<meta property="og:url" content=")[^"]*"/, `$1${url}"`);
  html = html.replace(/(<meta property="og:title" content=")[^"]*"/, `$1${attr(title)}"`);
  html = html.replace(/(<meta property="og:description" content=")[^"]*"/, `$1${attr(description)}"`);
  html = html.replace(/(<meta property="og:image" content=")[^"]*"/, `$1${image}"`);
  // the size tags describe the site-wide card, not a case screenshot
  if (c.real) html = html.replace(/<meta property="og:image:(width|height)" content="\d+">\n/g, "");

  // open sheet, page locked behind it, no preloader
  html = swap(html, '<html lang="ru">', `<html lang="ru" class="lock" data-title="${homeTitle}">`);
  html = swap(html, '<div class="pre" id="pre"', '<div class="pre gone" id="pre"');
  html = swap(
    html,
    '<div class="case" id="case" role="dialog" aria-modal="true" aria-labelledby="caseT" inert>',
    '<div class="case open" id="case" role="dialog" aria-modal="true" aria-labelledby="caseT">',
  );
  html = swap(html, '<span class="cnt" id="caseCnt"></span>', `<span class="cnt" id="caseCnt">${data.caseCnt(slug)}</span>`);
  html = swap(html, '<div id="caseBody"></div>', `<div id="caseBody">${data.renderCase(slug)}</div>`);
  return html;
}

export const htmlResponse = (html: string, status = 200) =>
  new Response(html, { status, headers: { "Content-Type": "text/html; charset=utf-8" } });
