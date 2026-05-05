import type { Product, ProductData } from "@/types";

const exchangeRate = 1350;
const shippingUSD = 20;
const paymentFeeRate = 0.05;

export const defaultProductData: ProductData = {
  brandName: "",
  slug: "",
  link: "klow.kr/",
  category: "Skincare",
  settlementKRW: 32000,
  exchangeRate,
  shippingUSD,
  paymentFeeRate,
  products: [],
};

export function createBlankProduct(brandName: string, id?: string): Product {
  return {
    id: id ?? `product-${Date.now()}`,
    brand: brandName,
    name: "",
    imageType: "custom",
    discountRate: 0,
    priceUSD: 0,
    originalPriceUSD: 0,
    settlementKRW: 0,
    costKRW: 0,
    marginKRW: 0,
    benefits: [],
    ingredients: [],
    goodFor: [],
    photos: [],
    description: "",
    bestFor: [],
    howToUse: "",
    rating: 4.9,
    reviewCount: 0,
    reviewSnippets: [],
    shippingCountries: [
      "United States",
      "Canada",
      "Australia",
      "Singapore",
      "United Kingdom",
    ],
    estimatedDelivery: "5–11 days",
    shippingFeeText: "Flat $15 global shipping",
  };
}

export const goodForOptions = [
  "Dry",
  "Oily",
  "Combination",
  "Sensitive",
  "Anti-aging",
  "Glass skin",
  "Acne",
  "Dullness",
  "Redness",
  "Pores",
];

export const benefitOptions = [
  "Glass skin",
  "Hydration",
  "Acne care",
  "Anti-aging",
  "Soothing",
  "Brightening",
  "Barrier care",
  "Pore care",
  "Sensitive skin",
  "Oil control",
  "Cooling",
];

export const ingredientOptions = [
  "Hyaluronic Acid",
  "Niacinamide",
  "Panthenol",
  "Ceramide",
  "Cica",
  "Retinol",
  "Peptide",
  "Vitamin C",
  "AHA/BHA",
  "Rice Extract",
  "Green Tea",
  "Cucumber Extract",
];

export function mockAutofillFromFile(
  fileName: string,
  brand: string
): Partial<Product> {
  const presets: Partial<Product>[] = [
    {
      name: "Glass Glow Daily Serum",
      imageType: "rice",
      benefits: ["Glass skin", "Hydration", "Brightening"],
      ingredients: ["Niacinamide", "Hyaluronic Acid", "Rice Extract"],
      goodFor: ["Dry", "Glass skin", "Dullness"],
    },
    {
      name: "Cica Calm Soothing Cream",
      imageType: "green-tea",
      benefits: ["Soothing", "Barrier care", "Hydration"],
      ingredients: ["Cica", "Panthenol", "Ceramide"],
      goodFor: ["Sensitive", "Redness", "Dry"],
    },
    {
      name: "Cucumber Cooling Toner",
      imageType: "cucumber",
      benefits: ["Cooling", "Hydration", "Soothing"],
      ingredients: ["Cucumber Extract", "Hyaluronic Acid", "Aloe"],
      goodFor: ["Oily", "Combination", "Pores"],
    },
  ];
  const seed = fileName.length % presets.length;
  return { ...presets[seed], brand, photos: [fileName] };
}
