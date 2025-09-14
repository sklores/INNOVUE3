import { useAppContext } from "./state";

// Feed for marquee
export function useFeed() {
  const { data } = useAppContext();
  return data?.feed;
}

// Timestamp (ms) when Sheets last updated
export function useLastUpdated(): number | null {
  const { lastUpdated } = useAppContext();
  return lastUpdated;
}

// KPIs for tiles, etc.
export function useKpis() {
  const { data } = useAppContext();
  return data?.kpis ?? {};
}

// === Missing named exports some modules referenced ===

// Simple color ramp for tiles; replace with your real logic later if needed.
export function tileColor(value: number | undefined, opts?: { invert?: boolean }) {
  if (value == null || Number.isNaN(Number(value))) return "#e5e7eb";
  const v = Math.max(0, Math.min(100, Number(value)));
  const g = Math.round((v / 100) * 200 + 30);
  const r = Math.round(((100 - v) / 100) * 200 + 30);
  const base = `rgb(${r}, ${g}, 80)`;
  return opts?.invert ? `rgb(${g}, ${r}, 80)` : base;
}

// Token that changes when lighthouse beam or similar effects should update
export function useBeamTriggerToken(): number {
  const t = useLastUpdated();
  return t ?? 0;
}

// Splash overlay toggle — default false for stability
export function useSplashActive(): boolean {
  return false;
}