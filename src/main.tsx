import React from "react";
import { useGeographic } from "ol/proj";
import { createRoot } from "react-dom/client";
import "ol/ol.css";
import "bootstrap/dist/css/bootstrap.min.css";
import { Application } from "./modules/app/application";

useGeographic();

createRoot(document.getElementById("root")!).render(<Application />);
