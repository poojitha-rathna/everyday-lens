import { createFileRoute } from "@tanstack/react-router";
import { useServerFn } from "@tanstack/react-start";
import { useCallback, useEffect, useRef, useState, type DragEvent } from "react";
import { toast } from "sonner";

import { AnalyzingOverlay } from "@/components/AnalyzingOverlay";
import { CameraCapture } from "@/components/CameraCapture";
import { PrivacyBanner } from "@/components/PrivacyBanner";
import { ResultCards } from "@/components/ResultCards";
import { Viewfinder } from "@/components/Viewfinder";
import type { AnalysisResponse } from "@/lib/analysis-types";
import { analyzeImage } from "@/lib/analyze.functions";
import { newScanId, saveScan } from "@/lib/history";
import { fileToDataUrl } from "@/lib/image-utils";

const TITLE = "Everyday Lens — Understand What You See";
const DESCRIPTION =
  "Upload a photo of any everyday object — a card, medicine box, ticket, bill or label — and Everyday Lens identifies it, reads the text and explains it in plain language.";

export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
    ],
  }),
  component: HomePage,
});

const MAX_BYTES = 10 * 1024 * 1024;

function HomePage() {
  const analyze = useServerFn(analyzeImage);
  const fileInputRef = useRef<HTMLInputElement>(null);
  const resultsRef = useRef<HTMLDivElement>(null);

  const [preview, setPreview] = useState<string | null>(null);
  const [fileName, setFileName] = useState("upload");
  const [dragging, setDragging] = useState(false);
  const [cameraOpen, setCameraOpen] = useState(false);
  const [analyzing, setAnalyzing] = useState(false);
  const [response, setResponse] = useState<AnalysisResponse | null>(null);
  const [scanId, setScanId] = useState<string>("");

  const acceptFile = useCallback(async (file: File | Blob, name: string) => {
    if (!file.type.startsWith("image/")) {
      toast.error("Please choose an image file (JPG, PNG, WEBP).");
      return;
    }
    if (file.size > MAX_BYTES) {
      toast.error("That image is larger than 10MB. Try a smaller one.");
      return;
    }
    try {
      const dataUrl = await fileToDataUrl(file, 1280);
      setPreview(dataUrl);
      setFileName(name);
      setResponse(null);
    } catch (e) {
      toast.error(e instanceof Error ? e.message : "Could not read this image.");
    }
  }, []);

  const onDrop = (e: DragEvent) => {
    e.preventDefault();
    setDragging(false);
    const file = e.dataTransfer.files?.[0];
    if (file) void acceptFile(file, file.name);
  };

  const runAnalysis = async () => {
    if (!preview || analyzing) return;
    setAnalyzing(true);
    setResponse(null);
    try {
      const res = await analyze({ data: { image: preview, fileName } });
      const id = newScanId();
      setScanId(id);
      setResponse(res);
      const thumbnail = await fileToDataUrl(await (await fetch(preview)).blob(), 320, 0.7);
      saveScan({ id, createdAt: new Date().toISOString(), fileName, thumbnail, response: res });
      if (res.source === "mock" && res.note) toast.message(res.note);
    } catch (e) {
      console.error(e);
      toast.error("Analysis failed. Please try again.");
    } finally {
      setAnalyzing(false);
    }
  };

  useEffect(() => {
    if (response && resultsRef.current) {
      resultsRef.current.scrollIntoView({ behavior: "smooth", block: "start" });
    }
  }, [response]);

  const reset = () => {
    setPreview(null);
    setResponse(null);
    setFileName("upload");
    if (fileInputRef.current) fileInputRef.current.value = "";
  };

  const status = analyzing ? "Scanning" : preview ? "Ready to analyze" : "Waiting for a photo";

  return (
    <div className="mx-auto max-w-6xl px-5">
      <section className="pb-10 pt-12 sm:pt-16">
        <div className="max-w-2xl">
          <p className="eyebrow animate-fade-up">Viewfinder · 01</p>
          <h1 className="mt-4 font-display text-[clamp(2.6rem,7vw,5.2rem)] font-bold leading-[0.95] tracking-tighter text-balance animate-fade-up [animation-delay:50ms]">
            Understand
            <br />
            what you <span className="text-primary">see</span>.
          </h1>
          <p className="mt-5 max-w-[46ch] text-lg text-muted-foreground text-pretty animate-fade-up [animation-delay:100ms]">
            Snap or drop a photo of any everyday object. Everyday Lens reads the label, explains the text in plain
            language, and tells you how it's normally used.
          </p>
        </div>

        <div className="mt-10 grid items-start gap-6 lg:grid-cols-12">
          <div className="lg:col-span-7">
            <Viewfinder src={preview} scanning={analyzing} status={status} />
          </div>

          <div className="rounded-[24px] border border-border bg-card p-5 animate-fade-up sm:p-6 lg:col-span-5 [animation-delay:200ms]">
            {analyzing ? (
              <AnalyzingOverlay />
            ) : (
              <div
                onDragOver={(e) => {
                  e.preventDefault();
                  setDragging(true);
                }}
                onDragLeave={() => setDragging(false)}
                onDrop={onDrop}
                onClick={() => fileInputRef.current?.click()}
                role="button"
                tabIndex={0}
                onKeyDown={(e) => e.key === "Enter" && fileInputRef.current?.click()}
                className={`cursor-pointer rounded-2xl border-2 border-dashed px-5 py-8 text-center transition-colors ${
                  dragging ? "border-primary bg-primary/5" : "border-border bg-background/60 hover:border-primary/50"
                }`}
              >
                <p className="font-display text-lg font-semibold">{preview ? "Drop another photo" : "Drop a photo here"}</p>
                <p className="mt-1 text-sm text-muted-foreground">
                  {preview ? fileName : "JPG, PNG or WEBP · up to 10MB"}
                </p>
              </div>
            )}

            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="sr-only"
              onChange={(e) => {
                const f = e.target.files?.[0];
                if (f) void acceptFile(f, f.name);
              }}
            />

            <div className="mt-4 grid grid-cols-2 gap-3">
              <button
                type="button"
                disabled={analyzing}
                onClick={() => fileInputRef.current?.click()}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Upload file
              </button>
              <button
                type="button"
                disabled={analyzing}
                onClick={() => setCameraOpen(true)}
                className="rounded-2xl border border-border bg-background px-4 py-3 text-sm font-medium transition-colors hover:bg-secondary disabled:opacity-50"
              >
                Use camera
              </button>
            </div>

            <button
              type="button"
              onClick={runAnalysis}
              disabled={!preview || analyzing}
              className="mt-4 w-full rounded-2xl bg-primary px-5 py-4 font-display text-lg font-semibold tracking-tight text-primary-foreground transition-transform hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-40 disabled:hover:translate-y-0"
            >
              {analyzing ? "Analyzing…" : "Analyze object"}
            </button>

            {preview && !analyzing && (
              <button type="button" onClick={reset} className="mt-3 w-full text-center text-xs text-muted-foreground underline-offset-4 hover:underline">
                Clear photo
              </button>
            )}

            <p className="mt-3 text-xs text-muted-foreground text-pretty">
              General object understanding only — nothing is sent to any bank or payment service.
            </p>
          </div>
        </div>

        {!response && (
          <div className="mt-8">
            <PrivacyBanner />
          </div>
        )}
      </section>

      {response && (
        <section ref={resultsRef} className="scroll-mt-20 border-t border-border py-14 sm:py-20">
          <ResultCards response={response} scanId={scanId} />
          <div className="mt-10 flex flex-wrap gap-3">
            <button
              type="button"
              onClick={() => {
                reset();
                window.scrollTo({ top: 0, behavior: "smooth" });
              }}
              className="rounded-full bg-foreground px-5 py-2.5 text-sm font-medium text-background transition-transform hover:-translate-y-0.5"
            >
              Scan another object
            </button>
          </div>
        </section>
      )}

      {!response && <ExamplesStrip />}

      {cameraOpen && (
        <CameraCapture
          onClose={() => setCameraOpen(false)}
          onCapture={(blob) => {
            setCameraOpen(false);
            void acceptFile(blob, `camera-${Date.now()}.jpg`);
          }}
        />
      )}
    </div>
  );
}

const EXAMPLES = [
  ["Cards", "Debit, credit, ID and membership cards"],
  ["Medicine", "Boxes, strips and bottles with dosage labels"],
  ["Tickets", "Train, bus, flight and event tickets"],
  ["Bills", "Electricity, water, phone and shop receipts"],
  ["Labels", "Appliance ratings, food and product packaging"],
  ["Documents", "Forms, slips, letters and notices"],
] as const;

function ExamplesStrip() {
  return (
    <section className="border-t border-border py-14 sm:py-20">
      <p className="eyebrow">Works with · 02</p>
      <h2 className="mt-3 font-display text-[clamp(1.8rem,4vw,2.75rem)] font-bold tracking-tight text-balance">
        Any everyday object
      </h2>
      <ul className="mt-8 grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
        {EXAMPLES.map(([title, desc], i) => (
          <li key={title} className="rounded-2xl border border-border bg-card p-5">
            <span className="caption-mono">0{i + 1}</span>
            <p className="mt-2 font-display text-lg font-semibold">{title}</p>
            <p className="mt-1 text-sm text-muted-foreground">{desc}</p>
          </li>
        ))}
      </ul>
    </section>
  );
}
