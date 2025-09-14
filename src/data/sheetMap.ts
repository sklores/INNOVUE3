// src/data/sheetMap.ts
// Tab name has a space → wrap it in single quotes in A1 notation.
const TAB = "'GCDC Test Sheet'";

export const sheetMap = {
  // KPI data (column B)
  sales:           `${TAB}!B2`,
  cogs:            `${TAB}!B3`,
  laborPct:        `${TAB}!B4`,
  bankBalance:     `${TAB}!B5`,
  fixedCost:       `${TAB}!B7`,
  onlineViews:     `${TAB}!B10`,
  profit:          `${TAB}!B11`,
  reviewScore:     `${TAB}!B12`,
  accountsPayable: `${TAB}!B14`,  // this row is text today; parses 0 in M1 (ok)

  // ---- GCDC Live Feed ----
  feed1Title: `${TAB}!A15`,
  feed1Text:  `${TAB}!B15`,
  feed2Title: `${TAB}!A16`,
  feed2Text:  `${TAB}!B16`,
  feed3Title: `${TAB}!A17`,
  feed3Text:  `${TAB}!B17`,
} as const;

export type SheetKey = keyof typeof sheetMap;

export const allRanges: string[] = [
  sheetMap.sales,
  sheetMap.cogs,
  sheetMap.laborPct,
  sheetMap.bankBalance,
  sheetMap.fixedCost,
  sheetMap.onlineViews,
  sheetMap.profit,
  sheetMap.reviewScore,
  sheetMap.accountsPayable,

  // Live Feed
  sheetMap.feed1Title,
  sheetMap.feed1Text,
  sheetMap.feed2Title,
  sheetMap.feed2Text,
  sheetMap.feed3Title,
  sheetMap.feed3Text,
];