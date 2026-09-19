import { Link } from "@tanstack/react-router";

export function SiteFooter() {
  return (
    <footer className="mt-6 border-t border-border">
      <div className="mx-auto flex max-w-6xl flex-col items-start justify-between gap-4 px-5 py-10 sm:flex-row sm:items-center">
        <div className="flex items-center gap-2.5">
          <span className="grid size-8 place-items-center rounded-lg bg-foreground font-display font-bold text-background">E</span>
          <p className="text-sm text-muted-foreground">Everyday Lens — Understand What You See.</p>
        </div>
        <nav className="flex items-center gap-5 text-sm text-muted-foreground" aria-label="Footer">
          <Link to="/" className="hover:text-foreground">Home</Link>
          <Link to="/history" className="hover:text-foreground">History</Link>
          <Link to="/about" className="hover:text-foreground">About</Link>
          <span className="font-mono text-[11px]">© 2026</span>
        </nav>
      </div>
      <div className="mx-auto max-w-6xl px-5 pb-8">
        <p className="text-xs text-muted-foreground text-pretty">
          Everyday Lens explains objects for learning purposes. It has no banking, payment or financial account features and never stores card numbers, CVV, PINs, OTPs or passwords.
        </p>
      </div>
    </footer>
  );
}
