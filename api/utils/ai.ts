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
    schemaName: "EducationStatisticsAnalysis",
    prompt: `Analyze the following education statistics data. Provide a rigorous, quantifiable, and academic evaluation, including key insights, strengths, weaknesses, and actionable recommendations. Focus on identifying trends, disparities, and areas for strategic intervention.

Education Statistics Data:
"${text}"`,
    schema: z.object({
      overall_assessment: z
        .string()
        .describe(
          "An academic assessment of the overall state of education based on the provided statistics."
        ),
      key_metrics: z
        .array(
          z.object({
            metric_name: z
              .string()
              .describe(
                "Name of the quantifiable metric (e.g., 'Student-to-Teacher Ratio - Elementary', 'Mean Household Income')."
              ),
            value: z
              .string()
              .describe("The quantifiable value of the metric, represented as a string."),
            interpretation: z
              .string()
              .describe(
                "Academic interpretation of the metric's significance and implications."
              ),
          })
        )
        .describe(
          "A list of key quantifiable metrics extracted and interpreted from the data."
        ),
      strengths: z
        .array(
          z.object({
            area: z
              .string()
              .describe(
                "Area of strength (e.g., 'Higher Education Enrollment', 'Teacher-to-Student Ratios')."
              ),
            evidence: z
              .string()
              .describe("Quantifiable evidence supporting this strength."),
            implication: z
              .string()
              .describe("The positive implication of this strength."),
          })
        )
        .describe(
          "Identified strengths of the education system with supporting quantifiable evidence."
        ),
      weaknesses: z
        .array(
          z.object({
            area: z
              .string()
              .describe(
                "Area of weakness (e.g., 'Infrastructure Deficit', 'Skillset Mismatch')."
              ),
            evidence: z
              .string()
              .describe("Quantifiable evidence supporting this weakness."),
            impact: z
              .string()
              .describe(
                "The negative impact or challenge posed by this weakness."
              ),
          })
        )
        .describe(
          "Identified weaknesses or challenges in the education system with supporting quantifiable evidence."
        ),
      recommendations: z
        .array(
          z.object({
            recommendation: z
              .string()
              .describe(
                "Specific, actionable, and academically sound recommendation."
              ),
            justification: z
              .string()
              .describe(
                "Quantifiable or academic justification for the recommendation."
              ),
            priority: z
              .enum(["High", "Medium", "Low"])
              .describe("Priority level for implementing the recommendation."),
          })
        )
        .describe(
          "Actionable recommendations to improve the education system, based on the analysis."
        ),
    }),
  });

  return object;
};
