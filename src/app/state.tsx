import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adapt, type AppData } from "../data/adapters";
import { fetchAll } from "../data/sheetsClient";
import { startPoller } from "../data/poller";
import * as cfg from "./config";

type AppCtxType = {
  data: AppData | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;
  _refreshNow?: () => Promise<void>;
};

const AppCtx = createContext<AppCtxType>({
  data: null,
  lastUpdated: null,
  loading: true,
  error: null,
  _refreshNow: undefined,
});

// Legacy-compat exported API expected elsewhere:
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
      const raw = await fetchAll();   // { [A1]: value } or {}
      const next = adapt(raw);        // safe normalization
      setData(next);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err: unknown) {
      console.error("refresh error", err);
      setError(err instanceof Error ? err.message : String(err));
    }
  };

  useEffect(() => {
    refreshNowImpl = doRefresh;
    return () => {
      refreshNowImpl = null;
    };
  }, []);

  useEffect(() => {
    let first = true;
    const stop = startPoller(intervalMs, async () => {
      await doRefresh();
      if (first) {
        setLoading(false);
        first = false;
      }
    });
    return () => stop();
  }, [intervalMs]);

  const value = useMemo(
    () => ({ data, lastUpdated, loading, error, _refreshNow: doRefresh }),
    [data, lastUpdated, loading, error]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};

export const useAppContext = (): AppCtxType => useContext(AppCtx);