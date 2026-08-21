export interface WebsiteExample {
  id: string;
  title: string;
  type: string;
}

export const websiteExamples: WebsiteExample[] = [
  { id: "master", title: "Сайт мастера", type: "Визитка" },
  { id: "local-service", title: "Локальная услуга", type: "Лендинг" },
  { id: "small-business", title: "Небольшой бизнес", type: "Сайт услуг" },
  { id: "product-landing", title: "Товар", type: "Лендинг" },
];

export const websiteFeatures = [
  "Мобильная версия",
  "Форма заявки",
  "Telegram",
  "Онлайн-запись",
  "SEO-основа",
];
