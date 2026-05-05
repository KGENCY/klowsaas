export type StepKey = "link" | "editor";

export type ImageType = "rice" | "green-tea" | "cucumber" | "custom";

export interface ReviewSnippet {
  author: string;
  country: string;
  rating: number;
  text: string;
}

export interface Product {
  id: string;
  brand: string;
  name: string;
  imageType: ImageType;
  discountRate: number;
  priceUSD: number;
  originalPriceUSD: number;
  settlementKRW: number;
  costKRW: number;
  marginKRW: number;
  benefits: string[];
  ingredients: string[];
  goodFor: string[];
  mainPhoto?: string;
  photos: string[];
  description: string;
  bestFor: string[];
  howToUse: string;
  rating: number;
  reviewCount: number;
  reviewSnippets: ReviewSnippet[];
  shippingCountries: string[];
  estimatedDelivery: string;
  shippingFeeText: string;
  detailFileName?: string;
  reviewSourceName?: string;
}

export interface ProductData {
  brandName: string;
  slug: string;
  link: string;
  category: string;
  settlementKRW: number;
  exchangeRate: number;
  shippingUSD: number;
  paymentFeeRate: number;
  products: Product[];
}

export type EditFocus =
  | "image"
  | "name"
  | "price"
  | "benefits"
  | "ingredients"
  | "goodFor";

export type EditScope = "product" | "page" | "add" | null;

export interface EditState {
  isOpen: boolean;
  scope: EditScope;
  productId: string | null;
  focus: EditFocus | null;
}

export interface ToastState {
  isVisible: boolean;
  message: string;
}
