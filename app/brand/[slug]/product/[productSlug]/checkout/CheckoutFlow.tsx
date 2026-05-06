"use client";

import Link from "next/link";
import { useEffect, useMemo, useRef, useState } from "react";
import {
  ArrowLeft,
  ArrowRight,
  Check,
  Lock,
  ShieldCheck,
  Sparkles,
  Truck,
} from "lucide-react";
import type { Product, ProductData } from "@/types";
import { flagEmoji, type Country } from "@/lib/countries";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { CountrySelector } from "@/components/consumer/CountrySelector";

interface Props {
  brand: ProductData;
  product: Product;
}

interface FormState {
  country: Country | null;
  email: string;
  fullName: string;
  postal: string;
  address1: string;
  address2: string;
  city: string;
  state: string;
}

const STEP_KEYS = ["country", "contact", "address", "city", "review"] as const;
type StepKey = (typeof STEP_KEYS)[number];

const initialForm: FormState = {
  country: null,
  email: "",
  fullName: "",
  postal: "",
  address1: "",
  address2: "",
  city: "",
  state: "",
};

const koreanCountryNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["ko"], { type: "region" })
    : null;

const countryNameOverrides: Record<string, string> = {
  US: "미국",
  GB: "영국",
  KR: "대한민국",
  AE: "아랍에미리트",
};

function countryLabel(country: Country) {
  return countryNameOverrides[country.code] ?? koreanCountryNames?.of(country.code) ?? country.name;
}

function isEmail(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value.trim());
}

function isValid(step: StepKey, form: FormState): boolean {
  switch (step) {
    case "country":
      return !!form.country;
    case "contact":
      return isEmail(form.email) && form.fullName.trim().length >= 2;
    case "address":
      return form.postal.trim().length >= 3 && form.address1.trim().length >= 4;
    case "city":
      return (
        form.city.trim().length >= 2 &&
        (!form.country?.needsState || form.state.trim().length >= 2)
      );
    case "review":
      return true;
  }
}

