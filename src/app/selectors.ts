import { useState } from "react";
import { useAppContext } from "./state";

/** Live feed (titles/texts) for the marquee */
export function useFeed() {
  const { data } = useAppContext();
  return data?.feed;
}

/** Last successful Sheets fetch (epoch ms) */
export function useLastUpdated(): number | null {
  const { lastUpdated } = useAppContext();
  return lastUpdated;
}

/** KPIs for tiles (numeric map) */
export function useKpis() {
  const { data } = useAppContext();
  return data?.kpis ?? {};
}

/** Shared clock (epoch ms) */
export function useDateTime(): number {
  const { now } = useAppContext();
  return now;
}

/** Latest weather data */
export function useWeather() {
  const { weather } = useAppContext();
  return weather;
}

/**
 * REQUIRED BY SegmentedControl:
 * Minimal local state hook so the control can mount.
 * Values: "day" | "week" | "month".
 */
export function useViewRange(): [("day" | "week" | "month"), (v: "day" | "week" | "month") => void] {
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  return [range, setRange];
}

/**
 * Robust tile color helper:
 * Accepts any input; tries to coerce to number; returns neutral if not a number.
 */
export function tileColor(value: unknown, opts?: { invert?: boolean }): string {
  const n = coerceNumber(value);
  if (n == null) return "#cfd8e3"; // neutral blue-gray

  const clamped = Math.max(0, Math.min(100, n));
  const g = Math.round((clamped / 100) * 200 + 30);
  const r = Math.round(((100 - clamped) / 100) * 200 + 30);
  const base = `rgb(${r}, ${g}, 80)`;
  return opts?.invert ? `rgb(${g}, ${r}, 80)` : base;
}

function coerceNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (typeof v === "object" && v !== null) {
    // @ts-expect-error best-effort extraction from common shapes
    const maybe = (v.value ?? v.val ?? v.amount) as unknown;
    if (typeof maybe === "number" && Number.isFinite(maybe)) return maybe;
    if (typeof maybe === "string") {
      const cleaned = maybe.replace(/[^\d.-]/g, "");
      const parsed = Number(cleaned);
      if (Number.isFinite(parsed)) return parsed;
    }
  }
  return null;
}

/** Scenic effects trigger token */
export function useBeamTriggerToken(): number {
  const t = useLastUpdated();
  return t ?? 0;
}

/** Splash overlay toggle (off by default) */
export function useSplashActive(): boolean {
  return false;
}
