"use client";

import { Heart, Menu, Plus, Search, ShoppingBag } from "lucide-react";
import type { Product, EditFocus } from "@/types";
import { ProductVisual } from "./ProductVisual";
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
  const slots = Array.from({ length: cells });
  const noProducts = products.length === 0;

  return (
    <div
      className="relative mx-auto w-full max-w-[380px] rounded-[48px] bg-ink shadow-pop flex flex-col"
      style={{
        padding: 10,
        aspectRatio: "9 / 19.2",
        maxHeight: "calc(100vh - 140px)",
      }}
    >
      <span className="absolute left-[-2px] top-[110px] w-[3px] h-[36px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[160px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[230px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute right-[-2px] top-[180px] w-[3px] h-[80px] rounded-l bg-ink/80" aria-hidden />

      <div className="relative flex flex-col flex-1 min-h-0 bg-white rounded-[38px] overflow-hidden">
        {/* Status bar */}
        <div className="relative flex items-center justify-between px-7 pt-2.5 pb-1 text-[11px] font-semibold text-ink flex-shrink-0">
          <span className="tracking-tight">9:41</span>
          <span className="absolute left-1/2 top-2 -translate-x-1/2 w-[88px] h-[26px] rounded-full bg-ink" aria-hidden />
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

      <div className="px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-line/60 flex-shrink-0">
        <button className="w-8 h-8 -ml-1 flex items-center justify-center">
          <Menu className="w-[17px] h-[17px] text-ink" />
        </button>
        <div className="text-[14px] font-bold tracking-tight">{brandName}</div>
        <div className="flex items-center gap-0.5">
          <button className="w-8 h-8 flex items-center justify-center">
            <Search className="w-[16px] h-[16px] text-ink" />
          </button>
          <button className="w-8 h-8 -mr-1 flex items-center justify-center">
            <ShoppingBag className="w-[16px] h-[16px] text-ink" />
          </button>
        </div>
      </div>

      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
      <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
        <Pill active>All</Pill>
        <Pill>{category}</Pill>
      </div>

      <div className="px-5 pb-6 grid grid-cols-2 gap-x-3 gap-y-5">
        {slots.map((_, i) => {
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
          if (i === products.length) {
            return (
              <AddCell
                key={`add-${i}`}
                primary
                onClick={onAddProduct}
                noPadding={noProducts}
              />
            );
          }
          return (
            <AddCell
              key={`add-${i}`}
              onClick={onAddProduct}
              noPadding={noProducts}
            />
          );
        })}
      </div>
      </div>
      </div>
    </div>
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
        <ProductVisual type={product.imageType} brandName={product.brand} />
        <span
          className="absolute bottom-2 right-2 w-7 h-7 rounded-full bg-white/90 backdrop-blur flex items-center justify-center"
          aria-hidden
        >
          <Heart className="w-3.5 h-3.5 text-ink/70" />
        </span>
      </button>
      <div className="mt-2.5">
        <div className="text-[10.5px] text-sub uppercase tracking-wider font-medium truncate">
          {product.brand}
        </div>
        <button
          onClick={onOpen}
          className="mt-0.5 text-left text-[12.5px] font-semibold leading-[1.3] line-clamp-2 hover:opacity-70 transition-opacity"
        >
          {product.name || (
            <span className="text-sub/60">제품명 없음</span>
          )}
        </button>
        <button
          onClick={onEditPrice}
          className="mt-1.5 flex items-baseline gap-1.5"
        >
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
}: {
  onClick: () => void;
  primary?: boolean;
  noPadding?: boolean;
}) {
  return (
    <div>
      <button
        onClick={onClick}
        className={`relative w-full aspect-square rounded-2xl flex flex-col items-center justify-center gap-2 transition-colors overflow-hidden ${
          primary
            ? "border-[2.5px] border-dashed border-ink bg-bg hover:bg-line/40"
            : "border-2 border-dashed border-line bg-bg/60 hover:border-ink/40 hover:bg-line/40"
        }`}
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
      {/* Reserve below to match product cells height alignment */}
      {!noPadding && (
        <div className="mt-2.5 invisible">
          <div className="text-[10.5px]">_</div>
          <div className="text-[12.5px]">_</div>
          <div className="text-[12px] mt-1.5">_</div>
        </div>
      )}
    </div>
  );
}

function Pill({
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
