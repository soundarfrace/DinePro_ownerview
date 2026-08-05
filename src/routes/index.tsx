import { createFileRoute, useNavigate } from "@tanstack/react-router";
import { useEffect, useMemo, useState } from "react";
import {
  Banknote,
  BrainCircuit,
  Coins,
  Download,
  FileSpreadsheet,
  Layers,
  Printer,
  ReceiptText,
  ShoppingBag,
  Sparkles,
  Timer,
  TrendingUp,
  Users,
  UtensilsCrossed,
  Crown,
} from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/app/Shell";
import {
  Bar,
  Chip,
  Delta,
  Panel,
  PageSkeleton,
  SectionHeader,
} from "@/components/app/ui";
import {
  DateFilter,
  filterToRange,
  type DateFilterValue,
} from "@/components/app/DateFilter";
import { AreaTrend, BarsChart, DonutChart, Legend, LineTrend } from "@/components/app/charts";
import {
  currency,
  employees,
  insights,
  kpis,
  lowStock,
  membership,
  paymentMix,
  rangeSummary,
  recentOrders,
  revenueSeries,
  tableStatus,
  topItems,
  type RangeKey,
} from "@/data/mock";


export const Route = createFileRoute("/")({
  head: () => ({
    meta: [
      { title: "DinePro Owner — Executive Dashboard" },
      {
        name: "description",
        content:
          "Executive dashboard for restaurant owners: live sales, orders, tables, profit, membership and AI business insights.",
      },
      { property: "og:title", content: "DinePro Owner — Executive Dashboard" },
      {
        property: "og:description",
        content: "Live restaurant KPIs, revenue trends, inventory alerts and AI insights.",
      },
    ],
  }),
  component: Dashboard,
});

const kpiIcons: Record<string, typeof Coins> = {
  sales: Banknote,
  orders: ShoppingBag,
  tables: UtensilsCrossed,
  pending: Timer,
  revenue: TrendingUp,
  profit: Coins,
  customers: Users,
  membership: Crown,
};

const toneRing: Record<string, string> = {
  gold: "text-primary bg-primary/12",
  aqua: "text-accent bg-accent/12",
  success: "text-success bg-success/12",
  warn: "text-warning bg-warning/12",
};

const rangeLabel: Record<DateFilterValue, string> = {
  today: "Today",
  week: "This Week",
  month: "This Month",
  year: "This Year",
  custom: "Custom",
};


