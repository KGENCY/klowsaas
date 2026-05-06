"use client";

import { useEffect, useState, type ReactNode } from "react";
import {
  ArrowUpRight,
  Copy,
  DollarSign,
  Globe2,
  Languages,
  PackageCheck,
  Plus,
  Send,
  Share2,
  Sparkles,
  Truck,
  Users,
} from "lucide-react";
import type { EditFocus, ProductData } from "@/types";
import { ProductVisual } from "@/components/ui/ProductVisual";
import { ConsumerPreview } from "./ConsumerPreview";
import { GridStorefront } from "./GridStorefront";
import { MockupUploadStage } from "./MockupUploadStage";
import { ShareModal } from "./ShareModal";

type AddStage = "idle" | "upload" | "analyzing";

interface Props {
  data: ProductData;
  draftProductId: string | null;
  editingProductId: string | null;
  addStage: AddStage;
  onEditProduct: (productId: string, focus: EditFocus) => void;
  onOpenProduct: (productId: string) => void;
  onAddProduct: () => void;
  onUploadFile: (file: File) => void;
  onManualStart: () => void;
  rightPanel?: ReactNode;
}

type ViewMode = "grid" | "detail" | "uploading";

export function GeneratedEditorStep({
  data,
  draftProductId,
  editingProductId,
  addStage,
  onEditProduct,
  onOpenProduct,
  onAddProduct,
  onUploadFile,
  onManualStart,
  rightPanel,
}: Props) {
  const [activeProductId, setActiveProductId] = useState<string>("");
  const [mode, setMode] = useState<ViewMode>("grid");
  const [shareOpen, setShareOpen] = useState(false);

  useEffect(() => {
    if (addStage !== "idle") {
      setMode("uploading");
      return;
    }
    if (draftProductId) {
      setActiveProductId(draftProductId);
      setMode("detail");
    } else if (editingProductId) {
      setActiveProductId(editingProductId);
      setMode("detail");
    } else {
      setMode("grid");
    }
  }, [draftProductId, editingProductId, addStage]);

  useEffect(() => {
    if (!data.products.find((p) => p.id === activeProductId)) {
      setActiveProductId(data.products[0]?.id ?? "");
    }
  }, [data.products, activeProductId]);

  const hasDraft = !!draftProductId;
  const isEditing = !!editingProductId && !hasDraft;
  const splitView = hasDraft || isEditing;
  const published = data.products.length > 0 && !hasDraft;

  return (
    <div className="pb-14">
      <div className="mx-auto max-w-[1180px] px-4 pt-6 sm:px-6 sm:pt-9 animate-fade-in">
        <div className="grid items-start gap-8 lg:grid-cols-[minmax(340px,440px)_minmax(0,1fr)] lg:gap-10">
          <section className="min-w-0">
            <StorefrontBar
              link={data.link}
              published={published}
              onCopy={() => setShareOpen(true)}
              onOpen={() => setShareOpen(true)}
            />
            <div className="relative flex justify-center">
              {published && (
                <div className="pointer-events-none absolute right-2 top-6 z-10 hidden rounded-full border border-emerald-100 bg-white px-3 py-1.5 text-[11px] font-bold text-emerald-700 shadow-card sm:flex items-center gap-1.5 animate-pulse-scale">
                  <span className="h-1.5 w-1.5 rounded-full bg-emerald-500" />
                  New order
                </div>
              )}
              {mode === "uploading" ? (
                <MockupUploadStage
                  brandName={data.brandName}
                  analyzing={addStage === "analyzing"}
                  productCount={data.products.length}
                  onFileSelected={onUploadFile}
                  onManual={onManualStart}
                />
              ) : mode === "grid" ? (
                <GridStorefront
                  brandName={data.brandName}
                  category={data.category}
                  products={data.products}
                  onOpenProduct={onOpenProduct}
                  onEdit={onEditProduct}
                  onAddProduct={onAddProduct}
                />
              ) : (
                <ConsumerPreview
                  brandName={data.brandName}
                  products={data.products}
                  activeProductId={activeProductId}
                  onSwitchProduct={setActiveProductId}
                  onEdit={onEditProduct}
                  isDraft={hasDraft}
                />
              )}
            </div>
          </section>

          <aside className="min-w-0">
            {splitView && rightPanel ? (
              <div className="w-full">{rightPanel}</div>
            ) : data.products.length === 0 ? (
              <FirstTimeLaunchpad
                onAddProduct={onAddProduct}
                onPreview={() => setShareOpen(true)}
              />
            ) : (
              <DashboardPanels
                onAddProduct={onAddProduct}
                onShare={() => setShareOpen(true)}
              />
            )}
          </aside>
        </div>
      </div>

      <ShareModal open={shareOpen} link={data.link} onClose={() => setShareOpen(false)} />
    </div>
  );
}

