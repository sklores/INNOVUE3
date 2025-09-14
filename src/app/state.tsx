import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adapt, type AppData } from "../data/adapters";
import { fetchAll } from "../data/sheetsClient";
import * as cfg from "./config";

/**
 * Minimal, stable app context:
 * - data: AppData from adapters
 * - lastUpdated: epoch ms when Sheets last fetched
 * - loading/error: basic flags
 * - now: shared clock tick (for components that show time)
 * - _refreshNow: imperative refresh used by some legacy callers
 *
 * NOTE: No weather here. No extra fields. This keeps the contract tight.
 */
type AppCtxType = {
  data: AppData | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;
  now: number;
  _refreshNow?: () => Promise<void>;
};

const AppCtx = createContext<AppCtxType>({
  data: null,
  lastUpdated: null,
  loading: true,
  error: null,
  now: Date.now(),
  _refreshNow: undefined,
});

// ---- Legacy helpers some modules import ----
let refreshNowImpl: (() => Promise<void>) | null = null;

/** Programmatic refresh used by a few spots */
export async function refreshNow(): Promise<void> {
  if (refreshNowImpl) return refreshNowImpl();
  return Promise.resolve();
}

/** Legacy "dispatch" shim; only exposes refreshNow */
export function useAppDispatch() {
  return { refreshNow };
}

// ---- Provider ----
export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);
  const [now, setNow] = useState<number>(Date.now());

  // Poll interval (ms) from config with safe fallback
  const intervalMs = useMemo<number>(() => {
    const v =
      (cfg as any)?.pollIntervalMs ??
      (cfg as any)?.POLL_INTERVAL_MS ??
      (cfg as any)?.config?.pollIntervalMs ??
      5000;
    return Number.isFinite(v) ? Number(v) : 5000;
  }, []);

  const doRefresh = async () => {
    try {
      const raw = await fetchAll(); // { [A1]: value } or {}
      const next = adapt(raw);      // AppData (adapters handles empty safely)
      setData(next);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err: unknown) {
      // keep previous data; surface message
      console.error("refresh error", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      // advance UI clock regardless so time-based UIs don't freeze
      setNow(Date.now());
    }
  };

  // Expose refresh to legacy callers
  useEffect(() => {
    refreshNowImpl = doRefresh;
    return () => {
      refreshNowImpl = null;
    };
  }, []);

  // Local polling loop (no external poller helper → avoids signature mismatches)
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;

    const tick = async () => {
      if (stopped) return;
      await doRefresh();
      if (loading) setLoading(false);
    };

    void tick(); // initial fetch immediately
    timer = setInterval(tick, Math.max(1000, intervalMs | 0));

    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({ data, lastUpdated, loading, error, now, _refreshNow: doRefresh }),
    [data, lastUpdated, loading, error, now]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};

// ---- Hook to read the context ----
export const useAppContext = (): AppCtxType => useContext(AppCtx);