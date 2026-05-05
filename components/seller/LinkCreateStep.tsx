"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Globe2, Truck, Languages } from "lucide-react";
import { sanitizeSlug } from "@/lib/pricing";

interface Props {
  initialSlug: string;
  onSubmit: (slug: string) => void;
}

export function LinkCreateStep({ initialSlug, onSubmit }: Props) {
  const [raw, setRaw] = useState(initialSlug);

  const slug = useMemo(() => sanitizeSlug(raw), [raw]);
  const isValid = slug.length >= 3;

  const submit = () => {
    if (!isValid) return;
    onSubmit(slug);
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-start justify-center pt-24 sm:pt-32 px-6">
      <div className="relative w-full max-w-[600px] animate-slide-up">
        <div className="text-center mb-8">
          <h1 className="text-[34px] sm:text-[44px] font-bold leading-[1.1] tracking-tight">
            당신의 브랜드는
            <br />
            글로벌로 뻗어나가야 합니다
          </h1>
          <p className="mt-5 text-[17px] sm:text-[19px] text-sub leading-[1.55]">
            KLOW 링크로 전세계에 판매해보세요!
          </p>
        </div>

        {/* Hero input — emphasized */}
        <div className="flex items-center gap-2 px-6 py-5 rounded-[24px] bg-white border border-line focus-within:border-ink/40 focus-within:shadow-pop transition-all shadow-card">
          <span className="text-[20px] sm:text-[22px] text-ink select-none font-semibold tracking-tight">
            klow.kr/
          </span>
          <input
            autoFocus
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="brandname"
            className="flex-1 min-w-0 bg-transparent text-[20px] sm:text-[22px] font-semibold tracking-tight outline-none placeholder:text-sub/40 placeholder:font-normal"
          />
          {isValid && (
            <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center animate-pop flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {isValid && (
          <div className="mt-5 px-5 py-4 rounded-[20px] bg-white border border-line flex items-center gap-3.5 animate-fade-in">
            <div className="w-9 h-9 rounded-full bg-ink/5 flex items-center justify-center flex-shrink-0">
              <Globe2 className="w-4 h-4 text-ink" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-semibold tracking-wider text-sub uppercase">
                내 글로벌 판매 링크
              </div>
              <div className="mt-0.5 text-[17px] sm:text-[18px] font-bold text-ink truncate tracking-tight">
                klow.kr/{slug}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!isValid}
          className="mt-9 w-full h-[60px] rounded-2xl bg-ink text-white font-semibold text-[16px] flex items-center justify-center gap-2 disabled:bg-line disabled:text-sub/50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
        >
          글로벌 판매 시작하기
          <ArrowRight className="w-[18px] h-[18px]" />
        </button>

        <div className="mt-8 flex items-center justify-center gap-x-5 gap-y-2 flex-wrap text-[13.5px] font-medium text-sub">
          <Perk icon={<Globe2 className="w-3.5 h-3.5" />} label="180개국 결제" />
          <span className="opacity-30">·</span>
          <Perk icon={<Truck className="w-3.5 h-3.5" />} label="전세계 해외배송" />
          <span className="opacity-30">·</span>
          <Perk icon={<Languages className="w-3.5 h-3.5" />} label="자동 번역" />
        </div>
      </div>
    </div>
  );
}

function Perk({
  icon,
  label,
}: {
  icon: React.ReactNode;
  label: string;
}) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  );
}
