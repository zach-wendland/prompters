"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
} from "react";

const STORAGE_KEY = "prompter.openai_api_key";

export interface ApiKeyContextValue {
  apiKey: string;
  setApiKey: (value: string) => void;
  clearApiKey: () => void;
}

const ApiKeyContext = createContext<ApiKeyContextValue | undefined>(undefined);

export function ApiKeyProvider({ children }: { children: React.ReactNode }) {
  const [apiKey, setApiKeyState] = useState<string>("");

  useEffect(() => {
    if (typeof window === "undefined") return;
    const stored = window.localStorage.getItem(STORAGE_KEY);
    if (stored) {
      setApiKeyState(stored);
    }
  }, []);

  const setApiKey = useCallback((value: string) => {
    setApiKeyState(value);
    if (typeof window !== "undefined") {
      window.localStorage.setItem(STORAGE_KEY, value);
    }
  }, []);

  const clearApiKey = useCallback(() => {
    setApiKeyState("");
    if (typeof window !== "undefined") {
      window.localStorage.removeItem(STORAGE_KEY);
    }
  }, []);

  const value = useMemo(
    () => ({
      apiKey,
      setApiKey,
      clearApiKey,
    }),
    [apiKey, setApiKey, clearApiKey]
  );

  return <ApiKeyContext.Provider value={value}>{children}</ApiKeyContext.Provider>;
}

export function useApiKey() {
  const context = useContext(ApiKeyContext);
  if (!context) {
    throw new Error("useApiKey must be used within an ApiKeyProvider");
  }
  return context;
}
