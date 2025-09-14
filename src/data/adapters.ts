import { sheetMap } from "./sheetMap";

type Raw = Record<string, any>;

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

  const stat1Label = toStr(raw[sheetMap.stat1Label]);
  const stat2Label = toStr(raw[sheetMap.stat2Label]);
  const stat3Label = toStr(raw[sheetMap.stat3Label]);

  const stat1 = toNum(raw[sheetMap.stat1Value]);
  const stat2 = toNum(raw[sheetMap.stat2Value]);
  const stat3 = toNum(raw[sheetMap.stat3Value]);

  const stats: FeedState["stats"] = {};
  const put = (label?: string, val?: number) => {
    if (!label || val == null) return;
    const l = label.toLowerCase();
    if (l.includes("mention")) stats.mentions = val;
    else if (l.includes("review")) stats.newReviews = val;
    else if (l.includes("impression") || l.includes("click")) stats.impressions = val;
  };
  put(stat1Label, stat1);
  put(stat2Label, stat2);
  put(stat3Label, stat3);

  return { kpis, feed: { titles, texts, stats } };
}