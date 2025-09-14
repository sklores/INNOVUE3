// src/data/adapters.ts
import { sheetMap } from "./sheetMap";

export type KPIData = {
  sales: number;
  profit: number;
  laborPct: number;        // 0..100
  cogs: number;
  onlineViews: number;
  reviewScore: number;
  fixedCost: number;
  accountsPayable: number;
  bankBalance: number;
  newItems: number;        // unused today (0 default)
  updatedAt: number;
};

export type Overrides = {
  testMode: boolean;
  weatherOverride?: "clear" | "cloudy" | "rain" | "thunderstorm" | "";
  timeOverride?: "day" | "night" | "auto" | "";
  laborOverride?: number;
  salesOverride?: number;
  profitOverride?: number;
  bankOverride?: number;
  newItemsOverride?: number;
};

export type LiveFeed = {
  titles: [string, string, string]; // A15, A16, A17
  texts:  [string, string, string]; // B15, B16, B17
};

function num(s?: string): number | undefined {
  if (!s) return undefined;
  const cleaned = s.replace(/[$,%\s,]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : undefined;
}
function money(s?: string): number { return num(s) ?? 0; }
function percent(s?: string): number {
  const n = num(s);
  if (n === undefined) return 0;
  return n <= 1 ? n * 100 : n; // allow 0.42 => 42%
}
function str(s?: string): string { return (s ?? "").toString().trim(); }

// ----------------- KPI normalization -----------------
export function adaptKpis(batch: Record<string, string | undefined>): KPIData {
  const now = Date.now();
  return {
    sales:           money(batch[sheetMap.sales]),
    profit:          money(batch[sheetMap.profit]),
    laborPct:        Math.max(0, Math.min(100, percent(batch[sheetMap.laborPct]))),
    cogs:            money(batch[sheetMap.cogs]),
    onlineViews:     money(batch[sheetMap.onlineViews]),
    reviewScore:     money(batch[sheetMap.reviewScore]),
    fixedCost:       money(batch[sheetMap.fixedCost]),
    accountsPayable: money(batch[sheetMap.accountsPayable]),
    bankBalance:     money(batch[sheetMap.bankBalance]),
    newItems:        0,
    updatedAt: now,
  };
}

// ----------------- Live Feed -----------------
export function adaptLiveFeed(batch: Record<string, string | undefined>): LiveFeed {
  const titles: [string, string, string] = [
    str(batch[sheetMap.feed1Title]),
    str(batch[sheetMap.feed2Title]),
    str(batch[sheetMap.feed3Title]),
  ];
  const texts: [string, string, string] = [
    str(batch[sheetMap.feed1Text]),
    str(batch[sheetMap.feed2Text]),
    str(batch[sheetMap.feed3Text]),
  ];
  return { titles, texts };
}

// ----------------- Overrides -----------------
export function adaptOverrides(batch: Record<string, string | undefined>): Overrides {
  const sm: any = sheetMap as any;
  if (!sm.overrides) return { testMode: false };
  const get = (r: string) => (batch[r]?.trim() ?? "");
  const tm = get(sm.overrides.testMode).toLowerCase();
  const toNum = (r: string) => (num(get(r)) ?? undefined);

  return {
    testMode: tm === "true" || tm === "1" || tm === "yes",
    weatherOverride: (get(sm.overrides.weatherOverride).toLowerCase() as any) || undefined,
    timeOverride:    (get(sm.overrides.timeOverride).toLowerCase() as any) || undefined,
    laborOverride:   toNum(sm.overrides.laborOverride),
    salesOverride:   toNum(sm.overrides.salesOverride),
    profitOverride:  toNum(sm.overrides.profitOverride),
    bankOverride:    toNum(sm.overrides.bankOverride),
    newItemsOverride: toNum(sm.overrides.newItemsOverride),
  };
}

export function mergeOverrides(k: KPIData, o: Overrides): KPIData {
  if (!o?.testMode) return k;
  return {
    ...k,
    laborPct:    o.laborOverride   ?? k.laborPct,
    sales:       o.salesOverride   ?? k.sales,
    profit:      o.profitOverride  ?? k.profit,
    bankBalance: o.bankOverride    ?? k.bankBalance,
    newItems:    o.newItemsOverride ?? k.newItems,
  };
}