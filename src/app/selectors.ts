import { useAppContext } from "./state";

// --- existing hooks your code uses ---
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

// --- new/shared clock + weather (aligned to AppCtxType) ---
export function useDateTime(): number {
  const { now } = useAppContext();
  return now; // epoch ms
}

/**
 * Matches AppCtxType.weather (unknown | null) so TS stops failing.
 * When we finalize a Weather type and wire the client, we'll narrow this.
 */
export function useWeather(): unknown | null {
  const { weather } = useAppContext();
  return weather;
}

// --- compatibility helpers some modules reference ---
export function tileColor(value: number | undefined, opts?: { invert?: boolean }) {
  if (value == null || Number.isNaN(Number(value))) return "#e5e7eb";
  const v = Math.max(0, Math.min(100, Number(value)));
  const g = Math.round((v / 100) * 200 + 30);
  const r = Math.round(((100 - v) / 100) * 200 + 30);
  const base = `rgb(${r}, ${g}, 80)`;
  return opts?.invert ? `rgb(${g}, ${r}, 80)` : base;
}

export function useBeamTriggerToken(): number {
  const t = useLastUpdated();
  return t ?? 0;
}

export function useSplashActive(): boolean {
  return false;
}