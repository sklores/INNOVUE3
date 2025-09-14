// src/data/sheetMap.ts
// A1 mappings used by the Sheets client + adapters

export const sheetMap = {
    // ---- KPIs (keep your existing keys as-is) ----
    sales: "B2",
    cogs: "B3",
    laborPct: "B4",
    bankBalance: "B5",
    primeCost: "B6",
    fixedCost: "B7",
    onlineViews: "B10",
    netProfit: "B11",
    reviewScore: "B12",
  
    // ---- Live feed (titles/texts) ----
    feed1Title: "A15",
    feed1Text: "B15",
    feed2Title: "A16",
    feed2Text: "B16",
    feed3Title: "A17",
    feed3Text: "B17",
  
    // ---- Social stats (chips) ----
    stat1Label: "A20",  // e.g., "Mentions"
    stat1Value: "B20",  // e.g., 27
    stat2Label: "A21",  // e.g., "New Reviews"
    stat2Value: "B21",  // e.g., 5
    stat3Label: "A22",  // e.g., "Impressions"
    stat3Value: "B22",  // e.g., 92
  } as const;
  
  export const allRanges: string[] = Object.values(sheetMap);