import { Hono } from "Hono";
import { serve } from "@hono/node-server";
import pg from "pg";
import { serveStatic } from "@hono/node-server/serve-static";

const postgresql = new pg.Pool({ user: "postgres", password: "postgres" });

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Hello World");
});

app.get("/kws2100-exam-Keev003/public/api/grunnskoler", async (c) => {
  const result = await postgresql.query(
    "select skolenavn from grunnskoler_3697913259634315b061b324a3f2cf59.grunnskole",
  );
  return c.json({
    type: "FeatureCollection",
    crs: {
      type: "name",
      properties: {
        name: "urn:ogc:def:crs:OGC:1.3:CRS84",
      },
    },
    features: result.rows,
  });
});

serve(app);
