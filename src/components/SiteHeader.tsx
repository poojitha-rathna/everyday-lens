import { Link } from "@tanstack/react-router";
import { Logo } from "./Logo";

const links = [
  { to: "/", label: "Home" },
  { to: "/history", label: "History" },
  { to: "/about", label: "About" },
] as const;

export function SiteHeader() {
  return (
    <header className="sticky top-0 z-30 border-b border-border bg-background/85 backdrop-blur">
      <div className="mx-auto flex h-16 max-w-6xl items-center justify-between px-5">
        <Logo />
        <nav className="flex items-center gap-1 sm:gap-2" aria-label="Main">
          {links.map((l) => (
            <Link
              key={l.to}
              to={l.to}
              activeOptions={{ exact: l.to === "/" }}
              className="rounded-full px-3 py-2 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground sm:px-4"
              activeProps={{ className: "bg-foreground text-background hover:text-background" }}
            >
              {l.label}
            </Link>
          ))}
        </nav>
      </div>
    </header>
  );
}
