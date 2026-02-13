import type { ReactNode } from "react";
import { Link } from "@tanstack/react-router";
import { ArrowLeft, ArrowRight, Award, CheckCircle2 } from "lucide-react";
import { Button } from "../ui/button";
import { useHasHydrated, useSectionCompletion } from "@/stores/assessmentStore";

interface AssessmentFooterProps {
  /** Current step number (1-indexed), for assessment steps 1-5 */
  currentStep: number;
  /** Total number of assessment steps (default: 5) */
  totalSteps?: number;
  /** Link destination for the back button (omit to hide back button) */
  backTo?: string;
  /** Text label for the back button */
  backLabel?: string;
  /** Text label for the next button */
  nextLabel: ReactNode;
  /** Whether the next button should be disabled */
  nextDisabled?: boolean;
  /** Type of the next button (for form submission) */
  nextButtonType?: "button" | "submit";
  /** Optional onClick handler for next button */
  onNext?: () => void;
  /** Whether to show arrow icon after next label (default: true) */
  showNextArrow?: boolean;
  /** Section progress (0-100) for the current section */
  sectionProgress?: number;
  /** Whether this is the review page (shows different visual treatment) */
  isReview?: boolean;
}

const stepLabels = [
  "Basic Info",
  "Personality",
  "Values",
  "Aptitude",
  "Challenges",
];

