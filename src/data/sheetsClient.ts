import { GOOGLE_API_KEY, GOOGLE_SHEET_ID } from "./hardcoded";
export type BatchResponse = Record<string, string | undefined>;

// Batch-get all ranges at once.
// Throws if creds missing or network fails.
export async function fetchBatchValues(
  ranges: string[],
  signal?: AbortSignal
): Promise<BatchResponse> {
  if (!GOOGLE_API_KEY || !GOOGLE_SHEET_ID) {
    throw new Error("Missing Google API key or Sheet ID (see src/data/hardcoded.ts)");
  }
  const params = new URLSearchParams({ key: GOOGLE_API_KEY });
  for (const r of ranges) params.append("ranges", r);

  const url = `https://sheets.googleapis.com/v4/spreadsheets/${GOOGLE_SHEET_ID}/values:batchGet?${params.toString()}`;
  const res = await fetch(url, { signal });
  if (!res.ok) throw new Error(`Sheets ${res.status} ${res.statusText}`);

  const json = await res.json();
  const out: BatchResponse = {};
  for (const vr of json.valueRanges ?? []) {
    const range: string = vr.range;
    const val: string | undefined = vr.values?.[0]?.[0];
    out[range] = val;
  }
  return out;
}