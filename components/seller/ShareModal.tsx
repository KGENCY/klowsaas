"use client";

import { useEffect, useState } from "react";
import { Check, Copy, X } from "lucide-react";

interface Props {
  open: boolean;
  link: string;
  onClose: () => void;
}

export function ShareModal({ open, link, onClose }: Props) {
  const [copied, setCopied] = useState(false);
  const fullUrl = link.startsWith("http") ? link : `https://${link}`;

  useEffect(() => {
    if (!open) return;
    const onKey = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", onKey);
    return () => window.removeEventListener("keydown", onKey);
  }, [open, onClose]);

  useEffect(() => {
    if (!open) {
      setCopied(false);
      return;
    }
    (async () => {
      try {
        if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
          await navigator.clipboard.writeText(fullUrl);
        }
      } catch {
        /* mock */
      }
      setCopied(true);
    })();
  }, [open, fullUrl]);

  if (!open) return null;
  const encoded = encodeURIComponent(fullUrl);
  const shareText = encodeURIComponent(
    "전 세계 어디서나 만나보세요 — KLOW 글로벌 스토어"
  );

  const targets = [
    {
      key: "instagram",
      label: "Instagram",
      href: `https://www.instagram.com/`,
      icon: <InstagramIcon />,
      note: "스토리·DM에 붙여넣기",
    },
    {
      key: "facebook",
      label: "Facebook",
      href: `https://www.facebook.com/sharer/sharer.php?u=${encoded}`,
      icon: <FacebookIcon />,
    },
    {
      key: "whatsapp",
      label: "WhatsApp",
      href: `https://wa.me/?text=${shareText}%20${encoded}`,
      icon: <WhatsAppIcon />,
    },
    {
      key: "kakao",
      label: "카카오톡",
      href: `https://story.kakao.com/share?url=${encoded}`,
      icon: <KakaoIcon />,
    },
    {
      key: "tiktok",
      label: "TikTok",
      href: `https://www.tiktok.com/`,
      icon: <TikTokIcon />,
      note: "프로필·영상 설명에 붙여넣기",
    },
  ] as const;

  const copyAgain = async () => {
    try {
      if (typeof navigator !== "undefined" && navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(fullUrl);
      }
    } catch {
      /* mock */
    }
    setCopied(true);
  };

  return (
    <>
      <div
        className="fixed inset-0 bg-ink/40 z-40 animate-fade-in"
        onClick={onClose}
      />
      <div className="fixed inset-0 z-50 flex items-center justify-center px-5">
        <div className="relative w-full max-w-[440px] bg-white rounded-[28px] shadow-pop animate-pop overflow-hidden">
          <button
            type="button"
            onClick={onClose}
            aria-label="닫기"
            className="absolute top-4 right-4 w-9 h-9 rounded-full hover:bg-bg flex items-center justify-center transition-colors"
          >
            <X className="w-[18px] h-[18px]" />
          </button>

          <div className="px-7 pt-9 pb-2">
            <div className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full bg-ink flex items-center justify-center">
                <Check className="w-4 h-4 text-white" strokeWidth={3} />
              </div>
              <h3 className="text-[18px] font-bold tracking-tight">
                링크가 복사되었어요
              </h3>
            </div>
            <p className="mt-2 text-[13.5px] text-sub leading-[1.55]">
              아래 채널에 붙여넣어 전 세계 고객에게 바로 공유하세요.
            </p>
          </div>

          <div className="px-5 pt-5 pb-3">
            <button
              type="button"
              onClick={copyAgain}
              className="w-full flex items-center gap-2.5 px-4 py-3 rounded-2xl bg-bg border border-line hover:border-ink/30 transition-colors"
            >
              <span className="flex-1 min-w-0 text-left text-[13.5px] font-semibold text-ink truncate">
                {link}
              </span>
              {copied ? (
                <span className="flex items-center gap-1 text-[12px] font-semibold text-ink">
                  <Check className="w-3.5 h-3.5" strokeWidth={3} />
                  복사됨
                </span>
              ) : (
                <span className="flex items-center gap-1 text-[12px] font-semibold text-sub">
                  <Copy className="w-3.5 h-3.5" />
                  복사
                </span>
              )}
            </button>
          </div>

          <div className="px-5 pb-7 pt-2">
            <div className="grid grid-cols-5 gap-2">
              {targets.map((t) => (
                <a
                  key={t.key}
                  href={t.href}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="group flex flex-col items-center gap-1.5 py-2 rounded-xl hover:bg-bg transition-colors"
                >
                  <span className="w-12 h-12 rounded-2xl flex items-center justify-center overflow-hidden">
                    {t.icon}
                  </span>
                  <span className="text-[11.5px] font-semibold text-ink">
                    {t.label}
                  </span>
                </a>
              ))}
            </div>
          </div>
        </div>
      </div>
    </>
  );
}

