"use client";

import { useEffect, useState } from "react";
import { FileImage, Heart, Plus, Sparkles, Upload } from "lucide-react";
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

  return (
    <PhoneFrame brandName={brandName || "DR. OASIS LAB"}>
      <div className="flex-1 min-h-0 overflow-y-auto scrollbar-hide">
        {products.length === 0 ? (
          <EmptyStorefront onAddProduct={onAddProduct} />
        ) : (
          <>
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
              {visibleProducts.map((product) => (
                <ProductCell
                  key={product.id}
                  product={product}
                  onOpen={() => onOpenProduct(product.id)}
                  onEditPrice={() => onEdit(product.id, "price")}
                />
              ))}
              <AddCell onClick={onAddProduct} primary />
              <AddCell onClick={onAddProduct} />
            </div>
          </>
        )}
      </div>
    </PhoneFrame>
  );
}

function EmptyStorefront({ onAddProduct }: { onAddProduct: () => void }) {
  return (
    <div className="flex min-h-full flex-col px-5 pb-6 pt-5 animate-fade-in">
      <div className="relative overflow-hidden rounded-[28px] border border-line bg-[linear-gradient(180deg,#ffffff,#f7faf8)] p-5">
        <span className="absolute -right-8 -top-8 h-28 w-28 rounded-full bg-emerald-100/70 blur-2xl" />
        <span className="absolute -left-8 bottom-6 h-24 w-24 rounded-full bg-sky-100/70 blur-2xl" />
        <div className="relative flex items-center justify-between">
          <div className="rounded-full bg-white px-2.5 py-1 text-[10px] font-black text-sub shadow-card">
            Storefront ready
          </div>
          <Sparkles className="h-4 w-4 text-ink animate-pulse-soft" />
        </div>
        <div className="relative mt-8 grid grid-cols-2 gap-2">
          <PreviewTile delay="0ms" tone="bg-[linear-gradient(135deg,#fefefe,#eef7f2)]" />
          <PreviewTile delay="90ms" tone="bg-[linear-gradient(135deg,#ffffff,#f2f6ff)]" />
          <PreviewTile delay="180ms" tone="bg-[linear-gradient(135deg,#ffffff,#fff6ee)]" />
          <PreviewTile delay="270ms" tone="bg-[linear-gradient(135deg,#fefefe,#f3f4f6)]" />
        </div>
        <div className="relative mt-3 h-2 overflow-hidden rounded-full bg-white">
          <span className="block h-full w-2/3 rounded-full bg-ink/10 animate-pulse-soft" />
        </div>
      </div>

      <div className="mt-7 text-center">
        <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white shadow-card animate-pulse-scale">
          <Sparkles className="h-5 w-5" />
        </div>
        <h2 className="mt-4 text-[22px] font-black leading-[1.25] tracking-tight">
          첫 글로벌 상품을 등록해보세요
        </h2>
        <p className="mt-2 text-[13px] leading-[1.65] text-sub">
          상세페이지 파일만 올리면
          <br />
          KLOW가 글로벌 판매 페이지를 만들어드려요.
        </p>
      </div>

      <button
        type="button"
        onClick={onAddProduct}
        className="mt-auto flex h-12 w-full items-center justify-center gap-2 rounded-2xl bg-ink text-[14px] font-bold text-white hover:opacity-90 transition-opacity"
      >
        <Upload className="h-4 w-4" />
        상품 추가
      </button>
      <div className="mt-3 flex items-center justify-center gap-1.5 text-[11px] font-bold text-sub">
        <FileImage className="h-3.5 w-3.5" />
        PDF · PNG · JPG 지원
      </div>
    </div>
  );
}

function PreviewTile({ delay, tone }: { delay: string; tone: string }) {
  return (
    <div
      className="aspect-square rounded-2xl border border-white/80 bg-white/80 p-2 shadow-card animate-fade-in"
      style={{ animationDelay: delay }}
    >
      <div className={`flex h-full items-center justify-center rounded-xl ${tone}`}>
        <span className="h-8 w-8 rounded-full bg-white/75 shadow-card" />
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
}: {
  onClick: () => void;
  primary?: boolean;
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
        <div
          className={`w-9 h-9 rounded-full flex items-center justify-center ${
            primary ? "bg-ink text-white" : "bg-white border border-line text-ink/70"
          }`}
        >
          <Plus className="w-4 h-4" strokeWidth={primary ? 2.5 : 2} />
        </div>
        {primary && <div className="text-[12.5px] font-semibold text-ink">상품 추가</div>}
      </button>
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
