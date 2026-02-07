import { useState, useRef, useEffect, useMemo } from 'react';
import { useInfiniteQuery } from '@tanstack/react-query';
import { TrendingUp, Briefcase, DollarSign, GraduationCap, MapPin, ChevronDown, ChevronUp, Sparkles, Loader2 } from 'lucide-react';
import type { AssessmentResults } from '@/types/assessment';
import { fetchCareerMatches } from '@/lib/occupationService';
import { formatCurrency, formatEducationLevel } from '@/lib/wages';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';

interface CareerMatchesTableProps {
  assessmentResults: AssessmentResults;
  selectedCounty?: string;
}

const PAGE_SIZE = 30;

export function CareerMatchesTable({
  assessmentResults,
  selectedCounty,
}: CareerMatchesTableProps) {
  const [expandedRows, setExpandedRows] = useState<Set<string>>(new Set());
  const [isVisible, setIsVisible] = useState(false);
  const sentinelRef = useRef<HTMLDivElement>(null);
  const loadMoreRef = useRef<HTMLDivElement>(null);

  // IntersectionObserver to detect when component enters viewport
  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsVisible(true);
          observer.disconnect();
        }
      },
      { threshold: 0.1 }
    );

    if (sentinelRef.current) {
      observer.observe(sentinelRef.current);
    }

    return () => observer.disconnect();
  }, []);

  // useInfiniteQuery for paginated data - the canonical way to handle infinite scroll
  const {
    data,
    isLoading,
    isFetchingNextPage,
    hasNextPage,
    fetchNextPage,
  } = useInfiniteQuery({
    queryKey: ['career-matches', assessmentResults.id, selectedCounty],
    queryFn: async ({ pageParam = 0 }) => {
      const result = await fetchCareerMatches({
        data: {
          assessment: assessmentResults,
          offset: pageParam,
          limit: PAGE_SIZE,
          county: selectedCounty,
        }
      });
      return result;
    },
    initialPageParam: 0,
    getNextPageParam: (lastPage, allPages) => {
      // Return the next offset if there are more results
      if (!lastPage.hasMore) return undefined;
      return allPages.length * PAGE_SIZE;
    },
    enabled: isVisible,
    staleTime: Number.POSITIVE_INFINITY,
  });

  // Flatten all pages into a single array
  const matches = useMemo(() => {
    return data?.pages.flatMap(page => page.matches) ?? [];
  }, [data]);

  const total = data?.pages[0]?.total ?? 0;

  // IntersectionObserver to trigger loading more when sentinel is visible
  useEffect(() => {
    if (!hasNextPage || isFetchingNextPage || matches.length === 0) return;

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting && hasNextPage && !isFetchingNextPage) {
          fetchNextPage();
        }
      },
      { threshold: 0 }
    );

    if (loadMoreRef.current) {
      observer.observe(loadMoreRef.current);
    }

    return () => observer.disconnect();
  }, [hasNextPage, isFetchingNextPage, matches.length, fetchNextPage]);

  const toggleRow = (occupationId: string) => {
    setExpandedRows(prev => {
      const newExpanded = new Set(prev);
      if (newExpanded.has(occupationId)) {
        newExpanded.delete(occupationId);
      } else {
        newExpanded.add(occupationId);
      }
      return newExpanded;
    });
  };

  const getMatchColor = (score: number) => {
    if (score >= 75) return 'text-emerald-600 bg-emerald-50';
    if (score >= 60) return 'text-teal-600 bg-teal-50';
    if (score >= 50) return 'text-blue-600 bg-blue-50';
    if (score >= 40) return 'text-amber-600 bg-amber-50';
    return 'text-stone-600 bg-stone-50';
  };

  const getMatchBadge = (score: number) => {
    if (score >= 80) return { label: 'Excellent Match', color: 'bg-emerald-600' };
    if (score >= 65) return { label: 'Strong Match', color: 'bg-teal-600' };
    if (score >= 55) return { label: 'Good Match', color: 'bg-blue-600' };
    if (score >= 45) return { label: 'Potential Match', color: 'bg-amber-500' };
    return { label: 'Worth Exploring', color: 'bg-stone-500' };
  };

  // Get color based on match reason category
  const getReasonColor = (reason: string) => {
    const lowerReason = reason.toLowerCase();
    if (lowerReason.includes('aptitude') || lowerReason.includes('stem') || lowerReason.includes('arts') || lowerReason.includes('communication') || lowerReason.includes('business') || lowerReason.includes('healthcare') || lowerReason.includes('trades') || lowerReason.includes('social') || lowerReason.includes('law')) {
      return { bg: 'bg-violet-50', text: 'text-violet-700', border: 'border-violet-200', icon: 'text-violet-500' };
    }
    if (lowerReason.includes('work style') || lowerReason.includes('environment')) {
      return { bg: 'bg-blue-50', text: 'text-blue-700', border: 'border-blue-200', icon: 'text-blue-500' };
    }
    if (lowerReason.includes('schedule') || lowerReason.includes('travel') || lowerReason.includes('physical')) {
      return { bg: 'bg-cyan-50', text: 'text-cyan-700', border: 'border-cyan-200', icon: 'text-cyan-500' };
    }
    if (lowerReason.includes('value') || lowerReason.includes('alignment')) {
      return { bg: 'bg-amber-50', text: 'text-amber-700', border: 'border-amber-200', icon: 'text-amber-500' };
    }
    if (lowerReason.includes('skill')) {
      return { bg: 'bg-rose-50', text: 'text-rose-700', border: 'border-rose-200', icon: 'text-rose-500' };
    }
    // Default teal for unrecognized
    return { bg: 'bg-teal-50', text: 'text-teal-700', border: 'border-teal-200', icon: 'text-teal-500' };
  };

  // Get color for skill badge based on skill level
  const getSkillColor = (value: number) => {
    if (value >= 9) return 'bg-violet-100 border-violet-300 text-violet-800';
    if (value >= 8) return 'bg-blue-100 border-blue-300 text-blue-800';
    return 'bg-stone-100 border-stone-300 text-stone-700';
  };

  // Sentinel for lazy loading - renders before data loads
  if (!isVisible) {
    return (
      <div ref={sentinelRef} className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden min-h-[200px] flex items-center justify-center">
        <div className="text-center text-stone-500">
          <Sparkles className="w-8 h-8 mx-auto mb-2 opacity-50" />
          <p className="text-sm">Scroll to view career matches</p>
        </div>
      </div>
    );
  }

  // Loading state
  if (isLoading) {
    return (
      <div ref={sentinelRef} className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden min-h-[200px] flex items-center justify-center">
        <div className="text-center">
          <Loader2 className="w-8 h-8 animate-spin text-emerald-600 mx-auto mb-2" />
          <p className="text-sm text-stone-600">Finding your career matches...</p>
        </div>
      </div>
    );
  }

  if (matches.length === 0) {
    return (
      <div ref={sentinelRef} className="text-center py-12">
        <Sparkles className="w-12 h-12 text-stone-400 mx-auto mb-4" />
        <h3 className="text-xl font-semibold text-stone-700 mb-2">
          Building Your Matches
        </h3>
        <p className="text-stone-600 mb-4">
          We're still learning about your preferences. Try completing more of the assessment
          or explore the full careers list.
        </p>
        <a
          href="/careers"
          className="inline-flex items-center gap-2 text-blue-600 hover:text-blue-800 font-medium"
        >
          Browse All Careers →
        </a>
      </div>
    );
  }

  return (
    <div ref={sentinelRef} className="bg-white rounded-xl border border-stone-200 shadow-lg overflow-hidden">
      {/* Header */}
      <div className="bg-gradient-to-r from-lime-50 via-lime-100/50 to-stone-50 border-b border-lime-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h3 className="text-lg font-semibold text-stone-900">
              Found {total} Career Match{total !== 1 ? 'es' : ''}
            </h3>
            <p className="text-sm text-stone-600">
              Based on your assessment results {selectedCounty && `• Showing ${selectedCounty} County wages`}
            </p>
          </div>
          <div className="flex items-center gap-2 bg-white px-3 py-1.5 rounded-full border border-lime-300">
            <Sparkles className="w-4 h-4 text-lime-600" />
            <span className="text-sm font-medium text-lime-700">Personalized</span>
          </div>
        </div>
      </div>

      {/* Scrollable Career Cards Container */}
      <div className="max-h-[600px] overflow-y-auto">
        <div className="p-4 space-y-3">
          {matches.map((match, index) => {
            const isExpanded = expandedRows.has(match.id);
            const matchBadge = getMatchBadge(match.matchScore);
            const wageData = selectedCounty
              ? match.wages.byCounty.find((c) => c.county === selectedCounty)?.wages ||
                match.wages.statewide
              : match.wages.statewide;

          return (
            <div key={match.id}>
              {/* Sentinel for infinite scroll - placed at 3rd to last item to trigger early loading */}
              {hasNextPage && index === matches.length - 3 && (
                <div ref={loadMoreRef} className="h-0" />
              )}
              <div className="bg-white rounded-lg shadow-sm border border-stone-200 hover:border-emerald-300 hover:shadow-md transition-all duration-200">
              {/* Main Row */}
              <div
                className="p-5 cursor-pointer"
                onClick={() => toggleRow(match.id)}
              >
                <div className="flex items-start gap-4">
                  {/* Match Score */}
                  <div className="shrink-0">
                    <div
                      className={`w-16 h-16 rounded-full flex flex-col items-center justify-center ${getMatchColor(match.matchScore)} border-2 ${match.matchScore >= 80 ? 'border-emerald-400' : 'border-stone-300'}`}
                    >
                      <span className="text-2xl font-bold">{match.matchScore}</span>
                      <span className="text-[10px] font-semibold uppercase">Match</span>
                    </div>
                  </div>

                  {/* Career Info */}
                  <div className="flex-1 min-w-0">
                    <div className="flex items-start justify-between gap-4 mb-2">
                      <div className="flex-1">
                        <div className="flex items-center gap-2 mb-1">
                          {index < 3 && (
                            <Badge variant="primary" size="sm">
                              Top {index + 1}
                            </Badge>
                          )}
                          <span
                            className={`text-xs font-bold ${matchBadge.color} text-white px-2 py-0.5 rounded-full`}
                          >
                            {matchBadge.label}
                          </span>
                        </div>
                        <h4 className="text-lg font-bold text-stone-900 mb-1">
                          {match.title}
                        </h4>
                        <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-stone-600">
                          <div className="flex items-center gap-1.5">
                            <GraduationCap className="w-4 h-4 text-indigo-500" />
                            <span className="text-indigo-700">{formatEducationLevel(match.educationLevel)}</span>
                          </div>
                          <div className="flex items-center gap-1.5">
                            <span className="font-semibold text-emerald-700">
                              {formatCurrency(wageData.annual.median)} median
                            </span>
                          </div>
                          {selectedCounty && (
                            <div className="flex items-center gap-1.5">
                              <MapPin className="w-4 h-4 text-sky-500" />
                              <span className="text-sky-700">{selectedCounty} County</span>
                            </div>
                          )}
                        </div>
                      </div>

                      {/* Expand Icon */}
                      <Button
                        variant="ghost"
                        size="sm"
                        className="shrink-0"
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleRow(match.id);
                        }}
                      >
                        {isExpanded ? (
                          <ChevronUp className="w-5 h-5" />
                        ) : (
                          <ChevronDown className="w-5 h-5" />
                        )}
                      </Button>
                    </div>

                    {/* Match Reasons */}
                    {match.matchReasons.length > 0 && (
                      <div className="flex flex-wrap gap-2 mt-3">
                        {match.matchReasons.map((reason, idx) => {
                          const colors = getReasonColor(reason);
                          return (
                            <span
                              key={idx}
                              className={`inline-flex items-center gap-1 text-xs ${colors.bg} ${colors.text} px-2 py-1 rounded-full border ${colors.border}`}
                            >
                              <TrendingUp className={`w-3 h-3 ${colors.icon}`} />
                              {reason}
                            </span>
                          );
                        })}
                      </div>
                    )}
                  </div>
                </div>
              </div>

              {/* Expanded Details */}
              {isExpanded && match.metadata && (
                <div className="border-t border-stone-200 bg-stone-50/50 p-5">
                  <div className="grid md:grid-cols-2 gap-6">
                    {/* Salary Details */}
                    <div>
                      <h5 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                        <DollarSign className="w-4 h-4 text-green-600" />
                        Salary Range {selectedCounty && `(${selectedCounty} County)`}
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-slate-50">
                          <span className="text-stone-600">Entry Level:</span>
                          <span className="font-semibold text-slate-700">
                            {formatCurrency(wageData.annual.entry)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center bg-emerald-50 px-2 py-1 rounded">
                          <span className="text-emerald-800 font-medium">Median:</span>
                          <span className="font-bold text-emerald-700">
                            {formatCurrency(wageData.annual.median)}
                          </span>
                        </div>
                        <div className="flex justify-between items-center py-1 px-2 rounded bg-violet-50">
                          <span className="text-violet-700">Experienced:</span>
                          <span className="font-semibold text-violet-700">
                            {formatCurrency(wageData.annual.experienced)}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Career Outlook */}
                    <div>
                      <h5 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                        <TrendingUp className="w-4 h-4 text-blue-600" />
                        Career Outlook
                      </h5>
                      <div className="space-y-2 text-sm">
                        <div className="flex justify-between items-center">
                          <span className="text-stone-600">Growth:</span>
                          <span className={`font-semibold capitalize px-2 py-0.5 rounded ${
                            match.metadata.outlook.growth === 'growing' || match.metadata.outlook.growth === 'much_faster_than_average'
                              ? 'bg-emerald-100 text-emerald-700'
                              : match.metadata.outlook.growth === 'stable'
                              ? 'bg-blue-100 text-blue-700'
                              : 'bg-amber-100 text-amber-700'
                          }`}>
                            {match.metadata.outlook.growth.replace(/_/g, ' ')}
                          </span>
                        </div>
                        <div className="flex justify-between items-center">
                          <span className="text-stone-600">Automation Risk:</span>
                          <span className={`font-semibold capitalize px-2 py-0.5 rounded ${
                            match.metadata.outlook.automationRisk === 'low'
                              ? 'bg-emerald-100 text-emerald-700'
                              : match.metadata.outlook.automationRisk === 'medium'
                              ? 'bg-amber-100 text-amber-700'
                              : 'bg-rose-100 text-rose-700'
                          }`}>
                            {match.metadata.outlook.automationRisk}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Work Environment */}
                    <div>
                      <h5 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                        <Briefcase className="w-4 h-4 text-purple-600" />
                        Work Environment
                      </h5>
                      <div className="space-y-3 text-sm">
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-600 shrink-0">Setting:</span>
                          {match.metadata.workEnvironment.setting.map((s, i) => (
                            <span key={i} className="bg-purple-50 text-purple-700 px-2 py-0.5 rounded capitalize text-xs font-medium border border-purple-200">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <span className="text-stone-600 shrink-0">Schedule:</span>
                          {match.metadata.workEnvironment.schedule.map((s, i) => (
                            <span key={i} className="bg-cyan-50 text-cyan-700 px-2 py-0.5 rounded capitalize text-xs font-medium border border-cyan-200">
                              {s}
                            </span>
                          ))}
                        </div>
                        <div className="flex items-center gap-2">
                          <span className="text-stone-600">Physical:</span>
                          <span className="bg-orange-50 text-orange-700 px-2 py-0.5 rounded capitalize text-xs font-medium border border-orange-200">
                            {match.metadata.workEnvironment.physicalDemands.replace(/_/g, ' ')}
                          </span>
                        </div>
                      </div>
                    </div>

                    {/* Key Skills */}
                    <div>
                      <h5 className="font-semibold text-stone-900 mb-3 flex items-center gap-2">
                        <Sparkles className="w-4 h-4 text-yellow-600" />
                        Key Skills Required
                      </h5>
                      <div className="flex flex-wrap gap-2">
                        {Object.entries(match.metadata.skills)
                          .filter(([, value]) => value >= 7)
                          .sort(([, a], [, b]) => b - a)
                          .slice(0, 5)
                          .map(([skill, value]) => (
                            <span
                              key={skill}
                              className={`text-xs border px-2 py-1 rounded-full font-medium ${getSkillColor(value)}`}
                            >
                              {skill.charAt(0).toUpperCase() + skill.slice(1)} ({value}/10)
                            </span>
                          ))}
                      </div>
                    </div>
                  </div>
                </div>
              )}
              </div>
            </div>
          );
        })}
        </div>
      </div>

      {/* Footer with loading state */}
      <div className="bg-stone-50 border-t border-stone-200 px-6 py-3 text-center">
        {hasNextPage ? (
          <div className="flex items-center justify-center gap-2 text-sm text-stone-600">
            {isFetchingNextPage ? <Loader2 className="w-4 h-4 animate-spin" /> : null}
            <span>Scroll to load more... ({matches.length} of {total} loaded)</span>
          </div>
        ) : (
          <p className="text-sm text-stone-600">
            Showing all {total} career match{total !== 1 ? 'es' : ''}
          </p>
        )}
      </div>
    </div>
  );
}
