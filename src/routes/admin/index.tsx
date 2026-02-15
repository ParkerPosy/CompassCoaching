import { createFileRoute, redirect, useRouter, Link } from "@tanstack/react-router";
import { createServerFn } from "@tanstack/react-start";
import { useUser } from "@clerk/tanstack-react-start";
import { useState, useMemo } from "react";
import {
  Shield,
  Users,
  Clock,
  Activity,
  AlertTriangle,
  Save,
  Loader2,
  UserPlus,
  Check,
  Trash2,
  Copy,
  ExternalLink,
  Settings,
  Eye,
  DatabaseZap,
  CalendarDays,
  Plus,
  Pencil,
  X,
  Repeat,
  GripVertical,
  UserCheck,
  FileText,
  Target,
  MessageSquare,
} from "lucide-react";
import {
  DndContext,
  closestCenter,
  KeyboardSensor,
  PointerSensor,
  useSensor,
  useSensors,
  type DragEndEvent,
} from "@dnd-kit/core";
import {
  arrayMove,
  SortableContext,
  sortableKeyboardCoordinates,
  useSortable,
  verticalListSortingStrategy,
} from "@dnd-kit/sortable";
import { CSS } from "@dnd-kit/utilities";
import { Container } from "@/components/layout/container";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { DatePicker } from "@/components/ui/date-picker";
import { TimePicker } from "@/components/ui/time-picker";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { useAssessmentStore, useAssessmentProgress, CURRENT_ASSESSMENT_VERSION } from "@/stores/assessmentStore";

// Types for admin data
interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
  sort_order: number;
  is_active_mentee: number;
  created_at: string;
  updated_at: string;
}

interface MergedUser {
  clerkId: string;
  name: string | null;
  email: string | null;
  createdAt: string;
  lastActiveAt: string | null;
  notes: string;
  isInDatabase: boolean;
  sortOrder: number;
  isActiveMentee: boolean;
  hasNotes: boolean;
  hasGoals: boolean;
  hasAdminMessage: boolean;
  lastGoalCompletedAt: string | null;
}

interface AdminStats {
  totalUsers: number;
  recentSignups: number;
  activeThisWeek: number;
}

interface AdminData {
  userId: string;
  stats: AdminStats;
  users: MergedUser[];
  events: AdminCalendarEvent[];
  error?: string;
}

interface AdminCalendarEvent {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  recurrence_type: string;
  recurrence_end_date: string | null;
  created_at: string;
  updated_at: string;
}

interface EventFormData {
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  startTime: string;
  endTime: string;
  recurrenceType: string;
  recurrenceEndDate: string;
}

// Server function to check admin role and fetch all data
const getAdminData = createServerFn().handler(async (): Promise<AdminData> => {
  "use server";

  // Dynamic imports of server-only modules
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { userId } = await auth();

  if (!userId) {
    throw redirect({ to: "/" });
  }

  // Get user from Clerk to check publicMetadata
  const client = await clerkClient();
  const currentUser = await client.users.getUser(userId);
  const role = (currentUser.publicMetadata as { role?: string })?.role;

  if (role !== "admin") {
    throw redirect({ to: "/dashboard" });
  }

  // Dynamic import of database module
  const { initializeDatabase, getAllUserNotes, getAllEvents } = await import("@/lib/db.server");
  await initializeDatabase();

  try {
    const client = await clerkClient();
    const usersResponse = await client.users.getUserList({ limit: 100 });
    const dbNotes = await getAllUserNotes();
    const dbEvents = await getAllEvents();

    const notesMap = new Map<string, UserNote>();
    for (const note of dbNotes) {
      notesMap.set(note.clerk_id, note);
    }

    // Parse goals helper
    const parseGoals = (goalsStr: string | undefined | null): boolean => {
      if (!goalsStr) return false;
      try {
        const arr = JSON.parse(goalsStr);
        return Array.isArray(arr) && arr.length > 0;
      } catch {
        return false;
      }
    };

    // Get last goal completed timestamp
    const getLastGoalCompletedAt = (goalsStr: string | undefined | null): string | null => {
      if (!goalsStr) return null;
      try {
        const arr = JSON.parse(goalsStr);
        if (!Array.isArray(arr)) return null;
        let latest: string | null = null;
        for (const g of arr) {
          if (g.completedAt && (!latest || g.completedAt > latest)) {
            latest = g.completedAt;
          }
        }
        return latest;
      } catch {
        return null;
      }
    };

    const mergedUsers: MergedUser[] = usersResponse.data.map((u) => {
      const dbNote = notesMap.get(u.id);
      return {
        clerkId: u.id,
        name: [u.firstName, u.lastName].filter(Boolean).join(" ") || dbNote?.name || null,
        email: u.primaryEmailAddress?.emailAddress || dbNote?.email || null,
        createdAt: new Date(u.createdAt).toISOString(),
        lastActiveAt: u.lastActiveAt ? new Date(u.lastActiveAt).toISOString() : null,
        notes: dbNote?.notes || "",
        isInDatabase: !!dbNote,
        sortOrder: dbNote?.sort_order ?? 9999,
        isActiveMentee: !!(dbNote?.is_active_mentee),
        hasNotes: !!(dbNote?.notes && dbNote.notes.trim().length > 0),
        hasGoals: parseGoals((dbNote as any)?.goals),
        hasAdminMessage: !!((dbNote as any)?.admin_message && (dbNote as any).admin_message.trim().length > 0),
        lastGoalCompletedAt: getLastGoalCompletedAt((dbNote as any)?.goals),
      };
    });

    const now = new Date();
    const thirtyDaysAgo = new Date(now.getTime() - 30 * 24 * 60 * 60 * 1000);
    const sevenDaysAgo = new Date(now.getTime() - 7 * 24 * 60 * 60 * 1000);

    return {
      userId,
      stats: {
        totalUsers: usersResponse.totalCount,
        recentSignups: usersResponse.data.filter((u) => new Date(u.createdAt) > thirtyDaysAgo).length,
        activeThisWeek: usersResponse.data.filter((u) => u.lastActiveAt && new Date(u.lastActiveAt) > sevenDaysAgo).length,
      },
      users: mergedUsers.sort((a, b) => a.sortOrder - b.sortOrder),
      events: dbEvents,
    };
  } catch (error) {
    console.error("Error fetching data:", error);
    return {
      userId,
      stats: { totalUsers: 0, recentSignups: 0, activeThisWeek: 0 },
      users: [],
      events: [],
      error: "Unable to fetch user data",
    };
  }
});

