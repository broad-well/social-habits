// Syncing habits between the app and the backend
// Use Expo SQLite to store habits offline/locally

import * as SQLite from 'expo-sqlite';


import { Habit } from "./service";

export interface HabitStore {

  upsertHabit(habit: Habit): Promise<Habit>;
  /**
   * First, check if the habit with the given ID is stored locally
   * If stored locally, read the local copy
   * Otherwise, fetch from backend, store locally, and return the local copy
   */
  readHabit(id: string): Promise<Habit>;
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
}
