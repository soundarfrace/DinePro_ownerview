import { CalendarRange } from "lucide-react";
import { Segmented } from "./ui";
// type RangeKey is removed as it was only for mock data

export type DateFilterValue = "today" | "week" | "month" | "year" | "custom";

export const filterToRange: Record<DateFilterValue, "daily" | "weekly" | "monthly" | "yearly"> = {
  today: "daily",
  week: "weekly",
  month: "monthly",
  year: "yearly",
  custom: "monthly",
};

export function DateFilter({
  value,
  onChange,
  from,
  to,
  onFromChange,
  onToChange,
}: {
  value: DateFilterValue;
  onChange: (v: DateFilterValue) => void;
  from: string;
  to: string;
  onFromChange: (v: string) => void;
  onToChange: (v: string) => void;
}) {
  return (
    <div className="space-y-2">
      <Segmented
        value={value}
        onChange={onChange}
        options={[
          { value: "today", label: "Today" },
          { value: "week", label: "This Week" },
          { value: "month", label: "This Month" },
          { value: "year", label: "This Year" },
          { value: "custom", label: "Custom" },
        ]}
      />
      {value === "custom" ? (
        <div className="glass rounded-2xl p-3">
          <p className="mb-2 flex items-center gap-1.5 text-[10px] font-semibold tracking-wide text-muted-foreground uppercase">
            <CalendarRange className="size-3" /> Custom date range
          </p>
          <div className="grid grid-cols-2 gap-2">
            <label className="min-w-0 text-[10px] text-muted-foreground">
              From
              <input
                type="date"
                value={from}
                onChange={(e) => onFromChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-secondary/60 px-2.5 py-2 text-[12px] text-foreground"
              />
            </label>
            <label className="min-w-0 text-[10px] text-muted-foreground">
              To
              <input
                type="date"
                value={to}
                onChange={(e) => onToChange(e.target.value)}
                className="mt-1 w-full rounded-xl border border-input bg-secondary/60 px-2.5 py-2 text-[12px] text-foreground"
              />
            </label>
          </div>
        </div>
      ) : null}
    </div>
  );
}