function StorefrontBar({
  link,
  published,
  onCopy,
  onOpen,
}: {
  link: string;
  published: boolean;
  onCopy: () => void;
  onOpen: () => void;
}) {
  return (
    <div className="mx-auto mb-3 flex w-full max-w-[380px] items-center gap-2">
      <div className="flex min-w-0 flex-1 items-center gap-2 rounded-2xl border border-line bg-white px-3 h-11 shadow-card">
        <Globe2 className="h-3.5 w-3.5 flex-shrink-0 text-ink" />
        <span className="truncate text-[12.5px] font-bold text-ink">{link}</span>
        <span
          className={`ml-auto flex-shrink-0 rounded-full px-2 py-1 text-[10px] font-black ${
            published ? "bg-emerald-50 text-emerald-700" : "bg-bg text-sub"
          }`}
        >
          {published ? "Published" : "Draft"}
        </span>
      </div>
      <button
        type="button"
        onClick={onCopy}
        aria-label="링크 복사"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl border border-line bg-white text-ink shadow-card hover:border-ink/30 transition-colors"
      >
        <Copy className="h-4 w-4" />
      </button>
      <button
        type="button"
        onClick={onOpen}
        aria-label="스토어 열기"
        className="flex h-11 w-11 flex-shrink-0 items-center justify-center rounded-2xl bg-ink text-white shadow-card hover:opacity-90 transition-opacity"
      >
        <ArrowUpRight className="h-4 w-4" />
      </button>
    </div>
  );
}

function DashboardPanels({
  onAddProduct,
  onShare,
}: {
  onAddProduct: () => void;
  onShare: () => void;
}) {
  return (
    <div className="space-y-4">
      <Panel title="오늘의 글로벌 판매 현황">
        <div className="grid grid-cols-2 gap-2.5">
          <StatusCard icon={<PackageCheck />} label="Today Orders" value="오늘 주문 3건" />
          <StatusCard icon={<DollarSign />} label="Today Revenue" value="오늘 매출 $148" />
          <StatusCard icon={<Truck />} label="Pending Shipment" value="발송 대기 2건" />
          <StatusCard icon={<Users />} label="Creator Requests" value="시딩 진행 1건" />
        </div>
      </Panel>

      <Panel title="최근 주문" action="주문표 출력">
        <div className="space-y-2.5">
          {orders.map((order) => (
            <div key={order.id} className="flex items-center gap-3 rounded-2xl border border-line bg-white p-2.5">
              <div className="h-12 w-12 flex-shrink-0 overflow-hidden rounded-xl bg-bg">
                <ProductVisual size="sm" imageType={order.imageType} brandName="KLOW" />
              </div>
              <div className="min-w-0 flex-1">
                <div className="flex items-center gap-1.5 text-[11px] font-bold text-sub">
                  <span>{order.flag}</span>
                  <span>{order.country}</span>
                </div>
                <div className="mt-0.5 truncate text-[13px] font-bold text-ink">
                  {order.product}
                </div>
              </div>
              <div className="text-right">
                <div className="text-[13px] font-black text-ink">{order.amount}</div>
                <div className="mt-0.5 text-[10.5px] font-semibold text-sub">
                  {order.status}
                </div>
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="정산 예정 금액" action="정산 내역 보기">
        <div className="rounded-2xl bg-bg px-4 py-4">
          <div className="text-[30px] font-black tracking-tight text-ink">₩1,248,000</div>
          <div className="mt-1 text-[13px] font-semibold text-sub">이번 달 예상 정산 금액</div>
          <div className="mt-3 text-[12px] font-semibold text-ink/75">
            다음 정산 예정일: 5월 15일
          </div>
        </div>
      </Panel>

      <Panel title="글로벌 노출 & 시딩" action="크리에이터 보기">
        <div className="grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {creators.map((creator) => (
            <div key={creator.name} className="rounded-2xl border border-line bg-white p-3">
              <div className="flex items-center justify-between gap-2">
                <div className="text-[13px] font-black text-ink">{creator.name}</div>
                <span className="rounded-full bg-bg px-2 py-1 text-[10px] font-bold text-sub">
                  {creator.status}
                </span>
              </div>
              <div className="mt-1 text-[11.5px] font-semibold leading-[1.45] text-sub">
                {creator.region}
                <br />
                {creator.tag}
              </div>
            </div>
          ))}
        </div>
      </Panel>

      <Panel title="빠른 작업">
        <div className="grid grid-cols-2 gap-2.5 sm:grid-cols-4 lg:grid-cols-2 xl:grid-cols-4">
          <QuickAction icon={<Plus />} label="상품 추가" onClick={onAddProduct} />
          <QuickAction icon={<Share2 />} label="스토어 공유" onClick={onShare} />
          <QuickAction icon={<Send />} label="시딩 요청" />
          <QuickAction icon={<Sparkles />} label="주문 확인" />
        </div>
      </Panel>
    </div>
  );
}

