import { useAppState } from "./state";
import { METRIC_DIRECTION, TARGETS } from "./config";
import { valueToColorUp, valueToColorDown } from "../lib/color";

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
export function useViewRange() {
  return useAppState().viewRange;
}
export function useSplashActive() {
  return useAppState().splashActive;
}
export function useBeamTriggerToken() {
  return useAppState().beamTriggerToken;
}
import { useAppState } from "./state";

export function useKpis() { return useAppState().kpis; }
export function useLastUpdated() { return useAppState().lastUpdated.sheets; }
export function useLoadingError() {
  const { loading, error } = useAppState();
  return { loading, error };
}
export function useViewRange() { return useAppState().viewRange; }
export function useSplashActive() { return useAppState().splashActive; }
export function useBeamTriggerToken() { return useAppState().beamTriggerToken; }
export function useFeed() { return useAppState().feed; }

// Color helpers for KPIs are in color.ts (already integrated elsewhere)