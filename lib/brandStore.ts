import type { Product, ProductData } from "@/types";
import { sanitizeSlug } from "./pricing";
import { defaultProductData } from "./mockData";
import { justBeMeData } from "./justBeMeData";

const STORAGE_KEY = (slug: string) => `klow:brand:${slug}`;
const INDEX_KEY = "klow:brand:index";

const FLAT_SHIPPING_USD = 15;

export { FLAT_SHIPPING_USD };

const fallbacks: Record<string, ProductData> = {
  [justBeMeData.slug]: justBeMeData,
  [defaultProductData.slug]: defaultProductData,
};

export function productSlug(name: string): string {
  return sanitizeSlug(name);
}

export function findProductBySlug(
  brand: ProductData,
  slug: string,
): Product | null {
  return brand.products.find((p) => productSlug(p.name) === slug) ?? null;
}

export function saveBrand(data: ProductData): void {
  if (typeof window === "undefined") return;
  if (!data.slug) return;
  try {
    window.localStorage.setItem(STORAGE_KEY(data.slug), JSON.stringify(data));
    const idx = readIndex();
    if (!idx.includes(data.slug)) {
      idx.push(data.slug);
      window.localStorage.setItem(INDEX_KEY, JSON.stringify(idx));
    }
  } catch {
    /* ignore storage failures */
  }
}

export function loadBrandFromStorage(slug: string): ProductData | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = window.localStorage.getItem(STORAGE_KEY(slug));
    if (!raw) return null;
    return JSON.parse(raw) as ProductData;
  } catch {
    return null;
  }
}

export function loadBrand(slug: string): ProductData | null {
  return loadBrandFromStorage(slug) ?? fallbacks[slug] ?? null;
}

function readIndex(): string[] {
  if (typeof window === "undefined") return [];
  try {
    const raw = window.localStorage.getItem(INDEX_KEY);
    if (!raw) return [];
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? parsed : [];
  } catch {
    return [];
  }
}
