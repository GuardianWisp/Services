import type { LucideIcon } from "lucide-react";
import { Palette, Sparkles, PenLine, Bot, Box } from "lucide-react";

export interface Service {
  index: string;
  icon: LucideIcon;
  title: string;
  description: string;
  items: string[];
  price: string;
  href: string;
}

export const services: Service[] = [
  {
    index: "01",
    icon: Palette,
    title: "Дизайн и сайты",
    description:
      "Дизайн и сайты с AI-вайбкодингом — от макета до готового сайта в короткие сроки.",
    items: [
      "Лендинги",
      "Сайты-визитки",
      "UI/UX-дизайн",
      "AI-вайбкодинг",
      "Фирменный стиль",
    ],
    price: "от 15 000 ₽",
    href: "#websites",
  },
  {
    index: "02",
    icon: Sparkles,
    title: "AI-контент",
    description:
      "Превращаю обычные фотографии товаров и услуг в профессиональный рекламный контент.",
    items: [
      "AI-фотосессия",
      "Удаление объектов",
      "Замена фона",
      "Рекламные изображения",
      "Улучшение качества",
    ],
    price: "от 500 ₽ / фото",
    href: "#ai",
  },
  {
    index: "03",
    icon: PenLine,
    title: "Продающие тексты",
    description:
      "Тексты, которые объясняют ценность и подводят к заявке — для сайта, соцсетей и карточек товаров.",
    items: [
      "Тексты для сайта",
      "Посты для соцсетей",
      "Карточки товаров",
      "Email-рассылки",
      "Скрипты продаж",
    ],
    price: "от 2 000 ₽",
    href: "#contact",
  },
  {
    index: "04",
    icon: Bot,
    title: "Telegram-боты",
    description:
      "Боты для записи клиентов, приёма заявок и уведомлений — без сложных CRM.",
    items: [
      "Запись клиентов",
      "Приём заявок",
      "FAQ",
      "Каталог",
      "Уведомления",
    ],
    price: "от 10 000 ₽",
    href: "#bots",
  },
  {
    index: "05",
    icon: Box,
    title: "3D-контент",
    description:
      "3D-визуализация товаров, рекламные рендеры и анимация, которые выделяют продукт.",
    items: [
      "3D-модели товаров",
      "Рекламные рендеры",
      "Анимация продукта",
      "3D для соцсетей",
      "Упаковка и мокапы",
    ],
    price: "по запросу",
    href: "#contact",
  },
];
