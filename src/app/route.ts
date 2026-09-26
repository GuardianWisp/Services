import { readFileSync } from "node:fs";
import path from "node:path";

// The homepage is a single hand-built HTML page (src/app/_home/home.html),
// served as-is. Analytics tags are injected here from the same env vars
// the layout uses. The previous React homepage lives at /old.
export const dynamic = "force-static";

const GA_MEASUREMENT_ID = process.env.NEXT_PUBLIC_GA_MEASUREMENT_ID;
const YANDEX_METRIKA_ID = process.env.NEXT_PUBLIC_YANDEX_METRIKA_ID;

function analytics() {
  let head = "";
  let body = "";
  if (GA_MEASUREMENT_ID) {
    head += `<script async src="https://www.googletagmanager.com/gtag/js?id=${GA_MEASUREMENT_ID}"></script>
<script>window.dataLayer=window.dataLayer||[];function gtag(){dataLayer.push(arguments);}gtag('js',new Date());gtag('config','${GA_MEASUREMENT_ID}');</script>`;
  }
  if (YANDEX_METRIKA_ID) {
    head += `<script>window.__ymId=${YANDEX_METRIKA_ID};(function(m,e,t,r,i,k,a){m[i]=m[i]||function(){(m[i].a=m[i].a||[]).push(arguments)};m[i].l=1*new Date();for(var j=0;j<document.scripts.length;j++){if(document.scripts[j].src===r){return;}}k=e.createElement(t),a=e.getElementsByTagName(t)[0],k.async=1,k.src=r,a.parentNode.insertBefore(k,a)})(window,document,"script","https://mc.yandex.ru/metrika/tag.js?id=${YANDEX_METRIKA_ID}","ym");ym(${YANDEX_METRIKA_ID},"init",{ssr:true,webvisor:true,clickmap:true,referrer:document.referrer,url:location.href,accurateTrackBounce:true,trackLinks:true});</script>`;
    body += `<noscript><div><img src="https://mc.yandex.ru/watch/${YANDEX_METRIKA_ID}" style="position:absolute;left:-9999px" alt=""></div></noscript>`;
  }
  return { head, body };
}

const html = (() => {
  const raw = readFileSync(
    path.join(process.cwd(), "src/app/_home/home.html"),
    "utf8",
  );
  const { head, body } = analytics();
  return raw.replace("<!--HEAD_EXTRA-->", head).replace("<!--BODY_EXTRA-->", body);
})();

export function GET() {
  return new Response(html, {
    headers: { "Content-Type": "text/html; charset=utf-8" },
  });
}
