import React, { createContext, useContext, useEffect, useReducer } from "react";
import { POLL } from "./config";
import { startPoller } from "../data/poller";
import type { KPIData, Overrides } from "../data/adapters";

type AppState = {
  kpis: KPIData | null;
  overrides: Overrides | null;
  loading: boolean;
  error?: string;
  lastUpdated: {
    sheets?: number;
  };
  viewRange: "day" | "week" | "month";
  // Splash/beam will be added in M2+
};

type Action =
  | { type: "loading" }
  | { type: "sheets"; payload: { kpis: KPIData; overrides: Overrides } }
  | { type: "error"; payload: string }
  | { type: "setRange"; payload: AppState["viewRange"] }
  | { type: "clearError" };

const Ctx = createContext<{ state: AppState; dispatch: React.Dispatch<Action> } | null>(null);

function reducer(state: AppState, action: Action): AppState {
  switch (action.type) {
    case "loading":
      return { ...state, loading: true, error: undefined };
    case "sheets":
      return {
        ...state,
        loading: false,
        error: undefined,
        kpis: action.payload.kpis,
        overrides: action.payload.overrides,
        lastUpdated: { ...state.lastUpdated, sheets: Date.now() },
      };
    case "error":
      return { ...state, loading: false, error: action.payload };
    case "setRange":
      return { ...state, viewRange: action.payload };
    case "clearError":
      return { ...state, error: undefined };
    default:
      return state;
  }
}

export const AppProvider: React.FC<React.PropsWithChildren> = ({ children }) => {
  const [state, dispatch] = useReducer(reducer, {
    kpis: null,
    overrides: null,
    loading: true,
    lastUpdated: {},
    viewRange: "day",
  });

  useEffect(() => {
    dispatch({ type: "loading" });
    const stop = startPoller(
      { sheetsMs: POLL.SHEETS_MS, timeMs: POLL.TIME_MS, weatherMs: POLL.WEATHER_MS },
      (payload) => dispatch({ type: "sheets", payload }),
      (msg) => dispatch({ type: "error", payload: msg })
    );
    return () => stop();
  }, []);

  useEffect(() => {
    if (!state.error) return;
    const t = setTimeout(() => dispatch({ type: "clearError" }), 4000);
    return () => clearTimeout(t);
  }, [state.error]);

  return <Ctx.Provider value={{ state, dispatch }}>{children}</Ctx.Provider>;
};

export function useAppState() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppState must be used within <AppProvider>");
  return c.state;
}
export function useAppDispatch() {
  const c = useContext(Ctx);
  if (!c) throw new Error("useAppDispatch must be used within <AppProvider>");
  return c.dispatch;
}