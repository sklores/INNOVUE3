import { useAppState } from "./state";

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