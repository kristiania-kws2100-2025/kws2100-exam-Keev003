// src/modules/app/styles.ts
import { Style, Fill, Stroke, Circle as CircleStyle } from "ol/style";

// Bright, friendly color palette
export const elementaryStyle = new Style({
  image: new CircleStyle({
    radius: 6,
    fill: new Fill({ color: "#FFD166" }), // yellow-orange
    stroke: new Stroke({ color: "#333", width: 1 }),
  }),
});

export const railwayStyle = new Style({
  stroke: new Stroke({
    color: "#06D6A0", // mint green
    width: 3,
    lineDash: [10, 10],
  }),
});

export const floodStyle = new Style({
  fill: new Fill({ color: "rgba(138, 201, 255, 0.4)" }), // light blue
  stroke: new Stroke({ color: "#118AB2", width: 2 }),
});

export const hazardStyle = new Style({
  fill: new Fill({ color: "rgba(255, 112, 112, 0.4)" }), // soft red
  stroke: new Stroke({ color: "#EF476F", width: 2 }),
});
