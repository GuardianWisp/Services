@AGENTS.md

<!-- BEGIN: контекст проекта -->
# Tetsab — контекст для Claude Code

**Начни с `git pull` и прочитай README перед работой.**

## Стек
Next.js 16.3 (App Router, правила версии — в AGENTS.md выше), TypeScript, Tailwind CSS v4, Framer Motion,
Lucide; three.js — локальная копия в `public/vendor`. Менеджер пакетов — npm (`package-lock.json`).

## Структура
- `src/app/route.ts` + `src/app/_home/` — главная: одна HTML-страница, собранная вручную (`home.html`, `render.ts`).
  Старая React-главная живёт на `/old` (`src/app/old/page.tsx`).
- `src/app/cases/`, `contacts/`, `privacy/`, `studio/` — страницы через route handlers.
- `src/app/api/contact/route.ts` — форма заявки → Telegram (`TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`).
- `src/components/sections/*` — секции React-версии; `src/components/ui/*` — базовые компоненты.
- `src/config/site.ts` — имя, контакты, `TELEGRAM_USERNAME`, url `https://tetsab.ru`.
- `src/data/*` — услуги, цены, FAQ, портфолио и т. д.
- `public/os-studio.html` — самостоятельный инструмент OS·STUDIO, отдаётся на `/os` (noindex, rewrite в `next.config.ts`).
- `public/hero`, `reel`, `img`, `fonts` — медиа и шрифты; правила кэширования — в `next.config.ts`.
- `scripts/deploy.sh`, `deploy/nginx.conf.example` — деплой на VPS Beget.

## Что сделано (по git log)
С 22.08.2026: одностраничный сайт услуг → портфолио-кейсы (BPR, Фотоника, Твердь, ИСТ, Art Life, Ателье Ваниль и др.),
3D-hero со стеклом на three.js, прелоадер, демо Telegram-ботов, форма заявок в Telegram, GA4 + Яндекс Метрика,
деплой на Beget. 20.10 добавлен OS·STUDIO на `/os`; 22.10 главная перестроена: сначала дизайн и сайты, боты — как дополнение.

## В планах
TODO: уточнить у Никиты. Открытых задач в коде и документах нет.

## Договорённости
- Сообщения коммитов на английском, в формате «Область: что сделано» (`Works: …`, `Hero glass: …`).
- Проверки перед коммитом: `npx tsc --noEmit`, `npx eslint .`, `npm run build`.
- Нельзя ломать: отправку формы `/api/contact`, `/os` (rewrite + noindex), заголовки кэша в `next.config.ts`,
  работу без env-переменных в dev.
- Деплой — не Vercel: после push в `main` вручную запускается `scripts/deploy.sh` на сервере (порт 3001, PM2 `tetsab`).
- GitHub-репозиторий называется `Services`; папка `C:\Repositories\Services` — его устаревшая копия, в ней не работать.
- Значения из `.env*` не читать и не выводить.
<!-- END: контекст проекта -->
