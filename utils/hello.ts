import { fetch } from 'expo/fetch';
import { CohabitService, FriendListItem, Habit, PrivacySetting } from './service';

export class ExpoCohabitService implements CohabitService {
  private baseUrl: string;
  private authToken: string;

  constructor(baseUrl: string, authToken: string) {
    this.baseUrl = baseUrl;
    this.authToken = authToken;
  }

  private async request<T>(endpoint: string, method: string = 'GET', body?: any): Promise<T> {
    try {
      const response = await fetch(`${this.baseUrl}${endpoint}`, {
        method,
        headers: {
          'Content-Type': 'application/json',
          'Authorization': `Bearer ${this.authToken}`
        },
        body: body ? JSON.stringify(body) : undefined
      });
      
      if (!response.ok) {
        throw new Error(`API request failed: ${response.status} ${response.statusText}`);
      }
      
      return await response.json();
    } catch (error) {
      console.error(`Error during ${method} request to ${endpoint}:`, error);
      throw error;
    }
  }

  async fetchUserByEmail(email: string): Promise<FriendListItem | null> {
    try {
        const resp = await fetch();
        if (!resp.ok) throw new Error("Failed to fetch user");
        return await resp.json();
    } catch (error) {
        console.error(error);
        return null;
    }
}


  async fetchUserByName(name: string): Promise<FriendListItem | null> {
    try {
      return await this.request<FriendListItem>(`/users/name/${encodeURIComponent(name)}`);
    } catch (error) {
      console.error('Error fetching user by name:', error);
      return null;
    }
  }

  async fetchUserById(id: string): Promise<FriendListItem | null> {
    try {
      return await this.request<FriendListItem>(`/users/${id}`);
    } catch (error) {
      console.error('Error fetching user by id:', error);
      return null;
    }
  }

  async fetchFriends(): Promise<FriendListItem[]> {
    try {
      return await this.request<FriendListItem[]>('/friends');
    } catch (error) {
      console.error('Error fetching friends:', error);
      return [];
    }
  }

  async sendFriendRequest(id: string): Promise<boolean> {
    try {
      await this.request('/friends/requests', 'POST', { userId: id });
      return true;
    } catch (error) {
      console.error('Error sending friend request:', error);
      return false;
    }
  }

  async cancelFriendRequest(id: string): Promise<boolean> {
    try {
      await this.request(`/friends/requests/${id}`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error cancelling friend request:', error);
      return false;
    }
  }

  async acceptFriendRequest(id: string): Promise<boolean> {
    try {
      await this.request(`/friends/requests/${id}/accept`, 'POST');
      return true;
    } catch (error) {
      console.error('Error accepting friend request:', error);
      return false;
    }
  }

  async rejectFriendRequest(id: string): Promise<boolean> {
    try {
      await this.request(`/friends/requests/${id}/reject`, 'POST');
      return true;
    } catch (error) {
      console.error('Error rejecting friend request:', error);
      return false;
    }
  }

  async removeFriend(id: string): Promise<boolean> {
    try {
      await this.request(`/friends/${id}`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error removing friend:', error);
      return false;
    }
  }

  async fetchPendingFriendRequests(): Promise<FriendListItem[]> {
    try {
      return await this.request<FriendListItem[]>('/friends/requests/pending');
    } catch (error) {
      console.error('Error fetching pending friend requests:', error);
      return [];
    }
  }

  // Habit methods
  async createHabit(habit: Omit<Habit, 'id'>): Promise<Habit> {
    return this.request<Habit>('/habits', 'POST', habit);
  }

  async updateHabit(id: string, updates: Partial<Habit>): Promise<Habit> {
    return this.request<Habit>(`/habits/${id}`, 'PATCH', updates);
  }

  async deleteHabit(id: string): Promise<boolean> {
    try {
      await this.request(`/habits/${id}`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error deleting habit:', error);
      return false;
    }
  }

  async fetchHabits(): Promise<Habit[]> {
    try {
      return await this.request<Habit[]>('/habits');
    } catch (error) {
      console.error('Error fetching habits:', error);
      return [];
    }
  }

  async markHabitComplete(id: string, date: number): Promise<boolean> {
    try {
      await this.request(`/habits/${id}/complete`, 'POST', { date });
      return true;
    } catch (error) {
      console.error('Error marking habit complete:', error);
      return false;
    }
  }

  async markHabitIncomplete(id: string, date: number): Promise<boolean> {
    try {
      await this.request(`/habits/${id}/incomplete`, 'POST', { date });
      return true;
    } catch (error) {
      console.error('Error marking habit incomplete:', error);
      return false;
    }
  }

  async habitCompletion(id: string, date: number): Promise<boolean> {
    try {
      const result = await this.request<{ completed: boolean }>(`/habits/${id}/status`, 'GET', { date });
      return result.completed;
    } catch (error) {
      console.error('Error checking habit completion:', error);
      return false;
    }
  }

  async fetchHabitStreaks(id: string): Promise<string[]> {
    try {
      return await this.request<string[]>(`/habits/${id}/streaks`);
    } catch (error) {
      console.error('Error fetching habit streaks:', error);
      return [];
    }
  }

  async addHabitStreak(id: string, streak: string): Promise<boolean> {
    try {
      await this.request(`/habits/${id}/streaks`, 'POST', { streak });
      return true;
    } catch (error) {
      console.error('Error adding habit streak:', error);
      return false;
    }
  }

  async removeHabitStreak(id: string, streak: string): Promise<boolean> {
    try {
      await this.request(`/habits/${id}/streaks/${encodeURIComponent(streak)}`, 'DELETE');
      return true;
    } catch (error) {
      console.error('Error removing habit streak:', error);
      return false;
    }
  }

  async fetchHabitPrivacy(id: string): Promise<PrivacySetting> {
    try {
      const result = await this.request<{ privacy: PrivacySetting }>(`/habits/${id}/privacy`);
      return result.privacy;
    } catch (error) {
      console.error('Error fetching habit privacy:', error);
      return 'private'; // Default to private on error
    }
  }

  async setHabitPrivacy(id: string, privacy: PrivacySetting): Promise<boolean> {
    try {
      await this.request(`/habits/${id}/privacy`, 'PUT', { privacy });
      return true;
    } catch (error) {
      console.error('Error setting habit privacy:', error);
      return false;
    }
  }
}
