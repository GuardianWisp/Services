/**
 * Единая точка изменения ключевых данных сайта.
 * Меняйте значения здесь — они автоматически применятся везде.
 */

export const TELEGRAM_USERNAME = "wispsoul";

export const siteConfig = {
  name: "Isaeva",
  role: "Digital-специалист",
  tagline: "Web · AI · Digital",
  location: "Красноярск / онлайн",
  email: "wisplink@icloud.com",
  telegramUsername: TELEGRAM_USERNAME,
  telegramUrl: `https://t.me/${TELEGRAM_USERNAME}`,
  url: "https://tetsab.ru",
  year: 2026,
  description:
    "Дизайн и сайты, продающие тексты, Telegram-боты и AI/3D-контент для небольшого бизнеса, мастеров и частных специалистов.",
} as const;

export const navLinks = [
  { href: "#services", label: "Услуги" },
  { href: "#ai", label: "AI-контент" },
  { href: "#websites", label: "Сайты" },
  { href: "#pricing", label: "Цены" },
  { href: "#portfolio", label: "Работы" },
  { href: "#faq", label: "Вопросы" },
] as const;
