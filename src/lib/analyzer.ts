/**
 * Assessment analysis service
 * Analyzes user responses and generates insights
 */

import type {
  AptitudeData,
  AssessmentAnalysis,
  AssessmentResults,
  ValueRatings,
} from "@/types/assessment";

const CAREER_FIELDS = {
  stem: {
    title: "STEM (Science, Technology, Engineering, Math)",
    description:
      "Careers in technology, engineering, mathematics, and scientific research",
    careers: [
      "Software Engineer",
      "Data Scientist",
      "Mechanical Engineer",
      "Research Scientist",
    ],
  },
  arts: {
    title: "Arts & Creative Fields",
    description: "Careers in visual arts, design, writing, and performance",
    careers: ["Graphic Designer", "Content Writer", "Art Director", "Musician"],
  },
  communication: {
    title: "Communication & Media",
    description:
      "Careers in media, marketing, journalism, and public relations",
    careers: [
      "Marketing Manager",
      "Journalist",
      "Public Relations Specialist",
      "Content Strategist",
    ],
  },
  business: {
    title: "Business & Finance",
    description:
      "Careers in business management, finance, and entrepreneurship",
    careers: [
      "Business Analyst",
      "Financial Advisor",
      "Project Manager",
      "Entrepreneur",
    ],
  },
  healthcare: {
    title: "Healthcare & Medicine",
    description: "Careers in medical care, research, and wellness",
    careers: [
      "Registered Nurse",
      "Physical Therapist",
      "Medical Researcher",
      "Healthcare Administrator",
    ],
  },
  trades: {
    title: "Skilled Trades",
    description: "Careers in construction, repair, and hands-on technical work",
    careers: [
      "Electrician",
      "HVAC Technician",
      "Carpenter",
      "Automotive Technician",
    ],
  },
  socialServices: {
    title: "Social Services & Education",
    description: "Careers in teaching, counseling, and community support",
    careers: [
      "Teacher",
      "Social Worker",
      "School Counselor",
      "Community Organizer",
    ],
  },
  law: {
    title: "Law, Policy & Public Service",
    description: "Careers in legal services, government, and advocacy",
    careers: [
      "Lawyer",
      "Policy Analyst",
      "Police Officer",
      "Environmental Advocate",
    ],
  },
};

const VALUE_LABELS: Record<string, string> = {
  work_life_balance: "Work-Life Balance",
  income_potential: "High Income Potential",
  helping_others: "Helping Others",
  creativity: "Creativity & Innovation",
  job_security: "Job Security & Stability",
  independence: "Independence & Autonomy",
  leadership: "Leadership Opportunities",
  learning_growth: "Learning & Growth",
  recognition: "Recognition & Achievement",
  physical_activity: "Physical Activity",
  environmental_impact: "Environmental Impact",
  variety: "Variety & Change",
  motivation_driver: "Purpose & Meaning",
};

/**
 * Calculate average score for each career field
 */
