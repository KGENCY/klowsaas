"use client";

import { useRef, useState } from "react";
import {
  Sparkles,
  Upload,
  ShieldCheck,
  Languages,
} from "lucide-react";
import { PhoneFrame } from "@/components/ui/PhoneFrame";

interface Props {
  brandName: string;
  analyzing: boolean;
  productCount: number;
  onFileSelected: (file: File) => void;
  onManual: () => void;
}

const ACCEPTED_TYPES = new Set([
  "application/pdf",
  "image/png",
  "image/jpeg",
]);

export function MockupUploadStage({
  brandName,
  analyzing,
  productCount,
  onFileSelected,
  onManual,
}: Props) {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [isDragOver, setIsDragOver] = useState(false);

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
    if (file && ACCEPTED_TYPES.has(file.type)) onFileSelected(file);
  };

  return (
    <div className="flex flex-col items-center w-full">
      <PhoneFrame brandName={brandName}>
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
      </PhoneFrame>
    </div>
  );
}

function uploadHeading(productCount: number): string {
  if (productCount === 0) return "BestSeller";
  const ordinals: Record<number, string> = {
    2: "소중한 두번째",
    3: "멋있는 세번째",
    4: "빛나는 네번째",
    5: "특별한 다섯번째",
  };
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
        상세페이지 파일만 올려주세요!
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
        <span className="absolute inset-0 rounded-full border-2 border-ink/10" aria-hidden />
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
