import { Navbar } from "@/components/Navbar";
import { FloatingTelegramButton } from "@/components/FloatingTelegramButton";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AIShowcase } from "@/components/sections/AIShowcase";
import { Websites } from "@/components/sections/Websites";
import { TelegramBots } from "@/components/sections/TelegramBots";
import { Pricing } from "@/components/sections/Pricing";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";
import { ColorLab } from "@/components/dev/ColorLab";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <AIShowcase />
        <Websites />
        <TelegramBots />
        <Pricing />
        <Portfolio />
        <Process />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <FloatingTelegramButton />
      {process.env.NODE_ENV !== "production" ? <ColorLab /> : null}
    </>
  );
}
