import type { AnalysisResponse } from "@/lib/analysis-types";
import { PrivacyBanner } from "./PrivacyBanner";

function CardLabel({ index, label, tone = "primary" }: { index: string; label: string; tone?: "primary" | "focus" }) {
  return (
    <div className="flex items-center justify-between">
      <span className="caption-mono">{label}</span>
      <span
        className={`grid size-9 place-items-center rounded-xl font-display font-bold ${
          tone === "focus" ? "bg-focus-soft text-focus" : "bg-background text-primary"
        }`}
      >
        {index}
      </span>
    </div>
  );
}

export function ResultCards({ response, scanId }: { response: AnalysisResponse; scanId: string }) {
  const r = response.result;
  const seconds = (response.durationMs / 1000).toFixed(1);

  return (
    <div>
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow">Results · 02</p>
          <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight text-balance">
            What the lens found
          </h2>
        </div>
        <div className="text-right font-mono text-xs text-muted-foreground">
          <p>
            Scan #{scanId} · {seconds}s
          </p>
          <p className="mt-1">
            <span
              className={`inline-flex items-center gap-1.5 rounded-full px-2 py-0.5 ${
                response.source === "ai" ? "bg-focus-soft text-focus" : "bg-warn-soft text-warn"
              }`}
            >
              <span className="size-1.5 rounded-full bg-current" />
              {response.source === "ai" ? "Live AI analysis" : "Sample analysis (demo)"}
            </span>
          </p>
        </div>
      </div>

      {response.note && (
        <p className="mt-6 rounded-2xl border border-border bg-card px-4 py-3 text-sm text-muted-foreground">{response.note}</p>
      )}

      <div className="mt-6">
        <PrivacyBanner detected={r.sensitiveDataDetected} note={r.sensitiveDataDetected ? r.sensitiveDataNote : undefined} />
      </div>

      <div className="mt-6 grid gap-5 sm:grid-cols-2">
        <article className="lens-card animate-fade-up [animation-delay:50ms]">
          <CardLabel index="01" label="(a) Identification" />
          <h3 className="mt-4 font-display text-2xl font-bold tracking-tight">{r.objectName}</h3>
          <p className="mt-1 text-xs font-medium uppercase tracking-wider text-primary">{r.category}</p>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">{r.summary}</p>
          <div className="mt-4">
            <div className="flex items-center justify-between font-mono text-[11px] text-muted-foreground">
              <span>Confidence</span>
              <span>{r.confidence}%</span>
            </div>
            <div className="mt-1.5 h-1.5 overflow-hidden rounded-full bg-background">
              <div className="h-full rounded-full bg-primary transition-[width] duration-700" style={{ width: `${r.confidence}%` }} />
            </div>
          </div>
        </article>

        <article className="lens-card animate-fade-up [animation-delay:120ms]">
          <CardLabel index="02" label="(b) Extracted text" />
          <div className="mt-4 max-h-64 overflow-auto rounded-2xl border border-border bg-background p-4 font-mono text-xs leading-relaxed">
            {r.extractedText.length ? (
              r.extractedText.map((line, i) => (
                <p key={i} className={line.includes("•") ? "text-muted-foreground" : ""}>
                  {line}
                </p>
              ))
            ) : (
              <p className="text-muted-foreground">No readable text found on this object.</p>
            )}
          </div>
        </article>

        <article className="lens-card animate-fade-up [animation-delay:190ms]">
          <CardLabel index="03" label="(c) What it means" />
          <ul className="mt-4 space-y-3 text-sm">
            {r.meanings.map((m, i) => (
              <li key={i} className="flex gap-3">
                <span className="mt-1.5 size-1.5 shrink-0 rounded-full bg-primary" />
                <span className="text-pretty">
                  <span className="font-semibold">{m.label}</span> — {m.explanation}
                </span>
              </li>
            ))}
          </ul>
        </article>

        <article className="lens-card animate-fade-up [animation-delay:260ms]">
          <CardLabel index="04" label="(d) How it's used" />
          <p className="mt-4 text-sm text-pretty leading-relaxed">{r.usage}</p>
        </article>

        <article className="lens-card animate-fade-up sm:col-span-2 [animation-delay:330ms]">
          <CardLabel index="05" label="(e) Instructions & warnings" tone="focus" />
          <div className="mt-4 grid gap-3 sm:grid-cols-2">
            <ul className="space-y-3">
              {r.instructions.map((t, i) => (
                <li key={i} className="rounded-2xl border border-border bg-background p-4 text-sm text-pretty">
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-widest text-focus">Do</span>
                  {t}
                </li>
              ))}
            </ul>
            <ul className="space-y-3">
              {r.warnings.map((t, i) => (
                <li key={i} className="rounded-2xl border border-warn/25 bg-warn-soft p-4 text-sm text-warn text-pretty">
                  <span className="mr-2 font-mono text-[10px] uppercase tracking-widest">Warning</span>
                  {t}
                </li>
              ))}
            </ul>
          </div>
        </article>
      </div>
    </div>
  );
}
