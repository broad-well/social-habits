// Syncing habits between the app and the backend
// Use Expo SQLite to store habits offline/locally

import { create, StoreApi, UseBoundStore } from "zustand";
import { resolveConflict } from "./conflict";
import { CohabitService, Habit } from "./service";
import * as SQLite from "expo-sqlite";

export type LocalHabit = Omit<Habit, "email">;

export interface HabitStore {

  createHabit(habit: Omit<LocalHabit, "id">): Promise<Habit>;
  updateHabit(habit: LocalHabit): Promise<void>;

  /**
   * First, check if the habit with the given ID is stored locally
   * If stored locally, read the local copy
   * Otherwise, fetch from backend, store locally, and return the local copy
   */
  readHabit(id: string): Promise<LocalHabit | null>;

  /**
   * Mark a habit as Completed or Missed.
   * @param id The ID of the habit to update.
   * @param date The date on which the habit was marked "Complete" or "Missed".
   * @param completed `true` if the habit was marked "Complete", otherwise "Missed".
   */
  markHabitCompletion(id: string, date: string, completed: boolean): Promise<void>;

  /**
   * List all habits that should be completed on particular date.
   * @param isoDate The date on which the habits should be performed in "YYYY-MM-DD" format
   */
  listHabits(isoDate: string): Promise<LocalHabit[]>;

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
   * Store the Expo Notifications IDs for the recurring notifications
   * set up to remind the user to perform a particular habit.
   * @param habitId The ID of the habit
   * @param notifyId The Expo Notifications IDs to associate with the habit.
   *  To remove the associated IDs, set this to `[]`.
   */
  setHabitNotificationId(
    habitId: string,
    notifyId: string[],
  ): Promise<void>;

  /**
   * Retrieve Expo Notification IDs for the recurring notifications
   * set up to remind the user to perform a particular habit and stored using `setHabitNotificationId`.
   * @param habitId The ID of the habit to retrieve notification IDs for.
   */
  getHabitNotificationId(
    habitId: string,
  ): Promise<string[] | null>;
}

const STORE_DB_NAME = "habits";

type LocalHabitRow = Omit<LocalHabit, "reminderDays" | "reminderId" | "lastModified" | "streaks"> & {
  reminderDays: string, // JSON
  reminderId: string | null,
  lastModified: number,
  streaks: string, // JSON
}

export default class LocalHabitStore implements HabitStore {
  private constructor(
    private server: CohabitService,
    private db: SQLite.SQLiteDatabase,
  ) {}

  static async init(server: CohabitService): Promise<LocalHabitStore> {
    const db = await SQLite.openDatabaseAsync(STORE_DB_NAME);
    await db.execAsync(`
      PRAGMA journal_mode = WAL;
      PRAGMA foreign_keys = ON;
      CREATE TABLE IF NOT EXISTS habit (
        id TEXT PRIMARY KEY,
        title TEXT NOT NULL,
        description TEXT,
        startDate DATE NOT NULL,
        endDate DATE NOT NULL,
        reminderTime TEXT,
        reminderDays TEXT,
        reminderIds TEXT,
        lastModified REAL,
        streaks TEXT,
        privacy TEXT NOT NULL
      );
      CREATE TABLE IF NOT EXISTS tombstone (
        id TEXT PRIMARY KEY NOT NULL,
        deleteTime REAL
      );
    `);
    return new LocalHabitStore(server, db);
  }

  async updateHabit(habit: LocalHabit): Promise<void> {
    // Save the new habit both locally and on the server.
    this.markModified(habit);
    console.log("upserting from updateHabit");
    await this.runUpsertCommand(habit);
    await this.server.updateHabit(habit.id, habit);
    this.markDatabaseModified();
  }

  async readHabit(id: string): Promise<LocalHabit | null> {
    // Read from local. If local doesn't have it, read from remote.
    const local = await this.runReadCommand(id);
    if (local !== null) return local;

    const remote = await this.server.fetchHabit(id);
    if (remote === null) return null;
    // Save the un-cached version locally.
    console.log("upserting from readHabit");
    await this.runUpsertCommand(remote);
    return remote;
  }

  async listHabits(isoDate: string): Promise<LocalHabit[]> {
    console.assert(/^\d\d\d\d-\d\d-\d\d$/.test(isoDate));
    const stmt = await this.db.prepareAsync(
      `SELECT * FROM habit WHERE
        date(startDate) <= $queryDate AND
        $queryDate <= date(endDate)`
    );
    try {
      const results = await stmt.executeAsync<LocalHabitRow>({ $queryDate: isoDate });
      const habits = (await results.getAllAsync()).map(this.parseHabit);
      return habits;
    } finally {
      await stmt.finalizeAsync();
    }
  }

  async markHabitCompletion(id: string, date: string, completed: boolean): Promise<void> {
    console.assert(/^\d\d\d\d-\d\d-\d\d$/.test(date));
    const habit = await this.runReadCommand(id);
    if (habit === null) throw new Error(`Cannot mark missing habit ${id} complete: Habit not found`);
    habit.streaks.push(date);
    await this.server.markHabitComplete(id, date);
  }

