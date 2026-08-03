// /api/chat/route.ts

import { streamText, convertToModelMessages, stepCountIs, UIMessage } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { masjidTools } from "@/lib/ai/tools";
import { SEIMAN_SYSTEM_PROMPT } from "@/lib/ai/system-prompt";
import { NextRequest, NextResponse } from 'next/server';
import { resolveIdentity } from '@/lib/identity';
import { checkQuota, incrementUsage } from '@/lib/ai/quota';

// Streaming response butuh runtime edge/node yang mendukung stream — default Node.js sudah cukup
export const maxDuration = 30;
const MAX_HISTORY_MESSAGES = 3;
const ANON_COOKIE_NAME = "seiman_anon_id";
const ANON_COOKIE_MAX_AGE = 60 * 60 * 24 * 365;

export async function POST(req: NextRequest) {
  const myOpenAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const myGoogleGenAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  try {
    const { identity, isNewAnonId } = await resolveIdentity(req);
    const quotaResult = await checkQuota(identity);
    if (!quotaResult.allowed) {
      return NextResponse.json(
        {
          message: "Kuota harian mu habis",
          reason: quotaResult.reason,
        },
        {
          status: 403,
        }
      )
    }
    const { messages }: { messages: UIMessage[] } = await req.json();
    
    const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);


    const result = streamText({
      model: myGoogleGenAI("gemini-2.5-flash"),
      // model: myOpenAI("gpt-4o"),
      system: SEIMAN_SYSTEM_PROMPT,
      messages: await convertToModelMessages(trimmedMessages),
      tools: masjidTools,
      temperature: 0.2,
      stopWhen: stepCountIs(3),
    });

    result.usage.then((usage) => {
      incrementUsage(identity, {
        inputTokens: usage.inputTokens ?? 0,
        outputTokens: usage.outputTokens ?? 0,
        totalTokens: usage.totalTokens ?? 0,
      }).catch((err) => console.error("Gagal mencatat token usage:", err));
    });

    const response = result.toUIMessageStreamResponse();

    if (identity.mode === "anon" && isNewAnonId) {
      
      response.headers.append(
        "Set-Cookie",
        `${ANON_COOKIE_NAME}=${identity.anonId}; Path=/; Max-Age=${ANON_COOKIE_MAX_AGE}; SameSite=Lax; HttpOnly`
      );
    }

    return response;

  } catch (error) {
    console.error("Chat API error:", error);
    return new Response(
      JSON.stringify({
        error: "Terjadi kesalahan saat memproses permintaan chat.",
      }),
      { status: 500, headers: { "Content-Type": "application/json" } }
    );
  }
}