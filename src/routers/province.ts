import { Hono } from "hono";
import { supabase } from "../db/index";

const provincesRouter = new Hono();

provincesRouter.get("/", async (c) => {
  try {
    const { data, error } = await supabase
      .from("provinces")
      .select("*")
      .order("name", { ascending: true });

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

provincesRouter.get("/:id", async (c) => {
  try {
    const id = c.req.param("id");

    const { data, error } = await supabase
      .from("provinces")
      .select("*")
      .eq("id", id)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Province not found" }, 404);
      }
      console.error("Supabase error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ data });
  } catch (error) {
    console.error("Database error:", error);
    return c.json({ error: "Database query failed" }, 500);
  }
});

export default provincesRouter;