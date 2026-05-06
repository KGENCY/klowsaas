"use client";

import { useMemo, useState } from "react";
import Link from "next/link";
import {
  ArrowLeft,
  Check,
  ChevronDown,
  Globe2,
  Languages,
  Lock,
  Play,
  Send,
  ShieldCheck,
  Sparkles,
  X,
} from "lucide-react";

const creator = {
  name: "YEONSEUL",
  handle: "@yeonseul.glow",
  oneLine: "민감성 피부 고객을 위해 솔직한 K-뷰티 사용 후기를 만드는 크리에이터",
  location: "한국 거주 · 미국 / 캐나다 중심 도달",
  languages: "영어 / 한국어",
  followers: "4.82만",
  tags: ["민감성 피부", "K-뷰티", "클린뷰티", "루틴 리뷰"],
  proof: [
    { value: "4.82만", label: "팔로워" },
    { value: "180만+", label: "누적 조회수" },
    { value: "2.2만+", label: "평균 릴스 조회수" },
    { value: "6.8%", label: "평균 반응률" },
  ],
  videos: [
    {
      title: "끝까지 사용한 한국 보습 크림 3가지",
      platform: "인스타그램 릴스",
      views: "14.2만 조회",
      tone: "from-rose-100 via-stone-50 to-violet-100",
    },
    {
      title: "한국에서 쓰는 민감성 피부 루틴",
      platform: "틱톡",
      views: "8.6만 조회",
      tone: "from-emerald-100 via-white to-cyan-100",
    },
    {
      title: "계속 재구매한 장벽 크림 후기",
      platform: "유튜브 쇼츠",
      views: "5.4만 조회",
      tone: "from-amber-100 via-white to-pink-100",
    },
  ],
  audienceCountries: [
    { name: "미국", value: "42%" },
    { name: "캐나다", value: "18%" },
    { name: "한국", value: "16%" },
  ],
  interests: ["민감성 피부", "루틴 영상", "클린뷰티", "수분", "장벽 케어"],
  fitProducts: ["진정 크림", "수분 세럼", "장벽 케어", "클린뷰티", "민감성 피부 제품"],
  styles: [
    {
      title: "자연스럽고 솔직함",
      body: "과한 광고 톤보다 실제 사용감 중심의 리뷰를 선호합니다.",
    },
    {
      title: "루틴 중심 콘텐츠",
      body: "데일리 스킨케어 루틴에서 제품을 자연스럽게 보여줍니다.",
    },
    {
      title: "민감성 피부 신뢰",
      body: "진정, 보습, 장벽 제품에 대한 팔로워 질문이 많습니다.",
    },
    {
      title: "글로벌 설명력",
      body: "한국 스킨케어를 영어권 고객이 이해하기 쉽게 풀어냅니다.",
    },
  ],
};

const registeredProducts = [
  "슈퍼젠 트리플 리밸런싱 크림 50g",
  "글래스 글로우 데일리 세럼",
  "시카 카밍 수딩 크림",
];

const contentTypes = [
  "솔직 리뷰",
  "루틴 영상",
  "첫 사용감 리뷰",
  "제품 비교",
  "사용 전후 체크",
];

const targetMarkets = [
  "미국",
  "일본",
  "태국",
  "캐나다",
  "국내 거주 외국인",
  "기타",
];

export default function CreatorProfilePage() {
  const [requestOpen, setRequestOpen] = useState(false);

  return (
    <main className="min-h-screen bg-[#fbfaf8] text-ink">
      <header className="sticky top-0 z-30 bg-[#fbfaf8]/85 backdrop-blur-xl">
        <div className="mx-auto flex w-full max-w-[620px] items-center justify-between px-5 py-4">
          <Link
            href="/"
            className="inline-flex h-10 w-10 items-center justify-center rounded-full bg-white/80 text-ink shadow-sm ring-1 ring-black/5"
            aria-label="KLOW로 돌아가기"
          >
            <ArrowLeft className="h-4 w-4" />
          </Link>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-white/80 px-3 py-2 text-[11px] font-semibold text-sub shadow-sm ring-1 ring-black/5">
            <ShieldCheck className="h-3.5 w-3.5" />
            KLOW 선별 프로필
          </span>
        </div>
      </header>

      <div className="mx-auto w-full max-w-[620px] px-5 pb-12">
        <HeroSection onRequest={() => setRequestOpen(true)} />
        <ProofSection />
        <ContentPreview />
        <StyleAndAudience />
        <BestFit />
        <SeedingCTA onRequest={() => setRequestOpen(true)} />
      </div>

      {requestOpen && <SeedingRequestModal onClose={() => setRequestOpen(false)} />}
    </main>
  );
}

