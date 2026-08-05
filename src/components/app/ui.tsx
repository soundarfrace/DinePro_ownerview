import { cn } from "@/lib/utils";
import { ArrowDownRight, ArrowUpRight } from "lucide-react";
import type { ReactNode } from "react";

export function Panel({
  className,
  children,
  delay = 0,
}: {
  className?: string;
  children: ReactNode;
  delay?: number;
}) {
  return (
    <section
      style={{ animationDelay: `${delay}ms` }}
      className={cn("glass animate-rise relative overflow-hidden rounded-2xl p-4", className)}
    >
      {children}
    </section>
  );
}

export function SectionHeader({
  title,
  subtitle,
  action,
}: {
  title: string;
  subtitle?: string;
  action?: ReactNode;
}) {
  return (
    <header className="mb-3 grid grid-cols-[minmax(0,1fr)_auto] items-start gap-3">
      <div className="min-w-0">
        <h2 className="truncate text-[15px] font-semibold">{title}</h2>
        {subtitle ? (
          <p className="mt-0.5 truncate text-[11px] text-muted-foreground">{subtitle}</p>
        ) : null}
      </div>
      {action ? <div className="shrink-0">{action}</div> : null}
    </header>
  );
}

export function Delta({ value }: { value: number }) {
  const up = value >= 0;
  return (
    <span
      className={cn(
        "inline-flex items-center gap-0.5 rounded-full px-1.5 py-0.5 text-[10px] font-semibold",
        up ? "bg-success/12 text-success" : "bg-destructive/15 text-destructive",
      )}
    >
      {up ? <ArrowUpRight className="size-3" /> : <ArrowDownRight className="size-3" />}
      {Math.abs(value).toFixed(1)}%
    </span>
  );
}

export function Chip({
  children,
  tone = "muted",
  className,
}: {
  children: ReactNode;
  tone?: "muted" | "gold" | "aqua" | "success" | "warn" | "danger" | "info";
  className?: string;
}) {
  const tones: Record<string, string> = {
    muted: "bg-secondary text-muted-foreground",
    gold: "bg-primary/15 text-primary",
    aqua: "bg-accent/15 text-accent",
    success: "bg-success/12 text-success",
    warn: "bg-warning/15 text-warning",
    danger: "bg-destructive/15 text-destructive",
    info: "bg-info/15 text-info",
  };
  return (
    <span
      className={cn(
        "inline-flex items-center gap-1 rounded-full px-2 py-0.5 text-[10px] font-semibold tracking-wide",
        tones[tone],
        className,
      )}
    >
      {children}
    </span>
  );
}

export function Segmented<T extends string>({
  options,
  value,
  onChange,
  className,
}: {
  options: { value: T; label: string }[];
  value: T;
  onChange: (v: T) => void;
  className?: string;
}) {
  return (
    <div
      className={cn(
        "flex gap-1 overflow-x-auto rounded-full border border-border bg-secondary/60 p-1 [scrollbar-width:none] [&::-webkit-scrollbar]:hidden",
        className,
      )}
    >
      {options.map((o) => (
        <button
          key={o.value}
          onClick={() => onChange(o.value)}
          className={cn(
            "press shrink-0 rounded-full px-3 py-1.5 text-[11px] font-semibold whitespace-nowrap transition-colors",
            value === o.value
              ? "bg-gradient-gold text-primary-foreground shadow-[var(--shadow-glow)]"
              : "text-muted-foreground hover:text-foreground",
          )}
        >
          {o.label}
        </button>
      ))}
    </div>
  );
}

export function Bar({ pct, tone = "gold" }: { pct: number; tone?: "gold" | "aqua" | "warn" | "danger" | "success" }) {
  const fills: Record<string, string> = {
    gold: "bg-gradient-gold",
    aqua: "bg-gradient-aqua",
    warn: "bg-warning",
    danger: "bg-destructive",
    success: "bg-success",
  };
  return (
    <div className="h-1.5 w-full overflow-hidden rounded-full bg-secondary">
      <div
        className={cn("h-full rounded-full transition-[width] duration-700", fills[tone])}
        style={{ width: `${Math.min(100, Math.max(2, pct))}%` }}
      />
    </div>
  );
}

export function EmptyState({ title, body, icon }: { title: string; body: string; icon: ReactNode }) {
  return (
    <div className="flex flex-col items-center justify-center gap-2 rounded-2xl border border-dashed border-border/80 px-6 py-10 text-center">
      <div className="grid size-11 place-items-center rounded-2xl bg-secondary text-muted-foreground">
        {icon}
      </div>
      <p className="text-sm font-semibold">{title}</p>
      <p className="max-w-[16rem] text-[11px] text-muted-foreground">{body}</p>
    </div>
  );
}

export function SkeletonBlock({ className }: { className?: string }) {
  return <div className={cn("skeleton rounded-2xl", className)} />;
}

export function PageSkeleton() {
  return (
    <div className="space-y-3">
      <SkeletonBlock className="h-24" />
      <div className="grid grid-cols-2 gap-3">
        {Array.from({ length: 4 }).map((_, i) => (
          <SkeletonBlock key={i} className="h-24" />
        ))}
      </div>
      <SkeletonBlock className="h-56" />
      <SkeletonBlock className="h-40" />
    </div>
  );
}