function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<DateFilterValue>("today");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-08-05");
  const navigate = useNavigate();

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [filter]);

  const range: RangeKey = filterToRange[filter];
  const series = revenueSeries[range];
  const summary = rangeSummary[range];
  const totalTables = useMemo(() => tableStatus.reduce((s, t) => s + t.count, 0), []);

  return (
    <Shell eyebrow="Owner Console" title="Business Overview">
      <div className="mb-3">
        <DateFilter
          value={filter}
          onChange={setFilter}
          from={from}
          to={to}
          onFromChange={setFrom}
          onToChange={setTo}
        />
      </div>
      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-3">
          <Panel className="p-5">
            <div className="hairline-top absolute inset-0" />
            <p className="text-[11px] text-muted-foreground">
              {filter === "custom" ? `Net revenue · ${from} → ${to}` : summary.caption}
            </p>
            <div className="mt-1 flex items-end gap-2">
              <p className="font-display text-[34px] leading-none font-bold text-gradient-gold">
                {currency(summary.revenue)}
              </p>
              <Delta value={summary.delta} />
            </div>
            <p className="mt-2 text-[11px] text-muted-foreground">
              {summary.orders.toLocaleString("en-IN")} orders · avg ticket{" "}
              {currency(summary.avgTicket)} · 27 tables live
            </p>
            <div className="mt-4">
              <AreaTrend data={series} height={92} />
            </div>
          </Panel>


          <div className="grid grid-cols-2 gap-3">
            {kpis.map((k, i) => {
              const Icon = kpiIcons[k.icon] ?? Coins;
              return (
                <Panel key={k.id} delay={i * 45} className="p-3.5">
                  <div className="flex items-start justify-between">
                    <span
                      className={`grid size-8 place-items-center rounded-xl ${toneRing[k.tone]}`}
                    >
                      <Icon className="size-4" />
                    </span>
                    <Delta value={k.delta} />
                  </div>
                  <p className="mt-3 truncate font-display text-[19px] font-bold">{k.value}</p>
                  <p className="truncate text-[11px] text-muted-foreground">{k.label}</p>
                </Panel>
              );
            })}
          </div>

          <Panel>
            <SectionHeader
              title="Revenue & Growth"
              subtitle="Revenue, orders and customer growth"
              action={<Chip tone="gold">{rangeLabel[filter]}</Chip>}
            />

            <AreaTrend data={series} />
            <div className="mt-4 border-t border-border pt-3">
              <p className="mb-2 text-[11px] font-semibold text-muted-foreground">
                Order trend vs customer growth
              </p>
              <LineTrend
                data={series}
                height={150}
                keys={[
                  { key: "orders", color: "var(--chart-2)" },
                  { key: "customers", color: "var(--chart-3)" },
                ]}
              />
              <Legend
                items={[
                  { label: "Orders", value: "trend", color: "var(--chart-2)" },
                  { label: "Customers", value: "trend", color: "var(--chart-3)" },
                ]}
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader title="Restaurant Status" subtitle={`${totalTables} tables across floor`} />
            <div className="grid grid-cols-2 gap-2.5">
              {tableStatus.map((t) => (
                <div key={t.label} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="flex items-center justify-between">
                    <p className="text-[11px] text-muted-foreground">{t.label}</p>
                    <Chip tone={t.tone as "gold"}>{Math.round((t.count / totalTables) * 100)}%</Chip>
                  </div>
                  <p className="mt-1 font-display text-xl font-bold">{t.count}</p>
                  <div className="mt-2">
                    <Bar
                      pct={(t.count / totalTables) * 100}
                      tone={t.tone === "info" ? "aqua" : (t.tone as "gold")}
                    />
                  </div>
                </div>
              ))}
            </div>
          </Panel>

          <Panel>
            <SectionHeader title="Top Selling Items" subtitle="By revenue contribution today" />
            <ul className="space-y-3">
              {topItems.map((item) => (
                <li key={item.name} className="flex items-center gap-3">
                  <img
                    src={item.image}
                    alt={item.name}
                    loading="lazy"
                    width={512}
                    height={512}
                    className="size-12 shrink-0 rounded-xl object-cover"
                  />
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{item.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {item.category} · {item.sold} sold
                    </p>
                    <div className="mt-1.5">
                      <Bar pct={(item.revenue / (topItems[0]?.revenue ?? 1)) * 100} />
                    </div>
                  </div>
                  <p className="shrink-0 text-[13px] font-bold text-primary">
                    {currency(item.revenue)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Recent Orders" subtitle="Latest six tickets" />
            <ul className="divide-y divide-border">
              {recentOrders.map((o) => (
                <li key={o.id} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{o.id}</p>
                    <p className="truncate text-[11px] text-muted-foreground">
                      {o.table} · {o.type} · {o.payment}
                    </p>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-bold">{currency(o.amount)}</p>
                    <Chip
                      tone={
                        o.status === "Completed"
                          ? "success"
                          : o.status === "Cancelled"
                            ? "danger"
                            : o.status === "Pending"
                              ? "warn"
                              : "aqua"
                      }
                    >
                      {o.status}
                    </Chip>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader
              title="Low Stock Alerts"
              subtitle="5 items need attention"
              action={<Chip tone="danger">2 critical</Chip>}
            />
            <ul className="space-y-2.5">
              {lowStock.map((s) => (
                <li key={s.name} className="rounded-xl border border-border bg-secondary/40 p-3">
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-3">
                    <p className="truncate text-[13px] font-semibold">{s.name}</p>
                    <Chip
                      tone={
                        s.severity === "critical" ? "danger" : s.severity === "low" ? "warn" : "muted"
                      }
                    >
                      {s.severity}
                    </Chip>
                  </div>
                  <p className="mt-1 text-[11px] text-muted-foreground">
                    {s.left} {s.unit} left · threshold {s.threshold} {s.unit}
                  </p>
                  <div className="mt-2">
                    <Bar
                      pct={(s.left / s.threshold) * 100}
                      tone={s.severity === "critical" ? "danger" : "warn"}
                    />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Membership Summary" subtitle="Loyalty program health" />
            <div className="grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Active", v: membership.active.toLocaleString() },
                { l: "New / mo", v: `+${membership.newThisMonth}` },
                { l: "Churn", v: `${membership.churn}%` },
              ].map((m) => (
                <div key={m.l} className="rounded-xl border border-border bg-secondary/40 py-2.5">
                  <p className="font-display text-[17px] font-bold">{m.v}</p>
                  <p className="text-[10px] text-muted-foreground">{m.l}</p>
                </div>
              ))}
            </div>
            <div className="mt-3">
              <BarsChart
                data={membership.tiers}
                xKey="tier"
                height={160}
                keys={[{ key: "value", color: "var(--chart-1)" }]}
              />
            </div>
          </Panel>

          <Panel>
            <SectionHeader title="Employee Performance" subtitle="Top five by sales today" />
            <ul className="space-y-3">
              {employees.map((e) => (
                <li key={e.name} className="flex items-center gap-3">
                  <span className="bg-gradient-aqua grid size-9 shrink-0 place-items-center rounded-xl text-[11px] font-bold text-accent-foreground">
                    {e.name
                      .split(" ")
                      .map((n) => n[0])
                      .join("")}
                  </span>
                  <div className="min-w-0 flex-1">
                    <p className="truncate text-[13px] font-semibold">{e.name}</p>
                    <p className="text-[11px] text-muted-foreground">
                      {e.role} · {e.orders} orders
                    </p>
                    <div className="mt-1.5">
                      <Bar pct={e.score} tone="aqua" />
                    </div>
                  </div>
                  <div className="shrink-0 text-right">
                    <p className="text-[13px] font-bold">{currency(e.sales)}</p>
                    <p className="text-[10px] text-muted-foreground">score {e.score}</p>
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Payment Methods" subtitle="Distribution of today's collections" />
            <DonutChart data={paymentMix} nameKey="method" />
            <Legend
              items={paymentMix.map((p) => ({
                label: `${p.method} · ${p.value}%`,
                value: currency(p.amount),
              }))}
            />
          </Panel>

          <Panel>
            <SectionHeader
              title="AI Business Insights"
              subtitle="Generated from the last 30 days"
              action={
                <span className="bg-gradient-gold grid size-8 place-items-center rounded-xl text-primary-foreground">
                  <BrainCircuit className="size-4" />
                </span>
              }
            />
            <ul className="space-y-2.5">
              {insights.map((ins) => (
                <li
                  key={ins.title}
                  className="rounded-xl border border-border bg-secondary/40 p-3"
                >
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-[13px] font-semibold">{ins.title}</p>
                    <Chip tone={ins.tone as "gold"}>{ins.tag}</Chip>
                  </div>
                  <p className="mt-1.5 text-[11.5px] leading-relaxed text-muted-foreground">
                    {ins.body}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Quick Actions" subtitle="Executive shortcuts" />
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "View Reports", icon: Layers, to: "/reports" as const },
                { label: "Download Sales", icon: Download },
                { label: "Print Summary", icon: Printer },
                { label: "Export Data", icon: FileSpreadsheet },
              ].map(({ label, icon: Icon, to }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (to) {
                      void navigate({ to });
                      return;
                    }
                    toast.success(`${label} ready`, { description: "Mock export generated." });
                  }}
                  className="press flex items-center gap-2 rounded-xl border border-border bg-secondary/50 px-3 py-3 text-left text-[12px] font-semibold"
                >
                  <Icon className="size-4 shrink-0 text-primary" />
                  <span className="truncate">{label}</span>
                </button>
              ))}
            </div>
          </Panel>

          <p className="pt-1 text-center text-[10px] text-muted-foreground">
            <Sparkles className="mr-1 inline size-3" />
            DinePro Enterprise · mock data preview
          </p>
        </div>
      )}

      <button
        onClick={() => toast.success("Daily summary exported", { description: "PDF · 4 pages" })}
        aria-label="Export daily summary"
        className="press bg-gradient-gold fixed right-4 bottom-24 z-40 grid size-13 place-items-center rounded-2xl text-primary-foreground shadow-[var(--shadow-glow)]"
      >
        <ReceiptText className="size-5" />
      </button>
    </Shell>
  );
}