// Server function to update user sort order (batch)
const updateSortOrderFn = createServerFn({ method: "POST" })
  .inputValidator((input: { orderedIds: { clerkId: string; sortOrder: number }[] }) => input)
  .handler(async ({ data }) => {
    "use server";
    await verifyAdmin();
    const { updateUserSortOrder } = await import("@/lib/db.server");
    await updateUserSortOrder(data.orderedIds);
    return { success: true };
  });

// Server function to toggle active mentee status
const toggleMenteeFn = createServerFn({ method: "POST" })
  .inputValidator((input: { clerkId: string; isActive: boolean }) => input)
  .handler(async ({ data }) => {
    "use server";
    await verifyAdmin();
    const { toggleActiveMentee } = await import("@/lib/db.server");
    await toggleActiveMentee(data.clerkId, data.isActive);
    return { success: true };
  });

// Helper: Verify admin role for event mutations
async function verifyAdmin() {
  const { auth, clerkClient } = await import("@clerk/tanstack-react-start/server");
  const { userId } = await auth();
  if (!userId) throw new Error("Not authenticated");
  const client = await clerkClient();
  const currentUser = await client.users.getUser(userId);
  const role = (currentUser.publicMetadata as { role?: string })?.role;
  if (role !== "admin") throw new Error("Not authorized");
}

// Server function to create an event
const createEventFn = createServerFn({ method: "POST" })
  .inputValidator((input: {
    title: string;
    description: string;
    startDate: string;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    recurrenceType: string;
    recurrenceEndDate: string | null;
  }) => input)
  .handler(async ({ data }) => {
    "use server";
    await verifyAdmin();
    const { initializeDatabase, createEvent } = await import("@/lib/db.server");
    await initializeDatabase();
    const id = await createEvent(
      data.title, data.description, data.startDate, data.endDate,
      data.startTime, data.endTime,
      data.recurrenceType as any, data.recurrenceEndDate,
    );
    return { success: true, id };
  });

// Server function to update an event
const updateEventFn = createServerFn({ method: "POST" })
  .inputValidator((input: {
    id: number;
    title: string;
    description: string;
    startDate: string;
    endDate: string | null;
    startTime: string | null;
    endTime: string | null;
    recurrenceType: string;
    recurrenceEndDate: string | null;
  }) => input)
  .handler(async ({ data }) => {
    "use server";
    await verifyAdmin();
    const { updateEvent } = await import("@/lib/db.server");
    await updateEvent(
      data.id, data.title, data.description, data.startDate, data.endDate,
      data.startTime, data.endTime,
      data.recurrenceType as any, data.recurrenceEndDate,
    );
    return { success: true };
  });

// Server function to delete an event
const deleteEventFn = createServerFn({ method: "POST" })
  .inputValidator((input: { id: number }) => input)
  .handler(async ({ data }) => {
    "use server";
    await verifyAdmin();
    const { deleteEvent } = await import("@/lib/db.server");
    await deleteEvent(data.id);
    return { success: true };
  });

export const Route = createFileRoute("/admin/")({
  component: AdminPage,
  head: () => ({
    meta: [
      {
        title: "Admin Dashboard | Compass Coaching",
      },
      {
        name: "robots",
        content: "noindex, nofollow",
      },
    ],
  }),
  loader: async () => await getAdminData(),
});

// ── Sortable User Row ────────────────────────────────────────

