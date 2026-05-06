"use client";

export function Header({
  onLogoClick,
  variant = "landing",
}: {
  onLogoClick?: () => void;
  variant?: "landing" | "dashboard";
}) {
  const nav = ["Storefront", "Orders", "Seeding", "Settlement", "Settings"];

  return (
    <header className="sticky top-0 z-30 w-full bg-bg/85 backdrop-blur-xl border-b border-line/60">
      <div className="mx-auto max-w-[1180px] px-5 sm:px-6 py-3 flex items-center justify-between gap-4">
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
            KLOW <span className="text-sub font-medium">글로벌</span>
          </span>
        </button>
        {variant === "dashboard" && (
          <nav className="hidden md:flex items-center gap-1">
            {nav.map((item) => (
              <button
                key={item}
                className="h-9 px-3 rounded-xl text-[13px] font-semibold text-sub hover:text-ink hover:bg-white border border-transparent hover:border-line transition-colors"
              >
                {item}
              </button>
            ))}
          </nav>
        )}
      </div>
    </header>
  );
}
