import { siteConfig } from "@/config/site";
import { docFooter, docHeader, docPage } from "../_home/doc";
import { analytics, htmlResponse } from "../_home/render";

// Privacy policy in the homepage's own look (it is linked from the contact form and the footer).
export const dynamic = "force-static";

// operator of personal data, as on burenie124.ru
const OPERATOR = { name: "Исаев Никита Сергеевич", status: "самозанятый", inn: "246007197037", city: "г. Красноярск" };

const ext = (href: string, text: string) => `<a href="${href}" target="_blank" rel="noopener noreferrer">${text}</a>`;

const SECTIONS: [string, string][] = [
  [
    "Общие положения",
    `<p>Настоящая политика определяет, как студия TETSAB обрабатывает персональные данные посетителей сайта ${siteConfig.url}. Оператор персональных данных — ${OPERATOR.name} (${OPERATOR.status}, ИНН ${OPERATOR.inn}, ${OPERATOR.city}), далее — «Исполнитель». Используя сайт и отправляя заявку, вы соглашаетесь с условиями этой политики.</p>`,
  ],
  [
    "Какие данные собираются",
    `<p>При отправке формы заявки на сайте:</p><ul><li>имя;</li><li>контакт для связи (Telegram, MAX, телефон или email);</li><li>ссылка на соцсеть или сайт, если вы её указали;</li><li>содержание сообщения, если вы его оставили.</li></ul>
     <p>При посещении сайта — обезличенные технические данные (IP-адрес, тип устройства, источник перехода, действия на странице) через сервисы Google Analytics и Яндекс.Метрика.</p>`,
  ],
  [
    "Цели обработки",
    "<p>Данные из формы заявки используются только для того, чтобы связаться с вами и обсудить проект. Технические данные — чтобы понимать, как посетители пользуются сайтом, и улучшать его.</p>",
  ],
  [
    "Передача третьим лицам",
    `<p>Данные из формы заявки не передаются третьим лицам и используются только Исполнителем. Заявка доставляется в Telegram Исполнителя через Telegram Bot API. Аналитика собирается сервисами Google Analytics и Яндекс.Метрика в соответствии с ${ext("https://policies.google.com/privacy", "политикой конфиденциальности Google")} и ${ext("https://yandex.ru/legal/confidential/", "политикой конфиденциальности Яндекса")}.</p>`,
  ],
  [
    "Хранение данных",
    "<p>Данные заявок хранятся в переписке Telegram и используются только для обработки вашего обращения. Вы можете попросить удалить свои данные в любой момент.</p>",
  ],
  [
    "Ваши права",
    `<p>Вы можете запросить информацию о своих данных, попросить их исправить или удалить, а также отозвать согласие на обработку — напишите на <a href="mailto:${siteConfig.email}">${siteConfig.email}</a> или в ${ext(siteConfig.telegramUrl, "Telegram")}.</p>`,
  ],
  ["Изменения политики", "<p>Политика может обновляться. Актуальная версия всегда доступна на этой странице.</p>"],
];

const css = `
.pv-hero{padding:clamp(72px,14vh,140px) var(--gut) 0}
.pv-hero h1{font-size:clamp(2.8rem,9vw,8rem);line-height:.92;letter-spacing:-.055em;color:var(--tx);max-width:11ch}
.pv-meta{display:grid;grid-template-columns:repeat(3,1fr);gap:16px;margin-top:48px;padding-top:16px;border-top:1px solid var(--line);font-size:15px;color:var(--tx)}
.pv-meta small{display:block;font-size:13px;color:var(--mute);margin-bottom:4px}
.pv-body{padding:clamp(64px,12vh,120px) var(--gut) clamp(80px,14vh,160px)}
.pv-sec{display:grid;grid-template-columns:1fr 1fr;column-gap:var(--gut);padding-block:28px 36px;border-top:1px solid var(--line)}
.pv-sec:last-child{border-bottom:1px solid var(--line)}
.pv-sec h2{font-size:14px;color:var(--tx);display:flex;gap:14px}
.pv-sec h2 i{font-style:normal;color:var(--mute);font-variant-numeric:tabular-nums}
.pv-txt{display:grid;gap:14px;max-width:56ch;font-size:clamp(1.05rem,1.4vw,1.2rem);line-height:1.45;letter-spacing:-.01em;color:var(--blk)}
.pv-txt ul{margin:0;padding:0;list-style:none;display:grid;gap:4px}
.pv-txt li{display:flex;gap:12px}
.pv-txt li::before{content:"—";color:var(--mute)}
.pv-txt a{text-decoration:underline;text-decoration-color:rgba(0,0,0,.25);text-underline-offset:3px;transition:text-decoration-color .3s}
.pv-txt a:hover{text-decoration-color:var(--blk)}
@media (max-width:860px){.pv-sec{grid-template-columns:1fr;row-gap:14px}.pv-meta{grid-template-columns:1fr 1fr}}
`;

const body = `${docHeader()}
<main>
  <header class="pv-hero">
    <span class="d-lab d-in">(Документ)</span>
    <h1 class="d-in">Политика конфиденциальности</h1>
    <div class="pv-meta d-in"><div><small>Оператор</small>${OPERATOR.name}<br>ИНН ${OPERATOR.inn}</div><div><small>Обновлено</small>${siteConfig.year}</div><div><small>Вопросы по данным</small><a href="mailto:${siteConfig.email}">${siteConfig.email}</a></div></div>
  </header>
  <div class="pv-body">
    ${SECTIONS.map(([t, html], i) => `<section class="pv-sec"><h2><i>${String(i + 1).padStart(2, "0")}</i>${t}</h2><div class="pv-txt">${html}</div></section>`).join("\n    ")}
  </div>
</main>
${docFooter}`;

export function GET() {
  const { head, body: tail } = analytics();
  return htmlResponse(
    docPage({
      title: "Политика конфиденциальности — TETSAB",
      description: "Как TETSAB обрабатывает персональные данные посетителей сайта tetsab.ru и заявок из формы.",
      canonical: "https://tetsab.ru/privacy",
      css,
      head,
      body: body + tail,
    }),
  );
}