function SortableUserRow({
  userRow,
  onToggleMentee,
  queuePosition,
}: {
  userRow: MergedUser;
  onToggleMentee: (clerkId: string) => void;
  queuePosition: number | null;
}) {
  const {
    attributes,
    listeners,
    setNodeRef,
    transform,
    transition,
    isDragging,
  } = useSortable({ id: userRow.clerkId });

  const style = {
    transform: CSS.Transform.toString(transform),
    transition,
    opacity: isDragging ? 0.5 : 1,
    zIndex: isDragging ? 50 : undefined,
  };

  return (
    <tr
      ref={setNodeRef}
      style={style}
      className={`border-b border-stone-100 ${
        !userRow.isInDatabase ? "bg-amber-50/50" : ""
      } ${isDragging ? "bg-stone-100" : ""}`}
    >
      {/* Drag handle */}
      <td className="py-3 px-2 w-10">
        <button
          {...attributes}
          {...listeners}
          className="cursor-grab active:cursor-grabbing p-1 rounded hover:bg-stone-200 text-stone-400 hover:text-stone-600 transition-colors"
          title="Drag to reorder"
        >
          <GripVertical className="w-4 h-4" />
        </button>
      </td>

      {/* Queue / Status */}
      <td className="py-3 px-2 w-14 text-center">
        {userRow.isActiveMentee ? (
          <span className="inline-flex items-center gap-1 px-1.5 py-0.5 rounded-full bg-lime-100 text-lime-700 text-xs font-medium">
            <UserCheck className="w-3 h-3" />
            Active
          </span>
        ) : queuePosition !== null ? (
          <span className="inline-flex items-center justify-center w-6 h-6 rounded-full bg-stone-200 text-stone-600 text-xs font-semibold" title={`Queue position ${queuePosition}`}>
            {queuePosition}
          </span>
        ) : null}
      </td>

      {/* Active mentee checkbox */}
      <td className="py-3 px-2 w-10 text-center">
        <input
          type="checkbox"
          checked={userRow.isActiveMentee}
          onChange={() => onToggleMentee(userRow.clerkId)}
          className="w-4 h-4 rounded border-stone-300 text-lime-600 focus:ring-lime-500 cursor-pointer accent-lime-600"
          title={userRow.isActiveMentee ? "Remove from active mentees" : "Mark as active mentee"}
        />
      </td>

      {/* User info */}
      <td className="py-3 px-4">
        <div className="flex items-center gap-3">
          {!userRow.isInDatabase && (
            <div className="shrink-0" title="New user - not yet saved to database">
              <UserPlus className="w-4 h-4 text-amber-500" />
            </div>
          )}
          <div>
            <p className="font-medium text-stone-700">{userRow.name || "No name"}</p>
            <p className="text-sm text-stone-500">{userRow.email || "No email"}</p>
          </div>
        </div>
      </td>

      {/* Info indicators */}
      <td className="py-3 px-3">
        <div className="flex items-center gap-2">
          <span title={userRow.hasNotes ? "Has counseling notes" : "No notes yet"}>
            <FileText
              className={`w-4 h-4 ${userRow.hasNotes ? "text-blue-500" : "text-stone-300"}`}
            />
          </span>
          <span title={userRow.hasGoals ? "Has goals set" : "No goals yet"}>
            <Target
              className={`w-4 h-4 ${userRow.hasGoals ? "text-lime-600" : "text-stone-300"}`}
            />
          </span>
          <span title={userRow.hasAdminMessage ? "Has admin message" : "No admin message"}>
            <MessageSquare
              className={`w-4 h-4 ${userRow.hasAdminMessage ? "text-purple-500" : "text-stone-300"}`}
            />
          </span>
        </div>
      </td>

      {/* Last Active */}
      <td className="py-3 px-4 text-sm text-stone-600">
        {userRow.lastActiveAt
          ? new Date(userRow.lastActiveAt).toLocaleDateString("en-US", {
              month: "short",
              day: "numeric",
              year: "numeric",
            })
          : "Never"}
      </td>

      {/* View button */}
      <td className="py-3 px-4 text-right">
        <Link to="/admin/user/$userId" params={{ userId: userRow.clerkId }}>
          <Button variant="primary" size="sm">
            <Eye className="w-4 h-4" />
            View
          </Button>
        </Link>
      </td>
    </tr>
  );
}

