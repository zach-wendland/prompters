"use client";

import { useMemo, useState } from "react";
import { ModuleCard, type ModuleCardProps } from "@/components/module-card";

export interface RepositoryDefinition {
  id: string;
  name: string;
  description: string;
  status: string;
  modules: ModuleCardProps[];
}

interface RepositoryModulePanelProps {
  repositories: RepositoryDefinition[];
}

export function RepositoryModulePanel({ repositories }: RepositoryModulePanelProps) {
  const [activeRepositoryId, setActiveRepositoryId] = useState(repositories[0]?.id ?? "");

  const activeRepository = useMemo(
    () => repositories.find((repository) => repository.id === activeRepositoryId) ?? repositories[0],
    [activeRepositoryId, repositories],
  );

  if (!activeRepository) {
    return null;
  }

  return (
    <div className="flex flex-col gap-6">
      <div className="flex flex-col gap-4 rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon">
        <div className="flex flex-col gap-4 md:flex-row md:items-start md:justify-between">
          <div>
            <p className="text-xs uppercase tracking-[0.35em] text-teal">Repository</p>
            <h3 className="mt-2 text-2xl font-orbitron text-steel">{activeRepository.name}</h3>
            <p className="mt-3 max-w-2xl text-sm text-steel/80">{activeRepository.description}</p>
          </div>
          <div className="flex flex-wrap gap-2">
            {repositories.map((repository) => (
              <button
                key={repository.id}
                type="button"
                onClick={() => setActiveRepositoryId(repository.id)}
                className={`rounded-full border px-4 py-2 text-xs font-semibold uppercase tracking-[0.2em] transition ${
                  repository.id === activeRepository.id
                    ? "border-teal/70 bg-teal/90 text-charcoal shadow-neon"
                    : "border-teal/30 bg-charcoal/50 text-steel/80 hover:border-teal/60 hover:bg-charcoal/80"
                }`}
                aria-pressed={repository.id === activeRepository.id}
              >
                {repository.name}
              </button>
            ))}
          </div>
        </div>
        <div className="rounded-xl border border-teal/30 bg-charcoal/50 px-4 py-3 text-sm text-steel/80">
          <span className="font-semibold text-teal">Status: </span>
          {activeRepository.status}
        </div>
      </div>

      <div className="grid grid-cols-1 gap-6 md:grid-cols-2">
        {activeRepository.modules.length > 0 ? (
          activeRepository.modules.map((module) => <ModuleCard key={module.href} {...module} />)
        ) : (
          <div className="col-span-full flex flex-col items-center justify-center gap-2 rounded-2xl border border-teal/30 bg-charcoal/50 p-10 text-center text-sm text-steel/80">
            <span className="text-3xl" role="img" aria-hidden>
              🗃️
            </span>
            <p className="font-semibold text-steel">No modules available for this repository.</p>
            <p className="max-w-md text-steel/70">
              Switch repositories or add new workflows to this codebase to see them appear here.
            </p>
          </div>
        )}
      </div>
    </div>
  );
}
