import { ImageResponse } from "next/og";
import { SITE_DESCRIPTION, SITE_NAME } from "@/lib/seo";

export const size = { width: 1200, height: 630 };
export const contentType = "image/png";

export default function Image() {
  return new ImageResponse(
    (
      <div
        style={{
          width: "100%",
          height: "100%",
          display: "flex",
          flexDirection: "column",
          justifyContent: "space-between",
          padding: "80px",
          background: "#fefce8",
          fontFamily: "sans-serif",
        }}
      >
        <div style={{ display: "flex", alignItems: "center", gap: 16 }}>
          <div
            style={{
              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              width: 56,
              height: 56,
              borderRadius: 16,
              background: "#eab308",
              color: "#171717",
              fontSize: 28,
              fontWeight: 700,
            }}
          >
            A
          </div>
          <div style={{ display: "flex", fontSize: 32, fontWeight: 600, color: "#171717" }}>
            {SITE_NAME}
          </div>
        </div>

        <div style={{ display: "flex", flexDirection: "column", gap: 20 }}>
          <div
            style={{
              display: "flex",
              fontSize: 64,
              fontWeight: 600,
              color: "#171717",
              lineHeight: 1.1,
              maxWidth: 900,
            }}
          >
            Your documents, finally worth talking to.
          </div>
          <div
            style={{
              display: "flex",
              fontSize: 28,
              color: "#854d0e",
              maxWidth: 820,
            }}
          >
            {SITE_DESCRIPTION}
          </div>
        </div>
      </div>
    ),
    { ...size }
  );
}
