"use client";

import { useEffect, useState } from "react";
import type { ProductData } from "@/types";
import { PanelShell } from "./PanelShell";

interface Props {
  open: boolean;
  data: ProductData;
  onClose: () => void;
  onApply: (patch: Partial<ProductData>) => void;
}

export function PageEditPanel({ open, data, onClose, onApply }: Props) {
  const [brand, setBrand] = useState(data.brandName);
  const [category, setCategory] = useState(data.category);

  useEffect(() => {
    setBrand(data.brandName);
    setCategory(data.category);
  }, [data]);

  return (
    <PanelShell
      open={open}
      title="페이지 설정"
      onClose={onClose}
      footer={
        <button
          onClick={() =>
            onApply({
              brandName: brand.trim() || data.brandName,
              category: category.trim() || data.category,
            })
          }
          className="w-full h-[54px] rounded-2xl bg-ink text-white font-semibold text-[15.5px] hover:opacity-90 transition-opacity"
        >
          적용하기
        </button>
      }
    >
      <Field label="브랜드명">
        <input
          value={brand}
          onChange={(e) => setBrand(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[14px]"
        />
      </Field>
      <Field label="카테고리">
        <input
          value={category}
          onChange={(e) => setCategory(e.target.value)}
          className="w-full px-4 py-3 rounded-xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[14px]"
        />
      </Field>

      <div className="mt-2 rounded-2xl bg-bg p-4 border border-line">
        <div className="text-[11px] font-semibold tracking-wider text-sub uppercase mb-2.5">
          KLOW 기본 정책
        </div>
        <Row label="기본 환율" value={`₩${data.exchangeRate.toLocaleString()} = $1`} />
        <Row label="글로벌 배송비" value={`$${data.shippingUSD.toFixed(2)}`} />
        <Row
          label="결제 처리 비용"
          value={`${Math.round(data.paymentFeeRate * 100)}%`}
        />
        <p className="mt-2 text-[10.5px] text-sub/80">
          기본 정책으로 자동 적용됩니다
        </p>
      </div>
    </PanelShell>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-4">
      <div className="text-[11.5px] font-medium text-sub mb-1.5">{label}</div>
      {children}
    </div>
  );
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-center justify-between py-1.5">
      <span className="text-[12px] text-sub">{label}</span>
      <span className="text-[12.5px] font-semibold text-ink">{value}</span>
    </div>
  );
}
