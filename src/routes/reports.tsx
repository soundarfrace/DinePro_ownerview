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

export const Route = createFileRoute("/reports")({
  head: () => ({
    meta: [
      { title: "Reports & Analytics — DinePro Owner" },
      { name: "description", content: "Analytics for restaurant owners." },
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

export const currency = (n: number) =>
  "₹" + (n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) {
    toast.error("No data to export");
    return;
  }
  const headers = Object.keys(rows[0]!).join(",");
  const csvData = rows.map(row => 
    Object.values(row).map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
  ).join("\n");
  
  const blob = new Blob([headers + "\n" + csvData], { type: "text/csv;charset=utf-8;" });
  const link = document.createElement("a");
  const url = URL.createObjectURL(blob);
  link.setAttribute("href", url);
  link.setAttribute("download", filename);
  link.style.visibility = "hidden";
  document.body.appendChild(link);
  link.click();
  document.body.removeChild(link);
};

function Reports() {
  const [loading, setLoading] = useState(true);
  const [filter, setFilter] = useState<Filter>("month");
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-08-05");
  const [compareMode, setCompareMode] = useState(false);
  
  const [data, setData] = useState({
    revenueData: [] as any[],
    kpisData: null as any,
    prevRevenueData: [] as any[],
    prevKpisData: null as any,
    categoryMixData: [] as any[],
    hourlyEfficiencyData: [] as any[],
    orderTypeMixData: [] as any[],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let calculatedFrom = from;
        let calculatedTo = to;
        
        const formatLocalDate = (d: Date) => {
          return [
            d.getFullYear(),
            String(d.getMonth() + 1).padStart(2, '0'),
            String(d.getDate()).padStart(2, '0')
          ].join('-');
        };

        if (filter !== "custom") {
          const now = new Date();
          const toDateObj = new Date(now);
          const fromDateObj = new Date(now);
          
          if (filter === "today") {
            // fromDateObj is already today
          } else if (filter === "week") {
            fromDateObj.setDate(now.getDate() - now.getDay()); // start of week
          } else if (filter === "month") {
            fromDateObj.setDate(1); // start of month
          } else if (filter === "year") {
            fromDateObj.setMonth(0, 1); // start of year
          }
          
          calculatedFrom = formatLocalDate(fromDateObj);
          calculatedTo = formatLocalDate(toDateObj);
        }

        const diffTime = Math.abs(new Date(calculatedTo).getTime() - new Date(calculatedFrom).getTime());
        const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24)) + 1; // +1 because inclusive

        let prevCalculatedFrom = "";
        let prevCalculatedTo = "";
        
        if (compareMode) {
            const prevToObj = new Date(calculatedFrom);
            prevToObj.setDate(prevToObj.getDate() - 1);
            const prevFromObj = new Date(prevToObj);
            prevFromObj.setDate(prevFromObj.getDate() - diffDays + 1);
            prevCalculatedFrom = formatLocalDate(prevFromObj);
            prevCalculatedTo = formatLocalDate(prevToObj);
        }

        let accountCode = localStorage.getItem("accountCode") || "";
        let retailCode = localStorage.getItem("retailCode") || "";

        if (!accountCode || !retailCode) {
          try {
            const userStr = localStorage.getItem("user");
            if (userStr) {
              const user = JSON.parse(userStr);
              accountCode = accountCode || user.accountCode || "";
              retailCode = retailCode || user.retailCode || "";
            }
          } catch(e) {}
        }

        const queryParams = new URLSearchParams({ 
          fromDate: calculatedFrom, 
          toDate: calculatedTo,
          accountCode,
          retailCode
        }).toString();

        const baseUrl = import.meta.env['VITE_API_URL'] || "http://localhost:5000/api";
        const promises = [
          fetch(`${baseUrl}/dashboard/kpis?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/revenue?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/category-mix?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/hourly-efficiency?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/order-type-mix?${queryParams}`).then(res => res.json())
        ];

        if (compareMode) {
          const prevQueryParams = new URLSearchParams({
            fromDate: prevCalculatedFrom,
            toDate: prevCalculatedTo,
            accountCode,
            retailCode
          }).toString();
          promises.push(
            fetch(`${baseUrl}/dashboard/kpis?${prevQueryParams}`).then(res => res.json()),
            fetch(`${baseUrl}/dashboard/revenue?${prevQueryParams}`).then(res => res.json())
          );
        }

        const [kpisRes, revRes, catMixRes, hourlyEffRes, orderTypeMixRes, prevKpisRes, prevRevRes] = await Promise.all(promises);
        
        setData({
          kpisData: kpisRes.data || {},
          revenueData: revRes.data?.daily || [],
          prevKpisData: prevKpisRes?.data || null,
          prevRevenueData: prevRevRes?.data?.daily || [],
          categoryMixData: catMixRes?.data || [],
          hourlyEfficiencyData: hourlyEffRes?.data || [],
          orderTypeMixData: orderTypeMixRes?.data || [],
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to load reports data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filter, from, to, compareMode]);

  let series = data.revenueData;
  if (compareMode && data.prevRevenueData) {
    series = series.map((item, index) => {
      return {
        ...item,
        revenue_prev: data.prevRevenueData[index]?.revenue || 0,
      };
    });
  }

  let delta = 0;
  if (compareMode && data.prevKpisData) {
    const currentSales = data.kpisData?.sales || 0;
    const prevSales = data.prevKpisData?.sales || 0;
    if (prevSales > 0) {
      delta = ((currentSales - prevSales) / prevSales) * 100;
    } else if (currentSales > 0) {
      delta = 100;
    }
  }

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
                value={from}
                onChange={(e) => setFrom(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-secondary/60 px-2.5 py-2 text-[12px] text-foreground"
              />
            </label>
            <label className="min-w-0 text-[10px] text-muted-foreground">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => setTo(e.target.value)}
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
              action={compareMode && data.prevKpisData ? <Delta value={Number(delta.toFixed(1))} /> : null}
            />
            <div className="mb-3 grid grid-cols-3 gap-2 text-center">
              {[
                { l: "Gross Sales", v: currency(data.kpisData?.sales || 0) },
                { l: "Total Orders", v: (data.kpisData?.orders || 0).toString() },
                { l: "Avg Ticket", v: currency((data.kpisData?.sales || 0) / (data.kpisData?.orders || 1)) },
              ].map((m) => (
                <div key={m.l} className="rounded-xl border border-border bg-secondary/40 py-2.5">
                  <p className="font-display text-[15px] font-bold">{m.v}</p>
                  <p className="text-[10px] text-muted-foreground">{m.l}</p>
                </div>
              ))}
            </div>
            <BarsChart 
              data={series} 
              keys={[
                { key: "revenue", color: "var(--chart-1)" },
                ...(compareMode ? [{ key: "revenue_prev", color: "var(--chart-4)" }] : [])
              ]} 
            />
          </Panel>

          <Panel>
            <SectionHeader title="Revenue Report" subtitle="Trend and momentum" />
            {compareMode ? (
              <LineTrend 
                data={series}
                keys={[
                  { key: "revenue", color: "var(--chart-1)" },
                  { key: "revenue_prev", color: "var(--chart-4)" }
                ]}
              />
            ) : (
              <AreaTrend data={series} />
            )}
          </Panel>

          {data.categoryMixData.length > 0 && (
            <Panel>
              <SectionHeader title="Category Mix" subtitle="Revenue by menu category" />
              <div className="mt-2">
                <DonutChart data={data.categoryMixData} nameKey="category" valueKey="revenue" />
                <Legend
                  items={data.categoryMixData.map((d: any) => ({
                    label: d.category,
                    value: currency(d.revenue),
                  }))}
                />
              </div>
            </Panel>
          )}

          {data.orderTypeMixData?.length > 0 && (
            <Panel>
              <SectionHeader title="Order Types" subtitle="Revenue by order type" />
              <div className="mt-2">
                <DonutChart data={data.orderTypeMixData} nameKey="orderType" valueKey="revenue" />
                <Legend
                  items={data.orderTypeMixData.map((d: any) => ({
                    label: d.orderType,
                    value: currency(d.revenue),
                  }))}
                />
              </div>
            </Panel>
          )}

          {data.hourlyEfficiencyData.length > 0 && (
            <Panel>
              <SectionHeader title="Peak Hours & Efficiency" subtitle="Order volume by hour of day" />
              <BarsChart 
                data={data.hourlyEfficiencyData} 
                keys={[{ key: "orders", color: "var(--chart-3)" }]} 
              />
            </Panel>
          )}

          <div className="grid grid-cols-2 gap-2.5">
            <button
              onClick={() => {
                exportToCSV(`full_report_${filter}.csv`, series);
                toast.success("Full report exported", { description: "CSV · Revenue data" });
              }}
              className="press bg-gradient-gold flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-bold text-primary-foreground"
            >
              <Download className="size-4" /> Export All
            </button>
            <button
              onClick={() => setCompareMode(!compareMode)}
              className={`press flex items-center justify-center gap-2 rounded-2xl px-3 py-3 text-[12px] font-bold ${compareMode ? 'bg-secondary text-foreground' : 'glass text-accent'}`}
            >
              <BarChart3 className="size-4" /> {compareMode ? "Stop Comparing" : "Compare"}
            </button>
          </div>
        </div>
      )}
    </Shell>
  );
}
