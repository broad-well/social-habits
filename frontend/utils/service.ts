import { auth } from "@/config/firebaseConfig";

export interface FriendListItem {
  id: string;
  name: string;
  profileLogo?: string;
}

export interface Habit {
  id: string;
  email: string;
  title: string;
  description: string;
  startDate: string;
  endDate: string;
  reminderTime: string;
  reminderDays: string[];
  reminderId?: string;
  lastModified: Date; // Stored as a UNIX epoch (millisecond precision)
  streaks: string[];
  privacy: "Private" | "Friends-Only" | "Public";
}

export interface CohabitService {
  fetchUserByEmail(handle: string): Promise<FriendListItem | null>;
  fetchUserByName(name: string): Promise<FriendListItem | null>;
  fetchUserById(id: string): Promise<FriendListItem | null>;

  fetchFriends(): Promise<FriendListItem[]>;
  sendFriendRequest(id: string): Promise<boolean>;
  cancelFriendRequest(id: string): Promise<boolean>;
  acceptFriendRequest(id: string): Promise<boolean>;
  rejectFriendRequest(id: string): Promise<boolean>;
  removeFriend(id: string): Promise<boolean>;
  fetchPendingFriendRequests(): Promise<FriendListItem[]>;

  createHabit(habit: Omit<Habit, "id" | "email"> & { id?: string }): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: string): Promise<boolean>;
  fetchHabit(id: string): Promise<Habit | null>;
  fetchUserHabits(): Promise<Habit[]>;
  habitsRemoved(id: string[]): Promise<{
    [habitId: string]: Date /* timestamp of removal */
  }>;

  markHabitComplete(id: string, date: Date): Promise<boolean>;
  markHabitMissed(id: string, date: Date): Promise<boolean>;

  fetchHabitStreaks(id: string): Promise<string[]>;
}

export default class CohabitServiceImpl implements CohabitService {
  backendUrl: string;

  constructor(backendUrl?: string) {
    this.backendUrl = backendUrl ?? "https://cohabit-server.vercel.app/api/";
  }

  fetchHabit(id: string): Promise<Habit | null> {
    return this.fetch<Habit | null>(`habits/${id}`);
  }

  habitsRemoved(id: string[]): Promise<{
    [habitId: string]: Date
  }> {
    throw new Error("Method not implemented.");
  }

  // User Functions
  async fetchUserByEmail(handle: string): Promise<FriendListItem | null> {
    return this.fetch<FriendListItem | null>(`users/email/${handle}`);
  }

  async fetchUserByName(name: string): Promise<FriendListItem | null> {
    return this.fetch<FriendListItem | null>(`users/name/${name}`);
  }

  async fetchUserById(id: string): Promise<FriendListItem | null> {
    return this.fetch<FriendListItem | null>(`users/${id}`);
  }

  // Friend Functions
  async fetchFriends(): Promise<FriendListItem[]> {
    return this.fetch<FriendListItem[]>("friends");
  }

  async sendFriendRequest(id: string): Promise<boolean> {
    return this.fetchWithBody<{ receiverId: string }, boolean>("friends/request", { receiverId: id });
  }

  async cancelFriendRequest(id: string): Promise<boolean> {
    return this.fetchWithBody<{ receiverId: string }, boolean>("friends/cancel", { receiverId: id });
  }

  async acceptFriendRequest(id: string): Promise<boolean> {
    return this.fetchWithBody<{ senderId: string }, boolean>("friends/accept", { senderId: id });
  }

  async rejectFriendRequest(id: string): Promise<boolean> {
    return this.fetchWithBody<{ senderId: string }, boolean>("friends/reject", { senderId: id });
  }

  async removeFriend(id: string): Promise<boolean> {
    return this.fetchWithBody<{ friendId: string }, boolean>("friends/remove", { friendId: id });
  }

  async fetchPendingFriendRequests(): Promise<FriendListItem[]> {
    return this.fetch<FriendListItem[]>("friends/pending");
  }

  // Habit Functions
  async createHabit(habit: Omit<Habit, "id" | "email">): Promise<Habit> {
    type T = {
      habit: Omit<Habit, "id"> & { firebaseId: string },
    };
    const rawResult = await this.fetchWithBody<Omit<Habit, "id" | "email">, T>("habits", habit);
    
    return {
      ...rawResult.habit,
      id: rawResult.habit.firebaseId,
    };
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    return this.fetchWithBody<{ updates: Partial<Habit> }, Habit>(
      `habits/${encodeURIComponent(id)}`, { updates }
    );
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.fetch(`habits/${encodeURIComponent(id)}`, "DELETE");
  }

  async fetchUserHabits(): Promise<Habit[]> {
    return this.fetch<Habit[]>("habits?email=" + encodeURIComponent(auth.currentUser!.email!), "GET", {
      on404: [],
    });
  }

  async markHabitComplete(id: string, date: Date): Promise<boolean> {
    return this.fetchWithBody<{ id: string; date: string }, boolean>("habits/complete", { id, date: date.toISOString() });
  }

  async markHabitMissed(id: string, date: Date): Promise<boolean> {
    return this.fetchWithBody<{ id: string; date: string }, boolean>("habits/missed", { id, date: date.toISOString() });
  }

  async fetchHabitStreaks(id: string): Promise<string[]> {
    return this.fetch<string[]>(`habits/${id}/streaks`);
  }

  // Helper Methods
  private async fetch<T>(endpoint: string, method: string = "GET", options?: {
    on404?: T,
  }): Promise<T> {
    const res = await fetch(this.backendUrl + endpoint, {
      method,
      headers: {
        Authorization: await this.getAuthorization(),
      }
    });
    const json = await res.json();
    if (!res.ok) {
      if (options?.on404 && res.status === 404) {
        return options.on404;
      }
      throw new Error(json.error || "Unknown API error");
    }
    return json as T;
  }

  private async fetchWithBody<P, T>(endpoint: string, payload: P, method: string = "POST"): Promise<T> {
    const res = await fetch(this.backendUrl + endpoint, {
      method,
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
        Authorization: await this.getAuthorization(),
      },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Unknown API error");
    }
    return json as T;
  }

  private async getAuthorization(): Promise<string> {
    const token = await auth.currentUser?.getIdToken(false);
    return token ? `Token ${token}` : "";
  }
}
