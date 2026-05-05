"use client";

export function Header({
  onLogoClick,
}: {
  onLogoClick?: () => void;
}) {
  return (
    <header className="sticky top-0 z-30 w-full bg-bg/85 backdrop-blur-xl border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-6 py-3 flex items-center">
        <button
          onClick={onLogoClick}
          className="flex items-center gap-2 group"
        >
          <div className="w-7 h-7 rounded-[8px] bg-ink flex items-center justify-center">
            <span className="text-white font-bold text-[13px] tracking-tight">
              K
            </span>
          </div>
          <span className="font-semibold text-[17px] tracking-tight">
            KLOW <span className="text-sub font-medium">Global</span>
          </span>
        </button>
      </div>
    </header>
  );
}
