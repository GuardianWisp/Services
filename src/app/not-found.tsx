import type { Metadata } from "next";
import { docCss, docFonts, docFooter, docHeader } from "./_home/doc";

// 404 in the homepage's look. It renders inside the root layout, so the page's own fonts and
// tokens come with it and the body is restyled from here.
export const metadata: Metadata = { title: { absolute: "Страница не найдена — TETSAB" } };

const css = `
body{margin:0!important;background:#F5F5F5!important;color:#434343!important;font:400 16px/1.5 "Golos Text",system-ui,-apple-system,"Segoe UI",sans-serif!important}
.nf{min-height:100svh;display:flex;flex-direction:column}
.nf-main{flex:1;display:grid;align-content:center;gap:28px;padding:48px var(--gut) 64px}
.nf-mark{font-size:clamp(9rem,40vw,34rem);line-height:.78;letter-spacing:-.07em;color:var(--blk);margin-left:-.05em;user-select:none}
.nf-row{display:grid;grid-template-columns:1fr 1fr;column-gap:var(--gut);align-items:end;gap:24px}
.nf-say{font-size:clamp(1.6rem,3.4vw,2.5rem);line-height:1.16;letter-spacing:-.02em;max-width:22ch;color:var(--tx)}
.nf-say span{color:var(--mute)}
.nf-cta{display:flex;flex-wrap:wrap;gap:10px}
@media (max-width:860px){.nf-row{grid-template-columns:1fr}}
`;

const html = `<div class="doc nf">${docHeader("")}
<main class="nf-main">
  <span class="d-lab d-in" style="margin-left:0">(Ошибка 404 · читается одинаково с обеих сторон)</span>
  <p class="nf-mark d-in" aria-hidden="true">404</p>
  <div class="nf-row d-in">
    <h1 class="nf-say">Такой страницы нет. <span>Ссылка устарела или в ней опечатка.</span></h1>
    <div class="nf-cta"><a class="d-pill lime" href="/">На главную</a><a class="d-pill ghost" href="/#works">Посмотреть работы</a></div>
  </div>
</main>
${docFooter}</div>`;

export default function NotFound() {
  return (
    <>
      <div dangerouslySetInnerHTML={{ __html: `${docFonts}<style>${docCss}${css}</style>` }} />
      <div dangerouslySetInnerHTML={{ __html: html }} />
    </>
  );
}
