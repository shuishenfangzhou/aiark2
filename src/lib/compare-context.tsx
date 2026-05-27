"use client";

import { createContext, useContext, useState, useEffect, useCallback, type ReactNode } from "react";

const STORAGE_KEY = "aiark:compare";
const MAX_COMPARE = 4;

interface CompareContextType {
  compareIds: string[];
  isCompared: (id: string) => boolean;
  toggleCompare: (id: string) => void;
  clearCompare: () => void;
  compareCount: number;
}

const CompareContext = createContext<CompareContextType | null>(null);

function readStored(): string[] {
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? JSON.parse(raw) : [];
  } catch {
    return [];
  }
}

function writeStored(ids: string[]) {
  try {
    localStorage.setItem(STORAGE_KEY, JSON.stringify(ids));
  } catch {
    // silent
  }
}

export function CompareProvider({ children }: { children: ReactNode }) {
  const [compareIds, setCompareIds] = useState<string[]>(() => readStored());

  useEffect(() => {
    const handler = (e: StorageEvent) => {
      if (e.key === STORAGE_KEY) setCompareIds(readStored());
    };
    window.addEventListener("storage", handler);
    return () => window.removeEventListener("storage", handler);
  }, []);

  const toggleCompare = useCallback((id: string) => {
    setCompareIds(prev => {
      let next: string[];
      if (prev.includes(id)) {
        next = prev.filter(x => x !== id);
      } else {
        if (prev.length >= MAX_COMPARE) {
          next = [...prev.slice(1), id];
        } else {
          next = [...prev, id];
        }
      }
      writeStored(next);
      return next;
    });
  }, []);

  const clearCompare = useCallback(() => {
    setCompareIds([]);
    writeStored([]);
  }, []);

  const isCompared = useCallback((id: string) => compareIds.includes(id), [compareIds]);

  return (
    <CompareContext.Provider value={{
      compareIds,
      isCompared,
      toggleCompare,
      clearCompare,
      compareCount: compareIds.length,
    }}>
      {children}
    </CompareContext.Provider>
  );
}

export function useCompare() {
  const ctx = useContext(CompareContext);
  if (!ctx) throw new Error("useCompare must be used within a CompareProvider");
  return ctx;
}
