import React, { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import { useQuery } from "@tanstack/react-query";
import { CURRENCIES, INR_BASE_CODE, formatNumberAsCurrency, parseINRStringToNumber } from "@/lib/currency";

const STORAGE_KEY = "sb_currency";

type RatesMap = Record<string, number>;

type CurrencyContextValue = {
  currency: string; // selected target code
  setCurrency: (code: string) => void;
  // Convert an amount in INR (base) to selected currency
  convertFromINR: (amountInINR: number) => number;
  // Format amount in INR to selected currency string
  formatFromINR: (amountInINR: number, opts?: { maximumFractionDigits?: number }) => string;
  // Expose raw rates and status
  rates: RatesMap;
  isLoading: boolean;
  lastUpdated?: string;
};

const CurrencyContext = createContext<CurrencyContextValue | undefined>(undefined);

async function fetchRatesBaseINR(signal?: AbortSignal): Promise<{ rates: RatesMap; date?: string }> {
  // Primary: exchangerate.host (no key required)
  try {
    const res = await fetch("https://api.exchangerate.host/latest?base=INR", { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return { rates: data.rates as RatesMap, date: data.date };
      }
    }
  } catch {}

  // Fallback: Frankfurter API (limited set)
  try {
    const res = await fetch("https://api.frankfurter.app/latest?from=INR", { signal });
    if (res.ok) {
      const data = await res.json();
      if (data && data.rates) {
        return { rates: data.rates as RatesMap, date: data.date };
      }
    }
  } catch {}

  // As a last resort, identity for INR only
  return { rates: { [INR_BASE_CODE]: 1 } };
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

  useEffect(() => {
    try {
      localStorage.setItem(STORAGE_KEY, currency);
    } catch {}
  }, [currency]);

  const { data, isLoading } = useQuery({
    queryKey: ["fx-rates", INR_BASE_CODE],
    queryFn: ({ signal }) => fetchRatesBaseINR(signal),
    staleTime: 1000 * 60 * 60, // 1 hour
    refetchInterval: 1000 * 60 * 60, // refresh every 1 hour automatically
    refetchOnWindowFocus: false,
  });

  const rates: RatesMap = useMemo(() => {
    const map: RatesMap = { [INR_BASE_CODE]: 1 };
    if (data?.rates) {
      for (const [code, rate] of Object.entries(data.rates)) {
        if (typeof rate === "number" && rate > 0) map[code] = rate;
      }
    }
    return map;
  }, [data]);

  const setCurrency = useCallback((code: string) => {
    const exists = CURRENCIES.some((c) => c.code === code);
    setCurrencyState(exists ? code : INR_BASE_CODE);
  }, []);

  const convertFromINR = useCallback(
    (amountInINR: number) => {
      if (!Number.isFinite(amountInINR)) return 0;
      const rate = rates[currency] ?? 1; // default INR
      return amountInINR * rate;
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
  };

  return <CurrencyContext.Provider value={value}>{children}</CurrencyContext.Provider>;
}

export function useCurrency() {
  const ctx = useContext(CurrencyContext);
  if (!ctx) throw new Error("useCurrency must be used within CurrencyProvider");
  return ctx;
}

// Helper to extract INR number from existing string values in data
export function parseINR(value: string | undefined): number | undefined {
  if (!value) return undefined;
  return parseINRStringToNumber(value);
}
