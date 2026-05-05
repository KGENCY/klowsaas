export interface Country {
  code: string;
  name: string;
  region: string;
  needsState?: boolean;
  postalLabel?: string;
  aliases?: string[];
}

export const countries: Country[] = [
  // North America
  { code: "US", name: "United States", region: "North America", needsState: true, aliases: ["usa", "america"] },
  { code: "CA", name: "Canada", region: "North America", needsState: true },
  { code: "MX", name: "Mexico", region: "North America", needsState: true },

  // Latin America
  { code: "BR", name: "Brazil", region: "Latin America", needsState: true, aliases: ["brasil"] },
  { code: "AR", name: "Argentina", region: "Latin America", needsState: true },
  { code: "CL", name: "Chile", region: "Latin America" },
  { code: "CO", name: "Colombia", region: "Latin America" },
  { code: "PE", name: "Peru", region: "Latin America" },
  { code: "UY", name: "Uruguay", region: "Latin America" },
  { code: "PY", name: "Paraguay", region: "Latin America" },
  { code: "BO", name: "Bolivia", region: "Latin America" },
  { code: "EC", name: "Ecuador", region: "Latin America" },
  { code: "VE", name: "Venezuela", region: "Latin America" },
  { code: "CR", name: "Costa Rica", region: "Latin America" },
  { code: "PA", name: "Panama", region: "Latin America" },
  { code: "GT", name: "Guatemala", region: "Latin America" },
  { code: "DO", name: "Dominican Republic", region: "Latin America" },
  { code: "PR", name: "Puerto Rico", region: "Latin America" },
  { code: "JM", name: "Jamaica", region: "Latin America" },
  { code: "TT", name: "Trinidad and Tobago", region: "Latin America" },
  { code: "BS", name: "Bahamas", region: "Latin America" },
  { code: "BB", name: "Barbados", region: "Latin America" },
  { code: "CU", name: "Cuba", region: "Latin America" },
  { code: "HN", name: "Honduras", region: "Latin America" },
  { code: "NI", name: "Nicaragua", region: "Latin America" },
  { code: "SV", name: "El Salvador", region: "Latin America" },

  // East Asia
  { code: "KR", name: "South Korea", region: "East Asia", aliases: ["korea", "republic of korea"] },
  { code: "JP", name: "Japan", region: "East Asia", aliases: ["nippon"] },
  { code: "CN", name: "China", region: "East Asia", needsState: true },
  { code: "HK", name: "Hong Kong", region: "East Asia" },
  { code: "TW", name: "Taiwan", region: "East Asia" },
  { code: "MO", name: "Macau", region: "East Asia", aliases: ["macao"] },
  { code: "MN", name: "Mongolia", region: "East Asia" },

  // Southeast Asia
  { code: "SG", name: "Singapore", region: "Southeast Asia" },
  { code: "MY", name: "Malaysia", region: "Southeast Asia", needsState: true },
  { code: "ID", name: "Indonesia", region: "Southeast Asia", needsState: true },
  { code: "TH", name: "Thailand", region: "Southeast Asia" },
  { code: "VN", name: "Vietnam", region: "Southeast Asia", aliases: ["viet nam"] },
  { code: "PH", name: "Philippines", region: "Southeast Asia" },
  { code: "MM", name: "Myanmar", region: "Southeast Asia", aliases: ["burma"] },
  { code: "KH", name: "Cambodia", region: "Southeast Asia" },
  { code: "LA", name: "Laos", region: "Southeast Asia" },
  { code: "BN", name: "Brunei", region: "Southeast Asia" },
  { code: "TL", name: "Timor-Leste", region: "Southeast Asia", aliases: ["east timor"] },

  // South Asia
  { code: "IN", name: "India", region: "South Asia", needsState: true },
  { code: "PK", name: "Pakistan", region: "South Asia" },
  { code: "BD", name: "Bangladesh", region: "South Asia" },
  { code: "LK", name: "Sri Lanka", region: "South Asia" },
  { code: "NP", name: "Nepal", region: "South Asia" },
  { code: "BT", name: "Bhutan", region: "South Asia" },
  { code: "MV", name: "Maldives", region: "South Asia" },
  { code: "AF", name: "Afghanistan", region: "South Asia" },

  // Central Asia
  { code: "KZ", name: "Kazakhstan", region: "Central Asia" },
  { code: "UZ", name: "Uzbekistan", region: "Central Asia" },
  { code: "KG", name: "Kyrgyzstan", region: "Central Asia" },
  { code: "TJ", name: "Tajikistan", region: "Central Asia" },
  { code: "TM", name: "Turkmenistan", region: "Central Asia" },

  // CIS / Eastern Europe
  { code: "RU", name: "Russia", region: "CIS", aliases: ["russian federation"] },
  { code: "UA", name: "Ukraine", region: "CIS" },
  { code: "BY", name: "Belarus", region: "CIS" },
  { code: "MD", name: "Moldova", region: "CIS" },
  { code: "AZ", name: "Azerbaijan", region: "CIS" },
  { code: "AM", name: "Armenia", region: "CIS" },
  { code: "GE", name: "Georgia", region: "CIS" },

  // Middle East
  { code: "TR", name: "Turkey", region: "Middle East", aliases: ["türkiye", "turkiye"] },
  { code: "AE", name: "United Arab Emirates", region: "Middle East", aliases: ["uae", "emirates"] },
  { code: "SA", name: "Saudi Arabia", region: "Middle East" },
  { code: "QA", name: "Qatar", region: "Middle East" },
  { code: "KW", name: "Kuwait", region: "Middle East" },
  { code: "BH", name: "Bahrain", region: "Middle East" },
  { code: "OM", name: "Oman", region: "Middle East" },
  { code: "JO", name: "Jordan", region: "Middle East" },
  { code: "LB", name: "Lebanon", region: "Middle East" },
  { code: "IL", name: "Israel", region: "Middle East" },
  { code: "IQ", name: "Iraq", region: "Middle East" },
  { code: "IR", name: "Iran", region: "Middle East" },
  { code: "YE", name: "Yemen", region: "Middle East" },
  { code: "PS", name: "Palestine", region: "Middle East" },

  // Western Europe
  { code: "GB", name: "United Kingdom", region: "Europe", aliases: ["uk", "britain", "england"] },
  { code: "IE", name: "Ireland", region: "Europe" },
  { code: "DE", name: "Germany", region: "Europe", aliases: ["deutschland"] },
  { code: "FR", name: "France", region: "Europe" },
  { code: "IT", name: "Italy", region: "Europe", aliases: ["italia"] },
  { code: "ES", name: "Spain", region: "Europe", aliases: ["españa", "espana"] },
  { code: "PT", name: "Portugal", region: "Europe" },
  { code: "NL", name: "Netherlands", region: "Europe", aliases: ["holland"] },
  { code: "BE", name: "Belgium", region: "Europe" },
  { code: "LU", name: "Luxembourg", region: "Europe" },
  { code: "CH", name: "Switzerland", region: "Europe" },
  { code: "AT", name: "Austria", region: "Europe" },
  { code: "MC", name: "Monaco", region: "Europe" },
  { code: "MT", name: "Malta", region: "Europe" },
  { code: "CY", name: "Cyprus", region: "Europe" },

  // Nordics
  { code: "SE", name: "Sweden", region: "Nordics" },
  { code: "NO", name: "Norway", region: "Nordics" },
  { code: "DK", name: "Denmark", region: "Nordics" },
  { code: "FI", name: "Finland", region: "Nordics" },
  { code: "IS", name: "Iceland", region: "Nordics" },

  // Central / Eastern Europe
  { code: "PL", name: "Poland", region: "Europe" },
  { code: "CZ", name: "Czech Republic", region: "Europe", aliases: ["czechia"] },
  { code: "SK", name: "Slovakia", region: "Europe" },
  { code: "HU", name: "Hungary", region: "Europe" },
  { code: "RO", name: "Romania", region: "Europe" },
  { code: "BG", name: "Bulgaria", region: "Europe" },
  { code: "GR", name: "Greece", region: "Europe" },
  { code: "HR", name: "Croatia", region: "Europe" },
  { code: "SI", name: "Slovenia", region: "Europe" },
  { code: "RS", name: "Serbia", region: "Europe" },
  { code: "BA", name: "Bosnia and Herzegovina", region: "Europe" },
  { code: "ME", name: "Montenegro", region: "Europe" },
  { code: "MK", name: "North Macedonia", region: "Europe" },
  { code: "AL", name: "Albania", region: "Europe" },
  { code: "XK", name: "Kosovo", region: "Europe" },

  // Baltics
  { code: "LT", name: "Lithuania", region: "Baltics" },
  { code: "LV", name: "Latvia", region: "Baltics" },
  { code: "EE", name: "Estonia", region: "Baltics" },

  // Oceania
  { code: "AU", name: "Australia", region: "Oceania", needsState: true },
  { code: "NZ", name: "New Zealand", region: "Oceania" },
  { code: "FJ", name: "Fiji", region: "Oceania" },
  { code: "PG", name: "Papua New Guinea", region: "Oceania" },
  { code: "SB", name: "Solomon Islands", region: "Oceania" },
  { code: "VU", name: "Vanuatu", region: "Oceania" },
  { code: "WS", name: "Samoa", region: "Oceania" },
  { code: "TO", name: "Tonga", region: "Oceania" },
  { code: "GU", name: "Guam", region: "Oceania" },

  // Africa
  { code: "ZA", name: "South Africa", region: "Africa" },
  { code: "EG", name: "Egypt", region: "Africa" },
  { code: "MA", name: "Morocco", region: "Africa" },
  { code: "TN", name: "Tunisia", region: "Africa" },
  { code: "DZ", name: "Algeria", region: "Africa" },
  { code: "LY", name: "Libya", region: "Africa" },
  { code: "NG", name: "Nigeria", region: "Africa" },
  { code: "KE", name: "Kenya", region: "Africa" },
  { code: "ET", name: "Ethiopia", region: "Africa" },
  { code: "GH", name: "Ghana", region: "Africa" },
  { code: "SN", name: "Senegal", region: "Africa" },
  { code: "CI", name: "Côte d'Ivoire", region: "Africa", aliases: ["ivory coast", "cote d ivoire"] },
  { code: "CM", name: "Cameroon", region: "Africa" },
  { code: "UG", name: "Uganda", region: "Africa" },
  { code: "TZ", name: "Tanzania", region: "Africa" },
  { code: "RW", name: "Rwanda", region: "Africa" },
  { code: "ZM", name: "Zambia", region: "Africa" },
  { code: "ZW", name: "Zimbabwe", region: "Africa" },
  { code: "BW", name: "Botswana", region: "Africa" },
  { code: "NA", name: "Namibia", region: "Africa" },
  { code: "MZ", name: "Mozambique", region: "Africa" },
  { code: "AO", name: "Angola", region: "Africa" },
  { code: "MG", name: "Madagascar", region: "Africa" },
  { code: "MU", name: "Mauritius", region: "Africa" },
  { code: "SC", name: "Seychelles", region: "Africa" },
];

export function flagEmoji(code: string): string {
  if (!code || code.length !== 2) return "🌐";
  const base = 0x1f1e6;
  const A = "A".charCodeAt(0);
  const upper = code.toUpperCase();
  return (
    String.fromCodePoint(base + upper.charCodeAt(0) - A) +
    String.fromCodePoint(base + upper.charCodeAt(1) - A)
  );
}

export function searchCountries(query: string, limit = 8): Country[] {
  const q = query.trim().toLowerCase();
  if (!q) return [];
  const startsWith: Country[] = [];
  const contains: Country[] = [];
  const aliasHit: Country[] = [];

  for (const c of countries) {
    const name = c.name.toLowerCase();
    if (name.startsWith(q)) {
      startsWith.push(c);
      continue;
    }
    if (c.aliases?.some((a) => a.startsWith(q))) {
      aliasHit.push(c);
      continue;
    }
    if (name.includes(q) || c.aliases?.some((a) => a.includes(q))) {
      contains.push(c);
    }
  }
  return [...startsWith, ...aliasHit, ...contains].slice(0, limit);
}

export function findCountryByCode(code: string): Country | undefined {
  return countries.find((c) => c.code === code);
}
