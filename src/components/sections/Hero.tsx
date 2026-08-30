"use client";

import { motion } from "framer-motion";
import { ArrowLeft, ArrowRight, MapPin, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeroArt } from "@/components/ui/HeroArt";
import { BurstDoodle, HeartDoodle } from "@/components/ui/Doodles";

export function Hero() {
  return (
    <section
      id="top"
      className="relative overflow-hidden pt-36 pb-24 sm:pt-44 sm:pb-32"
    >
      <Container className="relative">
        <div className="flex flex-col items-center text-center">
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

          <div className="relative mt-8 flex w-full max-w-xs items-center justify-center sm:max-w-sm">
            <BurstDoodle className="absolute -left-8 top-0 h-14 w-14 text-ink/60 sm:-left-14 sm:h-20 sm:w-20" />
            <HeartDoodle className="absolute -right-2 -top-2 h-10 w-10 text-ink/60 sm:right-2 sm:h-14 sm:w-14" />

            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.8, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
              className="w-full"
            >
              <HeroArt className="w-full drop-shadow-[0_30px_70px_rgba(255,45,130,0.3)]" />
            </motion.div>
          </div>

          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(18px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{ duration: 1.1, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="mt-8 text-balance text-5xl font-medium leading-[0.95] tracking-tight text-ink sm:text-7xl md:text-8xl"
          >
            Дизайн, сайты и{" "}
            <span className="text-accent-ink">AI-контент</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.5, ease: [0.16, 1, 0.3, 1] }}
            className="mt-6 max-w-xl text-balance text-lg leading-relaxed text-muted"
          >
            Дизайн и сайты, продающие тексты, Telegram-боты и 3D-контент —
            помогаю бизнесу выглядеть профессионально и получать больше
            заявок.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.7, delay: 0.6, ease: [0.16, 1, 0.3, 1] }}
            className="mt-9 flex flex-wrap items-center justify-center gap-3"
          >
            <Button href="#contact" variant="primary">
              <Send className="h-4 w-4" />
              Оставить заявку
            </Button>
            <Button href="#services" variant="secondary">
              Посмотреть услуги
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </motion.div>
        </div>
      </Container>

      <a
        href="#top"
        aria-label="В начало"
        className="absolute left-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-paper-alt lg:flex"
      >
        <ArrowLeft className="h-4 w-4" />
      </a>
      <a
        href="#services"
        aria-label="К услугам"
        className="absolute right-4 top-1/2 hidden h-11 w-11 -translate-y-1/2 items-center justify-center rounded-full border border-line text-ink transition-colors hover:bg-paper-alt lg:flex"
      >
        <ArrowRight className="h-4 w-4" />
      </a>
    </section>
  );
}