function FirstTimeLaunchpad({
  onAddProduct,
  onPreview,
}: {
  onAddProduct: () => void;
  onPreview: () => void;
}) {
  return (
    <div className="space-y-4">
      <section className="relative overflow-hidden rounded-[28px] border border-line bg-white p-6 shadow-card">
        <span className="absolute right-7 top-7 h-16 w-16 rounded-full bg-emerald-100/60 blur-2xl" />
        <div className="relative">
          <div className="flex h-11 w-11 items-center justify-center rounded-2xl bg-ink text-white shadow-card animate-pulse-scale">
            <Sparkles className="h-5 w-5" />
          </div>
          <h1 className="mt-5 text-[25px] font-black leading-[1.22] tracking-tight text-ink sm:text-[30px]">
            당신의 글로벌 스토어가 준비되었습니다
          </h1>
          <p className="mt-3 text-[15px] leading-[1.65] text-sub">
            이제 첫 상품만 등록하면
            <br />
            전 세계 고객이 브랜드를 발견할 수 있어요.
          </p>

          <div className="mt-5 flex flex-wrap gap-2">
            <ReadyPill icon={<Globe2 />} label="180개국 결제" />
            <ReadyPill icon={<Languages />} label="자동 번역" />
            <ReadyPill icon={<Truck />} label="전세계 배송 지원" />
          </div>

          <div className="mt-7 flex flex-col gap-2 sm:flex-row">
            <button
              type="button"
              onClick={onAddProduct}
              className="flex h-12 flex-1 items-center justify-center gap-2 rounded-2xl bg-ink text-[14px] font-black text-white shadow-card transition-opacity hover:opacity-90"
            >
              <Plus className="h-4 w-4" />
              첫 상품 등록하기
            </button>
            <button
              type="button"
              onClick={onPreview}
              className="flex h-12 flex-1 items-center justify-center rounded-2xl border border-line bg-white text-[14px] font-black text-ink transition-colors hover:border-ink/25 hover:bg-bg"
            >
              스토어 미리보기
            </button>
          </div>
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-white/85 p-4 shadow-card">
        <h2 className="text-[15px] font-black tracking-tight text-ink">
          KLOW는 이렇게 진행돼요
        </h2>
        <div className="mt-3 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          <StepCard step="Step 1" title="상품 등록" body="상세페이지 파일만 올리면 끝." />
          <StepCard step="Step 2" title="글로벌 페이지 생성" body="KLOW가 판매 페이지를 자동 구성해요." />
          <StepCard step="Step 3" title="주문 & 글로벌 배송" body="주문이 들어오면 배송만 준비하면 됩니다." />
        </div>
      </section>

      <section className="rounded-[24px] border border-line bg-white/85 p-4 shadow-card">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h2 className="text-[15px] font-black leading-[1.35] tracking-tight text-ink">
              원한다면 글로벌 크리에이터에게 제품을 소개할 수도 있어요
            </h2>
            <p className="mt-2 text-[13px] leading-[1.55] text-sub">
              KLOW가 활동 중인 글로벌 크리에이터와 연결을 도와드려요.
            </p>
          </div>
        </div>
        <div className="mt-4 grid gap-2.5 sm:grid-cols-3 lg:grid-cols-1 xl:grid-cols-3">
          {creatorPreviews.map((creator) => (
            <div key={creator.name} className="rounded-2xl border border-line bg-white p-3">
              <div className={`flex h-12 w-12 items-center justify-center rounded-2xl border text-[15px] font-black ${creator.tone}`}>
                {creator.name.slice(0, 2)}
              </div>
              <div className="mt-3 text-[13px] font-black text-ink">{creator.name}</div>
              <div className="mt-1 text-[11.5px] font-semibold leading-[1.45] text-sub">
                {creator.region}
                <br />
                {creator.focus}
              </div>
            </div>
          ))}
        </div>
        <button className="mt-3 h-10 rounded-2xl border border-line bg-white px-4 text-[12.5px] font-black text-ink transition-colors hover:border-ink/25 hover:bg-bg">
          크리에이터 둘러보기
        </button>
      </section>

      <section className="rounded-[24px] border border-line bg-[#F7FAF8] p-4 shadow-card">
        <h2 className="text-[15px] font-black tracking-tight text-ink">
          처음엔 베스트셀러 제품 하나만 등록해보세요
        </h2>
        <p className="mt-2 text-[13px] leading-[1.6] text-sub">
          대표 제품 하나만 등록해도 글로벌 반응을 빠르게 확인할 수 있어요.
        </p>
        <div className="mt-3 flex flex-wrap gap-2">
          {["진정 크림", "수분 세럼", "클렌저"].map((item) => (
            <span
              key={item}
              className="rounded-full border border-line bg-white px-3 py-1.5 text-[12px] font-bold text-ink"
            >
              {item}
            </span>
          ))}
        </div>
      </section>
    </div>
  );
}

