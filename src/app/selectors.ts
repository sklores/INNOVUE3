import { useAppState } from "./state";

// Tiny selector helpers for M1 (we’ll expand in M2+)
export function useKpis() {
  const { kpis } = useAppState();
  return kpis;
}
export function useLastUpdated() {
  const { lastUpdated } = useAppState();
  return lastUpdated.sheets;
}
export function useLoadingError() {
  const { loading, error } = useAppState();
  return { loading, error };
}