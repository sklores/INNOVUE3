import React from "react";
import TopBar from "./scenic/TopBar";
import KpiTiles from "./features/kpi/KpiTiles";
import LiveFeedPanel from "./features/marquee/LiveFeedPanel";
import BottomBar from "./components/BottomBar";
import SafeArea from "./components/SafeArea";

const App: React.FC = () => {
  return (
    <>
      <SafeArea>
        <TopBar />
        <KpiTiles />
        <LiveFeedPanel />
      </SafeArea>

      {/* Sticky footer lives outside SafeArea so it hugs the viewport bottom */}
      <BottomBar />
    </>
  );
};

export default App;