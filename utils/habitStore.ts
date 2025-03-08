// Syncing habits between the app and the backend
// Use Expo SQLite to store habits offline/locally

import { CohabitService, Habit } from "./service";
import * as SQLite from "expo-sqlite";

export interface HabitStore {

  createHabit(habit: Omit<Habit, "id">): Promise<Habit>;
  updateHabit(habit: Habit): Promise<void>;

  /**
   * First, check if the habit with the given ID is stored locally
   * If stored locally, read the local copy
   * Otherwise, fetch from backend, store locally, and return the local copy
   */
  readHabit(id: string): Promise<Habit | null>;
  /**
   * If stored locally, remove local copy
   * Remove copy from backend
   */
  deleteHabit(id: string): Promise<void>;

  /**
   * Fetch all habits belonging to the user from the backend
   * Invariant: If any conflicts arise between the local store and the backend,
   *   the Habit object with the greater lastUpdateTime wins (which means it should override
   *   all other versions of the Habit in both the local store and the backend)
   */
  syncWithBackend(): Promise<void>;

  /**
   * Store the Expo Notifications ID for the recurring notifications
   * set up to remind the user to perform a particular habit.
   * @param habitId The ID of the habit
   * @param notifyId The Expo Notifications ID to associate with the habit.
   *  To remove the associated ID, set this to `null`.
   */
  setHabitNotificationId(
    habitId: string,
    notifyId: string | null
  ): Promise<void>;
}

const STORE_DB_NAME = "habits";

export default class LocalHabitStore implements HabitStore {

  constructor(
    private server: CohabitService,
  ) {}

  static async init(server: CohabitService) {
    const db = await SQLite.openDatabaseAsync(STORE_DB_NAME);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS habit (
        id TEXT PRIMARY KEY NOT NULL,
        title TEXT NOT NULL,
        description TEXT,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        reminderTime TEXT,
        reminderDays TEXT,
        reminderId TEXT,
        lastModified REAL,
        streaks TEXT,
        privacy TEXT NOT NULL
      );
    `);
    await db.closeAsync();
  }

  async updateHabit(habit: Habit): Promise<void> {
    // Save the new habit both locally and on the server.
    this.markModified(habit);
    await this.runUpsertCommand(habit);
    await this.server.updateHabit(habit.id, habit);
  }

  async readHabit(id: string): Promise<Habit | null> {
    // Read from local. If local doesn't have it, read from remote.
    const local = await this.runReadCommand(id);
    if (local !== null) return local;

    const remote = await this.server.fetchHabit(id);
    if (remote === null) return null;
    // Save the un-cached version locally.
    await this.runUpsertCommand(remote);
    return remote;
  }

  async deleteHabit(id: string): Promise<void> {
    // Ensure the habit is deleted both locally and on remote.
    const db = await SQLite.openDatabaseAsync(STORE_DB_NAME);
    const stmt = await db.prepareAsync("DELETE FROM habit WHERE id = $id");
    try {
      await stmt.executeAsync({ $id: id });
    } finally {
      await stmt.finalizeAsync();
      await db.closeAsync();
    }
    await this.server.deleteHabit(id);
  }

  syncWithBackend(): Promise<void> {
    // Construct the set of local habits L vs remote habits R
    // All habits h in L, not in R: 
    // All habits h in R, not in L:
  }

  async runUpsertCommand(habit: Habit) {
    const db = await SQLite.openDatabaseAsync(STORE_DB_NAME);
    const stmt = await db.prepareAsync(`
      INSERT OR REPLACE INTO habit (
        id, title, description, startDate, endDate, reminderTime,
        reminderDays, reminderId, lastModified, streaks, privacy
      ) VALUES (
        $id, $title, $description, $startDate, $endDate, $reminderTime,
        $reminderDays, $reminderId, $lastModified, $streaks, $privacy
      )
    `);
    try {
      await stmt.executeAsync({
        $id: habit.id,
        $title: habit.title,
        $description: habit.description,
        $startDate: habit.startDate,
        $endDate: habit.endDate,
        $reminderTime: habit.reminderTime,
        $reminderDays: JSON.stringify(habit.reminderDays),
        $reminderId: habit.reminderId ?? null,
        $streaks: JSON.stringify(habit.streaks),
        $lastModified: habit.lastModified.getTime(),
        $privacy: habit.privacy,
      });
    } finally {
      await stmt.finalizeAsync();
      await db.closeAsync();
    }
  }

  async runReadCommand(habitId: string): Promise<Habit | null> {
    const db = await SQLite.openDatabaseAsync(STORE_DB_NAME);
    const stmt = await db.prepareAsync("SELECT * FROM habit WHERE id = $id");
    try {
      const res = await stmt.executeAsync<
        Omit<Habit, "reminderDays" | "reminderId" | "lastModified" | "streaks"> &
        {
          reminderDays: string, // JSON
          reminderId: string | null,
          lastModified: number,
          streaks: string, // JSON
        }
      >({ $id: habitId });
      const firstRow = await res.getFirstAsync();
      if (firstRow === null || firstRow === undefined) {
        return null;
      }
      return {
        ...firstRow,
        reminderDays: JSON.parse(firstRow.reminderDays),
        reminderId: firstRow.reminderId ?? undefined,
        streaks: JSON.parse(firstRow.streaks),
        lastModified: new Date(firstRow.lastModified),
      };
    } finally {
      await stmt.finalizeAsync();
      await db.closeAsync();
    }
  }

  private markModified(habit: Omit<Habit, "id">) {
    habit.lastModified = new Date();
  }
}