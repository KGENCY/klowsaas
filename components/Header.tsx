"use client";

import type { ReactNode } from "react";

export function Header({
  onLogoClick,
  centerSlot,
}: {
  onLogoClick?: () => void;
  centerSlot?: ReactNode;
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-bg/85 backdrop-blur-xl border-b border-line/60">
      <div
        className="mx-auto max-w-[1180px] px-6 py-3 grid items-center gap-3"
        style={{
          gridTemplateColumns:
            "minmax(0, 1fr) minmax(0, 520px) minmax(0, 1fr)",
        }}
      >
        <button
          onClick={onLogoClick}
          className="justify-self-start flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-[8px] bg-ink flex items-center justify-center">
            <span className="text-white font-bold text-[13px] tracking-tight">
              K
            </span>
          </div>
          <span className="font-semibold text-[17px] tracking-tight">
            KLOW <span className="text-sub font-medium">Pro</span>
          </span>
        </button>
        <div className="w-full min-w-0">{centerSlot}</div>
        <div />
      </div>
    </header>
  );
}
