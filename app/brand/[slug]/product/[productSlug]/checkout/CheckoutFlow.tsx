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
import { FLAT_SHIPPING_USD } from "@/lib/brandStore";
import { flagEmoji, type Country } from "@/lib/countries";
import { ProductVisual } from "@/components/ProductVisual";
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

function isEmail(v: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v.trim());
}

function isValid(step: StepKey, f: FormState): boolean {
  switch (step) {
    case "country":
      return !!f.country;
    case "contact":
      return isEmail(f.email) && f.fullName.trim().length >= 2;
    case "address":
      return f.postal.trim().length >= 3 && f.address1.trim().length >= 4;
    case "city": {
      if (f.city.trim().length < 2) return false;
      if (f.country?.needsState && f.state.trim().length < 2) return false;
      return true;
    }
    case "review":
      return true;
  }
}

export function CheckoutFlow({ brand, product }: Props) {
  const [form, setForm] = useState<FormState>(initialForm);
  const [editingStep, setEditingStep] = useState<StepKey | null>(null);
  const [paid, setPaid] = useState(false);

  const total = product.priceUSD + FLAT_SHIPPING_USD;

  // Frontier = first step that isn't valid
  const frontier = useMemo<StepKey>(() => {
    for (const s of STEP_KEYS) {
      if (s === "review") return "review";
      if (!isValid(s, form)) return s;
    }
    return "review";
  }, [form]);

  // Debounce forward advancement so the next section doesn't appear mid-typing.
  // Backward moves (user clears a field) apply immediately to keep state honest.
  const [committedFrontier, setCommittedFrontier] = useState<StepKey>(frontier);
  useEffect(() => {
    const liveIdx = STEP_KEYS.indexOf(frontier);
    const committedIdx = STEP_KEYS.indexOf(committedFrontier);
    if (liveIdx === committedIdx) return;
    if (liveIdx < committedIdx) {
      setCommittedFrontier(frontier);
      return;
    }
    const id = setTimeout(() => setCommittedFrontier(frontier), 550);
    return () => clearTimeout(id);
  }, [frontier, committedFrontier]);

  const activeStep: StepKey = editingStep ?? committedFrontier;

  // Refs for scrollIntoView on step change
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
    const el = sectionRefs.current[activeStep];
    if (!el) return;
    setTimeout(() => {
      const top = el.getBoundingClientRect().top + window.scrollY - 88;
      window.scrollTo({ top, behavior: "smooth" });
    }, 80);
  }, [activeStep]);

  // Auto-collapse when an "editing" section becomes valid again
  useEffect(() => {
    if (editingStep && isValid(editingStep, form)) {
      const id = setTimeout(() => setEditingStep(null), 280);
      return () => clearTimeout(id);
    }
  }, [editingStep, form]);

  const update = (patch: Partial<FormState>) =>
    setForm((f) => ({ ...f, ...patch }));

  const handleEdit = (step: StepKey) => setEditingStep(step);

  const goPay = () => {
    setPaid(true);
    setTimeout(() => {
      window.scrollTo({ top: 0, behavior: "smooth" });
    }, 100);
  };

  if (paid) return <PaymentReady total={total} product={product} brand={brand} />;

  // Which steps to render: committed frontier and any earlier ones
  const renderUntilIndex = STEP_KEYS.indexOf(committedFrontier);

  return (
    <div className="min-h-screen bg-bg pb-[120px]">
      {/* Top bar */}
      <header className="relative mx-auto w-full max-w-[430px] px-5 pt-5 flex items-center justify-between">
        <Link
          href={`/brand/${brand.slug}`}
          className="inline-flex items-center justify-center w-10 h-10 -ml-2 rounded-full hover:bg-white/60 transition-colors"
          aria-label="Back to brand"
        >
          <ArrowLeft className="w-[18px] h-[18px] text-[#0F0F14]" />
        </Link>
        <div className="text-[11px] font-bold tracking-[0.28em] text-[#0F0F14]">
          KLOW
        </div>
        <span className="inline-flex items-center gap-1 text-[11px] text-[#6B7280] font-medium">
          <Lock className="w-[12px] h-[12px]" /> Secure
        </span>
      </header>

      <main className="relative mx-auto w-full max-w-[430px] px-5 pt-4">
        {/* Product mini summary */}
        <section className="rounded-2xl bg-white border border-[#ECECF1] p-3 flex items-center gap-3">
          <div className="w-[64px] h-[64px] flex-shrink-0">
            <ProductVisual
              type={product.imageType}
              size="sm"
              brandName={brand.brandName}
            />
          </div>
          <div className="flex-1 min-w-0">
            <div className="text-[10.5px] text-[#6B7280] font-semibold tracking-wide truncate">
              {brand.brandName}
            </div>
            <div className="text-[13.5px] font-semibold text-[#0F0F14] leading-tight line-clamp-2">
              {product.name}
            </div>
            <div className="mt-1.5 inline-flex items-center gap-1.5">
              <span className="text-[14px] font-bold text-[#0F0F14]">
                ${product.priceUSD.toFixed(2)}
              </span>
              <span className="px-1.5 py-0.5 rounded-full bg-[#FAFAFC] text-[#0F0F14] text-[9.5px] font-bold">
                +${FLAT_SHIPPING_USD} ships
              </span>
            </div>
          </div>
        </section>

        {/* Section stack */}
        <div className="mt-6 space-y-3.5">
          {/* COUNTRY */}
          <SectionCard
            innerRef={(el) => (sectionRefs.current.country = el)}
            stepNum={1}
            title="Where to?"
            active={activeStep === "country"}
            complete={committedFrontier !== "country" && form.country !== null}
            onEdit={() => handleEdit("country")}
            summary={
              form.country && (
                <span className="inline-flex items-center gap-2">
                  <span className="text-[18px] leading-none">
                    {flagEmoji(form.country.code)}
                  </span>
                  <span className="font-semibold text-[#0F0F14]">
                    {form.country.name}
                  </span>
                </span>
              )
            }
          >
            <CountrySelector
              onSelect={(c) => {
                update({ country: c, state: c.needsState ? form.state : "" });
                setEditingStep(null);
              }}
            />
          </SectionCard>

          {/* Trust pill between country and contact */}
          {renderUntilIndex >= 1 && (
            <TrustRow icon={<Truck className="w-[12px] h-[12px]" />}>
              Special global shipping rate · No surprise fees
            </TrustRow>
          )}

          {/* CONTACT */}
          {renderUntilIndex >= 1 && (
            <SectionCard
              innerRef={(el) => (sectionRefs.current.contact = el)}
              stepNum={2}
              title="Contact"
              active={activeStep === "contact"}
              complete={committedFrontier !== "contact" && isValid("contact", form)}
              onEdit={() => handleEdit("contact")}
              summary={
                isValid("contact", form) && (
                  <span className="text-[#0F0F14]">
                    <span className="font-semibold">{form.fullName.trim()}</span>
                    <span className="mx-1.5 text-[#ECECF1]">·</span>
                    <span className="text-[#6B7280]">{form.email.trim()}</span>
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="Email"
                  value={form.email}
                  onChange={(v) => update({ email: v })}
                  placeholder="you@email.com"
                  type="email"
                  inputMode="email"
                  autoComplete="email"
                  autoFocus
                />
                <Field
                  label="Full name"
                  value={form.fullName}
                  onChange={(v) => update({ fullName: v })}
                  placeholder="Your full name"
                  autoComplete="name"
                />
              </div>
            </SectionCard>
          )}

          {/* ADDRESS */}
          {renderUntilIndex >= 2 && (
            <SectionCard
              innerRef={(el) => (sectionRefs.current.address = el)}
              stepNum={3}
              title="Address"
              active={activeStep === "address"}
              complete={committedFrontier !== "address" && isValid("address", form)}
              onEdit={() => handleEdit("address")}
              summary={
                isValid("address", form) && (
                  <span className="text-[#0F0F14] truncate block">
                    <span className="font-semibold">{form.postal.trim()}</span>
                    <span className="mx-1.5 text-[#ECECF1]">·</span>
                    <span className="text-[#6B7280]">
                      {form.address1.trim()}
                      {form.address2.trim() && `, ${form.address2.trim()}`}
                    </span>
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="Postal code"
                  value={form.postal}
                  onChange={(v) => update({ postal: v })}
                  placeholder="ZIP / postal code"
                  autoComplete="postal-code"
                  autoFocus
                />
                <Field
                  label="Address line 1"
                  value={form.address1}
                  onChange={(v) => update({ address1: v })}
                  placeholder="Street, building"
                  autoComplete="address-line1"
                />
                <Field
                  label="Address line 2"
                  optional
                  value={form.address2}
                  onChange={(v) => update({ address2: v })}
                  placeholder="Apt, unit, floor (optional)"
                  autoComplete="address-line2"
                />
              </div>
            </SectionCard>
          )}

          {renderUntilIndex >= 3 && (
            <TrustRow icon={<ShieldCheck className="w-[12px] h-[12px]" />}>
              No Korean address needed · Ships from Korea
            </TrustRow>
          )}

          {/* CITY */}
          {renderUntilIndex >= 3 && (
            <SectionCard
              innerRef={(el) => (sectionRefs.current.city = el)}
              stepNum={4}
              title="City"
              active={activeStep === "city"}
              complete={committedFrontier !== "city" && isValid("city", form)}
              onEdit={() => handleEdit("city")}
              summary={
                isValid("city", form) && (
                  <span className="text-[#0F0F14]">
                    <span className="font-semibold">{form.city.trim()}</span>
                    {form.country?.needsState && form.state.trim() && (
                      <>
                        <span className="mx-1.5 text-[#ECECF1]">·</span>
                        <span className="text-[#6B7280]">{form.state.trim()}</span>
                      </>
                    )}
                  </span>
                )
              }
            >
              <div className="space-y-2.5">
                <Field
                  label="City"
                  value={form.city}
                  onChange={(v) => update({ city: v })}
                  placeholder="City"
                  autoComplete="address-level2"
                  autoFocus
                />
                {form.country?.needsState && (
                  <Field
                    label="State / Province"
                    value={form.state}
                    onChange={(v) => update({ state: v })}
                    placeholder="State or province"
                    autoComplete="address-level1"
                  />
                )}
              </div>
            </SectionCard>
          )}

          {/* REVIEW */}
          {renderUntilIndex >= 4 && (
            <ReviewCard
              innerRef={(el) => (sectionRefs.current.review = el)}
              product={product}
              total={total}
              form={form}
            />
          )}
        </div>
      </main>

      {/* Sticky bottom */}
      <StickyFooter
        total={total}
        canPay={committedFrontier === "review"}
        onPay={goPay}
      />
    </div>
  );
}

/* ------------------------------- subcomponents ------------------------------ */

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
  innerRef: (el: HTMLDivElement | null) => void;
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
          className="w-full text-left rounded-2xl bg-white border border-[#ECECF1] px-4 py-3 flex items-center gap-3 hover:border-[#0F0F14] transition-colors"
        >
          <span className="w-6 h-6 rounded-full bg-[#FAFAFC] flex items-center justify-center flex-shrink-0">
            <Check className="w-[12px] h-[12px] text-[#0F0F14]" strokeWidth={3} />
          </span>
          <span className="flex-1 min-w-0 text-[13.5px] truncate">{summary}</span>
          <span className="text-[11.5px] font-semibold text-[#0F0F14]">Change</span>
        </button>
      </div>
    );
  }

  return (
    <div ref={innerRef} className="animate-fade-in">
      <div className="rounded-2xl bg-white border border-[#ECECF1] p-5">
        <div className="flex items-center gap-2 mb-4">
          <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-[#FAFAFC] text-[#0F0F14] text-[10.5px] font-bold">
            {stepNum}
          </span>
          <h2 className="text-[15px] font-bold tracking-tight text-[#0F0F14]">
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
      <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-full bg-[#FAFAFC]/60 border border-[#ECECF1] text-[#0F0F14] text-[11px] font-semibold">
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
  onChange: (v: string) => void;
  placeholder?: string;
  type?: string;
  inputMode?: "text" | "email" | "numeric" | "tel" | "url" | "search";
  autoComplete?: string;
  optional?: boolean;
  autoFocus?: boolean;
}) {
  return (
    <label className="block">
      <span className="block text-[11.5px] font-semibold text-[#6B7280] mb-1.5 px-1">
        {label}
        {optional && (
          <span className="ml-1 text-[10px] font-medium text-[#6B7280]">
            optional
          </span>
        )}
      </span>
      <input
        type={type}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        inputMode={inputMode}
        autoComplete={autoComplete}
        autoFocus={autoFocus}
        className="w-full h-[48px] px-4 rounded-xl bg-[#FAFAFC] border border-transparent focus:border-[#0F0F14]/40 focus:bg-white outline-none text-[14.5px] placeholder:text-[#6B7280] transition-all"
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
  innerRef: (el: HTMLDivElement | null) => void;
  product: Product;
  total: number;
  form: FormState;
}) {
  return (
    <div ref={innerRef} className="animate-fade-in">
      <div className="rounded-2xl bg-white border border-[#ECECF1] p-5">
        <div className="flex items-center gap-2 mb-4">
          <Sparkles className="w-[14px] h-[14px] text-[#0F0F14]" />
          <h2 className="text-[15px] font-bold tracking-tight text-[#0F0F14]">
            Review
          </h2>
        </div>

        <div className="text-[12.5px] text-[#6B7280] font-medium mb-3 truncate">
          {product.name}
        </div>

        <div className="space-y-2 text-[13.5px]">
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280]">Product</span>
            <span className="font-semibold text-[#0F0F14]">
              ${product.priceUSD.toFixed(2)}
            </span>
          </div>
          <div className="flex items-center justify-between">
            <span className="text-[#6B7280] inline-flex items-center gap-1.5">
              Shipping
              <span className="px-1.5 py-0.5 rounded-full bg-[#FAFAFC] text-[#0F0F14] text-[9.5px] font-bold">
                Special rate
              </span>
            </span>
            <span className="font-semibold text-[#0F0F14]">
              ${FLAT_SHIPPING_USD.toFixed(2)}
            </span>
          </div>
        </div>

        <div className="my-4 h-px bg-[#ECECF1]" />

        <div className="flex items-baseline justify-between">
          <span className="text-[13px] font-semibold text-[#6B7280]">Total</span>
          <span className="text-[24px] font-bold text-[#0F0F14] tracking-tight">
            ${total.toFixed(2)}
          </span>
        </div>

        <div className="mt-5 rounded-xl bg-[#FAFAFC] border border-[#ECECF1] p-3 space-y-1.5">
          <ReviewLine label="Ship to">
            {form.country && (
              <>
                {flagEmoji(form.country.code)} {form.country.name}
              </>
            )}
          </ReviewLine>
          <ReviewLine label="Email">{form.email.trim()}</ReviewLine>
          <ReviewLine label="Address">
            {form.address1.trim()}
            {form.address2.trim() && `, ${form.address2.trim()}`}, {form.city.trim()}
            {form.state.trim() && ` ${form.state.trim()}`} {form.postal.trim()}
          </ReviewLine>
        </div>

        <div className="mt-4 flex items-center justify-center gap-3 text-[10.5px] text-[#6B7280] font-medium">
          <span className="inline-flex items-center gap-1">
            <Lock className="w-[10px] h-[10px]" /> Secure
          </span>
          <span className="text-[#ECECF1]">·</span>
          <span>No surprise fees</span>
          <span className="text-[#ECECF1]">·</span>
          <span>Ships from Korea</span>
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
      <span className="w-[58px] flex-shrink-0 text-[#6B7280] font-medium">
        {label}
      </span>
      <span className="flex-1 text-[#0F0F14] break-words leading-snug">
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
          <div className="rounded-2xl bg-white border border-[#ECECF1] px-4 py-3 flex items-center justify-between">
            <div>
              <div className="text-[10.5px] text-[#6B7280] font-semibold">
                Flat $15 shipping included
              </div>
              <div className="text-[16px] font-bold text-[#0F0F14] tracking-tight">
                Total ${total.toFixed(2)}
              </div>
            </div>
            <span className="text-[11px] text-[#6B7280] font-medium">
              Continue below ↓
            </span>
          </div>
        ) : (
          <>
            <div className="text-center mb-2 text-[10.5px] text-[#6B7280] font-medium">
              Flat $15 shipping included
            </div>
            <button
              onClick={onPay}
              className="w-full h-[58px] rounded-2xl bg-ink hover:opacity-90 text-white font-bold text-[16px] tracking-tight inline-flex items-center justify-center gap-2 transition-opacity active:scale-[0.99]"
            >
              Continue to payment
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
        <div className="inline-flex items-center justify-center w-16 h-16 rounded-full bg-[#FAFAFC] mb-6 animate-pop">
          <Check className="w-8 h-8 text-[#0F0F14]" strokeWidth={3} />
        </div>
        <h1 className="text-[24px] font-bold tracking-tight text-[#0F0F14]">
          Ready for payment
        </h1>
        <p className="mt-2 text-[13.5px] text-[#6B7280] leading-snug">
          Payment integration coming soon.<br />Your details are saved for this session.
        </p>

        <div className="mt-8 rounded-2xl bg-white border border-[#ECECF1] p-5 text-left">
          <div className="text-[11px] text-[#6B7280] font-semibold tracking-wide uppercase">
            Order
          </div>
          <div className="mt-1 text-[14px] font-semibold text-[#0F0F14] leading-tight">
            {product.name}
          </div>
          <div className="mt-4 flex items-baseline justify-between">
            <span className="text-[12px] text-[#6B7280]">Total charged</span>
            <span className="text-[22px] font-bold text-[#0F0F14]">
              ${total.toFixed(2)}
            </span>
          </div>
          <div className="mt-1 text-right text-[10.5px] text-[#6B7280]">
            Flat $15 shipping included
          </div>
        </div>

        <Link
          href={`/brand/${brand.slug}`}
          className="mt-8 inline-flex items-center gap-1.5 text-[13px] font-semibold text-[#0F0F14]"
        >
          ← Back to {brand.brandName}
        </Link>
      </main>
    </div>
  );
}
