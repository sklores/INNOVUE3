// Maps raw { [A1]: value } into the app shape expected by selectors/components.
// M1 baseline: titles/texts only (A15–A17 / B15–B17). No chips yet.

import { sheetMap } from "./sheetMap";

type Raw = Record<string, any>;

export type FeedState = {
  titles: string[];
  texts: string[];
  // stats is optional; LiveFeedPanel tolerates undefined
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

export function adapt(raw: Raw): AppData {
  const kpis: Record<string, number> = {};
  ([
    "sales",
    "cogs",
    "laborPct",
    "bankBalance",
    "primeCost",
    "fixedCost",
    "onlineViews",
    "netProfit",
    "reviewScore",
  ] as const).forEach((k) => {
    const n = toNum(raw[sheetMap[k]]);
    if (n != null) kpis[k] = n;
  });

  const titles = [
    toStr(raw[sheetMap.feed1Title]),
    toStr(raw[sheetMap.feed2Title]),
    toStr(raw[sheetMap.feed3Title]),
  ];
  const texts = [
    toStr(raw[sheetMap.feed1Text]),
    toStr(raw[sheetMap.feed2Text]),
    toStr(raw[sheetMap.feed3Text]),
  ];

  return { kpis, feed: { titles, texts } };
}