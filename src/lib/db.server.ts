import { createClient, type Client } from "@libsql/client";

// Lazy database client - only created when first used
let _db: Client | null = null;

function getDb(): Client {
  if (_db) return _db;

  const databaseUrl = process.env.TURSO_DATABASE_URL;
  const authToken = process.env.TURSO_AUTH_TOKEN;

  if (!databaseUrl) {
    throw new Error(
      "TURSO_DATABASE_URL is not set. Add it to your .env file.\n" +
        "Get it from https://turso.tech/app after creating a database."
    );
  }

  if (!authToken) {
    throw new Error(
      "TURSO_AUTH_TOKEN is not set. Add it to your .env file.\n" +
        "Generate a token from your Turso database dashboard."
    );
  }

  _db = createClient({
    url: databaseUrl,
    authToken: authToken,
  });

  return _db;
}

// Initialize database schema
export async function initializeDatabase() {
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS user_notes (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      clerk_id TEXT UNIQUE NOT NULL,
      name TEXT,
      email TEXT,
      notes TEXT DEFAULT '',
      admin_message TEXT DEFAULT '',
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Add admin_message column if it doesn't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE user_notes ADD COLUMN admin_message TEXT DEFAULT ''`);
  } catch {
    // Column already exists, ignore error
  }

  // Add goals column if it doesn't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE user_notes ADD COLUMN goals TEXT DEFAULT '[]'`);
  } catch {
    // Column already exists, ignore error
  }

  // Add sort_order column if it doesn't exist
  try {
    await getDb().execute(`ALTER TABLE user_notes ADD COLUMN sort_order INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }

  // Add is_active_mentee column if it doesn't exist
  try {
    await getDb().execute(`ALTER TABLE user_notes ADD COLUMN is_active_mentee INTEGER DEFAULT 0`);
  } catch {
    // Column already exists
  }

  // Create events table
  await getDb().execute(`
    CREATE TABLE IF NOT EXISTS events (
      id INTEGER PRIMARY KEY AUTOINCREMENT,
      title TEXT NOT NULL,
      description TEXT DEFAULT '',
      start_date TEXT NOT NULL,
      end_date TEXT,
      start_time TEXT,
      end_time TEXT,
      recurrence_type TEXT DEFAULT 'none',
      recurrence_end_date TEXT,
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);

  // Add recurrence columns if they don't exist (for existing databases)
  try {
    await getDb().execute(`ALTER TABLE events ADD COLUMN recurrence_type TEXT DEFAULT 'none'`);
  } catch {
    // Column already exists
  }
  try {
    await getDb().execute(`ALTER TABLE events ADD COLUMN recurrence_end_date TEXT`);
  } catch {
    // Column already exists
  }
}

// User notes types
export interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
  admin_message: string;
  sort_order: number;
  is_active_mentee: number;
  created_at: string;
  updated_at: string;
}

// Get all user notes from database
export async function getAllUserNotes(): Promise<UserNote[]> {
  const result = await getDb().execute(
    "SELECT * FROM user_notes ORDER BY sort_order ASC, created_at DESC"
  );
  return result.rows as unknown as UserNote[];
}

// Get user note by Clerk ID
export async function getUserNote(clerkId: string): Promise<UserNote | null> {
  const result = await getDb().execute({
    sql: "SELECT * FROM user_notes WHERE clerk_id = ?",
    args: [clerkId],
  });
  return (result.rows[0] as unknown as UserNote) || null;
}

// Upsert user note (insert or update)
export async function upsertUserNote(
  clerkId: string,
  name: string | null,
  email: string | null,
  notes: string
): Promise<void> {
  await getDb().execute({
    sql: `
      INSERT INTO user_notes (clerk_id, name, email, notes, updated_at)
      VALUES (?, ?, ?, ?, datetime('now'))
      ON CONFLICT(clerk_id) DO UPDATE SET
        name = excluded.name,
        email = excluded.email,
        notes = excluded.notes,
        updated_at = datetime('now')
    `,
    args: [clerkId, name, email, notes],
  });
}

// Delete user note
export async function deleteUserNote(clerkId: string): Promise<void> {
  await getDb().execute({
    sql: "DELETE FROM user_notes WHERE clerk_id = ?",
    args: [clerkId],
  });
}

