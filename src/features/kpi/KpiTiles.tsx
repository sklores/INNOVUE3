// src/features/kpi/KpiTiles.tsx
import React from "react";
import KpiTile from "./KpiTile";
import { useKpis } from "../../app/selectors";
import { fmtMoney, fmtNumber, fmtPct } from "../../app/selectors";

const KpiTiles: React.FC = () => {
  const k = useKpis();
  return (
    <div className="kpi-grid">
      <KpiTile metric="sales"           label="Sales"         value={k?.sales}           format={fmtMoney} />
      <KpiTile metric="profit"          label="Profit"        value={k?.profit}          format={fmtMoney} />
      <KpiTile metric="laborPct"        label="Labor %"       value={k?.laborPct}        format={fmtPct} />
      <KpiTile metric="cogs"            label="COGS"          value={k?.cogs}            format={fmtMoney} />
      <KpiTile metric="onlineViews"     label="Online Views"  value={k?.onlineViews}     format={fmtNumber} />
      <KpiTile metric="reviewScore"     label="Review Score"  value={k?.reviewScore}     format={fmtNumber} />
      <KpiTile metric="fixedCost"       label="Fixed Cost"    value={k?.fixedCost}       format={fmtMoney} />
      <KpiTile metric="accountsPayable" label="A/P"           value={k?.accountsPayable} format={fmtMoney} />
      <KpiTile metric="bankBalance"     label="Bank"          value={k?.bankBalance}     format={fmtMoney} />
      <KpiTile metric="newItems"        label="New Items"     value={k?.newItems}        format={fmtNumber} />
    </div>
  );
};

export default KpiTiles;