function analyzeAptitudes(
  aptitude: AptitudeData,
): Array<{ field: string; score: number; description: string }> {
  const scores = Object.entries(aptitude).map(([key, ratings]) => {
    const average =
      ratings.reduce((sum: number, rating: number) => sum + rating, 0) /
      ratings.length;
    const fieldInfo = CAREER_FIELDS[key as keyof typeof CAREER_FIELDS];

    return {
      field: fieldInfo.title,
      score: Math.round(average * 20), // Convert to 0-100 scale
      description: fieldInfo.description,
      careers: fieldInfo.careers,
    };
  });

  // Sort by score descending
  return scores.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Identify top values
 */
function analyzeValues(
  values: ValueRatings,
): Array<{ value: string; score: number }> {
  const scores = Object.entries(values).map(([key, score]) => ({
    value: VALUE_LABELS[key] || key,
    score: score * 20, // Convert to 0-100 scale
  }));

  return scores.sort((a, b) => b.score - a.score).slice(0, 5);
}

/**
 * Generate personality insights based on responses
 */
function analyzePersonality(personality: Record<string, number>): string[] {
  const insights: string[] = [];

  // Work environment preference
  const workEnv = personality.work_environment;
  if (workEnv === 1)
    insights.push("You thrive in structured, traditional work environments");
  if (workEnv === 2)
    insights.push("You value flexibility and remote work opportunities");
  if (workEnv === 3)
    insights.push("You prefer outdoor or field-based work settings");
  if (workEnv === 4) insights.push("You enjoy variety in your work location");

  // Interaction style
  const interaction = personality.interaction_style;
  if (interaction === 1)
    insights.push("You work best independently with minimal collaboration");
  if (interaction === 2) insights.push("You excel in small team environments");
  if (interaction === 3)
    insights.push("You thrive in larger team settings with clear roles");
  if (interaction === 4)
    insights.push("You energize from frequent interactions with new people");

  // Decision making
  const decision = personality.decision_making;
  if (decision === 1)
    insights.push("You prefer data-driven, analytical decision making");
  if (decision === 2)
    insights.push("You trust your intuition when making decisions");
  if (decision === 3)
    insights.push("You value collaborative decision-making processes");

  // Learning style
  const learning = personality.learning_style;
  if (learning === 1)
    insights.push("You learn best through hands-on practice and experimentation");
  if (learning === 2)
    insights.push("You prefer self-directed research and reading to build understanding");
  if (learning === 3)
    insights.push("Visual demonstrations and video tutorials resonate most with you");
  if (learning === 4)
    insights.push("You thrive in structured classroom environments with direct instruction");

  // Stress tolerance
  const stress = personality.stress_tolerance;
  if (stress === 1)
    insights.push("You thrive under pressure and perform well with tight deadlines");
  if (stress === 2)
    insights.push("You handle stress well but prefer a steady, manageable pace");
  if (stress === 3)
    insights.push("You prefer low-pressure environments with predictable demands");

  // Tech comfort
  const tech = personality.tech_comfort;
  if (tech === 1)
    insights.push("You're a tech-forward learner — eager to adopt new tools and platforms");
  if (tech === 3 || tech === 4)
    insights.push("You prefer roles with minimal technology reliance");

  // Conflict resolution
  const conflict = personality.conflict_resolution;
  if (conflict === 1)
    insights.push("Your direct communication style suits management and advocacy roles");
  if (conflict === 2)
    insights.push("You naturally seek compromise, valuable for team coordination and mediation");

  return insights.slice(0, 7);
}

/**
 * Generate personalized recommendations
 */
function generateRecommendations(
  results: AssessmentResults,
  analysis: Partial<AssessmentAnalysis>,
): string[] {
  const recommendations: string[] = [];
  const { basic, challenges } = results;

  // Education-based recommendations
  if (
    basic.educationLevel === "high-school" ||
    basic.educationLevel === "hs-graduate"
  ) {
    recommendations.push(
      "Consider exploring community college programs or trade schools aligned with your interests",
    );
  }
  if (
    basic.educationLevel === "some-college" ||
    basic.educationLevel === "associates"
  ) {
    recommendations.push(
      "Look into completing your degree or pursuing certifications in your top career fields",
    );
  }

  // Financial considerations
  if (
    challenges.financial === "very-limited" ||
    challenges.financial === "limited"
  ) {
    recommendations.push(
      "Research scholarship opportunities and financial aid programs",
    );
    recommendations.push(
      "Consider careers with apprenticeship or on-the-job training options",
    );
  }

  // Learning style recommendations
  const learningStyle = results.personality?.learning_style;
  if (learningStyle === 1) {
    recommendations.push(
      "Prioritize apprenticeships, internships, and hands-on training programs over lecture-based education",
    );
  } else if (learningStyle === 4) {
    recommendations.push(
      "Structured classroom programs at community colleges or trade schools may suit your learning style best",
    );
  }

  // Timeline-aware recommendations
  const timeline = challenges.timelineUrgency;
  if (timeline === 'immediately' || timeline === 'within-3-months') {
    recommendations.push(
      "Focus on careers with short entry paths — certifications and positions that value transferable skills over formal degrees",
    );
  }

  // Top field recommendations
  if (analysis.topCareerFields && analysis.topCareerFields.length > 0) {
    const topField = analysis.topCareerFields[0];
    recommendations.push(
      `Explore entry-level positions in ${topField.field} to gain hands-on experience`,
    );
  }

  return recommendations.slice(0, 6);
}

/**
 * Generate next steps
 */
function generateNextSteps(results: AssessmentResults): string[] {
  const steps = [
    "Review your results and identify 2-3 career fields that resonate most with you",
    "Research specific job titles within your top career fields",
    "Connect with professionals in your areas of interest for informational interviews",
    "Explore educational pathways required for your target careers",
    "Create a 90-day action plan with specific, measurable goals",
  ];

  // Add employment-specific steps
  if (
    results.basic.employmentStatus === "unemployed" ||
    results.basic.employmentStatus === "student"
  ) {
    steps.push(
      "Consider volunteer or internship opportunities to build experience",
    );
  }

  return steps.slice(0, 5);
}

/**
 * Main analysis function
 */
export function analyzeAssessment(
  results: AssessmentResults,
): AssessmentAnalysis {
  const topCareerFields = analyzeAptitudes(results.aptitude);
  const topValues = analyzeValues(results.values);
  const personalityInsights = analyzePersonality(results.personality);

  const analysis: AssessmentAnalysis = {
    topCareerFields,
    topValues,
    personalityInsights,
    recommendations: [],
    nextSteps: [],
  };

  analysis.recommendations = generateRecommendations(results, analysis);
  analysis.nextSteps = generateNextSteps(results);

  return analysis;
}
