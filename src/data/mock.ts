import burger from "@/assets/dish-burger.jpg";
import pizza from "@/assets/dish-pizza.jpg";
import curry from "@/assets/dish-curry.jpg";
import sushi from "@/assets/dish-sushi.jpg";
import dessert from "@/assets/dish-dessert.jpg";

export const currency = (n: number) =>
  "₹" + n.toLocaleString("en-IN", { maximumFractionDigits: 0 });

/** Compact Indian numbering: ₹1.2 Cr / ₹4.8 L / ₹92.4k */
export const inrShort = (n: number) => {
  const abs = Math.abs(n);
  if (abs >= 1e7) return `₹${(n / 1e7).toFixed(2)} Cr`;
  if (abs >= 1e5) return `₹${(n / 1e5).toFixed(1)} L`;
  if (abs >= 1e3) return `₹${(n / 1e3).toFixed(1)}k`;
  return currency(n);
};

export const restaurant = {
  name: "DinePro — Lumière Group",
  branch: "Downtown Flagship",
  branches: [
    { id: "b1", name: "Downtown Flagship", city: "Mumbai", tables: 48, status: "Open" },
    { id: "b2", name: "Riverside Bistro", city: "Pune", tables: 32, status: "Open" },
    { id: "b3", name: "Uptown Lounge", city: "Bengaluru", tables: 26, status: "Closing soon" },
    { id: "b4", name: "Harbor Terrace", city: "Goa", tables: 40, status: "Open" },
  ],
  owner: { name: "Aarav Mehta", role: "Group Owner", email: "aarav@lumieregroup.com" },
};

export const kpis = [
  { id: "sales", label: "Today's Sales", value: "₹14,73,600", delta: 12.4, tone: "gold", icon: "sales" },
  { id: "orders", label: "Today's Orders", value: "342", delta: 8.1, tone: "aqua", icon: "orders" },
  { id: "tables", label: "Active Tables", value: "27 / 48", delta: 4.6, tone: "aqua", icon: "tables" },
  { id: "pending", label: "Pending Orders", value: "14", delta: -3.2, tone: "warn", icon: "pending" },
  { id: "revenue", label: "Revenue (MTD)", value: "₹3.30 Cr", delta: 18.9, tone: "gold", icon: "revenue" },
  { id: "profit", label: "Profit (MTD)", value: "₹77.1 L", delta: 6.7, tone: "success", icon: "profit" },
  { id: "customers", label: "Customer Count", value: "1,284", delta: 9.3, tone: "aqua", icon: "customers" },
  { id: "membership", label: "Membership Sales", value: "₹19.3 L", delta: 22.5, tone: "gold", icon: "membership" },
] as const;

export const revenueSeries = {
  daily: [
    { label: "9a", revenue: 65600, orders: 14, customers: 12 },
    { label: "11a", revenue: 131200, orders: 28, customers: 24 },
    { label: "1p", revenue: 318400, orders: 62, customers: 55 },
    { label: "3p", revenue: 192800, orders: 38, customers: 31 },
    { label: "5p", revenue: 238400, orders: 44, customers: 40 },
    { label: "7p", revenue: 385600, orders: 82, customers: 76 },
    { label: "9p", revenue: 296800, orders: 58, customers: 51 },
    { label: "11p", revenue: 116800, orders: 22, customers: 18 },
  ],
  weekly: [
    { label: "Mon", revenue: 992000, orders: 210, customers: 180 },
    { label: "Tue", revenue: 1129600, orders: 246, customers: 203 },
    { label: "Wed", revenue: 1278400, orders: 268, customers: 221 },
    { label: "Thu", revenue: 1379200, orders: 294, customers: 250 },
    { label: "Fri", revenue: 1814400, orders: 388, customers: 331 },
    { label: "Sat", revenue: 2155200, orders: 442, customers: 402 },
    { label: "Sun", revenue: 1716800, orders: 356, customers: 318 },
  ],
  monthly: [
    { label: "W1", revenue: 7392000, orders: 1580, customers: 1320 },
    { label: "W2", revenue: 8336000, orders: 1712, customers: 1448 },
    { label: "W3", revenue: 7888000, orders: 1644, customers: 1390 },
    { label: "W4", revenue: 9416000, orders: 1886, customers: 1602 },
  ],
  yearly: [
    { label: "Jan", revenue: 25440000, orders: 5210, customers: 4380 },
    { label: "Feb", revenue: 23712000, orders: 4980, customers: 4120 },
    { label: "Mar", revenue: 27296000, orders: 5620, customers: 4710 },
    { label: "Apr", revenue: 28712000, orders: 5880, customers: 4960 },
    { label: "May", revenue: 30352000, orders: 6140, customers: 5210 },
    { label: "Jun", revenue: 32144000, orders: 6480, customers: 5480 },
    { label: "Jul", revenue: 34288000, orders: 6820, customers: 5790 },
    { label: "Aug", revenue: 33032000, orders: 6610, customers: 5620 },
    { label: "Sep", revenue: 31696000, orders: 6390, customers: 5410 },
    { label: "Oct", revenue: 34520000, orders: 6910, customers: 5860 },
    { label: "Nov", revenue: 36664000, orders: 7240, customers: 6120 },
    { label: "Dec", revenue: 41016000, orders: 8010, customers: 6840 },
  ],
} as const;

