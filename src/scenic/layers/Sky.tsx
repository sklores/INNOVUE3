import React from "react";
import { SKY } from "../tuning";

const Sky: React.FC = () => (
  <div style={{ width: "100%", height: "100%", background: SKY.GRADIENT, borderRadius: 14 }} />
);

export default Sky;