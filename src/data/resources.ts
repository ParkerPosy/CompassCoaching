import type { LucideIcon } from "lucide-react";
import {
  Activity,
  Award,
  Book,
  BookOpen,
  Briefcase,
  DollarSign,
  FileText,
  GraduationCap,
  Heart,
  Landmark,
  Smile,
  Target,
  TrendingUp,
  Users,
} from "lucide-react";

export interface Resource {
  title: string;
  type: string;
  duration: string;
  category: string;
}

// Available category colors
export type CategoryColor =
  | "violet"   // calm, mindfulness
  | "rose"     // warmth, connection
  | "lime"     // growth, development
  | "teal"     // exploration, discovery
  | "emerald"  // health, nature
  | "blue"     // learning, knowledge
  | "cyan"     // professional, clear
  | "amber"    // achievement, success
  | "indigo"   // trust, stability
  | "orange"   // change, energy
  | "pink"     // relationships, social
  | "sky"      // opportunity, openness
  | "slate"    // professional, clean
  | "purple"   // confidence, preparation
  | "yellow";  // value, prosperity

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  slug: string;
  color: CategoryColor;
}

// Resource types
export const RESOURCE_TYPES = {
  TOOL: "Tool",
  GUIDE: "Guide",
  ARTICLE: "Article",
  TEMPLATE: "Template",
  WORKSHEET: "Worksheet",
  DIRECTORY: "Directory",
} as const;

// Category names
export const CATEGORY_NAMES = {
  CAREER_EXPLORATION: "Career Exploration",
  RESUME_COVER_LETTERS: "Resume & Cover Letters",
  INTERVIEW_PREPARATION: "Interview Preparation",
  JOB_SEARCH: "Job Search Strategies",
  PROFESSIONAL_DEVELOPMENT: "Professional Development",
  NETWORKING: "Networking",
  SALARY_NEGOTIATION: "Salary & Negotiation",
  EDUCATION_TRAINING: "Education & Training",
  CAREER_TRANSITIONS: "Career Transitions",
  WORKPLACE_SUCCESS: "Workplace Success",
  FINANCIAL_AID: "Financial Aid & Planning",
  SKILLS_DEVELOPMENT: "Skills Development",
  MENTAL_WELLBEING: "Mental Wellbeing",
  RELATIONSHIPS: "Relationships & Communication",
  HEALTHY_LIVING: "Healthy Living",
} as const;

