import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { GeoJSON } from "ol/format";

import "ol/ol.css";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const railwayStationLayer = new VectorLayer({
  source: new VectorSource({
    url: "/kws2100-exam-Keev003/public/geojson/jernbanestasjoner.geojson",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 8 }),
  layers: [osmLayer, railwayStationLayer],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  useEffect(() => map.setTarget(mapRef.current!), []);
  return <div ref={mapRef}></div>;
}
