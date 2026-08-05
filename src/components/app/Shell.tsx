import type { ReactNode } from "react";
import { UtensilsCrossed } from "lucide-react";
const restaurant = { owner: { name: "Aarav Mehta", email: "aarav@lumieregroup.com" } };
import { Chip } from "./ui";

export function Shell({
  title,
  eyebrow,
  children,
}: {
  title: string;
  eyebrow: string;
  children: ReactNode;
}) {
  return (
    <div className="mx-auto min-h-screen w-full max-w-[520px] px-4 pt-5 pb-28">
      <div className="mb-3 flex items-center justify-between gap-3">
        <div className="flex min-w-0 items-center gap-2">
          <span className="bg-gradient-gold grid size-8 shrink-0 place-items-center rounded-xl text-primary-foreground shadow-[var(--shadow-glow)]">
            <UtensilsCrossed className="size-4" />
          </span>
          <div className="min-w-0">
            <p className="font-display truncate text-[14px] leading-tight font-bold tracking-tight">
              Dine<span className="text-gradient-gold">Pro</span>
            </p>
            <p className="truncate text-[9.5px] font-semibold tracking-[0.16em] text-muted-foreground uppercase">
              Owner Suite
            </p>
          </div>
        </div>
        <div className="flex shrink-0 items-center gap-2">

          <div className="press bg-gradient-gold grid size-10 place-items-center rounded-2xl text-sm font-bold text-primary-foreground">
            AM
          </div>
        </div>
      </div>
      <header className="mb-5">
        <div className="min-w-0">
          <p className="text-[10px] font-semibold tracking-[0.18em] text-muted-foreground uppercase">
            {eyebrow}
          </p>
          <h1 className="truncate text-[22px] font-bold text-gradient-gold">{title}</h1>

        </div>
      </header>
      {children}
      <p className="pt-6 text-center text-[10px] text-muted-foreground">
        DinePro Restaurant Management System · Enterprise Owner App v3.4.1
      </p>
    </div>
  );
}
