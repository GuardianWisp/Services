import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Reveal } from "@/components/ui/Reveal";
import { TelegramIcon } from "@/components/ui/TelegramIcon";
import { LeadForm } from "@/components/sections/LeadForm";

export function CTA() {
  return (
    <section id="contact" className="py-24 sm:py-32">
      <Container>
        <Reveal>
          <div className="relative overflow-hidden rounded-[2.5rem] bg-ink px-6 py-16 text-center sm:px-12 sm:py-24">
            <div className="relative">
              <h2 className="text-balance text-3xl font-medium tracking-tight text-paper sm:text-4xl md:text-5xl">
                Есть идея? Давайте сделаем.
              </h2>
              <p className="mx-auto mt-5 max-w-xl text-balance text-base leading-relaxed text-paper/70 sm:text-lg">
                Напишите, что вам нужно — сайт, фотографии, Telegram-бот или
                что-то другое. Я предложу подходящий вариант и ориентировочную
                стоимость.
              </p>
              <div className="mt-9 flex justify-center">
                <LeadForm />
              </div>

              <div className="mx-auto mt-8 flex max-w-md items-center gap-4 text-xs uppercase tracking-[0.18em] text-paper/40">
                <span className="h-px flex-1 bg-paper/15" />
                или
                <span className="h-px flex-1 bg-paper/15" />
              </div>

              <div className="mt-6 flex justify-center">
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-sm text-paper/60 underline decoration-paper/30 underline-offset-4 transition-colors hover:text-paper"
                >
                  <TelegramIcon className="h-4 w-4" />
                  Написать в Telegram
                </a>
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
