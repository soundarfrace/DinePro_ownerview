import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useState } from "react";
import {
  BadgeCheck,
  Bell,
  Building2,
  ChevronRight,
  Clock,
  CreditCard,
  FileText,
  Globe,
  HelpCircle,
  Info,
  KeyRound,
  LogOut,
  Moon,
  Percent,
  Printer,
  ScrollText,
  ShieldCheck,
  Store,
  Sun,
  UserRound,
} from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/app/Shell";
import { Chip, Panel, SectionHeader } from "@/components/app/ui";
import { Switch } from "@/components/ui/switch";
import { useTheme } from "@/hooks/use-theme";


export const Route = createFileRoute("/settings")({
  head: () => ({
    meta: [
      { title: "Settings — DinePro Owner App" },
      {
        name: "description",
        content:
          "Manage restaurant profile, branches, business hours, printers, taxes, subscription and preferences.",
      },
      { property: "og:title", content: "Settings — DinePro Owner App" },
      {
        property: "og:description",
        content: "Restaurant profile, branch management, billing and app preferences.",
      },
    ],
  }),
  component: SettingsPage,
});

type Item = { label: string; hint?: string; icon: typeof Store };

const groups: { title: string; items: Item[] }[] = [


  {
    title: "Preferences",
    items: [{ label: "Language Settings", hint: "English (US)", icon: Globe }],
  },

  {
    title: "Support & Legal",
    items: [
      { label: "Help & Support", hint: "24/7 enterprise desk", icon: HelpCircle },
      { label: "Privacy Policy", icon: ShieldCheck },
      { label: "Terms & Conditions", icon: ScrollText },
      { label: "App Version", hint: "v3.4.1", icon: Info },
    ],
  },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("accessToken");
    localStorage.removeItem("refreshToken");
    localStorage.removeItem("user");
    localStorage.removeItem("accountCode");
    localStorage.removeItem("retailCode");
    toast.success("Signed out", { description: "You have been securely logged out." });
    void navigate({ to: "/" });
  };
  const [notif, setNotif] = useState({
    sales: true,
    inventory: true,
    staff: false,
    marketing: false,
  });

  return (
    <Shell eyebrow="Configuration" title="Settings">
      <div className="space-y-3">
        <Panel>
          <SectionHeader title="Appearance" subtitle="Choose your theme" />
          <div className="grid grid-cols-2 gap-2">
            {([
              { key: "light", label: "Light", icon: Sun },
              { key: "dark", label: "Dark", icon: Moon },
            ] as const).map(({ key, label, icon: Icon }) => (
              <button
                key={key}
                onClick={() => setTheme(key)}
                className={
                  theme === key
                    ? "press bg-gradient-gold flex items-center justify-center gap-2 rounded-2xl py-3 text-[13px] font-bold text-primary-foreground shadow-[var(--shadow-glow)]"
                    : "press flex items-center justify-center gap-2 rounded-2xl border border-border bg-secondary/50 py-3 text-[13px] font-semibold text-muted-foreground"
                }
              >
                <Icon className="size-4" /> {label}
              </button>
            ))}
          </div>
        </Panel>




        {groups.map((g) => (
          <Panel key={g.title}>
            <SectionHeader title={g.title} />
            <ul className="divide-y divide-border">
              {g.items.map(({ label, hint, icon: Icon }) => (
                <li key={label}>
                  <button
                    className="press grid w-full grid-cols-[auto_minmax(0,1fr)] items-center gap-3 py-3 text-left"
                  >
                    <span className="grid size-9 shrink-0 place-items-center rounded-xl bg-secondary text-primary">
                      <Icon className="size-4" />
                    </span>
                    <span className="min-w-0">
                      <span className="block truncate text-[13px] font-semibold">{label}</span>
                      {hint ? (
                        <span className="block truncate text-[11px] text-muted-foreground">
                          {hint}
                        </span>
                      ) : null}
                    </span>
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ))}

        <button
          onClick={handleLogout}
          className="press glass flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold text-destructive"
        >
          <LogOut className="size-4" /> Logout
        </button>
      </div>
    </Shell>
  );
}
