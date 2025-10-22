import { NextResponse } from "next/server";
import OpenAI from "openai";

interface RefinementRequest {
  prompt: string;
  context?: string;
  style?: string;
  instructions?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as RefinementRequest;
  const apiKey = request.headers.get("x-openai-key") ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 401 });
  }

  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });

  const styleSuffix = body.style ? `\nPreferred Style: ${body.style}` : "";
  const contextSuffix = body.context ? `\nContext: ${body.context}` : "";
  const extraInstructions = body.instructions ? `\nAdditional Operator Instructions: ${body.instructions}` : "";

  const system = `You are PROMPTER, an elite tactical prompt refinement agent.
You will transform raw operator prompts into precise, unambiguous instructions ready for execution by large language models.
Return your answer as JSON in the following format:
{
  "refined_prompt": string,
  "rationale": string,
  "follow_up_questions": string[]
}`;

  const user = `Original Prompt: ${body.prompt.trim()}${styleSuffix}${contextSuffix}${extraInstructions}`;

  try {
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      text: {
        format: {
          type: "json_schema",
          name: "prompt_refinement_response",
          schema: {
            type: "object",
            required: ["refined_prompt", "rationale", "follow_up_questions"],
            properties: {
              refined_prompt: { type: "string" },
              rationale: { type: "string" },
              follow_up_questions: {
                type: "array",
                items: { type: "string" },
              },
            },
          },
          strict: true,
        },
      },
      temperature: 0.4,
    });

    const structuredText = response.output
      ?.flatMap((item) =>
        item.type === "message"
          ? item.content.map((part) => (part.type === "output_text" ? part.text : undefined))
          : [],
      )
      .find((value): value is string => typeof value === "string");

    const text = (response.output_text || structuredText)?.trim();

    if (!text) {
      return NextResponse.json({ error: "No response returned from OpenAI" }, { status: 502 });
    }

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Prompt refinement error", error);
    return NextResponse.json({ error: "Failed to refine prompt" }, { status: 500 });
  }
}
