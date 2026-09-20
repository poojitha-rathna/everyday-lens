import { Link, createFileRoute } from "@tanstack/react-router";
import {
  UploadCloud,
  ScanEye,
  MessageSquareText,
  HardDrive,
  ShieldAlert,
  Camera,
  Sparkles,
  AlertTriangle,
} from "lucide-react";

const TITLE = "About — Everyday Lens";
const DESCRIPTION =
  "Everyday Lens helps anyone understand the objects around them: photograph a card, medicine box, ticket or label and get a plain-language explanation.";

export const Route = createFileRoute("/about")({
  head: () => ({
    meta: [
      { title: TITLE },
      { name: "description", content: DESCRIPTION },
      { property: "og:title", content: TITLE },
      { property: "og:description", content: DESCRIPTION },
      { property: "og:type", content: "website" },
      { name: "twitter:card", content: "summary_large_image" },
    ],
  }),
  component: AboutPage,
});

const MISSION_POINTS = [
  {
    title: "Everyday objects, explained",
    body: "Bank cards, medicine boxes, tickets, bills, labels and documents are covered in small print and codes. We turn them into answers.",
    icon: Sparkles,
  },
  {
    title: "Made for everyone",
    body: "No technical background needed. Just point, shoot and read a clear, friendly breakdown of what matters in the photo.",
    icon: Camera,
  },
  {
    title: "Always ready to demo",
    body: "If the AI service is unavailable, the app falls back to a built-in sample analysis so the upload → results flow keeps working.",
    icon: AlertTriangle,
  },
] as const;

const HOW_IT_WORKS = [
  {
    title: "Upload",
    description:
      "Drop a photo, choose a file or open your camera. The image is resized on your device before anything is sent, keeping uploads fast and your data local until the last moment.",
    icon: UploadCloud,
  },
  {
    title: "Analyze",
    description:
      "A vision-language AI model looks at the photo, identifies the object and extracts readable text, numbers, dates, symbols and labels.",
    icon: ScanEye,
  },
  {
    title: "Explain",
    description:
      "Important details are translated into simple language: what each section means, how the object is normally used, and any warnings worth knowing.",
    icon: MessageSquareText,
  },
  {
    title: "Remember",
    description:
      "Each scan is saved to a private history stored only in your browser. You can revisit, compare or delete results any time.",
    icon: HardDrive,
  },
] as const;

const PRIVACY_POINTS = [
  "Card numbers, CVV, PINs, OTPs and passwords are masked in results and never stored.",
  "Scan history lives only in your browser. Clear it any time from the History page.",
  "Everyday Lens has no banking, payment or financial account features whatsoever.",
  "Avoid uploading images that reveal full card numbers, unredacted IDs or other highly sensitive details.",
  "Explanations are educational and may contain mistakes — always double-check against official instructions or a trusted source.",
] as const;

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16">
      {/* Mission */}
      <section className="max-w-2xl animate-fade-up">
        <p className="eyebrow">About · Everyday Lens</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
          A magnifying glass for the everyday.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground text-pretty">
          Bank cards, medicine boxes, tickets, bills, appliance labels — everyday objects are covered in small print,
          codes and symbols that are rarely explained. Everyday Lens turns a photo of any of them into a clear,
          friendly explanation of what you are looking at and how it is used.
        </p>
      </section>

      <div className="mt-10 grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {MISSION_POINTS.map(({ title, body, icon: Icon }, i) => (
          <div
            key={title}
            className="lens-card animate-fade-up"
            style={{ animationDelay: `${(i + 1) * 70}ms` }}
          >
            <div className="grid size-10 place-items-center rounded-2xl bg-secondary text-foreground">
              <Icon className="size-5" strokeWidth={2} />
            </div>
            <h3 className="mt-4 font-display text-lg font-bold">{title}</h3>
            <p className="mt-2 text-sm text-muted-foreground text-pretty">{body}</p>
          </div>
        ))}
      </div>

      {/* How AI analysis works */}
      <section className="mt-16">
        <h2 className="caption-mono">How the AI analysis works</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {HOW_IT_WORKS.map(({ title, description, icon: Icon }, i) => (
            <li
              key={title}
              className="lens-card animate-fade-up"
              style={{ animationDelay: `${i * 70}ms` }}
            >
              <span className="grid size-9 place-items-center rounded-xl bg-background font-display font-bold text-primary">
                <Icon className="size-[1.125rem]" strokeWidth={2.2} />
              </span>
              <div className="mt-4 flex items-baseline gap-2">
                <span className="font-mono text-xs text-muted-foreground">0{i + 1}</span>
                <h3 className="font-display text-xl font-bold">{title}</h3>
              </div>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{description}</p>
            </li>
          ))}
        </ol>

        <div className="mt-5 rounded-3xl border border-focus/25 bg-focus-soft p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "300ms" }}>
          <h3 className="font-display text-xl font-bold">What the model actually returns</h3>
          <p className="mt-2 text-sm text-muted-foreground text-pretty">
            The analysis is returned as structured data: an object identification, a list of extracted text lines, plain-language meanings for important numbers and labels,
            a short usage explanation, and any instructions or warnings found on the object. This structure keeps results consistent and easy to read.
          </p>
          <ul className="mt-4 grid gap-2 text-sm text-muted-foreground sm:grid-cols-2">
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              Object type and overall identification
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              Extracted text and readable labels
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              Meanings of numbers, codes and symbols
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              How the object is normally used
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              Important instructions and warnings
            </li>
            <li className="flex items-start gap-2">
              <span className="mt-1.5 inline-block size-1.5 rounded-full bg-focus" />
              Masking of sensitive data when detected
            </li>
          </ul>
        </div>
      </section>

      {/* Privacy warning */}
      <section className="mt-16">
        <h2 className="caption-mono">Privacy &amp; safety</h2>
        <div className="mt-5 rounded-3xl border border-warn/25 bg-warn-soft p-6 sm:p-8 animate-fade-up" style={{ animationDelay: "100ms" }}>
          <div className="flex items-start gap-4">
            <div className="grid size-12 shrink-0 place-items-center rounded-2xl bg-warn text-white">
              <ShieldAlert className="size-6" strokeWidth={2} />
            </div>
            <div>
              <h2 className="font-display text-2xl font-bold text-warn">Privacy first</h2>
              <p className="mt-2 text-sm text-warn/90 text-pretty">
                Sensitive information should stay private. Please do not upload photos that clearly show card numbers, CVV codes, PINs, OTPs or passwords.
                When the AI detects these, it masks them, but the safest approach is to keep them out of the photo.
              </p>
            </div>
          </div>
          <ul className="mt-6 grid gap-3 sm:grid-cols-2">
            {PRIVACY_POINTS.map((point) => (
              <li key={point} className="flex items-start gap-3 text-sm text-warn">
                <span className="mt-2 inline-block size-1 rounded-full bg-warn" />
                <span className="text-pretty">{point}</span>
              </li>
            ))}
          </ul>
        </div>
      </section>

      {/* CTA */}
      <section className="mt-16 flex flex-col items-start gap-6 rounded-3xl border border-border bg-card p-8 sm:flex-row sm:items-center sm:justify-between animate-fade-up" style={{ animationDelay: "200ms" }}>
        <div>
          <h2 className="font-display text-2xl font-bold">Ready to understand what you see?</h2>
          <p className="mt-2 text-sm text-muted-foreground">
            Upload a photo of any everyday object and get a clear, instant explanation.
          </p>
        </div>
        <Link
          to="/"
          className="inline-flex rounded-full bg-primary px-6 py-3 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
        >
          Try it now
        </Link>
      </section>
    </div>
  );
}