function HeroSection({ onRequest }: { onRequest: () => void }) {
  return (
    <section className="relative overflow-hidden rounded-[36px] bg-white px-6 pb-7 pt-8 text-center shadow-[0_24px_80px_rgba(31,24,18,0.08)] ring-1 ring-black/5">
      <div className="absolute -left-16 -top-20 h-48 w-48 rounded-full bg-rose-200/60 blur-3xl" />
      <div className="absolute -right-16 top-10 h-56 w-56 rounded-full bg-violet-200/55 blur-3xl" />
      <div className="absolute bottom-0 left-1/2 h-40 w-64 -translate-x-1/2 rounded-full bg-emerald-100/70 blur-3xl" />

      <div className="relative">
        <div className="mx-auto flex h-[132px] w-[132px] items-center justify-center overflow-hidden rounded-[38px] bg-gradient-to-br from-stone-100 via-rose-50 to-violet-100 shadow-[0_22px_60px_rgba(124,58,237,0.18)] ring-1 ring-white">
          <div className="flex h-[112px] w-[112px] items-center justify-center rounded-[32px] bg-white/65 text-[34px] font-black tracking-tight text-klow backdrop-blur">
            YE
          </div>
        </div>

        <div className="mt-6 inline-flex items-center gap-1.5 rounded-full bg-white/75 px-3 py-1.5 text-[11px] font-bold text-klow shadow-sm ring-1 ring-klow/10">
          <Sparkles className="h-3.5 w-3.5" />
          KLOW 선별 크리에이터
        </div>

        <h1 className="mt-4 text-[40px] font-black leading-none tracking-tight text-ink">
          {creator.name}
        </h1>
        <div className="mt-2 text-[14px] font-semibold text-sub">
          {creator.handle}
        </div>
        <p className="mx-auto mt-4 max-w-[420px] text-[16px] font-medium leading-[1.55] text-ink">
          {creator.oneLine}
        </p>

        <div className="mt-5 flex flex-wrap justify-center gap-2">
          {creator.tags.map((tag) => (
            <span
              key={tag}
              className="rounded-full bg-white/85 px-3 py-1.5 text-[12px] font-bold text-ink shadow-sm ring-1 ring-black/5"
            >
              {tag}
            </span>
          ))}
        </div>

        <div className="mx-auto mt-6 flex max-w-[430px] flex-wrap items-center justify-center gap-2 text-[12px] font-semibold text-sub">
          <InfoPill icon={<Globe2 className="h-3.5 w-3.5" />}>{creator.location}</InfoPill>
          <InfoPill icon={<Languages className="h-3.5 w-3.5" />}>{creator.languages}</InfoPill>
          <InfoPill>{creator.followers} 팔로워</InfoPill>
        </div>

        <div className="mt-7 grid grid-cols-2 gap-2">
          <button
            type="button"
            onClick={onRequest}
            className="h-14 rounded-2xl bg-ink px-4 py-4 text-[14px] font-bold text-white shadow-[0_12px_30px_rgba(17,24,39,0.18)] hover:opacity-90"
          >
            제품 제안하기
          </button>
          <a
            href="#content"
            className="flex h-14 items-center justify-center rounded-2xl bg-white px-4 py-4 text-[14px] font-bold text-ink shadow-sm ring-1 ring-black/5 hover:bg-bg"
          >
            콘텐츠 보기
          </a>
        </div>
      </div>
    </section>
  );
}

function ProofSection() {
  return (
    <section className="mt-8">
      <div className="mb-3 px-1">
        <SectionEyebrow>신뢰 지표</SectionEyebrow>
        <h2 className="mt-1 text-[22px] font-black tracking-tight text-ink">
          숫자는 가볍게, 신뢰는 분명하게
        </h2>
      </div>
      <div className="grid grid-cols-2 gap-3">
        {creator.proof.map((item) => (
          <div
            key={item.label}
            className="rounded-[26px] bg-white p-5 shadow-[0_16px_44px_rgba(31,24,18,0.06)] ring-1 ring-black/5"
          >
            <div className="text-[30px] font-black leading-none tracking-tight text-ink">
              {item.value}
            </div>
            <div className="mt-2 text-[12px] font-bold text-sub">{item.label}</div>
          </div>
        ))}
      </div>
    </section>
  );
}

