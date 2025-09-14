// src/app/selectors.ts
import { useAppState } from "./state";

/** KPIs & status */
export function useKpis() {
  return useAppState().kpis;
}
export function useLastUpdated() {
  return useAppState().lastUpdated.sheets;
}
export function useLoadingError() {
  const { loading, error } = useAppState();
  return { loading, error };
}

/** View & UI */
export function useViewRange() {
  return useAppState().viewRange;
}
export function useSplashActive() {
  return useAppState().splashActive;
}
export function useBeamTriggerToken() {
  return useAppState().beamTriggerToken;
}

/** Marquee live feed (A15–A17 titles, B15–B17 texts) */
export function useFeed() {
  return useAppState().feed;
}