import { ArrowRight } from "lucide-react";
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
            <div
              aria-hidden="true"
              className="pointer-events-none absolute -top-32 left-1/2 h-[420px] w-[420px] -translate-x-1/2 rounded-full bg-[radial-gradient(circle,color-mix(in_srgb,var(--color-accent)_30%,transparent)_0%,transparent_70%)] blur-2xl"
            />
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
                <a
                  href={siteConfig.telegramUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group inline-flex items-center gap-2 rounded-full bg-accent px-8 py-4 text-base font-medium text-accent-contrast transition-transform duration-300 hover:scale-[1.03] active:scale-[0.98]"
                >
                  <TelegramIcon className="h-5 w-5" />
                  Написать в Telegram
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </a>
              </div>

              <div className="mx-auto mt-12 flex max-w-md items-center gap-4 text-xs uppercase tracking-[0.18em] text-paper/40">
                <span className="h-px flex-1 bg-paper/15" />
                или оставьте заявку
                <span className="h-px flex-1 bg-paper/15" />
              </div>

              <div className="mt-8 flex justify-center">
                <LeadForm />
              </div>
            </div>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
