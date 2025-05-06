import { Hono } from "Hono";
import { serve } from "@hono/node-server";

const app = new Hono();
app.get("/", async (c) => {
  return c.text("Hello World");
});

serve(app);
