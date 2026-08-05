import { Link, useRouterState } from "@tanstack/react-router";
import { LayoutDashboard, PieChart, Settings } from "lucide-react";
import { cn } from "@/lib/utils";

const tabs = [
  { to: "/dashboard", label: "Dashboard", icon: LayoutDashboard },
  { to: "/reports", label: "Reports", icon: PieChart },
  { to: "/settings", label: "Settings", icon: Settings },
] as const;

export function BottomNav() {
  const pathname = useRouterState({ select: (s) => s.location.pathname });

  return (
    <nav className="fixed inset-x-0 bottom-0 z-50 flex justify-center px-4 pb-[max(1rem,env(safe-area-inset-bottom))]">
      <ul className="glass-nav flex items-center gap-1 rounded-full p-1.5">
        {tabs.map(({ to, label, icon: Icon }) => {
          const active = pathname === to;
          return (
            <li key={to}>
              <Link
                to={to}
                aria-label={label}
                title={label}
                className={cn(
                  "press grid size-12 place-items-center rounded-full transition-all duration-300",
                  active
                    ? "bg-gradient-gold text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "text-muted-foreground hover:bg-secondary hover:text-foreground",
                )}
              >
                <Icon className="size-5" />
              </Link>
            </li>
          );
        })}
      </ul>
    </nav>
  );
}
