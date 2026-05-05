"use client";

import { Copy, Link2 } from "lucide-react";

interface Props {
  link: string;
  onCopy: () => void;
}

export function StickyLinkBar({ link, onCopy }: Props) {
  return (
    <div className="sticky top-0 z-30 bg-bg/80 backdrop-blur-xl border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-6 py-3 flex items-center gap-2">
        <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-line">
          <Link2 className="w-4 h-4 text-ink flex-shrink-0" />
          <span className="text-[13.5px] font-medium text-ink truncate">{link}</span>
        </div>
        <button
          onClick={onCopy}
          className="px-4 sm:px-5 h-[44px] rounded-2xl bg-ink text-white text-[13.5px] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden sm:inline">링크 복사</span>
          <span className="sm:hidden">복사</span>
        </button>
      </div>
    </div>
  );
}
