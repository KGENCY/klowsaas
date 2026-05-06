"use client";

import { useEffect, useState } from "react";
import { Heart, Plus } from "lucide-react";
import type { EditFocus, Product } from "@/types";
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
  products,
  onOpenProduct,
  onEdit,
  onAddProduct,
}: Props) {
  const skinMatchTags = Array.from(new Set(products.flatMap((p) => p.goodFor)));
  const [activeTag, setActiveTag] = useState<string>("전체");

  useEffect(() => {
    if (activeTag !== "전체" && !skinMatchTags.includes(activeTag)) {
      setActiveTag("전체");
    }
  }, [activeTag, skinMatchTags]);

  const isAll = activeTag === "전체";
  const visibleProducts = isAll
    ? products
    : products.filter((product) => product.goodFor.includes(activeTag));

  const cells = isAll
    ? Math.max(4, visibleProducts.length + 3)
    : visibleProducts.length + 1;
  const noProducts = visibleProducts.length === 0 && isAll;

  return (
    <PhoneFrame brandName={brandName}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        <div className="px-5 py-3 flex gap-2 overflow-x-auto scrollbar-hide">
          <CategoryPill active={isAll} onClick={() => setActiveTag("전체")}>
            전체
          </CategoryPill>
          {skinMatchTags.map((tag) => (
            <CategoryPill
              key={tag}
              active={activeTag === tag}
              onClick={() => setActiveTag(tag)}
            >
              {tag}
            </CategoryPill>
          ))}
        </div>

        <div className="px-3 pb-6 grid grid-cols-2 gap-x-2 gap-y-5">
          {Array.from({ length: cells }).map((_, i) => {
            const product = visibleProducts[i];
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

            const primary = i === visibleProducts.length;
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
        {product.mainPhoto ? (
          <img
            src={product.mainPhoto}
            alt=""
            className="w-full h-full object-cover bg-white"
            draggable={false}
          />
        ) : (
          <ProductVisual brandName={product.brand} imageType={product.imageType} />
        )}
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
          {product.name || <span className="text-sub/60">상품명 없음</span>}
        </button>
        <button onClick={onEditPrice} className="mt-1.5 flex items-baseline gap-1.5">
          {product.discountRate > 0 && (
            <span className="text-ink font-bold text-[12px]">
              {product.discountRate}%
            </span>
          )}
          <span className="font-bold text-[14px]">
            {product.priceUSD > 0 ? formatUSD(product.priceUSD) : "가격 미정"}
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
  onClick,
}: {
  children: React.ReactNode;
  active?: boolean;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
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