function AdminPage() {
  const { user, isLoaded } = useUser();
  const router = useRouter();
  const loaderData = Route.useLoaderData();
  const { stats, error, users, events } = loaderData;
  const clearAll = useAssessmentStore((state) => state.clearAll);
  const storedResults = useAssessmentStore((state) => state.results);
  const progress = useAssessmentProgress();

  // User ordering state (local copy for DnD reordering)
  const [userOrder, setUserOrder] = useState<MergedUser[]>(users);
  const activeMentees = useMemo(() => userOrder.filter((u) => u.isActiveMentee), [userOrder]);
  const userIds = useMemo(() => userOrder.map((u) => u.clerkId), [userOrder]);

  // DnD sensors
  const sensors = useSensors(
    useSensor(PointerSensor, { activationConstraint: { distance: 5 } }),
    useSensor(KeyboardSensor, { coordinateGetter: sortableKeyboardCoordinates }),
  );

  const handleDragEnd = async (event: DragEndEvent) => {
    const { active, over } = event;
    if (!over || active.id === over.id) return;

    const oldIndex = userOrder.findIndex((u) => u.clerkId === active.id);
    const newIndex = userOrder.findIndex((u) => u.clerkId === over.id);
    const reordered = arrayMove(userOrder, oldIndex, newIndex);
    setUserOrder(reordered);

    // Persist new sort order
    try {
      await updateSortOrderFn({
        data: {
          orderedIds: reordered.map((u, i) => ({ clerkId: u.clerkId, sortOrder: i })),
        },
      });
    } catch (err) {
      console.error("Failed to save sort order:", err);
    }
  };

  const handleToggleMentee = async (clerkId: string) => {
    const user = userOrder.find((u) => u.clerkId === clerkId);
    if (!user) return;
    const newValue = !user.isActiveMentee;

    // Optimistic update
    setUserOrder((prev) =>
      prev.map((u) => (u.clerkId === clerkId ? { ...u, isActiveMentee: newValue } : u))
    );

    try {
      await toggleMenteeFn({ data: { clerkId, isActive: newValue } });
    } catch (err) {
      console.error("Failed to toggle mentee:", err);
      // Revert on error
      setUserOrder((prev) =>
        prev.map((u) => (u.clerkId === clerkId ? { ...u, isActiveMentee: !newValue } : u))
      );
    }
  };

  const [resetConfirmed, setResetConfirmed] = useState(false);

  // Event management state
  const emptyEventForm: EventFormData = { title: "", description: "", startDate: "", endDate: "", startTime: "", endTime: "", recurrenceType: "none", recurrenceEndDate: "" };
  const [showEventForm, setShowEventForm] = useState(false);
  const [editingEventId, setEditingEventId] = useState<number | null>(null);
  const [eventForm, setEventForm] = useState<EventFormData>(emptyEventForm);
  const [eventSaving, setEventSaving] = useState(false);
  const [deletingEventId, setDeletingEventId] = useState<number | null>(null);
  const [populateConfirmed, setPopulateConfirmed] = useState(false);
  const [jimmyConfirmed, setJimmyConfirmed] = useState(false);

  const handleResetAssessment = () => {
    clearAll();
    setResetConfirmed(true);
    setTimeout(() => setResetConfirmed(false), 2000);
  };

  const handlePopulateTestData = () => {
    useAssessmentStore.setState({
      basic: {
        name: "Parker J Conn",
        ageRange: "25-34",
        educationLevel: "bachelors",
        employmentStatus: "employed-ft",
        primaryReason: "Testing brings",
        degrees: [
          { level: "bachelor", name: "software development & information management", gpa: "3.75" },
          { level: "bachelor", name: "information assurance & cyber securit", gpa: "3.75" },
          { level: "", name: "" },
        ],
        workExperience: [
          "Managed people or led a team",
          "Used specialized software or tools",
          "Worked with customers or clients",
          "Taught or trained others",
          "Wrote reports or documents",
          "Analyzed data or solved technical problems",
          "Built or repaired things",
        ],
      },
      personality: {
        work_environment: 2, interaction_style: 2, decision_making: 1, structure: 2,
        energy_source: 1, problem_solving: 1, communication: 1, pace: 1,
        schedule: 1, travel: 1, physical_demands: 1, learning_style: 1,
        stress_tolerance: 2, tech_comfort: 1, conflict_resolution: 2,
      },
      values: {
        work_life_balance: 5, income_potential: 5, helping_others: 5, creativity: 3,
        job_security: 5, independence: 5, leadership: 5, learning_growth: 5,
        recognition: 4, physical_activity: 3, environmental_impact: 2, variety: 5,
        motivation_driver: 5,
      },
      aptitude: {
        stem: [5, 5, 5, 4], arts: [3, 4, 2, 1], communication: [3, 4, 2, 1],
        business: [4, 2, 2, 4], healthcare: [1, 1, 2, 1], trades: [2, 2, 2, 2],
        socialServices: [4, 3, 2, 1], law: [3, 2, 1, 1],
      },
      challenges: {
        financial: "no-constraints", timeAvailability: "evenings-weekends",
        locationFlexibility: "local-only", familyObligations: "none",
        transportation: "own-vehicle", healthConsiderations: "none",
        educationGaps: ["None of the above"], supportSystem: "strong",
        additionalNotes: "Testing Challenges",
        salaryMinimum: "60k-80k", timelineUrgency: "no-rush",
      },
      results: null,
    });
    setPopulateConfirmed(true);
    setTimeout(() => setPopulateConfirmed(false), 2000);
  };

  const handlePopulateJimmy = () => {
    useAssessmentStore.setState({
      basic: {
        name: "James Zagurskie",
        ageRange: "18-24",
        educationLevel: "bachelors",
        employmentStatus: "employed-ft",
        primaryReason: "I want to provide free coaching to young adults who need assistance in navigating life.",
        degrees: [
          { level: "bachelor", name: "civil engineering technology", gpa: "" },
          { level: "", name: "" },
        ],
        workExperience: [
          "Managed people or led a team",
          "Worked with customers or clients",
          "Taught or trained others",
          "Built or repaired things",
        ],
      },
      personality: {
        work_environment: 2, interaction_style: 2, decision_making: 2, structure: 3,
        energy_source: 4, problem_solving: 1, communication: 2, pace: 2,
        schedule: 2, travel: 3, physical_demands: 2, learning_style: 1,
        stress_tolerance: 1, tech_comfort: 2, conflict_resolution: 1,
      },
      values: {
        work_life_balance: 4, income_potential: 4, helping_others: 5, creativity: 3,
        job_security: 4, independence: 4, leadership: 5, learning_growth: 5,
        recognition: 1, physical_activity: 3, environmental_impact: 3, variety: 3,
        motivation_driver: 5,
      },
      aptitude: {
        stem: [5, 4, 4, 1], arts: [1, 4, 3, 3], communication: [5, 3, 1, 1],
        business: [3, 1, 2, 4], healthcare: [1, 1, 2, 1], trades: [2, 2, 2, 2],
        socialServices: [5, 3, 3, 1], law: [3, 1, 1, 3],
      },
      challenges: {
        financial: "working-while-learning", timeAvailability: "evenings-weekends",
        locationFlexibility: "local-only", familyObligations: "none",
        transportation: "own-vehicle", healthConsiderations: "none",
        educationGaps: ["None of the above"], supportSystem: "strong",
        additionalNotes: "",
        salaryMinimum: "40k-60k", timelineUrgency: "within-a-year",
      },
      results: null,
    });
    setJimmyConfirmed(true);
    setTimeout(() => setJimmyConfirmed(false), 2000);
  };

  // ── Event Handlers ─────────────────────────────────────────

  const openNewEventForm = () => {
    setEditingEventId(null);
    setEventForm(emptyEventForm);
    setShowEventForm(true);
  };

  const openEditEventForm = (event: AdminCalendarEvent) => {
    setEditingEventId(event.id);
    setEventForm({
      title: event.title,
      description: event.description || "",
      startDate: event.start_date,
      endDate: event.end_date || "",
      startTime: event.start_time || "",
      endTime: event.end_time || "",
      recurrenceType: event.recurrence_type || "none",
      recurrenceEndDate: event.recurrence_end_date || "",
    });
    setShowEventForm(true);
  };

  const cancelEventForm = () => {
    setShowEventForm(false);
    setEditingEventId(null);
    setEventForm(emptyEventForm);
  };

  const handleEventSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!eventForm.title || !eventForm.startDate) return;
    setEventSaving(true);
    try {
      const payload = {
        title: eventForm.title,
        description: eventForm.description,
        startDate: eventForm.startDate,
        endDate: eventForm.endDate || null,
        startTime: eventForm.startTime || null,
        endTime: eventForm.endTime || null,
        recurrenceType: eventForm.recurrenceType,
        recurrenceEndDate: eventForm.recurrenceEndDate || null,
      };
      if (editingEventId) {
        await updateEventFn({ data: { id: editingEventId, ...payload } });
      } else {
        await createEventFn({ data: payload });
      }
      cancelEventForm();
      await router.invalidate();
    } catch (err) {
      console.error("Failed to save event:", err);
    } finally {
      setEventSaving(false);
    }
  };

  const handleDeleteEvent = async (id: number) => {
    setDeletingEventId(id);
    try {
      await deleteEventFn({ data: { id } });
      await router.invalidate();
    } catch (err) {
      console.error("Failed to delete event:", err);
    } finally {
      setDeletingEventId(null);
    }
  };

  const formatEventDate = (dateStr: string) => {
    const [y, m, d] = dateStr.split("-").map(Number);
    return new Date(y, m - 1, d).toLocaleDateString("en-US", { month: "short", day: "numeric", year: "numeric" });
  };

  const formatEventTime = (timeStr: string) => {
    const [hours, minutes] = timeStr.split(":").map(Number);
    const period = hours >= 12 ? "PM" : "AM";
    const h = hours % 12 || 12;
    return minutes === 0 ? `${h} ${period}` : `${h}:${minutes.toString().padStart(2, "0")} ${period}`;
  };

  return (
    <div className="min-h-screen bg-stone-50 py-12 px-6">
      <Container size="lg">
        {/* Header */}
        <div className="mb-8">
          <div className="flex items-center gap-3 mb-2">
            <div className="w-10 h-10 bg-lime-600 rounded-lg flex items-center justify-center">
              <Shield className="w-5 h-5 text-white" />
            </div>
            <h1 className="text-3xl font-bold text-stone-700">Admin Dashboard</h1>
          </div>
          <p className="text-stone-600 max-w-2xl">
            Welcome{isLoaded && user?.firstName ? `, ${user.firstName}` : ""}. Manage registered users and counseling notes, create and schedule community events, and access developer tools for testing.
          </p>
        </div>

        {/* Error Banner */}
        {error && (
          <div className="mb-6 p-4 bg-amber-50 border border-amber-200 rounded-lg flex items-start gap-3">
            <AlertTriangle className="w-5 h-5 text-amber-600 shrink-0 mt-0.5" />
            <div>
              <p className="text-amber-800 font-medium">Unable to load data</p>
              <p className="text-amber-700 text-sm">{error}</p>
            </div>
          </div>
        )}

        <Tabs defaultValue="users">
          <TabsList>
            <TabsTrigger value="users">
              <Users className="w-4 h-4" />
              Users
            </TabsTrigger>
            <TabsTrigger value="events">
              <CalendarDays className="w-4 h-4" />
              Events
            </TabsTrigger>
            <TabsTrigger value="devtools">
              <Settings className="w-4 h-4" />
              Dev Tools
            </TabsTrigger>
          </TabsList>

          {/* ── Users Tab ─────────────────────────────────── */}
          <TabsContent value="users">
            {/* Stats Grid */}
            <div className="grid md:grid-cols-3 gap-6 mb-8">
              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-blue-100 rounded-lg flex items-center justify-center">
                      <Users className="w-6 h-6 text-blue-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Total Users</p>
                      <p className="text-2xl font-bold text-stone-700">{stats.totalUsers}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-lime-100 rounded-lg flex items-center justify-center">
                      <Clock className="w-6 h-6 text-lime-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">New This Month</p>
                      <p className="text-2xl font-bold text-stone-700">{stats.recentSignups}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>

              <Card>
                <CardContent className="p-6">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 bg-purple-100 rounded-lg flex items-center justify-center">
                      <Activity className="w-6 h-6 text-purple-600" />
                    </div>
                    <div>
                      <p className="text-sm text-stone-500">Active This Week</p>
                      <p className="text-2xl font-bold text-stone-700">{stats.activeThisWeek}</p>
                    </div>
                  </div>
                </CardContent>
              </Card>
            </div>

            {/* Active Mentees */}
            {activeMentees.length > 0 && (
              <Card className="mb-6">
                <CardHeader>
                  <CardTitle className="flex items-center gap-2">
                    <UserCheck className="w-5 h-5 text-lime-600" />
                    Active Mentees
                    <span className="ml-1 text-sm font-normal text-stone-500">({activeMentees.length})</span>
                  </CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="grid gap-3 sm:grid-cols-2 lg:grid-cols-3">
                    {activeMentees.map((mentee) => (
                      <Link
                        key={mentee.clerkId}
                        to="/admin/user/$userId"
                        params={{ userId: mentee.clerkId }}
                        className="flex items-center gap-3 p-3 rounded-lg border border-lime-200 bg-lime-50/50 hover:bg-lime-100/60 transition-colors"
                      >
                        <div className="w-8 h-8 bg-lime-600 rounded-full flex items-center justify-center text-white text-sm font-medium shrink-0">
                          {(mentee.name || "?")[0].toUpperCase()}
                        </div>
                        <div className="min-w-0">
                          <p className="font-medium text-stone-700 truncate">{mentee.name || "No name"}</p>
                          {mentee.lastGoalCompletedAt ? (
                            <p className="text-xs text-lime-600 truncate">
                              Last goal checked {new Date(mentee.lastGoalCompletedAt).toLocaleDateString("en-US", { month: "short", day: "numeric" })}
                            </p>
                          ) : (
                            <p className="text-xs text-stone-500 truncate">{mentee.email || "No email"}</p>
                          )}
                        </div>
                      </Link>
                    ))}
                  </div>
                </CardContent>
              </Card>
            )}

            {/* Users Table */}
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center gap-2">
                  <Users className="w-5 h-5 text-lime-600" />
                  Registered Users
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <DndContext sensors={sensors} collisionDetection={closestCenter} onDragEnd={handleDragEnd}>
                    <table className="w-full">
                      <thead>
                        <tr className="border-b border-stone-200">
                          <th className="w-10 py-3 px-2" />
                          <th className="w-14 py-3 px-2 text-center text-sm font-medium text-stone-500">Queue</th>
                          <th className="w-10 py-3 px-2 text-center text-sm font-medium text-stone-500">
                            <UserCheck className="w-4 h-4 mx-auto text-stone-400" />
                          </th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">User</th>
                          <th className="text-left py-3 px-3 text-sm font-medium text-stone-500">Info</th>
                          <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Last Active</th>
                          <th className="text-right py-3 px-4 text-sm font-medium text-stone-500 w-24" />
                        </tr>
                      </thead>
                      <SortableContext items={userIds} strategy={verticalListSortingStrategy}>
                        <tbody>
                          {(() => {
                            let queueNum = 0;
                            return userOrder.map((userRow) => {
                              const queuePosition = userRow.isActiveMentee
                                ? null
                                : ++queueNum;
                              return (
                                <SortableUserRow
                                  key={userRow.clerkId}
                                  userRow={userRow}
                                  onToggleMentee={handleToggleMentee}
                                  queuePosition={queuePosition}
                                />
                              );
                            });
                          })()}
                          {userOrder.length === 0 && (
                            <tr>
                              <td colSpan={7} className="py-8 text-center text-stone-500">
                                No users found
                              </td>
                            </tr>
                          )}
                        </tbody>
                      </SortableContext>
                    </table>
                  </DndContext>
                </div>

                {/* Legend */}
                <div className="mt-4 pt-4 border-t border-stone-200 flex flex-wrap items-center gap-x-6 gap-y-2 text-sm text-stone-500">
                  <div className="flex items-center gap-2">
                    <GripVertical className="w-4 h-4 text-stone-400" />
                    <span>Drag to reorder</span>
                  </div>
                  <div className="flex items-center gap-2">
                    <span className="inline-flex items-center justify-center w-5 h-5 rounded-full bg-stone-200 text-stone-600 text-[10px] font-semibold">3</span>
                    <span>Queue position</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <FileText className="w-3.5 h-3.5 text-blue-500" />
                    <span>Notes</span>
                    <Target className="w-3.5 h-3.5 text-lime-600 ml-1.5" />
                    <span>Goals</span>
                    <MessageSquare className="w-3.5 h-3.5 text-purple-500 ml-1.5" />
                    <span>Message</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>

          {/* ── Events Tab ────────────────────────────────── */}
          <TabsContent value="events">
        <Card>
          <CardHeader>
            <div className="flex items-center justify-between">
              <CardTitle className="flex items-center gap-2">
                <CalendarDays className="w-5 h-5 text-cyan-600" />
                Events Management
              </CardTitle>
              {!showEventForm && (
                <Button variant="primary" size="sm" onClick={openNewEventForm}>
                  <Plus className="w-4 h-4" />
                  Add Event
                </Button>
              )}
            </div>
          </CardHeader>
          <CardContent>
            {/* Event Form */}
            {showEventForm && (
              <form onSubmit={handleEventSubmit} className="mb-6 p-4 bg-stone-50 rounded-lg border border-stone-200">
                <div className="flex items-center justify-between mb-4">
                  <h4 className="font-medium text-stone-700">
                    {editingEventId ? "Edit Event" : "New Event"}
                  </h4>
                  <button type="button" onClick={cancelEventForm} className="p-1 hover:bg-stone-200 rounded transition-colors">
                    <X className="w-4 h-4 text-stone-500" />
                  </button>
                </div>

                <div className="grid gap-4">
                  {/* Title */}
                  <div>
                    <label htmlFor="event-title" className="block text-sm font-medium text-stone-600 mb-1">
                      Title <span className="text-red-500">*</span>
                    </label>
                    <Input
                      id="event-title"
                      value={eventForm.title}
                      onChange={(e) => setEventForm((f) => ({ ...f, title: e.target.value }))}
                      placeholder="e.g. Career Workshop"
                      required
                    />
                  </div>

                  {/* Description */}
                  <div>
                    <label htmlFor="event-desc" className="block text-sm font-medium text-stone-600 mb-1">
                      Description
                    </label>
                    <Textarea
                      id="event-desc"
                      value={eventForm.description}
                      onChange={(e) => setEventForm((f) => ({ ...f, description: e.target.value }))}
                      placeholder="Optional details about the event..."
                      className="min-h-20"
                    />
                  </div>

                  {/* Date Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="event-start-date" className="block text-sm font-medium text-stone-600 mb-1">
                        Start Date <span className="text-red-500">*</span>
                      </label>
                      <DatePicker
                        id="event-start-date"
                        value={eventForm.startDate}
                        onChange={(v) => setEventForm((f) => ({ ...f, startDate: v }))}
                        placeholder="Pick start date"
                        required
                      />
                    </div>
                    <div>
                      <label htmlFor="event-end-date" className="block text-sm font-medium text-stone-600 mb-1">
                        End Date <span className="text-stone-400 font-normal">(for multi-day)</span>
                      </label>
                      <DatePicker
                        id="event-end-date"
                        value={eventForm.endDate}
                        onChange={(v) => setEventForm((f) => ({ ...f, endDate: v }))}
                        placeholder="Optional end date"
                        min={eventForm.startDate}
                      />
                    </div>
                  </div>

                  {/* Time Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="event-start-time" className="block text-sm font-medium text-stone-600 mb-1">
                        Start Time <span className="text-stone-400 font-normal">(optional)</span>
                      </label>
                      <TimePicker
                        id="event-start-time"
                        value={eventForm.startTime}
                        onChange={(v) => setEventForm((f) => ({ ...f, startTime: v }))}
                        placeholder="Start time"
                      />
                    </div>
                    <div>
                      <label htmlFor="event-end-time" className="block text-sm font-medium text-stone-600 mb-1">
                        End Time <span className="text-stone-400 font-normal">(optional)</span>
                      </label>
                      <TimePicker
                        id="event-end-time"
                        value={eventForm.endTime}
                        onChange={(v) => setEventForm((f) => ({ ...f, endTime: v }))}
                        placeholder="End time"
                      />
                    </div>
                  </div>

                  {/* Recurrence Row */}
                  <div className="grid sm:grid-cols-2 gap-4">
                    <div>
                      <label htmlFor="event-recurrence" className="block text-sm font-medium text-stone-600 mb-1">
                        Recurrence
                      </label>
                      <Select
                        value={eventForm.recurrenceType}
                        onValueChange={(v) => setEventForm((f) => ({ ...f, recurrenceType: v, recurrenceEndDate: v === "none" ? "" : f.recurrenceEndDate }))}
                      >
                        <SelectTrigger id="event-recurrence">
                          <SelectValue placeholder="No repeat" />
                        </SelectTrigger>
                        <SelectContent>
                          <SelectItem value="none">Does not repeat</SelectItem>
                          <SelectItem value="weekly">Weekly</SelectItem>
                          <SelectItem value="biweekly">Every 2 weeks</SelectItem>
                          <SelectItem value="monthly">Monthly</SelectItem>
                        </SelectContent>
                      </Select>
                    </div>
                    {eventForm.recurrenceType !== "none" && (
                      <div>
                        <label htmlFor="event-recurrence-end" className="block text-sm font-medium text-stone-600 mb-1">
                          Repeat Until
                        </label>
                        <DatePicker
                          id="event-recurrence-end"
                          value={eventForm.recurrenceEndDate}
                          onChange={(v) => setEventForm((f) => ({ ...f, recurrenceEndDate: v }))}
                          placeholder="End of recurrence"
                          min={eventForm.startDate}
                        />
                      </div>
                    )}
                  </div>

                  {/* Actions */}
                  <div className="flex items-center gap-3 pt-2">
                    <Button type="submit" variant="primary" disabled={eventSaving || !eventForm.title || !eventForm.startDate}>
                      {eventSaving ? (
                        <Loader2 className="w-4 h-4 animate-spin" />
                      ) : (
                        <Save className="w-4 h-4" />
                      )}
                      {editingEventId ? "Update Event" : "Create Event"}
                    </Button>
                    <Button type="button" variant="outline" onClick={cancelEventForm}>
                      Cancel
                    </Button>
                  </div>
                </div>
              </form>
            )}

            {/* Events List */}
            {events.length > 0 ? (
              <div className="overflow-x-auto">
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-stone-200">
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Event</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Date</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-500">Time</th>
                      <th className="text-left py-3 px-4 text-sm font-medium text-stone-500 w-28">Actions</th>
                    </tr>
                  </thead>
                  <tbody>
                    {events.map((evt) => {
                      const isPast = (evt.end_date || evt.start_date) < new Date().toISOString().split("T")[0];
                      return (
                        <tr
                          key={evt.id}
                          className={`border-b border-stone-100 ${isPast ? "opacity-50" : ""}`}
                        >
                          <td className="py-3 px-4">
                            <div className="font-medium text-stone-700 text-sm flex items-center gap-1.5">
                              {evt.title}
                              {evt.recurrence_type && evt.recurrence_type !== "none" && (
                                <span className="inline-flex items-center gap-0.5 px-1.5 py-0.5 text-[10px] font-medium bg-cyan-100 text-cyan-700 rounded-full">
                                  <Repeat size={10} />
                                  {evt.recurrence_type}
                                </span>
                              )}
                            </div>
                            {evt.description && (
                              <div className="text-xs text-stone-500 mt-0.5 line-clamp-1">{evt.description}</div>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-stone-600 whitespace-nowrap">
                            {formatEventDate(evt.start_date)}
                            {evt.end_date && evt.end_date !== evt.start_date && (
                              <> – {formatEventDate(evt.end_date)}</>
                            )}
                          </td>
                          <td className="py-3 px-4 text-sm text-stone-600 whitespace-nowrap">
                            {evt.start_time ? (
                              <>
                                {formatEventTime(evt.start_time)}
                                {evt.end_time && <> – {formatEventTime(evt.end_time)}</>}
                              </>
                            ) : (
                              <span className="text-stone-400">All day</span>
                            )}
                          </td>
                          <td className="py-3 px-4">
                            <div className="flex items-center gap-1">
                              <button
                                type="button"
                                onClick={() => openEditEventForm(evt)}
                                className="p-1.5 hover:bg-stone-100 rounded transition-colors text-stone-500 hover:text-stone-700"
                                title="Edit event"
                              >
                                <Pencil className="w-4 h-4" />
                              </button>
                              <button
                                type="button"
                                onClick={() => handleDeleteEvent(evt.id)}
                                disabled={deletingEventId === evt.id}
                                className="p-1.5 hover:bg-red-50 rounded transition-colors text-stone-400 hover:text-red-600"
                                title="Delete event"
                              >
                                {deletingEventId === evt.id ? (
                                  <Loader2 className="w-4 h-4 animate-spin" />
                                ) : (
                                  <Trash2 className="w-4 h-4" />
                                )}
                              </button>
                            </div>
                          </td>
                        </tr>
                      );
                    })}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="py-8 text-center text-stone-500">
                <CalendarDays className="w-8 h-8 mx-auto mb-2 text-stone-300" />
                <p className="text-sm">No events yet. Click "Add Event" to create one.</p>
              </div>
            )}
          </CardContent>
        </Card>
          </TabsContent>

          {/* ── Dev Tools Tab ─────────────────────────────── */}
          <TabsContent value="devtools">
        {/* Dev Tools */}
        <Card className="border-2 border-stone-200 bg-stone-50 overflow-hidden">
          <div className="bg-stone-700 px-4 py-2 flex items-center gap-2">
            <div className="flex items-center gap-1.5">
              <div className="w-3 h-3 rounded-full bg-red-400" />
              <div className="w-3 h-3 rounded-full bg-amber-400" />
              <div className="w-3 h-3 rounded-full bg-lime-400" />
            </div>
            <span className="text-xs font-mono text-stone-400 ml-2">compass-admin ~/devtools</span>
          </div>
          <CardContent className="p-5">
            <div className="flex items-center gap-2 text-xs text-stone-500 uppercase tracking-wider mb-4 font-mono">
              <Settings className="w-3.5 h-3.5" />
              Assessment State
            </div>
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4">
              {/* State */}
              <div className="flex flex-wrap items-center gap-x-6 gap-y-2 text-sm font-mono">
                <span className="text-stone-500">progress:</span>
                <span className="text-stone-700 font-medium">{progress.percentComplete}%</span>
                <span className="text-stone-500">results:</span>
                <span className={storedResults ? "text-lime-600 font-medium" : "text-stone-400"}>{storedResults ? "saved" : "null"}</span>
                {storedResults && storedResults.version !== CURRENT_ASSESSMENT_VERSION && (
                  <span className="text-amber-500 text-xs">(outdated)</span>
                )}
              </div>

              {/* Actions */}
              <div className="flex items-center gap-2">
                <button
                  type="button"
                  onClick={() => {
                    const state = useAssessmentStore.getState();
                    navigator.clipboard.writeText(JSON.stringify({
                      basic: state.basic,
                      personality: state.personality,
                      values: state.values,
                      aptitude: state.aptitude,
                      challenges: state.challenges,
                      results: state.results,
                    }, null, 2));
                  }}
                  className="p-2 rounded-lg border border-stone-200 hover:bg-stone-100 text-stone-500 hover:text-stone-700 transition-colors"
                  title="Copy state to clipboard"
                >
                  <Copy className="w-4 h-4" />
                </button>
                <button
                  type="button"
                  onClick={handlePopulateTestData}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-lime-50 hover:border-lime-300 text-sm font-mono transition-colors"
                  title="Populate all sections with Parker's test data"
                >
                  {populateConfirmed ? (
                    <>
                      <Check className="w-4 h-4 text-lime-600" />
                      <span className="text-lime-600">loaded</span>
                    </>
                  ) : (
                    <>
                      <DatabaseZap className="w-4 h-4 text-stone-400" />
                      <span className="text-stone-600">Parker</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handlePopulateJimmy}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-lime-50 hover:border-lime-300 text-sm font-mono transition-colors"
                  title="Populate all sections with Jimmy's test data (no degrees)"
                >
                  {jimmyConfirmed ? (
                    <>
                      <Check className="w-4 h-4 text-lime-600" />
                      <span className="text-lime-600">loaded</span>
                    </>
                  ) : (
                    <>
                      <DatabaseZap className="w-4 h-4 text-stone-400" />
                      <span className="text-stone-600">Jimmy</span>
                    </>
                  )}
                </button>
                <button
                  type="button"
                  onClick={handleResetAssessment}
                  className="inline-flex items-center gap-2 px-3 py-1.5 rounded-lg border border-stone-200 hover:bg-red-50 hover:border-red-300 text-sm font-mono transition-colors"
                >
                  {resetConfirmed ? (
                    <>
                      <Check className="w-4 h-4 text-lime-600" />
                      <span className="text-lime-600">done</span>
                    </>
                  ) : (
                    <>
                      <Trash2 className="w-4 h-4 text-stone-400" />
                      <span className="text-stone-600">Reset</span>
                    </>
                  )}
                </button>
              </div>
            </div>

            {/* External Services */}
            <div className="mt-4 pt-4 border-t border-stone-200">
              <div className="text-xs text-stone-500 uppercase tracking-wider mb-2 font-mono">External Services</div>
              <div className="flex flex-col sm:flex-row gap-4 text-xs">
                <div className="flex items-center gap-2">
                  <a
                    href="https://dashboard.clerk.com"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-lime-600 hover:text-lime-700 font-medium transition-colors"
                  >
                    Clerk <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-stone-500">— User accounts & login</span>
                </div>
                <div className="flex items-center gap-2">
                  <a
                    href="https://vercel.com/dashboard"
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1 text-lime-600 hover:text-lime-700 font-medium transition-colors"
                  >
                    Vercel <ExternalLink className="w-3 h-3" />
                  </a>
                  <span className="text-stone-500">— Website hosting & deploys</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
          </TabsContent>
        </Tabs>

        {/* Platform Overview */}
        <Card className="border-stone-200 bg-stone-50/50 mt-8">
          <CardHeader>
            <CardTitle className="text-lg">How This Platform Works</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4 text-sm text-stone-600">
            <div>
              <h4 className="font-medium text-stone-700 mb-1">Career Assessment</h4>
              <p>
                Visitors take a 5-section assessment covering personality, values, aptitudes, and life challenges.
                Results are stored in their browser—not on our servers—for privacy. Users can download their results
                to share during coaching sessions.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-stone-700 mb-1">User Accounts</h4>
              <p>
                Signing in is optional. Logged-in users can save progress across devices and access their
                personalized dashboard. Admin access (like this page) is granted through Clerk user metadata.
              </p>
            </div>
            <div>
              <h4 className="font-medium text-stone-700 mb-1">Admin Notes</h4>
              <p>
                Use the Users tab to track notes about users you've counseled. Notes are saved to the database
                and persist across sessions. Users cannot see these notes.
              </p>
            </div>
          </CardContent>
        </Card>
      </Container>
    </div>
  );
}
