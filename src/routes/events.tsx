import { createFileRoute } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useState } from "react";
import * as HoverCard from "@radix-ui/react-hover-card";
import {
  Calendar,
  ChevronLeft,
  ChevronRight,
  Clock,
  Repeat,
} from "lucide-react";
import { Container } from "@/components/layout/container";
import { Card, CardContent } from "@/components/ui/card";

const HOSTNAME = "https://compasscoachingpa.org";

// ── Types ────────────────────────────────────────────────────

interface ExpandedEvent {
  id: number;
  parent_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  recurrence_type: string;
}

// ── Server Functions (read-only, no auth) ─────────────────────

const getPublicEvents = createServerFn().handler(async (): Promise<ExpandedEvent[]> => {
  "use server";
  const { initializeDatabase, getAllEvents, expandRecurringEvents } = await import("@/lib/db.server");
  await initializeDatabase();
  const raw = await getAllEvents();
  return expandRecurringEvents(raw);
});

// ── Route ─────────────────────────────────────────────────────

export const Route = createFileRoute("/events")({
  component: EventsPage,
  head: () => ({
    meta: [
      { title: "Events & Schedule | Compass Coaching" },
      {
        name: "description",
        content:
          "View upcoming workshops, coaching sessions, and community events from Compass Coaching. Free career guidance events for Pennsylvania residents.",
      },
      { property: "og:type", content: "website" },
      { property: "og:title", content: "Events & Schedule | Compass Coaching" },
      {
        property: "og:description",
        content:
          "View upcoming workshops, coaching sessions, and community events from Compass Coaching.",
      },
      { property: "og:url", content: `${HOSTNAME}/events` },
      { property: "og:site_name", content: "Compass Coaching" },
      { property: "og:image", content: `${HOSTNAME}/og-image.png` },
      { property: "og:image:width", content: "1200" },
      { property: "og:image:height", content: "630" },
      { name: "twitter:card", content: "summary_large_image" },
      { name: "twitter:title", content: "Events & Schedule | Compass Coaching" },
      {
        name: "twitter:description",
        content:
          "View upcoming workshops, coaching sessions, and community events from Compass Coaching.",
      },
    ],
    links: [{ rel: "canonical", href: `${HOSTNAME}/events` }],
  }),
  loader: async () => await getPublicEvents(),
});

// ── Helpers ──────────────────────────────────────────────────

function getDaysInMonth(year: number, month: number) {
  return new Date(year, month + 1, 0).getDate();
}

function getFirstDayOfWeek(year: number, month: number) {
  return new Date(year, month, 1).getDay();
}

function formatDate(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    weekday: "long",
    month: "long",
    day: "numeric",
    year: "numeric",
  });
}

function formatDateShort(dateStr: string) {
  const [year, month, day] = dateStr.split("-").map(Number);
  const d = new Date(year, month - 1, day);
  return d.toLocaleDateString("en-US", {
    month: "short",
    day: "numeric",
  });
}

function formatTime(timeStr: string) {
  const [hours, minutes] = timeStr.split(":").map(Number);
  const period = hours >= 12 ? "PM" : "AM";
  const displayHours = hours % 12 || 12;
  return minutes === 0 ? `${displayHours} ${period}` : `${displayHours}:${minutes.toString().padStart(2, "0")} ${period}`;
}

function formatTimeRange(startTime: string | null, endTime: string | null) {
  if (!startTime) return null;
  if (!endTime) return formatTime(startTime);
  return `${formatTime(startTime)} – ${formatTime(endTime)}`;
}

function formatDateRange(startDate: string, endDate: string | null) {
  if (!endDate || endDate === startDate) return formatDate(startDate);
  return `${formatDateShort(startDate)} – ${formatDateShort(endDate)}`;
}

function isToday(dateStr: string) {
  const today = new Date();
  const [year, month, day] = dateStr.split("-").map(Number);
  return today.getFullYear() === year && today.getMonth() === month - 1 && today.getDate() === day;
}

