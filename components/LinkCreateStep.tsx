"use client";

import { useMemo, useState } from "react";
import { ArrowRight, Check, Globe2, Sparkles, Truck, Languages } from "lucide-react";
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
    <div className="relative min-h-[calc(100vh-72px)] flex items-start justify-center pt-10 sm:pt-14 px-6">
      <div className="relative w-full max-w-[600px] animate-slide-up">
        <div className="text-center mb-8">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-ink text-white text-[11.5px] font-semibold tracking-wide mb-5">
            <Sparkles className="w-3 h-3" />
            전세계로 파는 가장 쉬운 방법
          </div>
          <h1 className="text-[30px] sm:text-[36px] font-bold leading-[1.15] tracking-tight">
            링크 하나로
            <br />
            전세계에 판매하세요
          </h1>
          <p className="mt-4 text-[14px] sm:text-[15px] text-sub leading-[1.55]">
            상품만 올리면 KLOW가 자동으로 결제·번역·해외배송까지 처리해요.
            <br className="hidden sm:block" />
            나만의 글로벌 구매 링크를 5초만에 만들어 보세요.
          </p>
        </div>

        {/* Hero input — emphasized */}
        <div className="flex items-center gap-2 px-6 py-5 rounded-[24px] bg-white border border-line focus-within:border-ink/40 focus-within:shadow-pop transition-all shadow-card">
          <span className="text-[20px] sm:text-[22px] text-sub/80 select-none font-medium">
            klow.kr/
          </span>
          <input
            autoFocus
            value={raw}
            onChange={(e) => setRaw(e.target.value)}
            onKeyDown={(e) => {
              if (e.key === "Enter") submit();
            }}
            placeholder="my-brand"
            className="flex-1 min-w-0 bg-transparent text-[20px] sm:text-[22px] font-semibold tracking-tight outline-none placeholder:text-sub/40"
          />
          {isValid && (
            <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center animate-pop flex-shrink-0">
              <Check className="w-3.5 h-3.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {isValid && (
          <div className="mt-3 px-5 py-4 rounded-[20px] bg-white border border-line flex items-center gap-3.5 animate-fade-in">
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

        {/* Wider gap before secondary content */}
        <div className="mt-12 grid grid-cols-3 gap-2.5">
          <Perk icon={<Globe2 className="w-3.5 h-3.5" />} label="180개국 결제" />
          <Perk icon={<Truck className="w-3.5 h-3.5" />} label="해외배송 자동" />
          <Perk icon={<Languages className="w-3.5 h-3.5" />} label="번역 자동" />
        </div>

        <button
          onClick={submit}
          disabled={!isValid}
          className="mt-4 w-full h-[60px] rounded-2xl bg-ink text-white font-semibold text-[16px] flex items-center justify-center gap-2 disabled:bg-line disabled:text-sub/50 disabled:cursor-not-allowed transition-opacity hover:opacity-90"
        >
          글로벌 판매 시작하기
          <ArrowRight className="w-[18px] h-[18px]" />
        </button>

        <p className="mt-4 text-center text-[11.5px] text-sub/80">
          가입·심사 없이 바로 시작 · 판매 수수료 외 비용 없음
        </p>
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
    <div className="flex items-center justify-center gap-1.5 h-12 rounded-xl bg-white border border-line text-[12.5px] font-semibold text-ink/85">
      {icon}
      {label}
    </div>
  );
}
