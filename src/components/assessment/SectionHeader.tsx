import type { LucideIcon } from "lucide-react";

interface SectionHeaderProps {
  /** Lucide icon component to display */
  icon: LucideIcon;
  /** Optional icon background color classes */
  iconBgColor?: string;
  /** Main heading text */
  title: string;
  /** Optional subtitle/description */
  subtitle?: string;
  /** Estimated time to complete (e.g., "2 minutes") */
  estimatedTime?: string;
}

export function SectionHeader({
  icon: Icon,
  iconBgColor = "bg-lime-400",
  title,
  subtitle,
  estimatedTime,
}: SectionHeaderProps) {
  return (
    <div className="text-center mb-12">
      <div
        className={`inline-flex items-center justify-center w-20 h-20 ${iconBgColor} rounded-full mb-6`}
      >
        <Icon className="w-10 h-10 text-stone-700" />
      </div>
      <h1 className="text-4xl font-bold text-stone-700 mb-4">{title}</h1>
      {subtitle && <p className="text-xl text-stone-600 mb-2">{subtitle}</p>}
      {estimatedTime && (
        <p className="text-stone-500">Estimated time: {estimatedTime}</p>
      )}
    </div>
  );
}
