"use client";

import { useMemo, useState } from "react";
import {
  ArrowRight,
  Check,
  Globe2,
  Languages,
  Sparkles,
  Truck,
} from "lucide-react";
import { sanitizeSlug } from "@/lib/pricing";
import { AuthModal } from "./AuthModal";

interface Props {
  initialSlug: string;
  onSubmit: (slug: string) => void;
}

export function LinkCreateStep({ initialSlug, onSubmit }: Props) {
  const [raw, setRaw] = useState(initialSlug);
  const [authOpen, setAuthOpen] = useState(false);

  const slug = useMemo(() => sanitizeSlug(raw), [raw]);
  const isValid = slug.length >= 1;

  const submit = () => {
    if (!isValid) return;
    setAuthOpen(true);
  };

  return (
    <div className="relative min-h-[calc(100vh-72px)] flex items-start justify-center overflow-hidden px-5 pt-20 sm:px-6 sm:pt-28">
      <div className="absolute left-1/2 top-16 -z-10 h-[360px] w-[760px] -translate-x-1/2 rounded-full bg-white blur-3xl" />
      <div className="relative w-full max-w-[600px] animate-slide-up">
        <div className="mb-8 text-center">
          <div className="mx-auto mb-5 inline-flex items-center gap-1.5 rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-sub shadow-card">
            <Sparkles className="h-3.5 w-3.5 text-ink" />
            KLOW Global Seller
          </div>
          <h1 className="text-[34px] font-bold leading-[1.08] tracking-tight sm:text-[46px]">
            브랜드 링크 하나로
            <br />
            글로벌 판매를 시작하세요
          </h1>
          <p className="mt-5 text-[17px] leading-[1.55] text-sub sm:text-[19px]">
            상품 상세페이지만 올리면 결제, 배송, 글로벌 스토어까지
            <br className="hidden sm:block" /> 몇 분 안에 준비됩니다.
          </p>
        </div>

        <div className="flex items-center gap-2 rounded-[24px] border border-line bg-white px-6 py-5 shadow-card transition-all focus-within:border-ink/40 focus-within:shadow-pop">
          <span className="select-none text-[20px] font-semibold tracking-tight text-ink sm:text-[22px]">
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
            className="min-w-0 flex-1 bg-transparent text-[20px] font-semibold tracking-tight outline-none placeholder:font-normal placeholder:text-sub/40 sm:text-[22px]"
          />
          {isValid && (
            <div className="flex h-7 w-7 flex-shrink-0 items-center justify-center rounded-full bg-ink animate-pop">
              <Check className="h-3.5 w-3.5 text-white" strokeWidth={3} />
            </div>
          )}
        </div>

        {isValid && (
          <div className="mt-5 flex items-center gap-3.5 rounded-[20px] border border-line bg-white px-5 py-4 animate-fade-in">
            <div className="flex h-9 w-9 flex-shrink-0 items-center justify-center rounded-full bg-ink/5">
              <Globe2 className="h-4 w-4 text-ink" />
            </div>
            <div className="min-w-0 flex-1">
              <div className="text-[10.5px] font-semibold uppercase tracking-wider text-sub">
                내 글로벌 판매 링크
              </div>
              <div className="mt-0.5 truncate text-[17px] font-bold tracking-tight text-ink sm:text-[18px]">
                klow.kr/{slug}
              </div>
            </div>
          </div>
        )}

        <button
          onClick={submit}
          disabled={!isValid}
          className="mt-9 flex h-[60px] w-full items-center justify-center gap-2 rounded-2xl bg-ink text-[16px] font-semibold text-white transition-opacity hover:opacity-90 disabled:cursor-not-allowed disabled:bg-line disabled:text-sub/50"
        >
          글로벌 판매 시작하기
          <ArrowRight className="h-[18px] w-[18px]" />
        </button>

        <div className="mt-8 flex flex-wrap items-center justify-center gap-x-5 gap-y-2 text-[13.5px] font-medium text-sub">
          <Perk icon={<Globe2 className="h-3.5 w-3.5" />} label="180개국 결제" />
          <span className="opacity-30">·</span>
          <Perk icon={<Truck className="h-3.5 w-3.5" />} label="전세계 해외배송" />
          <span className="opacity-30">·</span>
          <Perk icon={<Languages className="h-3.5 w-3.5" />} label="자동 번역" />
        </div>
      </div>

      <AuthModal
        open={authOpen}
        onClose={() => setAuthOpen(false)}
        onSuccess={() => {
          setAuthOpen(false);
          onSubmit(slug);
        }}
      />
    </div>
  );
}

function Perk({ icon, label }: { icon: React.ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5">
      {icon}
      {label}
    </span>
  );
}
