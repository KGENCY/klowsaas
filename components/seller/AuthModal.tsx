"use client";

import { useState } from "react";
import { Apple, ArrowRight, Check, Mail, X } from "lucide-react";

interface Props {
  open: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export function AuthModal({ open, onClose, onSuccess }: Props) {
  const [email, setEmail] = useState("");
  const [sent, setSent] = useState(false);
  const [loading, setLoading] = useState(false);

  if (!open) return null;

  const complete = () => {
    setLoading(true);
    window.setTimeout(() => {
      setLoading(false);
      onSuccess();
    }, 650);
  };

  const sendEmail = () => {
    if (!email.trim()) return;
    setSent(true);
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center px-4 py-8 bg-ink/18 backdrop-blur-md animate-fade-in">
      <button
        type="button"
        aria-label="닫기"
        onClick={onClose}
        className="absolute inset-0 cursor-default"
      />
      <div className="relative w-full max-w-[440px] rounded-[30px] border border-white/80 bg-white/95 shadow-pop animate-slide-up overflow-hidden">
        <button
          type="button"
          aria-label="닫기"
          onClick={onClose}
          className="absolute right-4 top-4 h-9 w-9 rounded-full text-sub hover:bg-bg hover:text-ink flex items-center justify-center transition-colors"
        >
          <X className="h-4 w-4" />
        </button>

        <div className="px-7 sm:px-9 pt-9 pb-8">
          <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-2xl bg-ink text-white font-bold tracking-tight">
            K
          </div>
          <div className="mt-5 text-center">
            <h2 className="text-[25px] sm:text-[28px] font-bold tracking-tight leading-[1.2]">
              3분 안에 글로벌 판매를 시작해보세요
            </h2>
            <p className="mt-3 text-[14.5px] leading-[1.65] text-sub">
              브랜드 링크 생성부터
              <br />
              해외 결제 · 배송 · 글로벌 판매까지.
            </p>
          </div>

          {!sent ? (
            <div className="mt-7">
              <button
                type="button"
                onClick={complete}
                disabled={loading}
                className="h-12 w-full rounded-2xl bg-ink text-white text-[14px] font-bold flex items-center justify-center gap-2 hover:opacity-90 transition-opacity disabled:opacity-60"
              >
                <GoogleMark />
                Continue with Google
              </button>
              <button
                type="button"
                onClick={complete}
                disabled={loading}
                className="mt-2.5 h-12 w-full rounded-2xl bg-white border border-line text-ink text-[14px] font-bold flex items-center justify-center gap-2 hover:border-ink/25 transition-colors disabled:opacity-60"
              >
                <Apple className="h-4 w-4 fill-ink" />
                Continue with Apple
              </button>

              <div className="my-6 flex items-center gap-3">
                <span className="h-px flex-1 bg-line" />
                <span className="text-[12px] font-semibold text-sub">
                  또는 이메일로 시작하기
                </span>
                <span className="h-px flex-1 bg-line" />
              </div>

              <div className="relative">
                <Mail className="absolute left-4 top-1/2 h-4 w-4 -translate-y-1/2 text-sub" />
                <input
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyDown={(e) => {
                    if (e.key === "Enter") sendEmail();
                  }}
                  type="email"
                  autoComplete="email"
                  placeholder="brand@company.com"
                  className="h-12 w-full rounded-2xl border border-line bg-bg pl-11 pr-4 text-[14px] font-semibold outline-none focus:border-ink/30 focus:bg-white"
                />
              </div>
              <button
                type="button"
                onClick={sendEmail}
                disabled={!email.trim()}
                className="mt-3 h-12 w-full rounded-2xl bg-ink text-white text-[14px] font-bold flex items-center justify-center gap-1.5 disabled:bg-line disabled:text-sub/60 disabled:cursor-not-allowed hover:opacity-90 transition-opacity"
              >
                이메일로 계속하기
                <ArrowRight className="h-4 w-4" />
              </button>
            </div>
          ) : (
            <div className="mt-7 rounded-[24px] border border-line bg-bg px-5 py-6 text-center animate-fade-in">
              <div className="mx-auto flex h-12 w-12 items-center justify-center rounded-full bg-emerald-50 text-emerald-700">
                <Check className="h-6 w-6" strokeWidth={3} />
              </div>
              <h3 className="mt-4 text-[17px] font-bold tracking-tight">
                입력한 이메일로 로그인 링크를 보내드렸어요.
              </h3>
              <p className="mt-2 text-[13px] leading-[1.55] text-sub">
                지금은 데모 화면이라 바로 이어서 확인할 수 있어요.
              </p>
              <button
                type="button"
                onClick={complete}
                className="mt-5 h-11 w-full rounded-2xl bg-ink text-white text-[13.5px] font-bold hover:opacity-90 transition-opacity"
              >
                로그인 완료하고 시작하기
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function GoogleMark() {
  return (
    <span className="grid h-4 w-4 place-items-center rounded-full bg-white text-[11px] font-black text-ink">
      G
    </span>
  );
}
