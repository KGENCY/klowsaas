"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Check } from "lucide-react";
import type { EditFocus, Product, ProductData } from "@/types";
import { PanelShell } from "./PanelShell";
import { TagSelector } from "./TagSelector";
import { ProductVisual } from "./ProductVisual";
import { benefitOptions, ingredientOptions } from "@/lib/mockData";
import {
  calculateCustomerPriceUSD,
  formatKRW,
  formatUSD,
  parseKRWInput,
  round2,
} from "@/lib/pricing";

interface Props {
  open: boolean;
  product: Product | null;
  data: ProductData;
  focus: EditFocus | null;
  liveUpdate?: boolean;
  onClose: () => void;
  onApply: (productId: string, next: Product) => void;
  onLiveChange?: (productId: string, next: Product) => void;
}

const sectionOrder: EditFocus[] = [
  "image",
  "name",
  "benefits",
  "ingredients",
  "price",
];

const sectionTitles: Record<EditFocus, string> = {
  image: "대표 이미지",
  name: "상품명",
  benefits: "Main benefits",
  ingredients: "Key ingredients",
  price: "가격",
};

export function ProductEditPanel({
  open,
  product,
  data,
  focus,
  liveUpdate,
  onClose,
  onApply,
  onLiveChange,
}: Props) {
  const [draft, setDraft] = useState<Product | null>(product);
  const [krwRaw, setKrwRaw] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  useEffect(() => {
    if (product) {
      setDraft({ ...product });
      setKrwRaw(
        product.settlementKRW > 0
          ? product.settlementKRW.toLocaleString("ko-KR")
          : ""
      );
    }
  }, [product]);

  useEffect(() => {
    if (!open || !focus) return;
    const t = setTimeout(() => {
      const el = sectionRefs.current[focus];
      if (el && scrollRef.current) {
        scrollRef.current.scrollTo({
          top: el.offsetTop - 12,
          behavior: "smooth",
        });
      }
    }, 60);
    return () => clearTimeout(t);
  }, [open, focus]);

  const krw = useMemo(() => parseKRWInput(krwRaw), [krwRaw]);
  const calc = useMemo(
    () =>
      calculateCustomerPriceUSD({
        settlementKRW: krw,
        exchangeRate: data.exchangeRate,
        shippingUSD: data.shippingUSD,
        paymentFeeRate: data.paymentFeeRate,
      }),
    [krw, data.exchangeRate, data.shippingUSD, data.paymentFeeRate]
  );

  // Push changes upward live so the mockup beside the panel reflects edits.
  useEffect(() => {
    if (!liveUpdate || !onLiveChange || !draft || !product) return;
    const newPrice = calc.customerPriceUSD;
    const newOriginal =
      draft.discountRate > 0
        ? round2(newPrice / (1 - draft.discountRate / 100))
        : newPrice;
    onLiveChange(product.id, {
      ...draft,
      settlementKRW: krw,
      priceUSD: newPrice,
      originalPriceUSD: newOriginal,
    });
    // We intentionally only depend on draft fields the mockup reads
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [
    draft?.name,
    draft?.benefits,
    draft?.ingredients,
    draft?.imageType,
    draft?.discountRate,
    krw,
    liveUpdate,
  ]);

  if (!draft || !product) return null;

  const update = (patch: Partial<Product>) => {
    setDraft((d) => (d ? { ...d, ...patch } : d));
  };

  const apply = () => {
    if (!draft) return;
    const newPrice = calc.customerPriceUSD;
    const newOriginal =
      draft.discountRate > 0
        ? round2(newPrice / (1 - draft.discountRate / 100))
        : newPrice;
    onApply(product.id, {
      ...draft,
      settlementKRW: krw,
      priceUSD: newPrice,
      originalPriceUSD: newOriginal,
    });
  };

  const setSectionRef = (key: EditFocus) => (el: HTMLDivElement | null) => {
    sectionRefs.current[key] = el;
  };

  return (
    <PanelShell
      open={open}
      title="상세 페이지 다듬기"
      onClose={onClose}
      scrollRef={scrollRef}
      footer={
        <button
          onClick={apply}
          className="w-full h-[54px] rounded-2xl bg-ink text-white font-semibold text-[15.5px] hover:opacity-90 transition-opacity"
        >
          적용하기
        </button>
      }
    >
      {/* Section nav */}
      <div className="-mx-6 px-6 pb-3 mb-1 flex gap-1.5 overflow-x-auto scrollbar-hide sticky top-0 bg-white z-10">
        {sectionOrder.map((s) => (
          <button
            key={s}
            onClick={() => {
              const el = sectionRefs.current[s];
              if (el && scrollRef.current) {
                scrollRef.current.scrollTo({
                  top: el.offsetTop - 12,
                  behavior: "smooth",
                });
              }
            }}
            className={`px-3 py-1.5 rounded-full text-[11.5px] font-medium whitespace-nowrap border transition-colors ${
              focus === s
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-sub hover:border-ink/30"
            }`}
          >
            {sectionTitles[s]}
          </button>
        ))}
      </div>

      {/* Image */}
      <Section refSet={setSectionRef("image")} title={sectionTitles.image}>
        <div className="aspect-square rounded-2xl overflow-hidden border border-line">
          <ProductVisual type={draft.imageType} size="lg" brandName={draft.brand} />
        </div>
        <button
          onClick={() => update({ imageType: "custom" })}
          className="mt-3 w-full h-[44px] rounded-xl border border-dashed border-line hover:border-ink/40 transition-colors flex items-center justify-center gap-2 text-[13px] font-medium text-sub"
        >
          <ImagePlus className="w-4 h-4" />새 이미지 업로드
        </button>
      </Section>

      {/* Name */}
      <Section refSet={setSectionRef("name")} title={sectionTitles.name}>
        <input
          value={draft.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="제품명을 입력하세요"
          className="w-full px-4 py-3.5 rounded-2xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[15px] font-medium"
        />
      </Section>

      {/* Benefits */}
      <Section refSet={setSectionRef("benefits")} title={sectionTitles.benefits}>
        <div className="text-[11.5px] text-sub mb-2">
          예: Glass skin, Hydration · 최대 4개
        </div>
        <TagSelector
          options={benefitOptions}
          selected={draft.benefits}
          onChange={(benefits) => update({ benefits })}
          max={4}
        />
      </Section>

      {/* Ingredients */}
      <Section
        refSet={setSectionRef("ingredients")}
        title={sectionTitles.ingredients}
      >
        <div className="text-[11.5px] text-sub mb-2">
          핵심 성분 · 최대 6개
        </div>
        <TagSelector
          options={ingredientOptions}
          selected={draft.ingredients}
          onChange={(ingredients) => update({ ingredients })}
          max={6}
          allowCustom
        />
      </Section>

      {/* Price */}
      <Section refSet={setSectionRef("price")} title={sectionTitles.price}>
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="text-[11.5px] font-medium text-sub mb-1.5">
            정산 희망 금액 (₩)
          </div>
          <div className="flex items-center gap-2">
            <span className="text-[26px] font-bold">₩</span>
            <input
              value={krwRaw}
              onChange={(e) => {
                const num = parseKRWInput(e.target.value);
                setKrwRaw(num ? num.toLocaleString("ko-KR") : "");
              }}
              placeholder="32,000"
              className="flex-1 text-[26px] font-bold outline-none bg-transparent placeholder:text-sub/30"
            />
          </div>
        </div>

        <div className="mt-3 rounded-2xl bg-ink p-4 text-white">
          <div className="text-[11px] font-medium opacity-80 mb-0.5">
            해외 고객 판매가
          </div>
          <div className="text-[32px] font-bold tracking-tight leading-none">
            {formatUSD(calc.customerPriceUSD)}
          </div>
        </div>

        <div className="mt-3 rounded-2xl border border-line divide-y divide-line/70 overflow-hidden bg-white">
          <BreakdownRow label="정산 희망" value={formatKRW(krw)} />
          <BreakdownRow
            label="달러 환산"
            value={formatUSD(calc.settlementUSD)}
            sub={`₩${data.exchangeRate.toLocaleString()} = $1`}
          />
          <BreakdownRow
            label="KLOW 배송비"
            value={`+ ${formatUSD(data.shippingUSD)}`}
          />
          <BreakdownRow
            label="결제 처리"
            value={`${Math.round(data.paymentFeeRate * 100)}%`}
            sub="해외 카드·환전 처리"
            muted
          />
        </div>

        {/* Discount rate */}
        <div className="mt-4">
          <div className="flex items-center justify-between mb-2">
            <span className="text-[11.5px] font-medium text-sub">할인율</span>
            <span className="text-[14px] font-bold text-ink">
              {draft.discountRate}%
            </span>
          </div>
          <input
            type="range"
            min={0}
            max={50}
            step={1}
            value={draft.discountRate}
            onChange={(e) =>
              update({ discountRate: parseInt(e.target.value, 10) })
            }
            className="w-full accent-ink"
          />
          {draft.discountRate > 0 && (
            <div className="mt-1 text-[10.5px] text-sub">
              원가 표시:{" "}
              <span className="font-semibold text-ink">
                {formatUSD(
                  round2(calc.customerPriceUSD / (1 - draft.discountRate / 100))
                )}
              </span>
            </div>
          )}
        </div>
      </Section>
    </PanelShell>
  );
}

function Section({
  title,
  children,
  refSet,
}: {
  title: string;
  children: React.ReactNode;
  refSet: (el: HTMLDivElement | null) => void;
}) {
  return (
    <div
      ref={refSet}
      className="py-5 border-t border-line/60 first:border-t-0 first:pt-1"
    >
      <div className="text-[12.5px] font-bold text-ink mb-3">{title}</div>
      {children}
    </div>
  );
}

function BreakdownRow({
  label,
  value,
  sub,
  muted,
}: {
  label: string;
  value: string;
  sub?: string;
  muted?: boolean;
}) {
  return (
    <div className="flex items-center justify-between px-4 py-2.5">
      <div>
        <div
          className={`text-[12px] ${muted ? "text-sub" : "text-ink font-medium"}`}
        >
          {label}
        </div>
        {sub && <div className="text-[10px] text-sub/70 mt-0.5">{sub}</div>}
      </div>
      <div
        className={`text-[12.5px] font-semibold ${muted ? "text-sub" : "text-ink"}`}
      >
        {value}
      </div>
    </div>
  );
}

