import type { LucideIcon } from "lucide-react";
import { Cake, Package, Car, Home as HomeIcon, ImageOff } from "lucide-react";

export interface AiShowcaseExample {
  id: string;
  label: string;
  icon: LucideIcon;
  before: string;
  after: string;
}

export const aiShowcaseExamples: AiShowcaseExample[] = [
  {
    id: "cake",
    label: "Торт",
    icon: Cake,
    before: "Фото на кухонном столе",
    after: "Рекламный кадр для соцсетей",
  },
  {
    id: "product",
    label: "Товар",
    icon: Package,
    before: "Фото на телефон",
    after: "Карточка для маркетплейса",
  },
  {
    id: "car",
    label: "Автомобиль",
    icon: Car,
    before: "Фото во дворе",
    after: "Чистый фон, объявление Avito",
  },
  {
    id: "interior",
    label: "Интерьер",
    icon: HomeIcon,
    before: "Тёмное фото комнаты",
    after: "Светлый, чёткий кадр",
  },
  {
    id: "object",
    label: "Без лишнего",
    icon: ImageOff,
    before: "Человек / предмет на фоне",
    after: "Чистая композиция товара",
  },
];
