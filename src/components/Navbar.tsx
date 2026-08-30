"use client";

import { useEffect, useState } from "react";
import { AnimatePresence, motion } from "framer-motion";
import { ArrowUpRight, Menu, X } from "lucide-react";
import { navLinks, siteConfig } from "@/config/site";
import { cn } from "@/lib/utils";

export function Navbar() {
  const [open, setOpen] = useState(false);

  useEffect(() => {
    document.body.style.overflow = open ? "hidden" : "";
    return () => {
      document.body.style.overflow = "";
    };
  }, [open]);

  return (
    <header className="fixed inset-x-0 top-4 z-50 px-5 sm:top-6 sm:px-8 lg:px-12 xl:px-[60px]">
      <div className="mx-auto flex h-14 w-full items-center justify-between rounded-full bg-[#f5f3ee] px-3 pl-5 text-[#121110] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] sm:h-16 sm:pl-6">
        <a href="#top" className="text-sm font-semibold tracking-tight uppercase">
          {siteConfig.name}
        </a>

        <nav className="hidden items-center gap-7 md:flex">
          {navLinks.map((link) => (
            <a
              key={link.href}
              href={link.href}
              className="text-sm text-[#121110]/60 transition-colors hover:text-[#121110]"
            >
              {link.label}
            </a>
          ))}
        </nav>

        <div className="hidden md:block">
          <a
            href="#contact"
            className="group inline-flex items-center gap-1.5 rounded-full bg-[#121110] px-5 py-2.5 text-sm font-medium text-[#f5f3ee] transition-transform duration-300 hover:scale-[1.03]"
          >
            Оставить заявку
            <ArrowUpRight className="h-3.5 w-3.5 transition-transform group-hover:translate-x-0.5 group-hover:-translate-y-0.5" />
          </a>
        </div>

        <button
          type="button"
          onClick={() => setOpen((v) => !v)}
          className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-[#121110]/5 text-[#121110] md:hidden"
          aria-label={open ? "Закрыть меню" : "Открыть меню"}
          aria-expanded={open}
        >
          {open ? <X className="h-5 w-5" /> : <Menu className="h-5 w-5" />}
        </button>
      </div>

      <AnimatePresence>
        {open ? (
          <motion.div
            initial={{ opacity: 0, y: -12 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -12 }}
            transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
            className={cn(
              "mx-auto mt-3 flex w-full flex-col gap-1 rounded-3xl bg-[#f5f3ee] p-3 text-[#121110] shadow-[0_16px_40px_-16px_rgba(0,0,0,0.6)] md:hidden",
            )}
          >
            {navLinks.map((link) => (
              <a
                key={link.href}
                href={link.href}
                onClick={() => setOpen(false)}
                className="rounded-xl px-3 py-3 text-base text-[#121110]/80 transition-colors hover:bg-[#121110]/5 hover:text-[#121110]"
              >
                {link.label}
              </a>
            ))}
            <a
              href="#contact"
              onClick={() => setOpen(false)}
              className="mt-2 inline-flex items-center justify-center gap-2 rounded-full bg-[#121110] px-5 py-3.5 text-sm font-medium text-[#f5f3ee]"
            >
              Оставить заявку
            </a>
          </motion.div>
        ) : null}
      </AnimatePresence>
    </header>
  );
}
