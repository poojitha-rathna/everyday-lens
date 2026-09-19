import { createServerFn } from "@tanstack/react-start";
import { z } from "zod";
import type { AnalysisResponse, AnalysisResult } from "./analysis-types";
import { mockAnalyze } from "./mock-analysis";

/**
 * Image analysis server function.
 *
 * Pipeline: image (data URL) → Lovable AI vision model → structured JSON
 * (identification, extracted text, meanings, usage, instructions, warnings).
 *
 * If the AI service is unavailable (missing key, quota, outage) the function
 * falls back to the mock analysis system so the app remains demonstrable.
 * To swap in another OCR/vision provider, replace `analyzeWithAi` only.
 */

const Input = z.object({
  image: z.string().startsWith("data:image/"),
  fileName: z.string().default("upload"),
});

const SYSTEM_PROMPT = `You are Everyday Lens, an assistant that helps people understand everyday objects from a photo: cards, medicine boxes, product packages, bills, tickets, appliance labels, documents, signs, and similar.

Given one image, respond ONLY with JSON matching the provided schema.
Guidelines:
- objectName: short plain name (e.g. "Debit card", "Medicine box"). category: broad type.
- confidence: 0-100 integer, how sure you are about the identification.
- summary: 1-2 friendly sentences describing what is visible.
- extractedText: the readable text on the object, one line per string, in reading order (max 15 lines). If no text, return an empty array.
- meanings: 3-6 items explaining the important text, numbers, symbols, labels or sections in very simple language. label = the exact item, explanation = one sentence.
- usage: 1-3 sentences on how this object is normally used.
- instructions: 2-4 short practical instructions. warnings: 1-4 short safety/caution notes.
- PRIVACY: never output full card numbers, CVV, PIN, OTP, passwords, Aadhaar/SSN-like IDs or account numbers. Mask them, keeping at most the last 4 digits (e.g. "4029 •••• •••• 1884"). Set sensitiveDataDetected=true when any such data is visible and write a short sensitiveDataNote; otherwise false and an empty string.
- Never give banking, payment or financial-transaction advice beyond general safety.
- Use simple, non-technical English.`;

const RESULT_SCHEMA = {
  type: "object",
  additionalProperties: false,
  required: [
    "objectName",
    "category",
    "confidence",
    "summary",
    "extractedText",
    "meanings",
    "usage",
    "instructions",
    "warnings",
    "sensitiveDataDetected",
    "sensitiveDataNote",
  ],
  properties: {
    objectName: { type: "string" },
    category: { type: "string" },
    confidence: { type: "integer" },
    summary: { type: "string" },
    extractedText: { type: "array", items: { type: "string" } },
    meanings: {
      type: "array",
      items: {
        type: "object",
        additionalProperties: false,
        required: ["label", "explanation"],
        properties: { label: { type: "string" }, explanation: { type: "string" } },
      },
    },
    usage: { type: "string" },
    instructions: { type: "array", items: { type: "string" } },
    warnings: { type: "array", items: { type: "string" } },
    sensitiveDataDetected: { type: "boolean" },
    sensitiveDataNote: { type: "string" },
  },
} as const;

class GatewayError extends Error {
  status: number;
  constructor(status: number, message: string) {
    super(message);
    this.status = status;
  }
}

