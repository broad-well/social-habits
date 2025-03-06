
export interface FriendListItem {
  id: string;
  profileLogo?: string;
  name: string;
  requested: boolean;
  // Future: Maybe summary stats for habit completion
}

export interface Habit {
  // TODO(shhalder): Fill in according to Louis's message
  lastUpdateTime: number; // UNIX epoch
}

// Define the interface through which the app interacts with the backend
export interface CohabitService {
  fetchUserByEmail(handle: string): Promise<FriendListItem | null>;
  // TODO(shhalder): enumerate through all possible operations with the backend
}