import "dotenv/config";
import { Hono } from "hono";
import { cors } from "hono/cors";
import { logger } from "hono/logger";
import { supabase } from "./db/index.js";
import { handle } from 'hono/vercel'

const app = new Hono().basePath('/api')

app.use(logger());
app.use("/*", cors({
  origin: process.env.CORS_ORIGIN || "",
  allowMethods: ["GET", "POST", "OPTIONS"],
}));

app.get("/", (c) => {
  return c.text("OK");
});

app.get("/test", async (c) => {
  try {
    const { data, error } = await supabase
      .from('test_table')
      .select('*')
      .order('created_at', { ascending: false });

    if (error) {
      console.error("Supabase error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data });
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ error: "Database query failed" }, 500);
  }
});

import { serve } from "@hono/node-server";

serve({
  fetch: app.fetch,
  port: 3000,
}, (info) => {
  console.log(`Server is running on http://localhost:${info.port}`);
});

const handler = handle(app);

export const GET = handler;
export const POST = handler;
export const PATCH = handler;
export const PUT = handler;
export const OPTIONS = handler;
