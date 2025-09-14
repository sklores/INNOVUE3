import React, { createContext, useContext, useEffect, useMemo, useState } from "react";
import { adapt, type AppData } from "../data/adapters";
import { fetchAll } from "../data/sheetsClient";
import { startPoller } from "../data/poller";
import * as cfg from "./config";

/** Public context shape */
type AppCtxType = {
  data: AppData | null;
  lastUpdated: number | null;
  loading: boolean;
  error: string | null;
  /** Imperative refresh injected by provider */
  _refreshNow?: () => Promise<void>;
};

const AppCtx = createContext<AppCtxType>({
  data: null,
  lastUpdated: null,
  loading: true,
  error: null,
  _refreshNow: undefined,
});

/**
 * Module-level proxy so legacy code can import { refreshNow } directly.
 * The provider sets this at runtime.
 */
let refreshNowImpl: (() => Promise<void>) | null = null;

/** Legacy-compatible named export */
export async function refreshNow(): Promise<void> {
  if (refreshNowImpl) return refreshNowImpl();
  // No-op fallback to avoid crashes
  return Promise.resolve();
}

/** Legacy-compatible hook returning a "dispatch-like" object */
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

  // Define the real refresh function and inject into both context and module proxy
  const doRefresh = async () => {
    try {
      const raw = await fetchAll();
      const next = adapt(raw);
      setData(next);
      setLastUpdated(Date.now());
      setError(null);
    } catch (err: any) {
      console.error("refresh error", err);
      setError(String(err?.message ?? err));
    }
  };

  useEffect(() => {
    // make available to legacy imports
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