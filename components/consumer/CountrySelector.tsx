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

const regionLabels: Record<string, string> = {
  "North America": "북미",
  "Latin America": "중남미",
  "East Asia": "동아시아",
  "Southeast Asia": "동남아시아",
  "South Asia": "남아시아",
  "Central Asia": "중앙아시아",
  CIS: "CIS",
  "Middle East": "중동",
  Europe: "유럽",
  Nordics: "북유럽",
  Baltics: "발트 지역",
  Oceania: "오세아니아",
  Africa: "아프리카",
};

const countryNameOverrides: Record<string, string> = {
  US: "미국",
  GB: "영국",
  KR: "대한민국",
  AE: "아랍에미리트",
  KZ: "카자흐스탄",
};

const koreanCountryNames =
  typeof Intl !== "undefined" && "DisplayNames" in Intl
    ? new Intl.DisplayNames(["ko"], { type: "region" })
    : null;

function displayCountryName(country: Country) {
  return (
    countryNameOverrides[country.code] ??
    koreanCountryNames?.of(country.code) ??
    country.name
  );
}

function displayRegionName(region: string) {
  return regionLabels[region] ?? region;
}

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

    const normalizedQuery = query.trim().toLowerCase();
    const englishMatches = searchCountries(query, 10);
    const koreanMatches = countries.filter((country) => {
      const name = displayCountryName(country).toLowerCase();
      const region = displayRegionName(country.region).toLowerCase();
      return name.includes(normalizedQuery) || region.includes(normalizedQuery);
    });

    return Array.from(
      new Map([...koreanMatches, ...englishMatches].map((country) => [country.code, country])).values(),
    ).slice(0, 10);
  }, [query]);

  return (
    <div>
      <div className="relative">
        <Search className="absolute left-4 top-1/2 -translate-y-1/2 w-[16px] h-[16px] text-sub" />
        <input
          ref={inputRef}
          value={query}
          onChange={(e) => setQuery(e.target.value)}
          placeholder="국가 또는 지역 검색"
          className="w-full pl-11 pr-4 h-[52px] rounded-2xl bg-bg border border-transparent focus:border-ink/30 focus:bg-white outline-none text-[15px] placeholder:text-sub transition-colors"
          aria-label="국가 또는 지역 검색"
        />
      </div>

      {!query.trim() && (
        <div className="mt-3 px-1 text-[11.5px] text-sub font-medium">
          주요 배송 국가
        </div>
      )}

      <ul className="mt-2 -mx-1">
        {matches.length === 0 && (
          <li className="px-3 py-6 text-center text-[13px] text-sub">
            "{query}"에 해당하는 국가를 찾을 수 없습니다
          </li>
        )}
        {matches.map((country) => (
          <li key={country.code}>
            <button
              type="button"
              onClick={() => onSelect(country)}
              className="w-full flex items-center gap-3 px-3 py-3 rounded-xl hover:bg-bg active:bg-line/40 transition-colors text-left"
            >
              <span className="text-[22px] leading-none">{flagEmoji(country.code)}</span>
              <span className="flex-1 min-w-0">
                <span className="block text-[14.5px] font-semibold text-ink truncate">
                  {displayCountryName(country)}
                </span>
                <span className="block text-[11.5px] text-sub mt-0.5">
                  {displayRegionName(country.region)}
                </span>
              </span>
            </button>
          </li>
        ))}
      </ul>
    </div>
  );
}
