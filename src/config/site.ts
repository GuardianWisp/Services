/**
 * Единая точка изменения ключевых данных сайта.
 * Меняйте значения здесь — они автоматически применятся везде.
 */

export const TELEGRAM_USERNAME = "wispsoul";

export const siteConfig = {
  name: "Tetsab",
  role: "Digital-специалист",
  tagline: "Web · AI · Digital",
  location: "Красноярск / онлайн",
  email: "wisplink@icloud.com",
  telegramUsername: TELEGRAM_USERNAME,
  telegramUrl: `https://t.me/${TELEGRAM_USERNAME}`,
  url: "https://tetsab.ru",
  year: 2026,
  description:
    "Сайты, Telegram- и MAX-боты, визуал и онлайн-заказы для малого бизнеса. Красноярск и онлайн.",
} as const;

export const navLinks = [
  { href: "#services", label: "Услуги" },
  { href: "#ai", label: "AI-контент" },
  { href: "#websites", label: "Сайты" },
  { href: "#pricing", label: "Цены" },
  { href: "#portfolio", label: "Работы" },
  { href: "#faq", label: "Вопросы" },
] as const;
