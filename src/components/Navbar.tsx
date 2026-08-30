"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { TelegramIcon } from "@/components/ui/TelegramIcon";
import { ThemeToggle } from "@/components/ThemeToggle";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [scrolled, setScrolled] = useState(false);
  const [open, setOpen] = useState(false);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 12);
    onScroll();
    window.addEventListener("scroll", onScroll, { passive: true });
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header
      className={cn(
        "fixed inset-x-0 top-0 z-50 transition-all duration-300",
        scrolled || open
          ? "bg-paper/80 backdrop-blur-md border-b border-line"
          : "bg-transparent border-b border-transparent",
      )}
    >
      <Container className="flex h-16 items-center justify-between sm:h-20">
        <a
          href="#top"
          className="text-sm font-semibold tracking-tight text-ink"
        >
          {siteConfig.name}
        </a>

        <nav className="hidden items-center gap-8 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-muted transition-colors hover:text-ink"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden items-center gap-3 md:flex">
          <ThemeToggle />
          <a
            href={siteConfig.telegramUrl}
            target="_blank"
            rel="noopener noreferrer"
            className="inline-flex items-center gap-2 rounded-full bg-ink px-5 py-2.5 text-sm font-medium text-paper transition-colors duration-300 hover:bg-accent hover:text-accent-contrast"
          >
            <TelegramIcon className="h-4 w-4" />
            Написать в Telegram
          </a>
        </div>

        <div className="flex items-center gap-2 md:hidden">
          <ThemeToggle />
          <button
            type="button"
            onClick={() => setOpen((v) => !v)}
            className="inline-flex h-10 w-10 items-center justify-center rounded-full border border-line text-ink"
            aria-label={open ? "Закрыть меню" : "Открыть меню"}
            aria-expanded={open}
          >
            {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
          </button>
        </div>
      </Container>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, height: 0 }}
            animate={{ opacity: 1, height: "auto" }}
            exit={{ opacity: 0, height: 0 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className="overflow-hidden border-t border-line bg-paper md:hidden"
          >
            <Container className="flex flex-col gap-1 py-4">
              {navLinks.map((link) => (
                <a
                  key={link.href}
                  href={link.href}
                  onClick={() => setOpen(false)}
                  className="rounded-xl px-3 py-3 text-base text-ink/80 transition-colors hover:bg-paper-alt hover:text-ink"
                >
                  {link.label}
                </a>
              ))}
              <a
                href={siteConfig.telegramUrl}
                target="_blank"
                rel="noopener noreferrer"
                onClick={() => setOpen(false)}
                className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-ink px-5 py-3.5 text-sm font-medium text-paper"
              >
                <TelegramIcon className="h-4 w-4" />
                Написать в Telegram
              </a>
            </Container>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
