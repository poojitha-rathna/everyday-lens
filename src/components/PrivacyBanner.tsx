export function PrivacyBanner({ note, detected = false }: { note?: string; detected?: boolean }) {
  return (
    <div
      role="note"
      className="flex items-start gap-3 rounded-2xl border border-warn/25 bg-warn-soft px-4 py-4 animate-fade-up sm:px-5"
    >
      <span className="mt-0.5 grid size-8 shrink-0 place-items-center rounded-full bg-warn font-display font-bold text-primary-foreground">
        !
      </span>
      <div className="text-sm text-warn text-pretty">
        <p className="font-semibold">{detected ? "Sensitive information spotted" : "Privacy note"}</p>
        <p className="mt-0.5">
          {note ||
            "If your photo shows card numbers, CVV, PINs, OTPs or passwords, keep them hidden. Everyday Lens masks them, never stores them, and has no banking or payment features."}
        </p>
      </div>
    </div>
  );
}
