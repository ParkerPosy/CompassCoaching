import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Save } from "lucide-react";
import { Button } from "../ui/button";

interface NavigationButtonsProps {
	/** Link destination for the back button */
	backTo: string;
	/** Text label for the back button */
	backLabel?: string;
	/** Text label for the next/submit button */
	nextLabel: string;
	/** Whether the next button should be disabled */
	nextDisabled?: boolean;
	/** Whether to show the save progress button */
	showSave?: boolean;
	/** Callback for save button click */
	onSave?: () => void;
	/** Type of the next button (for form submission) */
	nextButtonType?: "button" | "submit";
}

export function NavigationButtons({
	backTo,
	backLabel = "Back",
	nextLabel,
	nextDisabled = false,
	showSave = false,
	onSave,
	nextButtonType = "submit",
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
					className="inline-flex items-center gap-2"
				>
					{nextLabel}
					<ArrowRight className="w-5 h-5" />
				</Button>
			</div>
		</div>
	);
}