// Master list of all resources - ordered by priority for human actualization
// Within each category: Self-awareness → Foundations → Prevention → Practice → Resources
export const ALL_RESOURCES: Resource[] = [
  // Mental Wellbeing (6) - Foundation for everything
  {
    title: "Understanding Yourself: Self-Reflection Prompts",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Building Inner Strength & Resilience",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Preventing Burnout: Early Warning Signs",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Managing Stress & Anxiety",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Daily Self-Care Practices",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },
  {
    title: "Mental Health Support Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.MENTAL_WELLBEING,
  },

  // Relationships & Communication (6) - Social connection
  {
    title: "The Art of Listening",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Building Genuine Connections",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Setting Healthy Boundaries",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Creating Your Support Network",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Navigating Conflict with Grace",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },
  {
    title: "Finding Purpose Through Service",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.RELATIONSHIPS,
  },

  // Skills Development (6) - Personal growth
  {
    title: "Discovering Your Potential: Skills Assessment",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Core Human Skills Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Future-Ready Skills Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Free Learning Pathways",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Technical Skills Development",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Showcasing Your Growth: Portfolio Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },

  // Career Exploration (6) - Direction and purpose
  {
    title: "Discovering Your Calling",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Mapping Your Future: Career Roadmaps",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Understanding Career Landscapes",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Real Stories: Day in the Life",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Learning from Others' Journeys",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Hands-On Career Exploration",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },

  // Healthy Living (6) - Physical health supports mental health
  {
    title: "Rest & Recovery: Sleep Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Movement for Mind & Body",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Nourishing Yourself on a Budget",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Building Sustainable Habits",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Finding Digital Balance",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },
  {
    title: "Wellness Tools & Apps",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.HEALTHY_LIVING,
  },

  // Education & Training (6) - Foundational learning
  {
    title: "How You Learn Best",
    type: RESOURCE_TYPES.TOOL,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Choosing Your Learning Path",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Free & Affordable Learning Platforms",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Credentials That Matter",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Intensive Programs Comparison",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Funding Your Education",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },

  // Professional Development (6) - Continuous growth
  {
    title: "Creating Your Growth Plan",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Mastering Your Time",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Finding & Being a Mentor",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Developing Leadership",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Essential Technology Skills",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Free Certifications Directory",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },

  // Workplace Success (6) - Thriving at work
  {
    title: "Understanding Your Workplace Rights",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Communicating with Impact",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Professional Presence",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Succeeding in Your First 90 Days",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Handling Workplace Challenges",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },
  {
    title: "Preparing for Growth Conversations",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.WORKPLACE_SUCCESS,
  },

  // Financial Aid & Planning (6) - Security reduces stress
  {
    title: "Planning Your Education Investment",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Free Money: Grants & Scholarships",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "15 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Finding Scholarships",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Completing Your FAFSA",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Employer Education Benefits",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },
  {
    title: "Understanding Student Loans",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.FINANCIAL_AID,
  },

  // Career Transitions (6) - Life changes
  {
    title: "Recognizing Your Transferable Value",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Planning Your Career Change",
    type: RESOURCE_TYPES.GUIDE,
    duration: "35 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Inspiration: Career Change Stories",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Returning to the Workforce",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Transitioning on a Budget",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Exploring Alternative Paths",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },

  // Networking (6) - Professional connections
  {
    title: "Building Authentic Professional Relationships",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Telling Your Story",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Leveraging Your Alumni Network",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Making the Most of Events",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Strategic LinkedIn Networking",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Reaching Out to New Contacts",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },

  // Job Search Strategies (6) - Practical hunting
  {
    title: "Strategic Job Search Planning",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Staying Organized in Your Search",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Making Your Profile Discoverable",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Where to Find Opportunities",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Accessing Hidden Opportunities",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Realistic Search Timeline",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },

  // Resume & Cover Letters (6) - Application tools
  {
    title: "Telling Your Professional Story",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Resume Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Cover Letter Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Powerful Language Guide",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "10 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Final Review Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Getting Past Automated Screens",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },

  // Interview Preparation (6) - Tactical skills
  {
    title: "Calming Interview Nerves",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Structuring Your Stories",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Preparing Your Responses",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Video Interview Best Practices",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Phone Interview Preparation",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Following Up Gracefully",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },

  // Salary & Negotiation (6) - Advocating for yourself
  {
    title: "Knowing Your Market Value",
    type: RESOURCE_TYPES.DIRECTORY,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Understanding Total Compensation",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Negotiation Strategies",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Negotiation Conversations",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Evaluating Counter Offers",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Asking for What You Deserve",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
];

// Category metadata - ordered by priority for overall human wellbeing
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  // Foundation: Mental & Emotional Health
  {
    icon: Smile,
    title: CATEGORY_NAMES.MENTAL_WELLBEING,
    description: "Tools and strategies for a healthier mind",
    path: "/resources/mental-wellbeing",
    slug: "mental-wellbeing",
    color: "violet",
  },
  {
    icon: Heart,
    title: CATEGORY_NAMES.RELATIONSHIPS,
    description: "Strengthen your personal and professional connections",
    path: "/resources/relationships",
    slug: "relationships",
    color: "rose",
  },
  // Growth: Skills & Knowledge
  {
    icon: BookOpen,
    title: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
    description: "Resources to build in-demand skills",
    path: "/resources/skills-development",
    slug: "skills-development",
    color: "lime",
  },
  {
    icon: GraduationCap,
    title: CATEGORY_NAMES.CAREER_EXPLORATION,
    description: "Discover careers that match your interests and skills",
    path: "/resources/career-exploration",
    slug: "career-exploration",
    color: "teal",
  },
  // Physical Health
  {
    icon: Activity,
    title: CATEGORY_NAMES.HEALTHY_LIVING,
    description: "Simple habits to support your overall wellbeing",
    path: "/resources/healthy-living",
    slug: "healthy-living",
    color: "emerald",
  },
  // Continued Learning & Development
  {
    icon: Book,
    title: CATEGORY_NAMES.EDUCATION_TRAINING,
    description: "Find programs, certifications, and courses",
    path: "/resources/education-training",
    slug: "education-training",
    color: "blue",
  },
  {
    icon: Briefcase,
    title: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
    description: "Build skills and advance your career",
    path: "/resources/professional-development",
    slug: "professional-development",
    color: "cyan",
  },
  {
    icon: Award,
    title: CATEGORY_NAMES.WORKPLACE_SUCCESS,
    description: "Thrive in your new role from day one",
    path: "/resources/workplace-success",
    slug: "workplace-success",
    color: "amber",
  },
  // Financial Security
  {
    icon: Landmark,
    title: CATEGORY_NAMES.FINANCIAL_AID,
    description: "Navigate scholarships, grants, and education funding",
    path: "/resources/financial-aid",
    slug: "financial-aid",
    color: "indigo",
  },
  // Career Navigation
  {
    icon: TrendingUp,
    title: CATEGORY_NAMES.CAREER_TRANSITIONS,
    description: "Navigate career changes successfully",
    path: "/resources/career-transitions",
    slug: "career-transitions",
    color: "orange",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.NETWORKING,
    description: "Build connections and expand your professional network",
    path: "/resources/networking",
    slug: "networking",
    color: "pink",
  },
  // Job Seeking Tools
  {
    icon: Target,
    title: CATEGORY_NAMES.JOB_SEARCH,
    description: "Effective techniques to find and land opportunities",
    path: "/resources/job-search",
    slug: "job-search",
    color: "sky",
  },
  {
    icon: FileText,
    title: CATEGORY_NAMES.RESUME_COVER_LETTERS,
    description: "Templates and guides for professional applications",
    path: "/resources/resume-cover-letters",
    slug: "resume-cover-letters",
    color: "slate",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    description: "Practice questions and strategies to ace interviews",
    path: "/resources/interview-prep",
    slug: "interview-prep",
    color: "purple",
  },
  {
    icon: DollarSign,
    title: CATEGORY_NAMES.SALARY_NEGOTIATION,
    description: "Know your worth and negotiate with confidence",
    path: "/resources/salary-negotiation",
    slug: "salary-negotiation",
    color: "yellow",
  },
];

// Helper function to get path from category name
export function getCategoryPath(categoryName: string): string {
  const category = RESOURCE_CATEGORIES.find(
    (cat) => cat.title === categoryName,
  );
  return category?.path || "/resources";
}

// Helper function to get resources by category
export function getResourcesByCategory(categoryTitle: string): Resource[] {
  return ALL_RESOURCES.filter(
    (resource) => resource.category === categoryTitle,
  );
}

// Helper function to get resource count by category
export function getResourceCountByCategory(categoryTitle: string): number {
  return getResourcesByCategory(categoryTitle).length;
}

// Helper function to get category by path
export function getCategoryByPath(path: string): ResourceCategory | undefined {
  return RESOURCE_CATEGORIES.find((cat) => cat.path === path);
}

// Color style mappings for category theming
export const CATEGORY_COLOR_STYLES: Record<CategoryColor, {
  // Hero/header backgrounds
  gradient: string[];
  accent: string;
  // Card styling
  bg: string;
  bgHover: string;
  border: string;
  borderHover: string;
  // Icon styling
  iconBg: string;
  iconBorder: string;
  iconText: string;
  iconHoverText: string;
  // Badge styling
  badgeBg: string;
  badgeText: string;
  // CTA styling
  ctaFrom: string;
  ctaTo: string;
  ctaButtonText: string;
  ctaButtonHover: string;
  ctaButtonFocus: string;
  ctaButtonActive: string;
}> = {
  violet: {
    gradient: ["#f5f3ff", "#ede9fe", "#ddd6fe"],
    accent: "139, 92, 246",
    bg: "bg-violet-50",
    bgHover: "hover:bg-violet-50",
    border: "border-violet-200",
    borderHover: "hover:border-violet-400",
    iconBg: "bg-white",
    iconBorder: "border-violet-200",
    iconText: "text-violet-600",
    iconHoverText: "group-hover:text-violet-600",
    badgeBg: "bg-violet-100",
    badgeText: "text-violet-700",
    ctaFrom: "from-violet-500",
    ctaTo: "to-purple-600",
    ctaButtonText: "text-violet-700",
    ctaButtonHover: "hover:bg-violet-50",
    ctaButtonFocus: "focus-visible:ring-violet-400",
    ctaButtonActive: "active:bg-violet-100",
  },
  rose: {
    gradient: ["#fff1f2", "#ffe4e6", "#fecdd3"],
    accent: "244, 63, 94",
    bg: "bg-rose-50",
    bgHover: "hover:bg-rose-50",
    border: "border-rose-200",
    borderHover: "hover:border-rose-400",
    iconBg: "bg-white",
    iconBorder: "border-rose-200",
    iconText: "text-rose-600",
    iconHoverText: "group-hover:text-rose-600",
    badgeBg: "bg-rose-100",
    badgeText: "text-rose-700",
    ctaFrom: "from-rose-500",
    ctaTo: "to-pink-600",
    ctaButtonText: "text-rose-700",
    ctaButtonHover: "hover:bg-rose-50",
    ctaButtonFocus: "focus-visible:ring-rose-400",
    ctaButtonActive: "active:bg-rose-100",
  },
  lime: {
    gradient: ["#ecfccb", "#d9f99d", "#bef264"],
    accent: "163, 230, 53",
    bg: "bg-lime-50",
    bgHover: "hover:bg-lime-50",
    border: "border-lime-200",
    borderHover: "hover:border-lime-400",
    iconBg: "bg-white",
    iconBorder: "border-lime-200",
    iconText: "text-lime-600",
    iconHoverText: "group-hover:text-lime-600",
    badgeBg: "bg-lime-100",
    badgeText: "text-lime-700",
    ctaFrom: "from-lime-500",
    ctaTo: "to-green-600",
    ctaButtonText: "text-lime-700",
    ctaButtonHover: "hover:bg-lime-50",
    ctaButtonFocus: "focus-visible:ring-lime-400",
    ctaButtonActive: "active:bg-lime-100",
  },
  teal: {
    gradient: ["#ccfbf1", "#99f6e4", "#5eead4"],
    accent: "20, 184, 166",
    bg: "bg-teal-50",
    bgHover: "hover:bg-teal-50",
    border: "border-teal-200",
    borderHover: "hover:border-teal-400",
    iconBg: "bg-white",
    iconBorder: "border-teal-200",
    iconText: "text-teal-600",
    iconHoverText: "group-hover:text-teal-600",
    badgeBg: "bg-teal-100",
    badgeText: "text-teal-700",
    ctaFrom: "from-teal-500",
    ctaTo: "to-cyan-600",
    ctaButtonText: "text-teal-700",
    ctaButtonHover: "hover:bg-teal-50",
    ctaButtonFocus: "focus-visible:ring-teal-400",
    ctaButtonActive: "active:bg-teal-100",
  },
  emerald: {
    gradient: ["#d1fae5", "#a7f3d0", "#6ee7b7"],
    accent: "16, 185, 129",
    bg: "bg-emerald-50",
    bgHover: "hover:bg-emerald-50",
    border: "border-emerald-200",
    borderHover: "hover:border-emerald-400",
    iconBg: "bg-white",
    iconBorder: "border-emerald-200",
    iconText: "text-emerald-600",
    iconHoverText: "group-hover:text-emerald-600",
    badgeBg: "bg-emerald-100",
    badgeText: "text-emerald-700",
    ctaFrom: "from-emerald-500",
    ctaTo: "to-teal-600",
    ctaButtonText: "text-emerald-700",
    ctaButtonHover: "hover:bg-emerald-50",
    ctaButtonFocus: "focus-visible:ring-emerald-400",
    ctaButtonActive: "active:bg-emerald-100",
  },
  blue: {
    gradient: ["#dbeafe", "#bfdbfe", "#93c5fd"],
    accent: "59, 130, 246",
    bg: "bg-blue-50",
    bgHover: "hover:bg-blue-50",
    border: "border-blue-200",
    borderHover: "hover:border-blue-400",
    iconBg: "bg-white",
    iconBorder: "border-blue-200",
    iconText: "text-blue-600",
    iconHoverText: "group-hover:text-blue-600",
    badgeBg: "bg-blue-100",
    badgeText: "text-blue-700",
    ctaFrom: "from-blue-500",
    ctaTo: "to-indigo-600",
    ctaButtonText: "text-blue-700",
    ctaButtonHover: "hover:bg-blue-50",
    ctaButtonFocus: "focus-visible:ring-blue-400",
    ctaButtonActive: "active:bg-blue-100",
  },
  cyan: {
    gradient: ["#cffafe", "#a5f3fc", "#67e8f9"],
    accent: "6, 182, 212",
    bg: "bg-cyan-50",
    bgHover: "hover:bg-cyan-50",
    border: "border-cyan-200",
    borderHover: "hover:border-cyan-400",
    iconBg: "bg-white",
    iconBorder: "border-cyan-200",
    iconText: "text-cyan-600",
    iconHoverText: "group-hover:text-cyan-600",
    badgeBg: "bg-cyan-100",
    badgeText: "text-cyan-700",
    ctaFrom: "from-cyan-500",
    ctaTo: "to-blue-600",
    ctaButtonText: "text-cyan-700",
    ctaButtonHover: "hover:bg-cyan-50",
    ctaButtonFocus: "focus-visible:ring-cyan-400",
    ctaButtonActive: "active:bg-cyan-100",
  },
  amber: {
    gradient: ["#fef3c7", "#fde68a", "#fcd34d"],
    accent: "245, 158, 11",
    bg: "bg-amber-50",
    bgHover: "hover:bg-amber-50",
    border: "border-amber-200",
    borderHover: "hover:border-amber-400",
    iconBg: "bg-white",
    iconBorder: "border-amber-200",
    iconText: "text-amber-600",
    iconHoverText: "group-hover:text-amber-600",
    badgeBg: "bg-amber-100",
    badgeText: "text-amber-700",
    ctaFrom: "from-amber-500",
    ctaTo: "to-orange-600",
    ctaButtonText: "text-amber-700",
    ctaButtonHover: "hover:bg-amber-50",
    ctaButtonFocus: "focus-visible:ring-amber-400",
    ctaButtonActive: "active:bg-amber-100",
  },
  indigo: {
    gradient: ["#e0e7ff", "#c7d2fe", "#a5b4fc"],
    accent: "99, 102, 241",
    bg: "bg-indigo-50",
    bgHover: "hover:bg-indigo-50",
    border: "border-indigo-200",
    borderHover: "hover:border-indigo-400",
    iconBg: "bg-white",
    iconBorder: "border-indigo-200",
    iconText: "text-indigo-600",
    iconHoverText: "group-hover:text-indigo-600",
    badgeBg: "bg-indigo-100",
    badgeText: "text-indigo-700",
    ctaFrom: "from-indigo-500",
    ctaTo: "to-violet-600",
    ctaButtonText: "text-indigo-700",
    ctaButtonHover: "hover:bg-indigo-50",
    ctaButtonFocus: "focus-visible:ring-indigo-400",
    ctaButtonActive: "active:bg-indigo-100",
  },
  orange: {
    gradient: ["#ffedd5", "#fed7aa", "#fdba74"],
    accent: "249, 115, 22",
    bg: "bg-orange-50",
    bgHover: "hover:bg-orange-50",
    border: "border-orange-200",
    borderHover: "hover:border-orange-400",
    iconBg: "bg-white",
    iconBorder: "border-orange-200",
    iconText: "text-orange-600",
    iconHoverText: "group-hover:text-orange-600",
    badgeBg: "bg-orange-100",
    badgeText: "text-orange-700",
    ctaFrom: "from-orange-500",
    ctaTo: "to-red-600",
    ctaButtonText: "text-orange-700",
    ctaButtonHover: "hover:bg-orange-50",
    ctaButtonFocus: "focus-visible:ring-orange-400",
    ctaButtonActive: "active:bg-orange-100",
  },
  pink: {
    gradient: ["#fce7f3", "#fbcfe8", "#f9a8d4"],
    accent: "236, 72, 153",
    bg: "bg-pink-50",
    bgHover: "hover:bg-pink-50",
    border: "border-pink-200",
    borderHover: "hover:border-pink-400",
    iconBg: "bg-white",
    iconBorder: "border-pink-200",
    iconText: "text-pink-600",
    iconHoverText: "group-hover:text-pink-600",
    badgeBg: "bg-pink-100",
    badgeText: "text-pink-700",
    ctaFrom: "from-pink-500",
    ctaTo: "to-rose-600",
    ctaButtonText: "text-pink-700",
    ctaButtonHover: "hover:bg-pink-50",
    ctaButtonFocus: "focus-visible:ring-pink-400",
    ctaButtonActive: "active:bg-pink-100",
  },
  sky: {
    gradient: ["#e0f2fe", "#bae6fd", "#7dd3fc"],
    accent: "14, 165, 233",
    bg: "bg-sky-50",
    bgHover: "hover:bg-sky-50",
    border: "border-sky-200",
    borderHover: "hover:border-sky-400",
    iconBg: "bg-white",
    iconBorder: "border-sky-200",
    iconText: "text-sky-600",
    iconHoverText: "group-hover:text-sky-600",
    badgeBg: "bg-sky-100",
    badgeText: "text-sky-700",
    ctaFrom: "from-sky-500",
    ctaTo: "to-blue-600",
    ctaButtonText: "text-sky-700",
    ctaButtonHover: "hover:bg-sky-50",
    ctaButtonFocus: "focus-visible:ring-sky-400",
    ctaButtonActive: "active:bg-sky-100",
  },
  slate: {
    gradient: ["#f1f5f9", "#e2e8f0", "#cbd5e1"],
    accent: "100, 116, 139",
    bg: "bg-slate-50",
    bgHover: "hover:bg-slate-50",
    border: "border-slate-200",
    borderHover: "hover:border-slate-400",
    iconBg: "bg-white",
    iconBorder: "border-slate-200",
    iconText: "text-slate-600",
    iconHoverText: "group-hover:text-slate-600",
    badgeBg: "bg-slate-100",
    badgeText: "text-slate-700",
    ctaFrom: "from-slate-500",
    ctaTo: "to-gray-600",
    ctaButtonText: "text-slate-700",
    ctaButtonHover: "hover:bg-slate-50",
    ctaButtonFocus: "focus-visible:ring-slate-400",
    ctaButtonActive: "active:bg-slate-100",
  },
  purple: {
    gradient: ["#faf5ff", "#f3e8ff", "#e9d5ff"],
    accent: "168, 85, 247",
    bg: "bg-purple-50",
    bgHover: "hover:bg-purple-50",
    border: "border-purple-200",
    borderHover: "hover:border-purple-400",
    iconBg: "bg-white",
    iconBorder: "border-purple-200",
    iconText: "text-purple-600",
    iconHoverText: "group-hover:text-purple-600",
    badgeBg: "bg-purple-100",
    badgeText: "text-purple-700",
    ctaFrom: "from-purple-500",
    ctaTo: "to-violet-600",
    ctaButtonText: "text-purple-700",
    ctaButtonHover: "hover:bg-purple-50",
    ctaButtonFocus: "focus-visible:ring-purple-400",
    ctaButtonActive: "active:bg-purple-100",
  },
  yellow: {
    gradient: ["#fefce8", "#fef9c3", "#fef08a"],
    accent: "234, 179, 8",
    bg: "bg-yellow-50",
    bgHover: "hover:bg-yellow-50",
    border: "border-yellow-200",
    borderHover: "hover:border-yellow-400",
    iconBg: "bg-white",
    iconBorder: "border-yellow-200",
    iconText: "text-yellow-600",
    iconHoverText: "group-hover:text-yellow-600",
    badgeBg: "bg-yellow-100",
    badgeText: "text-yellow-700",
    ctaFrom: "from-yellow-500",
    ctaTo: "to-amber-600",
    ctaButtonText: "text-yellow-700",
    ctaButtonHover: "hover:bg-yellow-50",
    ctaButtonFocus: "focus-visible:ring-yellow-400",
    ctaButtonActive: "active:bg-yellow-100",
  },
};
