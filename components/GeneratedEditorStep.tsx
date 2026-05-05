"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Plus, Globe2, Copy } from "lucide-react";
import type { EditFocus, ProductData } from "@/types";
import { ConsumerPreview } from "./ConsumerPreview";
import { GridStorefront } from "./GridStorefront";

interface Props {
  data: ProductData;
  draftProductId: string | null;
  onEditProduct: (productId: string, focus: EditFocus) => void;
  onEditPage: () => void;
  onCopy: () => void;
  onPublish: () => void;
  onAddProduct: () => void;
  rightPanel?: ReactNode;
}

type ViewMode = "grid" | "detail";

export function GeneratedEditorStep({
  data,
  draftProductId,
  onEditProduct,
  onEditPage,
  onCopy,
  onPublish,
  onAddProduct,
  rightPanel,
}: Props) {
  const [activeProductId, setActiveProductId] = useState<string>("");
  const [mode, setMode] = useState<ViewMode>("grid");

  // While a draft is being filled, focus the mockup on the single product
  // detail view so real-time edits to name/price/benefits/ingredients all
  // appear inside one phone screen alongside the form.
  useEffect(() => {
    if (draftProductId) {
      setActiveProductId(draftProductId);
      setMode("detail");
    }
  }, [draftProductId]);

  // Keep the active product id in sync with available products.
  useEffect(() => {
    if (!data.products.find((p) => p.id === activeProductId)) {
      setActiveProductId(data.products[0]?.id ?? "");
    }
  }, [data.products, activeProductId]);

  const isEmpty = data.products.length === 0;
  const hasDraft = !!draftProductId;
  const showAsCollection = mode === "grid";

  return (
    <div className="pb-12">
      {/* Top bar with link + copy */}
      <div className="sticky top-0 z-30 bg-bg/85 backdrop-blur-xl border-b border-line/60">
        <div className="mx-auto max-w-[1320px] px-6 py-3 flex items-center gap-3">
          <div className="flex-1 flex items-center gap-2 px-4 py-2.5 rounded-2xl bg-white border border-line min-w-0">
            <Globe2 className="w-4 h-4 text-ink flex-shrink-0" />
            <span className="text-[13.5px] font-medium text-ink truncate">
              {data.link}
            </span>
            <span className="ml-auto text-[10.5px] font-semibold tracking-wider text-sub/70 uppercase hidden sm:inline">
              내 글로벌 판매 링크
            </span>
          </div>
          <button
            onClick={onCopy}
            className="px-4 sm:px-5 h-[44px] rounded-2xl bg-white border border-line text-ink text-[13px] font-semibold flex items-center gap-1.5 hover:border-ink/30 transition-colors"
          >
            <Copy className="w-3.5 h-3.5" />
            <span className="hidden sm:inline">링크 복사</span>
            <span className="sm:hidden">복사</span>
          </button>
          <button
            onClick={onPublish}
            className="px-4 sm:px-5 h-[44px] rounded-2xl bg-ink text-white text-[13px] font-semibold flex items-center gap-1.5 hover:opacity-90 transition-opacity"
          >
            <span className="hidden sm:inline">글로벌 판매 시작하기</span>
            <span className="sm:hidden">판매 시작</span>
          </button>
        </div>
      </div>

      <div className="mx-auto max-w-[1440px] px-6 pt-3 animate-fade-in">
        {/* Smooth split: grid-template-columns transitions from "1fr 0fr"
            (mockup centered) to a slightly form-heavy split (mockup left,
            wider form on the right) so the phone glides from page-center
            to its left half as the panel slides in. */}
        <div
          className="grid items-start"
          style={{
            gridTemplateColumns: hasDraft ? "minmax(0, 1fr) minmax(0, 1.25fr)" : "1fr 0fr",
            columnGap: hasDraft ? "56px" : "0px",
            transition:
              "grid-template-columns 520ms cubic-bezier(0.22, 1, 0.36, 1), column-gap 520ms cubic-bezier(0.22, 1, 0.36, 1)",
          }}
        >
          {/* Mockup column */}
          <div className="w-full min-w-0 flex flex-col items-center">
            <div
              key={`${mode}-${hasDraft ? "draft" : "stable"}`}
              className="w-full animate-fade-in flex justify-center"
            >
              {showAsCollection ? (
                <GridStorefront
                  brandName={data.brandName}
                  category={data.category}
                  products={data.products}
                  onOpenProduct={() => {}}
                  onEdit={onEditProduct}
                  onAddProduct={onAddProduct}
                />
              ) : (
                <ConsumerPreview
                  brandName={data.brandName}
                  category={data.category}
                  products={data.products}
                  activeProductId={activeProductId}
                  onSwitchProduct={setActiveProductId}
                  onEdit={onEditProduct}
                  isDraft={hasDraft}
                />
              )}
            </div>

            {/* Home actions — only when no draft is being filled */}
            {!hasDraft && (
              <div className="mt-7 w-full max-w-[380px] space-y-2.5">
                <button
                  onClick={onAddProduct}
                  className="w-full h-[54px] rounded-2xl bg-ink text-white font-semibold text-[15px] flex items-center justify-center gap-2 hover:opacity-90 transition-opacity"
                >
                  <Plus className="w-[17px] h-[17px]" />
                  {isEmpty ? "첫 상품 올리기" : "상품 더 추가하기"}
                </button>
                {!isEmpty && (
                  <button
                    onClick={onEditPage}
                    className="w-full h-[48px] rounded-2xl bg-white border border-line text-ink font-semibold text-[13.5px] hover:border-ink/30 transition-colors"
                  >
                    페이지 정보 다듬기
                  </button>
                )}
                <p className="pt-1 text-center text-[11.5px] text-sub/85 leading-[1.55]">
                  {isEmpty
                    ? "상세페이지 파일 한 장이면 바로 글로벌 판매 페이지가 만들어져요."
                    : "준비됐다면 위 ‘글로벌 판매 시작하기’를 눌러 링크를 공유하세요."}
                </p>
              </div>
            )}
          </div>

          {/* Right side: add panel — meaningfully wider than the phone */}
          <div className="w-full min-w-0 overflow-hidden flex justify-center">
            {hasDraft && rightPanel ? (
              <div className="w-full max-w-[620px]">{rightPanel}</div>
            ) : null}
          </div>
        </div>
      </div>
    </div>
  );
}

