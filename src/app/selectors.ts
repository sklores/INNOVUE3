import { useAppState } from "./state";
import { METRIC_DIRECTION, TARGETS } from "./config";
import { valueToColorUp, valueToColorDown } from "../lib/color";

export function useKpis() {
  return useAppState().kpis;
}
export function useLastUpdated() {
  return useAppState().lastUpdated.sheets;
}
export function useLoadingError() {
  const { loading, error } = useAppState();
  return { loading, error };
}
export function useViewRange() {
  return useAppState().viewRange;
}
export function useSplashActive() {
  return useAppState().splashActive;
}
export function useBeamTriggerToken() {
  return useAppState().beamTriggerToken;
}

// ---------- KPI color & percent helpers ----------

function clamp01(v: number) { return Math.max(0, Math.min(1, v)); }

export function tilePercent(metric: keyof typeof TARGETS, value?: number): number {
  const v = typeof value === "number" ? value : 0;
  const tgt = TARGETS[metric] || 1;
  if (tgt <= 0) return 0;
  if (METRIC_DIRECTION[metric] === "down") {
    return Math.round(clamp01(1 - v / tgt) * 100);
  }
  return Math.round(clamp01(v / tgt) * 100);
}

export function tileColor(metric: keyof typeof TARGETS, value?: number): string {
  const v = typeof value === "number" ? value : 0;
  const tgt = TARGETS[metric] || 1;
  if (METRIC_DIRECTION[metric] === "down") {
    return valueToColorDown(v, tgt);
  }
  return valueToColorUp(v, tgt);
}

// Optional text formatters (kept simple for now)
export function fmtMoney(n?: number) {
  return typeof n === "number" ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 }) : "—";
}
export function fmtNumber(n?: number) {
  return typeof n === "number" ? n.toLocaleString() : "—";
}
export function fmtPct(n?: number) {
  return typeof n === "number" ? `${Math.round(n)}%` : "—";
}