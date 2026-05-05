"use client";

import { ChevronLeft, Link2 } from "lucide-react";

interface Props {
  link: string;
  onBack?: () => void;
}

export function LinkPill({ link, onBack }: Props) {
  return (
    <div className="mx-auto max-w-[1180px] px-6 pt-2 pb-6 flex items-center gap-3">
      {onBack && (
        <button
          onClick={onBack}
          className="w-9 h-9 rounded-full bg-white border border-line flex items-center justify-center hover:bg-bg transition-colors"
          aria-label="뒤로"
        >
          <ChevronLeft className="w-[18px] h-[18px]" />
        </button>
      )}
      <div className="flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white border border-line">
        <Link2 className="w-3.5 h-3.5 text-ink" />
        <span className="text-[12.5px] font-medium text-ink">{link}</span>
      </div>
    </div>
  );
}
