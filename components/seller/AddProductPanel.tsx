"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Wand2,
  Check,
  FileText,
  Sparkles,
  Upload,
  ArrowLeft,
  ArrowRight,
  Plus,
  Search,
  X,
} from "lucide-react";
import type { Product, ProductData } from "@/types";
import {
  calculateCustomerPriceUSD,
  formatUSD,
  parseKRWInput,
} from "@/lib/pricing";
import { goodForOptions, mockAutofillFromFile } from "@/lib/mockData";
import { ProductVisual } from "@/components/ui/ProductVisual";

type Tab = "file" | "manual";
type Step = "upload" | "info" | "price" | "creator";

interface Props {
  open: boolean;
  product: Product | null;
  data: ProductData;
  initialTab?: Tab;
  initialStep?: Step;
  onChange: (productId: string, next: Product) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AddProductPanel({
  open,
  product,
  data,
  initialTab,
  initialStep,
  onChange,
  onConfirm,
  onCancel,
}: Props) {
  const [tab, setTab] = useState<Tab>(initialTab ?? "file");
  const [step, setStep] = useState<Step>(
    initialStep ?? (initialTab === "manual" ? "info" : "upload")
  );
  const [autoFilling, setAutoFilling] = useState(false);
  const [settlementRaw, setSettlementRaw] = useState("");
  const fileInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      const t = initialTab ?? "file";
      const s = initialStep ?? (t === "manual" ? "info" : "upload");
      setTab(t);
      setStep(s);
      setSettlementRaw("");
      setAutoFilling(false);
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [open]);

  const switchTab = (next: Tab) => {
    setTab(next);
    setStep(next === "file" ? "upload" : "info");
  };

  const settlementKRW = useMemo(() => parseKRWInput(settlementRaw), [settlementRaw]);

  const calc = useMemo(
    () =>
      calculateCustomerPriceUSD({
        settlementKRW,
        exchangeRate: data.exchangeRate,
        shippingUSD: data.shippingUSD,
        paymentFeeRate: data.paymentFeeRate,
      }),
    [settlementKRW, data.exchangeRate, data.shippingUSD, data.paymentFeeRate]
  );

  // Push price changes live to the mockup
  useEffect(() => {
    if (!product) return;
    const newPrice = settlementKRW > 0 ? calc.customerPriceUSD : 0;
    onChange(product.id, {
      ...product,
      settlementKRW,
      priceUSD: newPrice,
      originalPriceUSD: newPrice,
    });
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [settlementKRW]);

  if (!product) return null;

  const update = (patch: Partial<Product>) => {
    onChange(product.id, { ...product, ...patch });
  };

  const onPickFile = () => fileInputRef.current?.click();
  const onPickPhoto = () => photoInputRef.current?.click();

  const addPhoto = (file: File) => {
    const url = URL.createObjectURL(file);
    update({ photos: [...product.photos, url] });
  };
  const removePhoto = (url: string) => {
    update({ photos: product.photos.filter((p) => p !== url) });
    if (url.startsWith("blob:")) {
      try {
        URL.revokeObjectURL(url);
      } catch {}
    }
  };

  const handleFile = (file: File) => {
    setAutoFilling(true);
    update({ detailFileName: file.name });
    setTimeout(() => {
      const filled = mockAutofillFromFile(file.name, product.brand);
      onChange(product.id, {
        ...product,
        ...filled,
        detailFileName: file.name,
      });
      setAutoFilling(false);
      setStep("info");
    }, 1100);
  };

  const infoReady = product.name.trim().length > 0;
  const priceReady = settlementKRW > 0;

  return (
    <div
      className={`flex flex-col w-full bg-white rounded-[28px] border border-line shadow-card overflow-hidden ${
        open ? "animate-slide-in-right" : ""
      }`}
      style={{ height: "min(760px, calc(100vh - 160px))" }}
    >
      {/* Tabs */}
      <div className="px-6 pt-5 pb-1 flex-shrink-0">
        <div className="grid grid-cols-2 p-1 rounded-2xl bg-bg border border-line">
          <TabBtn
            active={tab === "file"}
            icon={<Wand2 className="w-3.5 h-3.5" />}
            label="파일 한 번에"
            onClick={() => switchTab("file")}
          />
          <TabBtn
            active={tab === "manual"}
            icon={<ImagePlus className="w-3.5 h-3.5" />}
            label="직접 입력"
            onClick={() => switchTab("manual")}
          />
        </div>

        {/* Step indicator */}
        <StepDots
          steps={tab === "file"
            ? ["upload", "info", "price", "creator"]
            : ["info", "price", "creator"]}
          current={step}
        />
      </div>

      {/* Body */}
      <div className="flex-1 px-6 py-5 overflow-y-auto">
        {step === "upload" && (
          <UploadStep
            autoFilling={autoFilling}
            hasFile={!!product.detailFileName}
            fileName={product.detailFileName}
            onPick={onPickFile}
            onFile={handleFile}
          />
        )}
        {step === "info" && (
          <InfoStep
            product={product}
            mode={tab}
            onUpdate={update}
            onPickPhoto={onPickPhoto}
            onRemovePhoto={removePhoto}
          />
        )}
        {step === "price" && (
          <PriceStep
            settlementRaw={settlementRaw}
            setSettlementRaw={setSettlementRaw}
            customerPriceUSD={calc.customerPriceUSD}
            settlementKRW={settlementKRW}
            exchangeRate={data.exchangeRate}
            shippingUSD={data.shippingUSD}
            paymentFeeRate={data.paymentFeeRate}
          />
        )}
        {step === "creator" && <CreatorStep product={product} data={data} />}

        {/* Hidden inputs */}
        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleFile(f);
            e.target.value = "";
          }}
        />
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
      </div>

