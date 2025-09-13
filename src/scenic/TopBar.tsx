import React from "react";
import { useSplashActive } from "../app/selectors";
import { ControlPill } from "../components/ControlPill";
import Sky from "./layers/Sky";
import Lighthouse from "./layers/Lighthouse";
import RockBase from "./layers/RockBase";
import LightBeam from "./layers/LightBeam";
import Brand from "./layers/Brand";
import { SplashController } from "./layers/Splash/SplashController";
import { TOPBAR } from "./tuning";

const TopBar: React.FC = () => {
  const splashActive = useSplashActive();

  return (
    <div className="topbar-hero card" style={{ height: TOPBAR.HEIGHT }}>
      <div className="topbar-sky"><Sky /></div>
      <div className="topbar-scene">
        <RockBase />
        <Lighthouse />
        <LightBeam />
        <Brand />
      </div>

      {/* Splash overlay (client logo + back-glow) */}
      {splashActive && <SplashController />}

      {/* Center-docked segmented control + refresh */}
      <div className="topbar-pill-dock">
        <ControlPill />
      </div>
    </div>
  );
};

export default TopBar;