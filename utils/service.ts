export interface FriendListItem {
  id: string;
  name: string;
  profileLogo?: string;
  requested: boolean;
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

  createHabit(habit: Omit<Habit, "id">): Promise<Habit>;
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
  deleteHabit(id: string): Promise<boolean>;
  fetchUserHabits(): Promise<Habit[]>;

  markHabitComplete(id: string, date: Date): Promise<boolean>;
  markHabitMissed(id: string, date: Date): Promise<boolean>;

  fetchHabitStreaks(id: string): Promise<string[]>;
}

export default class CohabitServiceImpl implements CohabitService {
  backendUrl: string;

  constructor(backendUrl?: string) {
    this.backendUrl = backendUrl ?? "https://cohabit-server.vercel.app/api/";
  }

  // User Functions
  async fetchUserByEmail(handle: string): Promise<FriendListItem | null> {
    return this.get<FriendListItem | null>(`users/email/${handle}`);
  }

  async fetchUserByName(name: string): Promise<FriendListItem | null> {
    return this.get<FriendListItem | null>(`users/name/${name}`);
  }

  async fetchUserById(id: string): Promise<FriendListItem | null> {
    return this.get<FriendListItem | null>(`users/${id}`);
  }

  // Friend Functions
  async fetchFriends(): Promise<FriendListItem[]> {
    return this.get<FriendListItem[]>("friends");
  }

  async sendFriendRequest(id: string): Promise<boolean> {
    return this.post<{ receiverId: string }, boolean>("friends/request", { receiverId: id });
  }

  async cancelFriendRequest(id: string): Promise<boolean> {
    return this.post<{ receiverId: string }, boolean>("friends/cancel", { receiverId: id });
  }

  async acceptFriendRequest(id: string): Promise<boolean> {
    return this.post<{ senderId: string }, boolean>("friends/accept", { senderId: id });
  }

  async rejectFriendRequest(id: string): Promise<boolean> {
    return this.post<{ senderId: string }, boolean>("friends/reject", { senderId: id });
  }

  async removeFriend(id: string): Promise<boolean> {
    return this.post<{ friendId: string }, boolean>("friends/remove", { friendId: id });
  }

  async fetchPendingFriendRequests(): Promise<FriendListItem[]> {
    return this.get<FriendListItem[]>("friends/pending");
  }

  // Habit Functions
  async createHabit(habit: Omit<Habit, "id">): Promise<Habit> {
    return this.post<Omit<Habit, "id">, Habit>("habits", habit);
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    return this.post<{ id: string; updates: Partial<Habit> }, Habit>("habits/update", { id, updates });
  }

  async deleteHabit(id: string): Promise<boolean> {
    return this.post<{ id: string }, boolean>("habits/delete", { id });
  }

  async fetchUserHabits(): Promise<Habit[]> {
    return this.get<Habit[]>("habits");
  }

  async markHabitComplete(id: string, date: Date): Promise<boolean> {
    return this.post<{ id: string; date: string }, boolean>("habits/complete", { id, date: date.toISOString() });
  }

  async markHabitMissed(id: string, date: Date): Promise<boolean> {
    return this.post<{ id: string; date: string }, boolean>("habits/missed", { id, date: date.toISOString() });
  }

  async fetchHabitStreaks(id: string): Promise<string[]> {
    return this.get<string[]>(`habits/${id}/streaks`);
  }

  // Helper Methods
  private async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(this.backendUrl + endpoint);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Unknown API error");
    }
    return json as T;
  }

  private async post<P, T>(endpoint: string, payload: P): Promise<T> {
    const res = await fetch(this.backendUrl + endpoint, {
      method: "POST",
      body: JSON.stringify(payload),
      headers: {
        "Content-Type": "application/json",
      },
    });
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error || "Unknown API error");
    }
    return json as T;
  }
}
