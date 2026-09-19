import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import { formatDistanceToNow } from "date-fns";

import type { ScanRecord } from "@/lib/analysis-types";
import { clearHistory, deleteScan, loadHistory } from "@/lib/history";

const TITLE = "Scan History — Everyday Lens";
const DESCRIPTION = "Revisit the everyday objects you have scanned with Everyday Lens. History is stored privately on your device.";

export const Route = createFileRoute("/history")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HistoryPage,
});

function HistoryPage() {
  const [items, setItems] = useState<ScanRecord[] | null>(null);

  useEffect(() => {
    setItems(loadHistory());
  }, []);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Archive · 03</p>
          <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
            Previous scans
          </h1>
          <p className="mt-3 max-w-[50ch] text-muted-foreground text-pretty">
            Saved on this device only. Sensitive numbers are masked before anything is stored.
          </p>
        </div>
        {items && items.length > 0 && (
          <button
            type="button"
            onClick={() => {
              clearHistory();
              setItems([]);
            }}
            className="rounded-full border border-border bg-card px-4 py-2 text-sm font-medium text-muted-foreground hover:text-foreground"
          >
            Clear history
          </button>
        )}
      </div>

      {items === null ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      ) : items.length === 0 ? (
        <div className="mt-10 rounded-[24px] border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-xl font-semibold">Nothing scanned yet</p>
          <p className="mt-2 text-sm text-muted-foreground">Your first analysis will appear here.</p>
          <Link
            to="/"
            className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Scan an object
          </Link>
        </div>
      ) : (
        <ul className="mt-10 grid gap-5 sm:grid-cols-2 lg:grid-cols-3">
          {items.map((item, i) => (
            <li key={item.id} className="lens-card flex flex-col p-0 overflow-hidden animate-fade-up" style={{ animationDelay: `${i * 60}ms` }}>
              <Link to="/results/$id" params={{ id: item.id }} className="block">
                <div className="relative aspect-[4/3] overflow-hidden bg-foreground">
                  <img src={item.thumbnail} alt={item.response.result.objectName} className="h-full w-full object-cover" />
                  <span className="absolute left-3 top-3 h-5 w-5 rounded-tl-md border-l-2 border-t-2 border-primary/80" />
                  <span className="absolute bottom-3 right-3 h-5 w-5 rounded-br-md border-b-2 border-r-2 border-primary/80" />
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between caption-mono">
                    <span>#{item.id}</span>
                    <span className={item.response.source === "ai" ? "text-focus" : "text-warn"}>
                      {item.response.source === "ai" ? "AI" : "Sample"}
                    </span>
                  </div>
                  <h2 className="mt-3 font-display text-xl font-bold tracking-tight">{item.response.result.objectName}</h2>
                  <p className="mt-1 line-clamp-2 text-sm text-muted-foreground">{item.response.result.summary}</p>
                  <p className="mt-3 font-mono text-[11px] text-muted-foreground">
                    {formatDistanceToNow(new Date(item.createdAt), { addSuffix: true })}
                  </p>
                </div>
              </Link>
              <div className="mt-auto flex items-center justify-between border-t border-border px-5 py-3">
                <Link to="/results/$id" params={{ id: item.id }} className="text-sm font-medium text-primary">
                  View results →
                </Link>
                <button
                  type="button"
                  onClick={() => setItems(deleteScan(item.id))}
                  className="text-xs text-muted-foreground hover:text-destructive"
                >
                  Delete
                </button>
              </div>
            </li>
          ))}
        </ul>
      )}
    </div>
  );
}
