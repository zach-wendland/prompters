import { RepositoryModulePanel, type RepositoryDefinition } from "@/components/repository-module-panel";
import { ApiKeyPanel } from "@/components/api-key-panel";

const repositories: RepositoryDefinition[] = [
  {
    id: "prompter-monorepo",
    name: "Prompter Monorepo",
    description:
      "Primary operations console bundling tactical prompt workflows, compliance tooling, and data transformation utilities.",
    status: "All subsystems nominal. Core modules ready for deployment.",
    modules: [
      {
        title: "Prompt Refiner",
        description: "Transform raw operator intents into high-clarity prompts optimised for model execution.",
        href: "/prompt-refiner",
        icon: "🧠",
      },
      {
        title: "DMCA & LinkGuard Console",
        description: "Orchestrate takedowns and affiliate link defense with evidence bundles and compliance guardrails.",
        href: "/dmca-linkguard",
        icon: "🛡️",
      },
      {
        title: "Bane's Internet Gauntlet",
        description: "Pilot Bane through a neon datastream, dodging viral shards while securing routers for bandwidth supremacy.",
        href: "/bane-internet-gauntlet",
        icon: "🕶️",
      },
      {
        title: "SQL Syntax Converter",
        description: "Transform SQL statements between dialects with dialect-specific notes and verification guidance.",
        href: "/sql-converter",
        icon: "🧮",
      },
    ],
  },
  {
    id: "link-ops",
    name: "LinkGuard Ops",
    description:
      "Focused toolkit for the LinkGuard enforcement crew to triage infringements and manage takedown evidence pipelines.",
    status: "DMCA workflows hot-loaded. Prompt engineering utilities on standby.",
    modules: [
      {
        title: "DMCA & LinkGuard Console",
        description: "Coordinate takedown actions, capture evidence bundles, and monitor affiliate link remediation.",
        href: "/dmca-linkguard",
        icon: "🛡️",
      },
      {
        title: "Prompt Refiner",
        description: "Draft high-impact notification copy and escalation prompts tailored to infringement severity.",
        href: "/prompt-refiner",
        icon: "🧠",
      },
    ],
  },
  {
    id: "data-forge",
    name: "Data Forge Sandbox",
    description:
      "Experimental environment for data operations squads to validate SQL rewrites and stress-test analytics prompts.",
    status: "Dialect conversion engine online. Awaiting new analytics playbooks.",
    modules: [
      {
        title: "SQL Syntax Converter",
        description: "Transform SQL statements between dialects with dialect-specific notes and verification guidance.",
        href: "/sql-converter",
        icon: "🧮",
      },
    ],
  },
  {
    id: "future-theater",
    name: "Future Theater",
    description:
      "Staging ground for upcoming modules. Wire up new frontlines here before promoting them to the main console.",
    status: "Awaiting first deployment. Provision new modules to populate this surface.",
    modules: [],
  },
];

export default function HomePage() {
  return (
    <div className="space-y-10">
      <section className="rounded-2xl border border-teal/30 bg-gunmetal/60 p-8 shadow-neon">
        <div className="flex flex-col gap-4 md:flex-row md:items-center md:justify-between">
          <div>
            <p className="text-sm uppercase tracking-[0.35em] text-teal">Mission Control</p>
            <h2 className="mt-2 text-3xl font-orbitron text-steel">Select your tactical module</h2>
            <p className="mt-3 max-w-2xl text-sm text-steel/80">
              Welcome, operator. This console provides access to modular AI workflows designed for rapid prompt iteration.
            </p>
          </div>
          <div className="flex items-center gap-3 rounded-xl border border-teal/30 bg-charcoal/60 px-4 py-3 text-sm text-steel/70">
            <span className="text-xl" role="img" aria-hidden>
              ✨
            </span>
            <span>Systems nominal. Ready for deployment.</span>
          </div>
        </div>
      </section>

      <div className="grid grid-cols-1 gap-6 lg:grid-cols-[2fr_1fr]">
        <RepositoryModulePanel repositories={repositories} />
        <ApiKeyPanel />
      </div>
    </div>
  );
}
