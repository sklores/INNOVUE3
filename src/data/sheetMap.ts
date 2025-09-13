// src/data/sheetMap.ts
// Tab name has a space → wrap it in single quotes in A1 notation.
const TAB = "'GCDC Test Sheet'";

export const sheetMap = {
  sales:           `${TAB}!B2`,   // Sales
  cogs:            `${TAB}!B3`,   // COGs
  laborPct:        `${TAB}!B4`,   // Labor %
  bankBalance:     `${TAB}!B5`,   // Bank Balance
  fixedCost:       `${TAB}!B7`,   // Fixed Cost
  onlineViews:     `${TAB}!B10`,  // Online Views
  profit:          `${TAB}!B11`,  // Net Profit
  reviewScore:     `${TAB}!B12`,  // Review Score

  // These two rows in your sheet currently hold text; they’ll parse to 0 (expected in M1).
  accountsPayable: `${TAB}!B14`,  // Bank Transactions row (placeholder)
  newItems:        `${TAB}!B15`,  // Social Media row (placeholder)
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
  sheetMap.newItems,
];