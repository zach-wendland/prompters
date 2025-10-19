import { NextResponse } from "next/server";
import OpenAI from "openai";

interface SqlConvertRequest {
  sql: string;
  sourceDialect?: string;
  targetDialect: string;
  instructions?: string;
}

export async function POST(request: Request) {
  const body = (await request.json()) as SqlConvertRequest;
  const apiKey = request.headers.get("x-openai-key") ?? process.env.OPENAI_API_KEY;

  if (!apiKey) {
    return NextResponse.json({ error: "Missing OpenAI API key" }, { status: 401 });
  }

  if (!body.sql?.trim()) {
    return NextResponse.json({ error: "SQL statement is required" }, { status: 400 });
  }

  if (!body.targetDialect?.trim()) {
    return NextResponse.json({ error: "Target dialect is required" }, { status: 400 });
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
    const response = await client.responses.create({
      model: "gpt-4o-mini",
      input: [
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
          },
        },
      },
      temperature: 0.2,
    });

    const output = response.output?.[0];
    const text = output?.content?.[0]?.text ?? response.output_text;

    if (!text) {
      return NextResponse.json({ error: "No response returned from OpenAI" }, { status: 502 });
    }

    const parsed = JSON.parse(text);

    return NextResponse.json(parsed);
  } catch (error) {
    console.error("SQL conversion error", error);
    return NextResponse.json({ error: "Failed to convert SQL" }, { status: 500 });
  }
}
