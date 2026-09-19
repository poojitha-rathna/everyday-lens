import { Link, createFileRoute } from "@tanstack/react-router";

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
    ],
  }),
  component: AboutPage,
});

const STEPS = [
  ["Upload", "Drop a photo, choose a file or use your camera. The image is resized on your device before it is sent."],
  ["Read", "A vision-language model looks at the photo, identifies the object and extracts the readable text."],
  ["Explain", "Important numbers, symbols and sections are explained in simple language, with usage tips and warnings."],
  ["Remember", "Each scan is saved to a private history on your device so you can revisit it any time."],
] as const;

function AboutPage() {
  return (
    <div className="mx-auto max-w-6xl px-5 pb-16 pt-12 sm:pt-16">
      <div className="max-w-2xl">
        <p className="eyebrow">About · 04</p>
        <h1 className="mt-3 font-display text-[clamp(2rem,5vw,3.5rem)] font-bold tracking-tight text-balance">
          A magnifying glass for the everyday.
        </h1>
        <p className="mt-5 text-lg text-muted-foreground text-pretty">
          Bank cards, medicine boxes, tickets, bills, appliance labels — everyday objects are covered in small print,
          codes and symbols that are rarely explained. Everyday Lens turns a photo of any of them into a clear,
          friendly explanation of what you're looking at and how it's used.
        </p>
      </div>

      <section className="mt-14">
        <h2 className="caption-mono">How it works</h2>
        <ol className="mt-5 grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {STEPS.map(([title, desc], i) => (
            <li key={title} className="lens-card animate-fade-up" style={{ animationDelay: `${i * 70}ms` }}>
              <span className="grid size-9 place-items-center rounded-xl bg-background font-display font-bold text-primary">0{i + 1}</span>
              <h3 className="mt-4 font-display text-xl font-bold">{title}</h3>
              <p className="mt-2 text-sm text-muted-foreground text-pretty">{desc}</p>
            </li>
          ))}
        </ol>
      </section>

      <section className="mt-14 grid gap-5 lg:grid-cols-2">
        <div className="rounded-3xl border border-warn/25 bg-warn-soft p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold text-warn">Privacy first</h2>
          <ul className="mt-4 space-y-3 text-sm text-warn">
            <li>• Card numbers, CVV, PINs, OTPs and passwords are masked in every result and never stored.</li>
            <li>• Scan history lives only in your browser. Clear it any time from the History page.</li>
            <li>• Everyday Lens has no banking, payment or financial account features whatsoever.</li>
            <li>• Explanations are educational and may contain mistakes — always check official instructions.</li>
          </ul>
        </div>
        <div className="rounded-3xl border border-border bg-card p-6 sm:p-8">
          <h2 className="font-display text-2xl font-bold">Built for the hackathon</h2>
          <p className="mt-4 text-sm text-muted-foreground text-pretty">
            The app is built with React, TypeScript and Tailwind CSS. Analysis runs on the server through Lovable AI's
            vision model and returns a structured result. If the AI service is unreachable, a built-in sample analysis
            system keeps the full upload → analyze → results flow working so the demo never stalls.
          </p>
          <div className="mt-6 flex flex-wrap gap-2 font-mono text-[11px] uppercase tracking-[0.15em] text-muted-foreground">
            {["React 19", "TypeScript", "Tailwind v4", "TanStack Start", "Lovable AI"].map((t) => (
              <span key={t} className="rounded-full border border-border bg-background px-3 py-1">{t}</span>
            ))}
          </div>
          <Link
            to="/"
            className="mt-8 inline-flex rounded-full bg-primary px-5 py-2.5 font-display font-semibold text-primary-foreground transition-transform hover:-translate-y-0.5"
          >
            Try it now
          </Link>
        </div>
      </section>
    </div>
  );
}
