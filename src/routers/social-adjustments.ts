import { Hono } from "hono";
import { supabase } from "../db/index";

const socialAdjustmentsRouter = new Hono();

socialAdjustmentsRouter.put("/:provinceId", async (c) => {
  try {
    const provinceId = c.req.param("provinceId");
    const socialData = await c.req.json();

    const { data, error } = await supabase
      .from("education_statistics")
      .update({ social: socialData })
      .eq("province_id", provinceId)
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return c.json({ error: error.message }, 500);
    }

    if (!data || data.length === 0) {
      return c.json({ error: "Education statistics not found for this province" }, 404);
    }

    return c.json({ message: "Social data updated successfully", data: data[0] });
  } catch (error) {
    console.error("Error updating social data:", error);
    return c.json({ error: "Failed to update social data" }, 500);
  }
});

socialAdjustmentsRouter.post("/", async (c) => {
  try {
    const { province_id, social } = await c.req.json();

    if (!province_id || !social) {
      return c.json({ error: "province_id and social data are required" }, 400);
    }

    const { data, error } = await supabase
      .from("education_statistics")
      .insert({ province_id, social })
      .select();

    if (error) {
      console.error("Supabase error:", error);
      return c.json({ error: error.message }, 500);
    }

    return c.json({ message: "Social data added successfully", data: data[0] });
  } catch (error) {
    console.error("Error adding social data:", error);
    return c.json({ error: "Failed to add social data" }, 500);
  }
});

export default socialAdjustmentsRouter;