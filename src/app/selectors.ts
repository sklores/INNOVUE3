import { useAppContext } from "./state";

export function useFeed() {
  const { data } = useAppContext();
  return data?.feed;
}

export function useLastUpdated(): number | null {
  const { lastUpdated } = useAppContext();
  return lastUpdated;
}

export function useKpis() {
  const { data } = useAppContext();
  return data?.kpis ?? {};
}