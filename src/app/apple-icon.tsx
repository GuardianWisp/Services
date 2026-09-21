import { ImageResponse } from "next/og";

export const size = { width: 180, height: 180 };
export const contentType = "image/png";

export default function AppleIcon() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
          // No border-radius here — iOS applies its own rounded-square mask
          // on top, so baking one in just doubles up and looks off.
          background: "#121110",
        }}
      >
        <div
          style={{
            display: "flex",
            fontSize: 100,
            fontWeight: 700,
            fontFamily: "sans-serif",
            color: "#c6ff1a",
          }}
        >
          T
        </div>
      </div>
    ),
    { ...size },
  );
}
