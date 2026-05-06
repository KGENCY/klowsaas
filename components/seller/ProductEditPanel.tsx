"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { ImagePlus, Plus, X } from "lucide-react";
import type { EditFocus, Product, ProductData } from "@/types";
import { PanelShell } from "@/components/ui/PanelShell";
import { TagSelector } from "@/components/ui/TagSelector";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { benefitOptions, goodForOptions, ingredientOptions } from "@/lib/mockData";
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
  inline?: boolean;
  onClose: () => void;
  onApply: (productId: string, next: Product) => void;
  onLiveChange?: (productId: string, next: Product) => void;
}

const sectionOrder: EditFocus[] = [
  "image",
  "name",
  "benefits",
  "ingredients",
  "goodFor",
  "price",
];

const sectionTitles: Record<EditFocus, string> = {
  image: "대표 이미지",
  name: "상품명",
  benefits: "대표 효능",
  ingredients: "핵심 성분",
  goodFor: "피부 타입·고민",
  price: "가격",
};

export function ProductEditPanel({
  open,
  product,
  data,
  focus,
  liveUpdate,
  inline,
  onClose,
  onApply,
  onLiveChange,
}: Props) {
  const [draft, setDraft] = useState<Product | null>(product);
  const [krwRaw, setKrwRaw] = useState("");
  const scrollRef = useRef<HTMLDivElement | null>(null);
  const sectionRefs = useRef<Record<string, HTMLDivElement | null>>({});

  // Re-sync local draft only when the editing target changes (different
  // product) — not on every parent update, so the live-update loop does not
  // overwrite mid-edit state and cause the displayed price to flicker.
  useEffect(() => {
    if (product) {
      setDraft({ ...product });
      setKrwRaw(
        product.settlementKRW > 0
          ? product.settlementKRW.toLocaleString("ko-KR")
          : ""
      );
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [product?.id]);

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
    draft?.goodFor,
    draft?.imageType,
    draft?.discountRate,
    draft?.mainPhoto,
    draft?.photos,
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

  const photoInputRef = useRef<HTMLInputElement | null>(null);
  const mainPhotoInputRef = useRef<HTMLInputElement | null>(null);
  const onPickPhoto = () => photoInputRef.current?.click();
  const onPickMainPhoto = () => mainPhotoInputRef.current?.click();
  const addPhoto = (file: File) => {
    if (!draft) return;
    const url = URL.createObjectURL(file);
    update({ photos: [...draft.photos, url] });
  };
  const removePhoto = (url: string) => {
    if (!draft) return;
    update({ photos: draft.photos.filter((p) => p !== url) });
    if (url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
  };
  const setMainPhoto = (file: File) => {
    if (!draft) return;
    const prev = draft.mainPhoto;
    const url = URL.createObjectURL(file);
    update({ mainPhoto: url });
    if (prev && prev.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {}
    }
  };
  const clearMainPhoto = () => {
    if (!draft) return;
    const prev = draft.mainPhoto;
    update({ mainPhoto: undefined });
    if (prev && prev.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(prev);
      } catch {}
    }
  };

  const applyButton = (
    <button
      onClick={apply}
      className="w-full h-[54px] rounded-2xl bg-ink text-white font-semibold text-[15.5px] hover:opacity-90 transition-opacity"
    >
      적용하기
    </button>
  );

  const body = (
    <>
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
        <div className="flex items-start gap-3">
          <button
            type="button"
            onClick={onPickMainPhoto}
            className="group relative w-[180px] aspect-square rounded-2xl overflow-hidden border border-line bg-bg hover:border-ink/40 transition-colors"
          >
            {draft.mainPhoto ? (
              <img
                src={draft.mainPhoto}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <ProductVisual size="md" brandName={draft.brand} />
            )}
            <div className="absolute inset-x-0 bottom-0 h-8 bg-gradient-to-t from-ink/55 to-transparent flex items-center justify-center gap-1.5 text-white text-[11px] font-semibold opacity-0 group-hover:opacity-100 transition-opacity">
              <ImagePlus className="w-3.5 h-3.5" />
              {draft.mainPhoto ? "이미지 변경" : "이미지 업로드"}
            </div>
          </button>
          <div className="flex flex-col gap-1.5">
            <button
              type="button"
              onClick={onPickMainPhoto}
              className="px-3 h-9 rounded-xl bg-ink text-white text-[12px] font-semibold hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
            >
              <ImagePlus className="w-3.5 h-3.5" />
              {draft.mainPhoto ? "변경" : "업로드"}
            </button>
            {draft.mainPhoto && (
              <button
                type="button"
                onClick={clearMainPhoto}
                className="px-3 h-9 rounded-xl bg-white border border-line text-ink text-[12px] font-medium hover:bg-bg transition-colors"
              >
                기본으로
              </button>
            )}
          </div>
        </div>
        <input
          ref={mainPhotoInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) setMainPhoto(f);
            e.target.value = "";
          }}
        />

        <div className="mt-4 text-[11.5px] font-semibold text-sub mb-2">
          추가 사진
        </div>
        <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
          {draft.photos.map((url, i) => {
            const isImage =
              url.startsWith("blob:") ||
              url.startsWith("data:") ||
              url.startsWith("http") ||
              url.startsWith("/");
            return (
              <div
                key={`${url}-${i}`}
                className="relative w-[72px] h-[72px] flex-shrink-0 rounded-xl bg-bg border border-line overflow-hidden flex items-center justify-center"
              >
                {isImage ? (
                  <img
                    src={url}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <ImagePlus className="w-4 h-4 text-sub/60" />
                )}
                <button
                  type="button"
                  onClick={() => removePhoto(url)}
                  aria-label="사진 삭제"
                  className="absolute top-1 right-1 w-4 h-4 rounded-full bg-ink text-white flex items-center justify-center hover:opacity-90 transition-opacity"
                >
                  <X className="w-2.5 h-2.5" strokeWidth={2.8} />
                </button>
              </div>
            );
          })}
          <button
            type="button"
            onClick={onPickPhoto}
            className="w-[72px] h-[72px] flex-shrink-0 rounded-xl border-2 border-dashed border-line bg-white text-sub hover:border-ink/40 hover:text-ink transition-colors flex flex-col items-center justify-center gap-0.5"
          >
            <Plus className="w-4 h-4" />
            <span className="text-[10px] font-semibold">추가</span>
          </button>
        </div>
        <input
          ref={photoInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) addPhoto(f);
            e.target.value = "";
          }}
        />
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
          예: 광채 피부, 보습 · 최대 4개
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

      {/* Good for */}
      <Section refSet={setSectionRef("goodFor")} title={sectionTitles.goodFor}>
        <div className="text-[11.5px] text-sub mb-2">
          피부 타입·고민 키워드 · 최대 6개
        </div>
        <TagSelector
          options={goodForOptions}
          selected={draft.goodFor}
          onChange={(goodFor) => update({ goodFor })}
          max={6}
          allowCustom
        />
      </Section>

      {/* Price */}
      <Section refSet={setSectionRef("price")} title={sectionTitles.price}>
        <div className="rounded-2xl border border-line bg-white p-4">
          <div className="text-[11.5px] font-medium text-sub mb-1.5">
            실제 정산 받으실 금액 (₩)
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
          <div className="mt-2 inline-flex rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-black tracking-wide text-emerald-950">
            전 세계 무료배송 포함
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
            label="글로벌 배송비 포함"
            value={`+ ${formatUSD(data.shippingUSD)}`}
          />
          <BreakdownRow
            label="서비스 수수료"
            value={`${Math.round(data.paymentFeeRate * 100)}%`}
            sub="해외 결제·환전·운영 처리"
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
    </>
  );

  if (inline) {
    if (!open) return null;
    return (
      <div
        className="flex flex-col w-full bg-white rounded-[28px] border border-line shadow-card overflow-hidden animate-slide-in-right"
        style={{ height: "min(760px, calc(100vh - 160px))" }}
      >
        <div className="flex items-center justify-between px-6 pt-5 pb-4 border-b border-line/60 flex-shrink-0">
          <h3 className="text-[17px] font-bold tracking-tight">
            상세 페이지 다듬기
          </h3>
          <button
            onClick={onClose}
            aria-label="닫기"
            className="w-9 h-9 -mr-1.5 rounded-full hover:bg-bg flex items-center justify-center transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>
        </div>
        <div
          ref={(el) => {
            scrollRef.current = el;
          }}
          className="flex-1 overflow-y-auto px-6 py-5"
        >
          {body}
        </div>
        <div className="px-6 py-4 border-t border-line/60 bg-white flex-shrink-0">
          {applyButton}
        </div>
      </div>
    );
  }

  return (
    <PanelShell
      open={open}
      title="상세 페이지 다듬기"
      onClose={onClose}
      scrollRef={scrollRef}
      footer={applyButton}
    >
      {body}
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