export function CheckoutFlow({ brand, product }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingStep, setEditingStep] = useState<StepKey | null>(null);
  const [paid, setPaid] = useState(false);
  const total = product.priceUSD;

  const frontier = useMemo<StepKey>(() => {
    for (const step of STEP_KEYS) {
      if (step === "review") return "review";
      if (!isValid(step, form)) return step;
    }
    return "review";
  }, [form]);

  const [committedFrontier, setCommittedFrontier] = useState<StepKey>(frontier);

  useEffect(() => {
    const liveIndex = STEP_KEYS.indexOf(frontier);
    const committedIndex = STEP_KEYS.indexOf(committedFrontier);
    if (liveIndex === committedIndex) return;
    if (liveIndex < committedIndex) {
      setCommittedFrontier(frontier);
      return;
    }
    const id = setTimeout(() => setCommittedFrontier(frontier), 550);
    return () => clearTimeout(id);
  }, [frontier, committedFrontier]);

  const activeStep = editingStep ?? committedFrontier;
  const sectionRefs = useRef<Record<StepKey, HTMLDivElement | null>>({
    country: null,
    contact: null,
    address: null,
    city: null,
    review: null,
  });

  const previousActive = useRef<StepKey>(activeStep);
  useEffect(() => {
    if (previousActive.current === activeStep) return;
    previousActive.current = activeStep;
    const element = sectionRefs.current[activeStep];
    if (!element) return;
    setTimeout(() => {
      const top = element.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
  }, [activeStep]);

  useEffect(() => {
    if (editingStep && isValid(editingStep, form)) {
      const id = setTimeout(() => setEditingStep(null), 280);
      return () => clearTimeout(id);
    }
  }, [editingStep, form]);

  const update = (patch: Partial<FormState>) =>
    setForm((current) => ({ ...current, ...patch }));

  if (paid) return <PaymentReady total={total} product={product} brand={brand} />;

  const renderUntilIndex = STEP_KEYS.indexOf(committedFrontier);

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
        <div className="text-[11px] font-bold tracking-[0.28em] text-ink">KLOW</div>
        <span className="inline-flex items-center gap-1 text-[11px] text-sub font-medium">
          <Lock className="w-[12px] h-[12px]" /> 안전 주문
        </span>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-5 pt-4">
        <section className="rounded-2xl bg-white border border-line p-3 flex items-center gap-3">
          <div className="w-[64px] h-[64px] flex-shrink-0">
            <ProductVisual size="sm" brandName={brand.brandName} />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] text-sub font-semibold tracking-wide truncate">
              {brand.brandName}
            </div>
            <div className="text-[13.5px] font-semibold text-ink leading-tight line-clamp-2">
              {product.name}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-ink">
                ${product.priceUSD.toFixed(2)}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9.5px] font-bold">
                무료배송 포함
              </span>
            </div>
          </div>
        </section>

        <div className="mt-6 space-y-3.5">
          <SectionCard
            innerRef={(element) => (sectionRefs.current.country = element)}
            stepNum={1}
            title="배송 국가"
            active={activeStep === "country"}
            complete={committedFrontier !== "country" && form.country !== null}
            onEdit={() => setEditingStep("country")}
            summary={
              form.country && (
                <span className="inline-flex items-center gap-2">
                  <span className="text-[18px] leading-none">
                    {flagEmoji(form.country.code)}
                  </span>
                  <span className="font-semibold text-ink">
                    {countryLabel(form.country)}
                  </span>
                </span>
              )
            }
          >
            <CountrySelector
              onSelect={(country) => {
                update({ country, state: country.needsState ? form.state : "" });
                setEditingStep(null);
              }}
            />
          </SectionCard>

          {renderUntilIndex >= 1 && (
            <TrustRow icon={<Truck className="w-[12px] h-[12px]" />}>
              전 세계 무료배송 포함 · 추가 비용 없음
            </TrustRow>
          )}

          {renderUntilIndex >= 1 && (
            <SectionCard
              innerRef={(element) => (sectionRefs.current.contact = element)}
              stepNum={2}
              title="연락처"
              active={activeStep === "contact"}
              complete={committedFrontier !== "contact" && isValid("contact", form)}
              onEdit={() => setEditingStep("contact")}
              summary={
                isValid("contact", form) && (
                  <span className="text-ink">
                    <span className="font-semibold">{form.fullName.trim()}</span>
                    <span className="mx-1.5 text-line">·</span>
                    <span className="text-sub">{form.email.trim()}</span>
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="이메일"
                  value={form.email}
                  onChange={(value) => update({ email: value })}
                  placeholder="you@email.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                />
                <Field
                  label="받는 분 이름"
                  value={form.fullName}
                  onChange={(value) => update({ fullName: value })}
                  placeholder="받는 분 성함"
                  autoComplete="name"
                />
              </div>
            </SectionCard>
          )}

          {renderUntilIndex >= 2 && (
            <SectionCard
              innerRef={(element) => (sectionRefs.current.address = element)}
              stepNum={3}
              title="주소"
              active={activeStep === "address"}
              complete={committedFrontier !== "address" && isValid("address", form)}
              onEdit={() => setEditingStep("address")}
              summary={
                isValid("address", form) && (
                  <span className="text-ink truncate block">
                    <span className="font-semibold">{form.postal.trim()}</span>
                    <span className="mx-1.5 text-line">·</span>
                    <span className="text-sub">
                      {form.address1.trim()}
                      {form.address2.trim() && `, ${form.address2.trim()}`}
                    </span>
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="우편번호"
                  value={form.postal}
                  onChange={(value) => update({ postal: value })}
                  placeholder="우편번호"
                  autoComplete="postal-code"
                  autoFocus
                />
                <Field
                  label="주소 1"
                  value={form.address1}
                  onChange={(value) => update({ address1: value })}
                  placeholder="도로명, 건물명"
                  autoComplete="address-line1"
                />
                <Field
                  label="주소 2"
                  optional
                  value={form.address2}
                  onChange={(value) => update({ address2: value })}
                  placeholder="동, 호수, 층수 등 선택 입력"
                  autoComplete="address-line2"
                />
              </div>
            </SectionCard>
          )}

          {renderUntilIndex >= 3 && (
            <TrustRow icon={<ShieldCheck className="w-[12px] h-[12px]" />}>
              한국 주소 없이 주문 가능 · 한국에서 발송
            </TrustRow>
          )}

          {renderUntilIndex >= 3 && (
            <SectionCard
              innerRef={(element) => (sectionRefs.current.city = element)}
              stepNum={4}
              title="도시"
              active={activeStep === "city"}
              complete={committedFrontier !== "city" && isValid("city", form)}
              onEdit={() => setEditingStep("city")}
              summary={
                isValid("city", form) && (
                  <span className="text-ink">
                    <span className="font-semibold">{form.city.trim()}</span>
                    {form.country?.needsState && form.state.trim() && (
                      <>
                        <span className="mx-1.5 text-line">·</span>
                        <span className="text-sub">{form.state.trim()}</span>
                      </>
                    )}
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="도시"
                  value={form.city}
                  onChange={(value) => update({ city: value })}
                  placeholder="도시"
                  autoComplete="address-level2"
                  autoFocus
                />
                {form.country?.needsState && (
                  <Field
                    label="주 / 지역"
                    value={form.state}
                    onChange={(value) => update({ state: value })}
                    placeholder="주 또는 지역"
                    autoComplete="address-level1"
                  />
                )}
              </div>
            </SectionCard>
          )}

          {renderUntilIndex >= 4 && (
            <ReviewCard
              innerRef={(element) => (sectionRefs.current.review = element)}
              product={product}
              total={total}
              form={form}
            />
          )}
        </div>
      </main>

      <StickyFooter
        total={total}
        canPay={committedFrontier === "review"}
        onPay={() => {
          setPaid(true);
          setTimeout(() => window.scrollTo({ top: 0, behavior: "smooth" }), 100);
        }}
      />
    </div>
  );
}

function SectionCard({
  innerRef,
  stepNum,
  title,
  active,
  complete,
  onEdit,
  summary,
  children,
}: {
  innerRef: (element: HTMLDivElement | null) => void;
  stepNum: number;
  title: string;
  active: boolean;
  complete: boolean;
  onEdit: () => void;
  summary?: React.ReactNode;
  children: React.ReactNode;
}) {
  if (complete && !active) {
    return (
      <div ref={innerRef} className="animate-fade-in">
        <button
          type="button"
          onClick={onEdit}
          className="w-full text-left rounded-2xl bg-white border border-line px-4 py-3 flex items-center gap-3 hover:border-ink transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-bg flex items-center justify-center flex-shrink-0">
            <Check className="w-[12px] h-[12px] text-ink" strokeWidth={3} />
          </span>
          <span className="flex-1 min-w-0 text-[13.5px] truncate">{summary}</span>
          <span className="text-[11.5px] font-semibold text-ink">수정</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={innerRef} className="animate-fade-in">
      <div className="rounded-2xl bg-white border border-line p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-bg text-ink text-[10.5px] font-bold">
            {stepNum}
          </span>
          <h2 className="text-[15px] font-bold tracking-tight text-ink">
            {title}
          </h2>
        </div>
        {children}
      </div>
    </div>
  );
}

function TrustRow({
  icon,
  children,
}: {
  icon: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <div className="flex justify-center animate-fade-in">
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-bg/60 border border-line text-ink text-[11px] font-semibold">
        {icon}
        {children}
      </span>
    </div>
  );
}

function Field({
  label,
  value,
  onChange,
  placeholder,
  type = "text",
  inputMode,
  autoComplete,
  optional,
  autoFocus,
}: {
  label: string;
  value: string;
  onChange: (value: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "email" | "numeric" | "tel" | "url" | "search";
  autoComplete?: string;
  optional?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold text-sub mb-1.5 px-1">
        {label}
        {optional && (
          <span className="ml-1 text-[10px] font-medium text-sub">
            선택 입력
          </span>
        )}
      </span>
      <input
        type={type}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className="w-full h-[48px] px-4 rounded-xl bg-bg border border-transparent focus:border-ink/40 focus:bg-white outline-none text-[14.5px] placeholder:text-sub transition-all"
      />
    </label>
  );
}

function ReviewCard({
  innerRef,
  product,
  total,
  form,
}: {
  innerRef: (element: HTMLDivElement | null) => void;
  product: Product;
  total: number;
  form: FormState;
}) {
  return (
    <div ref={innerRef} className="animate-fade-in">
      <div className="rounded-2xl bg-white border border-line p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-[14px] h-[14px] text-ink" />
          <h2 className="text-[15px] font-bold tracking-tight text-ink">
            주문 정보 확인
          </h2>
        </div>

        <div className="text-[12.5px] text-sub font-medium mb-3 truncate">
          {product.name}
        </div>

        <div className="space-y-2 text-[13.5px]">
          <div className="flex items-center justify-between">
            <span className="text-sub">상품 금액</span>
            <span className="font-semibold text-ink">
              ${product.priceUSD.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-sub inline-flex items-center gap-1.5">
              배송비
              <span className="px-1.5 py-0.5 rounded-full bg-emerald-50 text-emerald-700 text-[9.5px] font-bold">
                포함
              </span>
            </span>
            <span className="font-semibold text-ink">무료</span>
          </div>
        </div>

        <div className="my-4 h-px bg-line" />

        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-semibold text-sub">총 결제 금액</span>
          <span className="text-[24px] font-bold text-ink tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-bg border border-line p-3 space-y-1.5">
          <ReviewLine label="배송 국가">
            {form.country && (
              <>
                {flagEmoji(form.country.code)} {countryLabel(form.country)}
              </>
            )}
          </ReviewLine>
          <ReviewLine label="이메일">{form.email.trim()}</ReviewLine>
          <ReviewLine label="주소">
            {form.address1.trim()}
            {form.address2.trim() && `, ${form.address2.trim()}`}, {form.city.trim()}
            {form.state.trim() && ` ${form.state.trim()}`} {form.postal.trim()}
          </ReviewLine>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-[10.5px] text-sub font-medium">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-[10px] h-[10px]" /> 안전 주문
          </span>
          <span className="text-line">·</span>
          <span>추가 비용 없음</span>
          <span className="text-line">·</span>
          <span>한국에서 발송</span>
        </div>
      </div>
    </div>
  );
}

function ReviewLine({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex items-start gap-2 text-[12px]">
      <span className="w-[58px] flex-shrink-0 text-sub font-medium">
        {label}
      </span>
      <span className="flex-1 text-ink break-words leading-snug">
        {children}
      </span>
    </div>
  );
}

function StickyFooter({
  total,
  canPay,
  onPay,
}: {
  total: number;
  canPay: boolean;
  onPay: () => void;
}) {
  return (
    <div className="fixed bottom-0 inset-x-0 z-30">
      <div className="mx-auto w-full max-w-[430px] px-5 pb-[max(env(safe-area-inset-bottom),16px)] pt-3 bg-bg/95 backdrop-blur border-t border-line">
        {!canPay ? (
          <div className="rounded-2xl bg-white border border-line px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[10.5px] text-sub font-semibold">
                전 세계 무료배송 포함
              </div>
              <div className="text-[16px] font-bold text-ink tracking-tight">
                총 결제 금액 ${total.toFixed(2)}
              </div>
            </div>
            <span className="text-[11px] text-sub font-medium">
              아래 정보를 입력하세요
            </span>
          </div>
        ) : (
          <>
            <div className="text-center mb-2 text-[10.5px] text-sub font-medium">
              전 세계 무료배송 포함
            </div>
            <button
              onClick={onPay}
              className="w-full h-[58px] rounded-2xl bg-ink hover:opacity-90 text-white font-bold text-[16px] tracking-tight inline-flex items-center justify-center gap-2 transition-opacity active:scale-[0.99]"
            >
              결제 단계로 이동
              <span className="opacity-80">·</span>
              <span>${total.toFixed(2)}</span>
              <ArrowRight className="w-[16px] h-[16px]" strokeWidth={2.5} />
            </button>
          </>
        )}
      </div>
    </div>
  );
}

function PaymentReady({
  total,
  product,
  brand,
}: {
  total: number;
  product: Product;
  brand: ProductData;
}) {
  return (
    <div className="min-h-screen bg-bg">
      <main className="relative mx-auto w-full max-w-[430px] px-5 pt-20 pb-10 text-center">
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-bg mb-6 animate-pop">
          <Check className="w-8 h-8 text-ink" strokeWidth={3} />
        </div>
        <h1 className="text-[24px] font-bold tracking-tight text-ink">
          결제 준비가 완료되었습니다
        </h1>
        <p className="mt-2 text-[13.5px] text-sub leading-snug">
          결제 연동은 준비 중입니다.<br />
          입력하신 정보는 현재 세션에만 저장됩니다.
        </p>

        <div className="mt-8 rounded-2xl bg-white border border-line p-5 text-left">
          <div className="text-[11px] text-sub font-semibold tracking-wide">
            주문 상품
          </div>
          <div className="mt-1 text-[14px] font-semibold text-ink leading-tight">
            {product.name}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-[12px] text-sub">결제 예정 금액</span>
            <span className="text-[22px] font-bold text-ink">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 text-right text-[10.5px] text-sub">
            전 세계 무료배송 포함
          </div>
        </div>

        <Link
          href={`/brand/${brand.slug}`}
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-ink"
        >
          {brand.brandName}로 돌아가기
        </Link>
      </main>
    </div>
  );
}
