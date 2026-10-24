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

<!-- BEGIN: как вернуться к проекту -->
## Как вернуться к проекту

**Что это:** сайт-визитка студии на домене [tetsab.ru](https://tetsab.ru): дизайн, сайты и Telegram-боты
под ключ, с формой заявки, которая уходит в Telegram. На `/os` лежит отдельный инструмент OS·STUDIO
(не индексируется).

**Склонировать** (репозиторий на GitHub называется `Services`, локальная папка — `Tetsab`):

```bash
git clone https://github.com/GuardianWisp/Services.git Tetsab
```

**Запустить:** двойной клик по `start.command` на Mac или `start.bat` на Windows. Лаунчер сделает `git pull`,
при необходимости `npm install`, запустит `npm run dev` и откроет http://localhost:3000.
Вручную:

```bash
npm install
npm run dev
```

**Переменные окружения** (только имена; значения в `.env.local` на компьютере и в `/var/www/tetsab/.env` на сервере,
шаблон — `.env.example`): `TELEGRAM_BOT_TOKEN`, `TELEGRAM_CHAT_ID`, `NEXT_PUBLIC_GA_MEASUREMENT_ID`,
`NEXT_PUBLIC_YANDEX_METRIKA_ID`. Для локальной разработки они не обязательны: без них не работает только
отправка формы и счётчики.

**Деплой:** не Vercel, а VPS Beget (PM2 + nginx, порт 3001). После `git push` в `main` деплой запускается вручную:

```bash
ssh root@<сервер> "/var/www/tetsab/scripts/deploy.sh"
```

Адрес сервера: TODO: уточнить у Никиты. Подробности — раздел «Деплой на Beget (VPS)» выше.

**Откатить:** сделайте `git revert <коммит>`, `git push` и снова запустите `deploy.sh`. Срочный откат прямо на сервере:
`cd /var/www/tetsab && git checkout <коммит> && npm ci && npm run build && pm2 restart tetsab --update-env`.
Потом верните сервер на `main` (`git checkout main`), иначе следующий `deploy.sh` не сработает.

**Работа между Mac и Windows:**

```bash
git pull                      # перед работой (лаунчер делает сам)
git add -A
git commit -m "что сделано"
git push                      # после работы
```
<!-- END: как вернуться к проекту -->
