"use client";

import type { ImageType } from "@/types";

interface Props {
  size?: "sm" | "md" | "lg";
  brandName?: string;
  imageType?: ImageType;
}

export function ProductVisual({
  size = "md",
  brandName = "",
  imageType = "custom",
}: Props) {
  const isLg = size === "lg";
  const palette = {
    rice: {
      shell: "linear-gradient(160deg, #fff7df 0%, #ffffff 58%, #e8f3df 100%)",
      cap: "#e6d9ad",
      accent: "#8ea86e",
      label: "#f8f3e4",
    },
    "green-tea": {
      shell: "linear-gradient(160deg, #edf6ed 0%, #ffffff 58%, #d7e8d8 100%)",
      cap: "#a7c2a4",
      accent: "#4f7a57",
      label: "#eef6ee",
    },
    cucumber: {
      shell: "linear-gradient(160deg, #e6f7f2 0%, #ffffff 58%, #d7eef5 100%)",
      cap: "#91cfc4",
      accent: "#33877d",
      label: "#edf9f6",
    },
    custom: {
      shell: "linear-gradient(160deg, #f7f7f4 0%, #ffffff 58%, #e5e2dc 100%)",
      cap: "#d7d1c5",
      accent: "#111111",
      label: "#f3f1ec",
    },
  }[imageType];

  return (
    <div
      className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center"
      style={{ background: palette.shell }}
    >
      <div className="absolute inset-x-0 bottom-0 h-1/3 bg-white/35" />
      <div
        className="relative rounded-[14px] flex flex-col items-center justify-center bg-white border border-line shadow-[0_18px_45px_rgba(0,0,0,0.10)]"
        style={{
          width: isLg ? "62%" : "58%",
          height: isLg ? "78%" : "72%",
        }}
      >
        <div
          className="absolute top-0 left-1/2 -translate-x-1/2 rounded-b-[10px]"
          style={{
            width: "46%",
            height: isLg ? 18 : 14,
            background: palette.cap,
          }}
        />
        <div
          className="absolute top-3 left-3 right-3 h-[2px] rounded-full"
          style={{ background: palette.accent, opacity: 0.18 }}
        />
        {brandName && (
          <div
            className="px-2 py-1 rounded-md text-[8px] font-semibold tracking-[0.18em] uppercase text-sub truncate max-w-[80%]"
            style={{ background: palette.label }}
          >
            {brandName}
          </div>
        )}
        <div
          className="mt-2 rounded-full"
          style={{
            width: isLg ? 38 : 30,
            height: isLg ? 38 : 30,
            border: `1px solid ${palette.accent}`,
            opacity: 0.28,
          }}
        />
        <div
          className="absolute bottom-3 left-3 right-3 h-[2px] rounded-full"
          style={{ background: palette.accent, opacity: 0.18 }}
        />
      </div>
    </div>
  );
}
