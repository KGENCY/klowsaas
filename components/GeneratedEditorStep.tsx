"use client";

import { useEffect, useState, type ReactNode } from "react";
import type { EditFocus, ProductData } from "@/types";
import { ConsumerPreview } from "./ConsumerPreview";
import { GridStorefront } from "./GridStorefront";
import { MockupUploadStage } from "./MockupUploadStage";

type AddStage = "idle" | "upload" | "analyzing";

interface Props {
  data: ProductData;
  draftProductId: string | null;
  addStage: AddStage;
  onEditProduct: (productId: string, focus: EditFocus) => void;
  onAddProduct: () => void;
  onUploadFile: (file: File) => void;
  onManualStart: () => void;
  onCancelAddStage: () => void;
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
  onCancelAddStage,
  rightPanel,
}: Props) {
  const [activeProductId, setActiveProductId] = useState<string>("");
  const [mode, setMode] = useState<ViewMode>("grid");

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
      <div className="mx-auto max-w-[1440px] px-6 pt-3 animate-fade-in">
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
              {mode === "uploading" ? (
                <MockupUploadStage
                  brandName={data.brandName}
                  analyzing={addStage === "analyzing"}
                  onFileSelected={onUploadFile}
                  onManual={onManualStart}
                  onCancel={onCancelAddStage}
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
