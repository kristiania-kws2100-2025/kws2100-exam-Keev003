import React, { useEffect, useRef, useState } from "react";
import { Map, View } from "ol";
import TileLayer from "ol/layer/Tile";
import { OSM } from "ol/source";
import { useGeographic } from "ol/proj";
import VectorSource from "ol/source/Vector";
import VectorLayer from "ol/layer/Vector";
import { GeoJSON } from "ol/format";
import { OverviewMap, defaults as defaultControls } from "ol/control";
import "bootstrap/dist/css/bootstrap.min.css";
import "ol/ol.css";
import {
  elementaryStyle,
  railwayStyle,
  floodStyle,
  hazardStyle,
} from "./styles/vectorStyles";
import { Zoom } from "ol/control";
import "./styles/custom-map.css";
import Overlay from "ol/Overlay";

useGeographic();

export function Application() {
  const mapRef = useRef<HTMLDivElement | null>(null);
  const mapInstance = useRef<Map | null>(null);
  const popupRef = useRef<HTMLDivElement | null>(null);
  const overlayRef = useRef<Overlay | null>(null);
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
      style: elementaryStyle,
    });

    const railwayLayer = new VectorLayer({
      source: new VectorSource({
        url: "/api/jernbanelinjer",
        format: new GeoJSON(),
      }),
      style: railwayStyle,
    });

    const floodLayer = new VectorLayer({
      source: new VectorSource({
        url: "/api/flomsoner",
        format: new GeoJSON(),
      }),
      style: floodStyle,
    });

    const landslideHazardLayer = new VectorLayer({
      source: new VectorSource({
        url: "/api/skreddfare",
        format: new GeoJSON(),
      }),
      style: hazardStyle,
    });

    const overview = new OverviewMap({
      layers: [new TileLayer({ source: new OSM() })],
      collapsed: false,
    });

    overviewControlRef.current = overview;

    const zoomControl = new Zoom({ className: "custom-zoom" });

    const map = new Map({
      target,
      layers: [
        osmLayer,
        elementarySchool,
        railwayLayer,
        floodLayer,
        landslideHazardLayer,
      ],
      view: new View({ center: [10.8, 59.9], zoom: 8 }),
      controls: defaultControls({ zoom: false }).extend([
        overview,
        zoomControl,
      ]),
    });

    mapInstance.current = map;

    // Overlay for popup
    if (!mapRef.current || !popupRef.current) return;

    const popup = new Overlay({
      element: popupRef.current,
      positioning: "bottom-center",
      stopEvent: false,
      offset: [0, -10],
    });
    mapInstance.current?.addOverlay(popup);

    mapInstance.current?.on("click", function (evt) {
      mapInstance.current?.forEachFeatureAtPixel(evt.pixel, function (feature) {
        const props = feature.getProperties();
        popup.setPosition(evt.coordinate);
        if (popupRef.current) {
          popupRef.current.innerHTML = `
          <div class="bg-white p-2 rounded shadow">
            <strong>${props.skolenavn ?? "Ukjent"}</strong>
          </div>
        `;
        }
      });
    });

    return () => {
      mapInstance.current?.removeOverlay(popup);
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
    <div className="position-relative w-100 h-100">
      <button
        className="btn btn-dark position-absolute m-3 shadow"
        style={{ zIndex: 1000 }}
        onClick={() => setShowOverview((v) => !v)}
      >
        Toggle Overview
      </button>
      <div ref={mapRef} className="w-100" style={{ height: "100vh" }} />
      <div
        ref={popupRef}
        className="ol-popup position-absolute"
        style={{ zIndex: 1001 }}
      />
    </div>
  );
}
