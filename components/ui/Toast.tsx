"use client";

import { CheckCircle2 } from "lucide-react";

interface Props {
  visible: boolean;
  message: string;
}

export function Toast({ visible, message }: Props) {
  if (!visible) return null;
  return (
    <div className="fixed bottom-6 left-1/2 -translate-x-1/2 z-50 animate-pop">
      <div className="flex items-center gap-2 px-4 py-3 rounded-2xl bg-ink text-white shadow-pop">
        <CheckCircle2 className="w-4 h-4 text-white" />
        <span className="text-[13px] font-medium">{message}</span>
      </div>
    </div>
  );
}
