// src/data/poller.ts
import { adaptKpis, adaptOverrides, mergeOverrides, adaptLiveFeed, type KPIData, type Overrides, type LiveFeed } from "./adapters";
import { allRanges } from "./sheetMap";
import { fetchBatchValues } from "./sheetsClient";

export type OnData = (payload: { kpis: KPIData; overrides: Overrides; feed: LiveFeed }) => void;
export type OnError = (message: string) => void;

export type PollerConfig = {
  sheetsMs: number;
  timeMs: number;
  weatherMs: number;
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
      const ov   = adaptOverrides(raw) ?? { testMode: false };
      const kpis = mergeOverrides(base, ov);
      const feed = adaptLiveFeed(raw);

      // include feed content in the hash for dedupe
      const hash = JSON.stringify([kpis, !!ov.testMode, ov.weatherOverride ?? "", ov.timeOverride ?? "", feed]);
      if (hash !== lastHash) {
        lastHash = hash;
        onData({ kpis, overrides: ov, feed });
      }
    } catch (e: any) {
      onError(e?.message ?? "Sheets error");
    }
  }

  tickSheets();
  const sheetsId = setInterval(tickSheets, cfg.sheetsMs);

  return () => {
    stopped = true;
    ctrl?.abort();
    clearInterval(sheetsId);
  };
}