import { streamText, convertToModelMessages, stepCountIs, UIMessage } from 'ai';
import { google, createGoogleGenerativeAI } from '@ai-sdk/google';
import { masjidTools } from '@/lib/ai/tools';
import { SEIMAN_SYSTEM_PROMPT } from '@/lib/ai/systme-prompt';

// Streaming response butuh runtime edge/node yang mendukung stream — default Node.js sudah cukup
export const maxDuration = 30;

export async function POST(req: Request) {
  const myGoogleGenAI = createGoogleGenerativeAI({
    apiKey: process.env.GOOLE_API_KEY,
  })
  try {
    const { messages }: { messages: UIMessage[] } = await req.json();

    const result = streamText({
      model: myGoogleGenAI('gemini-2.5-flash-lite'),
      system: SEIMAN_SYSTEM_PROMPT,
      messages: await convertToModelMessages(messages), // v5: UIMessage[] dari client -> ModelMessage[] untuk LLM
      tools: masjidTools,
      // v5: maxSteps dihapus dari useChat; kontrol multi-step kini di server lewat stopWhen.
      // stepCountIs(4) mengizinkan AI memanggil beberapa tool berurutan
      // (misal: getProgresMasjid -> getLaporanProgresPdf) sebelum berhenti.
      stopWhen: stepCountIs(4),
      onStepFinish: (step) => {
        console.log('--- STEP FINISH ---');
        console.log('toolCalls:', JSON.stringify(step.toolCalls, null, 2));
        console.log('toolResults:', JSON.stringify(step.toolResults, null, 2));
        console.log('text:', step.text);
        console.log('finishReason:', step.finishReason);
      },
    });
    result.usage.then((usage) => {
        console.log({
            inputToken: usage.inputTokens,
            outputToken: usage.outputTokens,
            totalToken: usage.totalTokens
        });
    });
    return result.toUIMessageStreamResponse();
  } catch (error) {
    console.error('Chat API error:', error);
    return new Response(
      JSON.stringify({ error: 'Terjadi kesalahan saat memproses permintaan chat.' }),
      { status: 500, headers: { 'Content-Type': 'application/json' } }
    );
  }
}