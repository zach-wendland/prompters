import type { Metadata } from "next";
import "./globals.css";
import { ReactNode } from "react";
import { Providers } from "@/components/providers";

export const metadata: Metadata = {
  title: "🛡️ Prompter",
  description: "Modular AI operator console for prompt engineering",
};

export default function RootLayout({ children }: { children: ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-gradient-to-b from-charcoal to-gunmetal">
        <div className="relative flex min-h-screen flex-col">
          <header className="border-b border-teal/30 bg-gunmetal/70 backdrop-blur">
            <div className="mx-auto flex w-full max-w-6xl items-center justify-between px-6 py-4">
              <div>
                <p className="text-sm uppercase tracking-widest text-teal">Operator Console</p>
                <h1 className="text-3xl font-orbitron font-semibold text-steel drop-shadow">🛡️ Prompter</h1>
              </div>
              <div className="text-right text-sm text-steel/80">
                <p>Blacksite Access Granted</p>
                <p className="font-orbitron text-lg text-aqua">Status: Operational</p>
              </div>
            </div>
          </header>
          <Providers>
            <main className="mx-auto w-full max-w-6xl flex-1 px-6 py-10">{children}</main>
          </Providers>
          <footer className="border-t border-teal/30 bg-gunmetal/70 py-4 text-center text-xs text-steel/60">
            Prompter Ops Center • Tactical systems calibrated for precision prompt engineering
          </footer>
        </div>
      </body>
    </html>
  );
}
