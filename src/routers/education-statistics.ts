import { Hono } from "hono";
import { supabase } from "../db/index.js";
import { createStructuredOutput } from "../utils/ai";

const educationStatisticsRouter = new Hono();

educationStatisticsRouter.get("/list", async (c) => {
  try {
    const { data, error } = await supabase
      .from("education_statistics")
      .select(`
        province_id,
        infrastructure,
        workers,
        funding,
        social,
        provinces (
          id,
          name
        )
      `);

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

educationStatisticsRouter.get("/:provinceId", async (c) => {
  try {
    const provinceId = c.req.param("provinceId");

    const { data, error } = await supabase
      .from("education_statistics")
      .select(`
        province_id,
        infrastructure,
        workers,
        funding,
        social,
        provinces (
          id,
          name
        )
      `)
      .eq("province_id", provinceId)
      .single();

    if (error) {
      if (error.code === "PGRST116") {
        return c.json({ error: "Education statistics not found for this province" }, 404);
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

educationStatisticsRouter.get("/:provinceId/summary", async (c) => {
  try {
    const provinceId = c.req.param("provinceId");

    const { data, error } = await supabase
      .from("education_statistics")
      .select(`
        province_id,
        infrastructure,
        workers,
        funding,
        social,
        provinces (
          id,
          name
        )
      `)
      .eq("province_id", provinceId)
      .single();


    console.log("Fetched data for summary:", data); // Log the data to inspect its structure

    if (!data) {
      return c.json({ error: "Education statistics or province data not found for this province" }, 404);
    }

    const textToSummarize = `Education statistics for province ${data.provinces} (ID: ${data.province_id}):
    Infrastructure: ${JSON.stringify(data.infrastructure)}
    Workers: ${JSON.stringify(data.workers)}
    Funding: ${data.funding}
    Social: ${JSON.stringify(data.social)}`;

    console.log("Text to summarize:", textToSummarize); // Log the text to be summarized

    const structuredOutput = await createStructuredOutput(textToSummarize);

    return c.json({ data: structuredOutput });
  } catch (error) {
    console.error("AI summary error:", error);
    return c.json({ error: "Failed to generate summary" }, 500);
  }
});

export default educationStatisticsRouter;
