"use client";

import { X } from "lucide-react";
import { useEffect, MutableRefObject } from "react";

interface Props {
  open: boolean;
  title: string;
  onClose: () => void;
  children: React.ReactNode;
  footer?: React.ReactNode;
  scrollRef?: MutableRefObject<HTMLDivElement | null>;
}

export function PanelShell({ open, title, onClose, children, footer, scrollRef }: Props) {
  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  if (!open) return null;

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-x-0 bottom-0 sm:inset-y-0 sm:right-0 sm:left-auto sm:w-[460px] z-50 flex flex-col bg-white sm:rounded-l-[28px] rounded-t-[28px] sm:rounded-tr-none shadow-pop animate-slide-up sm:animate-slide-in-right max-h-[92vh] sm:max-h-screen sm:h-screen">
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-line/60 flex-shrink-0">
          <h3 className="text-[17px] font-bold tracking-tight">{title}</h3>
          <button
            onClick={onClose}
            className="w-9 h-9 -mr-1.5 rounded-full hover:bg-bg flex items-center justify-center transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div
          ref={(el) => {
            if (scrollRef) scrollRef.current = el;
          }}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          {children}
        </div>
        {footer && (
          <div className="px-6 py-4 border-t border-line/60 bg-white flex-shrink-0">
            {footer}
          </div>
        )}
      </div>
    </>
  );
}
