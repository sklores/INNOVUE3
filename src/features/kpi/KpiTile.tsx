// src/features/kpi/KpiTile.tsx
import React, { useMemo } from "react";
import { tileColor } from "../../app/selectors";
import { TARGETS } from "../../app/config";

type Props = {
  metric: keyof typeof TARGETS;
  label: string;
  value?: number;
  format?: (n?: number) => string;
};

const KpiTile: React.FC<Props> = ({ metric, label, value, format }) => {
  const bg = useMemo(() => tileColor(metric, value), [metric, value]);

  const display = useMemo(() => {
    if (format) return format(value);
    return typeof value === "number" ? value.toLocaleString() : "—";
  }, [value, format]);

  return (
    <div
      className="kpi-pill"
      role="group"
      aria-label={`${label} tile`}
      style={{
        // Pastel background per metric
        background: bg,
      }}
    >
      {/* subtle inner overlay for readability + depth */}
      <div className="kpi-pill__overlay" />
      <div className="kpi-pill__content">
        <div className="kpi-pill__label">{label}</div>
        <div className="kpi-pill__value">{display}</div>
      </div>
    </div>
  );
};

export default KpiTile;