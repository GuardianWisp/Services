# Nikita Isaev — сайт-визитка

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
- **`src/data/services.ts`** — три карточки услуг.
- **`src/data/pricing.ts`** — стартовые цены.
- **`src/data/process.ts`** — шаги процесса работы.
- **`src/data/faq.ts`** — вопросы и ответы.
- **`src/data/portfolio.ts`** — карточки портфолио и категории фильтра.
- **`src/data/aiShowcase.ts`** — примеры для before/after слайдера.
- **`src/data/websites.ts`** — примеры сайтов и список фич.

Проекты в портфолио помечены `isDemo: true` — это демо-заглушки на CSS/иконках
без реальных фото, их можно заменить на реальные кейсы позже.

## Проверки перед деплоем

```bash
npx tsc --noEmit   # TypeScript
npx eslint .       # ESLint
npm run build      # production build
```

## Деплой на Vercel

Проект полностью статический (все страницы пререндерятся), деплоится на
[Vercel](https://vercel.com/new) без дополнительной настройки.
