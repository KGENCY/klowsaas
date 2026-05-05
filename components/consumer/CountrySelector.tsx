"use client";

import { useEffect, useMemo, useRef, useState } from "react";
import { Search } from "lucide-react";
import {
  countries,
  flagEmoji,
  searchCountries,
  type Country,
} from "@/lib/countries";

interface Props {
  onSelect: (country: Country) => void;
}

const FEATURED_CODES = ["US", "GB", "JP", "SG", "AU", "CA", "DE", "FR", "AE", "KZ"];

export function CountrySelector({ onSelect }: Props) {
  const [query, setQuery] = useState("");
  const inputRef = useRef<HTMLInputElement>(null);

  useEffect(() => {
    const t = setTimeout(() => inputRef.current?.focus(), 150);
    return () => clearTimeout(t);
  }, []);

  const matches = useMemo<Country[]>(() => {
    if (!query.trim()) {
      return FEATURED_CODES.map((code) =>
        countries.find((c) => c.code === code)!,
      ).filter(Boolean);
    }
    return searchCountries(query, 10);
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-sub" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="Search your country"
          className="w-full pl-11 pr-4 h-[52px] rounded-2xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[15px] placeholder:text-sub transition-colors"
          aria-label="Search country or region"
        />
      </div>

      {!query.trim() && (
        <div className="mt-3 px-1 text-[11.5px] text-sub font-medium">
          Popular destinations
        </div>
      )}

      <ul className="mt-2 -mx-1">
        {matches.length === 0 && (
          <li className="px-3 py-6 text-center text-[13px] text-sub">
            No country matches “{query}”
          </li>
        )}
        {matches.map((c) => (
          <li key={c.code}>
            <button
              type="button"
              onClick={() => onSelect(c)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg active:bg-line/40 transition-colors text-left"
            >
              <span className="text-[22px] leading-none">{flagEmoji(c.code)}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14.5px] font-semibold text-ink truncate">
                  {c.name}
                </span>
                <span className="block text-[11.5px] text-sub mt-0.5">
                  {c.region}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
