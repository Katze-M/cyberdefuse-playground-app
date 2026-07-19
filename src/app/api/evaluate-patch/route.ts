import { google } from "@ai-sdk/google";
import { generateObject } from "ai";
import { z } from "zod";
import { NextResponse } from "next/server";
import { auth } from '@clerk/nextjs/server';

// Simple in-memory rate limiter (per Edge isolate)
const rateLimitMap = new Map<string, { count: number; timestamp: number }>();
const RATE_LIMIT_WINDOW_MS = 60 * 1000; // 1 minute
const MAX_REQUESTS_PER_WINDOW = 5;

export async function POST(req: Request) {
  try {
    // 1. Identify the user via Clerk Auth
    const { userId } = await auth();
    
    if (!userId) {
      return NextResponse.json(
        { error: "Unauthorized: You must be logged in to deploy patches." },
        { status: 401 }
      );
    }

    // 2. Enforce Rate Limiting per User
    const now = Date.now();
    const userRateData = rateLimitMap.get(userId) || { count: 0, timestamp: now };

    // Reset window if it has passed
    if (now - userRateData.timestamp > RATE_LIMIT_WINDOW_MS) {
      userRateData.count = 0;
      userRateData.timestamp = now;
    }

    userRateData.count++;
    rateLimitMap.set(userId, userRateData);

    if (userRateData.count > MAX_REQUESTS_PER_WINDOW) {
      return NextResponse.json(
        { error: "Too many attempts! Please wait a moment before deploying another patch." },
        { status: 429 }
      );
    }

    const { code, vulnerabilityContext, scenarioId } = await req.json();

    if (!code) {
      return NextResponse.json(
        { error: "Code submission is required." },
        { status: 400 }
      );
    }

    const currentContext = vulnerabilityContext || "The system currently has an S3 bucket with an overly permissive IAM policy allowing public 's3:GetObject'.";
    
    // Evaluate the code using Gemini with structured output
    const { object } = await generateObject({
      model: google("gemini-3.5-flash"),
      schema: z.object({
        isPatched: z.boolean().describe("True if the user's code successfully fixes the vulnerability, false otherwise."),
        feedbackMessage: z.string().describe("A short, in-character mentor response (max 2 sentences) evaluating the patch."),
        animationState: z.enum(["breach", "blocked"]).describe("Return 'blocked' if successfully patched, 'breach' if still vulnerable."),
      }),
      prompt: `
      You are a senior cybersecurity mentor evaluating a trainee's patch for a vulnerable system configuration.
      
      Vulnerability Context: ${currentContext}
      
      The user submitted the following patch code (JSON):
      \`\`\`json
      ${code}
      \`\`\`
      
      Analyze their code. Did they fix the vulnerability by restricting access? (e.g., removing the wildcards, adding a specific Condition, or denying access to public entities).
      If their JSON is malformed, it is not a successful patch.
      
      Respond with a strict JSON object matching the schema.
      `,
    });

    return NextResponse.json(object);
  } catch (error: any) {
    console.error("Evaluation Error:", error);
    
    const errorMessage = error?.message?.toLowerCase() || "";
    if (errorMessage.includes("429") || errorMessage.includes("quota") || errorMessage.includes("exhausted")) {
       return NextResponse.json(
        { error: "Our daily AI limit has been reached! Please check back tomorrow." },
        { status: 429 }
      );
    }

    return NextResponse.json(
      { error: `Failed to evaluate the patch: ${error?.message || String(error)}` },
      { status: 500 }
    );
  }
}
