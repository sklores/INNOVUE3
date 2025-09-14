// src/app/state.tsx
// AppProvider with Sheets + (optional) Weather + shared clock.
// Uses setInterval locally to avoid poller signature mismatches.

import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adapt, type AppData } from "../data/adapters";
import { fetchAll } from "../data/sheetsClient";
import * as cfg from "./config";

// If you previously added a weather client, you can import it here.
// For now we keep weather nullable to avoid introducing more deps.
// import { fetchWeather, type Weather } from "../data/weatherClient";
type Weather = {
  tempC: number | null;
  condition: string;
  code: number | null;
  isDay: boolean | null;
  updated: number;
} | null;

type AppCtxType = {
  data: AppData | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;

  now: number;          // epoch ms
  weather: Weather;

  _refreshNow?: () => Promise<void>;
};

const AppCtx = createContext<AppCtxType>({
  data: null,
  lastUpdated: null,
  loading: true,
  error: null,
  now: Date.now(),
  weather: null,
  _refreshNow: undefined,
});

// Legacy helpers some modules import
let refreshNowImpl: (() => Promise<void>) | null = null;
export async function refreshNow(): Promise<void> {
  if (refreshNowImpl) return refreshNowImpl();
  return Promise.resolve();
}
export function useAppDispatch() {
  return { refreshNow };
}

export const AppProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [data, setData] = useState<AppData | null>(null);
  const [lastUpdated, setLastUpdated] = useState<number | null>(null);
  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<string | null>(null);

  const [now, setNow] = useState<number>(Date.now());
  const [weather, setWeather] = useState<Weather>(null);

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
      const raw = await fetchAll();
      const next = adapt(raw);
      setData(next);
      setLastUpdated(Date.now());
      // If you have a weather client wired, load it here and setWeather(...)
      setError(null);
    } catch (err: unknown) {
      console.error("refresh error", err);
      setError(err instanceof Error ? err.message : String(err));
    } finally {
      setNow(Date.now());
    }
  };

  useEffect(() => {
    refreshNowImpl = doRefresh;
    return () => {
      refreshNowImpl = null;
    };
  }, []);

  // Local polling without relying on an external poller helper
  useEffect(() => {
    let timer: ReturnType<typeof setInterval> | undefined;
    let stopped = false;

    const tick = async () => {
      if (stopped) return;
      await doRefresh();
      if (loading) setLoading(false);
    };

    // kick immediately, then interval
    void tick();
    timer = setInterval(tick, Math.max(1000, intervalMs | 0));

    return () => {
      stopped = true;
      if (timer) clearInterval(timer);
    };
  }, [intervalMs]); // eslint-disable-line react-hooks/exhaustive-deps

  const value = useMemo(
    () => ({ data, lastUpdated, loading, error, now, weather, _refreshNow: doRefresh }),
    [data, lastUpdated, loading, error, now, weather]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};

export const useAppContext = (): AppCtxType => useContext(AppCtx);