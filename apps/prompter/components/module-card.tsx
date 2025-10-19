"use client";

import Link from "next/link";
import { motion } from "framer-motion";
import { ReactNode } from "react";

export interface ModuleCardProps {
  title: string;
  description: string;
  href: string;
  icon: ReactNode;
  action?: string;
}

export function ModuleCard({ title, description, href, icon, action = "Deploy" }: ModuleCardProps) {
  return (
    <motion.article
      initial={{ opacity: 0, y: 12 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.4 }}
      className="group relative overflow-hidden rounded-2xl border border-teal/30 bg-gunmetal/60 p-6 shadow-neon"
    >
      <div className="absolute inset-0 bg-gradient-to-br from-teal/10 via-transparent to-teal/0 opacity-0 transition-opacity duration-300 group-hover:opacity-100" />
      <div className="relative z-10 flex items-start justify-between gap-6">
        <div className="flex flex-col gap-4">
          <div className="flex items-center gap-3 text-aqua">
            <span className="text-3xl" aria-hidden>
              {icon}
            </span>
            <h2 className="text-2xl font-orbitron font-semibold text-steel drop-shadow">{title}</h2>
          </div>
          <p className="max-w-md text-sm text-steel/90">{description}</p>
        </div>
        <span className="text-2xl text-teal opacity-80 transition group-hover:translate-x-1">→</span>
      </div>
      <div className="relative z-10 mt-6 flex items-center gap-4 text-xs uppercase tracking-[0.25em] text-steel/70">
        <span>Module Ready</span>
        <span className="h-px flex-1 bg-teal/40" />
        <span>AI Ops</span>
      </div>
      <div className="relative z-10 mt-6">
        <Link
          href={href}
          className="inline-flex items-center gap-2 rounded-full bg-teal/90 px-4 py-2 font-orbitron text-sm text-charcoal shadow-neon transition hover:bg-teal"
        >
          {action}
          <span aria-hidden>→</span>
        </Link>
      </div>
    </motion.article>
  );
}
