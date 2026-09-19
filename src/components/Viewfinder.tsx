import heroObjects from "@/assets/hero-objects.jpg";

type Props = {
  src: string | null;
  scanning: boolean;
  status: string;
};

/** Camera-viewfinder styled preview frame with scan-line animation. */
export function Viewfinder({ src, scanning, status }: Props) {
  return (
    <div className="animate-fade-up [animation-delay:150ms]">
      <div className="relative aspect-[4/3] rounded-[28px] bg-foreground p-3 ring-1 ring-foreground/10 sm:p-4">
        <div className="relative h-full w-full overflow-hidden rounded-[18px] bg-background/5">
          <img
            src={src ?? heroObjects}
            alt={src ? "Your uploaded photo" : "Example: a debit card and a medicine box on a desk"}
            className={`absolute inset-0 h-full w-full object-cover transition-opacity duration-500 ${src ? "opacity-100" : "opacity-70"}`}
          />
          {!src && (
            <span className="absolute inset-x-0 bottom-4 text-center font-mono text-[10px] uppercase tracking-[0.2em] text-background/70">
              Image preview appears here
            </span>
          )}
          <div className="pointer-events-none absolute inset-0">
            <span className="absolute left-3 top-3 h-6 w-6 rounded-tl-lg border-l-2 border-t-2 border-primary/70" />
            <span className="absolute right-3 top-3 h-6 w-6 rounded-tr-lg border-r-2 border-t-2 border-primary/70" />
            <span className="absolute bottom-3 left-3 h-6 w-6 rounded-bl-lg border-b-2 border-l-2 border-primary/70" />
            <span className="absolute bottom-3 right-3 h-6 w-6 rounded-br-lg border-b-2 border-r-2 border-primary/70" />
            <span className="absolute left-1/2 top-1/2 size-10 -translate-x-1/2 -translate-y-1/2 rounded-full border border-background/40" />
            <span className="absolute left-1/2 top-1/2 size-2 -translate-x-1/2 -translate-y-1/2 bg-primary animate-blink" />
            <span className="absolute left-3 top-1/2 h-10 w-px -translate-y-1/2 bg-background/25" />
            <span className="absolute right-3 top-1/2 h-10 w-px -translate-y-1/2 bg-background/25" />
          </div>
          {scanning && (
            <div className="pointer-events-none absolute inset-x-0 h-16 bg-gradient-to-b from-transparent via-primary/45 to-transparent animate-scan" />
          )}
        </div>
      </div>
      <div className="mt-3 flex items-center justify-between caption-mono tracking-[0.18em]">
        <span className="flex items-center gap-2">
          <span className={`size-2 rounded-full ${scanning ? "bg-primary animate-blink" : src ? "bg-focus" : "bg-muted-foreground/50"}`} />
          {status}
        </span>
        <span>ISO 200 · f/2.8 · 1/125</span>
      </div>
    </div>
  );
}
