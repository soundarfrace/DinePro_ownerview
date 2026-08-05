import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Cell,
  Line,
  LineChart,
  Pie,
  PieChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis,
} from "recharts";

const compact = (v: number) => {
  const abs = Math.abs(v);
  if (abs >= 1e7) return `${(v / 1e7).toFixed(1)}Cr`;
  if (abs >= 1e5) return `${(v / 1e5).toFixed(1)}L`;
  if (abs >= 1000) return `${(v / 1000).toFixed(v % 1000 === 0 ? 0 : 1)}k`;
  return `${v}`;
};

const axis = {
  stroke: "var(--muted-foreground)",
  fontSize: 10,
  tickLine: false,
  axisLine: false,
};

const tooltipStyle = {
  contentStyle: {
    background: "var(--card)",
    border: "1px solid var(--border)",
    borderRadius: 14,
    fontSize: 11,
    color: "var(--foreground)",
    boxShadow: "var(--shadow-elevated)",
  },
  labelStyle: { color: "var(--muted-foreground)", fontSize: 10 },
};

export const chartColors = [
  "var(--chart-1)",
  "var(--chart-2)",
  "var(--chart-3)",
  "var(--chart-4)",
  "var(--chart-5)",
];

type Row = Record<string, string | number>;

export function AreaTrend({
  data,
  dataKey = "revenue",
  height = 190,
  color = "var(--chart-1)",
}: {
  data: readonly Row[];
  dataKey?: string;
  height?: number;
  color?: string;
}) {
  const id = `grad-${dataKey}-${color.replace(/\W/g, "")}`;
  return (
    <ResponsiveContainer width="100%" height={height}>
      <AreaChart data={data as Row[]} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
        <defs>
          <linearGradient id={id} x1="0" y1="0" x2="0" y2="1">
            <stop offset="0%" stopColor={color} stopOpacity={0.45} />
            <stop offset="100%" stopColor={color} stopOpacity={0.02} />
          </linearGradient>
        </defs>
        <CartesianGrid strokeDasharray="3 5" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={38} tickFormatter={compact} />
        <Tooltip {...tooltipStyle} />
        <Area
          type="monotone"
          dataKey={dataKey}
          stroke={color}
          strokeWidth={2.4}
          fill={`url(#${id})`}
          dot={false}
          activeDot={{ r: 4, strokeWidth: 0 }}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
}

export function LineTrend({
  data,
  keys,
  height = 190,
}: {
  data: readonly Row[];
  keys: { key: string; color: string }[];
  height?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <LineChart data={data as Row[]} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 5" stroke="var(--border)" vertical={false} />
        <XAxis dataKey="label" {...axis} />
        <YAxis {...axis} width={38} tickFormatter={compact} />
        <Tooltip {...tooltipStyle} />
        {keys.map((k) => (
          <Line
            key={k.key}
            type="monotone"
            dataKey={k.key}
            stroke={k.color}
            strokeWidth={2.2}
            dot={false}
            activeDot={{ r: 4, strokeWidth: 0 }}
          />
        ))}
      </LineChart>
    </ResponsiveContainer>
  );
}

export function BarsChart({
  data,
  keys,
  xKey = "label",
  height = 190,
  stacked = false,
}: {
  data: readonly Row[];
  keys: { key: string; color: string }[];
  xKey?: string;
  height?: number;
  stacked?: boolean;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <BarChart data={data as Row[]} margin={{ top: 6, right: 4, left: -14, bottom: 0 }}>
        <CartesianGrid strokeDasharray="3 5" stroke="var(--border)" vertical={false} />
        <XAxis dataKey={xKey} {...axis} />
        <YAxis {...axis} width={38} tickFormatter={compact} />
        <Tooltip {...tooltipStyle} cursor={{ fill: "var(--secondary)", opacity: 0.4 }} />
        {keys.map((k) => (
          <Bar
            key={k.key}
            dataKey={k.key}
            {...(stacked ? { stackId: "a" } : {})}
            fill={k.color}
            radius={[6, 6, 2, 2]}
            maxBarSize={26}
          />
        ))}
      </BarChart>
    </ResponsiveContainer>
  );
}

export function DonutChart({
  data,
  nameKey,
  valueKey = "value",
  height = 190,
  inner = 52,
}: {
  data: readonly Row[];
  nameKey: string;
  valueKey?: string;
  height?: number;
  inner?: number;
}) {
  return (
    <ResponsiveContainer width="100%" height={height}>
      <PieChart>
        <Tooltip {...tooltipStyle} />
        <Pie
          data={data as Row[]}
          dataKey={valueKey}
          nameKey={nameKey}
          innerRadius={inner}
          outerRadius={78}
          paddingAngle={3}
          stroke="var(--card)"
          strokeWidth={2}
        >
          {data.map((_, i) => (
            <Cell key={i} fill={chartColors[i % chartColors.length]} />
          ))}
        </Pie>
      </PieChart>
    </ResponsiveContainer>
  );
}

export function Legend({
  items,
}: {
  items: { label: string; value: string; color?: string }[];
}) {
  return (
    <ul className="mt-3 grid grid-cols-2 gap-y-2 gap-x-3">
      {items.map((it, i) => (
        <li key={it.label} className="flex min-w-0 items-center gap-2">
          <span
            className="size-2 shrink-0 rounded-full"
            style={{ background: it.color ?? chartColors[i % chartColors.length] }}
          />
          <span className="min-w-0 flex-1 truncate text-[11px] text-muted-foreground">
            {it.label}
          </span>
          <span className="shrink-0 text-[11px] font-semibold">{it.value}</span>
        </li>
      ))}
    </ul>
  );
}
