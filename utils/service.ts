
export interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  requested: boolean;
  // Future: Maybe summary stats for habit completion
}

export interface Habit {
  id: string;
  title: string;
  description: string;
  startDate: number; // UNIX epoch
  endDate: number; // UNIX epoch
  starttime: number; // UNIX epoch
  endtime: number; // UNIX epoch
  streaks: string[];
  privacy: PrivacySetting;
  lastUpdateTime: number; // UNIX epoch
}

export enum PrivacySetting {
  PRIVATE = "private",
  PUBLIC = "public",
  FRIENDS_ONLY = "friends",
}

// Define the interface through which the app interacts with the backend
export interface CohabitService {
   // enumerate through all possible operations with the backend
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

    createHabit(habit: Omit<Habit, 'id'>): Promise<Habit>;
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
    this.backendUrl = backendUrl ?? "https://cohabit-server.vercel.app/";
  }

  fetchUserByEmail(handle: string): Promise<FriendListItem | null> {
    throw new Error("Method not implemented.");
  }
  fetchUserByName(name: string): Promise<FriendListItem | null> {
    throw new Error("Method not implemented.");
  }
  fetchUserById(id: string): Promise<FriendListItem | null> {
    throw new Error("Method not implemented.");
  }
  async fetchFriends(): Promise<FriendListItem[]> {
    return await this.get("/api/friends"); // TODO fix delivery of credentials
  }
  sendFriendRequest(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  cancelFriendRequest(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  acceptFriendRequest(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  rejectFriendRequest(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  removeFriend(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  fetchPendingFriendRequests(): Promise<FriendListItem[]> {
    throw new Error("Method not implemented.");
  }
  createHabit(habit: Omit<Habit, "id">): Promise<Habit> {
    throw new Error("Method not implemented.");
  }
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    throw new Error("Method not implemented.");
  }
  deleteHabit(id: string): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  fetchUserHabits(): Promise<Habit[]> {
    throw new Error("Method not implemented.");
  }
  markHabitComplete(id: string, date: Date): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  markHabitMissed(id: string, date: Date): Promise<boolean> {
    throw new Error("Method not implemented.");
  }
  fetchHabitStreaks(id: string): Promise<string[]> {
    throw new Error("Method not implemented.");
  }

  private async get<T>(endpoint: string): Promise<T> {
    const res = await fetch(this.backendUrl + endpoint);
    const json = await res.json();
    if (!res.ok) {
      throw new Error(json.error);
    }
    return json as T;
  }
}