      {/* Footer */}
      <Footer
        step={step}
        tab={tab}
        infoReady={infoReady}
        priceReady={priceReady}
        autoFilling={autoFilling}
        onCancel={onCancel}
        onBack={() => {
          if (step === "info") setStep(tab === "file" ? "upload" : "info");
          else if (step === "price") setStep("info");
          else if (step === "creator") setStep("price");
        }}
        onNext={() => {
          if (step === "info") setStep("price");
          else if (step === "price") setStep("creator");
        }}
        onConfirm={onConfirm}
      />
    </div>
  );
}

/* ─────────────── Steps ─────────────── */

function UploadStep({
  autoFilling,
  hasFile,
  fileName,
  onPick,
  onFile,
}: {
  autoFilling: boolean;
  hasFile: boolean;
  fileName?: string;
  onPick: () => void;
  onFile: (file: File) => void;
}) {
  const [isDragOver, setIsDragOver] = useState(false);

  const isAcceptedFile = (file: File) =>
    file.type === "application/pdf" ||
    file.type === "image/png" ||
    file.type === "image/jpeg";

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (autoFilling) return;
    if (!isDragOver) setIsDragOver(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (autoFilling) return;
    const file = e.dataTransfer.files?.[0];
    if (file && isAcceptedFile(file)) onFile(file);
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-[24px] sm:text-[26px] font-bold leading-[1.25] tracking-tight">
        제품의 상세페이지
        <br />한 장만 올려주세요
      </h2>
      <p className="mt-2.5 text-[14px] text-sub leading-[1.6]">
        번역·결제·해외배송은 KLOW가 해줄게요!
      </p>

      <button
        onClick={onPick}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
        disabled={autoFilling}
        className={`mt-6 relative w-full rounded-2xl border-2 border-dashed transition-all overflow-hidden ${
          isDragOver
            ? "bg-ink/5 border-ink"
            : hasFile
            ? "bg-bg border-ink/40"
            : "bg-white border-line hover:border-ink/40 hover:bg-bg/60"
        } ${autoFilling ? "pointer-events-none" : ""}`}
        style={{ minHeight: 200 }}
      >
        {autoFilling ? (
          <div className="flex flex-col items-center justify-center gap-3 py-10 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center animate-pulse-soft">
              <Sparkles className="w-5 h-5 text-white" />
            </div>
            <div className="text-[13.5px] font-semibold text-ink">
              상세페이지를 읽고 있어요
            </div>
            <div className="text-[11.5px] text-sub">
              제품명 · 효능 · 성분을 자동으로 정리하는 중
            </div>
          </div>
        ) : hasFile ? (
          <div className="flex flex-col items-center justify-center gap-2 py-10 animate-fade-in">
            <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center">
              <Check className="w-5 h-5 text-white" strokeWidth={3} />
            </div>
            <div className="text-[13px] font-semibold text-ink">
              파일 인식 완료
            </div>
            <div className="text-[11.5px] text-sub flex items-center gap-1.5 max-w-[80%] truncate">
              <FileText className="w-3 h-3 flex-shrink-0" />
              {fileName}
            </div>
          </div>
        ) : isDragOver ? (
          <div className="flex flex-col items-center justify-center gap-2 py-12 animate-fade-in">
            <div className="w-12 h-12 rounded-full bg-ink flex items-center justify-center">
              <Upload className="w-5 h-5 text-white" />
            </div>
            <div className="text-[14px] font-semibold text-ink">
              여기에 놓으면 바로 시작
            </div>
            <div className="text-[11.5px] text-sub">
              파일을 놓아주세요
            </div>
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center gap-2 py-12">
            <div className="w-12 h-12 rounded-full bg-ink/5 flex items-center justify-center">
              <Upload className="w-5 h-5 text-ink" />
            </div>
            <div className="text-[14px] font-semibold text-ink">
              상세페이지 파일 올리기
            </div>
            <div className="text-[11.5px] text-sub">
              클릭하거나 파일을 끌어다 놓기 · PDF · PNG · JPG
            </div>
          </div>
        )}
      </button>
    </div>
  );
}

