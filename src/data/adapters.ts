// src/data/adapters.ts
// Normalizes raw Sheets values into app state shapes.

import { sheetMap } from "./sheetMap";

type Raw = Record<string, string | number | undefined>;

export type FeedState = {
  titles: string[];
  texts: string[];
  stats?: {
    mentions?: number;
    newReviews?: number;
    impressions?: number;
  };
};

export type AppData = {
  kpis: Record<string, number>;
  feed: FeedState;
  // ...other domains like overrides if you use them
};

function toNum(v: any): number | undefined {
  if (v === null || v === undefined) return undefined;
  const n = Number(String(v).replace(/[^\d.-]/g, ""));
  return Number.isFinite(n) ? n : undefined;
}

export function adapt(raw: Raw): AppData {
  // ---- KPIs (minimal example; keep your existing mapping as needed) ----
  const kpis: Record<string, number> = {};
  const kpiKeys = [
    "sales",
    "cogs",
    "laborPct",
    "bankBalance",
    "primeCost",
    "fixedCost",
    "onlineViews",
    "netProfit",
    "reviewScore",
  ] as const;
  for (const key of kpiKeys) {
    const r = sheetMap[key];
    const num = toNum(raw[r]);
    if (num !== undefined) kpis[key] = num;
  }

  // ---- Live feed titles/texts ----
  const titles = [
    String(raw[sheetMap.feed1Title] ?? "").trim(),
    String(raw[sheetMap.feed2Title] ?? "").trim(),
    String(raw[sheetMap.feed3Title] ?? "").trim(),
  ];
  const texts = [
    String(raw[sheetMap.feed1Text] ?? "").trim(),
    String(raw[sheetMap.feed2Text] ?? "").trim(),
    String(raw[sheetMap.feed3Text] ?? "").trim(),
  ];

  // ---- New: stats chips (A20–A22 names, B20–B22 values) ----
  const statMentions = toNum(raw[sheetMap.statMentionsValue]);
  const statNewReviews = toNum(raw[sheetMap.statNewReviewsValue]);
  const statImpressions = toNum(raw[sheetMap.statImpressionsValue]);

  const feed: FeedState = { titles, texts };
  feed.stats = {
    mentions: statMentions,
    newReviews: statNewReviews,
    impressions: statImpressions,
  };

  return { kpis, feed };
}