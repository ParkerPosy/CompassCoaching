import * as React from "react";
import * as Popover from "@radix-ui/react-popover";
import { ChevronLeft, ChevronRight, Calendar } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Helpers ────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function toKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

function parseDate(value: string): { year: number; month: number; day: number } | null {
  const parts = value.split("-").map(Number);
  if (parts.length !== 3 || parts.some(isNaN)) return null;
  return { year: parts[0], month: parts[1] - 1, day: parts[2] };
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_HEADERS = ["Su", "Mo", "Tu", "We", "Th", "Fr", "Sa"];

// ── Component ──────────────────────────────────────────────

export interface DatePickerProps {
  /** ISO date string (YYYY-MM-DD) */
  value: string;
  /** Called with ISO date string */
  onChange: (value: string) => void;
  /** Minimum selectable date (YYYY-MM-DD) */
  min?: string;
  /** Placeholder text */
  placeholder?: string;
  /** Required attribute */
  required?: boolean;
  /** id for label association */
  id?: string;
  /** Additional class names for trigger */
  className?: string;
}

export function DatePicker({
  value,
  onChange,
  min,
  placeholder = "Select date",
  required,
  id,
  className,
}: DatePickerProps) {
  const [open, setOpen] = React.useState(false);

  // Calendar navigation state — initialise from value or today
  const parsed = value ? parseDate(value) : null;
  const now = new Date();
  const [viewMonth, setViewMonth] = React.useState(parsed?.month ?? now.getMonth());
  const [viewYear, setViewYear] = React.useState(parsed?.year ?? now.getFullYear());

  // Sync view when value changes from outside
  React.useEffect(() => {
    const p = value ? parseDate(value) : null;
    if (p) {
      setViewMonth(p.month);
      setViewYear(p.year);
    }
  }, [value]);

  const daysInMonth = getDaysInMonth(viewYear, viewMonth);
  const firstDay = getFirstDayOfWeek(viewYear, viewMonth);

  const prevMonth = () => {
    if (viewMonth === 0) {
      setViewMonth(11);
      setViewYear((y) => y - 1);
    } else {
      setViewMonth((m) => m - 1);
    }
  };

  const nextMonth = () => {
    if (viewMonth === 11) {
      setViewMonth(0);
      setViewYear((y) => y + 1);
    } else {
      setViewMonth((m) => m + 1);
    }
  };

  const selectDay = (day: number) => {
    const key = toKey(viewYear, viewMonth, day);
    onChange(key);
    setOpen(false);
  };

  const isDisabled = (day: number) => {
    if (!min) return false;
    const key = toKey(viewYear, viewMonth, day);
    return key < min;
  };

  const todayKey = toKey(now.getFullYear(), now.getMonth(), now.getDate());

  // Format display value
  const displayValue = React.useMemo(() => {
    if (!value) return null;
    const p = parseDate(value);
    if (!p) return value;
    const d = new Date(p.year, p.month, p.day);
    return d.toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  }, [value]);

  return (
    <Popover.Root open={open} onOpenChange={setOpen}>
      <Popover.Trigger asChild>
        <button
          type="button"
          id={id}
          className={cn(
            "flex h-12.5 w-full items-center gap-2 px-4 border-2 border-stone-200 rounded-lg bg-white text-base leading-normal transition-colors",
            "hover:border-stone-300 focus:border-lime-400 focus:outline-none focus:ring-2 focus:ring-lime-400/20",
            !value && "text-stone-400",
            className,
          )}
          aria-required={required}
        >
          <Calendar className="w-5 h-5 text-stone-400 shrink-0" />
          <span className="flex-1 text-left truncate">{displayValue ?? placeholder}</span>
        </button>
      </Popover.Trigger>

      <Popover.Portal>
        <Popover.Content
          sideOffset={6}
          align="start"
          className="z-50 w-72 rounded-xl border-2 border-stone-200 bg-white p-3 shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
        >
          {/* Month Nav */}
          <div className="flex items-center justify-between mb-2">
            <button
              type="button"
              onClick={prevMonth}
              className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
              aria-label="Previous month"
            >
              <ChevronLeft size={16} />
            </button>
            <span className="text-sm font-semibold text-stone-700">
              {MONTH_NAMES[viewMonth]} {viewYear}
            </span>
            <button
              type="button"
              onClick={nextMonth}
              className="p-1.5 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
              aria-label="Next month"
            >
              <ChevronRight size={16} />
            </button>
          </div>

          {/* Day headers */}
          <div className="grid grid-cols-7 mb-1">
            {DAY_HEADERS.map((d) => (
              <div key={d} className="text-center text-[11px] font-medium text-stone-400 py-1">
                {d}
              </div>
            ))}
          </div>

          {/* Day grid */}
          <div className="grid grid-cols-7">
            {/* Empty cells */}
            {Array.from({ length: firstDay }, (_, i) => (
              <div key={`e-${i}`} className="h-8" />
            ))}

            {/* Days */}
            {Array.from({ length: daysInMonth }, (_, i) => {
              const day = i + 1;
              const key = toKey(viewYear, viewMonth, day);
              const isSelected = key === value;
              const isToday = key === todayKey;
              const disabled = isDisabled(day);

              return (
                <button
                  type="button"
                  key={key}
                  onClick={() => !disabled && selectDay(day)}
                  disabled={disabled}
                  className={cn(
                    "h-8 w-full rounded-md text-sm font-medium transition-colors",
                    isSelected
                      ? "bg-lime-600 text-white hover:bg-lime-700"
                      : isToday
                        ? "bg-lime-50 text-lime-700 hover:bg-lime-100"
                        : "text-stone-700 hover:bg-stone-100",
                    disabled && "opacity-30 cursor-not-allowed hover:bg-transparent",
                  )}
                >
                  {day}
                </button>
              );
            })}
          </div>

          {/* Quick "Today" button */}
          <div className="mt-2 pt-2 border-t border-stone-100">
            <button
              type="button"
              onClick={() => {
                onChange(todayKey);
                setOpen(false);
              }}
              className="w-full text-xs text-center text-lime-600 hover:text-lime-700 font-medium py-1 rounded hover:bg-lime-50 transition-colors"
            >
              Today
            </button>
          </div>

          <Popover.Arrow className="fill-white" />
        </Popover.Content>
      </Popover.Portal>
    </Popover.Root>
  );
}
