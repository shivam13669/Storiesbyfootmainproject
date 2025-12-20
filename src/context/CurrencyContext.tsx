import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CURRENCIES, INR_BASE_CODE, formatNumberAsCurrency, parseINRStringToNumber } from "@/lib/currency";

const STORAGE_KEY = "sb_currency";
const CACHE_KEY = "sb_currency_rates_cache";
const CACHE_EXPIRY_MS = 1000 * 60 * 60; // 1 hour

type RatesMap = Record<string, number>;

interface CachedRates {
  rates: RatesMap;
  timestamp: number;
  apiSource: string;
}

type CurrencyContextValue = {
  currency: string;
  setCurrency: (code: string) => void;
  convertFromINR: (amountInINR: number) => number;
  formatFromINR: (amountInINR: number, opts?: { maximumFractionDigits?: number }) => string;
  rates: RatesMap;
  isLoading: boolean;
  lastUpdated?: string;
  cacheStatus?: string;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

// Emergency fallback rates (as safety net)
const EMERGENCY_RATES: RatesMap = {
  INR: 1,
  USD: 83.5,
  EUR: 90.2,
  GBP: 104.5,
  AED: 22.75,
  SGD: 62.0,
  AUD: 54.0,
  CAD: 61.5,
  JPY: 0.57,
  CNY: 11.5,
  CHF: 93.0,
  HKD: 10.75,
  NZD: 50.5,
  SEK: 7.9,
  NOK: 7.9,
  DKK: 12.1,
  ZAR: 4.6,
  THB: 2.37,
  MYR: 18.0,
  IDR: 0.0053,
  LKR: 0.31,
  BHD: 221.5,
  QAR: 22.9,
  OMR: 216.5,
  KWD: 271.0,
};

function getCachedRates(): CachedRates | null {
  try {
    const cached = localStorage.getItem(CACHE_KEY);
    if (!cached) return null;
    const parsed = JSON.parse(cached) as CachedRates;
    const age = Date.now() - parsed.timestamp;
    if (age > CACHE_EXPIRY_MS) {
      console.log("[CACHE] Cache expired, fetching fresh rates");
      return null;
    }
    const ageSeconds = Math.round(age / 1000);
    console.log(`[CACHE] Using cached rates from ${parsed.apiSource} (${ageSeconds} sec old)`);
    return parsed;
  } catch {
    return null;
  }
}

function setCachedRates(rates: RatesMap, apiSource: string): void {
  try {
    const cache: CachedRates = {
      rates,
      timestamp: Date.now(),
      apiSource,
    };
    localStorage.setItem(CACHE_KEY, JSON.stringify(cache));
    console.log(`[CACHE] Saved fresh rates from ${apiSource}`);
  } catch {
    console.log("[CACHE] Failed to save rates to localStorage");
  }
}

async function fetchRatesBaseINR(signal?: AbortSignal): Promise<{
  rates: RatesMap;
  date?: string;
  apiSource: string;
}> {
  // Check cache first
  const cached = getCachedRates();
  if (cached) {
    return { rates: cached.rates, apiSource: cached.apiSource };
  }

  // Primary API: exchangerate.host
  console.log("[API] Attempting exchangerate.host...");
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=INR", { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && Object.keys(data.rates).length > 0) {
        console.log(`[API] ✓ exchangerate.host succeeded for INR (${Object.keys(data.rates).length} rates)`);
        const rates = data.rates as RatesMap;
        setCachedRates(rates, "exchangerate.host");
        return { rates, date: data.date, apiSource: "exchangerate.host" };
      }
    }
  } catch (error) {
    console.log("[API] ✗ exchangerate.host failed:", error instanceof Error ? error.message : String(error));
  }

  // Fallback API: open.er-api.com
  console.log("[API] Attempting open.er-api.com...");
  try {
    const res = await fetch("https://open.er-api.com/v6/latest/INR", { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates && Object.keys(data.rates).length > 0) {
        console.log(`[API] ✓ open.er-api.com succeeded for INR (${Object.keys(data.rates).length} rates)`);
        const rates = data.rates as RatesMap;
        setCachedRates(rates, "open.er-api.com");
        return { rates, apiSource: "open.er-api.com" };
      }
    }
  } catch (error) {
    console.log("[API] ✗ open.er-api.com failed:", error instanceof Error ? error.message : String(error));
  }

  // Final fallback: emergency rates
  console.log("[API] Both APIs failed, using emergency rates");
  return { rates: EMERGENCY_RATES, apiSource: "emergency-fallback" };
}

export function CurrencyProvider({ children }: { children: React.ReactNode }) {
  const [currency, setCurrencyState] = useState<string>(() => {
    try {
      const saved = localStorage.getItem(STORAGE_KEY);
      return saved || INR_BASE_CODE;
    } catch {
      return INR_BASE_CODE;
    }
  });

  const [cacheStatus, setCacheStatus] = useState<string>("");

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  const { data, isLoading } = useQuery({
    queryKey: ["fx-rates", INR_BASE_CODE],
    queryFn: ({ signal }) => fetchRatesBaseINR(signal),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 5, // refresh every 5 minutes
    refetchOnWindowFocus: false,
  });

  const rates: RatesMap = useMemo(() => {
    const map: RatesMap = { [INR_BASE_CODE]: 1 };
    if (data?.rates) {
      for (const [code, rate] of Object.entries(data.rates)) {
        if (typeof rate === "number" && rate > 0) {
          map[code] = rate;
        }
      }
    }
    const ratesLog = Object.entries(map)
      .slice(0, 5)
      .map(([code, rate]) => `${code}=${rate}`)
      .join(" ");
    console.log(`[RATES MAP] Built from ${data?.apiSource || "unknown"} | ${ratesLog}${Object.keys(map).length > 5 ? " ..." : ""}`);
    return map;
  }, [data]);

  const setCurrency = useCallback((code: string) => {
    const exists = CURRENCIES.some((c) => c.code === code);
    setCurrencyState(exists ? code : INR_BASE_CODE);
  }, []);

  const convertFromINR = useCallback(
    (amountInINR: number) => {
      if (!Number.isFinite(amountInINR)) return 0;

      const baseRate = rates[INR_BASE_CODE] ?? 1;
      const targetRate = rates[currency] ?? 1;

      const converted = (amountInINR / baseRate) * targetRate;
      console.log(`[CONVERSION] ${amountInINR} INR (rate: ${targetRate}) → ${currency} (rate: ${baseRate}) = ${converted}`);
      return converted;
    },
    [currency, rates]
  );

  const formatFromINR = useCallback(
    (amountInINR: number, opts?: { maximumFractionDigits?: number }) => {
      const value = convertFromINR(amountInINR);
      return formatNumberAsCurrency(value, currency, opts?.maximumFractionDigits ?? 0);
    },
    [convertFromINR, currency]
  );

  const value: CurrencyContextValue = {
    currency,
    setCurrency,
    convertFromINR,
    formatFromINR,
    rates,
    isLoading,
    lastUpdated: data?.date,
    cacheStatus,
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

export function parseINR(value: string | undefined): number | undefined {
  if (!value) return undefined;
  return parseINRStringToNumber(value);
}
