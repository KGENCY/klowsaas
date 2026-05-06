import type { Product, ProductData } from "@/types";

const exchangeRate = 1350;
const shippingUSD = 20;
const paymentFeeRate = 0.15;

export const defaultProductData: ProductData = {
  brandName: "",
  slug: "",
  link: "klow.kr/",
  category: "스킨케어",
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
    shippingCountries: ["미국", "캐나다", "호주", "싱가포르", "영국"],
    estimatedDelivery: "5-11일",
    shippingFeeText: "전 세계 무료배송 포함",
  };
}

export const goodForOptions = [
  "건성 피부",
  "지성 피부",
  "복합성 피부",
  "민감성 피부",
  "여드름성 피부",
  "탄력 저하",
  "글래스 스킨",
  "칙칙함",
  "붉은기",
  "모공",
];

export const benefitOptions = [
  "글래스 스킨",
  "수분 공급",
  "트러블 케어",
  "탄력 케어",
  "진정",
  "브라이트닝",
  "장벽 케어",
  "모공 케어",
  "민감성 케어",
  "유분 조절",
  "쿨링",
];

export const ingredientOptions = [
  "히알루론산",
  "나이아신아마이드",
  "판테놀",
  "세라마이드",
  "시카",
  "레티놀",
  "펩타이드",
  "비타민 C",
  "AHA/BHA",
  "쌀 추출물",
  "녹차",
  "오이 추출물",
];

export function mockAutofillFromFile(
  fileName: string,
  brand: string
): Partial<Product> {
  const normalizedBrand = brand.toLowerCase().replace(/[^a-z0-9]/g, "");
  const isDrOasis =
    normalizedBrand.includes("droasislab") ||
    normalizedBrand.includes("doctoroasislab") ||
    brand.includes("닥터오아시스");

  if (isDrOasis) {
    return {
      name: "슈퍼젠 트리플 리밸런싱 크림 50g",
      brand,
      imageType: "custom",
      mainPhoto:
        "https://ecimg.cafe24img.com/pg1627b17501560001/ogmarketing/web/product/medium/20260303/9d80a6f819d0811afc62e104bed94a89.png",
      discountRate: 15,
      priceUSD: 35.26,
      originalPriceUSD: 41.48,
      benefits: ["장벽 케어", "수분 공급", "홈 에스테틱"],
      ingredients: ["트리플 콜라겐", "스피큘", "글리세릴글루코사이드"],
      goodFor: ["건성 피부", "민감성 피부", "장벽 케어"],
      bestFor: ["건성 피부", "민감성 피부", "장벽 케어"],
      description:
        "피부 장벽과 오래 지속되는 보습감을 위한 홈 에스테틱 리밸런싱 크림입니다.",
      howToUse:
        "스킨케어 마지막 단계에서 적당량을 바르고 흡수될 때까지 부드럽게 눌러주세요.",
      reviewCount: 248,
      reviewSnippets: [
        {
          author: "Emily R.",
          country: "미국",
          rating: 5,
          text: "무겁지 않은데도 에스테틱 케어를 받은 듯한 사용감이 좋았어요.",
        },
      ],
      photos: [],
    };
  }

  const presets: Partial<Product>[] = [
    {
      name: "글래스 글로우 데일리 세럼",
      imageType: "rice",
      benefits: ["글래스 스킨", "수분 공급", "브라이트닝"],
      ingredients: ["나이아신아마이드", "히알루론산", "쌀 추출물"],
      goodFor: ["건성 피부", "글래스 스킨", "칙칙함"],
    },
    {
      name: "시카 카밍 수딩 크림",
      imageType: "green-tea",
      benefits: ["진정", "장벽 케어", "수분 공급"],
      ingredients: ["시카", "판테놀", "세라마이드"],
      goodFor: ["민감성 피부", "붉은기", "건성 피부"],
    },
    {
      name: "오이 쿨링 토너",
      imageType: "cucumber",
      benefits: ["쿨링", "수분 공급", "진정"],
      ingredients: ["오이 추출물", "히알루론산", "알로에"],
      goodFor: ["지성 피부", "복합성 피부", "모공"],
    },
  ];
  const seed = fileName.length % presets.length;
  return { ...presets[seed], brand, photos: [] };
}
