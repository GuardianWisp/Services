import { pricingItems } from "@/data/pricing";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Pricing() {
  return (
    <section id="pricing" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Цены"
          title="Стартовые цены"
          description="Финальная стоимость зависит от задачи. Напишите — быстро оценю проект."
        />

        <div className="mt-14 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {pricingItems.map((item, i) => (
            <Reveal key={item.title} delay={i * 0.05}>
              <div className="flex items-center justify-between rounded-2xl border border-line bg-card px-6 py-5 transition-colors duration-300 hover:border-ink/20">
                <span className="text-[15px] text-ink/85">{item.title}</span>
                <span className="text-right text-base font-medium text-ink">
                  {item.price}
                  {item.note ? (
                    <span className="ml-1 text-sm font-normal text-muted">
                      {item.note}
                    </span>
                  ) : null}
                </span>
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
