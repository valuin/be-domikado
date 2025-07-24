import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { tool, generateObject } from "ai";
import { z } from "zod";

const google = createGoogleGenerativeAI({
  apiKey: process.env.GOOGLE_API_KEY,
});

const openai = createOpenAI({
  baseURL: "https://openrouter.ai/api/v1",
  apiKey: process.env.OPENAI_API_KEY,
});

export const createStructuredOutput = async (text: string) => {
  const googleModel = google("gemini-2.0-flash");

  const { object } = await generateObject({
    model: googleModel,
    schemaName: "StructuredOutput",
    prompt: `Extract the date, location, and sentiment from the following text: "${text}"`,
    schema: z.object({
      date: z.string().describe("The date mentioned in the text"),
      location: z.string().describe("The location mentioned in the text"),
      sentiment: z
        .enum(["positive", "negative", "neutral"])
        .describe(
          "The overall sentiment of the text between positive, negative, or neutral"
        ),
    }),
  });

  return object;
};
