"use client";

import { useEffect, useState, type ReactNode } from "react";
import { Globe2, Copy } from "lucide-react";
import type { EditFocus, ProductData } from "@/types";
import { ConsumerPreview } from "./ConsumerPreview";
import { GridStorefront } from "./GridStorefront";
import { MockupUploadStage } from "./MockupUploadStage";
import { ShareModal } from "./ShareModal";

type AddStage = "idle" | "upload" | "analyzing";

interface Props {
  data: ProductData;
  draftProductId: string | null;
  addStage: AddStage;
  onEditProduct: (productId: string, focus: EditFocus) => void;
  onAddProduct: () => void;
  onUploadFile: (file: File) => void;
  onManualStart: () => void;
  onCopyLink: () => void;
  rightPanel?: ReactNode;
}

type ViewMode = "grid" | "detail" | "uploading";

export function GeneratedEditorStep({
  data,
  draftProductId,
  addStage,
  onEditProduct,
  onAddProduct,
  onUploadFile,
  onManualStart,
  onCopyLink,
  rightPanel,
}: Props) {
  const [activeProductId, setActiveProductId] = useState<string>("");
  const [mode, setMode] = useState<ViewMode>("grid");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (addStage !== "idle") {
      setMode("uploading");
      return;
    }
    if (draftProductId) {
      setActiveProductId(draftProductId);
      setMode("detail");
    } else {
      setMode("grid");
    }
  }, [draftProductId, addStage]);

  useEffect(() => {
    if (!data.products.find((p) => p.id === activeProductId)) {
      setActiveProductId(data.products[0]?.id ?? "");
    }
  }, [data.products, activeProductId]);

  const hasDraft = !!draftProductId;

  return (
    <div className="pb-12">
      <div className="mx-auto max-w-[1440px] px-6 pt-10 animate-fade-in">
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
            {/* Link bar — width matches the mockup, sits directly above it */}
            <div className="w-full max-w-[380px] flex items-center gap-2 mb-3">
              <div className="flex-1 flex items-center gap-2 px-3 h-[40px] rounded-xl bg-white border border-line min-w-0">
                <Globe2 className="w-3.5 h-3.5 text-ink flex-shrink-0" />
                <span className="text-[12.5px] font-medium text-ink truncate">
                  {data.link}
                </span>
                <button
                  type="button"
                  onClick={onCopyLink}
                  aria-label="링크 복사"
                  className="ml-auto w-7 h-7 -mr-1 rounded-lg flex items-center justify-center text-sub hover:text-ink hover:bg-bg transition-colors flex-shrink-0"
                >
                  <Copy className="w-3.5 h-3.5" />
                </button>
              </div>
              <button
                type="button"
                onClick={() => setShareOpen(true)}
                className="px-3 h-[40px] rounded-xl bg-ink text-white text-[12px] font-semibold whitespace-nowrap hover:opacity-90 transition-opacity flex-shrink-0"
              >
                글로벌 판매시작
              </button>
            </div>

            <div
              key={`${mode}-${hasDraft ? "draft" : "stable"}`}
              className="w-full animate-fade-in flex justify-center"
            >
              {mode === "uploading" ? (
                <MockupUploadStage
                  brandName={data.brandName}
                  analyzing={addStage === "analyzing"}
                  productCount={data.products.length}
                  onFileSelected={onUploadFile}
                  onManual={onManualStart}
                />
              ) : mode === "grid" ? (
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
          </div>

          {/* Right side: add panel — aligned with mockup top (link bar height + gap) */}
          <div className="w-full min-w-0 overflow-hidden flex justify-center pt-[52px]">
            {hasDraft && rightPanel ? (
              <div className="w-full max-w-[620px]">{rightPanel}</div>
            ) : null}
          </div>
        </div>
      </div>

      <ShareModal
        open={shareOpen}
        link={data.link}
        onClose={() => setShareOpen(false)}
      />
    </div>
  );
}