function ContentPreview() {
  return (
    <section id="content" className="mt-10 scroll-mt-24">
      <div className="mb-4 px-1">
        <SectionEyebrow>콘텐츠 미리보기</SectionEyebrow>
        <h2 className="mt-1 text-[25px] font-black tracking-tight text-ink">
          브랜드 제품이 놓일 수 있는 콘텐츠
        </h2>
      </div>

      <div className="-mx-5 overflow-x-auto px-5 pb-3 scrollbar-hide">
        <div className="flex gap-4">
          {creator.videos.map((video, index) => (
            <article
              key={video.title}
              className="w-[245px] shrink-0 overflow-hidden rounded-[32px] bg-white shadow-[0_22px_70px_rgba(31,24,18,0.1)] ring-1 ring-black/5"
            >
              <div className={`relative aspect-[9/14] bg-gradient-to-br ${video.tone}`}>
                <div className="absolute inset-x-5 top-5 flex items-center justify-between">
                  <span className="rounded-full bg-white/80 px-2.5 py-1 text-[10px] font-black text-ink backdrop-blur">
                    0{index + 1}
                  </span>
                  <span className="rounded-full bg-black/70 px-2.5 py-1 text-[10px] font-bold text-white backdrop-blur">
                    {video.platform}
                  </span>
                </div>
                <div className="absolute inset-x-5 bottom-5 rounded-[24px] bg-white/78 p-4 backdrop-blur-md">
                  <h3 className="text-[16px] font-black leading-tight text-ink">
                    {video.title}
                  </h3>
                  <div className="mt-3 flex items-center justify-between">
                    <span className="text-[12px] font-bold text-sub">{video.views}</span>
                    <span className="flex h-10 w-10 items-center justify-center rounded-full bg-ink text-white">
                      <Play className="ml-0.5 h-4 w-4 fill-white" />
                    </span>
                  </div>
                </div>
              </div>
            </article>
          ))}
        </div>
      </div>
    </section>
  );
}

function StyleAndAudience() {
  return (
    <section className="mt-10 space-y-4">
      <div className="px-1">
        <SectionEyebrow>크리에이터 스타일</SectionEyebrow>
        <h2 className="mt-1 text-[25px] font-black tracking-tight text-ink">
          어떤 감도로 제품을 보여주는가
        </h2>
      </div>

      <div className="grid gap-3">
        {creator.styles.map((style) => (
          <div
            key={style.title}
            className="rounded-[26px] bg-white p-5 shadow-[0_16px_44px_rgba(31,24,18,0.06)] ring-1 ring-black/5"
          >
            <div className="text-[16px] font-black text-ink">{style.title}</div>
            <p className="mt-1.5 text-[13px] font-medium leading-[1.55] text-sub">
              {style.body}
            </p>
          </div>
        ))}
      </div>

      <div className="rounded-[30px] bg-white p-5 shadow-[0_16px_44px_rgba(31,24,18,0.06)] ring-1 ring-black/5">
        <h3 className="text-[18px] font-black tracking-tight text-ink">도달 고객</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {creator.audienceCountries.map((country) => (
            <span
              key={country.name}
              className="rounded-full bg-bg px-3 py-2 text-[13px] font-bold text-ink"
            >
              {country.name} {country.value}
            </span>
          ))}
        </div>
        <h3 className="mt-6 text-[18px] font-black tracking-tight text-ink">관심사</h3>
        <div className="mt-4 flex flex-wrap gap-2">
          {creator.interests.map((interest) => (
            <span
              key={interest}
              className="rounded-full bg-klow/5 px-3 py-2 text-[13px] font-bold text-klow ring-1 ring-klow/10"
            >
              {interest}
            </span>
          ))}
        </div>
      </div>
    </section>
  );
}

function BestFit() {
  return (
    <section className="mt-10 rounded-[32px] bg-ink p-6 text-white shadow-[0_24px_80px_rgba(17,24,39,0.16)]">
      <SectionEyebrow light>추천 제품군</SectionEyebrow>
      <h2 className="mt-1 text-[25px] font-black tracking-tight">
        이런 제품과 가장 잘 맞습니다
      </h2>
      <div className="mt-5 flex flex-wrap gap-2">
        {creator.fitProducts.map((product) => (
          <span
            key={product}
            className="rounded-full bg-white/10 px-3 py-2 text-[13px] font-bold text-white ring-1 ring-white/10"
          >
            {product}
          </span>
        ))}
      </div>
      <p className="mt-5 text-[13px] font-medium leading-[1.6] text-white/70">
        민감성 피부와 장벽 케어 반응이 높아, 진정·보습 제품을 소개할 때
        자연스러운 신뢰를 만들 수 있습니다.
      </p>
    </section>
  );
}

