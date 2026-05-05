"use client";

export function Header({ onLogoClick }: { onLogoClick?: () => void }) {
  return (
    <header className="w-full border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-6 py-5 flex items-center justify-between">
        <button onClick={onLogoClick} className="flex items-center gap-2 group">
          <div className="w-7 h-7 rounded-[8px] bg-ink flex items-center justify-center">
            <span className="text-white font-bold text-[13px] tracking-tight">
              K
            </span>
          </div>
          <span className="font-semibold text-[17px] tracking-tight">
            KLOW <span className="text-sub font-medium">Pro</span>
          </span>
        </button>

        <span className="text-[12px] font-medium text-sub">
          Global buy link
        </span>
      </div>
    </header>
  );
}
