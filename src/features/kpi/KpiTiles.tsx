// src/features/kpi/KpiTiles.tsx
import React from "react";
import KpiTile from "./KpiTile";
import { useKpis } from "../../app/selectors";

// Simple formatters
const fmtMoney = (n?: number) =>
  typeof n === "number"
    ? n.toLocaleString(undefined, { style: "currency", currency: "USD", maximumFractionDigits: 0 })
    : "—";
const fmtNumber = (n?: number) => (typeof n === "number" ? n.toLocaleString() : "—");
const fmtPct = (n?: number) => (typeof n === "number" ? `${Math.round(n)}%` : "—");

const KpiTiles: React.FC = () => {
  const k = useKpis();

  return (
    <section className="kpi-layout">
      {/* Top: Sales (full width) */}
      <div className="kpi-row-full">
        <KpiTile metric="sales" label="Sales" value={k?.sales} format={fmtMoney} />
      </div>

      {/* Grid rows (2 columns) */}
      <div className="kpi-row-2">
        <KpiTile metric="cogs"     label="COGS"   value={k?.cogs}     format={fmtMoney} />
        <KpiTile metric="laborPct" label="Labor"  value={k?.laborPct} format={fmtPct} />
      </div>

      <div className="kpi-row-2">
        <KpiTile metric="fixedCost"       label="Fixed Cost" value={k?.fixedCost}       format={fmtMoney} />
        <KpiTile metric="accountsPayable" label="A/P"        value={k?.accountsPayable} format={fmtMoney} />
      </div>

      <div className="kpi-row-2">
        <KpiTile metric="onlineViews" label="Online Views"  value={k?.onlineViews} format={fmtNumber} />
        <KpiTile metric="reviewScore" label="Review Score"  value={k?.reviewScore} format={fmtNumber} />
      </div>

      <div className="kpi-row-2">
        {/* If you want Prime shown, map from your sheet later; for now reuse cogs as placeholder */}
        <KpiTile metric="cogs"        label="Prime" value={k?.cogs}        format={fmtMoney} />
        <KpiTile metric="bankBalance" label="Bank"  value={k?.bankBalance} format={fmtMoney} />
      </div>

      {/* Bottom: Profit (full width) */}
      <div className="kpi-row-full">
        <KpiTile metric="profit" label="Net Profit" value={k?.profit} format={fmtMoney} />
      </div>
    </section>
  );
};

export default KpiTiles;