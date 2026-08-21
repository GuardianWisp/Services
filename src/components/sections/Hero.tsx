"use client";

import { motion } from "framer-motion";
import { ArrowRight, Bot, Globe, MapPin, Sparkles } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { TelegramIcon } from "@/components/ui/TelegramIcon";

const floatingCards = [
  {
    icon: Globe,
    label: "Website",
    sub: "Сайт-визитка",
    className: "left-[4%] top-[10%] sm:left-[6%]",
    float: "animate-float",
  },
  {
    icon: Sparkles,
    label: "AI Photo",
    sub: "Рекламный визуал",
    className: "right-[2%] top-[34%] sm:right-[0%]",
    float: "animate-float-slow",
  },
  {
    icon: Bot,
    label: "Telegram Bot",
    sub: "Запись клиентов",
    className: "left-[14%] bottom-[6%] sm:left-[16%]",
    float: "animate-float",
  },
];

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-32 pb-20 sm:pt-40 sm:pb-28"
    >
      <div
        aria-hidden="true"
        className="pointer-events-none absolute -top-40 right-[-10%] h-[520px] w-[520px] rounded-full bg-[radial-gradient(circle,var(--color-accent-soft)_0%,transparent_70%)] blur-2xl"
      />
      <div
        aria-hidden="true"
        className="pointer-events-none absolute top-1/3 left-[-15%] h-[420px] w-[420px] rounded-full bg-[radial-gradient(circle,var(--color-paper-alt)_0%,transparent_70%)] blur-2xl"
      />

      <Container className="relative grid items-center gap-16 lg:grid-cols-[1.05fr_0.95fr] lg:gap-10">
        <div>
          <motion.div
            initial={{ opacity: 0, y: 16 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          >
            <Badge>
              <MapPin className="h-3.5 w-3.5 text-accent-ink" />
              Работаю удалённо · {siteConfig.location}
            </Badge>
          </motion.div>

          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 text-balance text-4xl font-medium leading-[1.08] tracking-tight text-ink sm:text-5xl md:text-6xl lg:text-[3.75rem]"
          >
            Сайты, AI-контент и автоматизация{" "}
            <span className="text-accent-ink">для вашего бизнеса</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.16, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted"
          >
            Создаю сайты, профессиональные изображения и Telegram-инструменты,
            которые помогают бизнесу выглядеть лучше и получать больше заявок.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.24, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center gap-3"
          >
            <Button
              href={siteConfig.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              variant="primary"
            >
              <TelegramIcon className="h-4 w-4" />
              Обсудить проект
            </Button>
            <Button href="#services" variant="secondary">
              Посмотреть услуги
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>

        <motion.div
          initial={{ opacity: 0, scale: 0.94 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 0.8, delay: 0.2, ease: [0.16, 1, 0.3, 1] }}
          className="relative mx-auto h-[360px] w-full max-w-md sm:h-[440px] lg:mx-0 lg:h-[480px]"
        >
          <div className="absolute inset-8 rounded-[2.5rem] border border-line bg-gradient-to-br from-white to-paper-alt shadow-[0_30px_60px_-30px_rgba(18,17,16,0.25)] sm:inset-10" />

          {floatingCards.map((card) => (
            <div
              key={card.label}
              className={`absolute w-[168px] rounded-2xl border border-line bg-card/90 p-4 shadow-[0_16px_32px_-16px_rgba(18,17,16,0.25)] backdrop-blur-sm sm:w-[188px] ${card.className} ${card.float}`}
              style={
                {
                  "--float-rotate":
                    card.label === "AI Photo" ? "1.5deg" : "-1.5deg",
                } as React.CSSProperties
              }
            >
              <div className="flex h-9 w-9 items-center justify-center rounded-full bg-accent-soft text-accent-ink">
                <card.icon className="h-[18px] w-[18px]" />
              </div>
              <p className="mt-3 text-sm font-medium text-ink">
                {card.label}
              </p>
              <p className="text-xs text-muted">{card.sub}</p>
            </div>
          ))}
        </motion.div>
      </Container>
    </section>
  );
}
