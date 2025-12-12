import { NextResponse } from "next/server";
import OpenAI from "openai";

interface RefinementRequest {
  prompt: string;
  context?: string;
  style?: string;
  instructions?: string;
}

export async function POST(request: Request) {
  let body: RefinementRequest;

  // Parse and validate request body
  try {
    body = (await request.json()) as RefinementRequest;
  } catch {
    return NextResponse.json({ error: "Invalid request body" }, { status: 400 });
  }

  // Get and validate API key
  const apiKey = request.headers.get("x-openai-key") ?? process.env.OPENAI_API_KEY ?? null;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 401 });
  }

  if (!apiKey.trim() || !apiKey.startsWith("sk-")) {
    return NextResponse.json({ error: "Invalid OpenAI API key format" }, { status: 401 });
  }

  // Validate required fields
  if (!body.prompt?.trim()) {
    return NextResponse.json({ error: "Prompt is required" }, { status: 400 });
  }

  // Validate prompt length (OpenAI has token limits)
  if (body.prompt.trim().length > 50000) {
    return NextResponse.json({ error: "Prompt too long (max 50,000 characters)" }, { status: 400 });
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
    const response = await client.chat.completions.create({
      model: "gpt-4o-mini",
      messages: [
        { role: "system", content: system },
        { role: "user", content: user },
      ],
      response_format: {
        type: "json_schema",
        json_schema: {
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
            additionalProperties: false,
          },
          strict: true,
        },
      },
      temperature: 0.4,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response returned from OpenAI" }, { status: 502 });
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("Prompt refinement error:", error);

    // Provide more specific error messages
    if (error instanceof SyntaxError) {
      return NextResponse.json({ error: "Failed to parse OpenAI response" }, { status: 502 });
    }

    // Handle OpenAI specific errors
    if (error instanceof Error) {
      if (error.message.includes("rate_limit")) {
        return NextResponse.json({ error: "Rate limit exceeded. Please try again later." }, { status: 429 });
      }
      if (error.message.includes("invalid_api_key")) {
        return NextResponse.json({ error: "Invalid API key" }, { status: 401 });
      }
      return NextResponse.json({ error: error.message }, { status: 500 });
    }

    return NextResponse.json({ error: "Failed to refine prompt" }, { status: 500 });
  }
}
