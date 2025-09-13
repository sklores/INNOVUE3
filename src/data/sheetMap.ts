// All Sheet ranges in one place. Change cells here—nowhere else.
export const sheetMap = {
    // KPIs (adjust these A1 ranges to your sheet layout)
    sales: "KPIs!B2",
    profit: "KPIs!B3",
    laborPct: "KPIs!B4",          // ← non-negotiable for Birds later
    cogs: "KPIs!B5",
    onlineViews: "KPIs!B6",
    reviewScore: "KPIs!B7",
    fixedCost: "KPIs!B8",
    accountsPayable: "KPIs!B9",
    bankBalance: "KPIs!B10",
    newItems: "KPIs!B11",
  
    // Scenic Overrides tab (optional, for TEST_MODE driven demos)
    overrides: {
      testMode: "ScenicOverrides!B2",
      weatherOverride: "ScenicOverrides!B3", // clear | cloudy | rain | thunderstorm
      timeOverride: "ScenicOverrides!B4",    // day | night | auto
      laborOverride: "ScenicOverrides!B6",
      salesOverride: "ScenicOverrides!B7",
      profitOverride: "ScenicOverrides!B8",
      bankOverride: "ScenicOverrides!B9",
      newItemsOverride: "ScenicOverrides!B10",
    },
  } as const;
  
  export type SheetKey = keyof typeof sheetMap;
  export const allRanges: string[] = [
    sheetMap.sales,
    sheetMap.profit,
    sheetMap.laborPct,
    sheetMap.cogs,
    sheetMap.onlineViews,
    sheetMap.reviewScore,
    sheetMap.fixedCost,
    sheetMap.accountsPayable,
    sheetMap.bankBalance,
    sheetMap.newItems,
    sheetMap.overrides.testMode,
    sheetMap.overrides.weatherOverride,
    sheetMap.overrides.timeOverride,
    sheetMap.overrides.laborOverride,
    sheetMap.overrides.salesOverride,
    sheetMap.overrides.profitOverride,
    sheetMap.overrides.bankOverride,
    sheetMap.overrides.newItemsOverride,
  ];