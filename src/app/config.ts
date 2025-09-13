// src/app/config.ts
export const POLL = {
    SHEETS_MS: 2000,
    TIME_MS: 60000,
    WEATHER_MS: 600000,
  };
  
  export const DAY_START_HOUR = 6;
  export const DAY_END_HOUR = 18;
  
  // KPI targets (tune anytime)
  export const TARGETS = {
    sales: 8000,
    profit: 2000,
    cogs: 2500,
    onlineViews: 100,
    reviewScore: 5,
    fixedCost: 1500,
    accountsPayable: 10000,
    bankBalance: 5000,
    laborPct: 50,      // used for color ramp context
    newItems: 20
  };
  
  // Which direction is “good” per metric (affects color inversion)
  export const METRIC_DIRECTION: Record<string, "up" | "down"> = {
    sales: "up",
    profit: "up",
    laborPct: "down",       // lower is better
    cogs: "down",           // lower is better
    onlineViews: "up",
    reviewScore: "up",
    fixedCost: "down",
    accountsPayable: "down",
    bankBalance: "up",
    newItems: "up",
  };