/* --- Brand icons (official SVG paths from Simple Icons, CC0) --- */

function InstagramIcon() {
  return (
    <svg
      viewBox="0 0 48 48"
      className="w-12 h-12"
      xmlns="http://www.w3.org/2000/svg"
    >
      <defs>
        <radialGradient id="ig-grad" cx="0.3" cy="1" r="1.2">
          <stop offset="0" stopColor="#FED576" />
          <stop offset="0.26" stopColor="#F47133" />
          <stop offset="0.61" stopColor="#BC3081" />
          <stop offset="1" stopColor="#4C63D2" />
        </radialGradient>
      </defs>
      <rect width="48" height="48" rx="13" fill="url(#ig-grad)" />
      <path
        fill="#fff"
        d="M24 14c-2.717 0-3.057.011-4.123.06-1.064.049-1.79.218-2.428.465a4.9 4.9 0 0 0-1.772 1.153 4.9 4.9 0 0 0-1.154 1.772c-.247.637-.416 1.364-.464 2.428C14.011 20.943 14 21.283 14 24s.012 3.057.06 4.123c.05 1.064.218 1.79.465 2.428a4.9 4.9 0 0 0 1.153 1.772 4.9 4.9 0 0 0 1.772 1.154c.638.247 1.364.416 2.428.464C20.943 33.989 21.283 34 24 34s3.057-.011 4.123-.06c1.064-.049 1.79-.218 2.428-.464a4.9 4.9 0 0 0 1.772-1.154 4.9 4.9 0 0 0 1.154-1.772c.247-.637.416-1.364.464-2.428.049-1.066.06-1.406.06-4.123s-.011-3.057-.06-4.123c-.049-1.064-.218-1.79-.464-2.428a4.9 4.9 0 0 0-1.154-1.772 4.9 4.9 0 0 0-1.772-1.153c-.637-.247-1.364-.416-2.428-.465C27.057 14.011 26.717 14 24 14Zm0 1.802c2.671 0 2.987.01 4.042.058.974.045 1.504.208 1.856.345.466.182.8.399 1.15.748.35.35.566.683.748 1.15.137.35.3.881.345 1.855.048 1.054.058 1.37.058 4.042 0 2.671-.01 2.987-.058 4.042-.045.974-.208 1.504-.345 1.856-.182.466-.399.8-.748 1.15a3.1 3.1 0 0 1-1.15.748c-.351.137-.882.3-1.856.345-1.054.048-1.37.058-4.042.058-2.672 0-2.988-.01-4.042-.058-.974-.045-1.504-.208-1.856-.345a3.1 3.1 0 0 1-1.15-.748 3.1 3.1 0 0 1-.748-1.15c-.137-.351-.3-.882-.345-1.856-.048-1.055-.058-1.37-.058-4.042 0-2.672.01-2.988.058-4.042.045-.974.208-1.505.345-1.856.182-.466.399-.8.748-1.15.35-.349.683-.566 1.15-.748.351-.137.882-.3 1.856-.345 1.054-.048 1.37-.058 4.042-.058Zm0 3.063A5.135 5.135 0 1 0 24 29.135 5.135 5.135 0 0 0 24 18.865Zm0 8.468A3.333 3.333 0 1 1 24 20.667a3.333 3.333 0 0 1 0 6.666Zm6.538-8.671a1.2 1.2 0 1 1-2.4 0 1.2 1.2 0 0 1 2.4 0Z"
      />
    </svg>
  );
}

function FacebookIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="13" fill="#1877F2" />
      <path
        fill="#fff"
        d="M27.5 25.5h3.4l.5-3.9h-3.9V19c0-1.1.3-1.9 1.9-1.9h2v-3.5c-.4 0-1.6-.1-2.9-.1-2.9 0-4.9 1.7-4.9 5v2.9H20v3.9h3.6V35h3.9V25.5Z"
      />
    </svg>
  );
}

function WhatsAppIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="13" fill="#25D366" />
      <path
        fill="#fff"
        d="M33.4 14.6A12.9 12.9 0 0 0 24.2 11C17.1 11 11.3 16.7 11.3 23.8c0 2.3.6 4.5 1.7 6.4L11.2 37l6.9-1.8a13 13 0 0 0 6.1 1.6h.1c7.1 0 12.9-5.7 12.9-12.8a12.6 12.6 0 0 0-3.8-9.4Zm-9.2 19.8h-.1a10.7 10.7 0 0 1-5.5-1.5l-.4-.2-4.1 1.1 1.1-4-.3-.4a10.6 10.6 0 0 1-1.6-5.6c0-5.9 4.8-10.7 10.7-10.7 2.9 0 5.5 1.1 7.6 3.1a10.6 10.6 0 0 1 3.1 7.6c0 5.9-4.8 10.6-10.5 10.6Zm5.9-7.9c-.3-.2-1.9-.9-2.2-1-.3-.1-.5-.2-.7.2s-.8 1-1 1.2c-.2.2-.4.2-.7.1-1.9-1-3.2-1.7-4.5-3.9-.3-.6.3-.5.9-1.7.1-.2 0-.4 0-.5l-1-2.4c-.3-.6-.5-.5-.7-.5h-.6c-.2 0-.6.1-.9.4-.3.3-1.1 1.1-1.1 2.7s1.2 3.1 1.3 3.3c.2.2 2.3 3.5 5.5 4.9 2 .9 2.8.9 3.8.8.6-.1 1.9-.8 2.2-1.5.3-.7.3-1.3.2-1.5-.1-.2-.3-.3-.6-.5Z"
      />
    </svg>
  );
}

function KakaoIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="13" fill="#FEE500" />
      <path
        fill="#191919"
        d="M24 13.5c-6.6 0-12 4.2-12 9.4 0 3.4 2.3 6.4 5.7 8L16.3 35c-.1.4.4.7.7.5l5.7-3.7c.4 0 .9.1 1.3.1 6.6 0 12-4.2 12-9.4s-5.4-9-12-9Z"
      />
    </svg>
  );
}

function TikTokIcon() {
  return (
    <svg viewBox="0 0 48 48" className="w-12 h-12" xmlns="http://www.w3.org/2000/svg">
      <rect width="48" height="48" rx="13" fill="#010101" />
      <path
        fill="#25F4EE"
        d="M30.5 19.4a8.6 8.6 0 0 1-3-1.6 8.4 8.4 0 0 1-2.6-4h-3v15a3 3 0 1 1-3-3v-3a6 6 0 1 0 6 6V21.7a11 11 0 0 0 5.6 1.6v-3.9Z"
      />
      <path
        fill="#FE2C55"
        d="M31.5 18.4a8.6 8.6 0 0 1-3-1.6 8.4 8.4 0 0 1-2.6-4h-3v15a3 3 0 1 1-3-3v-3a6 6 0 1 0 6 6V20.7a11 11 0 0 0 5.6 1.6v-3.9Z"
      />
      <path
        fill="#fff"
        d="M30.8 18.7a8.6 8.6 0 0 1-2.7-1.3 8.4 8.4 0 0 1-2.6-4h-2.4v15a3 3 0 0 1-5.4 1.8 3 3 0 0 1 3-4.8v-3a6 6 0 1 0 5.4 6V21.4a11 11 0 0 0 5.6 1.6v-2.7c-.4 0-.6-.1-.9-.2a6 6 0 0 1-.8-.4Z"
      />
    </svg>
  );
}
