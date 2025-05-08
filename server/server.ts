import { Hono } from "hono";
import { serve } from "@hono/node-server";
import { serveStatic } from "@hono/node-server/serve-static";
import pg from "pg";

const connectionString = process.env.DATABASE_URL;
const postgresql = connectionString
    ? new pg.Pool({ connectionString, ssl: {rejectUnauthorized: false}})
    : new pg.Pool({ user: "postgres"});

const app = new Hono();

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

app.get("/api/jernbanelinjer", async (c) => {
  const result = await postgresql.query(`
    SELECT json_build_object('type', 'FeatureCollection','features', json_agg(json_build_object('type', 'Feature','geometry', 
        ST_AsGeoJSON(ST_Transform(senterlinje, 4326))::json,'properties', to_jsonb(t) - 'senterlinje'))) AS geojson
    FROM banenettverk_cc734c5dc3204a9a821d69ffe8453e96.banelenke t;`,
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
            type: "LineString",
            coordinates,
          },
        }),
    ),
  });
});

app.get("/api/flomsoner", async (c) => {
  const result = await postgresql.query(`
    SELECT flomsonenavn, st_transform(omrade, 4326)::json AS geometry
    FROM flomsoner_1529319085a74cb4a984f168f5cf63f2.analyseomrade
  `);
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map(({ geometry: { coordinates }, ...properties }) => ({
      type: "Feature",
      properties,
      geometry: {
        type: "Polygon",
        coordinates,
      },
    })),
  })
});

app.get("/api/skreddfare", async (c) =>{
  const result = await postgresql.query(`
    SELECT st_transform(omrade, 4326)::json AS geometry
    FROM skredfaresoner_25498f9527954ebf9fa12b7102b1cb38.analyseomrade
  `);
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows.map(({ geometry: { coordinates }, ...properties }) => ({

      type: "Feature",
      properties,
      geometry: {
        type: "Polygon",
        coordinates
      },
    })),
  })
});

app.use("*", serveStatic({
  root: "../dist",
  rewriteRequestPath: (path) => path === '/' ? '/index.html' : path,
}));

const port = process.env.PORT ? parseInt(process.env.PORT) : 3000;
serve({
  fetch: app.fetch,
  port,
});
