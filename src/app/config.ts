// App-wide knobs. Adjust freely.
export const POLL = {
    SHEETS_MS: 2000,     // fast, deduped
    TIME_MS: 60000,      // minute tick
    WEATHER_MS: 600000,  // 10 minutes (wired in later M5)
  };
  
  export const DAY_START_HOUR = 6;
  export const DAY_END_HOUR = 18;
  
  // KPI targets (used for ramps later; harmless in M1)
  export const TARGETS = {
    sales: 8000,
    profit: 2000,
    cogs: 2500,
    onlineViews: 100,
    reviewScore: 5,
    fixedCost: 1500,
    accountsPayable: 10000,
    bankBalance: 5000,
  };