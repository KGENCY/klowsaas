"use client";

import { useRef, useState } from "react";
import {
  Menu,
  Search,
  ShoppingBag,
  Sparkles,
  Upload,
  ShieldCheck,
  Languages,
} from "lucide-react";

interface Props {
  brandName: string;
  analyzing: boolean;
  productCount: number;
  onFileSelected: (file: File) => void;
  onManual: () => void;
}

export function MockupUploadStage({
  brandName,
  analyzing,
  productCount,
  onFileSelected,
  onManual,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

  const isAccepted = (file: File) =>
    file.type === "application/pdf" ||
    file.type === "image/png" ||
    file.type === "image/jpeg";

  const onPick = () => {
    if (analyzing) return;
    fileInputRef.current?.click();
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    if (analyzing) return;
    if (!isDragOver) setIsDragOver(true);
  };
  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
  };
  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragOver(false);
    if (analyzing) return;
    const file = e.dataTransfer.files?.[0];
    if (file && isAccepted(file)) onFileSelected(file);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <div
        className="relative mx-auto w-full max-w-[380px] rounded-[48px] bg-ink shadow-pop flex flex-col"
        style={{
          padding: 10,
          aspectRatio: "9 / 19.2",
          maxHeight: "calc(100vh - 140px)",
        }}
      >
        {/* Side hardware buttons */}
        <span
          className="absolute left-[-2px] top-[110px] w-[3px] h-[36px] rounded-r bg-ink/80"
          aria-hidden
        />
        <span
          className="absolute left-[-2px] top-[160px] w-[3px] h-[60px] rounded-r bg-ink/80"
          aria-hidden
        />
        <span
          className="absolute left-[-2px] top-[230px] w-[3px] h-[60px] rounded-r bg-ink/80"
          aria-hidden
        />
        <span
          className="absolute right-[-2px] top-[180px] w-[3px] h-[80px] rounded-l bg-ink/80"
          aria-hidden
        />

        <div className="relative flex flex-col flex-1 min-h-0 bg-white rounded-[38px] overflow-hidden">
          {/* Status bar */}
          <div className="relative flex items-center justify-between px-7 pt-2.5 pb-1 text-[11px] font-semibold text-ink flex-shrink-0">
            <span className="tracking-tight">9:41</span>
            <span
              className="absolute left-1/2 top-2 -translate-x-1/2 w-[88px] h-[26px] rounded-full bg-ink"
              aria-hidden
            />
            <span className="flex items-center gap-1 text-[10px]">
              <span className="inline-flex items-end gap-[1.5px]">
                <span className="w-[3px] h-[5px] bg-ink rounded-[1px]" />
                <span className="w-[3px] h-[7px] bg-ink rounded-[1px]" />
                <span className="w-[3px] h-[9px] bg-ink rounded-[1px]" />
                <span className="w-[3px] h-[11px] bg-ink rounded-[1px]" />
              </span>
              <span className="ml-0.5 inline-block w-[18px] h-[10px] border border-ink rounded-[3px] relative">
                <span className="absolute inset-[1px] right-[3px] bg-ink rounded-[1px]" />
                <span className="absolute right-[-2px] top-[3px] w-[1px] h-[4px] bg-ink rounded-full" />
              </span>
            </span>
          </div>

          {/* App chrome */}
          <div className="bg-white px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-line/60 flex-shrink-0">
            <button className="w-8 h-8 -ml-1 flex items-center justify-center">
              <Menu className="w-[17px] h-[17px] text-ink" />
            </button>
            <div className="text-[14px] font-bold tracking-tight">
              {brandName}
            </div>
            <div className="flex items-center gap-0.5">
              <button className="w-8 h-8 flex items-center justify-center">
                <Search className="w-[16px] h-[16px] text-ink" />
              </button>
              <button className="w-8 h-8 -mr-1 flex items-center justify-center">
                <ShoppingBag className="w-[16px] h-[16px] text-ink" />
              </button>
            </div>
          </div>

          {/* Content */}
          <div className="flex-1 flex flex-col px-6 pt-7 pb-5 min-h-0">
            {analyzing ? (
              <AnalyzingView />
            ) : (
              <UploadView
                heading={uploadHeading(productCount)}
                isDragOver={isDragOver}
                onPick={onPick}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onManual={onManual}
              />
            )}
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          accept=".pdf,image/png,image/jpeg"
          className="hidden"
          onChange={(e) => {
            const f = e.target.files?.[0];
            if (f) onFileSelected(f);
            e.target.value = "";
          }}
        />
      </div>
    </div>
  );
}

