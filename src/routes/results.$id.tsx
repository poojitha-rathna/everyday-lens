import { Link, createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";

import { ResultCards } from "@/components/ResultCards";
import type { ScanRecord } from "@/lib/analysis-types";
import { getScan } from "@/lib/history";

export const Route = createFileRoute("/results/$id")({
  head: ({ params }) => ({
    meta: [
      { title: `Scan #${params.id} — Everyday Lens` },
      { name: "description", content: "Detailed explanation of a scanned everyday object from Everyday Lens." },
      { property: "og:title", content: `Scan #${params.id} — Everyday Lens` },
      { property: "og:description", content: "Detailed explanation of a scanned everyday object from Everyday Lens." },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: ResultsPage,
});

function ResultsPage() {
  const { id } = Route.useParams();
  const [record, setRecord] = useState<ScanRecord | null | undefined>(undefined);

  useEffect(() => {
    setRecord(getScan(id) ?? null);
  }, [id]);

  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16">
      <Link to="/history" className="font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground hover:text-foreground">
        ← Back to history
      </Link>

      {record === undefined ? (
        <p className="mt-10 font-mono text-xs uppercase tracking-[0.2em] text-muted-foreground">Loading…</p>
      ) : record === null ? (
        <div className="mt-10 rounded-[24px] border border-dashed border-border bg-card p-10 text-center">
          <p className="font-display text-xl font-semibold">Scan not found</p>
          <p className="mt-2 text-sm text-muted-foreground">This scan may have been deleted or saved on another device.</p>
          <Link to="/" className="mt-6 inline-flex rounded-full bg-primary px-5 py-2.5 font-display font-semibold text-primary-foreground">
            Scan a new object
          </Link>
        </div>
      ) : (
        <div className="mt-8 grid gap-8 lg:grid-cols-12">
          <div className="lg:col-span-4">
            <div className="relative aspect-[4/3] overflow-hidden rounded-[24px] bg-foreground p-3">
              <img src={record.thumbnail} alt={record.response.result.objectName} className="h-full w-full rounded-[14px] object-cover" />
              <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary/70" />
              <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary/70" />
              <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary/70" />
              <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary/70" />
            </div>
            <p className="mt-3 font-mono text-[11px] uppercase tracking-[0.18em] text-muted-foreground">
              {new Date(record.createdAt).toLocaleString()} · {record.fileName}
            </p>
          </div>
          <div className="lg:col-span-8">
            <ResultCards response={record.response} scanId={record.id} />
          </div>
        </div>
      )}
    </div>
  );
}
