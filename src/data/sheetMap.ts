// src/data/sheetMap.ts
// Ranges mapped to your "GCDC Test Sheet" tab (column B = Data).
// No overrides included yet (we'll add later to avoid 400s).

const TAB = "GCDC Test Sheet";

export const sheetMap = {
  // Data column (B) rows in your screenshot:
  sales:           `${TAB}!B2`,   // Sales
  cogs:            `${TAB}!B3`,   // COGs
  laborPct:        `${TAB}!B4`,   // Labor %
  bankBalance:     `${TAB}!B5`,   // Bank Balance
  // prime cost exists in the sheet at B6 but we don't consume it in M1
  fixedCost:       `${TAB}!B7`,   // Fixed Cost
  // optional/text rows are fine; we parse 0 if non-numeric/blank
  onlineViews:     `${TAB}!B10`,  // Online Views
  profit:          `${TAB}!B11`,  // Net Profit
  reviewScore:     `${TAB}!B12`,  // Review Score
  accountsPayable: `${TAB}!B14`,  // Bank Transactions (placeholder → parses 0)
  newItems:        `${TAB}!B15`,  // Social Media (placeholder → parses 0)
} as const;

export type SheetKey = keyof typeof sheetMap;

// Only include ranges that actually exist to avoid 400 errors
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