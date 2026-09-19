import { useEffect, useState } from "react";

const STEPS = ["Reading the image", "Extracting text", "Identifying the object", "Explaining in plain language"];

export function AnalyzingOverlay() {
  const [step, setStep] = useState(0);
  useEffect(() => {
    const t = setInterval(() => setStep((s) => Math.min(s + 1, STEPS.length - 1)), 1400);
    return () => clearInterval(t);
  }, []);

  return (
    <div className="rounded-2xl border border-border bg-background/60 p-5" aria-live="polite">
      <div className="flex items-center gap-3">
        <span className="relative grid size-10 place-items-center">
          <span className="absolute inset-0 rounded-full border-2 border-primary/20" />
          <span className="absolute inset-0 animate-spin rounded-full border-2 border-transparent border-t-primary" />
          <span className="size-2 rounded-full bg-primary animate-blink" />
        </span>
        <div>
          <p className="font-display font-semibold">Analyzing…</p>
          <p className="text-sm text-muted-foreground">{STEPS[step]}</p>
        </div>
      </div>
      <ol className="mt-4 space-y-1.5">
        {STEPS.map((s, i) => (
          <li key={s} className={`flex items-center gap-2 font-mono text-[11px] uppercase tracking-[0.15em] ${i <= step ? "text-foreground" : "text-muted-foreground/60"}`}>
            <span className={`size-1.5 rounded-full ${i < step ? "bg-focus" : i === step ? "bg-primary animate-blink" : "bg-border"}`} />
            {s}
          </li>
        ))}
      </ol>
    </div>
  );
}
