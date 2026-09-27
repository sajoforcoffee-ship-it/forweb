import { createFileRoute } from "@tanstack/react-router";
import { createGoogleGenerativeAI } from "@ai-sdk/google";
import { convertToModelMessages, streamText, type UIMessage } from "ai";
import { z } from "zod";

import {
  createLovableAiGatewayProvider,
  createLovableResponsesProvider,
  getLovableAiGatewayResponseHeaders,
  getLovableAiGatewayRunId,
  withLovableAiGatewayRunIdHeader,
} from "@/lib/ai-gateway.server";
import { kategoriler } from "@/data/akademi";

export const MODELLER = {
  gemini: "google/gemini-3.6-flash",
  openai: "openai/gpt-5.4-mini",
  "gemini-pro": "google/gemini-3.1-pro-preview",
  // Kullanıcının kendi Gemini API anahtarıyla (GEMINI_API_KEY) çalışan modeller
  "byok-pro": "byok:gemini-2.5-pro",
  "byok-flash": "byok:gemini-2.0-flash",
} as const;

export type ModelAnahtari = keyof typeof MODELLER;

function akademiOzeti() {
  return kategoriler
    .map((k) => {
      const bolumler = k.bolumler
        .map((b) => {
          const govde = [...(b.paragraflar ?? []), ...(b.maddeler ?? []), b.not ?? ""]
            .filter(Boolean)
            .join(" ");
          return `- ${b.baslik}: ${govde}`;
        })
        .join("\n");
      return `## ${k.ad} (/kategoriler/${k.slug}) — ${k.seviye}\n${k.ozet}\n${bolumler}`;
    })
    .join("\n\n");
}

const SISTEM = `Sen FOR COFFEE Dijital Kahve Akademisi'nin uzman kahve asistanısın.
Kurallar:
- Yanıtlarını HER ZAMAN Türkçe ver.
- Sıcak, net ve uzman bir tonda, kısa paragraflar ve gerektiğinde madde işaretleri kullan.
- Öncelikle aşağıdaki akademi içeriğine dayan; içerikte yoksa genel kahve uzmanlığınla yanıtla.
- Ölçüler için somut ol (oran, sıcaklık, süre, öğütüm kalınlığı).
- İlgili olduğunda kullanıcıyı akademi sayfalarına yönlendir (örn. /kategoriler/demleme-teknikleri).
- FOR COFFEE saf kahve satar: ilave şeker, aroma ve katkı maddesi yoktur.

AKADEMİ İÇERİĞİ:
${akademiOzeti()}`;

export const Route = createFileRoute("/api/chat")({
  server: {
    handlers: {
      POST: async ({ request }) => {
        let payload: { messages: UIMessage[]; model?: ModelAnahtari };
        try {
          const parsed = z
            .object({
              messages: z.array(z.unknown()).min(1).max(50),
              model: z
                .enum(["gemini", "openai", "gemini-pro", "byok-pro", "byok-flash"])
                .optional(),
            })
            .parse(await request.json());
          payload = parsed.model
            ? { messages: parsed.messages as UIMessage[], model: parsed.model }
            : { messages: parsed.messages as UIMessage[] };
        } catch {
          return Response.json(
            { error: "Geçersiz istek. Mesajlarınızı kontrol edin." },
            { status: 400 },
          );
        }

        const { messages, model } = payload;
        const secim: ModelAnahtari = model ?? "gemini";
        const modelId = MODELLER[secim];
        const initialRunId = getLovableAiGatewayRunId(request);
        const byok = modelId.startsWith("byok:");

        // Kendi Gemini anahtarıyla çalışan yol (Google Generative AI)
        if (byok) {
          const gk = process.env["GEMINI_API_KEY"];
          if (!gk) {
            return new Response("Bu model şu anda kullanılamıyor. Lütfen başka bir model seçin.", {
              status: 503,
            });
          }
          try {
            const google = createGoogleGenerativeAI({ apiKey: gk });
            const result = streamText({
              model: google(modelId.slice("byok:".length)),
              system: SISTEM,
              messages: await convertToModelMessages(messages as UIMessage[]),
            });
            return result.toUIMessageStreamResponse({
              originalMessages: messages as UIMessage[],
              onError: (error) => {
                const m = error instanceof Error ? error.message : String(error);
                return /429|quota|rate/i.test(m)
                  ? "Gemini API anahtarınızın kotası doldu. Lütfen kotanızı kontrol edin veya başka bir model seçin."
                  : `Gemini hatası: ${m}`;
              },
            });
          } catch (error) {
            const message = error instanceof Error ? error.message : String(error);
            const status = /429|quota|rate/i.test(message) ? 429 : 502;
            return Response.json(
              {
                error:
                  status === 429
                    ? "Model kotası doldu. Lütfen başka bir model deneyin."
                    : "Asistan şu anda yanıt veremiyor.",
              },
              { status },
            );
          }
        }

        const key = process.env["LOVABLE_API_KEY"];
        if (!key)
          return Response.json({ error: "Asistan yapılandırması hazır değil." }, { status: 503 });

        const gateway = modelId.startsWith("openai/")
          ? createLovableResponsesProvider(key, initialRunId)
          : createLovableAiGatewayProvider(key, initialRunId);

        const languageModel = modelId.startsWith("openai/")
          ? (gateway as ReturnType<typeof createLovableResponsesProvider>).responses(modelId)
          : (gateway as ReturnType<typeof createLovableAiGatewayProvider>)(modelId);

        try {
          const result = streamText({
            model: languageModel,
            system: SISTEM,
            messages: await convertToModelMessages(messages as UIMessage[]),
            ...(modelId.startsWith("openai/")
              ? { providerOptions: { openai: { store: false } } }
              : {}),
          });

          const response = result.toUIMessageStreamResponse({
            originalMessages: messages as UIMessage[],
            headers: getLovableAiGatewayResponseHeaders(undefined, {
              ...(initialRunId ? { "X-Lovable-AIG-Run-ID": initialRunId } : {}),
            }),
          });

          return await withLovableAiGatewayRunIdHeader(response, gateway);
        } catch (error) {
          const message = error instanceof Error ? error.message : String(error);
          const status = /429|rate/i.test(message) ? 429 : /402|credit/i.test(message) ? 402 : 500;
          return Response.json(
            {
              error:
                status === 429
                  ? "Model kotası doldu. Lütfen başka bir model deneyin."
                  : status === 402
                    ? "Asistan kullanım limiti doldu."
                    : "Asistan şu anda yanıt veremiyor.",
            },
            { status },
          );
        }
      },
    },
  },
});
