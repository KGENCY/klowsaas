"use client";

import { Check, Plus } from "lucide-react";
import { useState } from "react";

interface Props {
  options: string[];
  selected: string[];
  onChange: (next: string[]) => void;
  max?: number;
  allowCustom?: boolean;
}

export function TagSelector({ options, selected, onChange, max, allowCustom }: Props) {
  const [custom, setCustom] = useState("");
  const merged = Array.from(new Set([...options, ...selected]));

  const toggle = (val: string) => {
    if (selected.includes(val)) {
      onChange(selected.filter((s) => s !== val));
    } else {
      if (max && selected.length >= max) return;
      onChange([...selected, val]);
    }
  };

  const addCustom = () => {
    const v = custom.trim();
    if (!v) return;
    if (max && selected.length >= max) return;
    onChange([...selected, v]);
    setCustom("");
  };

  return (
    <div>
      <div className="flex flex-wrap gap-2">
        {merged.map((opt) => {
          const active = selected.includes(opt);
          return (
            <button
              key={opt}
              onClick={() => toggle(opt)}
              className={`px-3.5 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-1.5 ${
                active
                  ? "bg-ink text-white border border-ink"
                  : "bg-white text-ink border border-line hover:border-ink/30"
              }`}
            >
              {active && <Check className="w-3 h-3" strokeWidth={3} />}
              {opt}
            </button>
          );
        })}
      </div>

      {allowCustom && (
        <div className="mt-3 flex gap-2">
          <input
            value={custom}
            onChange={(e) => setCustom(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                addCustom();
              }
            }}
            placeholder="직접 입력"
            className="flex-1 px-4 py-2.5 rounded-xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[13.5px]"
          />
          <button
            onClick={addCustom}
            className="px-3 rounded-xl bg-ink text-white text-[12.5px] font-medium flex items-center gap-1"
          >
            <Plus className="w-3.5 h-3.5" />
            추가
          </button>
        </div>
      )}

      {max && (
        <div className="mt-2 text-[11.5px] text-sub/70">
          {selected.length}/{max} 선택
        </div>
      )}
    </div>
  );
}
