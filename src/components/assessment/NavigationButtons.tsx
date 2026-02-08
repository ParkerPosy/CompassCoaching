import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "../ui/button";

interface NavigationButtonsProps {
  /** Link destination for the back button */
  backTo: string;
  /** Text label for the back button */
  backLabel?: string;
  /** Text label or custom content for the next/submit button */
  nextLabel: ReactNode;
  /** Whether the next button should be disabled */
  nextDisabled?: boolean;
  /** Whether to show the save progress button */
  showSave?: boolean;
  /** Callback for save button click */
  onSave?: () => void;
  /** Type of the next button (for form submission) */
  nextButtonType?: "button" | "submit";
  /** Optional onClick handler for next button (when nextButtonType is 'button') */
  onNext?: () => void;
  /** Whether to show arrow icon after next label (default: true) */
  showNextArrow?: boolean;
}

export function NavigationButtons({
  backTo,
  backLabel = "Back",
  nextLabel,
  nextDisabled = false,
  showSave = false,
  onSave,
  nextButtonType = "submit",
  onNext,
  showNextArrow = true,
}: NavigationButtonsProps) {
  return (
    <div className="flex items-center justify-between mt-8">
      <Link
        to={backTo}
        className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
      >
        <ArrowLeft className="w-5 h-5" />
        {backLabel}
      </Link>

      <div className="flex items-center gap-4">
        {showSave && (
          <button
            type="button"
            onClick={onSave}
            className="inline-flex items-center gap-2 px-6 py-3 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium"
          >
            <Save className="w-5 h-5" />
            Save Progress
          </button>
        )}
        <Button
          type={nextButtonType}
          variant="primary"
          size="lg"
          disabled={nextDisabled}
          onClick={onNext}
          className="inline-flex items-center gap-2"
        >
          {nextLabel}
          {showNextArrow && <ArrowRight className="w-5 h-5" />}
        </Button>
      </div>
    </div>
  );
}