// Update admin message for a user
export async function updateAdminMessage(
  clerkId: string,
  adminMessage: string
): Promise<void> {
  // First try to update existing record
  const result = await getDb().execute({
    sql: `UPDATE user_notes SET admin_message = ?, updated_at = datetime('now') WHERE clerk_id = ?`,
    args: [adminMessage, clerkId],
  });

  // If no row was updated, insert a new one
  if (result.rowsAffected === 0) {
    await getDb().execute({
      sql: `INSERT INTO user_notes (clerk_id, admin_message, updated_at) VALUES (?, ?, datetime('now'))`,
      args: [clerkId, adminMessage],
    });
  }
}

// Get admin message for a specific user (for dashboard display)
export async function getAdminMessage(clerkId: string): Promise<string> {
  const result = await getDb().execute({
    sql: "SELECT admin_message FROM user_notes WHERE clerk_id = ?",
    args: [clerkId],
  });
  const row = result.rows[0] as unknown as { admin_message: string } | undefined;
  return row?.admin_message || "";
}

// Recurrence types
export type RecurrenceType = "none" | "weekly" | "biweekly" | "monthly";

// Event type
export interface CalendarEvent {
  id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  recurrence_type: RecurrenceType;
  recurrence_end_date: string | null;
  created_at: string;
  updated_at: string;
}

// Expanded event instance (for calendar display)
export interface ExpandedEvent {
  id: number;
  parent_id: number;
  title: string;
  description: string;
  start_date: string;
  end_date: string | null;
  start_time: string | null;
  end_time: string | null;
  is_recurring: boolean;
  recurrence_type: RecurrenceType;
}

// Goal type
export interface UserGoal {
  id: string;
  text: string;
  completed: boolean;
  completedAt: string | null;
}

// Get goals for a specific user
export async function getUserGoals(clerkId: string): Promise<UserGoal[]> {
  const result = await getDb().execute({
    sql: "SELECT goals FROM user_notes WHERE clerk_id = ?",
    args: [clerkId],
  });
  const row = result.rows[0] as unknown as { goals: string } | undefined;
  try {
    return row?.goals ? JSON.parse(row.goals) : [];
  } catch {
    return [];
  }
}

// Save goals for a user (admin sets text, user can toggle completed)
export async function saveUserGoals(
  clerkId: string,
  goals: UserGoal[]
): Promise<void> {
  const goalsJson = JSON.stringify(goals);

  // First try to update existing record
  const result = await getDb().execute({
    sql: `UPDATE user_notes SET goals = ?, updated_at = datetime('now') WHERE clerk_id = ?`,
    args: [goalsJson, clerkId],
  });

  // If no row was updated, insert a new one
  if (result.rowsAffected === 0) {
    await getDb().execute({
      sql: `INSERT INTO user_notes (clerk_id, goals, updated_at) VALUES (?, ?, datetime('now'))`,
      args: [clerkId, goalsJson],
    });
  }
}

// ── Events CRUD ──────────────────────────────────────────────

// Get all events (public, no auth needed)
export async function getAllEvents(): Promise<CalendarEvent[]> {
  const result = await getDb().execute(
    "SELECT * FROM events ORDER BY start_date ASC, start_time ASC"
  );
  return result.rows as unknown as CalendarEvent[];
}

// Get upcoming events (public, for calendar display)
export async function getUpcomingEvents(): Promise<CalendarEvent[]> {
  const result = await getDb().execute({
    sql: `SELECT * FROM events
          WHERE start_date >= date('now', '-1 day')
             OR (end_date IS NOT NULL AND end_date >= date('now', '-1 day'))
          ORDER BY start_date ASC, start_time ASC`,
    args: [],
  });
  return result.rows as unknown as CalendarEvent[];
}

