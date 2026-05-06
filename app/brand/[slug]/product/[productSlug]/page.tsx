"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Globe2,
  Lock,
  ShieldCheck,
  Star,
  Truck,
} from "lucide-react";
import type { Product, ProductData } from "@/types";
import {
  loadBrand,
  productSlug,
  findProductBySlug,
} from "@/lib/brandStore";
import { ProductVisual } from "@/components/ui/ProductVisual";

interface PageProps {
  params: { slug: string; productSlug: string };
}

type LoadState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; brand: ProductData; product: Product };

export default function ProductDetailPage({ params }: PageProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });

  useEffect(() => {
    const brand = loadBrand(params.slug);
    if (!brand) return setState({ kind: "missing" });
    const product = findProductBySlug(brand, params.productSlug);
    if (!product) return setState({ kind: "missing" });
    setState({ kind: "ready", brand, product });
  }, [params.slug, params.productSlug]);

  if (state.kind === "loading") {
    return (
      <div className="min-h-screen bg-bg">
        <main className="relative mx-auto w-full max-w-[430px] px-5 pt-32 text-center text-[13px] text-sub">
          불러오는 중…
        </main>
      </div>
    );
  }

  if (state.kind === "missing") {
    return (
      <div className="min-h-screen bg-bg">
        <main className="relative mx-auto w-full max-w-[430px] px-5 pt-32 text-center">
          <div className="text-[15px] font-bold text-ink">상품을 찾을 수 없습니다</div>
          <Link
            href={`/brand/${params.slug}`}
            className="mt-4 inline-block text-[12.5px] font-semibold text-ink underline"
          >
            ← 브랜드로 돌아가기
          </Link>
        </main>
      </div>
    );
  }

  return <ProductView brand={state.brand} product={state.product} />;
}

