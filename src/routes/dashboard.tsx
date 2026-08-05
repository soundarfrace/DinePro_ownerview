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
import { cn } from "@/lib/utils";
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
  Drawer,
  DrawerClose,
  DrawerContent,
  DrawerDescription,
  DrawerFooter,
  DrawerHeader,
  DrawerTitle,
} from "@/components/ui/drawer";
import {
  DateFilter,
  filterToRange,
  type DateFilterValue,
} from "@/components/app/DateFilter";
import { AreaTrend, BarsChart, DonutChart, Legend, LineTrend } from "@/components/app/charts";

export const Route = createFileRoute("/dashboard")({
  head: () => ({
    meta: [
      { title: "DinePro Owner — Executive Dashboard" },
      { name: "description", content: "Executive dashboard for restaurant owners." },
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

export const currency = (n: number) =>
  "₹" + (n || 0).toLocaleString("en-IN", { maximumFractionDigits: 0 });

const exportToCSV = (filename: string, rows: Record<string, any>[]) => {
  if (!rows || !rows.length) {
    toast.error("No data to export");
    return;
  }
  const firstRow = rows[0];
  if (!firstRow) return;
  const headers = Object.keys(firstRow).join(",");
  const csvData = rows.map(row => 
    Object.values(row || {}).map(value => `"${String(value).replace(/"/g, '""')}"`).join(",")
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

function Dashboard() {
  const [loading, setLoading] = useState(true);
  const [showAllItems, setShowAllItems] = useState(false);
  const [showAllOrders, setShowAllOrders] = useState(false);
  const [orderTypeFilter, setOrderTypeFilter] = useState<string>("All");
  const [selectedInvoiceId, setSelectedInvoiceId] = useState<string | null>(null);
  const [invoiceDetails, setInvoiceDetails] = useState<any>(null);
  const [filter, setFilter] = useState<DateFilterValue>("today");

  useEffect(() => {
    if (selectedInvoiceId) {
      const fetchInvoice = async () => {
        try {
          const accountCode = localStorage.getItem("accountCode") || "C001";
          const retailCode = localStorage.getItem("retailCode") || "R001";
          const url = import.meta.env['VITE_API_URL'] || "http://localhost:5000/api";
          const res = await fetch(`${url}/billing/${selectedInvoiceId}?accountCode=${accountCode}&retailCode=${retailCode}`);
          const json = await res.json();
          if (json.success) {
            setInvoiceDetails(json.data);
          }
        } catch (err) {
          console.error(err);
        }
      };
      fetchInvoice();
    } else {
      setInvoiceDetails(null);
    }
  }, [selectedInvoiceId]);
  const [from, setFrom] = useState("2026-07-01");
  const [to, setTo] = useState("2026-08-05");
  const navigate = useNavigate();

  const [data, setData] = useState({
    kpisData: null as any,
    revenueData: [] as any[],
    recentOrdersData: [] as any[],
    topItemsData: [] as any[],
    paymentMixData: [] as any[],
  });

  useEffect(() => {
    async function fetchData() {
      setLoading(true);
      try {
        let calculatedFrom = from;
        let calculatedTo = to;
        
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
          
          const formatLocalDate = (d: Date) => {
            return [
              d.getFullYear(),
              String(d.getMonth() + 1).padStart(2, '0'),
              String(d.getDate()).padStart(2, '0')
            ].join('-');
          };
          
          calculatedFrom = formatLocalDate(fromDateObj);
          calculatedTo = formatLocalDate(toDateObj);
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
        const [kpisRes, revRes, ordersRes, itemsRes, paymentRes] = await Promise.all([
          fetch(`${baseUrl}/dashboard/kpis?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/revenue?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/recent-orders?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/top-items?${queryParams}`).then(res => res.json()),
          fetch(`${baseUrl}/dashboard/payment-mix?${queryParams}`).then(res => res.json()),
        ]);

        setData({
          kpisData: kpisRes.data || {},
          revenueData: revRes.data?.daily || [],
          recentOrdersData: ordersRes.data || [],
          topItemsData: itemsRes.data || [],
          paymentMixData: paymentRes.data || [],
        });
      } catch (e) {
        console.error(e);
        toast.error("Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    }
    fetchData();
  }, [filter, from, to]);

  const summary = {
    caption: filter === "today" ? "Net revenue today" : `Net revenue this ${filter}`,
    revenue: data.kpisData?.sales || 0,
    delta: 0,
    orders: data.kpisData?.orders || 0,
    avgTicket: (data.kpisData?.sales || 0) / (data.kpisData?.orders || 1),
  };

  const kpis = [
    { id: "sales", label: "Today's Sales", value: currency(data.kpisData?.sales || 0), delta: 0, tone: "gold", icon: "sales" },
    { id: "orders", label: "Today's Orders", value: `${data.kpisData?.orders || 0}`, delta: 0, tone: "aqua", icon: "orders" },
    { id: "tables", label: "Active Tables", value: data.kpisData?.tables || "0 / 0", delta: 0, tone: "aqua", icon: "tables" },
    { id: "pending", label: "Pending Orders", value: `${data.kpisData?.pending || 0}`, delta: 0, tone: "warn", icon: "pending" },
    { id: "revenue", label: "Revenue (MTD)", value: currency(data.kpisData?.revenue || 0), delta: 0, tone: "gold", icon: "revenue" },
    { id: "customers", label: "Customer Count", value: `${data.kpisData?.customers || 0}`, delta: 0, tone: "aqua", icon: "customers" },
  ];

  const lowStock: any[] = []; // Empty for now as no api
  const paymentMix: any[] = [];

  return (
    <>
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
              {currency(summary.avgTicket)}
            </p>
            <div className="mt-4">
              <AreaTrend data={data.revenueData} height={92} />
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
            <AreaTrend data={data.revenueData} />
          </Panel>

          {data.paymentMixData.length > 0 && (
            <Panel>
              <SectionHeader title="Payment Mix" subtitle="Revenue by payment method" />
              <div className="mt-2">
                <DonutChart data={data.paymentMixData} nameKey="paymode" valueKey="amount" />
                <Legend
                  items={data.paymentMixData.map((d) => ({
                    label: d.paymode,
                    value: currency(d.amount),
                  }))}
                />
              </div>
            </Panel>
          )}

          {data.topItemsData.length > 0 && (
            <Panel>
              <SectionHeader title="Top Selling Items" subtitle="By revenue contribution today" />
              <ul className="space-y-3">
                {data.topItemsData
                  .slice(0, showAllItems ? undefined : 10)
                  .map((item) => (
                  <li key={item.name} className="flex items-center gap-3">
                    <div className="min-w-0 flex-1">
                      <p className="truncate text-[13px] font-semibold">{item.name}</p>
                      <p className="text-[11px] text-muted-foreground">
                        {item.category} · {item.sold} sold
                      </p>
                      <div className="mt-1.5">
                        <Bar pct={(item.revenue / (data.topItemsData[0]?.revenue ?? 1)) * 100} />
                      </div>
                    </div>
                    <p className="shrink-0 text-[13px] font-bold text-primary">
                      {currency(item.revenue)}
                    </p>
                  </li>
                ))}
              </ul>
              {data.topItemsData.length > 10 && (
                <button
                  onClick={() => setShowAllItems(!showAllItems)}
                  className="mt-4 flex w-full items-center justify-center rounded-xl bg-secondary/50 py-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary"
                >
                  {showAllItems ? "Show Less" : "Show More"}
                </button>
              )}
            </Panel>
          )}

          <Panel>
            <SectionHeader title="Recent Orders" subtitle="Latest tickets" />
            
            <div className="flex items-center gap-2 overflow-x-auto pb-4 scrollbar-hide -mx-2 px-2">
              {["All", ...Array.from(new Set(data.recentOrdersData.map((o: any) => o.type).filter(Boolean)))].map(type => (
                <button
                  key={type as string}
                  onClick={() => setOrderTypeFilter(type as string)}
                  className={cn(
                    "whitespace-nowrap rounded-full px-3 py-1 text-[11px] font-semibold transition-colors",
                    orderTypeFilter === type
                      ? "bg-foreground text-background"
                      : "bg-secondary text-muted-foreground hover:bg-secondary/80"
                  )}
                >
                  {type === "All" ? "All Orders" : String(type).charAt(0).toUpperCase() + String(type).slice(1)}
                </button>
              ))}
            </div>

            <ul className="divide-y divide-border">
              {data.recentOrdersData.filter(o => orderTypeFilter === "All" || o.type === orderTypeFilter).slice(0, showAllOrders ? undefined : 5).map((o) => (
                <li key={o.id}>
                  <button 
                    onClick={() => setSelectedInvoiceId(o.id)}
                    className="w-full text-left grid grid-cols-[minmax(0,1fr)_auto] gap-3 py-2.5 hover:bg-secondary/20 transition-colors rounded-lg px-2 -mx-2"
                  >
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
                  </button>
                </li>
              ))}
              {data.recentOrdersData.filter(o => orderTypeFilter === "All" || o.type === orderTypeFilter).length === 0 && (
                <p className="text-[13px] text-muted-foreground py-2">No recent orders found.</p>
              )}
            </ul>
            {data.recentOrdersData.filter(o => orderTypeFilter === "All" || o.type === orderTypeFilter).length > 5 && (
              <button
                onClick={() => setShowAllOrders(!showAllOrders)}
                className="mt-4 flex w-full items-center justify-center rounded-xl bg-secondary/50 py-2.5 text-[12px] font-semibold text-foreground transition-colors hover:bg-secondary"
              >
                {showAllOrders ? "Show Less" : "Show More"}
              </button>
            )}
          </Panel>
          
          <Panel>
            <SectionHeader title="Quick Actions" subtitle="Executive shortcuts" />
            <div className="grid grid-cols-2 gap-2.5">
              {[
                { label: "Download Sales", icon: Download, action: () => exportToCSV(`sales_${filter}.csv`, data.revenueData) },
                { label: "Export Data", icon: FileSpreadsheet, action: () => exportToCSV(`orders_${filter}.csv`, data.recentOrdersData) },
              ].map(({ label, icon: Icon, action }) => (
                <button
                  key={label}
                  onClick={() => {
                    if (action) {
                      action();
                      toast.success(`Exporting ${label}...`);
                    }
                  }}
                  className="flex flex-col items-center justify-center gap-2 rounded-xl border border-border bg-secondary/40 py-4 transition-colors active:bg-secondary"
                >
                  <Icon className="size-5 text-muted-foreground" />
                  <span className="text-[11px] font-medium">{label}</span>
                </button>
              ))}
            </div>
          </Panel>

        </div>
      )}
    </Shell>
      <Drawer open={!!selectedInvoiceId} onOpenChange={(open) => !open && setSelectedInvoiceId(null)}>
        <DrawerContent className="max-h-[85vh]">
          <DrawerHeader className="text-left">
            <DrawerTitle>Invoice {selectedInvoiceId}</DrawerTitle>
            <DrawerDescription>Order Details</DrawerDescription>
          </DrawerHeader>
          <div className="px-4 overflow-y-auto">
            {invoiceDetails ? (
              <div className="space-y-4 pb-4">
                <div className="flex justify-between text-[13px] text-muted-foreground uppercase">
                  <span>Table: {invoiceDetails.tableId || "Takeaway"}</span>
                  <span>Status: {invoiceDetails.status}</span>
                </div>
                <div className="space-y-2">
                  <h4 className="text-[14px] font-semibold">Items</h4>
                  <ul className="divide-y divide-border">
                    {invoiceDetails.items.map((item: any) => (
                      <li key={item.id} className="py-2.5 flex justify-between text-[13px]">
                        <div>
                          <p className="font-medium">{item.name}</p>
                          <p className="text-[11px] text-muted-foreground">{item.quantity} x {currency(item.price)}</p>
                        </div>
                        <p className="font-semibold">{currency(item.amount)}</p>
                      </li>
                    ))}
                  </ul>
                </div>
                <div className="flex justify-between text-[15px] font-bold pt-3 border-t border-border">
                  <span>Total</span>
                  <span className="text-primary">{currency(invoiceDetails.grandTotal)}</span>
                </div>
                {invoiceDetails.paymentSplits?.length > 0 && (
                  <div className="space-y-1 pt-3 border-t border-border">
                    <h4 className="text-[12px] font-semibold text-muted-foreground uppercase">Payment Method</h4>
                    {invoiceDetails.paymentSplits.map((split: any, idx: number) => (
                      <div key={idx} className="flex justify-between text-[13px] font-medium">
                        <span>{split.paymentMode}</span>
                        <span>{currency(split.amount)}</span>
                      </div>
                    ))}
                  </div>
                )}
              </div>
            ) : (
              <div className="py-12 text-center text-[13px] text-muted-foreground">Loading details...</div>
            )}
          </div>
          <DrawerFooter className="pt-2">
            <DrawerClose asChild>
              <button className="press rounded-xl bg-secondary py-3 text-[13px] font-bold text-foreground">Close</button>
            </DrawerClose>
          </DrawerFooter>
        </DrawerContent>
      </Drawer>
    </>
  );
}
