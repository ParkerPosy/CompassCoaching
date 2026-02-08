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
      created_at TEXT DEFAULT (datetime('now')),
      updated_at TEXT DEFAULT (datetime('now'))
    )
  `);
}

// User notes types
export interface UserNote {
  id: number;
  clerk_id: string;
  name: string | null;
  email: string | null;
  notes: string;
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