function SeedingCTA({ onRequest }: { onRequest: () => void }) {
  return (
    <section className="mt-10 rounded-[34px] bg-white p-6 shadow-[0_24px_80px_rgba(31,24,18,0.08)] ring-1 ring-black/5">
      <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-bg text-ink">
        <Send className="h-5 w-5" />
      </div>
      <h2 className="mt-5 text-center text-[25px] font-black tracking-tight text-ink">
        이 크리에이터가 제품과 잘 맞을까요?
      </h2>
      <p className="mx-auto mt-2 max-w-[420px] text-center text-[13px] font-medium leading-[1.6] text-sub">
        제품 컨셉이 맞는 경우 KLOW가 요청 내용을 검토한 뒤 크리에이터에게
        제품 제안을 전달합니다.
      </p>

      <div className="mt-5 grid grid-cols-2 gap-2 text-[12px]">
        <SummaryPill label="주요 도달" value="미국 / 캐나다" />
        <SummaryPill label="추천 제품" value="민감성 / 클린뷰티" />
        <SummaryPill label="평균 조회" value="2.2만+" />
        <SummaryPill label="언어" value="영어 / 한국어" />
      </div>

      <button
        type="button"
        onClick={onRequest}
        className="mt-6 h-14 w-full rounded-2xl bg-ink text-[15px] font-black text-white shadow-[0_14px_34px_rgba(17,24,39,0.18)] hover:opacity-90"
      >
        제품 제안하기
      </button>
      <div className="mt-4 flex items-start justify-center gap-1.5 text-center text-[11.5px] font-medium leading-[1.45] text-sub">
        <ShieldCheck className="mt-0.5 h-3.5 w-3.5 shrink-0" />
        KLOW가 모든 요청을 검토한 뒤 크리에이터에게 전달합니다.
      </div>
    </section>
  );
}

function SeedingRequestModal({ onClose }: { onClose: () => void }) {
  const [submitted, setSubmitted] = useState(false);
  const [selectedTypes, setSelectedTypes] = useState<string[]>(["솔직 리뷰"]);
  const [selectedMarkets, setSelectedMarkets] = useState<string[]>(["미국"]);
  const productOptions = useMemo(() => registeredProducts, []);

  const toggle = (
    value: string,
    selected: string[],
    setSelected: (next: string[]) => void,
  ) => {
    setSelected(
      selected.includes(value)
        ? selected.filter((item) => item !== value)
        : [...selected, value],
    );
  };

  return (
    <div className="fixed inset-0 z-50 flex items-end justify-center bg-ink/40 px-3 animate-fade-in sm:items-center sm:py-6">
      <button className="absolute inset-0 cursor-default" onClick={onClose} aria-label="닫기" />
      <div className="relative max-h-[92vh] w-full max-w-[560px] overflow-hidden rounded-t-[32px] bg-white shadow-pop sm:rounded-[32px]">
        {!submitted ? (
          <>
            <div className="flex items-start justify-between gap-4 border-b border-line px-5 py-5">
              <div>
                <h2 className="text-[21px] font-black tracking-tight text-ink">
                  제품 제안을 보낼까요?
                </h2>
                <p className="mt-2 text-[12.5px] font-medium leading-[1.6] text-sub">
                  아래 정보가 KLOW에 전달됩니다. 검토 후 크리에이터에게 제안이
                  전달되며, 수락 여부에 따라 다음 단계가 진행됩니다.
                </p>
              </div>
              <button
                type="button"
                onClick={onClose}
                className="flex h-9 w-9 shrink-0 items-center justify-center rounded-full hover:bg-bg"
                aria-label="닫기"
              >
                <X className="h-4 w-4" />
              </button>
            </div>

            <div className="max-h-[calc(92vh-170px)] overflow-y-auto px-5 py-5">
              <FieldBlock label="제안할 상품">
                <div className="relative">
                  <select className="h-12 w-full appearance-none rounded-2xl border border-line bg-bg px-4 pr-10 text-[13.5px] font-semibold text-ink outline-none focus:border-ink/30">
                    {productOptions.map((product) => (
                      <option key={product}>{product}</option>
                    ))}
                  </select>
                  <ChevronDown className="pointer-events-none absolute right-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" />
                </div>
              </FieldBlock>

              <FieldBlock label="제품 소개 포인트">
                <textarea
                  className="min-h-[88px] w-full resize-none rounded-2xl border border-line bg-bg px-4 py-3 text-[13.5px] outline-none focus:border-ink/30"
                  placeholder="이 제품을 왜 이 크리에이터에게 소개하고 싶은지 적어주세요."
                />
              </FieldBlock>

              <FieldBlock label="희망 콘텐츠">
                <CheckGroup
                  options={contentTypes}
                  selected={selectedTypes}
                  onToggle={(value) => toggle(value, selectedTypes, setSelectedTypes)}
                />
              </FieldBlock>

              <FieldBlock label="확인하고 싶은 시장">
                <CheckGroup
                  options={targetMarkets}
                  selected={selectedMarkets}
                  onToggle={(value) => toggle(value, selectedMarkets, setSelectedMarkets)}
                />
              </FieldBlock>

              <FieldBlock label="샘플 수량">
                <input
                  className="h-12 w-full rounded-2xl border border-line bg-bg px-4 text-[13.5px] outline-none focus:border-ink/30"
                  placeholder="예: 1-3개"
                />
              </FieldBlock>

              <FieldBlock label="브랜드 메모">
                <textarea
                  className="min-h-[92px] w-full resize-none rounded-2xl border border-line bg-bg px-4 py-3 text-[13.5px] outline-none focus:border-ink/30"
                  placeholder="브랜드 소개, 제품 포인트, 요청사항을 자유롭게 적어주세요."
                />
              </FieldBlock>
            </div>

            <div className="flex gap-2 border-t border-line px-5 py-4">
              <button
                type="button"
                onClick={onClose}
                className="h-12 rounded-2xl border border-line bg-white px-5 text-[14px] font-semibold text-ink hover:bg-bg"
              >
                취소
              </button>
              <button
                type="button"
                onClick={() => setSubmitted(true)}
                className="h-12 flex-1 rounded-2xl bg-ink text-[14px] font-bold text-white hover:opacity-90"
              >
                KLOW에 제안 요청 제출
              </button>
            </div>
          </>
        ) : (
          <div className="px-7 py-10 text-center">
            <div className="mx-auto flex h-16 w-16 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
              <Check className="h-8 w-8" strokeWidth={3} />
            </div>
            <h2 className="mt-5 text-[22px] font-black tracking-tight text-ink">
              제안 요청이 접수되었습니다
            </h2>
            <p className="mt-2 text-[13.5px] font-medium leading-[1.6] text-sub">
              KLOW가 요청 내용을 확인한 뒤 크리에이터에게 제품 제안을 전달합니다.
            </p>
            <p className="mt-4 text-[13px] font-medium leading-[1.6] text-sub">
              크리에이터가 관심을 보이면 샘플 발송 조건과 콘텐츠 방향을
              조율해드릴게요.
            </p>
            <button
              type="button"
              onClick={onClose}
              className="mt-7 h-12 w-full rounded-2xl bg-ink text-[14px] font-bold text-white hover:opacity-90"
            >
              확인
            </button>
          </div>
        )}
      </div>
    </div>
  );
}

