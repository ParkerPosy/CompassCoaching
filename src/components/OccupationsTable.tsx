import { Fragment, useMemo, useState, useEffect, useRef } from 'react';
import {
  type ColumnDef,
  flexRender,
  getCoreRowModel,
  useReactTable,
  type SortingState,
  type PaginationState,
  type ExpandedState,
} from '@tanstack/react-table';
import { useQuery } from '@tanstack/react-query';
import { ArrowUpDown, ChevronLeft, ChevronRight, Loader2, TrendingUp, GraduationCap, MapPin, ChevronDown } from 'lucide-react';
import type { Occupation } from '@/types/wages';
import { fetchPaginatedOccupations, getAvailableCounties } from '@/lib/occupationService';
import { formatCurrency, formatEducationLevel, SOC_CATEGORIES } from '@/lib/wages';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { useSessionStorage } from '@/hooks';

interface OccupationsTableProps {
  initialPageSize?: number;
}

export function OccupationsTable({ initialPageSize = 10 }: OccupationsTableProps) {
  const [search, setSearch] = useSessionStorage('occupations-search', '');
  const [sorting, setSorting] = useState<SortingState>([]);
  const [pagination, setPagination] = useState<PaginationState>({
    pageIndex: 0,
    pageSize: initialPageSize,
  });
  const [expanded, setExpanded] = useState<ExpandedState>({});
  const [selectedCounty, setSelectedCounty] = useSessionStorage('occupations-county', 'All');
  const [selectedCategory, setSelectedCategory] = useSessionStorage('occupations-category', 'All');
  const tableContainerRef = useRef<HTMLDivElement>(null);
  const mouseDownPos = useRef<{ x: number; y: number } | null>(null);
  const isInitialMount = useRef(true);

  // Scroll to browse section when pagination changes (but not on initial load)
  useEffect(() => {
    if (isInitialMount.current) {
      isInitialMount.current = false;
      return;
    }

    const browseSection = document.getElementById('browse-occupations');
    if (browseSection) {
      // Get the top position of the element relative to the document
      const elementTop = browseSection.getBoundingClientRect().top + window.scrollY;
      // Scroll to position with a small offset for breathing room (20px above)
      window.scrollTo({
        top: elementTop - 20,
        behavior: 'smooth'
      });
    }
  }, [pagination.pageIndex]);

  // Fetch available counties
  const { data: counties, isLoading: countiesLoading } = useQuery({
    queryKey: ['counties'],
    queryFn: () => getAvailableCounties(),
    staleTime: Number.POSITIVE_INFINITY, // Counties list doesn't change
  });

  // Fetch data with React Query
  const { data, isLoading, isError, error } = useQuery({
    queryKey: ['occupations', pagination, sorting, search, selectedCounty, selectedCategory],
    queryFn: () =>
      fetchPaginatedOccupations({
        data: {
          page: pagination.pageIndex + 1,
          pageSize: pagination.pageSize,
          search: search || undefined,
          sortBy: sorting[0]?.id as keyof Occupation | undefined,
          sortOrder: sorting[0]?.desc ? 'desc' : 'asc',
          county: selectedCounty !== 'All' ? selectedCounty : undefined,
          socCategory: selectedCategory !== 'All' ? selectedCategory : undefined,
        },
      }),
    placeholderData: (previousData) => previousData, // Keep previous data while fetching
  });

  // Define table columns - optimized for user decision-making
  const columns = useMemo<ColumnDef<Occupation>[]>(
    () => [
      {
        accessorKey: 'title',
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              type="button"
              className={`flex items-center gap-2 hover:text-blue-700 font-semibold transition-colors ${
                isSorted ? 'text-blue-700' : ''
              }`}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              Career
              <ArrowUpDown className={`w-4 h-4 ${isSorted ? 'text-blue-600' : ''}`} />
            </button>
          );
        },
        cell: (info) => (
          <div className="flex items-start gap-3">
            <div className="flex-1 min-w-0">
              <div className="font-semibold text-stone-900 text-base">
                {info.getValue() as string}
              </div>
              <div className="text-xs text-stone-500 font-mono mt-0.5">
                {info.row.original.socCode}
              </div>
            </div>
          </div>
        ),
        size: 280,
      },
      {
        accessorKey: 'educationLevel',
        header: () => (
          <div className="flex items-center gap-1.5">
            <GraduationCap className="w-4 h-4" />
            <span>Education Required</span>
          </div>
        ),
        cell: (info) => {
          const level = info.getValue() as string;
          const formatted = formatEducationLevel(level);

          // Color coding for quick scanning
          const getColorClass = (lvl: string) => {
            // Entry-level / minimal formal education
            if (lvl === 'ND' || lvl === 'HS') return 'bg-emerald-100 text-emerald-800 border-emerald-200';
            // On-the-job training paths
            if (lvl === 'ST OJT' || lvl === 'MT OJT' || lvl === 'LT OJT') return 'bg-teal-100 text-teal-800 border-teal-200';
            // Work experience
            if (lvl === 'WK EXP') return 'bg-cyan-100 text-cyan-800 border-cyan-200';
            // Some college / certificates
            if (lvl === 'PS' || lvl === 'PS+' || lvl === 'SC') return 'bg-sky-100 text-sky-800 border-sky-200';
            // Associate's degree
            if (lvl === 'AD' || lvl === 'AD+') return 'bg-blue-100 text-blue-800 border-blue-200';
            // Bachelor's degree
            if (lvl === 'BD' || lvl === 'BD+') return 'bg-violet-100 text-violet-800 border-violet-200';
            // Master's degree
            if (lvl === 'MD' || lvl === 'MD+') return 'bg-purple-100 text-purple-800 border-purple-200';
            // Doctoral level
            if (lvl === 'DD' || lvl === 'DOCT') return 'bg-fuchsia-100 text-fuchsia-800 border-fuchsia-200';
            // Varies / unknown
            return 'bg-stone-100 text-stone-600 border-stone-200';
          };

          return (
            <span
              title={formatted}
              className={`inline-block max-w-full truncate px-2.5 py-1 rounded-lg text-xs font-medium border ${getColorClass(level)}`}
            >
              {formatted}
            </span>
          );
        },
        size: 140,
      },
      {
        id: 'entrySalary',
        accessorFn: (row) => {
          if (selectedCounty === 'All') {
            return row.wages.statewide.annual.entry;
          }
          const countyData = row.wages.byCounty.find(c => c.county === selectedCounty);
          return countyData?.wages.annual.entry || row.wages.statewide.annual.entry;
        },
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              type="button"
              className={`flex items-center gap-2 hover:text-blue-700 transition-colors ${
                isSorted ? 'text-blue-700' : ''
              }`}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <div className="text-left">
                <div className="font-semibold">Starting Pay</div>
                <div className="text-xs font-normal text-stone-500">
                  {selectedCounty !== 'All' ? `${selectedCounty} County` : 'Entry level'}
                </div>
              </div>
              <ArrowUpDown className={`w-4 h-4 ${isSorted ? 'text-blue-600' : ''}`} />
            </button>
          );
        },
        cell: (info) => (
          <div className="text-stone-900 font-semibold">
            {formatCurrency(info.getValue() as number | null)}
          </div>
        ),
        size: 140,
      },
      {
        id: 'medianSalary',
        accessorFn: (row) => {
          if (selectedCounty === 'All') {
            return row.wages.statewide.annual.median;
          }
          const countyData = row.wages.byCounty.find(c => c.county === selectedCounty);
          return countyData?.wages.annual.median || row.wages.statewide.annual.median;
        },
        header: ({ column }) => {
          const isSorted = column.getIsSorted();
          return (
            <button
              type="button"
              className={`flex items-center gap-2 hover:text-blue-700 transition-colors ${
                isSorted ? 'text-blue-700' : ''
              }`}
              onClick={() => column.toggleSorting(column.getIsSorted() === 'asc')}
            >
              <div className="text-left">
                <div className="font-semibold">Typical Pay</div>
                <div className="text-xs font-normal text-stone-500">
                  {selectedCounty !== 'All' ? `${selectedCounty} County` : 'Median'}
                </div>
              </div>
              <ArrowUpDown className={`w-4 h-4 ${isSorted ? 'text-blue-600' : ''}`} />
            </button>
          );
        },
        cell: (info) => (
          <div className="font-bold text-blue-700 text-lg">
            {formatCurrency(info.getValue() as number | null)}
          </div>
        ),
        size: 140,
      },
      {
        id: 'experiencedSalary',
        accessorFn: (row) => {
          if (selectedCounty === 'All') {
            return row.wages.statewide.annual.experienced;
          }
          const countyData = row.wages.byCounty.find(c => c.county === selectedCounty);
          return countyData?.wages.annual.experienced || row.wages.statewide.annual.experienced;
        },
        header: () => (
          <div className="flex items-center gap-1.5">
            <TrendingUp className="w-4 h-4" />
            <div className="text-left">
              <div className="font-semibold">Top Earners</div>
              <div className="text-xs font-normal text-stone-500">
                {selectedCounty !== 'All' ? `${selectedCounty} County` : 'Experienced'}
              </div>
            </div>
          </div>
        ),
        cell: (info) => (
          <div className="text-stone-900 font-semibold">
            {formatCurrency(info.getValue() as number | null)}
          </div>
        ),
        size: 140,
      },
      {
        id: 'counties',
        header: () => (
          <div className="flex items-center gap-1.5">
            <MapPin className="w-4 h-4" />
            <span>{selectedCounty !== 'All' ? 'Details' : 'Local Data'}</span>
          </div>
        ),
        cell: ({ row }) => {
          const countiesCount = row.original.wages.byCounty.length;
          const isExpanded = row.getIsExpanded();
          const hasData = countiesCount > 0;

          return (
            <div className="flex items-center gap-2">
              {hasData ? (
                <div className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-md bg-blue-50 group-hover:bg-blue-100 border border-blue-200 group-hover:border-blue-300 transition-colors">
                  {selectedCounty === 'All' ? (
                    <>
                      <span className="text-sm font-semibold text-blue-700">
                        {countiesCount} {countiesCount === 1 ? 'county' : 'counties'}
                      </span>
                      <ChevronDown
                        className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  ) : (
                    <>
                      <span className="text-sm font-semibold text-blue-700">View all</span>
                      <ChevronDown
                        className={`w-4 h-4 text-blue-600 transition-transform duration-200 ${
                          isExpanded ? 'rotate-180' : ''
                        }`}
                      />
                    </>
                  )}
                </div>
              ) : (
                <span className="text-sm font-medium text-stone-400">
                  {countiesCount} counties
                </span>
              )}
            </div>
          );
        },
        size: 130,
      },
    ],
    [selectedCounty],
  );

  const table = useReactTable({
    data: data?.data ?? [],
    columns,
    pageCount: data?.meta.totalPages ?? -1,
    state: {
      sorting,
      pagination,
      expanded,
    },
    onSortingChange: setSorting,
    onPaginationChange: setPagination,
    onExpandedChange: setExpanded,
    getCoreRowModel: getCoreRowModel(),
    manualPagination: true,
    manualSorting: true,
    getRowCanExpand: (row) => row.original.wages.byCounty.length > 0,
  });

  return (
    <div ref={tableContainerRef} className="space-y-4">
      {/* Search and Filters */}
      <div className="flex flex-col gap-4">
        <div className="flex flex-col lg:flex-row gap-3">
          <div className="w-full lg:w-96 relative">
            <Input
              placeholder="Search by career name or code..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pr-10"
            />
            {search && (
              <button
                type="button"
                onClick={() => setSearch('')}
                className="absolute right-2 top-1/2 -translate-y-1/2 w-6 h-6 flex items-center justify-center rounded-full text-stone-400 hover:text-stone-700 hover:bg-stone-100 transition-all duration-200 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-1"
                aria-label="Clear search"
              >
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="w-4 h-4"
                  viewBox="0 0 20 20"
                  fill="currentColor"
                >
                  <path
                    fillRule="evenodd"
                    d="M4.293 4.293a1 1 0 011.414 0L10 8.586l4.293-4.293a1 1 0 111.414 1.414L11.414 10l4.293 4.293a1 1 0 01-1.414 1.414L10 11.414l-4.293 4.293a1 1 0 01-1.414-1.414L8.586 10 4.293 5.707a1 1 0 010-1.414z"
                    clipRule="evenodd"
                  />
                </svg>
              </button>
            )}
          </div>
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="w-full sm:w-48">
              <Select
                value={selectedCounty}
                onValueChange={(value) => {
                  console.log('County changed to:', value);
                  setSelectedCounty(value);
                  setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                }}
                disabled={countiesLoading}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Pennsylvania" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="All">All Pennsylvania</SelectItem>
                  {counties?.map((county: string) => (
                    <SelectItem key={county} value={county}>
                      {county} County
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
            <div className="w-full sm:w-56">
              <Select
                value={selectedCategory}
                onValueChange={(value) => {
                  setSelectedCategory(value);
                  setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                }}
              >
                <SelectTrigger className="bg-white">
                  <SelectValue placeholder="All Career Fields" />
                </SelectTrigger>
                <SelectContent position="popper" sideOffset={4}>
                  <SelectItem value="All">All Career Fields</SelectItem>
                  {SOC_CATEGORIES.map((category) => (
                    <SelectItem key={category.code} value={category.code}>
                      {category.label}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          </div>
        </div>
        {data && (
          <div className="flex items-center gap-3 flex-wrap">
            <div className="text-sm text-stone-600 font-medium">
              Showing {data.data.length} of {data.meta.totalCount.toLocaleString()} careers
            </div>
            {(search || selectedCounty !== 'All' || selectedCategory !== 'All') && (
              <Button
                variant="outline"
                size="sm"
                onClick={() => {
                  setSearch('');
                  setSelectedCounty('All');
                  setSelectedCategory('All');
                  setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                }}
                className="text-xs h-7"
              >
                Clear filters
              </Button>
            )}
          </div>
        )}
        {selectedCounty !== 'All' && (
          <div className="flex items-center gap-2 px-3 py-2 bg-blue-50 border border-blue-200 rounded-lg text-sm">
            <MapPin className="w-4 h-4 text-blue-600" />
            <span className="text-blue-900">
              Showing <strong>{selectedCounty} County</strong> wages. Click any career to compare with other counties.
            </span>
          </div>
        )}
      </div>

      {/* Table */}
      <div className="rounded-lg overflow-hidden bg-white shadow-md ring-1 ring-stone-200">
        <div className="overflow-x-auto">
          <table className="w-full table-fixed">
            <thead className="bg-stone-100 border-b-2 border-stone-300">
              {table.getHeaderGroups().map((headerGroup) => (
                <tr key={headerGroup.id}>
                  {headerGroup.headers.map((header) => (
                    <th
                      key={header.id}
                      className="px-6 py-4 text-left text-xs font-semibold text-stone-800 uppercase tracking-wider"
                      style={{ width: `${header.getSize()}px` }}
                    >
                      {header.isPlaceholder
                        ? null
                        : flexRender(
                            header.column.columnDef.header,
                            header.getContext()
                          )}
                    </th>
                  ))}
                </tr>
              ))}
            </thead>
            <tbody className="divide-y divide-stone-100">
              {isLoading ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 text-center">
                    <div
                      className="flex items-center justify-center gap-2 py-20"
                    >
                      <Loader2 className="w-5 h-5 animate-spin text-blue-600" />
                      <span className="text-stone-600">Loading occupations...</span>
                    </div>
                  </td>
                </tr>
              ) : isError ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="text-red-600">
                      Error loading data: {error?.message}
                    </div>
                  </td>
                </tr>
              ) : table.getRowModel().rows.length === 0 ? (
                <tr>
                  <td colSpan={columns.length} className="px-6 py-12 text-center">
                    <div className="text-stone-600">
                      {selectedCounty !== 'All' || selectedCategory !== 'All' ? (
                        <div className="space-y-2">
                          <div className="text-lg font-semibold">
                            No careers found
                            {selectedCounty !== 'All' && ` in ${selectedCounty} County`}
                            {selectedCategory !== 'All' && ` in ${SOC_CATEGORIES.find(c => c.code === selectedCategory)?.label || 'selected field'}`}
                          </div>
                          <div className="text-sm">Try searching for different terms or adjusting your filters.</div>
                          <Button
                            variant="outline"
                            size="sm"
                            onClick={() => {
                              setSearch('');
                              setSelectedCounty('All');
                              setSelectedCategory('All');
                              setPagination({ pageIndex: 0, pageSize: pagination.pageSize });
                            }}
                            className="mt-3"
                          >
                            Clear filters
                          </Button>
                        </div>
                      ) : (
                        <div>
                          No careers found matching "{search}". Try different search terms.
                        </div>
                      )}
                    </div>
                  </td>
                </tr>
              ) : (
                table.getRowModel().rows.map((row) => {
                  const isExpanded = row.getIsExpanded();
                  const countyData = row.original.wages.byCounty;
                  const hasCountyData = countyData.length > 0;

                  return (
                    <Fragment key={row.id}>
                      <tr
                        key={row.id}
                        className={`group hover:bg-blue-50/80 transition-all duration-200 hover:shadow-[inset_3px_0_0_0_rgb(59,130,246),0_2px_12px_-4px_rgba(59,130,246,0.25)] ${
                          hasCountyData ? 'cursor-pointer' : ''
                        } ${isExpanded ? 'bg-blue-50/40 shadow-[inset_3px_0_0_0_rgb(59,130,246)]' : ''}`}
                        onClick={() => {
                          if (hasCountyData) {
                            row.toggleExpanded();
                          }
                        }}
                      >
                        {row.getVisibleCells().map((cell) => (
                          <td key={cell.id} className="px-6 py-4">
                            {flexRender(cell.column.columnDef.cell, cell.getContext())}
                          </td>
                        ))}
                      </tr>
                      {isExpanded && hasCountyData && (
                        <tr key={`${row.id}-expanded`} className="bg-linear-to-b from-blue-50/50 to-blue-50/30 border-t border-blue-100 cursor-pointer">
                          <td
                            colSpan={columns.length}
                            className="px-8 py-5"
                            onMouseDown={(e) => {
                              mouseDownPos.current = { x: e.clientX, y: e.clientY };
                            }}
                            onClick={(e) => {
                              // Only collapse if this was a click (not a text selection)
                              if (mouseDownPos.current) {
                                const deltaX = Math.abs(e.clientX - mouseDownPos.current.x);
                                const deltaY = Math.abs(e.clientY - mouseDownPos.current.y);
                                // If mouse moved less than 5px in any direction, treat as a click
                                if (deltaX < 5 && deltaY < 5) {
                                  row.toggleExpanded();
                                }
                              }
                              mouseDownPos.current = null;
                            }}
                          >
                            <div className="space-y-3">
                              <h4 className="text-sm font-bold text-stone-800 mb-4 flex items-center gap-2 uppercase tracking-wide">
                                <MapPin className="w-4 h-4 text-blue-600" />
                                County-Specific Salary Data
                                <span className="text-xs font-normal text-stone-500 ml-auto">(Click anywhere to collapse)</span>
                              </h4>
                              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                                {countyData
                                  .sort((a, b) => {
                                    // Prioritize selected county
                                    if (selectedCounty !== 'All') {
                                      if (a.county === selectedCounty) return -1;
                                      if (b.county === selectedCounty) return 1;
                                    }
                                    return a.county.localeCompare(b.county);
                                  })
                                  .map((county) => {
                                    const isSelected = selectedCounty !== 'All' && county.county === selectedCounty;
                                    return (
                                      <div
                                        key={county.county}
                                        className={`p-4 rounded-lg border-2 transition-all ${
                                          isSelected
                                            ? 'bg-linear-to-br from-blue-50 to-blue-100/50 border-blue-400 shadow-md ring-2 ring-blue-200'
                                            : 'bg-white border-stone-200 shadow-sm hover:shadow-md hover:border-stone-300'
                                        }`}
                                      >
                                        <div className="flex items-center justify-between mb-3">
                                          <h5 className={`text-sm font-bold flex items-center gap-2 ${
                                            isSelected ? 'text-blue-900' : 'text-stone-900'
                                          }`}>
                                            {isSelected && <MapPin className="w-4 h-4 text-blue-600" />}
                                            {county.county}
                                          </h5>
                                          {isSelected && (
                                            <span className="text-[10px] font-bold bg-blue-600 text-white px-2 py-0.5 rounded-full uppercase tracking-wide">
                                              Your County
                                            </span>
                                          )}
                                        </div>
                                        <div className="space-y-2 text-xs">
                                          <div className="flex justify-between items-center py-1">
                                            <span className="text-stone-600 font-medium">Entry:</span>
                                            <span className="font-semibold text-stone-900">
                                              {formatCurrency(county.wages.annual.entry)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center py-1 bg-blue-50/50 -mx-1 px-1 rounded">
                                            <span className="text-stone-700 font-semibold">Median:</span>
                                            <span className="font-bold text-blue-700 text-sm">
                                              {formatCurrency(county.wages.annual.median)}
                                            </span>
                                          </div>
                                          <div className="flex justify-between items-center py-1">
                                            <span className="text-stone-600 font-medium">Top:</span>
                                            <span className="font-semibold text-stone-900">
                                              {formatCurrency(county.wages.annual.experienced)}
                                            </span>
                                          </div>
                                        </div>
                                      </div>
                                    );
                                  })}
                              </div>
                            </div>
                          </td>
                        </tr>
                      )}
                    </Fragment>
                  );
                })
              )}
            </tbody>
          </table>
        </div>
      </div>

      {/* Pagination */}
      {data && (
        <div className="flex flex-col md:flex-row items-center justify-between gap-4 px-2">
          <div className="text-sm text-stone-600 whitespace-nowrap">
            Page {pagination.pageIndex + 1} of {data.meta.totalPages}
          </div>

          <div className="flex items-center gap-2">
            <Button
              variant="outline"
              size="sm"
              onClick={() => table.previousPage()}
              disabled={!table.getCanPreviousPage()}
            >
              <ChevronLeft className="w-4 h-4 md:mr-1" />
              <span className="hidden md:inline">Previous</span>
            </Button>

            {/* Mobile: show 3 page buttons */}
            <div className="flex md:hidden items-center gap-1">
              {Array.from({ length: Math.min(3, data.meta.totalPages) }, (_, i) => {
                let pageNum: number;

                if (data.meta.totalPages <= 3) {
                  pageNum = i;
                } else if (pagination.pageIndex < 2) {
                  pageNum = i;
                } else if (pagination.pageIndex > data.meta.totalPages - 3) {
                  pageNum = data.meta.totalPages - 3 + i;
                } else {
                  pageNum = pagination.pageIndex - 1 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.pageIndex === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPagination({ ...pagination, pageIndex: pageNum })}
                    className="w-10"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>

            {/* Desktop: show 5 page buttons */}
            <div className="hidden md:flex items-center gap-1">
              {Array.from({ length: Math.min(5, data.meta.totalPages) }, (_, i) => {
                let pageNum: number;

                if (data.meta.totalPages <= 5) {
                  pageNum = i;
                } else if (pagination.pageIndex < 3) {
                  pageNum = i;
                } else if (pagination.pageIndex > data.meta.totalPages - 4) {
                  pageNum = data.meta.totalPages - 5 + i;
                } else {
                  pageNum = pagination.pageIndex - 2 + i;
                }

                return (
                  <Button
                    key={pageNum}
                    variant={pagination.pageIndex === pageNum ? 'default' : 'outline'}
                    size="sm"
                    onClick={() => setPagination({ ...pagination, pageIndex: pageNum })}
                    className="w-10"
                  >
                    {pageNum + 1}
                  </Button>
                );
              })}
            </div>

            <Button
              variant="outline"
              size="sm"
              onClick={() => table.nextPage()}
              disabled={!table.getCanNextPage()}
            >
              <span className="hidden md:inline">Next</span>
              <ChevronRight className="w-4 h-4 md:ml-1" />
            </Button>
          </div>

          <div className="flex items-center gap-2 whitespace-nowrap">
            <span className="text-sm text-stone-600">Show</span>
            <Select
              size="sm"
              value={pagination.pageSize.toString()}
              onValueChange={(value) => {
                setPagination({
                  pageIndex: 0,
                  pageSize: Number(value),
                });
              }}
            >
              <SelectTrigger className="w-20">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[10, 20, 50, 100].map((pageSize) => (
                  <SelectItem key={pageSize} value={pageSize.toString()}>
                    {pageSize}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            <span className="text-sm text-stone-600">per page</span>
          </div>
        </div>
      )}
    </div>
  );
}
