"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import {
  ImagePlus,
  Wand2,
  Check,
  Loader2,
  FileText,
  Sparkles,
  Star,
  Upload,
  ArrowLeft,
  ArrowRight,
  Plus,
  X,
} from "lucide-react";
import type { Product, ProductData, ReviewSnippet } from "@/types";
import {
  calculateCustomerPriceUSD,
  formatUSD,
  parseKRWInput,
} from "@/lib/pricing";

type Tab = "file" | "manual";
type Step = "upload" | "info" | "price" | "review";

interface Props {
  open: boolean;
  product: Product | null;
  data: ProductData;
  onChange: (productId: string, next: Product) => void;
  onConfirm: () => void;
  onCancel: () => void;
}

export function AddProductPanel({
  open,
  product,
  data,
  onChange,
  onConfirm,
  onCancel,
}: Props) {
  const [tab, setTab] = useState<Tab>("file");
  const [step, setStep] = useState<Step>("upload");
  const [autoFilling, setAutoFilling] = useState(false);
  const [settlementRaw, setSettlementRaw] = useState("");
  const [reviewLoading, setReviewLoading] = useState(false);
  const [photos, setPhotos] = useState<string[]>([]);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const reviewInputRef = useRef<HTMLInputElement>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    if (open) {
      setTab("file");
      setStep("upload");
      setSettlementRaw("");
      setAutoFilling(false);
      setReviewLoading(false);
      setPhotos([]);
    }
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
  const onPickReview = () => reviewInputRef.current?.click();
  const onPickPhoto = () => photoInputRef.current?.click();

  const addPhoto = (file: File) => {
    setPhotos((prev) => [...prev, file.name]);
    update({ imageType: "custom" });
  };
  const removePhoto = (name: string) => {
    setPhotos((prev) => prev.filter((n) => n !== name));
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

  const handleReview = (file: File) => {
    setReviewLoading(true);
    setTimeout(() => {
      const snippets: ReviewSnippet[] = [
        {
          author: "Mina K.",
          country: "USA",
          rating: 5,
          text: "Glides on so smooth and zero stickiness. Already on my second bottle!",
        },
        {
          author: "Ji-young P.",
          country: "Korea",
          rating: 5,
          text: "Skin texture got noticeably smoother after a week of use.",
        },
        {
          author: "Hyun A.",
          country: "Singapore",
          rating: 4,
          text: "Subtle scent and I wake up with brighter skin every morning.",
        },
      ];
      update({
        rating: 4.9,
        reviewCount: 1284,
        reviewSnippets: snippets,
        reviewSourceName: file.name,
      });
      setReviewLoading(false);
    }, 900);
  };

  const infoReady = product.name.trim().length > 0;
  const priceReady = settlementKRW > 0;

  return (
    <div
      className={`flex flex-col w-full bg-white rounded-[28px] border border-line shadow-card overflow-hidden ${
        open ? "animate-slide-in-right" : ""
      }`}
      style={{ maxHeight: "calc(100vh - 130px)" }}
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
            ? ["upload", "info", "price", "review"]
            : ["info", "price", "review"]}
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
            photos={photos}
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
        {step === "review" && (
          <ReviewStep
            loading={reviewLoading}
            sourceName={product.reviewSourceName}
            count={product.reviewSnippets.length}
            onPick={onPickReview}
          />
        )}

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
          ref={reviewInputRef}
          type="file"
          accept="image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) handleReview(f);
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
          else if (step === "review") setStep("price");
        }}
        onNext={() => {
          if (step === "info") setStep("price");
          else if (step === "price") setStep("review");
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
  photos,
  onPickPhoto,
  onRemovePhoto,
}: {
  product: Product;
  mode: Tab;
  onUpdate: (patch: Partial<Product>) => void;
  photos: string[];
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
        {!isAuto && (
          <Block label="대표 사진">
            <PhotoRow
              photos={photos}
              onPick={onPickPhoto}
              onRemove={onRemovePhoto}
              max={5}
            />
          </Block>
        )}

        <Block label="제품명">
          <input
            value={product.name}
            onChange={(e) => onUpdate({ name: e.target.value })}
            placeholder="Glow Daily Essence"
            className="w-full px-4 py-3.5 rounded-xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[16px] font-semibold"
          />
        </Block>

        <Block label="대표 효능">
          <EditablePillRow
            items={product.benefits}
            variant="solid"
            placeholder="효능 추가 (예: Glass skin)"
            max={6}
            onChange={(benefits) => onUpdate({ benefits })}
          />
        </Block>

        <Block label="핵심 성분">
          <EditablePillRow
            items={product.ingredients}
            variant="outline"
            placeholder="성분 추가 (예: Niacinamide)"
            max={8}
            onChange={(ingredients) => onUpdate({ ingredients })}
          />
        </Block>
      </div>
    </div>
  );
}