function uploadHeading(productCount: number): string {
  const ordinals: Record<number, string> = {
    2: "소중한 두번째",
    3: "멋있는 세번째",
    4: "빛나는 네번째",
    5: "특별한 다섯번째",
  };
  if (productCount === 0) return "BestSeller";
  return ordinals[productCount + 1] ?? `${productCount + 1}번째`;
}

function UploadView({
  heading,
  isDragOver,
  onPick,
  onDragOver,
  onDragLeave,
  onDrop,
  onManual,
}: {
  heading: string;
  isDragOver: boolean;
  onPick: () => void;
  onDragOver: (e: React.DragEvent) => void;
  onDragLeave: (e: React.DragEvent) => void;
  onDrop: (e: React.DragEvent) => void;
  onManual: () => void;
}) {
  return (
    <div className="flex-1 flex flex-col animate-fade-in min-h-0">
      <h2 className="text-[19px] font-bold leading-[1.3] tracking-tight text-ink">
        {heading} 제품의
        <br />
        상세페이지 한 장만 올려주세요
      </h2>
      <p className="mt-2 text-[12px] text-sub leading-[1.55]">
        번역·결제·해외배송은 KLOW가 도와드릴게요.
      </p>

      <button
        type="button"
        onClick={onPick}
        onDragOver={onDragOver}
        onDragLeave={onDragLeave}
        onDrop={onDrop}
        className={`mt-5 relative w-full aspect-square rounded-2xl border-2 border-dashed transition-all flex items-center justify-center ${
          isDragOver
            ? "bg-ink/5 border-ink"
            : "bg-bg/60 border-line hover:border-ink/40 hover:bg-bg"
        }`}
      >
        <div className="flex flex-col items-center gap-2">
          <div
            className={`w-12 h-12 rounded-full flex items-center justify-center transition-colors ${
              isDragOver ? "bg-ink text-white" : "bg-white border border-line text-ink"
            }`}
          >
            <Upload className="w-5 h-5" />
          </div>
          <div className="text-[10.5px] font-medium text-sub/80 tracking-wide">
            PDF · PNG · JPG
          </div>
        </div>
      </button>

      <div className="mt-4 flex items-center justify-center gap-3 text-[10.5px] font-medium text-sub/85">
        <span className="inline-flex items-center gap-1">
          <Languages className="w-3 h-3" /> 자동 번역
        </span>
        <span className="opacity-40">·</span>
        <span className="inline-flex items-center gap-1">
          <ShieldCheck className="w-3 h-3" /> 안전 결제
        </span>
      </div>

      <div className="mt-auto pt-5">
        <button
          type="button"
          onClick={onManual}
          className="w-full h-[44px] rounded-2xl bg-white border border-line text-ink text-[13px] font-semibold hover:border-ink/40 transition-colors"
        >
          직접 입력
        </button>
      </div>
    </div>
  );
}

function AnalyzingView() {
  return (
    <div className="flex-1 flex flex-col items-center justify-center animate-fade-in">
      <div className="relative w-16 h-16 flex items-center justify-center">
        <span
          className="absolute inset-0 rounded-full border-2 border-ink/10"
          aria-hidden
        />
        <span
          className="absolute inset-0 rounded-full border-2 border-transparent border-t-ink animate-spin"
          style={{ animationDuration: "1.1s" }}
          aria-hidden
        />
        <Sparkles className="w-6 h-6 text-ink animate-pulse-soft" />
      </div>

      <div className="mt-5 text-[15px] font-bold tracking-tight text-ink">
        상세페이지 분석 중
      </div>
      <div className="mt-1.5 text-[12px] text-sub leading-[1.55] text-center px-3">
        제품명·효능·성분을
        <br />
        자동으로 정리하고 있어요
      </div>

      <div className="mt-7 w-[60%] flex items-center gap-2 text-[10.5px] font-medium text-sub/80 justify-center">
        <ShieldCheck className="w-3 h-3" />
        <span>KLOW 보안 처리</span>
      </div>
    </div>
  );
}
