import { fetch } from 'expo/fetch';


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
    fetchUserHabits(email: string): Promise<Habit[]>;

    markHabitComplete(id: string, date: Date): Promise<boolean>;
    markHabitMissed(id: string, date: Date): Promise<boolean>;

    fetchHabitStreaks(id: string): Promise<string[]>;
}

export default class CohabitServiceImpl implements CohabitService {
  backendUrl: string;

  constructor(backendUrl?: string) {
    this.backendUrl = backendUrl ?? "https://cohabit-server.vercel.app/";
  }

  async fetchUserByEmail(handle: string): Promise<FriendListItem | null> {
    try {
      const resp = await fetch(`${this.backendUrl}/api/users/check`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email: handle }),
      });

      if (resp.status === 404) return null;
      if (!resp.ok) throw new Error(`Failed to fetch user (status: ${resp.status})`);

      return await resp.json();
    } catch (error) {
      console.error("Error fetching user by email:", error);
      return Promise.resolve(null);
    }
  }
  fetchUserByName(name: string): Promise<FriendListItem | null> {
    throw new Error("Method not implemented.");
  }
  fetchUserById(id: string): Promise<FriendListItem | null> {
    throw new Error("Method not implemented.");
  }
  fetchFriends(): Promise<FriendListItem[]> {
    return fetch(`${this.backendUrl}/api/users`, {
      method: "GET",
      headers: { "Content-Type": "application/json" },
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch friends");
        return resp.json();
      })
      .catch((error) => {
        console.error("Error fetching friends:", error);
        return [];
      });
  }
  sendFriendRequest(id: string): Promise<boolean> {
    return fetch(`${this.backendUrl}/api/friends/request`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        senderId: "yourUserId", // Replace with actual senderId
        receiverId: id,
      }),
    })
      .then((resp) => resp.ok)
      .catch((error) => {
        console.error("Error sending friend request:", error);
        return false;
      });
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
    return fetch(`${this.backendUrl}/api/habits`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify(habit),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to create habit");
        return resp.json();
      })
      .catch((error) => {
        console.error("Error creating habit:", error);
        throw error;
      });
  }
  updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    return fetch(`${this.backendUrl}/api/habits`, {
      method: "PUT",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, updates }),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to update habit");
        return resp.json();
      })
      .catch((error) => {
        console.error("Error updating habit:", error);
        throw error;
      });

  }
  deleteHabit(id: string): Promise<boolean> {
    return fetch(`${this.backendUrl}/api/habits`, {
      method: "DELETE",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id }),
    })
      .then((resp) => resp.ok)
      .catch((error) => {
        console.error("Error deleting habit:", error);
        return false;
      });
  }
  async fetchUserHabits(email: string): Promise<Habit[]> {
    try {
      const resp = await fetch(`${this.backendUrl}/api/getHabits`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });
      if (!resp.ok) throw new Error("Failed to fetch habits");
      return await resp.json();
    } catch (error) {
      console.error("Error fetching habits:", error);
      return [];
    }
  }
  markHabitComplete(id: string, date: Date): Promise<boolean> {
    return fetch(`${this.backendUrl}/api/habits/complete`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, date: date.toISOString() }),
    })
      .then((resp) => resp.ok)
      .catch((error) => {
        console.error("Error marking habit complete:", error);
        return false;
      });
  }
  markHabitMissed(id: string, date: Date): Promise<boolean> {
    return fetch(`${this.backendUrl}/api/habits/missed`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id, date: date.toISOString() }),
    })
      .then((resp) => resp.ok)
      .catch((error) => {
        console.error("Error marking habit missed:", error);
        return false;
      });
  }
  fetchHabitStreaks(id: string): Promise<string[]> {
    return fetch(`${this.backendUrl}/api/habits/streaks`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ habitId: id }),
    })
      .then((resp) => {
        if (!resp.ok) throw new Error("Failed to fetch habit streaks");
        return resp.json();
      })
      .catch((error) => {
        console.error("Error fetching habit streaks:", error);
        return [];
      });
  }
}