// src/data/sheetsClient.ts
// Batch-get A1 ranges and return a map { [A1]: cellValue }.
// Non-fatal: returns {} on any failure so the UI can still render.

import { allRanges } from "./sheetMap";

function opt(v: any): string | undefined {
  if (!v) return undefined;
  const s = String(v).trim();
  return s.length ? s : undefined;
}

export async function fetchAll(): Promise<Record<string, any>> {
  let apiKey: string | undefined;
  let sheetId: string | undefined;
  let sheetName: string | undefined;

  // Prefer hardcoded.ts if present
  try {
    // eslint-disable-next-line @typescript-eslint/ban-ts-comment
    // @ts-ignore
    const hardcoded = await import("./hardcoded");
    apiKey = opt((hardcoded as any).GOOGLE_API_KEY);
    sheetId = opt((hardcoded as any).GOOGLE_SHEET_ID);
    sheetName = opt((hardcoded as any).SHEET_NAME);
  } catch {
    /* ignore */
  }

  // Fall back to Vite env
  apiKey = apiKey ?? opt((import.meta as any)?.env?.VITE_GOOGLE_API_KEY);
  sheetId = sheetId ?? opt((import.meta as any)?.env?.VITE_GOOGLE_SHEET_ID);
  sheetName = sheetName ?? opt((import.meta as any)?.env?.VITE_SHEET_NAME);

  if (!apiKey || !sheetId || !sheetName) return {};

  const ranges = allRanges.map((a1) => `${sheetName}!${a1}`);
  const url =
    `https://sheets.googleapis.com/v4/spreadsheets/${sheetId}/values:batchGet` +
    `?${ranges.map((r) => `ranges=${encodeURIComponent(r)}`).join("&")}` +
    `&majorDimension=ROWS&valueRenderOption=UNFORMATTED_VALUE&key=${encodeURIComponent(apiKey)}`;

  try {
    const res = await fetch(url);
    if (!res.ok) return {};
    const json = await res.json();
    const out: Record<string, any> = {};
    for (const vr of json.valueRanges ?? []) {
      const range: string = String(vr.range ?? "");
      const a1 = range.split("!").pop()?.trim() ?? "";
      const value = vr.values?.[0]?.[0];
      out[a1] = value ?? "";
    }
    return out;
  } catch {
    return {};
  }
}