function InfoPill({
  icon,
  children,
}: {
  icon?: React.ReactNode;
  children: React.ReactNode;
}) {
  return (
    <span className="inline-flex items-center gap-1.5 rounded-full bg-white/70 px-3 py-1.5 shadow-sm ring-1 ring-black/5">
      {icon}
      {children}
    </span>
  );
}

function SectionEyebrow({
  children,
  light,
}: {
  children: React.ReactNode;
  light?: boolean;
}) {
  return (
    <div
      className={`text-[11px] font-black uppercase tracking-[0.18em] ${
        light ? "text-white/50" : "text-klow"
      }`}
    >
      {children}
    </div>
  );
}

function SummaryPill({ label, value }: { label: string; value: string }) {
  return (
    <div className="rounded-2xl bg-bg p-3 text-center">
      <div className="text-[11px] font-bold text-sub">{label}</div>
      <div className="mt-1 text-[13px] font-black text-ink">{value}</div>
    </div>
  );
}

function FieldBlock({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <div className="mb-5 last:mb-0">
      <div className="mb-2 px-1 text-[12px] font-bold text-ink">{label}</div>
      {children}
    </div>
  );
}

function CheckGroup({
  options,
  selected,
  onToggle,
}: {
  options: string[];
  selected: string[];
  onToggle: (value: string) => void;
}) {
  return (
    <div className="flex flex-wrap gap-2">
      {options.map((option) => {
        const active = selected.includes(option);
        return (
          <button
            key={option}
            type="button"
            onClick={() => onToggle(option)}
            className={`rounded-full border px-3 py-2 text-[12px] font-semibold transition-colors ${
              active
                ? "border-ink bg-ink text-white"
                : "border-line bg-white text-sub hover:border-ink/30 hover:text-ink"
            }`}
          >
            {option}
          </button>
        );
      })}
    </div>
  );
}
