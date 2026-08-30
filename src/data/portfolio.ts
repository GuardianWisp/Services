import type { LucideIcon } from "lucide-react";
import {
  LayoutTemplate,
  Sparkles,
  PenTool,
  PenLine,
  Clapperboard,
  Bot,
  Box,
  Cake,
  Car,
  Home as HomeIcon,
} from "lucide-react";

export type PortfolioCategory =
  | "Website"
  | "AI Content"
  | "Copywriting"
  | "Branding"
  | "Motion"
  | "Bots"
  | "3D";

export interface PortfolioItem {
  id: string;
  title: string;
  category: PortfolioCategory;
  description: string;
  icon: LucideIcon;
  gradient: string;
  isDemo: boolean;
}

export const portfolioCategories: PortfolioCategory[] = [
  "Website",
  "AI Content",
  "Copywriting",
  "Branding",
  "Motion",
  "Bots",
  "3D",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "master-site",
    title: "Сайт мастера маникюра",
    category: "Website",
    description: "Сайт-визитка с онлайн-записью и Telegram-заявками.",
    icon: LayoutTemplate,
    gradient:
      "from-orange-200 via-orange-100 to-white dark:from-orange-950 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "cake-ai",
    title: "AI-фотосессия тортов",
    category: "AI Content",
    description: "Обычные фото тортов превращены в рекламные визуалы.",
    icon: Cake,
    gradient:
      "from-rose-200 via-orange-100 to-white dark:from-rose-950 dark:via-orange-950 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "service-landing",
    title: "Лендинг локальной услуги",
    category: "Website",
    description: "Одностраничник с формой заявки и адаптацией под мобильные.",
    icon: LayoutTemplate,
    gradient:
      "from-neutral-200 via-neutral-100 to-white dark:from-neutral-800 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "auto-ai",
    title: "Обработка фото автомобиля",
    category: "AI Content",
    description: "Замена фона и улучшение качества для продажи авто.",
    icon: Car,
    gradient:
      "from-orange-200 via-amber-100 to-white dark:from-orange-950 dark:via-amber-950 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "landing-copy",
    title: "Продающий текст для лендинга",
    category: "Copywriting",
    description: "Текст, который объясняет ценность и ведёт к заявке.",
    icon: PenLine,
    gradient:
      "from-yellow-100 via-amber-50 to-white dark:from-yellow-950 dark:via-amber-950 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "brand-identity",
    title: "Айдентика частного специалиста",
    category: "Branding",
    description: "Логотип, цвета и стиль для личного бренда.",
    icon: PenTool,
    gradient:
      "from-neutral-300 via-neutral-100 to-white dark:from-neutral-700 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "booking-bot",
    title: "Бот записи клиентов",
    category: "Bots",
    description: "Telegram-бот с выбором услуги и уведомлением владельцу.",
    icon: Bot,
    gradient:
      "from-orange-200 via-orange-50 to-white dark:from-amber-950 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "realty-ai",
    title: "Обработка фото интерьера",
    category: "AI Content",
    description: "Улучшение качества и лёгкая ретушь фото недвижимости.",
    icon: HomeIcon,
    gradient:
      "from-amber-100 via-neutral-100 to-white dark:from-amber-900 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "product-3d",
    title: "3D-рендер продукта",
    category: "3D",
    description: "Рекламный 3D-рендер товара для карточки и соцсетей.",
    icon: Box,
    gradient:
      "from-sky-100 via-neutral-100 to-white dark:from-sky-950 dark:via-neutral-900 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "promo-motion",
    title: "Анимационный промо-баннер",
    category: "Motion",
    description: "Короткая анимация для соцсетей и сторис.",
    icon: Clapperboard,
    gradient:
      "from-neutral-200 via-orange-50 to-white dark:from-neutral-800 dark:via-orange-950 dark:to-neutral-950",
    isDemo: true,
  },
  {
    id: "faq-bot",
    title: "FAQ-бот и каталог услуг",
    category: "Bots",
    description: "Автоответы на частые вопросы прямо в Telegram.",
    icon: Sparkles,
    gradient:
      "from-orange-100 via-neutral-100 to-white dark:from-orange-950 dark:via-neutral-800 dark:to-neutral-950",
    isDemo: true,
  },
];
