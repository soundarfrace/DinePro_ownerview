import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState } from "react";
import {
  BarChart3,
  CalendarRange,
  Download,
  FileBarChart,
  Inbox,
} from "lucide-react";
import { toast } from "sonner";
import { Shell } from "@/components/app/Shell";
import {
  Bar,
  Chip,
  Delta,
  EmptyState,
  Panel,
  PageSkeleton,
  SectionHeader,
  Segmented,
} from "@/components/app/ui";
import { AreaTrend, BarsChart, DonutChart, Legend, LineTrend } from "@/components/app/charts";
import {
  currency,
  customerAnalytics,
  employees,
  expenses,
  inventoryReport,
  membership,
  orderTypes,
  paymentMix,
  profitLoss,
  revenueSeries,
  taxReport,
} from "@/data/mock";

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — DinePro Owner" },
      {
        name: "description",
        content:
          "Sales, revenue, profit & loss, expense, customer, membership, inventory, tax and payment analytics for restaurant owners.",
      },
      { property: "og:title", content: "Reports & Analytics — DinePro Owner" },
      {
        property: "og:description",
        content: "Comprehensive restaurant business analytics with premium interactive charts.",
      },
    ],
  }),
  component: Reports,
});

type Filter = "today" | "week" | "month" | "year" | "custom";

const filterToRange = {
  today: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
  custom: "monthly",
} as const;

