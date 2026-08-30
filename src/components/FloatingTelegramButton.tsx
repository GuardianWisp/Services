"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { siteConfig } from "@/config/site";
import { TelegramIcon } from "@/components/ui/TelegramIcon";

export function FloatingTelegramButton() {
  const [visible, setVisible] = useState(false);

  useEffect(() => {
    const onScroll = () => setVisible(window.scrollY > 640);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  return (
    <AnimatePresence>
      {visible ? (
        <motion.a
          href={siteConfig.telegramUrl}
          target="_blank"
          rel="noopener noreferrer"
          initial={{ opacity: 0, y: 12, scale: 0.9 }}
          animate={{ opacity: 1, y: 0, scale: 1 }}
          exit={{ opacity: 0, y: 12, scale: 0.9 }}
          transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
          className="fixed bottom-5 right-5 z-40 inline-flex items-center gap-2 rounded-full bg-accent px-5 py-3.5 text-sm font-medium text-accent-contrast shadow-[0_8px_24px_-6px_color-mix(in_srgb,var(--color-accent)_45%,transparent)] transition-transform duration-300 hover:scale-105 sm:bottom-7 sm:right-7 md:hidden"
          aria-label="Написать в Telegram"
        >
          <TelegramIcon className="h-4 w-4" />
          Telegram
        </motion.a>
      ) : null}
    </AnimatePresence>
  );
}
