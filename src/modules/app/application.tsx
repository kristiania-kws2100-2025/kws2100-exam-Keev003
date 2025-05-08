import React, { useEffect, useRef } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { GeoJSON } from "ol/format";
import { OverviewMap, defaults as defaultControls } from "ol/control";

import "ol/ol.css";

useGeographic();

const osmLayer = new TileLayer({ source: new OSM() });

const elementarySchool = new VectorLayer({
  source: new VectorSource({
    url: "/api/grunnskoler",
    format: new GeoJSON(),
  }),
});

const railwayLayer = new VectorLayer({
  source: new VectorSource({
    url: "/api/jernbanelinjer",
    format: new GeoJSON(),
  }),
});

const floodLayer = new VectorLayer({
  source: new VectorSource({
    url: "/api/flomsoner",
    format: new GeoJSON(),
  }),
});

const tailorHazardLayer = new VectorLayer({
  source: new VectorSource({
    url: "/api/skreddfare",
    format: new GeoJSON(),
  }),
});

const map = new Map({
  view: new View({ center: [10.8, 59.9], zoom: 8 }),
  layers: [
    osmLayer,
    elementarySchool,
    railwayLayer,
    floodLayer,
    tailorHazardLayer,
  ],
});

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);

  useEffect(() => {
    if (!mapRef.current) return;
    const target = mapRef.current;

    const baseLayer = new TileLayer({ source: new OSM() });

    const overviewControl = new OverviewMap({
      layers: [new TileLayer({ source: new OSM() })],
      collapsed: false,
    });

    const map = new Map({
      target,
      layers: [baseLayer],
      view: new View({
        center: [10.8, 59.9], // [lon, lat]
        zoom: 8,
      }),
      controls: defaultControls().extend([overviewControl]),
    });

    return () => map.setTarget(undefined);
  }, []);

  return <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />;
}
