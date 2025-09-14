export const sheetMap = {
    // KPIs
    sales: "B2",
    cogs: "B3",
    laborPct: "B4",
    bankBalance: "B5",
    primeCost: "B6",
    fixedCost: "B7",
    onlineViews: "B10",
    netProfit: "B11",
    reviewScore: "B12",
  
    // Live feed tabs/texts
    feed1Title: "A15",
    feed1Text: "B15",
    feed2Title: "A16",
    feed2Text: "B16",
    feed3Title: "A17",
    feed3Text: "B17",
  
    // Chips (names + values)
    stat1Label: "A20", // Mentions
    stat1Value: "B20",
    stat2Label: "A21", // New Reviews
    stat2Value: "B21",
    stat3Label: "A22", // Impressions
    stat3Value: "B22",
  } as const;
  
  export const allRanges: string[] = Object.values(sheetMap);