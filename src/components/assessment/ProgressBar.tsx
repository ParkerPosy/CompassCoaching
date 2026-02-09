interface ProgressBarProps {
  /** Current value (0-100) */
  value: number;
  /** Optional label to display above the bar */
  label?: string;
  /** Optional color for the progress bar */
  color?: "lime" | "blue" | "green" | "purple";
  /** Whether to show the percentage text */
  showPercentage?: boolean;
  /** Size variant */
  size?: "sm" | "md" | "lg";
}

const colorClasses = {
  lime: "bg-lime-400",
  blue: "bg-blue-400",
  green: "bg-green-400",
  purple: "bg-purple-400",
};

const heightClasses = {
  sm: "h-2",
  md: "h-3",
  lg: "h-4",
};

export function ProgressBar({
  value,
  label,
  color = "lime",
  showPercentage = true,
  size = "md",
}: ProgressBarProps) {
  const clampedValue = Math.min(100, Math.max(0, value));

  return (
    <div className="w-full">
      {(label || showPercentage) && (
        <div className="flex items-center justify-between mb-2">
          {label && (
            <span className="text-sm font-medium text-stone-700">{label}</span>
          )}
          {showPercentage && (
            <span className="text-sm font-semibold text-stone-800">
              {clampedValue}%
            </span>
          )}
        </div>
      )}
      <div
        className={`w-full bg-stone-200 rounded-full overflow-hidden ${heightClasses[size]}`}
      >
        <div
          className={`${colorClasses[color]} ${heightClasses[size]} transition-all duration-500 ease-out rounded-full`}
          style={{ width: `${clampedValue}%` }}
        />
      </div>
    </div>
  );
}