function Reports() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("month");

  useEffect(() => {
    setLoading(true);
    const t = setTimeout(() => setLoading(false), 650);
    return () => clearTimeout(t);
  }, [filter]);

  const series = revenueSeries[filterToRange[filter]];
  const totalExpense = expenses.reduce((s, e) => s + e.value, 0);

  return (
    <Shell eyebrow="Business Intelligence" title="Reports & Analytics">
      <div className="mb-3 space-y-2">
        <Segmented
          value={filter}
          onChange={setFilter}
          options={[
            { value: "today", label: "Today" },
            { value: "week", label: "This Week" },
            { value: "month", label: "This Month" },
            { value: "year", label: "This Year" },
            { value: "custom", label: "Custom" },
          ]}
        />
        {filter === "custom" ? (
          <div className="glass grid grid-cols-2 gap-2 rounded-2xl p-3">
            <label className="min-w-0 text-[10px] text-muted-foreground">
              From
              <input
                type="date"
                defaultValue="2026-07-01"
                className="mt-1 w-full rounded-xl border border-input bg-secondary/60 px-2.5 py-2 text-[12px] text-foreground"
              />
            </label>
            <label className="min-w-0 text-[10px] text-muted-foreground">
              To
              <input
                type="date"
                defaultValue="2026-08-05"
                className="mt-1 w-full rounded-xl border border-input bg-secondary/60 px-2.5 py-2 text-[12px] text-foreground"
              />
            </label>
          </div>
        ) : null}
      </div>

      {loading ? (
        <PageSkeleton />
      ) : (
        <div className="space-y-3">
          <Panel>
            <SectionHeader
              title="Sales Report"
              subtitle="Gross sales across the selected period"
              action={<Delta value={14.2} />}
            />
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Gross", v: "₹3.30 Cr" },
                { l: "Net", v: "₹2.97 Cr" },
                { l: "Avg Ticket", v: "₹4,842" },

              ].map((m) => (
                <div key={m.l} className="rounded-xl border border-border bg-secondary/40 py-2.5">
                  <p className="font-display text-[15px] font-bold">{m.v}</p>
                  <p className="text-[10px] text-muted-foreground">{m.l}</p>
                </div>
              ))}
            </div>
            <BarsChart data={series} keys={[{ key: "revenue", color: "var(--chart-1)" }]} />
          </Panel>

          <Panel>
            <SectionHeader title="Revenue Report" subtitle="Trend and momentum" />
            <AreaTrend data={series} />
          </Panel>

          <Panel>
            <SectionHeader title="Profit & Loss" subtitle="Revenue vs expense vs profit" />
            <LineTrend
              data={profitLoss}
              keys={[
                { key: "revenue", color: "var(--chart-1)" },
                { key: "expense", color: "var(--chart-5)" },
                { key: "profit", color: "var(--chart-3)" },
              ]}
            />
            <Legend
              items={[
                { label: "Revenue", value: "₹3.67 Cr", color: "var(--chart-1)" },
                { label: "Expense", value: "₹2.73 Cr", color: "var(--chart-5)" },
                { label: "Profit", value: "₹93.7 L", color: "var(--chart-3)" },

                { label: "Margin", value: "25.6%", color: "var(--chart-2)" },
              ]}
            />
          </Panel>

          <Panel>
            <SectionHeader title="Expense Analysis" subtitle={`Total ${currency(totalExpense)}`} />
            <ul className="space-y-2.5">
              {expenses.map((e) => (
                <li key={e.name}>
                  <div className="grid grid-cols-[minmax(0,1fr)_auto] items-center gap-2">
                    <p className="truncate text-[12.5px] font-semibold">{e.name}</p>
                    <p className="text-[12px] font-bold text-primary">{currency(e.value)}</p>
                  </div>
                  <div className="mt-1.5">
                    <Bar pct={(e.value / totalExpense) * 100} />
                  </div>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Customer Analytics" subtitle="New vs returning guests" />
            <BarsChart
              data={customerAnalytics}
              stacked
              keys={[
                { key: "newCust", color: "var(--chart-2)" },
                { key: "returning", color: "var(--chart-4)" },
              ]}
            />
            <Legend
              items={[
                { label: "New guests", value: "1,560", color: "var(--chart-2)" },
                { label: "Returning", value: "4,560", color: "var(--chart-4)" },
              ]}
            />
          </Panel>

          <Panel>
            <SectionHeader
              title="Membership Analytics"
              subtitle={`${membership.active.toLocaleString()} active members`}
            />
            <DonutChart data={membership.tiers} nameKey="tier" />
            <Legend
              items={membership.tiers.map((t) => ({
                label: `${t.tier} · ${t.members}`,
                value: currency(t.value),
              }))}
            />
          </Panel>

          <Panel>
            <SectionHeader title="Inventory Report" subtitle="Stock value and turnover" />
            <ul className="divide-y divide-border">
              {inventoryReport.map((i) => (
                <li key={i.category} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{i.category}</p>
                    <p className="text-[11px] text-muted-foreground">{i.turns}x turns / month</p>
                  </div>
                  <p className="shrink-0 self-center text-[13px] font-bold text-primary">
                    {currency(i.value)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Employee Performance" subtitle="Sales contribution ranking" />
            <BarsChart
              data={employees.map((e) => ({ label: e.name.split(" ")[0] ?? e.name, sales: e.sales }))}
              keys={[{ key: "sales", color: "var(--chart-3)" }]}
            />
          </Panel>

          <Panel>
            <SectionHeader title="Payment Method Analysis" subtitle="Share of collections" />
            <DonutChart data={paymentMix} nameKey="method" inner={46} />
            <Legend
              items={paymentMix.map((p) => ({
                label: `${p.method} · ${p.value}%`,
                value: currency(p.amount),
              }))}
            />
          </Panel>

          <Panel>
            <SectionHeader title="Tax Report" subtitle="Collected in the selected period" />
            <ul className="divide-y divide-border">
              {taxReport.map((t) => (
                <li key={t.name} className="grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5">
                  <div className="min-w-0">
                    <p className="truncate text-[13px] font-semibold">{t.name}</p>
                    <Chip tone="muted">rate {t.rate}</Chip>
                  </div>
                  <p className="shrink-0 self-center text-[13px] font-bold">
                    {currency(t.collected)}
                  </p>
                </li>
              ))}
            </ul>
          </Panel>

          <Panel>
            <SectionHeader title="Order Type Report" subtitle="Dine in, takeaway, delivery, catering" />
            <DonutChart data={orderTypes} nameKey="type" />
            <Legend
              items={orderTypes.map((o) => ({
                label: `${o.type} · ${o.value}%`,
                value: `${o.orders} orders`,
              }))}
            />
          </Panel>

          <Panel>
            <SectionHeader title="Scheduled Reports" subtitle="Nothing queued right now" />
            <EmptyState
              icon={<Inbox className="size-5" />}
              title="No scheduled reports"
              body="Schedule a weekly executive digest and it will appear here for every branch."
            />
          </Panel>

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => toast.success("Full report exported", { description: "XLSX · 12 sheets" })}
              className="press bg-gradient-gold flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-bold text-primary-foreground"
            >
              <Download className="size-4" /> Export All
            </button>
            <button
              onClick={() => toast("Comparison mode", { description: "Mock period comparison ready." })}
              className="press glass flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-bold"
            >
              <BarChart3 className="size-4 text-accent" /> Compare
            </button>
          </div>

          <p className="flex items-center justify-center gap-1.5 pt-1 text-center text-[10px] text-muted-foreground">
            <CalendarRange className="size-3" />
            <FileBarChart className="size-3" /> 11 report modules · mock data
          </p>
        </div>
      )}
    </Shell>
  );
}
