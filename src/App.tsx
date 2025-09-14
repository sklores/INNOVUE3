import React from "react";

// Scenic top bar (hero)
import TopBar from "./scenic/TopBar";

// KPI tiles grid
import KpiTiles from "./features/kpi/KpiTiles";

// Live Feed marquee (tabs A15–A17, text B15–B17)
import LiveFeedPanel from "./features/marquee/LiveFeedPanel";

// Bottom bar (date / weather / API OK / Refresh lives here)
import BottomBar from "./components/BottomBar";

// Optional padded safe area wrapper (if you use it, otherwise remove)
import SafeArea from "./components/SafeArea";

const App: React.FC = () => {
  return (
    <SafeArea>
      {/* Scenic hero */}
      <TopBar />

      {/* KPI grid */}
      <KpiTiles />

      {/* Marquee widget (taller rail, scrolling, Manrope) */}
      <LiveFeedPanel />

      {/* Bottom status bar (date/weather/API/refresh) */}
      <BottomBar />
    </SafeArea>
  );
};

export default App;