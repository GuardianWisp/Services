import {
  Calendar,
  Check,
  Search,
  Send,
  Smartphone,
} from "lucide-react";
import { websiteExamples, websiteFeatures } from "@/data/websites";
import { Container } from "@/components/ui/Container";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { Reveal } from "@/components/ui/Reveal";

const featureIcons = [Smartphone, Send, Send, Calendar, Search];

function WebsiteMockup({
  title,
  type,
  accentPosition,
}: {
  title: string;
  type: string;
  accentPosition: "left" | "right";
}) {
  return (
    <div className="overflow-hidden rounded-3xl border border-line bg-card shadow-[0_20px_40px_-28px_rgba(18,17,16,0.25)]">
      <div className="flex items-center gap-1.5 border-b border-line px-4 py-3">
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="h-2.5 w-2.5 rounded-full bg-neutral-200" />
        <span className="ml-3 h-5 flex-1 rounded-full bg-paper-alt" />
      </div>
      <div className="relative h-44 bg-[linear-gradient(155deg,var(--color-paper-alt),white)] p-5">
        <div
          className={`absolute top-5 h-20 w-20 rounded-2xl bg-[linear-gradient(155deg,var(--color-accent-soft),white)] ${
            accentPosition === "left" ? "left-5" : "right-5"
          }`}
        />
        <div className="absolute bottom-5 left-5 h-2 w-24 rounded-full bg-ink/10" />
        <div className="absolute bottom-10 left-5 h-2.5 w-32 rounded-full bg-ink/15" />
        <div className="absolute bottom-5 right-5 h-8 w-20 rounded-full bg-ink" />
      </div>
      <div className="flex items-center justify-between px-5 py-4">
        <div>
          <p className="text-sm font-medium text-ink">{title}</p>
          <p className="text-xs text-muted">{type}</p>
        </div>
        <span className="text-xs font-medium text-accent-ink">demo</span>
      </div>
    </div>
  );
}

export function Websites() {
  return (
    <section id="websites" className="py-24 sm:py-32">
      <Container>
        <SectionHeading
          eyebrow="Сайты"
          title="Сайт, который работает на вас"
          description="Понятная структура, быстрая загрузка и прямой путь от посетителя до заявки."
        />

        <div className="mt-14 grid gap-5 sm:grid-cols-2">
          {websiteExamples.map((site, i) => (
            <Reveal key={site.id} delay={i * 0.07}>
              <WebsiteMockup
                title={site.title}
                type={site.type}
                accentPosition={i % 2 === 0 ? "left" : "right"}
              />
            </Reveal>
          ))}
        </div>

        <Reveal delay={0.15}>
          <div className="mt-10 flex flex-wrap gap-3">
            {websiteFeatures.map((feature, i) => {
              const Icon = featureIcons[i] ?? Check;
              return (
                <span
                  key={feature}
                  className="inline-flex items-center gap-2 rounded-full border border-line bg-card px-4 py-2 text-sm text-ink/80"
                >
                  <Icon className="h-3.5 w-3.5 text-accent-ink" />
                  {feature}
                </span>
              );
            })}
          </div>
        </Reveal>
      </Container>
    </section>
  );
}
