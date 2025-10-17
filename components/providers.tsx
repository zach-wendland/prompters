"use client";

import { ApiKeyProvider } from "./api-key-context";

export function Providers({ children }: { children: React.ReactNode }) {
  return <ApiKeyProvider>{children}</ApiKeyProvider>;
}