function InfoStep({
  product,
  mode,
  onUpdate,
  onPickPhoto,
  onRemovePhoto,
}: {
  product: Product;
  mode: Tab;
  onUpdate: (patch: Partial<Product>) => void;
  onPickPhoto: () => void;
  onRemovePhoto: (name: string) => void;
}) {
  const isAuto = mode === "file";

  return (
    <div className="animate-fade-in">
      {!isAuto && (
        <h2 className="text-[24px] sm:text-[26px] font-bold leading-[1.25] tracking-tight">
          제품 정보를 입력해주세요!
        </h2>
      )}

      <div className={`${isAuto ? "" : "mt-5"} space-y-5`}>
        <Block label="대표 사진">
          <PhotoRow
            photos={product.photos}
            hasExtracted={!!product.detailFileName}
            brand={product.brand}
            onPick={onPickPhoto}
            onRemove={onRemovePhoto}
            max={6}
          />
        </Block>

        <Block label="제품명">
          <input
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="글로우 데일리 에센스"
            className="w-full px-4 py-3.5 rounded-xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[16px] font-semibold"
          />
        </Block>

        <Block label="대표 효능">
          <EditablePillRow
            items={product.benefits}
            variant="solid"
            placeholder="효능 추가 (예: 광채 피부)"
            max={6}
            onChange={(benefits) => onUpdate({ benefits })}
          />
        </Block>

        <Block label="핵심 성분">
          <EditablePillRow
            items={product.ingredients}
            variant="outline"
            placeholder="성분 추가 (예: 나이아신아마이드)"
            max={8}
            onChange={(ingredients) => onUpdate({ ingredients })}
          />
        </Block>

        <Block label="SKIN MATCH">
          <EditablePillRow
            items={product.goodFor}
            variant="outline"
            placeholder="추가 (예: 건성 피부)"
            max={6}
            onChange={(goodFor) => onUpdate({ goodFor })}
          />
          <SuggestionChips
            options={goodForOptions}
            selected={product.goodFor}
            onAdd={(v) => onUpdate({ goodFor: [...product.goodFor, v] })}
          />
        </Block>
      </div>
    </div>
  );
}

function PhotoRow({
  photos,
  hasExtracted,
  brand,
  onPick,
  onRemove,
  max,
}: {
  photos: string[];
  hasExtracted: boolean;
  brand: string;
  onPick: () => void;
  onRemove: (url: string) => void;
  max: number;
}) {
  const isFirstUpload = photos.length === 0;
  return (
    <div className="flex items-center gap-2.5 overflow-x-auto scrollbar-hide pt-2 pb-2">
      {hasExtracted && (
        <div className="relative w-[108px] h-[108px] flex-shrink-0 rounded-2xl bg-bg border border-line overflow-hidden">
          <ProductVisual size="sm" brandName={brand} />
          <span className="absolute top-1.5 left-1.5 px-1.5 py-0.5 rounded-full bg-ink text-white text-[9.5px] font-bold tracking-wide">
            메인
          </span>
        </div>
      )}
      {photos.map((url, i) => {
        const isImage = url.startsWith("blob:") || url.startsWith("http") || url.startsWith("data:");
        return (
          <div
            key={`${url}-${i}`}
            className="relative w-[108px] h-[108px] flex-shrink-0 rounded-2xl bg-bg border border-line overflow-hidden flex items-center justify-center"
          >
            {isImage ? (
              <img
                src={url}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <>
                <ImagePlus className="w-6 h-6 text-sub/60" />
                <span className="absolute bottom-1.5 left-1.5 right-1.5 text-[10.5px] text-center font-medium text-sub truncate">
                  {url.replace(/\.[^.]+$/, "")}
                </span>
              </>
            )}
            <button
              type="button"
              onClick={() => onRemove(url)}
              aria-label="사진 삭제"
              className="absolute top-1.5 right-1.5 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center hover:opacity-90 transition-opacity"
            >
              <X className="w-3 h-3" strokeWidth={2.8} />
            </button>
          </div>
        );
      })}
      {photos.length < max && (
        <button
          type="button"
          onClick={onPick}
          className={`w-[108px] h-[108px] flex-shrink-0 rounded-2xl border-2 border-dashed bg-white transition-colors flex flex-col items-center justify-center gap-1.5 ${
            isFirstUpload
              ? "animate-pulse-scale border-ink/60 text-ink"
              : "border-line text-sub hover:border-ink/40 hover:bg-bg/60 hover:text-ink"
          }`}
        >
          <Plus className="w-6 h-6" />
          <span className="text-[11.5px] font-semibold">사진 추가</span>
        </button>
      )}
    </div>
  );
}

