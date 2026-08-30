import { ImageResponse } from "next/og";
import { siteConfig } from "@/config/site";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function OpengraphImage() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: 80,
          background: "linear-gradient(155deg, #070707 0%, #22101a 100%)",
          fontFamily: "sans-serif",
        }}
      >
        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 12,
            fontSize: 28,
            color: "#f5f3ee",
          }}
        >
          <div
            style={{
              width: 14,
              height: 14,
              borderRadius: 999,
              background: "#ff4d94",
              display: "flex",
            }}
          />
          {siteConfig.name}
        </div>
        <div
          style={{
            display: "flex",
            flexDirection: "column",
            gap: 16,
          }}
        >
          <div
            style={{
              fontSize: 64,
              fontWeight: 600,
              color: "#f5f3ee",
              lineHeight: 1.1,
              display: "flex",
            }}
          >
            Дизайн, сайты и AI-контент
          </div>
          <div style={{ fontSize: 30, color: "#a8a49c", display: "flex" }}>
            для вашего бизнеса — в одном месте
          </div>
        </div>
      </div>
    ),
    { ...size },
  );
}
