import { ArrowUpRight, Check } from "lucide-react";
import { services } from "@/data/services";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Services() {
  return (
    <section id="services" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Услуги"
          title="Что могу сделать"
          description="Направления, которые вместе закрывают путь клиента: от дизайна и сайта до текстов и общения в Telegram."
        />

        <div className="mt-14 -mx-5 sm:-mx-8">
          <div className="no-scrollbar flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pt-2 pb-14 sm:px-8">
            {services.map((service, i) => (
              <Reveal
                key={service.title}
                delay={i * 0.08}
                className="w-[300px] shrink-0 snap-start sm:w-[340px]"
              >
                <a
                  href={service.href}
                  className="group flex h-full flex-col rounded-3xl border border-line bg-card p-7 transition-all duration-300 hover:-translate-y-1 hover:border-ink/15 hover:shadow-[0_24px_48px_-24px_rgba(18,17,16,0.2)] sm:p-8"
                >
                  <div className="flex items-start justify-between">
                    <span className="text-sm font-medium text-muted">
                      {service.index}
                    </span>
                    <div className="flex h-11 w-11 items-center justify-center rounded-full bg-paper-alt text-ink transition-colors duration-300 group-hover:bg-accent group-hover:text-accent-contrast">
                      <service.icon className="h-5 w-5" />
                    </div>
                  </div>

                  <h3 className="mt-6 text-2xl font-medium tracking-tight text-ink">
                    {service.title}
                  </h3>
                  <p className="mt-2 text-[15px] leading-relaxed text-muted">
                    {service.description}
                  </p>

                  <ul className="mt-6 flex flex-1 flex-col gap-2.5">
                    {service.items.map((item) => (
                      <li
                        key={item}
                        className="flex items-center gap-2.5 text-sm text-ink/80"
                      >
                        <Check className="h-4 w-4 shrink-0 text-accent-ink" />
                        {item}
                      </li>
                    ))}
                  </ul>

                  <div className="mt-8 flex items-center justify-between border-t border-line pt-5">
                    <span className="text-sm font-medium text-ink">
                      {service.price}
                    </span>
                    <ArrowUpRight className="h-4 w-4 text-muted transition-all duration-300 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 group-hover:text-accent-ink" />
                  </div>
                </a>
              </Reveal>
            ))}
          </div>
        </div>
      </Container>
    </section>
  );
}
