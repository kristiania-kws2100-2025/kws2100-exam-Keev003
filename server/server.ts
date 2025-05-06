import { Hono } from "Hono";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Hello World");
});

app.get("/kws2100-exam-Keev003/public/api/jernbanestasjoner", (c) => {
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: [],
  });
});

serve(app);