function PhotoRow({
  photos,
  onPick,
  onRemove,
  max,
}: {
  photos: string[];
  onPick: () => void;
  onRemove: (name: string) => void;
  max: number;
}) {
  return (
    <div className="flex items-center gap-2 overflow-x-auto scrollbar-hide pb-1">
      {photos.map((name) => (
        <div
          key={name}
          className="relative w-[76px] h-[76px] flex-shrink-0 rounded-2xl bg-bg border border-line overflow-hidden flex items-center justify-center"
        >
          <ImagePlus className="w-5 h-5 text-sub/60" />
          <span className="absolute bottom-1 left-1 right-1 text-[9.5px] text-center font-medium text-sub truncate">
            {name.replace(/\.[^.]+$/, "")}
          </span>
          <button
            type="button"
            onClick={() => onRemove(name)}
            aria-label={`${name} 삭제`}
            className="absolute top-1 right-1 w-5 h-5 rounded-full bg-ink text-white flex items-center justify-center hover:opacity-90 transition-opacity"
          >
            <X className="w-3 h-3" strokeWidth={2.8} />
          </button>
        </div>
      ))}
      {photos.length < max && (
        <button
          type="button"
          onClick={onPick}
          className="w-[76px] h-[76px] flex-shrink-0 rounded-2xl border-2 border-dashed border-line bg-white hover:border-ink/40 hover:bg-bg/60 transition-colors flex flex-col items-center justify-center gap-1 text-sub hover:text-ink"
        >
          <Plus className="w-5 h-5" />
          <span className="text-[10.5px] font-semibold">사진 추가</span>
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
        원가 + 마진,
        <br />정산 희망 금액을 입력해 주세요!
      </h2>
      <p className="mt-2.5 text-[13px] text-sub leading-[1.55]">
        환율 · 고정배송 · 결제수수료까지 KLOW가 알아서 계산해드려요.
      </p>

      <div className="mt-5 rounded-2xl border border-line bg-white px-5 py-4 focus-within:border-ink/40 transition-colors">
        <div className="text-[10.5px] font-semibold tracking-wider text-sub uppercase mb-1">
          정산 희망 금액
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

      <div className="mt-3 rounded-2xl bg-ink text-white p-5">
        <div className="flex items-center justify-between">
          <span className="text-[11.5px] opacity-75">해외 고객 판매가</span>
          <span className="text-[10px] opacity-50 tracking-wider">USD</span>
        </div>
        <div className="mt-1 text-[34px] font-bold tracking-tight leading-none">
          {settlementKRW > 0 ? formatUSD(customerPriceUSD) : "—"}
        </div>
        <div className="mt-3 pt-3 border-t border-white/10 grid grid-cols-3 gap-1.5 text-[10.5px] opacity-75">
          <Pill>환율 ₩{exchangeRate.toLocaleString("ko-KR")}</Pill>
          <Pill>고정배송 ${shippingUSD}</Pill>
          <Pill>결제수수료 {Math.round(paymentFeeRate * 100)}%</Pill>
        </div>
      </div>
    </div>
  );
}

function ReviewStep({
  loading,
  sourceName,
  count,
  onPick,
}: {
  loading: boolean;
  sourceName?: string;
  count: number;
  onPick: () => void;
}) {
  const has = !!sourceName && count > 0;

  return (
    <div className="animate-fade-in">
      <h2 className="text-[22px] sm:text-[24px] font-bold leading-[1.25] tracking-tight">
        네이버 리뷰 캡쳐본을 올리면,
        <br />자동으로 번역 리뷰가 적용돼요!
      </h2>
      <p className="mt-2.5 text-[13px] text-sub leading-[1.55]">
        선택사항이에요. 건너뛰고 바로 등록해도 괜찮습니다.
      </p>

      <button
        onClick={onPick}
        disabled={loading}
        className={`mt-6 w-full rounded-2xl border-2 border-dashed transition-all px-5 py-5 flex items-center gap-4 ${
          has
            ? "bg-bg border-ink/40"
            : "bg-white border-line hover:border-ink/40 hover:bg-bg/60"
        } ${loading ? "pointer-events-none" : ""}`}
      >
        {loading ? (
          <>
            <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center animate-pulse-soft flex-shrink-0">
              <Loader2 className="w-5 h-5 text-white animate-spin" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[13.5px] font-semibold text-ink">
                리뷰를 읽고 번역 중이에요
              </div>
              <div className="text-[11.5px] text-sub mt-0.5">
                별점 · 한줄평을 영문으로 정리해드릴게요
              </div>
            </div>
          </>
        ) : has ? (
          <>
            <div className="w-11 h-11 rounded-full bg-ink flex items-center justify-center flex-shrink-0">
              <Star className="w-5 h-5 text-white fill-white" />
            </div>
            <div className="flex-1 text-left min-w-0">
              <div className="text-[13.5px] font-semibold text-ink">
                리뷰 {count}개 자동 반영됨
              </div>
              <div className="text-[11.5px] text-sub mt-0.5 truncate">
                {sourceName} · 다시 올리려면 클릭
              </div>
            </div>
          </>
        ) : (
          <>
            <div className="w-11 h-11 rounded-xl bg-ink/5 flex items-center justify-center flex-shrink-0">
              <ImagePlus className="w-5 h-5 text-ink" />
            </div>
            <div className="flex-1 text-left">
              <div className="text-[13.5px] font-semibold text-ink">
                네이버 리뷰 캡쳐본 올리기
              </div>
              <div className="text-[11.5px] text-sub mt-0.5">
                PNG · JPG · 별점이 보이는 한 장이면 충분해요
              </div>
            </div>
          </>
        )}
      </button>
    </div>
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
    (tab === "file" && (step === "info" || step === "price" || step === "review")) ||
    (tab === "manual" && (step === "price" || step === "review"));

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

        {step === "upload" ? null : step === "review" ? (
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
            {step === "info" ? "다음 (가격 설정)" : "다음 (리뷰)"}
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

function mockAutofillFromFile(
  fileName: string,
  brand: string
): Partial<Product> {
  const presets: Partial<Product>[] = [
    {
      name: "Glass Glow Daily Serum",
      imageType: "rice",
      benefits: ["Glass skin", "Hydration", "Brightening"],
      ingredients: ["Niacinamide", "Hyaluronic Acid", "Rice Extract"],
    },
    {
      name: "Cica Calm Soothing Cream",
      imageType: "green-tea",
      benefits: ["Soothing", "Barrier care", "Hydration"],
      ingredients: ["Cica", "Panthenol", "Ceramide"],
    },
    {
      name: "Cucumber Cooling Toner",
      imageType: "cucumber",
      benefits: ["Cooling", "Hydration", "Soothing"],
      ingredients: ["Cucumber Extract", "Hyaluronic Acid", "Aloe"],
    },
  ];
  const seed = fileName.length % presets.length;
  return { ...presets[seed], brand };
}