export type RangeKey = keyof typeof revenueSeries;

/** Headline figures per selected period, used by the dashboard hero card. */
export const rangeSummary: Record<
  RangeKey,
  { caption: string; revenue: number; delta: number; orders: number; avgTicket: number }
> = {
  daily: {
    caption: "Net revenue today",
    revenue: 1473600,
    delta: 12.4,
    orders: 342,
    avgTicket: 4309,
  },
  weekly: {
    caption: "Net revenue this week",
    revenue: 10465600,
    delta: 9.8,
    orders: 2416,
    avgTicket: 4332,
  },
  monthly: {
    caption: "Net revenue this month",
    revenue: 33032000,
    delta: 18.9,
    orders: 6822,
    avgTicket: 4842,
  },
  yearly: {
    caption: "Net revenue this year",
    revenue: 378872000,
    delta: 22.1,
    orders: 78010,
    avgTicket: 4857,
  },
};

export const tableStatus = [
  { label: "Available", count: 15, tone: "success" },
  { label: "Occupied", count: 21, tone: "gold" },
  { label: "Reserved", count: 8, tone: "info" },
  { label: "Waiting", count: 4, tone: "warn" },
] as const;

export const topItems = [
  { name: "Truffle Wagyu Burger", category: "Signature", sold: 184, revenue: 662400, image: burger },
  { name: "Wood-Fired Margherita", category: "Pizza", sold: 162, revenue: 453600, image: pizza },
  { name: "Butter Chicken Royale", category: "Mains", sold: 148, revenue: 414400, image: curry },
  { name: "Salmon Nigiri Platter", category: "Sushi", sold: 121, revenue: 484000, image: sushi },
  { name: "Gold Leaf Lava Cake", category: "Dessert", sold: 109, revenue: 218000, image: dessert },
];

export const recentOrders = [
  { id: "#DP-10482", table: "T-12", type: "Dine In", amount: 21472, status: "Completed", payment: "Card" },
  { id: "#DP-10481", table: "Takeaway", type: "Takeaway", amount: 6736, status: "Preparing", payment: "UPI" },
  { id: "#DP-10480", table: "T-04", type: "Dine In", amount: 33032, status: "Served", payment: "Cash" },
  { id: "#DP-10479", table: "Delivery", type: "Delivery", amount: 10360, status: "Pending", payment: "Wallet" },
  { id: "#DP-10478", table: "T-21", type: "Dine In", amount: 28480, status: "Completed", payment: "Card" },
  { id: "#DP-10477", table: "T-08", type: "Dine In", amount: 15900, status: "Cancelled", payment: "Card" },
];

export const lowStock = [
  { name: "Wagyu Beef Patty", left: 6, unit: "kg", threshold: 20, severity: "critical" },
  { name: "Truffle Oil", left: 2, unit: "btl", threshold: 8, severity: "critical" },
  { name: "Buffalo Mozzarella", left: 9, unit: "kg", threshold: 18, severity: "low" },
  { name: "Sushi Grade Salmon", left: 11, unit: "kg", threshold: 25, severity: "low" },
  { name: "Basmati Rice", left: 24, unit: "kg", threshold: 40, severity: "watch" },
];

