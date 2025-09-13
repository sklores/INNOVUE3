// src/features/kpi/KpiTile.tsx
import React, { useMemo } from "react";
import { tileColor, tilePercent } from "../../app/selectors";
import { TARGETS } from "../../app/config";

type Props = {
  metric: keyof typeof TARGETS;
  label: string;
  value?: number;
  format?: (n?: number) => string;
};

const KpiTile: React.FC<Props> = ({ metric, label, value, format }) => {
  const color = useMemo(() => tileColor(metric, value), [metric, value]);
  const pct = useMemo(() => tilePercent(metric, value), [metric, value]);

  return (
    <div className="kpi card" role="group" aria-label={`${label} tile`}>
      <div className="kpi-label">{label}</div>
      <div className="kpi-value" style={{ color }}>
        {(format ?? ((n?: number) => (typeof n === "number" ? n.toLocaleString() : "—")))(value)}
      </div>
      <div className="kpi-bar-outer" aria-hidden>
        <div className="kpi-bar-inner" style={{ width: `${pct}%`, background: color }} />
      </div>
    </div>
  );
};

export default KpiTile;