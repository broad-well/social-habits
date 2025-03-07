
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
  privacy: string;
  lastUpdateTime: number; // UNIX epoch
}
export type PrivacySetting = "private" | "public" | "friends";

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

    
    createHabit(habit: Omit<Habit, 'id' >): Promise<Habit>;
    updateHabit(id: string, updates: Partial<Habit>): Promise<Habit>;
    deleteHabit(id: string): Promise<boolean>;
    fetchHabits(): Promise<Habit[]>;

    markHabitComplete(id: string, date:number): Promise<boolean>;
    markHabitIncomplete(id: string, date:number): Promise<boolean>;
    habitCompletion(id: string,date:number): Promise<boolean>;
 

    fetchHabitStreaks(id: string): Promise<string[]>;
    addHabitStreak(id: string, streak: string): Promise<boolean>;
    removeHabitStreak(id: string, streak: string): Promise<boolean>;
    fetchHabitPrivacy(id: string): Promise<PrivacySetting>;
    setHabitPrivacy(id: string, privacy: PrivacySetting): Promise<boolean>;
}