"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import { MoreVertical } from "lucide-react";
import type { ProductData } from "@/types";
import { loadBrand, productSlug, FLAT_SHIPPING_USD } from "@/lib/brandStore";
import { ProductVisual } from "@/components/ProductVisual";

interface PageProps {
  params: { slug: string };
}

type LoadState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; brand: ProductData };

export default function BrandPage({ params }: PageProps) {
  const [state, setState] = useState<LoadState>({ kind: "loading" });
  const [tab, setTab] = useState<"links" | "shop">("shop");

  useEffect(() => {
    const brand = loadBrand(params.slug);
    setState(brand ? { kind: "ready", brand } : { kind: "missing" });
  }, [params.slug]);

  return (
    <div className="min-h-screen bg-bg">
      {state.kind === "loading" && <CenterMessage>Loading…</CenterMessage>}
      {state.kind === "missing" && (
        <CenterMessage>
          <div className="text-[15px] font-bold text-ink">Brand not found</div>
          <div className="mt-1 text-[12.5px] text-sub">
            klow.kr/{params.slug} hasn’t been published yet.
          </div>
        </CenterMessage>
      )}

      {state.kind === "ready" && (
        <BrandView brand={state.brand} tab={tab} onTab={setTab} />
      )}
    </div>
  );
}

function BrandView({
  brand,
  tab,
  onTab,
}: {
  brand: ProductData;
  tab: "links" | "shop";
  onTab: (t: "links" | "shop") => void;
}) {
  const initials = brandInitials(brand.brandName);
  const handle = brandHandle(brand.brandName);

  return (
    <main className="relative mx-auto w-full max-w-[430px] px-5 pb-24 pt-8">
      <header className="text-center">
        <div className="mx-auto inline-flex items-center justify-center w-[84px] h-[84px] rounded-full bg-white border border-line">
          <span className="font-serif italic text-[26px] text-ink leading-none tracking-tight">
            {initials}
          </span>
        </div>

        <h1 className="mt-5 text-[24px] font-bold tracking-tight text-ink">
          @{handle}
        </h1>
        <p className="mt-1 text-[13px] text-sub">
          {brand.category ? `${brand.category} · Korea` : "Korean Beauty"}
        </p>
        <p className="mt-1.5 text-[11px] text-sub font-medium">
          Flat ${FLAT_SHIPPING_USD} global shipping · Ships from Korea
        </p>

        {/* Pill toggle */}
        <div className="mt-5 inline-flex items-center p-1 rounded-full bg-ink">
          <button
            type="button"
            onClick={() => onTab("links")}
            className={`px-7 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              tab === "links"
                ? "bg-white text-ink"
                : "text-white/80 hover:text-white"
            }`}
          >
            Links
          </button>
          <button
            type="button"
            onClick={() => onTab("shop")}
            className={`px-7 py-2 rounded-full text-[13px] font-semibold transition-colors ${
              tab === "shop"
                ? "bg-white text-ink"
                : "text-white/80 hover:text-white"
            }`}
          >
            Shop
          </button>
        </div>
      </header>

      {/* Content */}
      {tab === "shop" ? (
        <section className="mt-7 grid grid-cols-2 gap-3">
          {brand.products.map((p) => (
            <Link
              key={p.id}
              href={`/brand/${brand.slug}/product/${productSlug(p.name)}`}
              className="group rounded-[16px] bg-white border border-line overflow-hidden hover:border-ink/30 transition-colors"
            >
              <div className="aspect-square relative">
                <ProductVisual
                  type={p.imageType}
                  size="md"
                  brandName={brand.brandName}
                />
                {p.discountRate > 0 && (
                  <span className="absolute top-2 left-2 px-1.5 py-0.5 rounded-md bg-white/95 text-[10.5px] font-bold text-ink tracking-tight border border-line">
                    {p.discountRate}%
                  </span>
                )}
              </div>
              <div className="px-3 py-2.5 flex items-start justify-between gap-2">
                <div className="min-w-0 flex-1">
                  <div className="text-[12.5px] font-semibold text-ink truncate leading-tight">
                    {p.name}
                  </div>
                  <div className="mt-1 flex items-baseline gap-1.5">
                    <span className="text-[12.5px] font-bold text-ink">
                      ${p.priceUSD.toFixed(2)}
                    </span>
                    {p.originalPriceUSD > p.priceUSD && (
                      <span className="text-[11px] text-sub line-through">
                        ${p.originalPriceUSD.toFixed(2)}
                      </span>
                    )}
                  </div>
                </div>
                <span className="shrink-0 mt-0.5 -mr-1 text-sub group-hover:text-ink transition-colors">
                  <MoreVertical className="w-[14px] h-[14px]" />
                </span>
              </div>
            </Link>
          ))}
        </section>
      ) : (
        <section className="mt-10 text-center">
          <p className="text-[13px] text-sub">No links yet.</p>
        </section>
      )}

      <p className="mt-12 text-center text-[10.5px] text-sub tracking-[0.18em] uppercase">
        Powered by KLOW
      </p>
    </main>
  );
}

function brandInitials(name: string): string {
  const words = name
    .replace(/[^A-Za-z0-9\s]/g, " ")
    .split(/\s+/)
    .filter(Boolean);
  if (words.length === 0) return "k";
  if (words.length === 1) return words[0].slice(0, 2).toLowerCase();
  return (words[0][0] + words[words.length - 1][0]).toLowerCase();
}

function brandHandle(name: string): string {
  const cleaned = name.toLowerCase().replace(/[^a-z0-9]+/g, "");
  return cleaned || "brand";
}

function CenterMessage({ children }: { children: React.ReactNode }) {
  return (
    <main className="relative mx-auto w-full max-w-[430px] px-5 pt-32 text-center">
      {children}
    </main>
  );
}
