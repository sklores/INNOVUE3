import React from "react";
import BrandSplash from "./BrandSplash";
import BeamBackGlow from "./BeamBackGlow";

export const SplashController: React.FC = () => {
  return (
    <div className="splash-wrap">
      <BeamBackGlow />
      <BrandSplash />
    </div>
  );
};