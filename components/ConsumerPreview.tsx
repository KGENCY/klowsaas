"use client";

import {
  Menu,
  Search,
  ShoppingBag,
  Globe2,
  Truck,
  ShieldCheck,
  Pencil,
  Star,
} from "lucide-react";
import type { EditFocus, Product } from "@/types";
import { ProductVisual } from "./ProductVisual";
import { formatUSD } from "@/lib/pricing";

interface Props {
  brandName: string;
  category: string;
  products: Product[];
  activeProductId: string;
  onSwitchProduct: (id: string) => void;
  onEdit: (productId: string, focus: EditFocus) => void;
  isDraft?: boolean;
}

export function ConsumerPreview({
  brandName,
  category,
  products,
  activeProductId,
  onSwitchProduct,
  onEdit,
  isDraft,
}: Props) {
  const product = products.find((p) => p.id === activeProductId) ?? products[0];
  if (!product) return null;

  const editable = !isDraft;

  return (
    <div
      className="relative mx-auto w-full max-w-[380px] rounded-[48px] bg-ink shadow-pop flex flex-col"
      style={{
        padding: 10,
        maxHeight: "min(760px, calc(100vh - 160px))",
      }}
    >
      {/* Side buttons (subtle, decorative) */}
      <span className="absolute left-[-2px] top-[110px] w-[3px] h-[36px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[160px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute left-[-2px] top-[230px] w-[3px] h-[60px] rounded-r bg-ink/80" aria-hidden />
      <span className="absolute right-[-2px] top-[180px] w-[3px] h-[80px] rounded-l bg-ink/80" aria-hidden />

      <div className="relative flex flex-col flex-1 min-h-0 bg-white rounded-[38px] overflow-hidden">
        {/* Status bar */}
        <div className="relative flex items-center justify-between px-7 pt-2.5 pb-1 text-[11px] font-semibold text-ink flex-shrink-0">
          <span className="tracking-tight">9:41</span>
          {/* Dynamic island */}
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

        {/* App chrome */}
        <div className="bg-white px-5 pt-3 pb-2.5 flex items-center justify-between border-b border-line/60 flex-shrink-0">
          <button className="w-8 h-8 -ml-1 flex items-center justify-center">
            <Menu className="w-[17px] h-[17px] text-ink" />
          </button>
          <div className="text-[14px] font-bold tracking-tight">{brandName}</div>
          <div className="flex items-center gap-0.5">
            <button className="w-8 h-8 flex items-center justify-center">
              <Search className="w-[16px] h-[16px] text-ink" />
            </button>
            <button className="w-8 h-8 -mr-1 flex items-center justify-center relative">
              <ShoppingBag className="w-[16px] h-[16px] text-ink" />
            </button>
          </div>
        </div>

      {/* Product switcher (only when there's more than one) */}
      {products.length > 1 && (
        <div className="px-5 pt-3 pb-2 flex items-center gap-2 overflow-x-auto scrollbar-hide">
          {products.map((p) => {
            const active = p.id === activeProductId;
            return (
              <button
                key={p.id}
                onClick={() => onSwitchProduct(p.id)}
                className={`relative flex-shrink-0 w-12 h-12 rounded-2xl overflow-hidden border-2 transition-colors ${
                  active
                    ? "border-ink"
                    : "border-transparent opacity-60 hover:opacity-100"
                }`}
              >
                <ProductVisual type={p.imageType} size="sm" />
              </button>
            );
          })}
        </div>
      )}

      {/* Scrollable inner frame */}
      <div className="flex-1 overflow-y-auto scrollbar-hide">
      {/* Hint banner — non-draft only (drafts replace it with the form on the right) */}
      {editable && !isDraft && (
        <div className="mx-5 my-2 px-3 py-1.5 rounded-xl bg-bg border border-line flex items-center gap-2">
          <Pencil className="w-3 h-3 text-sub flex-shrink-0" />
          <span className="text-[10.5px] font-medium text-sub leading-tight">
            어떤 항목이든 눌러서 다듬을 수 있어요
          </span>
        </div>
      )}

      {/* Hero image */}
      <ClickableSection
        editable={editable}
        focus="image"
        onEdit={(f) => onEdit(product.id, f)}
      >
        <div className="px-4 pt-3 flex justify-center">
          <div
            className="w-full rounded-[22px] overflow-hidden"
            style={{ aspectRatio: "1 / 1", maxHeight: 260 }}
          >
            <ProductVisual
              type={product.imageType}
              size="lg"
              brandName={product.brand || brandName}
            />
          </div>
        </div>
      </ClickableSection>

      <div className="px-5 pt-3">
        <div className="text-[10.5px] uppercase tracking-[0.18em] text-sub font-semibold">
          {product.brand || brandName} · {category}
        </div>

        {/* Name */}
        <ClickableSection
          editable={editable}
          focus="name"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <h2 className="mt-1 text-[18px] font-bold leading-[1.25] tracking-tight pr-2 min-h-[24px]">
            {product.name || (
              <span className="text-sub/50">제품명을 입력해 주세요</span>
            )}
          </h2>
        </ClickableSection>

        {/* Price */}
        <ClickableSection
          editable={editable}
          focus="price"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <div className="mt-2 flex items-baseline gap-2 min-h-[28px]">
            {product.discountRate > 0 && (
              <span className="text-ink font-bold text-[16px]">
                {product.discountRate}%
              </span>
            )}
            {product.priceUSD > 0 ? (
              <>
                <span className="text-[22px] font-bold tracking-tight">
                  {formatUSD(product.priceUSD)}
                </span>
                {product.originalPriceUSD > product.priceUSD && (
                  <span className="text-sub line-through text-[12px]">
                    {formatUSD(product.originalPriceUSD)}
                  </span>
                )}
              </>
            ) : (
              <span className="text-sub/50 text-[14px]">가격을 설정해 주세요</span>
            )}
          </div>
        </ClickableSection>

        {/* Compact trust strip */}
        <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-medium text-sub/85">
          <Globe2 className="w-3 h-3" />
          <span>Ships worldwide</span>
          <span className="opacity-40">·</span>
          <Truck className="w-3 h-3" />
          <span>{product.estimatedDelivery}</span>
          <span className="opacity-40">·</span>
          <ShieldCheck className="w-3 h-3" />
          <span>Secure</span>
        </div>

        {/* Buy now */}
        <button className="mt-3 w-full h-[44px] rounded-2xl bg-ink text-white font-bold text-[14px] active:scale-[0.99] transition-transform">
          {product.priceUSD > 0
            ? `Buy Now · ${formatUSD(product.priceUSD)}`
            : "Buy Now"}
        </button>
      </div>

      <Divider />

      {/* Benefits */}
      <ClickableSection
        editable={editable}
        focus="benefits"
        onEdit={(f) => onEdit(product.id, f)}
      >
        <SectionBlock title="Main benefits">
          {product.benefits.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {product.benefits.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-full bg-ink text-[11.5px] font-semibold text-white"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[12px] text-sub/60">
              예: Glass skin, Hydration
            </span>
          )}
        </SectionBlock>
      </ClickableSection>

      {/* Ingredients */}
      <ClickableSection
        editable={editable}
        focus="ingredients"
        onEdit={(f) => onEdit(product.id, f)}
      >
        <SectionBlock title="Key ingredients">
          {product.ingredients.length > 0 ? (
            <div className="flex flex-wrap gap-1.5">
              {product.ingredients.map((b) => (
                <span
                  key={b}
                  className="px-2.5 py-1 rounded-full bg-white border border-line text-[11.5px] font-medium text-ink/85"
                >
                  {b}
                </span>
              ))}
            </div>
          ) : (
            <span className="text-[12px] text-sub/60">
              예: Niacinamide, Hyaluronic Acid
            </span>
          )}
        </SectionBlock>
      </ClickableSection>

      {product.reviewSnippets.length > 0 && (
        <>
          <Divider />
          <div className="px-5 py-4 animate-fade-in">
            <div className="flex items-center justify-between mb-2.5">
              <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-sub">
                Reviews
              </div>
              <div className="flex items-center gap-1 text-[11.5px] font-semibold">
                <Star className="w-3 h-3 fill-ink text-ink" />
                <span>{product.rating.toFixed(1)}</span>
                <span className="text-sub font-medium">
                  ({product.reviewCount.toLocaleString()})
                </span>
              </div>
            </div>
            <div className="space-y-2">
              {product.reviewSnippets.slice(0, 2).map((r, i) => (
                <div
                  key={`${r.author}-${i}`}
                  className="rounded-2xl bg-bg p-3"
                >
                  <div className="flex items-center justify-between mb-1">
                    <div className="text-[11.5px] font-semibold text-ink truncate">
                      {r.author}
                    </div>
                    <div className="flex items-center gap-0.5">
                      {Array.from({ length: r.rating }).map((_, idx) => (
                        <Star
                          key={idx}
                          className="w-2.5 h-2.5 fill-ink text-ink"
                        />
                      ))}
                    </div>
                  </div>
                  <div className="text-[11.5px] text-ink/80 leading-[1.45]">
                    “{r.text}”
                  </div>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div className="h-2" />
      </div>
      </div>
    </div>
  );
}

function ClickableSection({
  focus,
  onEdit,
  editable,
  children,
}: {
  focus: EditFocus;
  onEdit: (f: EditFocus) => void;
  editable: boolean;
  children: React.ReactNode;
}) {
  if (!editable) {
    return <div className="block w-full">{children}</div>;
  }
  return (
    <button
      type="button"
      onClick={() => onEdit(focus)}
      className="block w-full text-left relative group hover:bg-bg/60 transition-colors"
    >
      {children}
      <Pencil className="absolute top-2 right-2 w-3 h-3 text-sub/0 group-hover:text-ink transition-colors" />
    </button>
  );
}

function SectionBlock({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <div className="px-5 py-3">
      <div className="flex items-center justify-between mb-1.5">
        <div className="text-[10px] uppercase tracking-[0.16em] font-semibold text-sub">
          {title}
        </div>
      </div>
      {children}
    </div>
  );
}

function Divider() {
  return <div className="my-1 border-t border-line/70" />;
}

