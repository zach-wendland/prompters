"use client";

import { FormEvent, useState } from "react";
import { useApiKey } from "./api-key-context";

interface TranslationResponse {
  translated_sql: string;
  translation_notes: string;
  verification_steps: string[];
}

const DIALECTS = [
  "Auto-detect",
  "ANSI SQL",
  "MySQL",
  "PostgreSQL",
  "SQLite",
  "SQL Server",
  "Oracle",
  "Snowflake",
  "BigQuery",
  "Redshift",
];

export function SqlTranslatorForm() {
  const { apiKey } = useApiKey();
  const [sql, setSql] = useState("");
  const [sourceDialect, setSourceDialect] = useState(DIALECTS[0]);
  const [targetDialect, setTargetDialect] = useState("PostgreSQL");
  const [instructions, setInstructions] = useState("");
  const [result, setResult] = useState<TranslationResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const apiKeyMissing = !apiKey.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (apiKeyMissing) {
      setError("Configure your OpenAI API key before converting SQL.");
      return;
    }

    if (!sql.trim()) {
      setError("Enter a SQL statement to convert.");
      return;
    }

    if (!targetDialect.trim()) {
      setError("Choose a target SQL dialect.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/sql-convert", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-openai-key": apiKey,
        },
        body: JSON.stringify({
          sql,
          sourceDialect,
          targetDialect,
          instructions,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to convert SQL");
      }

      const data = (await response.json()) as TranslationResponse;
      setResult(data);
    } catch (err) {
      setResult(null);
      setError(err instanceof Error ? err.message : "Unexpected error");
    } finally {
      setIsLoading(false);
    }
  }

  return (
    <div className="grid gap-8 lg:grid-cols-[1.1fr_0.9fr]">
      <form
        onSubmit={handleSubmit}
        className="flex flex-col gap-6 rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon"
      >
        <header className="flex items-center justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.4em] text-teal">Module</p>
            <h2 className="text-2xl font-orbitron text-steel">SQL Syntax Converter</h2>
          </div>
          <span className="text-3xl" role="img" aria-hidden>
            🧮
          </span>
        </header>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-steel/60">
            <span className="text-lg text-teal" aria-hidden>
              🧾
            </span>
            Source SQL
          </label>
          <textarea
            value={sql}
            onChange={(event) => setSql(event.target.value)}
            className="h-40 w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
            placeholder="Paste or type any SQL statement, stored procedure, or query block"
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Source Dialect</label>
            <select
              value={sourceDialect}
              onChange={(event) => setSourceDialect(event.target.value)}
              className="w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel focus:border-teal focus:outline-none"
            >
              {DIALECTS.map((dialect) => (
                <option key={dialect} value={dialect}>
                  {dialect}
                </option>
              ))}
            </select>
          </div>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Target Dialect</label>
            <select
              value={targetDialect}
              onChange={(event) => setTargetDialect(event.target.value)}
              className="w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel focus:border-teal focus:outline-none"
              required
            >
              {DIALECTS.filter((dialect) => dialect !== "Auto-detect").map((dialect) => (
                <option key={dialect} value={dialect}>
                  {dialect}
                </option>
              ))}
            </select>
          </div>
        </div>

        <div className="space-y-3">
          <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Additional Guidance</label>
          <textarea
            value={instructions}
            onChange={(event) => setInstructions(event.target.value)}
            className="h-28 w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
            placeholder="Constraints, compatibility requirements, performance considerations, or formatting preferences"
          />
        </div>

        {error && (
          <div className="flex items-center gap-3 rounded-xl border border-red-500/40 bg-red-500/10 px-4 py-3 text-sm text-red-200">
            <span aria-hidden>⚠️</span>
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className="inline-flex items-center justify-center gap-2 rounded-full bg-teal px-5 py-3 font-orbitron text-sm uppercase tracking-[0.4em] text-charcoal shadow-neon transition hover:bg-aqua disabled:cursor-wait disabled:bg-teal/40"
          disabled={isLoading}
        >
          {isLoading ? "Converting" : "Deploy Conversion"}
        </button>
      </form>

      <aside className="flex h-full flex-col gap-4 rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-teal">Output</p>
          <h2 className="mt-2 text-xl font-orbitron text-steel">Dialect Translation</h2>
        </header>

        {result ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                <span aria-hidden>🧠</span>
                Converted SQL
              </h3>
              <pre className="whitespace-pre-wrap rounded-xl border border-teal/30 bg-charcoal/70 p-4 text-sm text-steel/90">
                <code>{result.translated_sql}</code>
              </pre>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                <span aria-hidden>🗒️</span>
                Translation Notes
              </h3>
              <p className="text-sm leading-relaxed text-steel/80">{result.translation_notes}</p>
            </section>

            {result.verification_steps.length > 0 && (
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                  <span aria-hidden>✅</span>
                  Verification Steps
                </h3>
                <ul className="space-y-2 text-sm text-steel/80">
                  {result.verification_steps.map((step, index) => (
                    <li key={index} className="flex gap-3">
                      <span className="text-teal/70">{index + 1}.</span>
                      <span>{step}</span>
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="flex h-full items-center justify-center rounded-xl border border-teal/20 bg-charcoal/40 p-6 text-center text-sm text-steel/60">
            Converted SQL, dialect-specific adjustments, and validation checks will appear here after deployment.
          </div>
        )}
      </aside>
    </div>
  );
}
