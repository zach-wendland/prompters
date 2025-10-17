"use client";

import { FormEvent, useMemo, useState } from "react";
import { useApiKey } from "./api-key-context";

interface RefinementResponse {
  refined_prompt: string;
  rationale: string;
  follow_up_questions: string[];
}

const STYLE_PRESETS = [
  {
    label: "Precision Directive",
    value: "precision",
    description: "Structured, concise instructions optimal for coding or technical tasks.",
  },
  {
    label: "Strategic Narrative",
    value: "narrative",
    description: "Balanced clarity and storytelling for product, marketing, or UX briefs.",
  },
  {
    label: "Exploratory Analysis",
    value: "analysis",
    description: "Encourages critical thinking, hypothesis exploration, and decision framing.",
  },
  {
    label: "Creative Catalyst",
    value: "creative",
    description: "Inventive language that unlocks ideation and divergent thinking.",
  },
];

function useStyleLabel(value: string) {
  return useMemo(() => STYLE_PRESETS.find((preset) => preset.value === value)?.label ?? value, [value]);
}

export function PromptRefinerForm() {
  const { apiKey } = useApiKey();
  const [prompt, setPrompt] = useState("");
  const [context, setContext] = useState("");
  const [instructions, setInstructions] = useState("");
  const [style, setStyle] = useState(STYLE_PRESETS[0].value);
  const [result, setResult] = useState<RefinementResponse | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [isLoading, setIsLoading] = useState(false);

  const selectedLabel = useStyleLabel(style);
  const apiKeyMissing = !apiKey.trim();

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    setError(null);

    if (apiKeyMissing) {
      setError("Configure your OpenAI API key before refining prompts.");
      return;
    }

    if (!prompt.trim()) {
      setError("Enter a prompt to refine.");
      return;
    }

    setIsLoading(true);

    try {
      const response = await fetch("/api/refine", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          "x-openai-key": apiKey,
        },
        body: JSON.stringify({
          prompt,
          context,
          style: selectedLabel,
          instructions,
        }),
      });

      if (!response.ok) {
        const data = await response.json().catch(() => ({}));
        throw new Error(data.error ?? "Failed to refine prompt");
      }

      const data = (await response.json()) as RefinementResponse;
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
            <h2 className="text-2xl font-orbitron text-steel">Prompt Refiner</h2>
          </div>
          <span className="text-3xl" role="img" aria-hidden>
            ✨
          </span>
        </header>

        <div className="space-y-3">
          <label className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-steel/60">
            <span className="text-lg text-teal" aria-hidden>
              🗒️
            </span>
            Raw Prompt
          </label>
          <textarea
            value={prompt}
            onChange={(event) => setPrompt(event.target.value)}
            className="h-40 w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
            placeholder="Describe the task you need the model to complete..."
            required
          />
        </div>

        <div className="grid gap-4 md:grid-cols-2">
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Operational Context</label>
            <textarea
              value={context}
              onChange={(event) => setContext(event.target.value)}
              className="h-32 w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
              placeholder="Relevant business constraints, stakeholders, tooling, or datasets"
            />
          </div>
          <div className="space-y-3">
            <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Additional Directives</label>
            <textarea
              value={instructions}
              onChange={(event) => setInstructions(event.target.value)}
              className="h-32 w-full rounded-xl border border-teal/40 bg-charcoal/80 px-4 py-3 text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
              placeholder="Edge cases, deliverable format, tone requirements, or risk considerations"
            />
          </div>
        </div>

        <div className="space-y-4">
          <label className="text-xs uppercase tracking-[0.4em] text-steel/60">Refinement Style</label>
          <div className="grid gap-3 md:grid-cols-2">
            {STYLE_PRESETS.map((preset) => (
              <button
                key={preset.value}
                type="button"
                onClick={() => setStyle(preset.value)}
                className={`rounded-xl border px-4 py-3 text-left transition focus:outline-none focus:ring-2 focus:ring-teal/60 ${
                  style === preset.value
                    ? "border-teal/70 bg-teal/10 text-steel"
                    : "border-teal/30 bg-charcoal/60 text-steel/80 hover:border-teal/50"
                }`}
              >
                <p className="font-orbitron text-sm text-aqua">{preset.label}</p>
                <p className="mt-1 text-xs text-steel/70">{preset.description}</p>
              </button>
            ))}
          </div>
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
          {isLoading ? "Refining" : "Deploy Refinement"}
        </button>
      </form>

      <aside className="flex h-full flex-col gap-4 rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon">
        <header>
          <p className="text-xs uppercase tracking-[0.4em] text-teal">Output</p>
          <h2 className="mt-2 text-xl font-orbitron text-steel">Refinement Report</h2>
        </header>

        {result ? (
          <div className="space-y-6">
            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                <span aria-hidden>🧠</span>
                Refined Prompt
              </h3>
              <pre className="whitespace-pre-wrap rounded-xl border border-teal/40 bg-charcoal/70 px-4 py-4 text-sm text-steel">
                {result.refined_prompt}
              </pre>
            </section>

            <section className="space-y-3">
              <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                <span aria-hidden>🛰️</span>
                Rationale
              </h3>
              <p className="rounded-xl border border-teal/40 bg-charcoal/70 px-4 py-4 text-sm text-steel/90">
                {result.rationale}
              </p>
            </section>

            {result.follow_up_questions.length > 0 && (
              <section className="space-y-3">
                <h3 className="flex items-center gap-2 text-sm font-orbitron uppercase tracking-[0.3em] text-aqua">
                  <span aria-hidden>❓</span>
                  Follow-up Questions
                </h3>
                <ul className="space-y-2 text-sm text-steel/90">
                  {result.follow_up_questions.map((item, index) => (
                    <li key={index} className="rounded-lg border border-teal/40 bg-charcoal/70 px-4 py-2">
                      {item}
                    </li>
                  ))}
                </ul>
              </section>
            )}
          </div>
        ) : (
          <div className="mt-12 flex flex-1 flex-col items-center justify-center gap-4 text-center text-sm text-steel/70">
            <span className="text-4xl" role="img" aria-hidden>
              ✨
            </span>
            <p>Deploy a refinement to view operational output. Configure your API key if you have not already.</p>
          </div>
        )}
      </aside>
    </div>
  );
}