export const membership = {
  active: 1842,
  newThisMonth: 164,
  churn: 2.4,
  revenue: 1934400,
  tiers: [
    { tier: "Platinum", members: 214, value: 785600 },
    { tier: "Gold", members: 486, value: 651200 },
    { tier: "Silver", members: 712, value: 350400 },
    { tier: "Classic", members: 430, value: 147200 },
  ],
};

export const employees = [
  { name: "Sofia Ramirez", role: "Head Server", score: 96, sales: 1473600, orders: 214 },
  { name: "Daniel Kim", role: "Sommelier", score: 92, sales: 1254400, orders: 142 },
  { name: "Priya Nair", role: "Server", score: 88, sales: 1035200, orders: 186 },
  { name: "Marcus Cole", role: "Server", score: 81, sales: 833600, orders: 168 },
  { name: "Elena Petrova", role: "Host", score: 76, sales: 628800, orders: 121 },
];

export const paymentMix = [
  { method: "Card", value: 48, amount: 707360 },
  { method: "UPI / Wallet", value: 26, amount: 383120 },
  { method: "Cash", value: 17, amount: 250480 },
  { method: "Membership Credit", value: 9, amount: 132640 },
];

export const orderTypes = [
  { type: "Dine In", value: 58, orders: 198 },
  { type: "Takeaway", value: 22, orders: 75 },
  { type: "Delivery", value: 14, orders: 48 },
  { type: "Catering", value: 6, orders: 21 },
];

export const insights = [
  {
    title: "Peak hour opportunity",
    body: "7–9 PM drives 31% of daily revenue. Adding two servers on Fri–Sat could lift covers by ~11%.",
    tag: "Peak Hours",
    tone: "gold",
  },
  {
    title: "Inventory risk detected",
    body: "Truffle oil and wagyu patties fall below threshold in 2 days at current burn rate. Reorder now.",
    tag: "Inventory",
    tone: "warn",
  },
  {
    title: "Membership upsell window",
    body: "164 new members this month with 22.5% growth. Gold tier converts best on bills above ₹15,000.",
    tag: "Growth",
    tone: "success",
  },
  {
    title: "Margin watch",
    body: "Beverage cost ratio rose 2.8pts vs last month. Review supplier pricing on premium spirits.",
    tag: "Profitability",
    tone: "info",
  },
];

export const expenses = [
  { name: "Food Cost", value: 10272000 },
  { name: "Payroll", value: 7696000 },
  { name: "Rent", value: 3360000 },
  { name: "Utilities", value: 1488000 },
  { name: "Marketing", value: 1136000 },
  { name: "Maintenance", value: 784000 },
];

export const profitLoss = [
  { label: "Jun", revenue: 32144000, expense: 24992000, profit: 7152000 },
  { label: "Jul", revenue: 34288000, expense: 26248000, profit: 8040000 },
  { label: "Aug", revenue: 33032000, expense: 25324800, profit: 7707200 },
  { label: "Sep", revenue: 31696000, expense: 24784000, profit: 6912000 },
  { label: "Oct", revenue: 34520000, expense: 25832000, profit: 8688000 },
  { label: "Nov", revenue: 36664000, expense: 27296000, profit: 9368000 },
];

export const customerAnalytics = [
  { label: "Jun", newCust: 1240, returning: 4240 },
  { label: "Jul", newCust: 1380, returning: 4410 },
  { label: "Aug", newCust: 1284, returning: 4336 },
  { label: "Sep", newCust: 1190, returning: 4220 },
  { label: "Oct", newCust: 1420, returning: 4440 },
  { label: "Nov", newCust: 1560, returning: 4560 },
];

export const inventoryReport = [
  { category: "Meat & Poultry", value: 3424000, turns: 5.2 },
  { category: "Seafood", value: 2288000, turns: 6.1 },
  { category: "Produce", value: 1472000, turns: 8.4 },
  { category: "Dairy", value: 976000, turns: 4.8 },
  { category: "Beverages", value: 2728000, turns: 3.2 },
];

export const taxReport = [
  { name: "GST (Goods)", collected: 3303200, rate: "5%" },
  { name: "GST (Services)", collected: 990400, rate: "18%" },
  { name: "Liquor Levy", collected: 691200, rate: "6%" },
  { name: "Municipal Cess", collected: 171200, rate: "0.5%" },
];

export const subscription = {
  plan: "DinePro Enterprise",
  seats: 48,
  branches: 4,
  renews: "Mar 14, 2027",
  amount: "₹74,999 / mo",
};