function ReadyPill({ icon, label }: { icon: ReactNode; label: string }) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full border border-line bg-bg px-3 py-1.5 text-[12px] font-bold text-ink">
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {label}
    </span>
  );
}

function StepCard({
  step,
  title,
  body,
}: {
  step: string;
  title: string;
  body: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3.5">
      <div className="text-[10px] font-black uppercase text-sub">{step}</div>
      <div className="mt-2 text-[14px] font-black text-ink">{title}</div>
      <div className="mt-1 text-[12px] font-semibold leading-[1.45] text-sub">
        {body}
      </div>
    </div>
  );
}

function Panel({
  title,
  action,
  children,
}: {
  title: string;
  action?: string;
  children: ReactNode;
}) {
  return (
    <section className="rounded-[24px] border border-line bg-white/80 p-4 shadow-card backdrop-blur">
      <div className="mb-3 flex items-center justify-between gap-3">
        <h2 className="text-[15px] font-black tracking-tight text-ink">{title}</h2>
        {action && (
          <button className="text-[12px] font-bold text-sub hover:text-ink transition-colors">
            {action}
          </button>
        )}
      </div>
      {children}
    </section>
  );
}

function StatusCard({
  icon,
  label,
  value,
}: {
  icon: ReactNode;
  label: string;
  value: string;
}) {
  return (
    <div className="rounded-2xl border border-line bg-white p-3">
      <div className="flex items-center gap-2 text-sub">
        <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
        <span className="truncate text-[10px] font-black uppercase">{label}</span>
      </div>
      <div className="mt-2 text-[14px] font-black text-ink">{value}</div>
    </div>
  );
}

function QuickAction({
  icon,
  label,
  onClick,
}: {
  icon: ReactNode;
  label: string;
  onClick?: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className="flex h-12 items-center justify-center gap-1.5 rounded-2xl border border-line bg-white text-[12.5px] font-black text-ink hover:border-ink/25 hover:bg-bg transition-colors"
    >
      <span className="[&>svg]:h-3.5 [&>svg]:w-3.5">{icon}</span>
      {label}
    </button>
  );
}

const orders = [
  {
    id: "o1",
    flag: "🇺🇸",
    country: "USA",
    product: "Supergen Triple Cream",
    amount: "$49.67",
    status: "Preparing Shipment",
    imageType: "custom" as const,
  },
  {
    id: "o2",
    flag: "🇨🇦",
    country: "Canada",
    product: "Glow Daily Serum",
    amount: "$38.20",
    status: "Paid",
    imageType: "rice" as const,
  },
  {
    id: "o3",
    flag: "🇸🇬",
    country: "Singapore",
    product: "Cica Calming Cream",
    amount: "$60.12",
    status: "Label Ready",
    imageType: "green-tea" as const,
  },
];

const creators = [
  {
    name: "YEONSEUL",
    region: "USA / Canada audience",
    tag: "Sensitive Skin",
    status: "Proposal Sent",
  },
  {
    name: "Lina",
    region: "Europe audience",
    tag: "Clean Beauty",
    status: "Recommended",
  },
  {
    name: "Mina",
    region: "SEA audience",
    tag: "K-Beauty Review",
    status: "Pending",
  },
];

const creatorPreviews = [
  {
    name: "YEONSEUL",
    region: "USA / Canada",
    focus: "Sensitive Skin",
    tone: "bg-rose-50 text-rose-700 border-rose-100",
  },
  {
    name: "Lina",
    region: "Europe",
    focus: "Clean Beauty",
    tone: "bg-emerald-50 text-emerald-700 border-emerald-100",
  },
  {
    name: "Mina",
    region: "SEA",
    focus: "K-Beauty Review",
    tone: "bg-sky-50 text-sky-700 border-sky-100",
  },
];
