import { ArrowRight } from "lucide-react";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const flows = [
  ["Клиент", "Сайт", "Заявка", "Telegram", "Вы"],
  ["Клиент", "Telegram Bot", "Выбор услуги", "Запись", "Уведомление"],
];

function FlowRow({ steps }: { steps: string[] }) {
  return (
    <div className="flex flex-wrap items-center gap-2 rounded-3xl border border-line bg-card p-4 sm:gap-3 sm:p-6">
      {steps.map((step, i) => (
        <div key={step} className="flex items-center gap-2 sm:gap-3">
          <span className="rounded-full bg-paper-alt px-4 py-2.5 text-sm font-medium text-ink">
            {step}
          </span>
          {i < steps.length - 1 ? (
            <ArrowRight className="h-4 w-4 shrink-0 text-accent-ink" />
          ) : null}
        </div>
      ))}
    </div>
  );
}

export function Automation() {
  return (
    <section id="automation" className="bg-paper-alt py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Автоматизация"
          title="Меньше ручной работы"
          description="Можно автоматизировать часть общения с клиентами и приёма заявок, не внедряя сложную CRM."
        />

        <div className="mt-14 flex flex-col gap-5">
          {flows.map((steps, i) => (
            <Reveal key={i} delay={i * 0.1}>
              <FlowRow steps={steps} />
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
