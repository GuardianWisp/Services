import type { LucideIcon } from "lucide-react";
import {
  LayoutTemplate,
  Sparkles,
  PenTool,
  Clapperboard,
  Bot,
  Cake,
  Car,
  Home as HomeIcon,
} from "lucide-react";

export type PortfolioCategory =
  | "Website"
  | "AI Content"
  | "Branding"
  | "Motion"
  | "Automation";

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
  "Branding",
  "Motion",
  "Automation",
];

export const portfolioItems: PortfolioItem[] = [
  {
    id: "master-site",
    title: "Сайт мастера маникюра",
    category: "Website",
    description: "Сайт-визитка с онлайн-записью и Telegram-заявками.",
    icon: LayoutTemplate,
    gradient: "from-orange-200 via-orange-100 to-white",
    isDemo: true,
  },
  {
    id: "cake-ai",
    title: "AI-фотосессия тортов",
    category: "AI Content",
    description: "Обычные фото тортов превращены в рекламные визуалы.",
    icon: Cake,
    gradient: "from-rose-200 via-orange-100 to-white",
    isDemo: true,
  },
  {
    id: "service-landing",
    title: "Лендинг локальной услуги",
    category: "Website",
    description: "Одностраничник с формой заявки и адаптацией под мобильные.",
    icon: LayoutTemplate,
    gradient: "from-neutral-200 via-neutral-100 to-white",
    isDemo: true,
  },
  {
    id: "auto-ai",
    title: "Обработка фото автомобиля",
    category: "AI Content",
    description: "Замена фона и улучшение качества для продажи авто.",
    icon: Car,
    gradient: "from-orange-200 via-amber-100 to-white",
    isDemo: true,
  },
  {
    id: "brand-identity",
    title: "Айдентика частного специалиста",
    category: "Branding",
    description: "Логотип, цвета и стиль для личного бренда.",
    icon: PenTool,
    gradient: "from-neutral-300 via-neutral-100 to-white",
    isDemo: true,
  },
  {
    id: "booking-bot",
    title: "Бот записи клиентов",
    category: "Automation",
    description: "Telegram-бот с выбором услуги и уведомлением владельцу.",
    icon: Bot,
    gradient: "from-orange-200 via-orange-50 to-white",
    isDemo: true,
  },
  {
    id: "realty-ai",
    title: "Обработка фото интерьера",
    category: "AI Content",
    description: "Улучшение качества и лёгкая ретушь фото недвижимости.",
    icon: HomeIcon,
    gradient: "from-amber-100 via-neutral-100 to-white",
    isDemo: true,
  },
  {
    id: "promo-motion",
    title: "Анимационный промо-баннер",
    category: "Motion",
    description: "Короткая анимация для соцсетей и сторис.",
    icon: Clapperboard,
    gradient: "from-neutral-200 via-orange-50 to-white",
    isDemo: true,
  },
  {
    id: "faq-bot",
    title: "FAQ-бот и каталог услуг",
    category: "Automation",
    description: "Автоответы на частые вопросы прямо в Telegram.",
    icon: Sparkles,
    gradient: "from-orange-100 via-neutral-100 to-white",
    isDemo: true,
  },
];
