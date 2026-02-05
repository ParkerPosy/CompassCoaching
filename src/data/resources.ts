import type { LucideIcon } from "lucide-react";
import {
  BookOpen,
  DollarSign,
  GraduationCap,
  FileText,
  Wrench,
  TrendingUp,
  Briefcase,
  Users,
  Target,
  Book,
  Award,
} from "lucide-react";

export interface Resource {
  title: string;
  type: string;
  duration: string;
  category: string;
}

export interface ResourceCategory {
  icon: LucideIcon;
  title: string;
  description: string;
  path: string;
  slug: string;
}

// Resource types
export const RESOURCE_TYPES = {
  TOOL: "Tool",
  GUIDE: "Guide",
  ARTICLE: "Article",
  TEMPLATE: "Template",
  WORKSHEET: "Worksheet",
  RESOURCE: "Resource",
  COURSE: "Course",
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
  INDUSTRY_INSIGHTS: "Industry Insights",
  TOOLS_TEMPLATES: "Tools & Templates",
  SKILLS_DEVELOPMENT: "Skills Development",
} as const;

// Master list of all resources - single source of truth
export const ALL_RESOURCES: Resource[] = [
  // Career Exploration (6)
  {
    title: "Career Interest Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Industry Overview Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Day in the Life Series",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Career Path Roadmaps",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Job Shadow Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },
  {
    title: "Informational Interview Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_EXPLORATION,
  },

  // Resume & Cover Letters (6)
  {
    title: "Modern Resume Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Resume Writing Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Cover Letter Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Action Words & Phrases",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "10 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "Resume Review Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },
  {
    title: "ATS Optimization Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.RESUME_COVER_LETTERS,
  },

  // Interview Preparation (6)
  {
    title: "Common Interview Questions",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "STAR Method Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Phone Interview Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Video Interview Setup",
    type: RESOURCE_TYPES.GUIDE,
    duration: "15 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Thank You Note Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },
  {
    title: "Interview Outfit Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "10 min",
    category: CATEGORY_NAMES.INTERVIEW_PREPARATION,
  },

  // Job Search Strategies (6)
  {
    title: "Job Search Strategy Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Job Board Directory",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Application Tracker Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "LinkedIn Optimization",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Hidden Job Market Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },
  {
    title: "Job Search Timeline",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.JOB_SEARCH,
  },

  // Professional Development (6)
  {
    title: "Professional Development Plan",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Leadership Skills Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Communication Skills Workshop",
    type: RESOURCE_TYPES.COURSE,
    duration: "2 hours",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Time Management Strategies",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Mentorship Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },
  {
    title: "Certification Directory",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "10 min",
    category: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
  },

  // Networking (6)
  {
    title: "Networking Fundamentals",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "LinkedIn Networking Strategy",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Elevator Pitch Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Networking Event Checklist",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "5 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Cold Email Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.NETWORKING,
  },
  {
    title: "Alumni Network Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.NETWORKING,
  },

  // Salary & Negotiation (6)
  {
    title: "Salary Negotiation Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Salary Research Tools",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Negotiation Script Templates",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Benefits Comparison Worksheet",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Counter Offer Guide",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "15 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },
  {
    title: "Raise Request Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "10 min",
    category: CATEGORY_NAMES.SALARY_NEGOTIATION,
  },

  // Education & Training (6)
  {
    title: "Education Pathways Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Online Learning Platforms",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Certification Roadmaps",
    type: RESOURCE_TYPES.GUIDE,
    duration: "20 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Financial Aid Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Bootcamp Comparison Tool",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },
  {
    title: "Learning Style Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "10 min",
    category: CATEGORY_NAMES.EDUCATION_TRAINING,
  },

  // Career Transitions (6)
  {
    title: "Career Change Roadmap",
    type: RESOURCE_TYPES.GUIDE,
    duration: "35 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Transferable Skills Worksheet",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "15 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Industry Switcher Stories",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Gap Year Planning Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Return to Work Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },
  {
    title: "Entrepreneurship Starter",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "40 min",
    category: CATEGORY_NAMES.CAREER_TRANSITIONS,
  },

  // Industry Insights (6)
  {
    title: "Tech Industry Overview",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },
  {
    title: "Healthcare Career Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },
  {
    title: "Finance & Banking Careers",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },
  {
    title: "Creative Industries Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },
  {
    title: "Trade & Manufacturing",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },
  {
    title: "Emerging Industries",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "30 min",
    category: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
  },

  // Tools & Templates (6)
  {
    title: "Career Planning Workbook",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "30 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },
  {
    title: "Budget Calculator",
    type: RESOURCE_TYPES.TOOL,
    duration: "10 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },
  {
    title: "Interview Prep Tracker",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "5 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },
  {
    title: "Skills Inventory Worksheet",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "20 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },
  {
    title: "Goal Setting Template",
    type: RESOURCE_TYPES.TEMPLATE,
    duration: "15 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },
  {
    title: "Professional Bio Generator",
    type: RESOURCE_TYPES.TOOL,
    duration: "10 min",
    category: CATEGORY_NAMES.TOOLS_TEMPLATES,
  },

  // Skills Development (6)
  {
    title: "In-Demand Skills 2026",
    type: RESOURCE_TYPES.ARTICLE,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Technical Skills Roadmap",
    type: RESOURCE_TYPES.GUIDE,
    duration: "30 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Soft Skills Assessment",
    type: RESOURCE_TYPES.TOOL,
    duration: "15 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Learning Resources Directory",
    type: RESOURCE_TYPES.RESOURCE,
    duration: "10 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Project Portfolio Guide",
    type: RESOURCE_TYPES.GUIDE,
    duration: "25 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
  {
    title: "Skill Gap Analysis",
    type: RESOURCE_TYPES.WORKSHEET,
    duration: "20 min",
    category: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
  },
];

// Category metadata - derived from resources
export const RESOURCE_CATEGORIES: ResourceCategory[] = [
  {
    icon: GraduationCap,
    title: CATEGORY_NAMES.CAREER_EXPLORATION,
    description: "Discover careers that match your interests and skills",
    path: "/resources/career-exploration",
    slug: "career-exploration",
  },
  {
    icon: FileText,
    title: CATEGORY_NAMES.RESUME_COVER_LETTERS,
    description: "Templates and guides for professional applications",
    path: "/resources/resume-cover-letters",
    slug: "resume-cover-letters",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.INTERVIEW_PREPARATION,
    description: "Practice questions and strategies to ace interviews",
    path: "/resources/interview-prep",
    slug: "interview-prep",
  },
  {
    icon: Target,
    title: CATEGORY_NAMES.JOB_SEARCH,
    description: "Effective techniques to find and land opportunities",
    path: "/resources/job-search",
    slug: "job-search",
  },
  {
    icon: Briefcase,
    title: CATEGORY_NAMES.PROFESSIONAL_DEVELOPMENT,
    description: "Build skills and advance your career",
    path: "/resources/professional-development",
    slug: "professional-development",
  },
  {
    icon: Users,
    title: CATEGORY_NAMES.NETWORKING,
    description: "Build connections and expand your professional network",
    path: "/resources/networking",
    slug: "networking",
  },
  {
    icon: DollarSign,
    title: CATEGORY_NAMES.SALARY_NEGOTIATION,
    description: "Know your worth and negotiate with confidence",
    path: "/resources/salary-negotiation",
    slug: "salary-negotiation",
  },
  {
    icon: Book,
    title: CATEGORY_NAMES.EDUCATION_TRAINING,
    description: "Find programs, certifications, and courses",
    path: "/resources/education-training",
    slug: "education-training",
  },
  {
    icon: TrendingUp,
    title: CATEGORY_NAMES.CAREER_TRANSITIONS,
    description: "Navigate career changes successfully",
    path: "/resources/career-transitions",
    slug: "career-transitions",
  },
  {
    icon: Award,
    title: CATEGORY_NAMES.INDUSTRY_INSIGHTS,
    description: "Trends and opportunities by sector",
    path: "/resources/industry-insights",
    slug: "industry-insights",
  },
  {
    icon: Wrench,
    title: CATEGORY_NAMES.TOOLS_TEMPLATES,
    description: "Downloadable resources for career planning",
    path: "/resources/tools-templates",
    slug: "tools-templates",
  },
  {
    icon: BookOpen,
    title: CATEGORY_NAMES.SKILLS_DEVELOPMENT,
    description: "Resources to build in-demand skills",
    path: "/resources/skills-development",
    slug: "skills-development",
  },
];

// Helper function to get path from category name
export function getCategoryPath(categoryName: string): string {
  const category = RESOURCE_CATEGORIES.find((cat) => cat.title === categoryName);
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
