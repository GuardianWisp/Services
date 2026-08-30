import type { Metadata } from "next";
import Link from "next/link";
import { ArrowLeft } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Footer } from "@/components/Footer";

export const metadata: Metadata = {
  title: "Политика конфиденциальности",
  description:
    "Как обрабатываются персональные данные посетителей сайта " +
    siteConfig.name,
};

export default function PrivacyPage() {
  return (
    <>
      <header className="border-b border-line py-6">
        <Container className="flex items-center justify-between">
          <Link
            href="/"
            className="inline-flex items-center gap-2 text-sm text-muted transition-colors hover:text-ink"
          >
            <ArrowLeft className="h-4 w-4" />
            На главную
          </Link>
          <span className="text-sm font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </span>
        </Container>
      </header>

      <main className="flex-1 py-16 sm:py-24">
        <Container className="max-w-3xl">
          <h1 className="text-balance text-3xl font-medium tracking-tight text-ink sm:text-4xl">
            Политика конфиденциальности
          </h1>
          <p className="mt-3 text-sm text-muted">
            Последнее обновление: {new Date().getFullYear()} год
          </p>

          <div className="mt-10 space-y-8 text-base leading-relaxed text-ink/90">
            <section>
              <h2 className="text-lg font-medium text-ink">1. Общие положения</h2>
              <p className="mt-2">
                Настоящая политика определяет, как {siteConfig.name} (далее —
                «Исполнитель») обрабатывает персональные данные посетителей
                сайта {siteConfig.url}. Используя сайт и отправляя заявку,
                вы соглашаетесь с условиями этой политики.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">
                2. Какие данные собираются
              </h2>
              <p className="mt-2">При отправке формы заявки на сайте:</p>
              <ul className="mt-2 list-disc space-y-1 pl-5">
                <li>имя;</li>
                <li>контакт для связи (Telegram, телефон или email);</li>
                <li>содержание сообщения, если вы его оставили.</li>
              </ul>
              <p className="mt-2">
                При посещении сайта — обезличенные технические данные
                (IP-адрес, тип устройства, источник перехода, действия на
                странице) через сервисы Google Analytics и Яндекс.Метрика.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">
                3. Цели обработки
              </h2>
              <p className="mt-2">
                Данные из формы заявки используются только для того, чтобы
                связаться с вами и обсудить проект. Технические данные —
                чтобы понимать, как посетители пользуются сайтом, и
                улучшать его.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">
                4. Передача данных третьим лицам
              </h2>
              <p className="mt-2">
                Данные из формы заявки не передаются третьим лицам и
                используются только Исполнителем. Заявка доставляется в
                Telegram Исполнителя через Telegram Bot API. Аналитика
                собирается сервисами Google Analytics и Яндекс.Метрика в
                соответствии с{" "}
                <a
                  href="https://policies.google.com/privacy"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent-ink"
                >
                  политикой конфиденциальности Google
                </a>{" "}
                и{" "}
                <a
                  href="https://yandex.ru/legal/confidential/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent-ink"
                >
                  политикой конфиденциальности Яндекса
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">
                5. Хранение данных
              </h2>
              <p className="mt-2">
                Данные заявок хранятся в переписке Telegram и используются
                только для обработки вашего обращения. Вы можете попросить
                удалить свои данные в любой момент.
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">6. Ваши права</h2>
              <p className="mt-2">
                Вы можете запросить информацию о своих данных, попросить их
                исправить или удалить, а также отозвать согласие на
                обработку — напишите на{" "}
                <a
                  href={`mailto:${siteConfig.email}`}
                  className="underline hover:text-accent-ink"
                >
                  {siteConfig.email}
                </a>{" "}
                или в{" "}
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline hover:text-accent-ink"
                >
                  Telegram
                </a>
                .
              </p>
            </section>

            <section>
              <h2 className="text-lg font-medium text-ink">
                7. Изменения политики
              </h2>
              <p className="mt-2">
                Политика может обновляться. Актуальная версия всегда
                доступна на этой странице.
              </p>
            </section>
          </div>
        </Container>
      </main>

      <Footer />
    </>
  );
}
