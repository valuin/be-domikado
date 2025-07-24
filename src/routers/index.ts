import { Hono } from "hono";
import { supabase } from "../db/index";
import { createStructuredOutput } from "../utils/ai";
import provincesRouter from "./province";
import educationStatisticsRouter from "./education-statistics";
import socialAdjustmentsRouter from "./social-adjustments";

const router = new Hono();

router.get("/", (c) => {
  return c.text("OK");
});

router.get("/test", async (c) => {
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

router.post("/ai/structured", async (c) => {
  try {
    const body = await c.req.json();
    const { text } = body;

    if (!text) {
      return c.json({ error: "Text is required" }, 400);
    }

    const structuredOutput = await createStructuredOutput(text);
    
    return c.json({
      success: true,
      data: structuredOutput
    });
  } catch (error) {
    console.error("AI processing error:", error);
    return c.json({ error: "Failed to process text" }, 500);
  }
});

router.route("/provinces", provincesRouter);
router.route("/education-statistics", educationStatisticsRouter);
router.route("/social-adjustments", socialAdjustmentsRouter);

export default router;
