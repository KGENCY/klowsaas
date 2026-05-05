"use client";

import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import { Globe2, Copy } from "lucide-react";
import type {
  EditFocus,
  EditState,
  Product,
  ProductData,
  StepKey,
  ToastState,
} from "@/types";
import {
  createBlankProduct,
  defaultProductData,
  mockAutofillFromFile,
} from "@/lib/mockData";
import { saveBrand } from "@/lib/brandStore";
import { sanitizeSlug } from "@/lib/pricing";

import { Header } from "@/components/Header";
import { LinkCreateStep } from "@/components/LinkCreateStep";
import { GeneratedEditorStep } from "@/components/GeneratedEditorStep";
import { ProductEditPanel } from "@/components/ProductEditPanel";
import { PageEditPanel } from "@/components/PageEditPanel";
import { AddProductPanel } from "@/components/AddProductPanel";
import { Toast } from "@/components/Toast";

type AddStage = "idle" | "upload" | "analyzing";
type AddEntry = "file" | "manual";

export default function Page() {
  const [step, setStep] = useState<StepKey>("link");
  const [data, setData] = useState<ProductData>(defaultProductData);
  const [draftProductId, setDraftProductId] = useState<string | null>(null);
  const [addStage, setAddStage] = useState<AddStage>("idle");
  const [addEntry, setAddEntry] = useState<AddEntry>("file");
  const [edit, setEdit] = useState<EditState>({
    isOpen: false,
    scope: null,
    productId: null,
    focus: null,
  });
  const [toast, setToast] = useState<ToastState>({
    isVisible: false,
    message: "",
  });
  const toastTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const analysisTimer = useRef<ReturnType<typeof setTimeout> | null>(null);

  const showToast = useCallback((message: string) => {
    if (toastTimer.current) clearTimeout(toastTimer.current);
    setToast({ isVisible: true, message });
    toastTimer.current = setTimeout(() => {
      setToast({ isVisible: false, message: "" });
    }, 2200);
  }, []);

  // Mirror seller-edited data to localStorage so the consumer link
  // (/brand/{slug}) shows the brand's actual products, keywords, prices.
  useEffect(() => {
    saveBrand(data);
  }, [data]);

  const goLink = () => {
    setStep("link");
    setDraftProductId(null);
  };

  const handleLinkSubmit = (slug: string) => {
    const safe = sanitizeSlug(slug);
    setData((d) => ({
      ...d,
      slug: safe,
      brandName: deriveBrandName(safe),
      link: `klow.kr/${safe}`,
      products: [],
    }));
    setStep("editor");
  };

  const handleAddProduct = () => {
    // Stay on the phone mockup; show the in-mockup upload UI first.
    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
      analysisTimer.current = null;
    }
    setAddStage("upload");
  };

  const cancelAddStage = () => {
    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
      analysisTimer.current = null;
    }
    setAddStage("idle");
  };

  const startDraftWithFile = (file: File) => {
    setAddStage("analyzing");
    if (analysisTimer.current) clearTimeout(analysisTimer.current);
    analysisTimer.current = setTimeout(() => {
      const blank = createBlankProduct(data.brandName);
      const filled = mockAutofillFromFile(file.name, data.brandName);
      const product: Product = {
        ...blank,
        ...filled,
        detailFileName: file.name,
      };
      setData((d) => ({ ...d, products: [...d.products, product] }));
      setDraftProductId(product.id);
      setAddEntry("file");
      setAddStage("idle");
      setEdit({
        isOpen: true,
        scope: "add",
        productId: product.id,
        focus: null,
      });
      analysisTimer.current = null;
    }, 1300);
  };

  const startDraftManual = () => {
    if (analysisTimer.current) {
      clearTimeout(analysisTimer.current);
      analysisTimer.current = null;
    }
    const blank = createBlankProduct(data.brandName);
    setData((d) => ({ ...d, products: [...d.products, blank] }));
    setDraftProductId(blank.id);
    setAddEntry("manual");
    setAddStage("idle");
    setEdit({
      isOpen: true,
      scope: "add",
      productId: blank.id,
      focus: null,
    });
  };

  const cancelDraft = () => {
    if (draftProductId) {
      setData((d) => ({
        ...d,
        products: d.products.filter((p) => p.id !== draftProductId),
      }));
    }
    setDraftProductId(null);
    closeEdit();
  };

  const confirmDraft = () => {
    setDraftProductId(null);
    closeEdit();
    // Per UX: don't show "added" toast or detail page — return to home with
    // mockup reflecting the new product so the user can add another.
  };

  const openProductEdit = (productId: string, focus: EditFocus) => {
    setEdit({ isOpen: true, scope: "product", productId, focus });
  };
  const openPageEdit = () => {
    setEdit({ isOpen: true, scope: "page", productId: null, focus: null });
  };
  const closeEdit = () =>
    setEdit({ isOpen: false, scope: null, productId: null, focus: null });

  const liveProductChange = (productId: string, next: Product) => {
    setData((d) => ({
      ...d,
      products: d.products.map((p) => (p.id === productId ? next : p)),
    }));
  };

  const applyProduct = (productId: string, next: Product) => {
    liveProductChange(productId, next);
    showToast("수정사항이 반영되었습니다");
    closeEdit();
  };

  const applyPage = (patch: Partial<ProductData>) => {
    setData((d) => {
      const next = { ...d, ...patch };
      if (patch.brandName && patch.brandName !== d.brandName) {
        next.products = next.products.map((p) => ({
          ...p,
          brand: patch.brandName!,
        }));
      }
      return next;
    });
    showToast("페이지 정보가 수정되었습니다");
    closeEdit();
  };

  const copyLink = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(data.link);
      }
    } catch {
      /* mock */
    }
    showToast("링크가 복사됐어요 · 이제 어디든 붙여넣어 글로벌 판매 시작!");
  };

  const editingProduct = useMemo(
    () =>
      edit.productId
        ? data.products.find((p) => p.id === edit.productId) ?? null
        : null,
    [edit.productId, data.products]
  );

  const draftProduct = useMemo(
    () =>
      draftProductId
        ? data.products.find((p) => p.id === draftProductId) ?? null
        : null,
    [draftProductId, data.products]
  );

  const addPanelOpen = edit.isOpen && edit.scope === "add";

  const headerLinkBar =
    step === "editor" ? (
      <div className="flex items-center gap-2 w-full">
        <div className="flex-1 flex items-center gap-2 px-3 py-2 rounded-xl bg-white border border-line min-w-0">
          <Globe2 className="w-3.5 h-3.5 text-ink flex-shrink-0" />
          <span className="text-[13px] font-medium text-ink truncate">
            {data.link}
          </span>
        </div>
        <button
          onClick={copyLink}
          className="px-3 h-[38px] rounded-xl bg-white border border-line text-ink text-[12.5px] font-semibold flex items-center gap-1.5 hover:border-ink/30 transition-colors flex-shrink-0"
        >
          <Copy className="w-3.5 h-3.5" />
          <span className="hidden md:inline">복사</span>
        </button>
        <button
          onClick={copyLink}
          className="px-3.5 h-[38px] rounded-xl bg-ink text-white text-[12.5px] font-semibold hover:opacity-90 transition-opacity flex-shrink-0 whitespace-nowrap"
        >
          판매 시작
        </button>
      </div>
    ) : null;

  return (
    <main className="min-h-screen bg-bg">
      <Header onLogoClick={goLink} centerSlot={headerLinkBar} />

      {step === "link" && (
        <LinkCreateStep initialSlug={data.slug} onSubmit={handleLinkSubmit} />
      )}

      {step === "editor" && (
        <GeneratedEditorStep
          data={data}
          draftProductId={draftProductId}
          addStage={addStage}
          onEditProduct={openProductEdit}
          onAddProduct={handleAddProduct}
          onUploadFile={startDraftWithFile}
          onManualStart={startDraftManual}
          onCancelAddStage={cancelAddStage}
          rightPanel={
            addPanelOpen ? (
              <AddProductPanel
                open={addPanelOpen}
                product={draftProduct}
                data={data}
                initialTab={addEntry}
                initialStep="info"
                onChange={liveProductChange}
                onConfirm={confirmDraft}
                onCancel={cancelDraft}
              />
            ) : null
          }
        />
      )}

      <ProductEditPanel
        open={edit.isOpen && edit.scope === "product"}
        product={edit.scope === "product" ? editingProduct : null}
        data={data}
        focus={edit.focus}
        liveUpdate
        onClose={closeEdit}
        onApply={applyProduct}
        onLiveChange={liveProductChange}
      />

      <PageEditPanel
        open={edit.isOpen && edit.scope === "page"}
        data={data}
        onClose={closeEdit}
        onApply={applyPage}
      />

      <Toast visible={toast.isVisible} message={toast.message} />
    </main>
  );
}

function deriveBrandName(slug: string): string {
  if (!slug) return "My brand";
  const cleaned = slug.replace(/-+/g, " ").trim();
  if (!cleaned) return "My brand";
  return cleaned
    .split(/\s+/)
    .map((w) => (w[0]?.toUpperCase() ?? "") + w.slice(1))
    .join(" ");
}
