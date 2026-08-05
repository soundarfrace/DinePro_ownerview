import { createFileRoute } from "@tanstack/react-router";
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
import { restaurant, subscription } from "@/data/mock";


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
    title: "Business",
    items: [
      { label: "Restaurant Profile", hint: restaurant.name, icon: Store },
      { label: "Branch Management", hint: `${restaurant.branches.length} branches`, icon: Building2 },
      { label: "Business Hours", hint: "11:00 – 23:30 daily", icon: Clock },
      { label: "Tax Configuration", hint: "4 tax rules active", icon: Percent },
      { label: "Printer Configuration", hint: "3 printers paired", icon: Printer },
    ],
  },
  {
    title: "Account",
    items: [
      { label: "Owner Profile", hint: restaurant.owner.email, icon: UserRound },
      { label: "Change Password", hint: "Updated 42 days ago", icon: KeyRound },
      { label: "Subscription Details", hint: subscription.plan, icon: CreditCard },
    ],
  },
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
      { label: "App Version", hint: "v4.2.1 (build 2261)", icon: Info },
    ],
  },
];

function SettingsPage() {
  const { theme, setTheme } = useTheme();
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

        <Panel className="p-5">
          <div className="flex items-center gap-3">
            <div className="bg-gradient-gold grid size-14 shrink-0 place-items-center rounded-2xl text-lg font-bold text-primary-foreground">
              AM
            </div>
            <div className="min-w-0">
              <p className="truncate text-[15px] font-bold">{restaurant.owner.name}</p>
              <p className="truncate text-[11px] text-muted-foreground">{restaurant.owner.email}</p>
              <div className="mt-1.5 flex flex-wrap gap-1.5">
                <Chip tone="gold">
                  <BadgeCheck className="size-3" /> {restaurant.owner.role}
                </Chip>
                <Chip tone="aqua">{subscription.branches} branches</Chip>
              </div>
            </div>
          </div>
        </Panel>

        <Panel>
          <SectionHeader
            title="Subscription"
            subtitle={`${subscription.plan} · renews ${subscription.renews}`}
            action={<Chip tone="success">Active</Chip>}
          />
          <div className="grid grid-cols-3 gap-2 text-center">
            {[
              { l: "Amount", v: subscription.amount },
              { l: "Seats", v: `${subscription.seats}` },
              { l: "Branches", v: `${subscription.branches}` },
            ].map((m) => (
              <div key={m.l} className="rounded-xl border border-border bg-secondary/40 py-2.5">
                <p className="font-display text-[14px] font-bold">{m.v}</p>
                <p className="text-[10px] text-muted-foreground">{m.l}</p>
              </div>
            ))}
          </div>
        </Panel>

        <Panel>
          <SectionHeader title="Branches" subtitle="Tap to manage a location" />
          <ul className="divide-y divide-border">
            {restaurant.branches.map((b) => (
              <li key={b.id}>
                <button
                  onClick={() => toast(b.name, { description: `${b.city} · ${b.tables} tables` })}
                  className="press grid w-full grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2.5 text-left"
                >
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{b.name}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {b.city} · {b.tables} tables
                    </p>
                  </div>
                  <Chip tone={b.status === "Open" ? "success" : "warn"}>{b.status}</Chip>
                </button>
              </li>
            ))}
          </ul>
        </Panel>

        <Panel>
          <SectionHeader
            title="Notification Preferences"
            subtitle="Choose what reaches your phone"
            action={
              <span className="grid size-8 place-items-center rounded-xl bg-primary/12 text-primary">
                <Bell className="size-4" />
              </span>
            }
          />
          <ul className="space-y-1">
            {[
              { key: "sales", label: "Daily sales digest" },
              { key: "inventory", label: "Low stock alerts" },
              { key: "staff", label: "Staff performance" },
              { key: "marketing", label: "Marketing updates" },
            ].map((n) => (
              <li
                key={n.key}
                className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3 py-2"
              >
                <p className="truncate text-[13px]">{n.label}</p>
                <Switch
                  checked={notif[n.key as keyof typeof notif]}
                  onCheckedChange={(v) => setNotif((p) => ({ ...p, [n.key]: v }))}
                />
              </li>
            ))}
          </ul>
        </Panel>

        {groups.map((g) => (
          <Panel key={g.title}>
            <SectionHeader title={g.title} />
            <ul className="divide-y divide-border">
              {g.items.map(({ label, hint, icon: Icon }) => (
                <li key={label}>
                  <button
                    onClick={() => toast(label, { description: hint ?? "Mock settings screen" })}
                    className="press grid w-full grid-cols-[auto_minmax(0,1fr)_auto] items-center gap-3 py-3 text-left"
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
                    <ChevronRight className="size-4 shrink-0 text-muted-foreground" />
                  </button>
                </li>
              ))}
            </ul>
          </Panel>
        ))}

        <button
          onClick={() => toast.error("Signed out", { description: "Mock session ended." })}
          className="press glass flex w-full items-center justify-center gap-2 rounded-2xl py-3.5 text-[13px] font-bold text-destructive"
        >
          <LogOut className="size-4" /> Logout
        </button>

        <p className="flex items-center justify-center gap-1.5 pb-2 text-center text-[10px] text-muted-foreground">
          <FileText className="size-3" /> DinePro Owner v4.2.1 · mock data preview
        </p>
      </div>
    </Shell>
  );
}
