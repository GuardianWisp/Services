import { Navbar } from "@/components/Navbar";
import { FloatingTelegramButton } from "@/components/FloatingTelegramButton";
import { Footer } from "@/components/Footer";
import { Hero } from "@/components/sections/Hero";
import { Services } from "@/components/sections/Services";
import { AIShowcase } from "@/components/sections/AIShowcase";
import { Websites } from "@/components/sections/Websites";
import { Automation } from "@/components/sections/Automation";
import { Pricing } from "@/components/sections/Pricing";
import { Portfolio } from "@/components/sections/Portfolio";
import { Process } from "@/components/sections/Process";
import { FAQ } from "@/components/sections/FAQ";
import { CTA } from "@/components/sections/CTA";

export default function Home() {
  return (
    <>
      <Navbar />
      <main className="flex-1">
        <Hero />
        <Services />
        <AIShowcase />
        <Websites />
        <Automation />
        <Pricing />
        <Portfolio />
        <Process />
        <FAQ />
        <CTA />
      </main>
      <Footer />
      <FloatingTelegramButton />
    </>
  );
}
