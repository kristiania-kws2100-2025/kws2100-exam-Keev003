import React, { useEffect, useRef, useState } from "react";
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

/*
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
}*/

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const overviewControlRef = useRef<OverviewMap | null>(null);
  const [showOverview, setShowOverview] = useState(true);

  useEffect(() => {
    if (!mapRef.current) return;
    const target = mapRef.current;

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

    const overview = new OverviewMap({
      layers: [new TileLayer({ source: new OSM() })],
      collapsed: false,
    });

    overviewControlRef.current = overview;

    const map = new Map({
      target,
      layers: [
        osmLayer,
        elementarySchool,
        railwayLayer,
        floodLayer,
        tailorHazardLayer,
      ],
      view: new View({ center: [10.8, 59.9], zoom: 8 }),
      controls: defaultControls().extend([overview]),
    });

    mapInstance.current = map;

    return () => {
      map.setTarget(undefined);
      mapInstance.current = null;
    };
  }, []);

  useEffect(() => {
    const map = mapInstance.current;
    const control = overviewControlRef.current;
    if (!map || !control) return;

    if (showOverview) {
      map.addControl(control);
    } else {
      map.removeControl(control);
    }
  }, [showOverview]);

  return (
    <>
      <button
        onClick={() => setShowOverview((v: boolean) => !v)}
        style={{
          position: "absolute",
          zIndex: 1000,
          top: 10,
          left: 10,
          padding: "6px 10px",
        }}
      >
        Toggle Overview
      </button>
      <div ref={mapRef} style={{ width: "100%", height: "100vh" }} />
    </>
  );
}
