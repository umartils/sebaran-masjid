import { streamText, convertToModelMessages, stepCountIs, UIMessage } from 'ai';
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { createOpenAI } from "@ai-sdk/openai";
import { masjidTools } from "@/lib/ai/tools";
import { SEIMAN_SYSTEM_PROMPT } from "@/lib/ai/systme-prompt";

// Streaming response butuh runtime edge/node yang mendukung stream — default Node.js sudah cukup
export const maxDuration = 30;
const MAX_HISTORY_MESSAGES = 5;

export async function POST(req: Request) {
  const myOpenAI = createOpenAI({
    apiKey: process.env.OPENAI_API_KEY,
  });

  const myGoogleGenAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOGLE_GENERATIVE_AI_API_KEY,
  });

  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    // Pangkas history: hanya kirim N pesan terakhir ke model.
    // useChat di client tetap menyimpan full history untuk ditampilkan ke user,
    // tapi yang dikirim ke Gemini dibatasi supaya token tidak terus membesar
    // seiring panjangnya percakapan.
    const trimmedMessages = messages.slice(-MAX_HISTORY_MESSAGES);

    const result = streamText({
      model: myGoogleGenAI("gemini-2.5-flash-lite"),
      // model: myOpenAI("gpt-4o"),
      system: SEIMAN_SYSTEM_PROMPT,
      messages: await convertToModelMessages(trimmedMessages),
      tools: masjidTools,
      temperature: 0.2,
      stopWhen: stepCountIs(3),
    });

    result.usage.then((usage) => {
      console.log({
        inputToken: usage.inputTokens,
        outputToken: usage.outputTokens,
        totalToken: usage.totalTokens,
      });
    });

    return result.toUIMessageStreamResponse();
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