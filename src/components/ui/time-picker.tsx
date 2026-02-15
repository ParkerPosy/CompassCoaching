import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "./select";
import { Clock } from "lucide-react";
import { cn } from "@/lib/utils";

// ── Generate time slots ─────────────────────────────────────

function generateTimeSlots(intervalMinutes: number = 15): { value: string; label: string }[] {
  const slots: { value: string; label: string }[] = [];
  for (let h = 6; h <= 22; h++) {
    for (let m = 0; m < 60; m += intervalMinutes) {
      const value = `${String(h).padStart(2, "0")}:${String(m).padStart(2, "0")}`;
      const period = h >= 12 ? "PM" : "AM";
      const displayH = h % 12 || 12;
      const label = m === 0
        ? `${displayH}:00 ${period}`
        : `${displayH}:${String(m).padStart(2, "0")} ${period}`;
      slots.push({ value, label });
    }
  }
  // Add 11:00 PM slot
  slots.push({ value: "23:00", label: "11:00 PM" });
  return slots;
}

const TIME_SLOTS = generateTimeSlots(15);

// ── Component ──────────────────────────────────────────────

export interface TimePickerProps {
  /** Time in HH:MM (24h) format */
  value: string;
  /** Called with HH:MM string or "" if cleared */
  onChange: (value: string) => void;
  /** Placeholder text */
  placeholder?: string;
  /** id for label association */
  id?: string;
  /** Additional class names */
  className?: string;
}

export function TimePicker({
  value,
  onChange,
  placeholder = "Select time",
  id,
  className,
}: TimePickerProps) {
  return (
    <Select value={value || "__none__"} onValueChange={(v) => onChange(v === "__none__" ? "" : v)}>
      <SelectTrigger id={id} className={cn("[&>span:first-child]:flex [&>span:first-child]:items-center [&>span:first-child]:gap-2", className)}>
        <Clock className="w-5 h-5 text-stone-400 shrink-0" />
        <SelectValue placeholder={placeholder} />
      </SelectTrigger>
      <SelectContent className="max-h-64">
        <SelectItem value="__none__">
          <span className="text-stone-400">{placeholder}</span>
        </SelectItem>
        {TIME_SLOTS.map((slot) => (
          <SelectItem key={slot.value} value={slot.value}>
            {slot.label}
          </SelectItem>
        ))}
      </SelectContent>
    </Select>
  );
}
