# Isaeva — сайт-визитка

Next.js 16 · TypeScript · Tailwind CSS v4 · Framer Motion · Lucide Icons.

## Разработка

```bash
npm run dev
```

Открыть [http://localhost:3000](http://localhost:3000).

## Что и где менять

Все изменяемые данные вынесены из компонентов в `src/config` и `src/data`:

- **`src/config/site.ts`** — имя, роль, локация, email и **Telegram username**
  (константа `TELEGRAM_USERNAME` в начале файла — единственное место, где его
  нужно поменять, дальше он используется везде: навбар, hero, плавающая
  кнопка, AI-showcase, финальный CTA, футер).
- **`src/data/services.ts`** — карточки услуг.
- **`src/data/pricing.ts`** — стартовые цены.
- **`src/data/process.ts`** — шаги процесса работы.
- **`src/data/faq.ts`** — вопросы и ответы.
- **`src/data/portfolio.ts`** — карточки портфолио и категории фильтра.
- **`src/data/aiShowcase.ts`** — примеры для before/after слайдера.
- **`src/data/websites.ts`** — примеры сайтов и список фич.

Проекты в портфолио помечены `isDemo: true` — это демо-заглушки на CSS/иконках
без реальных фото, их можно заменить на реальные кейсы позже.

## Переменные окружения

Скопируйте `.env.example` в `.env.local` и заполните:

- **`TELEGRAM_BOT_TOKEN`** и **`TELEGRAM_CHAT_ID`** — заявки с формы на сайте
  (секция «Есть идея? Давайте сделаем.») отправляются в Telegram через бота.
  Создайте бота через [@BotFather](https://t.me/BotFather), получите токен,
  напишите боту любое сообщение (или добавьте его в группу), затем откройте
  `https://api.telegram.org/bot<токен>/getUpdates`, чтобы узнать `chat_id`.
  Без этих переменных форма вернёт ошибку и предложит написать в Telegram
  напрямую.
- **`NEXT_PUBLIC_GA_MEASUREMENT_ID`** — id счётчика Google Analytics (GA4,
  вида `G-XXXXXXXXXX`) с [analytics.google.com](https://analytics.google.com).
  Если оставить пустым, счётчик просто не подключается.
- **`NEXT_PUBLIC_YANDEX_METRIKA_ID`** — номер счётчика с
  [metrika.yandex.ru](https://metrika.yandex.ru) (просто число). Работает
  одновременно с Google Analytics, не заменяет его.

На сервере эти же переменные задаются в окружении процесса (см. раздел про
деплой ниже), а не в `.env.local`.

## Проверки перед деплоем

```bash
npx tsc --noEmit   # TypeScript
npx eslint .       # ESLint
npm run build      # production build
```

## Деплой на Beget (VPS)

Домен: **tetsub.ru**. Сайт собирается в standalone-режим (`output:
"standalone"` в `next.config.ts`) — это отдельный Node-сервер без
Vercel-специфики, который держит PM2 за nginx.

Нужен именно **VPS/Cloud-сервер** на Beget с Node.js (обычный shared Node.js
хостинг Beget слишком ограничен для PM2 + свой nginx).

### Первичная настройка сервера (один раз)

1. **DNS** — у регистратора домена (или в DNS-панели Beget, если домен тоже
   там) укажите A-запись `tetsub.ru` → IP сервера, и такую же для `www`.
2. **SSH на сервер**, установите Node.js (LTS, версия из `.nvmrc`/см. локально
   `node -v`), `npm i -g pm2`, `nginx`, `certbot`.
3. Склонируйте репозиторий на сервер, скопируйте `.env.example` →
   `.env.production` (или задайте переменные прямо в `ecosystem.config.js`) и
   заполните `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`,
   `NEXT_PUBLIC_GA_MEASUREMENT_ID`, `NEXT_PUBLIC_YANDEX_METRIKA_ID`.
4. Запустите первый билд и старт:
   ```bash
   ./scripts/deploy.sh
   ```
5. **nginx** — возьмите `deploy/nginx.conf.example` как основу конфига для
   `tetsub.ru`, включите сайт (`sites-available` → `sites-enabled`,
   `nginx -t && systemctl reload nginx`).
6. **SSL**:
   ```bash
   certbot --nginx -d tetsub.ru -d www.tetsub.ru
   ```

### Последующие деплои

```bash
git pull
./scripts/deploy.sh
```

`scripts/deploy.sh` пересобирает проект, докладывает статику в
`.next/standalone` (standalone-режим не копирует её сам) и перезапускает
процесс через `pm2 startOrRestart ecosystem.config.js`.
