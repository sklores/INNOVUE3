// src/data/sheetMap.ts
// Maps human-readable keys to A1 ranges on the active sheet.

export const sheetMap = {
    // ---- KPIs (existing) ----
    sales: "B2",
    cogs: "B3",
    laborPct: "B4",
    bankBalance: "B5",
    primeCost: "B6",
    fixedCost: "B7",
    onlineViews: "B10",
    netProfit: "B11",
    reviewScore: "B12",
  
    // ---- Live feed titles/texts (existing) ----
    feed1Title: "A15",
    feed1Text: "B15",
    feed2Title: "A16",
    feed2Text: "B16",
    feed3Title: "A17",
    feed3Text: "B17",
  
    // ---- New: social stats chips ----
    statMentionsLabel: "A20",
    statMentionsValue: "B20",
    statNewReviewsLabel: "A21",
    statNewReviewsValue: "B21",
    statImpressionsLabel: "A22",
    statImpressionsValue: "B22",
  } as const;
  
  // Helper to get all ranges for the batch request
  export const allRanges: string[] = Object.values(sheetMap);