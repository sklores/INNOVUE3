// Maps raw { [A1]: value } into the app shape expected by selectors/components.
// M1 baseline: titles/texts only (A15–A17 / B15–B17). KPIs are tolerant to
// which keys exist in sheetMap and to strongly-typed A1 strings (with sheet names).

import { sheetMap } from "./sheetMap";

type Raw = Record<string, any>;

export type FeedState = {
  titles: string[];
  texts: string[];
  // stats optional; UI tolerates undefined
  stats?: {
    mentions?: number;
    newReviews?: number;
    impressions?: number;
  };
};

export type AppData = {
  kpis: Record<string, number>;
  feed: FeedState;
};

function toNum(v: any): number | undefined {
  if (v == null) return undefined;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}
function toStr(v: any): string {
  return String(v ?? "").trim();
}

// Safe getter for A1 from sheetMap regardless of its literal typing
const M: Record<string, string> = sheetMap as unknown as Record<string, string>;
function a1(key: string): string | undefined {
  const v = M[key];
  return typeof v === "string" && v.length ? v : undefined;
}

export function adapt(raw: Raw): AppData {
  const kpis: Record<string, number> = {};

  // Only include KPI keys that actually exist in the current sheetMap
  const KPI_KEYS = [
    "sales",
    "cogs",
    "laborPct",
    "bankBalance",
    // "primeCost", // not present in your SSOT sheetMap; leave commented
    "fixedCost",
    "onlineViews",
    "netProfit",
    "reviewScore",
  ];

  for (const key of KPI_KEYS) {
    const ref = a1(key);
    if (!ref) continue;
    const n = toNum(raw[ref]);
    if (n != null) kpis[key] = n;
  }

  // Live feed titles/texts – tolerate missing cells
  const titles = [
    toStr(raw[a1("feed1Title")!] ?? ""),
    toStr(raw[a1("feed2Title")!] ?? ""),
    toStr(raw[a1("feed3Title")!] ?? ""),
  ];
  const texts = [
    toStr(raw[a1("feed1Text")!] ?? ""),
    toStr(raw[a1("feed2Text")!] ?? ""),
    toStr(raw[a1("feed3Text")!] ?? ""),
  ];

  return { kpis, feed: { titles, texts } };
}