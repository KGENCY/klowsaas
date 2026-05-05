"use client";

import { Heart, Plus } from "lucide-react";
import type { Product, EditFocus } from "@/types";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { formatUSD } from "@/lib/pricing";

interface Props {
  brandName: string;
  category: string;
  products: Product[];
  onOpenProduct: (productId: string) => void;
  onEdit: (productId: string, focus: EditFocus) => void;
  onAddProduct: () => void;
}

export function GridStorefront({
  brandName,
  category,
  products,
  onOpenProduct,
  onEdit,
  onAddProduct,
}: Props) {
  // Always render at least 4 cells so the dashed "add" placeholders are visible.
  const cells = Math.max(4, products.length + 1);
  const noProducts = products.length === 0;

  return (
    <PhoneFrame brandName={brandName}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <CategoryPill active>All</CategoryPill>
          <CategoryPill>{category}</CategoryPill>
        </div>

        <div className="px-3 pb-6 grid grid-cols-2 gap-x-2 gap-y-5">
          {Array.from({ length: cells }).map((_, i) => {
            const product = products[i];
            if (product) {
              return (
                <ProductCell
                  key={product.id}
                  product={product}
                  onOpen={() => onOpenProduct(product.id)}
                  onEditPrice={() => onEdit(product.id, "price")}
                />
              );
            }
            // First empty cell after products = the highlighted "add"
            const primary = i === products.length;
            return (
              <AddCell
                key={`add-${i}`}
                primary={primary}
                onClick={onAddProduct}
                noPadding={noProducts}
                pulse={noProducts && primary}
              />
            );
          })}
        </div>
      </div>
    </PhoneFrame>
  );
}

function ProductCell({
  product,
  onOpen,
  onEditPrice,
}: {
  product: Product;
  onOpen: () => void;
  onEditPrice: () => void;
}) {
  return (
    <div className="group">
      <button
        onClick={onOpen}
        className="block w-full aspect-square rounded-2xl overflow-hidden relative"
      >
        <ProductVisual brandName={product.brand} />
        <span
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          aria-hidden
        >
          <Heart className="w-3.5 h-3.5 text-ink/70" />
        </span>
      </button>
      <div className="mt-2.5">
        <button
          onClick={onOpen}
          className="text-left text-[12.5px] font-semibold leading-[1.3] line-clamp-2 hover:opacity-70 transition-opacity"
        >
          {product.name || <span className="text-sub/60">제품명 없음</span>}
        </button>
        <button onClick={onEditPrice} className="mt-1.5 flex items-baseline gap-1.5">
          {product.discountRate > 0 && (
            <span className="text-ink font-bold text-[12px]">
              {product.discountRate}%
            </span>
          )}
          <span className="font-bold text-[14px]">
            {product.priceUSD > 0 ? formatUSD(product.priceUSD) : "—"}
          </span>
        </button>
      </div>
    </div>
  );
}

function AddCell({
  onClick,
  primary,
  noPadding,
  pulse,
}: {
  onClick: () => void;
  primary?: boolean;
  noPadding?: boolean;
  pulse?: boolean;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
          primary
            ? "border-[2.5px] border-dashed border-ink bg-bg hover:bg-line/40"
            : "border-2 border-dashed border-line bg-bg/60 hover:border-ink/40 hover:bg-line/40"
        } ${pulse ? "animate-pulse-scale" : ""}`}
      >
        <div className="relative z-10 flex flex-col items-center gap-1.5">
          <div
            className={`w-9 h-9 rounded-full flex items-center justify-center ${
              primary
                ? "bg-ink text-white"
                : "bg-white border border-line text-ink/70"
            }`}
          >
            <Plus className="w-4 h-4" strokeWidth={primary ? 2.5 : 2} />
          </div>
          {primary && (
            <div className="text-[12.5px] font-semibold text-ink">
              상품 추가
            </div>
          )}
        </div>
      </button>
      {/* Reserve below to match product cell height alignment */}
      {!noPadding && (
        <div className="mt-2.5 invisible">
          <div className="text-[12.5px]">_</div>
          <div className="text-[12px] mt-1.5">_</div>
        </div>
      )}
    </div>
  );
}

function CategoryPill({
  children,
  active,
}: {
  children: React.ReactNode;
  active?: boolean;
}) {
  return (
    <button
      className={`px-3.5 py-1.5 rounded-full text-[12px] font-semibold whitespace-nowrap transition-colors ${
        active
          ? "bg-ink text-white"
          : "bg-white text-ink border border-line hover:border-ink/30"
      }`}
    >
      {children}
    </button>
  );
}
