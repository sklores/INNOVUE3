// src/data/poller.ts

// Runtime (value) imports
import { adaptKpis, adaptOverrides, mergeOverrides } from "./adapters";
// Type-only imports (required when verbatimModuleSyntax is enabled)
import type { KPIData, Overrides } from "./adapters";

import { allRanges } from "./sheetMap";
import { fetchBatchValues } from "./sheetsClient";

export type OnData = (payload: { kpis: KPIData; overrides: Overrides }) => void;
export type OnError = (message: string) => void;

export type PollerConfig = {
  sheetsMs: number;   // e.g., 2000
  timeMs: number;     // e.g., 60000 (minute tick; used later)
  weatherMs: number;  // e.g., 600000 (used in M5)
};

export function startPoller(cfg: PollerConfig, onData: OnData, onError: OnError) {
  let lastHash = "";
  let ctrl: AbortController | null = null;
  let stopped = false;

  async function tickSheets() {
    if (stopped) return;
    try {
      ctrl?.abort();
      ctrl = new AbortController();

      const raw = await fetchBatchValues(allRanges, ctrl.signal);
      const base = adaptKpis(raw);
      const ov = adaptOverrides(raw);
      const kpis = mergeOverrides(base, ov);

      // Simple dedupe hash so we only dispatch on real changes
      const hash = JSON.stringify([kpis, ov.testMode, ov.weatherOverride, ov.timeOverride]);
      if (hash !== lastHash) {
        lastHash = hash;
        onData({ kpis, overrides: ov });
      }
    } catch (e: any) {
      onError(e?.message ?? "Sheets error");
    }
  }

  // Prime immediately, then poll on cadence
  tickSheets();
  const sheetsId = setInterval(tickSheets, cfg.sheetsMs);

  return () => {
    stopped = true;
    ctrl?.abort();
    clearInterval(sheetsId);
  };
}