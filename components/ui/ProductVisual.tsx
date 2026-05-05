"use client";

interface Props {
  size?: "sm" | "md" | "lg";
  brandName?: string;
}

export function ProductVisual({ size = "md", brandName = "" }: Props) {
  const isLg = size === "lg";
  return (
    <div className="relative w-full h-full rounded-2xl overflow-hidden flex items-center justify-center bg-bg">
      <div
        className="relative rounded-[14px] flex flex-col items-center justify-center bg-white border border-line"
        style={{
          width: isLg ? "62%" : "58%",
          height: isLg ? "78%" : "72%",
        }}
      >
        <div className="absolute top-3 left-3 right-3 h-[2px] rounded-full bg-line" />
        {brandName && (
          <div className="text-[8px] font-semibold tracking-[0.18em] uppercase text-sub truncate max-w-[80%]">
            {brandName}
          </div>
        )}
        <div className="absolute bottom-3 left-3 right-3 h-[2px] rounded-full bg-line" />
      </div>
    </div>
  );
}