export function AssessmentFooter({
  currentStep,
  totalSteps = 5,
  backTo,
  backLabel = "Back",
  nextLabel,
  nextDisabled = false,
  nextButtonType = "submit",
  onNext,
  showNextArrow = true,
  sectionProgress,
  isReview = false,
}: AssessmentFooterProps) {
  const hasHydrated = useHasHydrated();

  // Centralized section completion from the store
  const { sectionCompletion, allComplete: allSectionsComplete, overallProgress } = useSectionCompletion();

  // Gate on hydration so we don't flash stale state
  const displayCompletion = hasHydrated ? sectionCompletion : [false, false, false, false, false] as [boolean, boolean, boolean, boolean, boolean];

  // Calculate actual overall progress based on store data
  const actualOverallProgress = isReview ? 100 : overallProgress;

  const displayProgressText =
    sectionProgress !== undefined ? Math.round(sectionProgress) : actualOverallProgress;

  // Show review button when all sections complete and not on challenges or review page
  const showReviewButton = allSectionsComplete && !isReview && currentStep !== totalSteps;

  return (
    <div
      className="fixed bottom-0 left-0 right-0 z-40 bg-white/90 backdrop-blur-lg border-t border-stone-200 shadow-[0_-4px_20px_rgba(0,0,0,0.08)]"
      style={{ paddingRight: 'var(--removed-body-scroll-bar-size, 0px)' }}
    >
      <div className="max-w-3xl mx-auto px-4 sm:px-6 lg:px-8 py-4">
        {/* Progress Section */}
        <div className="flex items-center gap-4 mb-4">
          <div className="flex-1">
            {isReview ? (
              /* Review page - different visual treatment */
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="inline-flex items-center gap-2 text-sm font-medium text-lime-700">
                    <CheckCircle2 className="w-4 h-4" />
                    Assessment Complete - Review & Submit
                  </span>
                  <span className="text-sm font-semibold text-lime-700">
                    100%
                  </span>
                </div>
                {/* Completed progress bar */}
                <div className="relative w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  <div className="absolute inset-y-0 left-0 bg-lime-600 rounded-full w-full" />
                </div>
                {/* Completed step dots - positioned at end of each 1/5th */}
                <div className="relative w-full h-6 mt-1">
                  {stepLabels.map((label, index) => {
                    const position = ((index + 1) / totalSteps) * 100;
                    return (
                      <div
                        key={label}
                        className="absolute -translate-x-1/2 flex flex-col items-center text-lime-600"
                        style={{ left: `${position}%` }}
                      >
                        <div className="w-2 h-2 rounded-full bg-lime-500" />
                      </div>
                    );
                  })}
                  {/* Ribbon indicator at the end */}
                  <div
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{ left: "100%", top: "-2px" }}
                  >
                    <Award className="w-5 h-5 text-lime-600" />
                  </div>
                </div>
              </>
            ) : (
              /* Regular assessment step */
              <>
                <div className="flex items-center justify-between mb-2">
                  <span className="text-sm font-medium text-stone-600">
                    Step {currentStep} of {totalSteps}: {stepLabels[currentStep - 1]}
                  </span>
                  {allSectionsComplete ? (
                    <span className="inline-flex items-center gap-1.5 text-sm font-semibold text-lime-700">
                      <CheckCircle2 className="w-4 h-4" />
                      Almost done!
                    </span>
                  ) : (
                    <span className="text-sm font-semibold text-lime-700">
                      {displayProgressText}% complete
                    </span>
                  )}
                </div>
                {/* Progress bar */}
                <div className="relative w-full h-2 bg-stone-200 rounded-full overflow-hidden">
                  {/* Overall progress based on completed sections */}
                  <div
                    className="absolute inset-y-0 left-0 bg-lime-500 transition-all duration-500 ease-out rounded-full"
                    style={{ width: `${actualOverallProgress}%` }}
                  />
                  {/* Section progress overlay (darker shade showing current section progress) */}
                  {sectionProgress !== undefined && sectionProgress > 0 && (
                    <div
                      className="absolute inset-y-0 bg-lime-600 transition-all duration-300 ease-out rounded-full"
                      style={{
                        left: `${((currentStep - 1) / totalSteps) * 100}%`,
                        width: `${(sectionProgress / 100) * (100 / totalSteps)}%`,
                      }}
                    />
                  )}
                </div>
                {/* Step dots - positioned at end of each 1/5th segment */}
                <div className="relative w-full h-6 mt-1">
                  {stepLabels.map((label, index) => {
                    const position = ((index + 1) / totalSteps) * 100;
                    const isCompleted = displayCompletion[index];
                    const isCurrent = index + 1 === currentStep;
                    return (
                      <div
                        key={label}
                        className={`absolute -translate-x-1/2 flex flex-col items-center ${
                          isCompleted || isCurrent ? "text-lime-600" : "text-stone-400"
                        }`}
                        style={{ left: `${position}%` }}
                      >
                        <div
                          className={`w-2 h-2 rounded-full ${
                            isCurrent
                              ? "bg-lime-600 ring-2 ring-lime-200"
                              : isCompleted
                                ? "bg-lime-500"
                                : "bg-stone-300"
                          }`}
                        />
                      </div>
                    );
                  })}
                  {/* Ribbon indicator at the end (greyed out until complete) */}
                  <div
                    className="absolute -translate-x-1/2 flex flex-col items-center"
                    style={{ left: "100%", top: "-2px" }}
                  >
                    <Award className={`w-5 h-5 ${allSectionsComplete ? "text-lime-600" : "text-stone-300"}`} />
                  </div>
                </div>
              </>
            )}
          </div>
        </div>

        {/* Navigation Buttons */}
        <div className="flex items-center justify-between gap-2">
          {backTo ? (
            <Link
              to={backTo}
              className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 border-stone-300 text-stone-700 hover:bg-stone-50 transition-colors font-medium text-xs sm:text-sm"
            >
              <ArrowLeft className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
              {backLabel}
            </Link>
          ) : (
            <div />
          )}

          <div className="flex items-center gap-2 sm:gap-3">
            {showReviewButton && (
              <Link
                to="/intake/review"
                className="inline-flex items-center gap-1.5 sm:gap-2 px-3 sm:px-5 py-2 sm:py-2.5 rounded-lg border-2 border-lime-600 text-lime-700 hover:bg-lime-50 transition-colors font-medium text-xs sm:text-sm"
              >
                <CheckCircle2 className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                <span className="hidden sm:inline">Review Answers</span>
                <span className="sm:hidden">Review</span>
              </Link>
            )}
            <Button
              type={nextButtonType}
              variant="primary"
              size="md"
              disabled={nextDisabled}
              onClick={onNext}
              className="inline-flex items-center gap-1.5 sm:gap-2 text-xs sm:text-sm px-3 sm:px-5 py-2 sm:py-2.5"
            >
              {nextLabel}
              {showNextArrow && <ArrowRight className="w-3.5 h-3.5 sm:w-4 sm:h-4" />}
            </Button>
          </div>
        </div>
      </div>
    </div>
  );
}
