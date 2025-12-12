import { NextResponse } from "next/server";
import OpenAI from "openai";

interface SqlConvertRequest {
  sql: string;
  sourceDialect?: string;
  targetDialect: string;
  instructions?: string;
}

export async function POST(request: Request) {
  let body: SqlConvertRequest;

  // Parse and validate request body
  try {
    body = (await request.json()) as SqlConvertRequest;
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
  if (!body.sql?.trim()) {
    return NextResponse.json({ error: "SQL statement is required" }, { status: 400 });
  }

  if (!body.targetDialect?.trim()) {
    return NextResponse.json({ error: "Target dialect is required" }, { status: 400 });
  }

  // Validate SQL length
  if (body.sql.trim().length > 50000) {
    return NextResponse.json({ error: "SQL statement too long (max 50,000 characters)" }, { status: 400 });
  }

  const client = new OpenAI({ apiKey });

  const system = `You are PROMPTER-SQL, an elite database translation operative.
You convert SQL between dialects while preserving intent, constraints, and semantics.
Return your answer as JSON in the following format:
{
  "translated_sql": string,
  "translation_notes": string,
  "verification_steps": string[]
}`;

  const userSegments = [
    `Source SQL:\n${body.sql.trim()}`,
    `Target Dialect: ${body.targetDialect.trim()}`,
  ];

  if (body.sourceDialect && body.sourceDialect.trim() && body.sourceDialect.trim().toLowerCase() !== "auto-detect") {
    userSegments.push(`Source Dialect: ${body.sourceDialect.trim()}`);
  }

  if (body.instructions?.trim()) {
    userSegments.push(`Additional Operator Guidance: ${body.instructions.trim()}`);
  }

  const user = userSegments.join("\n\n");

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
          name: "sql_translation_response",
          schema: {
            type: "object",
            required: ["translated_sql", "translation_notes", "verification_steps"],
            properties: {
              translated_sql: { type: "string" },
              translation_notes: { type: "string" },
              verification_steps: {
                type: "array",
                items: { type: "string" },
              },
            },
            additionalProperties: false,
          },
          strict: true,
        },
      },
      temperature: 0.2,
    });

    const content = response.choices?.[0]?.message?.content;

    if (!content) {
      return NextResponse.json({ error: "No response returned from OpenAI" }, { status: 502 });
    }

    const parsed = JSON.parse(content);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("SQL conversion error:", error);

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

    return NextResponse.json({ error: "Failed to convert SQL" }, { status: 500 });
  }
}
