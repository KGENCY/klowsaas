export interface PriceCalcInput {
  settlementKRW: number;
  exchangeRate: number;
  shippingUSD: number;
  paymentFeeRate: number;
}

export interface PriceCalcResult {
  settlementUSD: number;
  customerPriceUSD: number;
}

export function formatKRW(value: number): string {
  if (!Number.isFinite(value)) return "₩0";
  return `₩${Math.round(value).toLocaleString("ko-KR")}`;
}

export function formatUSD(value: number): string {
  if (!Number.isFinite(value)) return "$0.00";
  return `$${value.toFixed(2)}`;
}

export function convertKRWToUSD(krw: number, exchangeRate: number): number {
  if (!exchangeRate) return 0;
  return krw / exchangeRate;
}

export function calculateCustomerPriceUSD(input: PriceCalcInput): PriceCalcResult {
  const { settlementKRW, exchangeRate, shippingUSD, paymentFeeRate } = input;
  const settlementUSD = convertKRWToUSD(settlementKRW, exchangeRate);
  const customerPriceUSD = (settlementUSD + shippingUSD) / (1 - paymentFeeRate);
  return {
    settlementUSD: round2(settlementUSD),
    customerPriceUSD: round2(customerPriceUSD),
  };
}

export function round2(value: number): number {
  return Math.round(value * 100) / 100;
}

export function sanitizeSlug(input: string): string {
  return input
    .toLowerCase()
    .trim()
    .replace(/[\s_]+/g, "-")
    .replace(/[^a-z0-9-]/g, "")
    .replace(/-{2,}/g, "-")
    .replace(/^-+|-+$/g, "");
}

export function parseKRWInput(raw: string): number {
  const digits = raw.replace(/[^0-9]/g, "");
  if (!digits) return 0;
  return parseInt(digits, 10);
}
