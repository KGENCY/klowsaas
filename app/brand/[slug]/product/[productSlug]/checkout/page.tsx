"use client";

import Link from "next/link";
import { useEffect, useState } from "react";
import type { Product, ProductData } from "@/types";
import { findProductBySlug, loadBrand } from "@/lib/brandStore";
import { CheckoutFlow } from "./CheckoutFlow";

interface PageProps {
  params: { slug: string; productSlug: string };
}

type LoadState =
  | { kind: "loading" }
  | { kind: "missing" }
  | { kind: "ready"; brand: ProductData; product: Product };

export default function CheckoutPage({ params }: PageProps) {
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
          Loading…
        </main>
      </div>
    );
  }

  if (state.kind === "missing") {
    return (
      <div className="min-h-screen bg-bg">
        <main className="relative mx-auto w-full max-w-[430px] px-5 pt-32 text-center">
          <div className="text-[15px] font-bold text-ink">Product not found</div>
          <Link
            href={`/brand/${params.slug}`}
            className="mt-4 inline-block text-[12.5px] font-semibold text-ink underline"
          >
            ← Back to brand
          </Link>
        </main>
      </div>
    );
  }

  return <CheckoutFlow brand={state.brand} product={state.product} />;
}
