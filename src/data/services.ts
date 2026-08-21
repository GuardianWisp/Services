import type { LucideIcon } from "lucide-react";
import { Globe, Sparkles, Bot } from "lucide-react";

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
    icon: Globe,
    title: "Сайт",
    description:
      "Лендинг, сайт-визитка или каталог с заявками и записью.",
    items: [
      "Лендинги",
      "Сайты-визитки",
      "Каталоги",
      "Онлайн-запись",
      "Формы заявок",
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
    icon: Bot,
    title: "Автоматизация",
    description:
      "Telegram-боты и простые системы, которые экономят время.",
    items: [
      "Запись клиентов",
      "Приём заявок",
      "FAQ",
      "Каталог",
      "Уведомления",
    ],
    price: "от 10 000 ₽",
    href: "#automation",
  },
];
