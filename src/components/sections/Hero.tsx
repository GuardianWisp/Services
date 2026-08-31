"use client";

import { motion } from "framer-motion";
import { ArrowRight, MapPin, Send } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { Badge } from "@/components/ui/Badge";
import { Button } from "@/components/ui/Button";
import { HeroScene } from "@/components/three/HeroScene";
import { SceneErrorBoundary } from "@/components/three/SceneErrorBoundary";

export function Hero() {
  return (
    <section
      id="top"
      className="relative flex min-h-screen flex-col overflow-hidden pt-20 pb-16 sm:pt-24 sm:pb-20"
    >
      {/* Full-bleed 3D scene behind everything — fills the whole section
          edge to edge instead of sitting in a boxed frame, so there's no
          visible canvas boundary against the page background. The radial
          glow sits behind the canvas and fades to transparent well before
          the section edges, so it reads as ambient light rather than a
          hard-edged box. */}
      <div className="absolute inset-0 -z-20 bg-[radial-gradient(ellipse_60%_50%_at_50%_40%,rgba(255,45,130,0.25),transparent_70%)]" />
      <div className="absolute inset-0 -z-10">
        <SceneErrorBoundary>
          <HeroScene className="h-full w-full" />
        </SceneErrorBoundary>
      </div>

      <Container className="relative z-10 flex flex-1 flex-col items-center">
        <motion.div
          initial={{ opacity: 0, y: 16 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.6, ease: [0.16, 1, 0.3, 1] }}
          className="mt-4"
        >
          <Badge>
            <MapPin className="h-3.5 w-3.5 text-accent-ink" />
            Работаю удалённо · {siteConfig.location}
          </Badge>
        </motion.div>

        <div className="mt-auto flex flex-col items-center text-center">
          <motion.h1
            initial={{ opacity: 0, y: 24, filter: "blur(18px)" }}
            whileInView={{ opacity: 1, y: 0, filter: "blur(0px)" }}
            viewport={{ once: true }}
            transition={{
              duration: 1.1,
              delay: 0.1,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="text-balance text-4xl font-medium leading-[0.95] tracking-tight text-ink drop-shadow-[0_4px_24px_rgba(7,7,7,0.8)] sm:text-6xl md:text-7xl"
          >
            Дизайн, сайты и{" "}
            <span className="text-accent-ink">AI-контент</span>
          </motion.h1>

          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.5,
              ease: [0.16, 1, 0.3, 1],
            }}
            className="mt-4 max-w-xl text-balance text-lg leading-relaxed text-ink/80 drop-shadow-[0_2px_12px_rgba(7,7,7,0.9)]"
          >
            Дизайн и сайты, продающие тексты, Telegram-боты и
            3D-контент — помогаю бизнесу выглядеть профессионально и
            получать больше заявок.
          </motion.p>

          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{
              duration: 0.7,
              delay: 0.6,
              ease: [0.16, 1, 0.3, 1],
            }}
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
    </section>
  );
}
