import { ModuleCard } from "@/components/module-card";
import { ApiKeyPanel } from "@/components/api-key-panel";

const modules = [
  {
    title: "Prompt Refiner",
    description: "Transform raw operator intents into high-clarity prompts optimised for model execution.",
    href: "/prompt-refiner",
    icon: "🧠",
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
        <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
          {modules.map((module) => (
            <ModuleCard key={module.href} {...module} />
          ))}
        </div>
        <ApiKeyPanel />
      </div>
    </div>
  );
}
