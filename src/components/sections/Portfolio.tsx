"use client";

import { useMemo, useState } from "react";
import { motion } from "framer-motion";
import {
  portfolioCategories,
  portfolioItems,
  type PortfolioCategory,
} from "@/data/portfolio";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { cn } from "@/lib/utils";

type FilterValue = "Все" | PortfolioCategory;

const filters: FilterValue[] = ["Все", ...portfolioCategories];

export function Portfolio() {
  const [active, setActive] = useState<FilterValue>("Все");

  const items = useMemo(
    () =>
      active === "Все"
        ? portfolioItems
        : portfolioItems.filter((item) => item.category === active),
    [active],
  );

  return (
    <section id="portfolio" className="py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-8 sm:flex-row sm:items-end">
          <SectionHeading eyebrow="Портфолио" title="Примеры работ" />

          <div className="-mx-5 flex gap-2 overflow-x-auto px-5 pb-1 sm:mx-0 sm:flex-wrap sm:px-0">
            {filters.map((filter) => (
              <button
                key={filter}
                type="button"
                onClick={() => setActive(filter)}
                className={cn(
                  "shrink-0 rounded-full border px-4 py-2 text-sm font-medium transition-colors duration-300",
                  active === filter
                    ? "border-ink bg-ink text-paper"
                    : "border-line bg-card text-muted hover:border-ink/30 hover:text-ink",
                )}
              >
                {filter}
              </button>
            ))}
          </div>
        </div>

        <div className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <Reveal key={item.id} delay={(i % 6) * 0.05}>
              <motion.div
                layout
                className="group overflow-hidden rounded-3xl border border-line bg-card transition-shadow duration-300 hover:shadow-[0_24px_48px_-28px_rgba(18,17,16,0.25)]"
              >
                <div
                  className={cn(
                    "relative flex h-44 items-center justify-center bg-gradient-to-br",
                    item.gradient,
                  )}
                >
                  <div className="flex h-14 w-14 items-center justify-center rounded-2xl bg-white/80 text-ink shadow-sm transition-transform duration-300 group-hover:scale-105">
                    <item.icon className="h-6 w-6" strokeWidth={1.5} />
                  </div>
                  {item.isDemo ? (
                    <span className="absolute top-4 right-4 rounded-full bg-white/80 px-2.5 py-1 text-[11px] font-medium text-muted">
                      demo
                    </span>
                  ) : null}
                </div>
                <div className="p-5">
                  <span className="text-xs font-medium uppercase tracking-wide text-accent-ink">
                    {item.category}
                  </span>
                  <h3 className="mt-1.5 text-base font-medium text-ink">
                    {item.title}
                  </h3>
                  <p className="mt-1.5 text-sm leading-relaxed text-muted">
                    {item.description}
                  </p>
                </div>
              </motion.div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
