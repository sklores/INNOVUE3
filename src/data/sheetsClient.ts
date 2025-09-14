import { allRanges } from "./sheetMap";

// We try hardcoded.ts first (your previous setup), then env.
// This file never throws — it returns {} if anything is missing/fails.

function opt(name: string, v: any): string | undefined {
  if (!v) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

export async function fetchAll(): Promise<Record<string, any>> {
  // Try to read from hardcoded.ts if present
  let apiKey: string | undefined;
  let sheetId: string | undefined;
  let sheetName: string | undefined;
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const hardcoded = await import("./hardcoded");
    apiKey = opt("GOOGLE_API_KEY", (hardcoded as any).GOOGLE_API_KEY);
    sheetId = opt("GOOGLE_SHEET_ID", (hardcoded as any).GOOGLE_SHEET_ID);
    sheetName = opt("SHEET_NAME", (hardcoded as any).SHEET_NAME);
  } catch {
    // ignore
  }

  // Fallback to Vite env (if you’re using .env)
  apiKey = apiKey ?? opt("VITE_GOOGLE_API_KEY", (import.meta as any)?.env?.VITE_GOOGLE_API_KEY);
  sheetId = sheetId ?? opt("VITE_GOOGLE_SHEET_ID", (import.meta as any)?.env?.VITE_GOOGLE_SHEET_ID);
  sheetName = sheetName ?? opt("VITE_SHEET_NAME", (import.meta as any)?.env?.VITE_SHEET_NAME);

  if (!apiKey || !sheetId || !sheetName) {
    // Missing creds — return empty map so app still renders
    return {};
  }

  const ranges = allRanges.map((a1) => `${sheetName}!${a1}`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet` +
    `?${ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&")}` +
    `&majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) {
      console.error("Sheets fetch failed:", res.status, res.statusText);
      return {};
    }
    const json = await res.json();
    const out: Record<string, any> = {};
    for (const vr of json.valueRanges ?? []) {
      const range: string = String(vr.range ?? "");
      const a1 = range.split("!").pop()?.trim() ?? "";
      const value = vr.values?.[0]?.[0];
      out[a1] = value ?? "";
    }
    return out;
  } catch (e) {
    console.error("Sheets fetch error:", e);
    return {};
  }
}