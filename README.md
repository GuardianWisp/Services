# Tetsab — сайт-визитка

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

Домен: **tetsab.ru**. Живёт на том же VPS, что и другой сайт
(`burenie124.ru`) — те же паттерны: обычный `next start` под PM2, nginx
проксирует, SSL через certbot. Порт **3001** (3000 уже занят burenie).

### Первичная настройка (один раз)

1. **DNS** — A-запись `tetsab.ru` (и `www`) → IP сервера.
2. На сервере: `mkdir -p /var/www/tetsab && cd /var/www/tetsab`, склонировать
   репозиторий, `npm ci`.
3. Завести `/var/www/tetsab/.env` (не в git) с `TELEGRAM_BOT_TOKEN`,
   `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
   `NEXT_PUBLIC_YANDEX_METRIKA_ID`.
4. `npm run build`, затем `PORT=3001 pm2 start npm --name tetsab -- start` и
   `pm2 save`.
5. **nginx** — `deploy/nginx.conf.example` → `/etc/nginx/sites-available/tetsab.ru`,
   симлинк в `sites-enabled`, `nginx -t && systemctl reload nginx`.
6. **SSL**: `certbot --nginx -d tetsab.ru -d www.tetsab.ru`.

### Последующие деплои

```bash
ssh root@<сервер> "/var/www/tetsab/scripts/deploy.sh"
```

`scripts/deploy.sh` делает `git pull --ff-only` → `npm ci` → `npm run build`
→ `pm2 restart tetsab --update-env`.