// Create a new event (admin only — auth checked in server function)
export async function createEvent(
  title: string,
  description: string,
  startDate: string,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
  recurrenceType: RecurrenceType = "none",
  recurrenceEndDate: string | null = null
): Promise<number> {
  const result = await getDb().execute({
    sql: `INSERT INTO events (title, description, start_date, end_date, start_time, end_time, recurrence_type, recurrence_end_date)
          VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
    args: [title, description, startDate, endDate, startTime, endTime, recurrenceType, recurrenceEndDate],
  });
  return Number(result.lastInsertRowid);
}

// Update an event (admin only)
export async function updateEvent(
  id: number,
  title: string,
  description: string,
  startDate: string,
  endDate: string | null,
  startTime: string | null,
  endTime: string | null,
  recurrenceType: RecurrenceType = "none",
  recurrenceEndDate: string | null = null
): Promise<void> {
  await getDb().execute({
    sql: `UPDATE events SET title = ?, description = ?, start_date = ?, end_date = ?,
          start_time = ?, end_time = ?, recurrence_type = ?, recurrence_end_date = ?,
          updated_at = datetime('now')
          WHERE id = ?`,
    args: [title, description, startDate, endDate, startTime, endTime, recurrenceType, recurrenceEndDate, id],
  });
}

// Delete an event (admin only)
export async function deleteEvent(id: number): Promise<void> {
  await getDb().execute({
    sql: "DELETE FROM events WHERE id = ?",
    args: [id],
  });
}

// ── Recurrence Expansion ─────────────────────────────────────

function addDays(dateStr: string, days: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1, d);
  date.setDate(date.getDate() + days);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

function addMonths(dateStr: string, months: number): string {
  const [y, m, d] = dateStr.split("-").map(Number);
  const date = new Date(y, m - 1 + months, d);
  return `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, "0")}-${String(date.getDate()).padStart(2, "0")}`;
}

/**
 * Expand recurring events into individual ExpandedEvent instances.
 * Non-recurring events pass through as-is. Recurring events generate
 * occurrences up to recurrence_end_date (or 6 months from now as fallback).
 */
export function expandRecurringEvents(events: CalendarEvent[]): ExpandedEvent[] {
  const expanded: ExpandedEvent[] = [];
  const fallbackEnd = addDays(new Date().toISOString().split("T")[0], 180);

  for (const event of events) {
    const base: Omit<ExpandedEvent, "id" | "start_date" | "end_date"> = {
      parent_id: event.id,
      title: event.title,
      description: event.description,
      start_time: event.start_time,
      end_time: event.end_time,
      is_recurring: event.recurrence_type !== "none",
      recurrence_type: event.recurrence_type,
    };

    if (event.recurrence_type === "none") {
      expanded.push({
        ...base,
        id: event.id,
        start_date: event.start_date,
        end_date: event.end_date,
      });
      continue;
    }

    const endLimit = event.recurrence_end_date || fallbackEnd;
    const daySpan = event.end_date
      ? Math.round((new Date(event.end_date).getTime() - new Date(event.start_date).getTime()) / 86400000)
      : 0;

    let cursor = event.start_date;
    let instanceId = event.id * 10000; // unique IDs for expanded instances

    while (cursor <= endLimit) {
      expanded.push({
        ...base,
        id: instanceId++,
        start_date: cursor,
        end_date: daySpan > 0 ? addDays(cursor, daySpan) : null,
      });

      // Advance cursor based on recurrence type
      if (event.recurrence_type === "weekly") {
        cursor = addDays(cursor, 7);
      } else if (event.recurrence_type === "biweekly") {
        cursor = addDays(cursor, 14);
      } else if (event.recurrence_type === "monthly") {
        cursor = addMonths(cursor, 1);
      } else {
        break;
      }
    }
  }

  return expanded;
}

// ── Sort Order & Active Mentee ───────────────────────────────

// Batch-update sort order for users after drag-and-drop reorder
export async function updateUserSortOrder(
  orderedIds: { clerkId: string; sortOrder: number }[]
): Promise<void> {
  for (const { clerkId, sortOrder } of orderedIds) {
    // Update existing record or insert a minimal one
    const result = await getDb().execute({
      sql: `UPDATE user_notes SET sort_order = ?, updated_at = datetime('now') WHERE clerk_id = ?`,
      args: [sortOrder, clerkId],
    });
    if (result.rowsAffected === 0) {
      await getDb().execute({
        sql: `INSERT INTO user_notes (clerk_id, sort_order, updated_at) VALUES (?, ?, datetime('now'))`,
        args: [clerkId, sortOrder],
      });
    }
  }
}

// Toggle active mentee status for a user
export async function toggleActiveMentee(
  clerkId: string,
  isActive: boolean
): Promise<void> {
  const value = isActive ? 1 : 0;
  const result = await getDb().execute({
    sql: `UPDATE user_notes SET is_active_mentee = ?, updated_at = datetime('now') WHERE clerk_id = ?`,
    args: [value, clerkId],
  });
  if (result.rowsAffected === 0) {
    await getDb().execute({
      sql: `INSERT INTO user_notes (clerk_id, is_active_mentee, updated_at) VALUES (?, ?, datetime('now'))`,
      args: [clerkId, value],
    });
  }
}
