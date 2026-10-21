import type { Metadata, Viewport } from "next";
import { Cormorant_Garamond, JetBrains_Mono, Unbounded } from "next/font/google";
import { LabRoot } from "./LabRoot";
import "./lab.css";

const display = Unbounded({ subsets: ["latin", "cyrillic"], variable: "--font-unbounded" });
const serif = Cormorant_Garamond({
  subsets: ["latin", "cyrillic"],
  style: ["italic"],
  weight: ["400", "500"],
  variable: "--font-cormorant",
});
const mono = JetBrains_Mono({ subsets: ["latin", "cyrillic"], variable: "--font-jbmono" });

export const metadata: Metadata = {
  title: "Lab · Iris",
  description: "Экспериментальная страница TETSAB: WebGPU-сцена на Three.js, девять состояний объекта и AI-ассистент.",
  robots: { index: false, follow: false },
};

export const viewport: Viewport = {
  themeColor: "#070708",
};

export default function LabPage() {
  return (
    <div className={`${display.variable} ${serif.variable} ${mono.variable}`}>
      <LabRoot />
    </div>
  );
}
