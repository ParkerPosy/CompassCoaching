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
}

// User notes types
export interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
  admin_message: string;
  created_at: string;
  updated_at: string;
}

// Get all user notes from database
export async function getAllUserNotes(): Promise<UserNote[]> {
  const result = await getDb().execute(
    "SELECT * FROM user_notes ORDER BY created_at DESC"
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

// Goal type
export interface UserGoal {
  id: string;
  text: string;
  completed: boolean;
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