function EditablePillRow({
  items,
  variant,
  placeholder,
  max,
  onChange,
}: {
  items: string[];
  variant: "solid" | "outline";
  placeholder: string;
  max: number;
  onChange: (next: string[]) => void;
}) {
  const [adding, setAdding] = useState(false);
  const [draft, setDraft] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (adding) inputRef.current?.focus();
  }, [adding]);

  const remove = (item: string) => {
    onChange(items.filter((x) => x !== item));
  };

  const submit = () => {
    const v = draft.trim();
    if (!v) {
      setAdding(false);
      setDraft("");
      return;
    }
    if (!items.includes(v) && items.length < max) {
      onChange([...items, v]);
    }
    setDraft("");
    setAdding(false);
  };

  return (
    <div className="flex flex-wrap items-center gap-2">
      {items.map((it) => (
        <span
          key={it}
          className={`group inline-flex items-center gap-1 pl-3.5 pr-2 py-2 rounded-full text-[14.5px] font-semibold ${
            variant === "solid"
              ? "bg-ink text-white"
              : "bg-white border border-line text-ink/90"
          }`}
        >
          {it}
          <button
            type="button"
            onClick={() => remove(it)}
            className={`w-5 h-5 rounded-full flex items-center justify-center transition-colors ${
              variant === "solid"
                ? "hover:bg-white/15"
                : "hover:bg-ink/5"
            }`}
            aria-label={`${it} 삭제`}
          >
            <X className="w-3.5 h-3.5" strokeWidth={2.5} />
          </button>
        </span>
      ))}
      {adding ? (
        <span className="inline-flex items-center px-3 py-1.5 rounded-full bg-bg border border-ink/30">
          <input
            ref={inputRef}
            value={draft}
            onChange={(e) => setDraft(e.target.value)}
            onBlur={submit}
            onKeyDown={(e) => {
              if (e.key === "Enter") {
                e.preventDefault();
                submit();
              } else if (e.key === "Escape") {
                setDraft("");
                setAdding(false);
              }
            }}
            placeholder={placeholder}
            className="bg-transparent text-[14.5px] font-semibold outline-none w-[200px] placeholder:text-sub/50"
          />
        </span>
      ) : items.length < max ? (
        <button
          type="button"
          onClick={() => setAdding(true)}
          className="inline-flex items-center gap-1 pl-2.5 pr-3.5 py-2 rounded-full border border-dashed border-line text-[14px] font-semibold text-sub hover:border-ink/40 hover:text-ink transition-colors"
        >
          <Plus className="w-4 h-4" />
          추가
        </button>
      ) : null}
    </div>
  );
}

function PriceStep({
  settlementRaw,
  setSettlementRaw,
  customerPriceUSD,
  settlementKRW,
  exchangeRate,
  shippingUSD,
  paymentFeeRate,
}: {
  settlementRaw: string;
  setSettlementRaw: (v: string) => void;
  customerPriceUSD: number;
  settlementKRW: number;
  exchangeRate: number;
  shippingUSD: number;
  paymentFeeRate: number;
}) {
  const onChange = (raw: string) => {
    const num = parseKRWInput(raw);
    setSettlementRaw(num ? num.toLocaleString("ko-KR") : "");
  };

  return (
    <div className="animate-fade-in">
      <h2 className="text-[22px] sm:text-[24px] font-bold leading-[1.25] tracking-tight">
        실제 정산 받으실
        <br />금액(KRW)을 입력해 주세요!
      </h2>
      <p className="mt-2.5 text-[13px] text-sub leading-[1.55]">
        대표님이 수령할 제품당 정산액을 입력하세요. 배송비와 수수료는 KLOW가 알아서 계산합니다.
      </p>

      <div className="mt-4 flex flex-wrap gap-2">
        <Badge>글로벌 배송비 ${shippingUSD.toFixed(2)} 포함</Badge>
        <Badge>서비스 수수료 {Math.round(paymentFeeRate * 100)}%</Badge>
      </div>

      <div className="mt-5 rounded-2xl border border-line bg-white px-5 py-4 focus-within:border-ink/40 transition-colors">
        <div className="text-[10.5px] font-semibold tracking-wider text-sub uppercase mb-1">
          최종 정산 금액 입력 (Net Payout in KRW)
        </div>
        <div className="flex items-baseline gap-2">
          <span className="text-[28px] font-bold text-ink">₩</span>
          <input
            value={settlementRaw}
            onChange={(e) => onChange(e.target.value)}
            placeholder="32,000"
            inputMode="numeric"
            autoFocus
            className="flex-1 min-w-0 text-[28px] font-bold tracking-tight outline-none bg-transparent placeholder:text-sub/30"
          />
        </div>
      </div>

      <div className="mt-3 rounded-2xl bg-klow text-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] opacity-80">해외 고객 판매가</span>
          <span className="text-[10px] opacity-50 tracking-wider">USD</span>
        </div>
        <div className="mt-2 flex flex-wrap items-end gap-2">
          <div className="text-[34px] font-bold tracking-tight leading-none">
            {settlementKRW > 0 ? formatUSD(customerPriceUSD) : "—"}
          </div>
          {settlementKRW > 0 && (
            <span className="rounded-full bg-emerald-400 px-2.5 py-1 text-[10px] font-black tracking-wide text-emerald-950">
              전 세계 무료배송 포함
            </span>
          )}
        </div>
        <div className="mt-3 pt-3 border-t border-white/20 grid grid-cols-3 gap-1.5 text-[10.5px] text-white/80">
          <Pill>환율 ₩{exchangeRate.toLocaleString("ko-KR")}</Pill>
          <Pill>배송비 ${shippingUSD} 포함</Pill>
          <Pill>수수료 {Math.round(paymentFeeRate * 100)}%</Pill>
        </div>
      </div>
    </div>
  );
}