async function analyzeWithAi(image: string, apiKey: string): Promise<AnalysisResult> {
  const res = await fetch("https://ai.gateway.lovable.dev/v1/responses", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "Lovable-API-Key": apiKey,
      "X-Lovable-AIG-SDK": "fetch",
    },
    body: JSON.stringify({
      model: "openai/gpt-6-astra",
      stream: true,
      reasoning: { effort: "low", summary: "auto" },
      include: ["reasoning.encrypted_content"],
      instructions: SYSTEM_PROMPT,
      input: [
        {
          role: "user",
          content: [
            { type: "input_text", text: "Identify this everyday object and explain it. Respond with JSON." },
            { type: "input_image", image_url: image, detail: "high" },
          ],
        },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "everyday_lens_analysis",
          strict: true,
          schema: RESULT_SCHEMA,
        },
      },
    }),
  });

  if (!res.ok || !res.body) {
    let message = `AI service returned ${res.status}`;
    try {
      const body = (await res.json()) as { error?: { message?: string }; message?: string };
      message = body.error?.message ?? body.message ?? message;
    } catch {
      /* ignore */
    }
    throw new GatewayError(res.status, message);
  }

  // Read the SSE stream and accumulate output text deltas.
  const reader = res.body.getReader();
  const decoder = new TextDecoder();
  let buffer = "";
  let text = "";
  let finalText: string | null = null;

  const handleEvent = (raw: string) => {
    if (!raw.trim()) return;
    let evt: { type?: string; delta?: string; response?: { output_text?: string; output?: unknown[] } };
    try {
      evt = JSON.parse(raw);
    } catch {
      return;
    }
    if (evt.type === "response.output_text.delta" && typeof evt.delta === "string") {
      text += evt.delta;
    } else if (evt.type === "response.completed" && evt.response) {
      if (typeof evt.response.output_text === "string" && evt.response.output_text) {
        finalText = evt.response.output_text;
      }
    } else if (evt.type === "error") {
      throw new GatewayError(500, "AI stream error");
    }
  };

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buffer += decoder.decode(value, { stream: true });
    const parts = buffer.split("\n\n");
    buffer = parts.pop() ?? "";
    for (const part of parts) {
      for (const line of part.split("\n")) {
        if (line.startsWith("data:")) handleEvent(line.slice(5).trim());
      }
    }
  }
  if (buffer) {
    for (const line of buffer.split("\n")) {
      if (line.startsWith("data:")) handleEvent(line.slice(5).trim());
    }
  }

  const json = finalText ?? text;
  if (!json.trim()) throw new GatewayError(500, "AI returned an empty result");

  const parsed = JSON.parse(json) as AnalysisResult;
  return {
    ...parsed,
    confidence: Math.max(0, Math.min(100, Math.round(Number(parsed.confidence) || 0))),
    extractedText: (parsed.extractedText ?? []).slice(0, 20),
    meanings: (parsed.meanings ?? []).slice(0, 8),
    instructions: (parsed.instructions ?? []).slice(0, 6),
    warnings: (parsed.warnings ?? []).slice(0, 6),
  };
}

function friendlyNote(err: unknown): string {
  if (err instanceof GatewayError) {
    if (err.status === 402) return "AI credits are exhausted. Showing a sample analysis instead.";
    if (err.status === 429) return "AI service is busy right now. Showing a sample analysis instead.";
    if (err.status === 401) return "AI service is not configured. Showing a sample analysis instead.";
    return `AI service unavailable (${err.message}). Showing a sample analysis instead.`;
  }
  return "AI service unavailable. Showing a sample analysis instead.";
}

export const analyzeImage = createServerFn({ method: "POST" })
  .inputValidator((input: unknown) => Input.parse(input))
  .handler(async ({ data }): Promise<AnalysisResponse> => {
    const started = Date.now();
    const apiKey = process.env["LOVABLE_API_KEY"];

    if (!apiKey) {
      return {
        result: mockAnalyze(data.fileName),
        source: "mock",
        note: "AI service is not connected yet. Showing a sample analysis.",
        durationMs: Date.now() - started,
      };
    }

    try {
      const result = await analyzeWithAi(data.image, apiKey);
      return { result, source: "ai", note: null, durationMs: Date.now() - started };
    } catch (err) {
      console.error("[everyday-lens] AI analysis failed:", err);
      return {
        result: mockAnalyze(data.fileName),
        source: "mock",
        note: friendlyNote(err),
        durationMs: Date.now() - started,
      };
    }
  });