function dateToKey(year: number, month: number, day: number) {
  return `${year}-${String(month + 1).padStart(2, "0")}-${String(day).padStart(2, "0")}`;
}

const MONTH_NAMES = [
  "January", "February", "March", "April", "May", "June",
  "July", "August", "September", "October", "November", "December",
];

const DAY_NAMES = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

// ── Swoosh Pattern ──────────────────────────────────────────

function EventsPattern() {
  return (
    <div className="absolute inset-0 overflow-hidden pointer-events-none">
      <svg
        className="absolute inset-0 w-full h-full"
        xmlns="http://www.w3.org/2000/svg"
        viewBox="0 0 1200 400"
        preserveAspectRatio="xMidYMin slice"
      >
        <defs>
          <linearGradient id="eventsBg" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#164e63" />
            <stop offset="50%" stopColor="#0e7490" />
            <stop offset="100%" stopColor="#06b6d4" />
          </linearGradient>
          <linearGradient id="eventsCyanFlow" x1="0%" y1="0%" x2="100%" y2="0%">
            <stop offset="0%" stopColor="#67e8f9" stopOpacity="0.5" />
            <stop offset="50%" stopColor="#a5f3fc" stopOpacity="0.4" />
            <stop offset="100%" stopColor="#cffafe" stopOpacity="0.25" />
          </linearGradient>
          <linearGradient id="eventsWhiteFlow" x1="0%" y1="0%" x2="100%" y2="100%">
            <stop offset="0%" stopColor="#ffffff" stopOpacity="0.3" />
            <stop offset="100%" stopColor="#ffffff" stopOpacity="0.08" />
          </linearGradient>
        </defs>
        <rect width="100%" height="100%" fill="url(#eventsBg)" />
        <path
          d="M-100,180 C150,220 300,280 500,260 C700,240 850,160 1300,120"
          fill="none"
          stroke="url(#eventsCyanFlow)"
          strokeWidth="140"
          strokeLinecap="round"
          opacity="0.5"
        />
        <path
          d="M-150,280 C50,330 200,380 400,360 C600,340 750,260 900,200 C1050,140 1200,120 1450,90"
          fill="none"
          stroke="url(#eventsCyanFlow)"
          strokeWidth="80"
          strokeLinecap="round"
          opacity="0.3"
        />
        <path
          d="M-50,80 C200,60 350,120 550,100 C750,80 850,40 1300,20"
          fill="none"
          stroke="url(#eventsWhiteFlow)"
          strokeWidth="60"
          strokeLinecap="round"
          opacity="0.4"
        />
      </svg>
    </div>
  );
}

// ── Component ───────────────────────────────────────────────