  async deleteHabit(id: string): Promise<void> {
    // Ensure the habit is deleted both locally and on remote.
    const stmt = await this.db.prepareAsync("DELETE FROM habit WHERE id = $id");
    const createTombstoneStmt = await this.db.prepareAsync(
      "INSERT INTO tombstone (id, deleteTime) VALUES ($id, $deleteTime)"
    );
    try {
      await stmt.executeAsync({ $id: id });
      await createTombstoneStmt.executeAsync({
        $id: id,
        $deleteTime: Date.now(),
      });
    } finally {
      await stmt.finalizeAsync();
    }
    await this.server.deleteHabit(id);
    this.markDatabaseModified();
  }

  async syncWithBackend(): Promise<void> {
    const localIds = new Set(await this.listLocalIDs());
    const remoteHabits = await this.server.fetchUserHabits();
    const remoteIds = new Set(remoteHabits.map(hb => hb.id));

    try {
      const actions = await resolveConflict(
        localIds, remoteIds,
        (habits) => this.server.habitsRemoved(Array.from(habits)),
        (id) => this.getLocalTombstone(id, this.db),
      );

      const upload = async (localId: string) => {
        const habit = await this.readHabit(localId);
        await this.server.createHabit(habit!);
      };
      const download = async (id: string) => {
        const remote = await this.server.fetchHabit(id);
        if (remote === null) return;
        await this.runUpsertCommand(remote);
      };
      
      await Promise.all([
        ...Array.from(actions.upload).map(upload),
        ...Array.from(actions.download).map(download),
        ...Array.from(actions.deleteLocal).map(this.deleteHabit.bind(this)),
        ...Array.from(actions.deleteRemote).map(this.server.deleteHabit.bind(this)),
      ]);
    } catch (e) {
      console.error(e);
      throw e;
    }
  }

  async createHabit(habit: Omit<LocalHabit, "id">): Promise<Habit> {
    const habitData = await this.server.createHabit(habit);
    this.markModified(habitData);
    await this.runUpsertCommand(habitData);
    this.markDatabaseModified();
    return habitData;
  }

  async setHabitNotificationId(habitId: string, notifyIds: string[]): Promise<void> {
    const newFlatValue: string | null = notifyIds.length === 0 ? null : notifyIds.join("\n");
    const stmt = await this.db.prepareAsync(
      "UPDATE habit SET reminderIds = $notifyId WHERE id = $habitId"
    );
    try {
      console.log("Setting notification IDs");
      await stmt.executeAsync({ $notifyId: newFlatValue, $habitId: habitId });

    } finally {
      await stmt.finalizeAsync();
    }
  }

  async getHabitNotificationId(habitId: string): Promise<string[] | null> {
    const stmt = await this.db.prepareAsync(
      "SELECT reminderIds FROM habit WHERE id = $habitId"
    );
    try {
      const result = await stmt.executeAsync<{ reminderIds?: string }>({ $habitId: habitId });
      const firstRow = await result.getFirstAsync();
      return firstRow?.reminderIds?.split("\n") ?? null;
    } finally {
      await stmt.finalizeAsync();
    }
  }

  async runUpsertCommand(habit: LocalHabit) {
    const stmt = await this.db.prepareAsync(`
      INSERT OR REPLACE INTO habit (
        id, title, description, startDate, endDate, reminderTime,
        reminderDays, reminderIds, lastModified, streaks, privacy
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
    }
  }

  private parseHabit(row: LocalHabitRow): LocalHabit {
    return {
      ...row,
      reminderDays: JSON.parse(row.reminderDays),
      reminderId: row.reminderId ?? undefined,
      streaks: JSON.parse(row.streaks),
      lastModified: new Date(row.lastModified),
    };
  }

  async runReadCommand(habitId: string): Promise<LocalHabit | null> {
    const stmt = await this.db.prepareAsync("SELECT * FROM habit WHERE id = $id");
    try {
      const res = await stmt.executeAsync<LocalHabitRow>({ $id: habitId });
      const firstRow = await res.getFirstAsync();
      if (firstRow === null || firstRow === undefined) {
        return null;
      }
      return this.parseHabit(firstRow);
    } finally {
      await stmt.finalizeAsync();
    }
  }

  async listLocalIDs(): Promise<string[]> {
    const result = await this.db.getAllAsync<{ id: string }>("SELECT id FROM habit");
    return result.map(r => r.id);
  }

  private async getLocalTombstone(id: string, db: SQLite.SQLiteDatabase): Promise<Date | null> {
    const stmt = await db.prepareAsync("SELECT * FROM tombstone WHERE id = $id");
    try {
      const result = await stmt.executeAsync<{
        id: string,
        deleteTime: number,
      }>({ $id: id });
      const tombstoneRow = await result.getFirstAsync();
      if (tombstoneRow === null) return null;
      return new Date(tombstoneRow.deleteTime);

    } finally {
      await stmt.finalizeAsync();
    }
  }

  private markModified(habit: Omit<LocalHabit, "id">) {
    habit.lastModified = new Date();
  }

  private markDatabaseModified() {
    // TODO update a counter
    console.trace("Database modified");
  }
}
