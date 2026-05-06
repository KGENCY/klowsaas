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
  "Dry Skin",
  "Oily Skin",
  "Combination Skin",
  "Sensitive Skin",
  "Acne Skin",
  "Anti-aging",
  "Glass skin",
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
  const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isDrOasis =
    normalizedBrand.includes("droasislab") ||
    normalizedBrand.includes("doctoroasislab") ||
    brand.includes("오아시스");

  if (isDrOasis) {
    return {
      name: "[NEW] Supergen Triple Rebalancing Cream 50g",
      brand,
      imageType: "custom",
      mainPhoto:
        "https://ecimg.cafe24img.com/pg1627b17501560001/ogmarketing/web/product/medium/20260303/9d80a6f819d0811afc62e104bed94a89.png",
      discountRate: 15,
      priceUSD: 35.26,
      originalPriceUSD: 41.48,
      benefits: ["Barrier care", "Hydration", "Home aesthetic"],
      ingredients: ["Triple Collagen", "Spicule", "Glyceryl Glucoside"],
      goodFor: ["Dry Skin", "Sensitive Skin", "Barrier care"],
      bestFor: ["Dry Skin", "Sensitive Skin", "Barrier care"],
      description:
        "A home-aesthetic rebalancing cream for barrier support and lasting hydration.",
      howToUse:
        "Apply at the last step of skincare and gently press into skin until absorbed.",
      reviewCount: 248,
      reviewSnippets: [
        {
          author: "Emily R.",
          country: "USA",
          rating: 5,
          text: "The texture feels like a clinic-grade K-beauty routine without being heavy.",
        },
      ],
      photos: [],
    };
  }

  const presets: Partial<Product>[] = [
    {
      name: "Glass Glow Daily Serum",
      imageType: "rice",
      benefits: ["Glass skin", "Hydration", "Brightening"],
      ingredients: ["Niacinamide", "Hyaluronic Acid", "Rice Extract"],
      goodFor: ["Dry Skin", "Glass skin", "Dullness"],
    },
    {
      name: "Cica Calm Soothing Cream",
      imageType: "green-tea",
      benefits: ["Soothing", "Barrier care", "Hydration"],
      ingredients: ["Cica", "Panthenol", "Ceramide"],
      goodFor: ["Sensitive Skin", "Redness", "Dry Skin"],
    },
    {
      name: "Cucumber Cooling Toner",
      imageType: "cucumber",
      benefits: ["Cooling", "Hydration", "Soothing"],
      ingredients: ["Cucumber Extract", "Hyaluronic Acid", "Aloe"],
      goodFor: ["Oily Skin", "Combination Skin", "Pores"],
    },
  ];
  const seed = fileName.length % presets.length;
  return { ...presets[seed], brand, photos: [] };
}