const creatorFilters = [
  "전체",
  "미국",
  "일본",
  "태국",
  "민감성 피부",
  "지성 피부",
  "클린뷰티",
  "글래스 스킨",
  "비건뷰티",
] as const;

const creators = [
  {
    name: "YEONSEUL",
    handle: "@yeonseul.glow",
    country: "미국 / 캐나다",
    categoryTags: ["클린뷰티"],
    skinTags: ["민감성 피부", "피부 장벽"],
    score: 98,
    accent: "bg-violet-50 text-violet-700 border-violet-100",
  },
  {
    name: "Joana",
    handle: "@joana.kbeauty",
    country: "일본",
    categoryTags: ["글래스 스킨"],
    skinTags: ["지성 피부", "모공"],
    score: 94,
    accent: "bg-sky-50 text-sky-700 border-sky-100",
  },
  {
    name: "Mina",
    handle: "@minainseoul",
    country: "태국 / 베트남",
    categoryTags: ["비건뷰티"],
    skinTags: ["건성 피부", "보습"],
    score: 91,
    accent: "bg-amber-50 text-amber-700 border-amber-100",
  },
  {
    name: "Lina",
    handle: "@lina.cleanlab",
    country: "유럽",
    categoryTags: ["클린뷰티"],
    skinTags: ["트러블 피부", "민감성 피부"],
    score: 89,
    accent: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
];

type Creator = (typeof creators)[number];

function CreatorStep({ product, data }: { product: Product; data: ProductData }) {
  const [activeFilter, setActiveFilter] = useState<(typeof creatorFilters)[number]>("전체");
  const [query, setQuery] = useState("");
  const [selectedCreator, setSelectedCreator] = useState<Creator | null>(null);

  const normalizedQuery = query.trim().toLowerCase();
  const visibleCreators = creators.filter((creator) => {
    const haystack = [
      creator.name,
      creator.handle,
      creator.country,
      ...creator.categoryTags,
      ...creator.skinTags,
    ]
      .join(" ")
      .toLowerCase();
    const queryMatch = !normalizedQuery || haystack.includes(normalizedQuery);
    const filterMatch =
      activeFilter === "전체" ||
      creator.country.includes(activeFilter) ||
      creator.categoryTags.includes(activeFilter) ||
      creator.skinTags.includes(activeFilter);
    return queryMatch && filterMatch;
  });

  return (
    <div className="animate-fade-in">
      <div className="flex items-start justify-between gap-3">
        <div>
          <span className="inline-flex rounded-full border border-klow/15 bg-klow/5 px-2.5 py-1 text-[10px] font-black uppercase tracking-wide text-klow">
            선택사항
          </span>
          <h2 className="mt-3 text-[22px] sm:text-[24px] font-bold leading-[1.25] tracking-tight">
            선택형 글로벌 노출 지원
          </h2>
          <p className="mt-2 text-[14px] font-semibold leading-[1.5] text-ink">
            글로벌 노출을 원한다면,
            <br />
            제품과 잘 맞는 크리에이터에게 샘플을 보내보세요
          </p>
        </div>
      </div>

      <p className="mt-3 text-[12.5px] text-sub leading-[1.6]">
        KLOW가 현재 활동 중인 글로벌 크리에이터 중 제품 컨셉과 잘 맞는
        크리에이터를 추천해드려요.
      </p>
      <p className="mt-2 text-[11.5px] text-sub/80 leading-[1.5]">
        선택사항입니다. 지금 건너뛰고 나중에 다시 진행해도 괜찮아요.
      </p>

      <div className="mt-5 relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-4 h-4 text-sub" />
        <input
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="국가, 피부 타입, 카테고리로 검색"
          className="w-full h-12 rounded-2xl bg-bg border border-line pl-11 pr-4 text-[13.5px] outline-none focus:border-klow/50 focus:bg-white"
        />
      </div>

      <div className="mt-3 flex gap-1.5 overflow-x-auto scrollbar-hide pb-1">
        {creatorFilters.map((tag) => (
          <button
            key={tag}
            type="button"
            onClick={() => setActiveFilter(tag)}
            className={`shrink-0 rounded-full border px-3 py-1.5 text-[11.5px] font-semibold ${
              activeFilter === tag
                ? "border-klow bg-klow text-white"
                : "border-line bg-white text-ink hover:border-klow/30"
            }`}
          >
            {tag}
          </button>
        ))}
      </div>

      <div className="mt-4 space-y-2.5">
        {visibleCreators.map((creator) => {
          const matched = creator.skinTags.some((tag) => product.goodFor.includes(tag));
          return (
            <div
              key={creator.handle}
              className="rounded-2xl border border-line bg-white p-3 shadow-card transition-colors hover:border-klow/25"
            >
              <div className="flex gap-3">
                <div
                  className={`flex h-[76px] w-[76px] flex-shrink-0 items-center justify-center rounded-2xl border ${creator.accent}`}
                >
                  <span className="text-[22px] font-black tracking-tight">
                    {creator.name.slice(0, 2)}
                  </span>
                </div>
                <div className="min-w-0 flex-1">
                  <div className="flex items-start justify-between gap-2">
                    <div className="min-w-0">
                      <div className="truncate text-[14px] font-bold text-ink">
                        {creator.name}
                      </div>
                      <div className="truncate text-[11px] font-medium text-sub">
                        {creator.handle} · {creator.country}
                      </div>
                    </div>
                    <span
                      className={`shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
                        matched
                          ? "bg-emerald-100 text-emerald-700"
                          : "bg-bg text-sub"
                      }`}
                    >
                      적합도 {creator.score}%
                    </span>
                  </div>
                  <div className="mt-2 flex flex-wrap gap-1">
                    {[...creator.categoryTags, ...creator.skinTags].map((tag) => (
                      <span
                        key={tag}
                        className="rounded-full bg-bg px-2 py-0.5 text-[10px] font-semibold text-sub"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>
              </div>
              <button
                type="button"
                onClick={() => setSelectedCreator(creator)}
                className="mt-3 flex h-10 w-full items-center justify-center rounded-xl border border-klow/20 bg-klow/5 text-[12px] font-bold text-klow hover:bg-klow hover:text-white transition-colors"
              >
                크리에이터에게 제품 소개하기
              </button>
              <Link
                href={`/creator/${creator.name.toLowerCase()}`}
                className="mt-2 flex h-9 w-full items-center justify-center rounded-xl text-[11.5px] font-semibold text-sub hover:bg-bg hover:text-ink"
              >
                프로필 자세히 보기
              </Link>
            </div>
          );
        })}
        {visibleCreators.length === 0 && (
          <div className="rounded-2xl border border-line bg-white px-4 py-8 text-center">
            <div className="text-[13px] font-semibold text-ink">
              조건에 맞는 추천 크리에이터가 없습니다
            </div>
            <div className="mt-1 text-[11.5px] text-sub">
              다른 국가나 피부 타입으로 다시 검색해보세요.
            </div>
          </div>
        )}
      </div>

      {selectedCreator && (
        <CreatorProposalSheet
          creator={selectedCreator}
          product={product}
          data={data}
          onClose={() => setSelectedCreator(null)}
        />
      )}
    </div>
  );
}

function CreatorProposalSheet({
  creator,
  product,
  data,
  onClose,
}: {
  creator: Creator;
  product: Product;
  data: ProductData;
  onClose: () => void;
}) {
  const [message, setMessage] = useState("");
  const [submitted, setSubmitted] = useState(false);
  const coreBenefit = product.benefits[0] ?? product.goodFor[0] ?? "글로벌 K-뷰티 제품";

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/35 px-4 pb-4 animate-fade-in">
      <button
        type="button"
        aria-label="닫기"
        className="absolute inset-0 cursor-default"
        onClick={onClose}
      />
      <div className="relative w-full max-w-[520px] rounded-[28px] bg-white shadow-pop animate-slide-up overflow-hidden">
        {!submitted ? (
          <>
            <div className="px-6 pt-6 pb-4 border-b border-line/70">
              <div className="flex items-start justify-between gap-3">
                <div>
                  <h3 className="text-[18px] font-bold tracking-tight text-ink">
                    크리에이터에게 제품을 소개할까요?
                  </h3>
                  <p className="mt-2 text-[12.5px] leading-[1.6] text-sub">
                    선택한 크리에이터에게 제품 정보와 브랜드 소개가 전달됩니다.
                    크리에이터가 관심을 보일 경우, 샘플 발송 및 콘텐츠 제작
                    여부를 직접 조율할 수 있어요.
                  </p>
                </div>
                <button
                  type="button"
                  onClick={onClose}
                  aria-label="닫기"
                  className="h-9 w-9 shrink-0 rounded-full hover:bg-bg flex items-center justify-center"
                >
                  <X className="h-4 w-4" />
                </button>
              </div>
            </div>

            <div className="px-6 py-5">
              <div className="rounded-2xl border border-line bg-bg/60 p-3">
                <div className="flex gap-3">
                  <div className="h-[84px] w-[84px] shrink-0 overflow-hidden rounded-2xl bg-white border border-line">
                    {product.mainPhoto ? (
                      <img
                        src={product.mainPhoto}
                        alt=""
                        className="h-full w-full object-cover"
                        draggable={false}
                      />
                    ) : (
                      <ProductVisual
                        size="sm"
                        brandName={product.brand || data.brandName}
                        imageType={product.imageType}
                      />
                    )}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="text-[10.5px] font-bold uppercase tracking-wide text-sub">
                      {data.brandName || product.brand}
                    </div>
                    <div className="mt-1 line-clamp-2 text-[14px] font-bold leading-tight text-ink">
                      {product.name || "상품명 미입력"}
                    </div>
                    <div className="mt-2 flex flex-wrap gap-1">
                      <span className="rounded-full bg-white border border-line px-2 py-0.5 text-[10px] font-semibold text-sub">
                        {data.category || "스킨케어"}
                      </span>
                      <span className="rounded-full bg-white border border-line px-2 py-0.5 text-[10px] font-semibold text-sub">
                        {coreBenefit}
                      </span>
                    </div>
                  </div>
                </div>
                <div className="mt-3 border-t border-line/70 pt-3 text-[11px] text-sub">
                  소개 대상:{" "}
                  <span className="font-semibold text-ink">
                    {creator.name} ({creator.handle})
                  </span>
                </div>
              </div>

              <label className="mt-4 block">
                <span className="block px-1 text-[11.5px] font-semibold text-sub mb-1.5">
                  짧은 메시지 선택 입력
                </span>
                <textarea
                  value={message}
                  onChange={(e) => setMessage(e.target.value)}
                  placeholder="브랜드 소개 또는 제품 포인트를 간단히 적어보세요"
                  className="min-h-[96px] w-full resize-none rounded-2xl border border-line bg-white px-4 py-3 text-[13.5px] outline-none focus:border-klow/50"
                />
              </label>
              <div className="mt-2 space-y-1 text-[11px] text-sub/80">
                <div>예: 민감성 피부를 위한 진정 크림입니다</div>
                <div>예: 일본 시장 반응을 테스트해보고 싶어요</div>
              </div>
            </div>

            <div className="flex gap-2 border-t border-line/70 px-6 py-4">
              <button
                type="button"
                onClick={onClose}
                className="h-12 px-5 rounded-2xl border border-line bg-white text-[13.5px] font-semibold text-ink hover:bg-bg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="h-12 flex-1 rounded-2xl bg-ink text-[14px] font-bold text-white hover:opacity-90"
              >
                제안 보내기
              </button>
            </div>
          </>
        ) : (
          <div className="px-6 py-8 text-center">
            <div className="mx-auto flex h-14 w-14 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="h-7 w-7" strokeWidth={3} />
            </div>
            <h3 className="mt-5 text-[19px] font-bold tracking-tight text-ink">
              크리에이터에게 제품이 소개되었어요
            </h3>
            <p className="mt-2 text-[13px] leading-[1.6] text-sub">
              관심 여부가 확인되면 KLOW에서 연결을 도와드릴게요.
            </p>
            <p className="mt-3 text-[11.5px] text-sub/80">
              지금은 상품 등록만 완료해도 괜찮습니다.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-6 h-12 w-full rounded-2xl bg-ink text-[14px] font-bold text-white hover:opacity-90"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function Badge({ children }: { children: React.ReactNode }) {
  return (
    <span className="rounded-full border border-klow/20 bg-klow/5 px-3 py-1.5 text-[11px] font-bold text-klow">
      {children}
    </span>
  );
}

/* ─────────────── Footer ─────────────── */

function Footer({
  step,
  tab,
  infoReady,
  priceReady,
  autoFilling,
  onCancel,
  onBack,
  onNext,
  onConfirm,
}: {
  step: Step;
  tab: Tab;
  infoReady: boolean;
  priceReady: boolean;
  autoFilling: boolean;
  onCancel: () => void;
  onBack: () => void;
  onNext: () => void;
  onConfirm: () => void;
}) {
  const canBack =
    (tab === "file" && (step === "info" || step === "price" || step === "creator")) ||
    (tab === "manual" && (step === "price" || step === "creator"));

  return (
    <div className="px-6 py-4 border-t border-line/60 bg-white flex-shrink-0">
      <div className="flex items-center gap-2">
        {step === "upload" ? (
          <button
            onClick={onCancel}
            className="flex-1 h-[52px] rounded-2xl bg-white border border-line text-ink font-semibold text-[14px] hover:bg-bg transition-colors"
          >
            취소
          </button>
        ) : canBack ? (
          <button
            onClick={onBack}
            className="px-5 h-[52px] rounded-2xl bg-white border border-line text-ink font-semibold text-[14px] hover:bg-bg transition-colors flex items-center gap-1.5"
          >
            <ArrowLeft className="w-3.5 h-3.5" />
            뒤로
          </button>
        ) : (
          <button
            onClick={onCancel}
            className="px-5 h-[52px] rounded-2xl bg-white border border-line text-ink font-semibold text-[14px] hover:bg-bg transition-colors"
          >
            취소
          </button>
        )}

        {step === "upload" ? null : step === "creator" ? (
          <>
            <button
              onClick={onConfirm}
              className="px-4 h-[52px] rounded-2xl bg-white border border-line text-ink font-semibold text-[13.5px] hover:bg-bg transition-colors"
            >
              다음에 하기
            </button>
            <button
              onClick={onConfirm}
              className="flex-1 h-[52px] rounded-2xl bg-ink text-white font-semibold text-[15px] hover:opacity-90 transition-opacity"
            >
              상품 추가 완료
            </button>
          </>
        ) : (
          <button
            onClick={onNext}
            disabled={
              autoFilling ||
              (step === "info" && !infoReady) ||
              (step === "price" && !priceReady)
            }
            className="flex-1 h-[52px] rounded-2xl bg-ink text-white font-semibold text-[15px] disabled:bg-line disabled:text-sub/60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity flex items-center justify-center gap-1.5"
          >
            {step === "info" ? "다음 (가격 설정)" : "다음 (크리에이터)"}
            <ArrowRight className="w-4 h-4" />
          </button>
        )}
      </div>
    </div>
  );
}

/* ─────────────── Building blocks ─────────────── */

function StepDots({
  steps,
  current,
}: {
  steps: Step[];
  current: Step;
}) {
  const idx = Math.max(0, steps.indexOf(current));
  return (
    <div className="mt-3 flex items-center justify-center gap-1.5">
      {steps.map((s, i) => (
        <span
          key={s}
          className={`h-1 rounded-full transition-all ${
            i < idx
              ? "w-4 bg-ink"
              : i === idx
                ? "w-6 bg-ink"
                : "w-4 bg-line"
          }`}
        />
      ))}
    </div>
  );
}

function TabBtn({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      className={`h-10 rounded-xl text-[12.5px] font-semibold flex items-center justify-center gap-1.5 transition-colors ${
        active ? "bg-ink text-white" : "text-sub hover:text-ink"
      }`}
    >
      {icon}
      {label}
    </button>
  );
}

function SuggestionChips({
  options,
  selected,
  onAdd,
}: {
  options: string[];
  selected: string[];
  onAdd: (value: string) => void;
}) {
  const remaining = options.filter((o) => !selected.includes(o));
  if (remaining.length === 0) return null;
  return (
    <div className="mt-2.5 flex flex-wrap gap-1.5">
      {remaining.map((o) => (
        <button
          key={o}
          type="button"
          onClick={() => onAdd(o)}
          className="px-2.5 py-1 rounded-full text-[12px] font-medium bg-bg border border-line text-sub hover:border-ink/40 hover:text-ink transition-colors"
        >
          + {o}
        </button>
      ))}
    </div>
  );
}

function Block({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div>
      <div className="text-[14px] font-bold text-ink mb-2.5 tracking-tight">
        {label}
      </div>
      {children}
    </div>
  );
}

function Pill({ children }: { children: React.ReactNode }) {
  return (
    <div className="text-center px-1.5 py-1 rounded-md bg-white/10 truncate">
      {children}
    </div>
  );
}

