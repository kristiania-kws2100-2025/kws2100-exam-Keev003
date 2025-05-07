import { Hono } from "Hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const postgresql = new pg.Pool({ user: "postgres", password: "postgres" });

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Hello World");
});

app.get("/api/grunnskoler", async (c) => {
  const result = await postgresql.query(
    `select skolenavn, st_transform(posisjon, 4326)::json as geometry from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole`,
  );
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map(
      ({ geometry: { coordinates }, ...properties }) => ({
        type: "Feature",
        properties,
        geometry: {
          type: "Point",
          coordinates,
        },
      }),
    ),
  });
});

serveStatic({
  path: "../dist"
});

const port = process.env.PORT ? parseInt(process.env.PORT) : 3080;
serve({
  fetch: app.fetch,
  port
});
