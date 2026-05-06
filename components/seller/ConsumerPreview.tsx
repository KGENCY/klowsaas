"use client";

import {
  Globe2,
  Truck,
  ShieldCheck,
  Pencil,
  Star,
  ImagePlus,
} from "lucide-react";
import type { EditFocus, Product } from "@/types";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { PhoneFrame } from "@/components/ui/PhoneFrame";
import { formatUSD } from "@/lib/pricing";

interface Props {
  brandName: string;
  products: Product[];
  activeProductId: string;
  onSwitchProduct: (id: string) => void;
  onEdit: (productId: string, focus: EditFocus) => void;
  isDraft?: boolean;
}

export function ConsumerPreview({
  brandName,
  products,
  activeProductId,
  onSwitchProduct,
  onEdit,
  isDraft,
}: Props) {
  const product = products.find((p) => p.id === activeProductId) ?? products[0];
  if (!product) return null;

  const editable = !isDraft;
  const showSwitcher = products.length > 1 && !isDraft;

  return (
    <PhoneFrame
      brandName={brandName}
      style={{ padding: 10, height: "min(760px, calc(100vh - 160px))" }}
      footer={
        <div className="px-4 pt-2.5 pb-3 border-t border-line/60 bg-white flex-shrink-0">
          <button className="w-full h-[44px] rounded-2xl bg-ink text-white font-bold text-[14px] active:scale-[0.99] transition-transform">
            {product.priceUSD > 0
              ? `바로 구매 · ${formatUSD(product.priceUSD)}`
              : "바로 구매"}
          </button>
        </div>
      }
    >
      {showSwitcher && (
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
                {p.mainPhoto ? (
                  <img
                    src={p.mainPhoto}
                    alt=""
                    className="w-full h-full object-cover bg-white"
                    draggable={false}
                  />
                ) : (
                  <ProductVisual size="sm" imageType={p.imageType} />
                )}
              </button>
            );
          })}
        </div>
      )}

      <div className="flex-1 overflow-y-auto scrollbar-hide">
        {editable && !isDraft && (
          <div className="mx-5 my-2 px-3 py-1.5 rounded-xl bg-bg border border-line flex items-center gap-2">
            <Pencil className="w-3 h-3 text-sub flex-shrink-0" />
            <span className="text-[10.5px] font-medium text-sub leading-tight">
              어떤 항목이든 눌러서 다듬을 수 있어요
            </span>
          </div>
        )}

        {/* Hero: the extracted main visual is always slide 1. User-added
            photos beyond the 3-thumbnail strip (index 3+) become additional
            carousel slides reachable by swiping sideways. */}
        <ClickableSection
          editable={editable}
          focus="image"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <div className="w-full overflow-hidden" style={{ aspectRatio: "1 / 1" }}>
            {product.photos.length > 3 ? (
              <div className="w-full h-full flex overflow-x-auto snap-x snap-mandatory scrollbar-hide">
                <div className="snap-center flex-shrink-0 w-full h-full">
                  {product.mainPhoto ? (
                    <img
                      src={product.mainPhoto}
                      alt=""
                      className="w-full h-full object-cover"
                      draggable={false}
                    />
                  ) : (
                        <ProductVisual
                          size="lg"
                          brandName={product.brand || brandName}
                          imageType={product.imageType}
                        />
                  )}
                </div>
                {product.photos.slice(3).map((p, i) => (
                  <div
                    key={`hero-${p}-${i}`}
                    className="snap-center flex-shrink-0 w-full h-full"
                  >
                    {isImageUrl(p) ? (
                      <img
                        src={p}
                        alt=""
                        className="w-full h-full object-cover"
                        draggable={false}
                      />
                    ) : (
                        <ProductVisual
                          size="lg"
                          brandName={product.brand || brandName}
                          imageType={product.imageType}
                        />
                    )}
                  </div>
                ))}
              </div>
            ) : product.mainPhoto ? (
              <img
                src={product.mainPhoto}
                alt=""
                className="w-full h-full object-cover"
                draggable={false}
              />
            ) : (
              <ProductVisual
                size="lg"
                brandName={product.brand || brandName}
                imageType={product.imageType}
              />
            )}
          </div>
        </ClickableSection>

        <div className="px-5 pt-3">
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
              {product.priceUSD > 0 && (
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
              )}
            </div>
          </ClickableSection>

          <div className="mt-3 flex items-center gap-1.5 text-[10.5px] font-medium text-sub/85">
            <Globe2 className="w-3 h-3" />
            <span>전 세계 배송</span>
            <span className="opacity-40">·</span>
            <Truck className="w-3 h-3" />
            <span>{product.estimatedDelivery}</span>
            <span className="opacity-40">·</span>
            <ShieldCheck className="w-3 h-3" />
            <span>안전 결제</span>
          </div>
        </div>

        {product.photos.length > 0 && (
          <div className="px-5 mt-3 flex flex-col gap-2">
            {product.photos.slice(0, 3).map((p, i) => (
              <div
                key={`${p}-${i}`}
                className="w-full rounded-2xl bg-bg border border-line overflow-hidden flex flex-col items-center justify-center"
                style={{ aspectRatio: "1 / 1" }}
              >
                {isImageUrl(p) ? (
                  <img
                    src={p}
                    alt=""
                    className="w-full h-full object-cover"
                    draggable={false}
                  />
                ) : (
                  <>
                    <ImagePlus className="w-5 h-5 text-sub/60" />
                    <span className="mt-1 px-2 text-[10px] text-sub text-center truncate max-w-full">
                      {p.replace(/\.[^.]+$/, "")}
                    </span>
                  </>
                )}
              </div>
            ))}
          </div>
        )}

        <div className="mt-3" />
        <Divider />

        <ClickableSection
          editable={editable}
          focus="benefits"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <SectionBlock title="대표 효능">
            <ChipList
              items={product.benefits}
              variant="dark"
              empty="예: 광채 피부, 보습"
            />
          </SectionBlock>
        </ClickableSection>

        <ClickableSection
          editable={editable}
          focus="ingredients"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <SectionBlock title="핵심 성분">
            <ChipList
              items={product.ingredients}
              variant="outline"
              empty="예: 나이아신아마이드, 히알루론산"
            />
          </SectionBlock>
        </ClickableSection>

        <ClickableSection
          editable={editable}
          focus="goodFor"
          onEdit={(f) => onEdit(product.id, f)}
        >
          <SectionBlock title="피부 타입·고민">
            <ChipList
              items={product.goodFor}
              variant="muted"
              empty="예: 건성 피부, 민감성 피부, 광채 피부"
            />
          </SectionBlock>
        </ClickableSection>

        {product.reviewSnippets.length > 0 && (
          <>
            <Divider />
            <div className="px-5 py-4 animate-fade-in">
              <div className="flex items-center justify-between mb-2.5">
                <div className="text-[10.5px] uppercase tracking-[0.16em] font-semibold text-sub">
                  리뷰
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
                  <div key={`${r.author}-${i}`} className="rounded-2xl bg-bg p-3">
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
    </PhoneFrame>
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
  if (!editable) return <div className="block w-full">{children}</div>;
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

function ChipList({
  items,
  variant,
  empty,
}: {
  items: string[];
  variant: "dark" | "outline" | "muted";
  empty: string;
}) {
  if (items.length === 0) {
    return <span className="text-[12px] text-sub/60">{empty}</span>;
  }
  const styles = {
    dark: "bg-ink text-white",
    outline: "bg-white border border-line text-ink/85 font-medium",
    muted: "bg-bg border border-line text-ink/80 font-medium",
  }[variant];
  return (
    <div className="flex flex-wrap gap-1.5">
      {items.map((it) => (
        <span
          key={it}
          className={`px-2.5 py-1 rounded-full text-[11.5px] font-semibold ${styles}`}
        >
          {it}
        </span>
      ))}
    </div>
  );
}

function Divider() {
  return <div className="my-1 border-t border-line/70" />;
}

function isImageUrl(value: string): boolean {
  return (
    value.startsWith("blob:") ||
    value.startsWith("data:") ||
    value.startsWith("http://") ||
    value.startsWith("https://") ||
    value.startsWith("/")
  );
}
