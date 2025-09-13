import { allRanges } from "./sheetMap";
import { fetchBatchValues } from "./sheetsClient";
import { adaptKpis, adaptOverrides, mergeOverrides, KPIData, Overrides } from "./adapters";

export type OnData = (payload: { kpis: KPIData; overrides: Overrides }) => void;
export type OnError = (message: string) => void;

export type PollerConfig = {
  sheetsMs: number;   // e.g., 2000
  timeMs: number;     // e.g., 60000 (exposed to store, not used here yet)
  weatherMs: number;  // e.g., 600000 (handled later M5)
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

      const hash = JSON.stringify([kpis, ov.testMode, ov.weatherOverride, ov.timeOverride]);
      if (hash !== lastHash) {
        lastHash = hash;
        onData({ kpis, overrides: ov });
      }
    } catch (e: any) {
      onError(e?.message ?? "Sheets error");
    }
  }

  // Prime immediately
  tickSheets();
  const sheetsId = setInterval(tickSheets, cfg.sheetsMs);

  return () => {
    stopped = true;
    ctrl?.abort();
    clearInterval(sheetsId);
  };
}