function EventsPage() {
  const events = Route.useLoaderData();

  const now = new Date();
  const [currentMonth, setCurrentMonth] = useState(now.getMonth());
  const [currentYear, setCurrentYear] = useState(now.getFullYear());
  const [selectedDate, setSelectedDate] = useState<string | null>(null);

  // Build a map of date → events for quick lookup
  const eventsByDate = new Map<string, ExpandedEvent[]>();
  for (const event of events) {
    // For multi-day events, add them to each day in the range
    const start = new Date(event.start_date + "T00:00:00");
    const end = event.end_date ? new Date(event.end_date + "T00:00:00") : start;
    const cursor = new Date(start);
    while (cursor <= end) {
      const key = dateToKey(cursor.getFullYear(), cursor.getMonth(), cursor.getDate());
      if (!eventsByDate.has(key)) eventsByDate.set(key, []);
      eventsByDate.get(key)!.push(event);
      cursor.setDate(cursor.getDate() + 1);
    }
  }

  const daysInMonth = getDaysInMonth(currentYear, currentMonth);
  const firstDay = getFirstDayOfWeek(currentYear, currentMonth);

  const prevMonth = () => {
    if (currentMonth === 0) {
      setCurrentMonth(11);
      setCurrentYear((y) => y - 1);
    } else {
      setCurrentMonth((m) => m - 1);
    }
    setSelectedDate(null);
  };

  const nextMonth = () => {
    if (currentMonth === 11) {
      setCurrentMonth(0);
      setCurrentYear((y) => y + 1);
    } else {
      setCurrentMonth((m) => m + 1);
    }
    setSelectedDate(null);
  };

  const goToToday = () => {
    setCurrentMonth(now.getMonth());
    setCurrentYear(now.getFullYear());
    setSelectedDate(null);
  };

  // Get events for the selected date
  const selectedEvents = selectedDate ? (eventsByDate.get(selectedDate) || []) : [];

  // Get upcoming events (next 30 days)
  const todayKey = dateToKey(now.getFullYear(), now.getMonth(), now.getDate());
  const upcomingEvents = events.filter((e) => {
    const endOrStart = e.end_date || e.start_date;
    return endOrStart >= todayKey;
  });

  return (
    <div className="min-h-screen bg-stone-50">
      {/* Hero */}
      <div className="relative overflow-hidden">
        <EventsPattern />
        <Container size="lg" className="relative z-10 py-16 md:py-20">
          <div className="text-center">
            <div className="inline-flex items-center gap-2 bg-white/20 backdrop-blur-sm px-4 py-2 rounded-full text-cyan-100 text-sm font-medium mb-6">
              <Calendar size={16} />
              <span>Community Events</span>
            </div>
            <h1 className="text-4xl md:text-5xl font-bold text-white mb-4">
              Events & Schedule
            </h1>
            <p className="text-lg text-cyan-100 max-w-2xl mx-auto">
              Stay up to date with our workshops, coaching sessions, and community
              events. All events are free for Pennsylvania residents.
            </p>
          </div>
        </Container>
      </div>

      <Container size="lg" className="py-12 px-6">
        <div className="grid lg:grid-cols-3 gap-8">
          {/* Calendar */}
          <div className="lg:col-span-2">
            <Card>
              <CardContent className="p-4 sm:p-6">
                {/* Calendar Header */}
                <div className="flex items-center justify-between mb-6">
                  <h2 className="text-xl font-bold text-stone-700">
                    {MONTH_NAMES[currentMonth]} {currentYear}
                  </h2>
                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={goToToday}
                      className="px-3 py-1.5 text-sm font-medium text-stone-600 hover:text-stone-800 hover:bg-stone-100 rounded-lg transition-colors"
                    >
                      Today
                    </button>
                    <button
                      type="button"
                      onClick={prevMonth}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
                      aria-label="Previous month"
                    >
                      <ChevronLeft size={20} />
                    </button>
                    <button
                      type="button"
                      onClick={nextMonth}
                      className="p-2 hover:bg-stone-100 rounded-lg transition-colors text-stone-600"
                      aria-label="Next month"
                    >
                      <ChevronRight size={20} />
                    </button>
                  </div>
                </div>

                {/* Day Headers */}
                <div className="grid grid-cols-7 mb-2">
                  {DAY_NAMES.map((day) => (
                    <div
                      key={day}
                      className="text-center text-xs font-medium text-stone-400 uppercase tracking-wider py-2"
                    >
                      {day}
                    </div>
                  ))}
                </div>

                {/* Calendar Grid */}
                <div className="grid grid-cols-7 border-t border-l border-stone-200">
                  {/* Empty cells for days before the first */}
                  {Array.from({ length: firstDay }, (_, i) => (
                    <div
                      key={`empty-${i}`}
                      className="border-b border-r border-stone-200 bg-stone-50/50 min-h-20 sm:min-h-24"
                    />
                  ))}

                  {/* Calendar days */}
                  {Array.from({ length: daysInMonth }, (_, i) => {
                    const day = i + 1;
                    const key = dateToKey(currentYear, currentMonth, day);
                    const dayEvents = eventsByDate.get(key) || [];
                    const isTodayCell = isToday(key);
                    const isSelected = selectedDate === key;

                    return (
                      <button
                        type="button"
                        key={key}
                        onClick={() => setSelectedDate(isSelected ? null : key)}
                        className={`border-b border-r border-stone-200 min-h-20 sm:min-h-24 p-1.5 sm:p-2 text-left transition-colors relative
                          ${isTodayCell ? "bg-cyan-50/60" : ""}
                          ${isSelected ? "bg-cyan-100/80 ring-2 ring-cyan-500 ring-inset" : "hover:bg-stone-50"}
                        `}
                      >
                        <span
                          className={`text-sm font-medium inline-flex items-center justify-center w-7 h-7 rounded-full
                            ${isTodayCell ? "bg-cyan-600 text-white" : "text-stone-700"}
                          `}
                        >
                          {day}
                        </span>
                        {/* Event dots / pills */}
                        <div className="mt-0.5 space-y-0.5">
                          {dayEvents.slice(0, 3).map((evt) => (
                            <HoverCard.Root key={evt.id} openDelay={200} closeDelay={100}>
                              <HoverCard.Trigger asChild>
                                <div
                                  className="text-[10px] sm:text-xs leading-tight px-1.5 py-0.5 rounded bg-cyan-100 text-cyan-800 truncate font-medium cursor-pointer hover:bg-cyan-200 transition-colors flex items-center gap-0.5"
                                >
                                  {evt.is_recurring && <Repeat size={10} className="shrink-0 text-cyan-600" />}
                                  <span className="truncate">{evt.title}</span>
                                </div>
                              </HoverCard.Trigger>
                              <HoverCard.Portal>
                                <HoverCard.Content
                                  sideOffset={8}
                                  align="start"
                                  className="z-50 w-64 rounded-xl border-2 border-stone-200 bg-white p-4 shadow-lg animate-in fade-in-0 zoom-in-95 data-[side=bottom]:slide-in-from-top-2 data-[side=top]:slide-in-from-bottom-2"
                                >
                                  <div className="space-y-2">
                                    <div className="flex items-start gap-2">
                                      <h4 className="font-semibold text-stone-700 text-sm leading-snug flex-1">{evt.title}</h4>
                                      {evt.is_recurring && (
                                        <span className="shrink-0 inline-flex items-center gap-1 px-1.5 py-0.5 text-[10px] font-medium bg-cyan-100 text-cyan-700 rounded-full">
                                          <Repeat size={10} />
                                          {evt.recurrence_type}
                                        </span>
                                      )}
                                    </div>
                                    <div className="flex flex-wrap items-center gap-x-3 gap-y-1 text-xs text-stone-500">
                                      <span className="flex items-center gap-1">
                                        <Calendar size={12} className="text-cyan-600" />
                                        {formatDateRange(evt.start_date, evt.end_date)}
                                      </span>
                                      {evt.start_time && (
                                        <span className="flex items-center gap-1">
                                          <Clock size={12} className="text-cyan-600" />
                                          {formatTimeRange(evt.start_time, evt.end_time)}
                                        </span>
                                      )}
                                    </div>
                                    {evt.description && (
                                      <p className="text-xs text-stone-600 leading-relaxed line-clamp-3">{evt.description}</p>
                                    )}
                                  </div>
                                  <HoverCard.Arrow className="fill-white" />
                                </HoverCard.Content>
                              </HoverCard.Portal>
                            </HoverCard.Root>
                          ))}
                          {dayEvents.length > 3 && (
                            <div className="text-[10px] text-stone-500 px-1.5">
                              +{dayEvents.length - 3} more
                            </div>
                          )}
                        </div>
                      </button>
                    );
                  })}
                </div>
              </CardContent>
            </Card>

            {/* Selected Date Events */}
            {selectedDate && (
              <div className="mt-6">
                <h3 className="text-lg font-semibold text-stone-700 mb-4">
                  {formatDate(selectedDate)}
                </h3>
                {selectedEvents.length > 0 ? (
                  <div className="space-y-4">
                    {selectedEvents.map((event) => (
                      <EventCard key={event.id} event={event} />
                    ))}
                  </div>
                ) : (
                  <Card>
                    <CardContent className="p-8 text-center text-stone-500">
                      <Calendar className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                      No events scheduled for this day.
                    </CardContent>
                  </Card>
                )}
              </div>
            )}
          </div>

          {/* Sidebar — Upcoming Events */}
          <div>
            <h3 className="text-lg font-semibold text-stone-700 mb-4 flex items-center gap-2">
              <Clock size={18} className="text-cyan-600" />
              Upcoming Events
            </h3>
            {upcomingEvents.length > 0 ? (
              <div className="space-y-3">
                {upcomingEvents.slice(0, 10).map((event) => (
                  <EventCard key={event.id} event={event} compact />
                ))}
                {upcomingEvents.length > 10 && (
                  <p className="text-sm text-stone-500 text-center pt-2">
                    +{upcomingEvents.length - 10} more events
                  </p>
                )}
              </div>
            ) : (
              <Card>
                <CardContent className="p-6 text-center text-stone-500 text-sm">
                  <Calendar className="w-6 h-6 mx-auto mb-2 text-stone-300" />
                  No upcoming events scheduled yet.
                  <br />
                  Check back soon!
                </CardContent>
              </Card>
            )}
          </div>
        </div>
      </Container>
    </div>
  );
}