function ProductView({
  brand,
  product,
}: {
  brand: ProductData;
  product: Product;
}) {
  const trustItems = [
    { icon: <Truck className="w-4 h-4" />, label: "전 세계 무료배송 포함" },
    { icon: <Globe2 className="w-4 h-4" />, label: "한국에서 발송" },
    { icon: <ShieldCheck className="w-4 h-4" />, label: "추가 비용 없음" },
    { icon: <Lock className="w-4 h-4" />, label: "안전한 주문" },
  ];

  return (
    <div className="min-h-screen bg-bg pb-[120px]">
      <header className="relative mx-auto w-full max-w-[430px] px-5 pt-5 flex items-center justify-between">
        <Link
          href={`/brand/${brand.slug}`}
          className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/60 transition-colors"
          aria-label="브랜드로 돌아가기"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-ink" />
        </Link>
        <div className="text-[11px] font-bold tracking-[0.28em] text-ink">
          KLOW
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-sub font-medium">
          <Lock className="w-[12px] h-[12px]" /> 안전 주문
        </span>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-5 pt-4">
        {/* Hero image */}
        <div className="aspect-square rounded-[28px] overflow-hidden border border-line bg-white">
          {product.mainPhoto ? (
            <img
              src={product.mainPhoto}
              alt=""
              className="w-full h-full object-cover bg-white"
              draggable={false}
            />
          ) : (
            <ProductVisual
              size="lg"
              brandName={brand.brandName}
              imageType={product.imageType}
            />
          )}
        </div>

        {/* Title */}
        <section className="mt-6 px-1">
          <div className="flex items-center justify-between gap-3">
            <span className="text-[11px] font-semibold tracking-wide text-sub uppercase truncate">
              {brand.brandName}
            </span>
            {product.rating > 0 && (
              <span className="inline-flex items-center gap-1 text-[11.5px] font-semibold text-ink">
                <Star className="w-[12px] h-[12px] fill-ink text-ink" />
                {product.rating.toFixed(1)}
                <span className="text-sub font-medium">
                  · {product.reviewCount.toLocaleString()}
                </span>
              </span>
            )}
          </div>
          <h1 className="mt-2 text-[22px] font-bold text-ink tracking-tight leading-[1.25]">
            {product.name}
          </h1>

          <div className="mt-4 flex items-baseline gap-2">
            {product.discountRate > 0 && (
              <span className="text-[15px] font-bold text-ink">
                {product.discountRate}%
              </span>
            )}
            <span className="text-[26px] font-bold text-ink tracking-tight">
              ${product.priceUSD.toFixed(2)}
            </span>
            {product.originalPriceUSD > product.priceUSD && (
              <span className="text-[14px] text-sub line-through">
                ${product.originalPriceUSD.toFixed(2)}
              </span>
            )}
          </div>
        </section>

        {/* Trust grid */}
        <section className="mt-6 grid grid-cols-2 gap-2">
          {trustItems.map((t) => (
            <div
              key={t.label}
              className="flex items-center gap-2 px-3 py-2.5 rounded-2xl bg-white border border-line"
            >
              <span className="w-7 h-7 rounded-full bg-bg text-ink flex items-center justify-center flex-shrink-0">
                {t.icon}
              </span>
              <span className="text-[12px] font-semibold text-ink leading-tight">
                {t.label}
              </span>
            </div>
          ))}
        </section>

        {/* Benefits */}
        {product.benefits.length > 0 && (
          <Section title="대표 효능">
            <ChipRow items={product.benefits} variant="dark" />
          </Section>
        )}

        {/* Ingredients */}
        {product.ingredients.length > 0 && (
          <Section title="핵심 성분">
            <ChipRow items={product.ingredients} variant="neutral" />
          </Section>
        )}

        {/* Price preview */}
        <section className="mt-6 rounded-2xl bg-white border border-line p-4">
          <div className="text-[11px] font-semibold tracking-wide text-sub uppercase mb-2">
            결제 예상 금액
          </div>
          <div className="space-y-1.5 text-[13.5px]">
            <div className="flex items-center justify-between">
              <span className="text-sub">상품 금액</span>
              <span className="font-semibold text-ink">
                ${product.priceUSD.toFixed(2)}
              </span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sub inline-flex items-center gap-1.5">
                배송비
                <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9.5px] font-bold border border-emerald-100">
                  포함
                </span>
              </span>
              <span className="font-semibold text-ink">
                무료
              </span>
            </div>
            <div className="pt-2 mt-2 border-t border-line flex items-baseline justify-between">
              <span className="text-[12.5px] font-semibold text-sub">총 결제 금액</span>
              <span className="text-[20px] font-bold text-ink tracking-tight">
                ${product.priceUSD.toFixed(2)}
              </span>
            </div>
          </div>
        </section>

        <p className="mt-6 text-center text-[11.5px] text-sub tracking-wide">
          KLOW 제공 · {product.estimatedDelivery || "서울에서 전 세계 발송"}
        </p>
      </main>

      {/* Sticky bottom */}
      <div className="fixed bottom-0 inset-x-0 z-30">
        <div className="mx-auto w-full max-w-[430px] px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 bg-bg/95 backdrop-blur border-t border-line">
          <div className="text-center mb-2 text-[10.5px] text-sub font-medium">
            전 세계 무료배송 포함
          </div>
          <Link
            href={`/brand/${brand.slug}/product/${productSlug(product.name)}/checkout`}
            className="w-full h-[58px] rounded-2xl bg-ink hover:opacity-90 text-white font-bold text-[16px] tracking-tight inline-flex items-center justify-center gap-2 transition-opacity active:scale-[0.99]"
          >
            내 국가로 주문하기
            <ArrowRight className="w-[16px] h-[16px]" strokeWidth={2.5} />
          </Link>
        </div>
      </div>
    </div>
  );
}

function Section({
  title,
  children,
}: {
  title: string;
  children: React.ReactNode;
}) {
  return (
    <section className="mt-6 px-1">
      <h3 className="text-[11.5px] font-bold tracking-wide text-sub uppercase mb-2">
        {title}
      </h3>
      {children}
    </section>
  );
}

function ChipRow({
  items,
  variant,
}: {
  items: string[];
  variant: "dark" | "neutral";
}) {
  const styles =
    variant === "dark"
      ? "bg-ink text-white"
      : "bg-white border border-line text-ink";
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
