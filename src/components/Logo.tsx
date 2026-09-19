import { Link } from "@tanstack/react-router";

export function LensMark({ className = "size-9 text-lg" }: { className?: string }) {
  return (
    <span
      className={`grid place-items-center rounded-xl bg-primary text-primary-foreground font-display font-bold ${className}`}
      aria-hidden="true"
    >
      <svg viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" className="size-[55%]">
        <circle cx="11" cy="11" r="6.5" />
        <path d="M20 20l-4.2-4.2" />
        <circle cx="11" cy="11" r="1.6" fill="currentColor" stroke="none" />
      </svg>
    </span>
  );
}

export function Logo({ tagline = true }: { tagline?: boolean }) {
  return (
    <Link to="/" className="flex items-center gap-2.5" aria-label="Everyday Lens home">
      <LensMark />
      <span className="leading-none">
        <span className="block font-display font-bold tracking-tight text-lg">Everyday Lens</span>
        {tagline && (
          <span className="mt-1 block font-mono text-[10px] uppercase tracking-[0.2em] text-muted-foreground">
            Understand What You See
          </span>
        )}
      </span>
    </Link>
  );
}
