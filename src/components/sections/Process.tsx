import { processSteps } from "@/data/process";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

export function Process() {
  return (
    <section className="bg-paper-alt py-24 sm:py-32">
      <Container>
        <SectionHeading eyebrow="Процесс" title="Как проходит работа" />

        <div className="mt-14 grid gap-8 sm:grid-cols-2 lg:grid-cols-4 lg:gap-6">
          {processSteps.map((step, i) => (
            <Reveal key={step.index} delay={i * 0.08}>
              <div className="relative">
                <span className="text-4xl font-light text-ink/15 sm:text-5xl">
                  {step.index}
                </span>
                <p className="mt-3 text-balance text-lg font-medium text-ink">
                  {step.title}
                </p>
                {i < processSteps.length - 1 ? (
                  <span
                    aria-hidden="true"
                    className="absolute top-4 right-[-1.5rem] hidden h-px w-8 bg-line lg:block"
                  />
                ) : null}
              </div>
            </Reveal>
          ))}
        </div>
      </Container>
    </section>
  );
}
