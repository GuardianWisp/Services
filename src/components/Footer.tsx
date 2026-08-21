import { Mail } from "lucide-react";
import { siteConfig } from "@/config/site";
import { Container } from "@/components/ui/Container";
import { TelegramIcon } from "@/components/ui/TelegramIcon";

export function Footer() {
  return (
    <footer className="border-t border-line py-12">
      <Container className="flex flex-col items-center gap-6 text-center sm:flex-row sm:items-end sm:justify-between sm:text-left">
        <div>
          <p className="text-base font-semibold tracking-tight text-ink">
            {siteConfig.name}
          </p>
          <p className="mt-1 text-sm text-muted">{siteConfig.tagline}</p>
        </div>

        <div className="flex flex-col items-center gap-3 sm:items-end">
          <div className="flex items-center gap-4">
            <a
              href={siteConfig.telegramUrl}
              target="_blank"
              rel="noopener noreferrer"
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <TelegramIcon className="h-4 w-4" />
              Telegram
            </a>
            <a
              href={`mailto:${siteConfig.email}`}
              className="inline-flex items-center gap-1.5 text-sm text-muted transition-colors hover:text-ink"
            >
              <Mail className="h-4 w-4" />
              {siteConfig.email}
            </a>
          </div>
          <p className="text-xs text-muted">© {siteConfig.year}</p>
        </div>
      </Container>
    </footer>
  );
}
