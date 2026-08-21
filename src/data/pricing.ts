export interface PricingItem {
  title: string;
  price: string;
  note?: string;
}

export const pricingItems: PricingItem[] = [
  { title: "Сайт-визитка", price: "от 15 000 ₽" },
  { title: "Лендинг", price: "от 20 000 ₽" },
  { title: "Сайт + онлайн-запись", price: "от 25 000 ₽" },
  { title: "Telegram-бот", price: "от 10 000 ₽" },
  { title: "AI-фото", price: "от 500 ₽", note: "за фото" },
  { title: "AI-контент под задачу", price: "от 3 000 ₽" },
];
