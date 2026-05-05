"use client";

import { Menu, Search, ShoppingBag } from "lucide-react";
import type { CSSProperties, ReactNode } from "react";

interface Props {
  brandName: string;
  children: ReactNode;
  /** Optional vertical sizing override; defaults to aspect-ratio 9:19.2. */
  style?: CSSProperties;
  footer?: ReactNode;
}

const defaultStyle: CSSProperties = {
  padding: 10,
  aspectRatio: "9 / 19.2",
  maxHeight: "calc(100vh - 140px)",
};

export function PhoneFrame({ brandName, children, style, footer }: Props) {
  return (
    <div
      className="relative mx-auto w-full max-w-[380px] rounded-[48px] bg-ink shadow-pop flex flex-col"
      style={style ?? defaultStyle}
    >
      <SideButtons />
      <div className="relative flex flex-col flex-1 min-h-0 bg-white rounded-[38px] overflow-hidden">
        <StatusBar />
        <AppChrome brandName={brandName} />
        {children}
        {footer}
      </div>
    </div>
  );
}

function SideButtons() {
  return (
    <>
      <span className="absolute left-[-2px] top-[110px] w-[3px] h-[36px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[160px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[230px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute right-[-2px] top-[180px] w-[3px] h-[80px] rounded-l bg-ink/80" aria-hidden />
    </>
  );
}

function StatusBar() {
  return (
    <div className="relative flex items-center justify-between px-7 pt-2.5 pb-1 text-[11px] font-semibold text-ink flex-shrink-0">
      <span className="tracking-tight">9:41</span>
      <span
        className="absolute left-1/2 top-2 -translate-x-1/2 w-[88px] h-[26px] rounded-full bg-ink"
        aria-hidden
      />
      <span className="flex items-center gap-1 text-[10px]">
        <span className="inline-flex items-end gap-[1.5px]">
          <span className="w-[3px] h-[5px] bg-ink rounded-[1px]" />
          <span className="w-[3px] h-[7px] bg-ink rounded-[1px]" />
          <span className="w-[3px] h-[9px] bg-ink rounded-[1px]" />
          <span className="w-[3px] h-[11px] bg-ink rounded-[1px]" />
        </span>
        <span className="ml-0.5 inline-block w-[18px] h-[10px] border border-ink rounded-[3px] relative">
          <span className="absolute inset-[1px] right-[3px] bg-ink rounded-[1px]" />
          <span className="absolute right-[-2px] top-[3px] w-[1px] h-[4px] bg-ink rounded-full" />
        </span>
      </span>
    </div>
  );
}

function AppChrome({ brandName }: { brandName: string }) {
  return (
    <div className="bg-white px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-line/60 flex-shrink-0">
      <button className="w-8 h-8 -ml-1 flex items-center justify-center">
        <Menu className="w-[17px] h-[17px] text-ink" />
      </button>
      <div className="text-[14px] font-bold tracking-tight">{brandName}</div>
      <div className="flex items-center gap-0.5">
        <button className="w-8 h-8 flex items-center justify-center">
          <Search className="w-[16px] h-[16px] text-ink" />
        </button>
        <button className="w-8 h-8 -mr-1 flex items-center justify-center">
          <ShoppingBag className="w-[16px] h-[16px] text-ink" />
        </button>
      </div>
    </div>
  );
}
