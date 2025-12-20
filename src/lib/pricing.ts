/**
 * Region-based pricing configuration
 * Each region has its own base currency and base price
 * This is NOT derived from exchange rates, but manually defined per region
 */

export type RegionPricing = {
  /** ISO 3166-1 alpha-2 country code */
  countryCode: string;
  /** ISO 4217 currency code */
  baseCurrency: string;
  /** Base price for the product/service in the region's currency */
  basePrice: number;
  /** Locale code for number/currency formatting */
  locale: string;
  /** Region name for display purposes */
  regionName: string;
};

/**
 * Global region pricing map
 * Keys: ISO country codes (e.g., 'IN', 'US', 'GB', etc.)
 * Values: Region-specific pricing configuration
 *
 * Add new regions as needed - the system is scalable and country-agnostic
 */
export const REGION_PRICING_MAP: Record<string, RegionPricing> = {
  // Asia-Pacific
  IN: {
    countryCode: "IN",
    baseCurrency: "INR",
    basePrice: 9999,
    locale: "en-IN",
    regionName: "India",
  },
  SG: {
    countryCode: "SG",
    baseCurrency: "SGD",
    basePrice: 149,
    locale: "en-SG",
    regionName: "Singapore",
  },
  MY: {
    countryCode: "MY",
    baseCurrency: "MYR",
    basePrice: 649,
    locale: "ms-MY",
    regionName: "Malaysia",
  },
  ID: {
    countryCode: "ID",
    baseCurrency: "IDR",
    basePrice: 2499000,
    locale: "id-ID",
    regionName: "Indonesia",
  },
  TH: {
    countryCode: "TH",
    baseCurrency: "THB",
    basePrice: 4999,
    locale: "th-TH",
    regionName: "Thailand",
  },
  AU: {
    countryCode: "AU",
    baseCurrency: "AUD",
    basePrice: 199,
    locale: "en-AU",
    regionName: "Australia",
  },
  NZ: {
    countryCode: "NZ",
    baseCurrency: "NZD",
    basePrice: 219,
    locale: "en-NZ",
    regionName: "New Zealand",
  },
  JP: {
    countryCode: "JP",
    baseCurrency: "JPY",
    basePrice: 17999,
    locale: "ja-JP",
    regionName: "Japan",
  },
  HK: {
    countryCode: "HK",
    baseCurrency: "HKD",
    basePrice: 1199,
    locale: "zh-HK",
    regionName: "Hong Kong",
  },
  CN: {
    countryCode: "CN",
    baseCurrency: "CNY",
    basePrice: 999,
    locale: "zh-CN",
    regionName: "China",
  },

  // Middle East
  AE: {
    countryCode: "AE",
    baseCurrency: "AED",
    basePrice: 549,
    locale: "ar-AE",
    regionName: "United Arab Emirates",
  },
  SA: {
    countryCode: "SA",
    baseCurrency: "SAR",
    basePrice: 559,
    locale: "ar-SA",
    regionName: "Saudi Arabia",
  },
  QA: {
    countryCode: "QA",
    baseCurrency: "QAR",
    basePrice: 549,
    locale: "ar-QA",
    regionName: "Qatar",
  },
  BH: {
    countryCode: "BH",
    baseCurrency: "BHD",
    basePrice: 53,
    locale: "ar-BH",
    regionName: "Bahrain",
  },
  KW: {
    countryCode: "KW",
    baseCurrency: "KWD",
    basePrice: 46,
    locale: "ar-KW",
    regionName: "Kuwait",
  },
  OM: {
    countryCode: "OM",
    baseCurrency: "OMR",
    basePrice: 48,
    locale: "ar-OM",
    regionName: "Oman",
  },

  // Europe
  GB: {
    countryCode: "GB",
    baseCurrency: "GBP",
    basePrice: 129,
    locale: "en-GB",
    regionName: "United Kingdom",
  },
  DE: {
    countryCode: "DE",
    baseCurrency: "EUR",
    basePrice: 119,
    locale: "de-DE",
    regionName: "Germany",
  },
  FR: {
    countryCode: "FR",
    baseCurrency: "EUR",
    basePrice: 119,
    locale: "fr-FR",
    regionName: "France",
  },
  IT: {
    countryCode: "IT",
    baseCurrency: "EUR",
    basePrice: 119,
    locale: "it-IT",
    regionName: "Italy",
  },
  ES: {
    countryCode: "ES",
    baseCurrency: "EUR",
    basePrice: 119,
    locale: "es-ES",
    regionName: "Spain",
  },
  SE: {
    countryCode: "SE",
    baseCurrency: "SEK",
    basePrice: 1299,
    locale: "sv-SE",
    regionName: "Sweden",
  },
  CH: {
    countryCode: "CH",
    baseCurrency: "CHF",
    basePrice: 139,
    locale: "de-CH",
    regionName: "Switzerland",
  },
  NL: {
    countryCode: "NL",
    baseCurrency: "EUR",
    basePrice: 119,
    locale: "nl-NL",
    regionName: "Netherlands",
  },

  // Americas
  US: {
    countryCode: "US",
    baseCurrency: "USD",
    basePrice: 139,
    locale: "en-US",
    regionName: "United States",
  },
  CA: {
    countryCode: "CA",
    baseCurrency: "CAD",
    basePrice: 189,
    locale: "en-CA",
    regionName: "Canada",
  },
  MX: {
    countryCode: "MX",
    baseCurrency: "MXN",
    basePrice: 2499,
    locale: "es-MX",
    regionName: "Mexico",
  },
  BR: {
    countryCode: "BR",
    baseCurrency: "BRL",
    basePrice: 699,
    locale: "pt-BR",
    regionName: "Brazil",
  },

  // Africa
  ZA: {
    countryCode: "ZA",
    baseCurrency: "ZAR",
    basePrice: 2399,
    locale: "en-ZA",
    regionName: "South Africa",
  },
  EG: {
    countryCode: "EG",
    baseCurrency: "EGP",
    basePrice: 4299,
    locale: "ar-EG",
    regionName: "Egypt",
  },

  // South Asia
  PK: {
    countryCode: "PK",
    baseCurrency: "PKR",
    basePrice: 18499,
    locale: "ur-PK",
    regionName: "Pakistan",
  },
  LK: {
    countryCode: "LK",
    baseCurrency: "LKR",
    basePrice: 45999,
    locale: "si-LK",
    regionName: "Sri Lanka",
  },
  BD: {
    countryCode: "BD",
    baseCurrency: "BDT",
    basePrice: 13499,
    locale: "bn-BD",
    regionName: "Bangladesh",
  },
};

/** Default region (fallback) */
export const DEFAULT_REGION_CODE = "IN";

/**
 * Get pricing configuration for a country
 * If not found, returns default region
 */
export function getRegionPricing(countryCode?: string): RegionPricing {
  if (!countryCode) {
    return REGION_PRICING_MAP[DEFAULT_REGION_CODE]!;
  }

  const normalized = countryCode.toUpperCase();
  return REGION_PRICING_MAP[normalized] || REGION_PRICING_MAP[DEFAULT_REGION_CODE]!;
}

/**
 * Get all available regions (useful for admin/config pages)
 */
export function getAllRegions(): RegionPricing[] {
  return Object.values(REGION_PRICING_MAP);
}
