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
};

const AppCtx = createContext<AppCtxType>({
  data: null,
  lastUpdated: null,
  loading: true,
  error: null,
});

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

  useEffect(() => {
    let first = true;
    const stop = startPoller(intervalMs, async () => {
      try {
        const raw = await fetchAll();   // { [A1]: value } or {}
        const next = adapt(raw);        // safe: missing cells become ""
        setData(next);
        setLastUpdated(Date.now());
        setError(null);
      } catch (err: any) {
        console.error("poll error", err);
        setError(String(err?.message ?? err));
        // keep previous data; keep UI up
      } finally {
        if (first) {
          setLoading(false);
          first = false;
        }
      }
    });
    return () => stop();
  }, [intervalMs]);

  const value = useMemo(
    () => ({ data, lastUpdated, loading, error }),
    [data, lastUpdated, loading, error]
  );

  return <AppCtx.Provider value={value}>{children}</AppCtx.Provider>;
};

export const useAppContext = (): AppCtxType => useContext(AppCtx);