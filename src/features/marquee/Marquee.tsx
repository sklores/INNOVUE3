// src/features/marquee/Marquee.tsx
// Innovue 3 — Marquee (no animation). Renders a single, taller line fed by Sheets.
// This component is purely presentational. Data comes from parent (LiveFeedPanel).

import React, { useMemo } from "react";

export type MarqueeProps = {
  items: string[];        // e.g., from B15–B17 (already wired via adapters/selectors)
  separator?: string;     // visual separator between items (default " • ")
  className?: string;     // optional extra class hooks
};

export default function Marquee({ items, separator = " • ", className }: MarqueeProps) {
  const line = useMemo(() => {
    // Defensive trims; ignore empty lines from the sheet.
    const cleaned = items.map((t) => String(t ?? "").trim()).filter(Boolean);
    return cleaned.join(separator);
  }, [items, separator]);

  return (
    <div className={`lf-ticker ${className ?? ""}`}>
      <div className="lf-ticker-line" title={line}>
        {line}
      </div>
    </div>
  );
}