// ── Event Card ──────────────────────────────────────────────

function EventCard({ event, compact }: { event: ExpandedEvent; compact?: boolean }) {
  const timeDisplay = formatTimeRange(event.start_time, event.end_time);
  const dateDisplay = formatDateRange(event.start_date, event.end_date);
  const isTodayEvent = isToday(event.start_date);

  if (compact) {
    return (
      <Card className={`transition-colors ${isTodayEvent ? "border-cyan-300 bg-cyan-50/40" : ""}`}>
        <CardContent className="p-4">
          <div className="flex items-start gap-3">
            <div className="shrink-0 w-12 text-center">
              <div className="text-xs font-medium text-stone-400 uppercase">
                {formatDateShort(event.start_date).split(" ")[0]}
              </div>
              <div className="text-xl font-bold text-stone-700">
                {formatDateShort(event.start_date).split(" ")[1]}
              </div>
            </div>
            <div className="min-w-0">
              <h4 className="font-medium text-stone-700 text-sm leading-snug flex items-center gap-1.5">
                {event.title}
                {event.is_recurring && <Repeat size={12} className="text-cyan-500 shrink-0" />}
              </h4>
              {timeDisplay && (
                <p className="text-xs text-stone-500 mt-1 flex items-center gap-1">
                  <Clock size={12} />
                  {timeDisplay}
                </p>
              )}
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className={`transition-colors ${isTodayEvent ? "border-cyan-300 bg-cyan-50/40" : ""}`}>
      <CardContent className="p-5">
        <div className="flex items-start justify-between gap-4">
          <div className="min-w-0">
            <h4 className="font-semibold text-stone-700 text-base mb-1 flex items-center gap-2">
              {event.title}
              {event.is_recurring && (
                <span className="inline-flex items-center gap-1 px-2 py-0.5 text-[11px] font-medium bg-cyan-100 text-cyan-700 rounded-full">
                  <Repeat size={11} />
                  {event.recurrence_type}
                </span>
              )}
            </h4>
            <div className="flex flex-wrap items-center gap-x-4 gap-y-1 text-sm text-stone-500 mb-2">
              <span className="flex items-center gap-1.5">
                <Calendar size={14} className="text-cyan-600" />
                {dateDisplay}
              </span>
              {timeDisplay && (
                <span className="flex items-center gap-1.5">
                  <Clock size={14} className="text-cyan-600" />
                  {timeDisplay}
                </span>
              )}
            </div>
            {event.description && (
              <p className="text-sm text-stone-600 leading-relaxed">{event.description}</p>
            )}
          </div>
          {isTodayEvent && (
            <span className="shrink-0 px-2.5 py-1 text-xs font-medium bg-cyan-100 text-cyan-700 rounded-full">
              Today
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
