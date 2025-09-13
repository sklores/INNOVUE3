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
  newItems: number;
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

export type WeatherData = {
  mode: "clear" | "cloudy" | "rain" | "thunderstorm";
  intensity: number; // 0..1
  temp?: number;
};

function num(s?: string): number | undefined {
  if (!s) return undefined;
  const cleaned = s.replace(/[$,%\s,]/g, "");
  const n = parseFloat(cleaned);
  return Number.isFinite(n) ? n : undefined;
}

function money(s?: string): number {
  return num(s) ?? 0;
}
function percent(s?: string): number {
  const n = num(s);
  if (n === undefined) return 0;
  // if user typed 0.42 treat as 42%
  return n <= 1 ? n * 100 : n;
}

// Normalize Sheets payload → KPIData + Overrides
export function adaptKpis(batch: Record<string, string | undefined>): KPIData {
  const now = Date.now();
  return {
    sales: money(batch[sheetMap.sales]),
    profit: money(batch[sheetMap.profit]),
    laborPct: Math.max(0, Math.min(100, percent(batch[sheetMap.laborPct]))),
    cogs: money(batch[sheetMap.cogs]),
    onlineViews: money(batch[sheetMap.onlineViews]),
    reviewScore: money(batch[sheetMap.reviewScore]),
    fixedCost: money(batch[sheetMap.fixedCost]),
    accountsPayable: money(batch[sheetMap.accountsPayable]),
    bankBalance: money(batch[sheetMap.bankBalance]),
    newItems: money(batch[sheetMap.newItems]),
    updatedAt: now,
  };
}

export function adaptOverrides(batch: Record<string, string | undefined>): Overrides {
  const get = (r: string) => (batch[r]?.trim() ?? "");
  const tm = get(sheetMap.overrides.testMode).toLowerCase();
  const toNum = (r: string) => (num(get(r)) ?? undefined);

  return {
    testMode: tm === "true" || tm === "1" || tm === "yes",
    weatherOverride: (get(sheetMap.overrides.weatherOverride).toLowerCase() as any) || undefined,
    timeOverride: (get(sheetMap.overrides.timeOverride).toLowerCase() as any) || undefined,
    laborOverride: toNum(sheetMap.overrides.laborOverride),
    salesOverride: toNum(sheetMap.overrides.salesOverride),
    profitOverride: toNum(sheetMap.overrides.profitOverride),
    bankOverride: toNum(sheetMap.overrides.bankOverride),
    newItemsOverride: toNum(sheetMap.overrides.newItemsOverride),
  };
}

// Apply overrides when testMode true.
export function mergeOverrides(k: KPIData, o: Overrides): KPIData {
  if (!o.testMode) return k;
  return {
    ...k,
    laborPct: o.laborOverride ?? k.laborPct,
    sales: o.salesOverride ?? k.sales,
    profit: o.profitOverride ?? k.profit,
    bankBalance: o.bankOverride ?? k.bankBalance,
    newItems: o.newItemsOverride ?? k.newItems,
  };
}