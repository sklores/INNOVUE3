import React, { useEffect, useState } from "react";
import { useBeamTriggerToken } from "../../app/selectors";
import { BEAM } from "../tuning";

const LightBeam: React.FC = () => {
  const token = useBeamTriggerToken();
  const [pulseClass, setPulseClass] = useState("");

  useEffect(() => {
    if (!token) return;
    // Add a class briefly to restart CSS animation
    setPulseClass("beam-pulse");
    const t = setTimeout(() => setPulseClass(""), 900);
    return () => clearTimeout(t);
  }, [token]);

  return (
    <div
      className={`beam ${pulseClass}`}
      aria-hidden
      style={{
        position: "absolute",
        left: 62,
        bottom: 90,
        width: BEAM.LENGTH,
        height: BEAM.WIDTH,
        background: BEAM.COLOR,
        boxShadow: BEAM.GLOW,
        borderRadius: 8,
        transformOrigin: "0% 50%",
        transform: "rotate(-5deg)",
        opacity: 0.65,
      }}
    />
  );
};

export default LightBeam;