import { useState } from "react";
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

// --- shared clock (epoch ms) ---
export function useDateTime(): number {
  const { now } = useAppContext();
  return now;
}

// --- weather placeholder: matches AppCtxType.weather (unknown | null) ---
export function useWeather(): unknown | null {
  const { weather } = useAppContext();
  return weather;
}

/**
 * NEW: useViewRange — minimal, non-breaking stub so SegmentedControl.tsx can mount.
 * It returns a tuple [range, setRange] like a normal React state hook.
 * Values: "day" | "week" | "month" (lowercase to be predictable).
 * You can wire this to real app state later; for now it’s local-only to prevent crashes.
 */
export function useViewRange(): [("day" | "week" | "month"), (v: "day" | "week" | "month") => void] {
  const [range, setRange] = useState<"day" | "week" | "month">("day");
  return [range, setRange];
}

/**
 * Robust color helper: accepts ANY value, never throws.
 * - Tries to coerce to number; if not a valid number → neutral gray.
 * - Maps 0..100 to a red→green ramp (simple default).
 * - `opts.invert` flips the ramp if you use “lower is better” KPIs.
 */
export function tileColor(value: unknown, opts?: { invert?: boolean }): string {
  const n = coerceNumber(value);
  if (n == null) return "#e5e7eb"; // neutral gray

  const clamped = Math.max(0, Math.min(100, n));
  const g = Math.round((clamped / 100) * 200 + 30);
  const r = Math.round(((100 - clamped) / 100) * 200 + 30);
  const base = `rgb(${r}, ${g}, 80)`;
  return opts?.invert ? `rgb(${g}, ${r}, 80)` : base;
}

/** Safe numeric coercion: returns number 0..100 or null */
function coerceNumber(v: unknown): number | null {
  if (typeof v === "number" && Number.isFinite(v)) return v;
  if (typeof v === "string") {
    const cleaned = v.replace(/[^\d.-]/g, "");
    const parsed = Number(cleaned);
    if (Number.isFinite(parsed)) return parsed;
  }
  if (typeof v === "object" && v !== null) {
    // @ts-expect-error best-effort extraction
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

/** Used by scenic effects as a “change token” */
export function useBeamTriggerToken(): number {
  const t = useLastUpdated();
  return t ?? 0;
}

/** Splash overlay toggle — keep false for stability unless wired */
export function useSplashActive(): boolean {
  return false;
}