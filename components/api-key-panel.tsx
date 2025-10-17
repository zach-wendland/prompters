"use client";

import { useEffect, useState } from "react";
import { useApiKey } from "./api-key-context";
import clsx from "clsx";

export function ApiKeyPanel() {
  const { apiKey, setApiKey, clearApiKey } = useApiKey();
  const [visible, setVisible] = useState(false);
  const [value, setValue] = useState(apiKey);

  useEffect(() => {
    setValue(apiKey);
  }, [apiKey]);

  const isConfigured = apiKey.trim().length > 0;

  return (
    <section className="rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon">
      <header className="flex items-center justify-between">
        <div className="flex items-center gap-3 text-aqua">
          <span aria-hidden className="text-2xl">
            🛡️
          </span>
          <h2 className="text-xl font-orbitron font-semibold text-steel">API Access</h2>
        </div>
        <span className={clsx("rounded-full px-3 py-1 text-xs font-semibold", isConfigured ? "bg-teal/20 text-teal" : "bg-steel/20 text-steel/60") }>
          {isConfigured ? "Configured" : "Required"}
        </span>
      </header>
      <p className="mt-4 text-sm text-steel/80">
        Securely store your OpenAI API key locally. The key never leaves your browser.
      </p>
      <div className="mt-6 space-y-3">
        <label className="flex items-center gap-2 text-xs uppercase tracking-[0.4em] text-steel/60">
          <span aria-hidden className="text-lg text-teal">🔑</span>
          Access Token
        </label>
        <div className="flex items-center gap-3">
          <input
            value={value}
            onChange={(event) => setValue(event.target.value)}
            onBlur={() => setValue((prev) => prev.trim())}
            placeholder="sk-..."
            className="flex-1 rounded-lg border border-teal/40 bg-charcoal/80 px-3 py-2 font-share text-sm text-steel shadow-inner focus:border-teal focus:outline-none"
            autoComplete="off"
            type={visible ? "text" : "password"}
          />
          <button
            type="button"
            className="rounded-lg border border-teal/40 bg-teal/10 p-2 text-teal transition hover:bg-teal/20"
            onClick={() => setVisible((prev) => !prev)}
            aria-label={visible ? "Hide key" : "Show key"}
          >
            <span className="text-lg" aria-hidden>
              {visible ? "🙈" : "👁️"}
            </span>
          </button>
        </div>
        <div className="flex gap-3 pt-2">
          <button
            type="button"
            className="inline-flex items-center gap-2 rounded-full bg-teal px-4 py-2 font-orbitron text-xs uppercase tracking-[0.3em] text-charcoal shadow-neon transition hover:bg-aqua"
            onClick={() => setApiKey(value.trim())}
          >
            Save
          </button>
          <button
            type="button"
            className="rounded-full border border-teal/40 px-4 py-2 font-orbitron text-xs uppercase tracking-[0.3em] text-steel/80 transition hover:border-teal/70 hover:text-steel"
            onClick={() => {
              clearApiKey();
              setValue("");
            }}
          >
            Clear
          </button>
        </div>
      </div>
    </section>
  );
}
