import { useAppContext } from "./state";

/** Existing hooks your components use */
export function useFeed() {
  const { data } = useAppContext();
  return data?.feed;
}

export function useLastUpdated(): number | null {
  const { lastUpdated } = useAppContext();
  return lastUpdated;
}

export function useKpis() {
  const { data } = useAppContext();
  return data?.kpis ?? {};
}

/**
 * Missing named exports some files referenced.
 * These implementations are safe defaults that won’t crash the app.
 */

/** tileColor: simple utility – you can replace with your real scale if needed */
export function tileColor(value: number | undefined, opts?: { invert?: boolean }) {
  if (value == null || Number.isNaN(value)) return "#e5e7eb"; // neutral gray
  // Map 0..100 to red->green (simple ramp)
  const v = Math.max(0, Math.min(100, Number(value)));
  const g = Math.round((v / 100) * 200 + 30);
  const r = Math.round(((100 - v) / 100) * 200 + 30);
  const base = `rgb(${r}, ${g}, 80)`;
  if (opts?.invert) return `rgb(${g}, ${r}, 80)`;
  return base;
}

/** useBeamTriggerToken: return a number that changes when a “beam” should update */
export function useBeamTriggerToken(): number {
  // Using lastUpdated is a simple, deterministic trigger token.
  const t = useLastUpdated();
  return t ?? 0;
}

/** useSplashActive: splash overlay toggle – default to false */
export function useSplashActive(): boolean {
  return false;
}