import { Link, useNavigate } from "@tanstack/react-router";
import {
  SignedIn,
  SignedOut,
  SignInButton,
  UserButton,
  useUser,
} from "@clerk/tanstack-react-start";
import {
  AlertCircle,
  AlertTriangle,
  BarChart3,
  BookOpen,
  Brain,
  Briefcase,
  CalendarDays,
  CheckCircle2,
  ChevronDown,
  ChevronRight,
  Circle,
  Heart,
  Home,
  Info,
  Mail,
  Menu,
  RefreshCw,
  Shield,
  Target,
  User,
  X,
} from "lucide-react";
import { useState } from "react";
import { CATEGORY_COLOR_STYLES, RESOURCE_CATEGORIES } from "@/data/resources";
import { useAssessmentProgress } from "@/hooks";
import { DialogService } from "@/lib/dialogService";
import { useAssessmentStore, useHasHydrated, useIsResultsOutdated } from "@/stores/assessmentStore";

export default function Header() {
  const [isOpen, setIsOpen] = useState(false);
  const [showAssessmentMenu, setShowAssessmentMenu] = useState(false);
  const [showResourcesMenu, setShowResourcesMenu] = useState(false);
  const hasHydrated = useHasHydrated();
  const progress = useAssessmentProgress();
  const isOutdated = useIsResultsOutdated();
  const clearResults = useAssessmentStore((state) => state.clearResults);
  const navigate = useNavigate();
  const { user } = useUser();

  const isAdmin = user?.publicMetadata?.role === "admin";

  // Close menu and reset all submenus
  const closeMenu = ({isResource = false, isAssessment = false}: {isResource?: boolean; isAssessment?: boolean} = {}) => {
    setIsOpen(false);
    setShowAssessmentMenu(isAssessment);
    setShowResourcesMenu(isResource);
  };

  const handleUpdateAssessment = async () => {
    const confirmed = await DialogService.confirm({
      title: "Update Assessment?",
      description:
        "We've added new questions for more accurate career matching. Starting fresh will clear your current answers — your existing results stay viewable until you complete the new version.",
      confirmLabel: "Start Fresh",
      cancelLabel: "Not Now",
      intent: "warning",
    });
    if (!confirmed) return;
    clearResults();
    navigate({ to: "/intake" });
    closeMenu({ isAssessment: true });
  };

  const handleContinueAssessment = () => {
    navigate({ to: progress.nextSection });
    closeMenu({ isAssessment: true });
  };

  const assessmentSections = [
    {
      id: "basic",
      label: "Basic Information",
      icon: User,
      path: "/intake/basic",
      completed: progress.basic,
      enabled: true, // Always enabled - first section
    },
    {
      id: "personality",
      label: "Personality",
      icon: Brain,
      path: "/intake/personality",
      completed: progress.personality,
      enabled: progress.basic, // Enabled after basic is complete
    },
    {
      id: "values",
      label: "Values",
      icon: Heart,
      path: "/intake/values",
      completed: progress.values,
      enabled: progress.personality, // Enabled after personality is complete
    },
    {
      id: "aptitude",
      label: "Career Aptitude",
      icon: Target,
      path: "/intake/aptitude",
      completed: progress.aptitude,
      enabled: progress.values, // Enabled after values is complete
    },
    {
      id: "challenges",
      label: "Challenges",
      icon: AlertCircle,
      path: "/intake/challenges",
      completed: progress.challenges,
      enabled: progress.aptitude, // Enabled after aptitude is complete
    },
  ];

  const completedCount = assessmentSections.filter((s) => s.completed).length;
  const totalCount = assessmentSections.length;

  return (
    <>
      <header className="px-2 sm:px-4 py-3 sm:py-4 flex items-center justify-between bg-white border-b border-stone-200 sticky top-0 z-50 shadow-sm print-hidden">
        <div className="flex items-center gap-3 sm:gap-6">
          <button
            type="button"
            onClick={() => setIsOpen(true)}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Open menu"
          >
            <Menu size={24} className="text-stone-700" />
          </button>

          <h1 className="text-lg sm:text-2xl font-bold flex items-center">
            <Link to="/" className="flex items-center gap-1.5 group">
              <svg className="w-5 h-5 sm:w-7 sm:h-7 group-hover:scale-110 transition-transform" viewBox="0 0 250 250" xmlns="http://www.w3.org/2000/svg">
                <path fill="#ffffff" stroke="#65a30d" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round" d="M34.94,10.53 l21.81,48.63 h-51.62 l60.37,180.31 h119 l60.37,-180.31 h-51.62 l21.81,-48.63 z" />
                <path d="M97 113 Q100 103 110 100 L170 80 L148 142 Q145 152 136 155" fill="none" stroke="#65a30d" strokeWidth="20" strokeLinecap="round" strokeLinejoin="round"/>
                <path d="M144 150 Q140.5 153.5 136 155 L75 175 L97 113 Q98.5 108 102 105" fill="none" stroke="#172554" strokeWidth="20" strokeLinecap="butt" strokeLinejoin="round"/>
              </svg>
              <div className="flex gap-1 sm:gap-1.5">
                <span className="bg-linear-to-r from-lime-600 to-lime-500 bg-clip-text text-transparent">
                  Compass
                </span>
                <span className="text-blue-950">Coaching</span>
              </div>
            </Link>
          </h1>
        </div>

        {/* Auth Buttons - hidden on mobile */}
        <div className="hidden sm:flex items-center gap-2">
          <Link
            to="/contact"
            className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Mail className="w-4 h-4" />
            Contact
          </Link>
          <button
            type="button"
            onClick={() => alert("Coming soon!")}
            className="px-3 py-2 text-sm font-medium text-lime-700 hover:text-lime-800 hover:bg-lime-50 rounded-lg transition-colors flex items-center gap-1.5"
          >
            <Heart className="w-4 h-4" />
            Donate
          </button>
          <SignedOut>
            <SignInButton mode="modal">
              <button className="px-3 py-2 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors">
                Sign In
              </button>
            </SignInButton>
          </SignedOut>
          <SignedIn>
            <div className="px-1.5">
              <UserButton
                appearance={{
                  elements: {
                    avatarBox: "w-9 h-9",
                  },
                }}
              />
            </div>
          </SignedIn>
        </div>
      </header>

      {/* Sidebar */}
      <aside
        className={`fixed top-0 left-0 h-full w-80 bg-white border-r border-stone-200 z-50 transform transition-transform duration-300 ease-in-out flex flex-col ${
          isOpen ? "shadow-2xl translate-x-0" : "-translate-x-full"
        }`}
      >
        <div className="flex items-center justify-between p-4 border-b border-stone-200">
          <h2 className="text-xl font-bold text-stone-700">Navigation</h2>
          <button
            type="button"
            onClick={() => closeMenu()}
            className="p-2 hover:bg-stone-100 rounded-lg transition-colors"
            aria-label="Close menu"
          >
            <X size={24} className="text-stone-700" />
          </button>
        </div>

        <div className="flex-1 w-full h-full flex flex-col overflow-y-auto overflow-x-hidden">
          <nav className="flex-1 w-full">
            {/* Main Navigation */}
            <div className="mb-6 m-4">
            <Link
              to="/"
              onClick={() => closeMenu()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
              }}
            >
              <Home size={20} />
              <span>Home</span>
            </Link>

            {/* Dashboard - Only shown when signed in */}
            <SignedIn>
              <Link
                to="/dashboard"
                onClick={() => closeMenu()}
                className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
                activeProps={{
                  className:
                    "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
                }}
              >
                <User size={20} />
                <span>My Dashboard</span>
              </Link>

              {/* Admin - Only shown to admins */}
              {isAdmin && (
                <Link
                  to="/admin"
                  onClick={() => closeMenu()}
                  className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
                  activeProps={{
                    className:
                      "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
                  }}
                >
                  <Shield size={20} />
                  <span>Admin Dashboard</span>
                </Link>
              )}
            </SignedIn>

            {/* Resources with Submenu */}
            <div className="mb-1">
              <button
                type="button"
                onClick={() => setShowResourcesMenu((prev) => !prev)}
                className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-stone-50 transition-colors text-stone-700"
              >
                <div className="flex items-center gap-3">
                  <BookOpen size={20} />
                  <span>Resources</span>
                </div>
                {showResourcesMenu ? (
                  <ChevronDown size={18} />
                ) : (
                  <ChevronRight size={18} />
                )}
              </button>

              {showResourcesMenu && (
                <div className="ml-3 mt-1 space-y-1 border-l-2 border-stone-200 pl-3">
                  <Link
                    to="/resources"
                    onClick={() => closeMenu({ isResource: true })}
                    className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
                    activeOptions={{ exact: true }}
                    activeProps={{
                      className:
                        "flex items-center gap-2 p-2 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
                    }}
                  >
                    <BookOpen size={16} />
                    <span>All Resources</span>
                  </Link>

                  {RESOURCE_CATEGORIES.map((category) => {
                    const Icon = category.icon;
                    const colors = CATEGORY_COLOR_STYLES[category.color];
                    return (
                      <Link
                        key={category.slug}
                        to={category.path}
                        onClick={() => closeMenu({ isResource: true })}
                        className="flex items-center gap-2 p-2 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
                        activeProps={{
                          className:
                            "flex items-center gap-2 p-2 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
                        }}
                      >
                        <Icon size={16} className={`shrink-0 ${colors.iconText}`} />
                        <span className="line-clamp-1">{category.title}</span>
                      </Link>
                    );
                  })}
                </div>
              )}
            </div>

            <Link
              to="/careers"
              onClick={() => closeMenu()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
              }}
            >
              <Briefcase size={20} />
              <span>PA Career Explorer</span>
            </Link>

            <Link
              to="/events"
              onClick={() => closeMenu()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
              }}
            >
              <CalendarDays size={20} />
              <span>Events</span>
            </Link>

            <Link
              to="/contact"
              onClick={() => closeMenu()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
              }}
            >
              <Mail size={20} />
              <span>Contact</span>
            </Link>

            <Link
              to="/about"
              onClick={() => closeMenu()}
              className="flex items-center gap-3 p-3 rounded-lg hover:bg-stone-50 transition-colors mb-1 text-stone-700"
              activeProps={{
                className:
                  "flex items-center gap-3 p-3 rounded-lg bg-lime-50 text-lime-700 transition-colors mb-1 font-medium",
              }}
            >
              <Info size={20} />
              <span>About Us</span>
            </Link>

            <div className="mt-3" />

            {hasHydrated && progress.hasResults && isOutdated ? (
              <>
                <Link
                  to="/intake/results"
                  onClick={() => closeMenu()}
                  className="w-full mb-2 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <BarChart3 size={20} />
                  <span>View Results</span>
                </Link>
                <button
                  type="button"
                  onClick={handleUpdateAssessment}
                  className="w-full mb-3 px-4 py-2.5 bg-amber-500 hover:bg-amber-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
                >
                  <RefreshCw size={20} />
                  Update Assessment
                </button>
              </>
            ) : hasHydrated && progress.hasResults ? (
              <Link
                to="/intake/results"
                onClick={() => closeMenu()}
                className="w-full mb-3 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <BarChart3 size={20} />
                <span>My Results</span>
              </Link>
            ) : hasHydrated && !progress.hasResults ? (
              <button
                type="button"
                onClick={handleContinueAssessment}
                className="w-full mb-3 px-4 py-2.5 bg-lime-500 hover:bg-lime-600 text-white rounded-lg font-medium transition-colors flex items-center justify-center gap-2"
              >
                <Target size={20} />
                {completedCount === 0
                  ? "Start Assessment"
                  : progress.isComplete
                    ? "Submit Assessment"
                    : "Continue Assessment"}
              </button>
            ) : null}
          </div>

          {/* Assessment Section */}
          <div className="border-t border-stone-200 p-4">
            <button
              type="button"
              onClick={() => setShowAssessmentMenu((prev) => !prev)}
              className="flex items-center justify-between w-full p-3 rounded-lg hover:bg-stone-50 transition-colors mb-2 text-stone-700 font-medium"
            >
              <div className="flex items-center gap-3">
                <Target size={20} />
                <span>Career Assessment</span>
              </div>
              {showAssessmentMenu ? (
                <ChevronDown size={18} />
              ) : (
                <ChevronRight size={18} />
              )}
            </button>

            {/* Progress Bar */}
            <div className="px-3 mb-3">
              <div className="flex items-center justify-between text-xs text-stone-600 mb-1">
                <span>Progress</span>
                <span>
                  {!hasHydrated
                    ? "..."
                    : isOutdated && progress.hasResults
                      ? "Update available"
                      : `${completedCount}/${totalCount}`}
                </span>
              </div>
              <div className="w-full h-2 bg-stone-100 rounded-full overflow-hidden">
                <div
                  className={`h-full transition-all duration-500 rounded-full ${
                    isOutdated && progress.hasResults ? "bg-amber-400" : "bg-lime-500"
                  }`}
                  style={{
                    width: hasHydrated
                      ? isOutdated && progress.hasResults
                        ? "100%"
                        : `${(completedCount / totalCount) * 100}%`
                      : "0%",
                  }}
                />
              </div>
            </div>


            {/* Assessment Sections */}
            {showAssessmentMenu && (
              hasHydrated && isOutdated && progress.hasResults ? (
                <div className="mx-3 p-3 bg-amber-50 border border-amber-200 rounded-lg">
                  <div className="flex items-start gap-2.5">
                    <AlertTriangle size={16} className="text-amber-600 shrink-0 mt-0.5" />
                    <div>
                      <p className="text-sm font-medium text-amber-800">New questions added</p>
                      <p className="text-xs text-amber-700 mt-1 leading-relaxed">
                        We've improved the assessment with new questions for better career matching.
                        Retake it to get updated, more accurate results.
                      </p>
                    </div>
                  </div>
                </div>
              ) : (
              <div className="space-y-1 pl-3">
                {assessmentSections.map((section) => {
                  const Icon = section.icon;
                  const isEnabled = !hasHydrated || section.enabled;

                  if (!isEnabled) {
                    // Disabled state - not clickable
                    return (
                      <div
                        key={section.id}
                        className="flex items-center gap-3 p-2.5 rounded-lg text-sm text-stone-400 cursor-not-allowed"
                        title="Complete previous sections first"
                      >
                        <Icon size={16} />
                        <span className="flex-1">{section.label}</span>
                        <Circle size={16} className="text-stone-200" />
                      </div>
                    );
                  }

                  return (
                    <Link
                      key={section.id}
                      to={section.path}
                      onClick={() => closeMenu({ isAssessment: true })}
                      className="flex items-center gap-3 p-2.5 rounded-lg hover:bg-stone-50 transition-colors text-sm text-stone-700"
                      activeProps={{
                        className:
                          "flex items-center gap-3 p-2.5 rounded-lg bg-lime-50 text-lime-700 transition-colors text-sm font-medium",
                      }}
                    >
                      <Icon size={16} />
                      <span className="flex-1">{section.label}</span>
                      {!hasHydrated ? (
                        <Circle size={16} className="text-stone-200 animate-pulse" />
                      ) : section.completed ? (
                        <CheckCircle2 size={16} className="text-lime-600" />
                      ) : (
                        <Circle size={16} className="text-stone-300" />
                      )}
                    </Link>
                  );
                })}
              </div>
              )
            )}
            </div>
          </nav>
          {/* Donate Button - always visible */}
          <div className="p-4 border-t border-stone-200 space-y-2">
            <button
              type="button"
              onClick={() => alert("Coming soon!")}
              className="w-full py-3 text-sm font-medium text-lime-700 hover:text-lime-800 bg-lime-50 hover:bg-lime-100 rounded-lg transition-colors flex items-center justify-center gap-2"
            >
              <Heart className="w-4 h-4" />
              Donate
            </button>
            {/* Sign In - mobile only */}
            <SignedOut>
              <SignInButton mode="modal">
                <button className="w-full py-3 text-sm font-medium text-white bg-stone-700 hover:bg-stone-900 rounded-lg transition-colors sm:hidden">
                  Sign In
                </button>
              </SignInButton>
            </SignedOut>
          </div>
          {/* Footer inside scrollable area */}
          <div className="p-4 border-t border-stone-200 bg-stone-50 shrink-0">
            <p className="text-xs text-stone-600 text-center mb-2">
              Navigate Your Future with Confidence
            </p>
            <div className="flex items-center justify-center gap-3 text-xs">
              <Link
                to="/privacy"
                onClick={() => closeMenu()}
                className="text-stone-500 hover:text-stone-700 transition-colors"
              >
                Privacy
              </Link>
              <span className="text-stone-300">·</span>
              <Link
                to="/terms"
                onClick={() => closeMenu()}
                className="text-stone-500 hover:text-stone-700 transition-colors"
              >
                Terms
              </Link>
            </div>
          </div>
        </div>
      </aside>

      {/* Overlay */}
      {isOpen && (
        <div
          role="button"
          tabIndex={0}
          className="fixed inset-0 bg-black/20 z-40"
          onClick={closeMenu}
          onKeyDown={(e) => {
            if (e.key === "Escape" || e.key === "Enter") {
              closeMenu();
            }
          }}
          aria-label="Close menu"
        />
      )}
    </>
  );
}
