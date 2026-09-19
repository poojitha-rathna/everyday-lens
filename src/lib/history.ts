import type { ScanRecord } from "./analysis-types";

const KEY = "everyday-lens-history-v1";
const MAX = 24;

function safeParse(raw: string | null): ScanRecord[] {
  if (!raw) return [];
  try {
    const parsed = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as ScanRecord[]) : [];
  } catch {
    return [];
  }
}

export function loadHistory(): ScanRecord[] {
  if (typeof window === "undefined") return [];
  return safeParse(window.localStorage.getItem(KEY));
}

export function saveScan(record: ScanRecord): void {
  if (typeof window === "undefined") return;
  const next = [record, ...loadHistory().filter((r) => r.id !== record.id)].slice(0, MAX);
  try {
    window.localStorage.setItem(KEY, JSON.stringify(next));
  } catch {
    // Storage full: drop oldest entries and retry once.
    window.localStorage.setItem(KEY, JSON.stringify(next.slice(0, 8)));
  }
}

export function getScan(id: string): ScanRecord | undefined {
  return loadHistory().find((r) => r.id === id);
}

export function deleteScan(id: string): ScanRecord[] {
  const next = loadHistory().filter((r) => r.id !== id);
  window.localStorage.setItem(KEY, JSON.stringify(next));
  return next;
}

export function clearHistory(): void {
  window.localStorage.removeItem(KEY);
}

export function newScanId(): string {
  const n = Math.floor(Math.random() * 9000 + 1000);
  return `A-${n}-${Date.now().toString(36).slice(-4).toUpperCase()}`;
}
