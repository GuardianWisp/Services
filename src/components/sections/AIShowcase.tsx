import { ArrowRight } from "lucide-react";
import { aiShowcaseExamples } from "@/data/aiShowcase";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";
import { Button } from "@/components/ui/Button";
import { BeforeAfterSlider } from "@/components/ui/BeforeAfterSlider";

export function AIShowcase() {
  return (
    <section id="ai" className="bg-paper-alt py-24 sm:py-32">
      <Container>
        <div className="flex flex-col justify-between gap-10 lg:flex-row lg:items-end">
          <SectionHeading
            eyebrow="AI-контент"
            title="Обычное фото → профессиональный контент"
            className="max-w-2xl"
          />
          <Reveal delay={0.1}>
            <p className="max-w-sm text-balance text-[15px] leading-relaxed text-muted">
              Не обязательно заказывать дорогую фотосессию. Можно начать с
              обычной фотографии — я подготовлю из неё рекламный визуал.
              Двигайте разделитель, чтобы увидеть разницу.
            </p>
          </Reveal>
        </div>

        <div className="no-scrollbar mt-14 -mx-5 flex snap-x snap-mandatory gap-5 overflow-x-auto px-5 pb-2 sm:-mx-8 sm:gap-6 sm:px-8">
          {aiShowcaseExamples.map((example, i) => (
            <Reveal key={example.id} delay={i * 0.06} className="shrink-0">
              <BeforeAfterSlider
                icon={<example.icon className="h-7 w-7" strokeWidth={1.5} />}
                label={example.label}
                before={example.before}
                after={example.after}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.2}>
          <div className="mt-14 flex justify-center">
            <Button href="#contact" variant="primary">
              Обработать мои фото
              <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
            </Button>
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
