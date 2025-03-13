import React, { useState, useEffect } from 'react';
import { View, Text, ActivityIndicator, FlatList, TouchableOpacity, StyleSheet, Alert } from 'react-native';
import { Habit } from '../utils/service';
import LocalHabitStore from '../utils/habitStore';
import CohabitServiceImpl from '../utils/service';
import useBackendQuery from '../utils/useBackendQuery';

interface HabitScreenProps {
  navigation: any; // Use proper type from react-navigation if available
}

export const HabitScreen: React.FC<HabitScreenProps> = ({ navigation }) => {
  const [habits, setHabits] = useState<Habit[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [refreshing, setRefreshing] = useState(false);
  const [habitStore, setHabitStore] = useState<LocalHabitStore | null>(null);
  const [syncStatus, setSyncStatus] = useState<'idle' | 'syncing' | 'error'>('idle');

  // Initialize services
  useEffect(() => {
    const initializeStore = async () => {
      const service = new CohabitServiceImpl();
      const store = await LocalHabitStore.init(service);
      setHabitStore(store);
      await loadHabits(store);
    };

    initializeStore().catch(error => {
      console.error('Failed to initialize habit store:', error);
      Alert.alert('Error', 'Failed to initialize app data. Please try again.');
    });
  }, []);

  // Use the useBackendQuery hook for syncing with backend
  const syncQuery = useBackendQuery(async () => {
    if (!habitStore) throw new Error('Habit store not initialized');
    await habitStore.syncWithBackend();
    return true;
  });

  const syncWithBackend = async () => {
    setSyncStatus('syncing');
    try {
      await syncQuery.send();
      // Reload habits after sync
      if (habitStore) {
        await loadHabits(habitStore);
      }
      setSyncStatus('idle');
    } catch (error) {
      console.error('Sync failed:', error);
      setSyncStatus('error');
      Alert.alert('Sync Failed', 'Could not sync with server. Please try again later.');
    }
  };

  const loadHabits = async (store: LocalHabitStore) => {
    setIsLoading(true);
    try {
      // Get habit IDs from local store
      const habitIds = await store.listLocalIDs();
      
      // Load each habit from store
      const habitPromises = habitIds.map(id => store.readHabit(id));
      const loadedHabits = await Promise.all(habitPromises);
      
      // Filter out null values and sort by start date (newest first)
      const validHabits = loadedHabits
        .filter((habit): habit is Habit => habit !== null)
        .sort((a, b) => new Date(b.startDate).getTime() - new Date(a.startDate).getTime());
      
      setHabits(validHabits);
    } catch (error) {
      console.error('Failed to load habits:', error);
      Alert.alert('Error', 'Failed to load your habits. Please try again.');
    } finally {
      setIsLoading(false);
      setRefreshing(false);
    }
  };

  const handleRefresh = async () => {
    setRefreshing(true);
    await syncWithBackend();
    setRefreshing(false);
  };

  const navigateToHabitDetails = (habit: Habit) => {
    navigation.navigate('HabitDetails', { habitId: habit.id });
  };

  const navigateToCreateHabit = () => {
    navigation.navigate('CreateHabit');
  };

  const handleMarkComplete = async (habit: Habit, date: Date = new Date()) => {
    if (!habitStore) return;
    
    try {
      const service = new CohabitServiceImpl();
      await service.markHabitComplete(habit.id, date);
      
      // Update local habit data to reflect completion
      const updatedHabit = await habitStore.readHabit(habit.id);
      if (updatedHabit) {
        // The backend should have updated the streaks
        await loadHabits(habitStore);
      }
    } catch (error) {
      console.error('Failed to mark habit complete:', error);
      Alert.alert('Error', 'Failed to update habit status. Please try again.');
    }
  };

  const handleDelete = async (habitId: string) => {
    if (!habitStore) return;

    Alert.alert(
      'Delete Habit',
      'Are you sure you want to delete this habit? This cannot be undone.',
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Delete',
          style: 'destructive',
          onPress: async () => {
            try {
              await habitStore.deleteHabit(habitId);
              // Refresh the list after deletion
              await loadHabits(habitStore);
            } catch (error) {
              console.error('Failed to delete habit:', error);
              Alert.alert('Error', 'Failed to delete habit. Please try again.');
            }
          },
        },
      ]
    );
  };

  const renderHabitItem = ({ item }: { item: Habit }) => (
    <TouchableOpacity 
      style={styles.habitItem}
      onPress={() => navigateToHabitDetails(item)}
    >
      <View style={styles.habitContent}>
        <Text style={styles.habitTitle}>{item.title}</Text>
        <Text style={styles.habitDescription} numberOfLines={2}>
          {item.description || 'No description'}
        </Text>
        <View style={styles.habitMeta}>
          <Text style={styles.habitDates}>
            {new Date(item.startDate).toLocaleDateString()} - {new Date(item.endDate).toLocaleDateString()}
          </Text>
          <Text style={styles.privacyBadge}>
            {item.privacy}
          </Text>
        </View>
      </View>
      <View style={styles.habitActions}>
        <TouchableOpacity 
          style={styles.completeButton}
          onPress={() => handleMarkComplete(item)}
        >
          <Text style={styles.buttonText}>Complete</Text>
        </TouchableOpacity>
        <TouchableOpacity 
          style={styles.deleteButton}
          onPress={() => handleDelete(item.id)}
        >
          <Text style={styles.buttonText}>Delete</Text>
        </TouchableOpacity>
      </View>
    </TouchableOpacity>
  );

  if (isLoading && !refreshing) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading your habits...</Text>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Habits</Text>
        <TouchableOpacity 
          style={styles.syncButton} 
          onPress={syncWithBackend}
          disabled={syncStatus === 'syncing'}
        >
          <Text style={styles.buttonText}>
            {syncStatus === 'syncing' ? 'Syncing...' : 'Sync'}
          </Text>
        </TouchableOpacity>
      </View>
      
      {syncStatus === 'syncing' && (
        <View style={styles.syncIndicator}>
          <ActivityIndicator size="small" color="#0000ff" />
          <Text style={styles.syncText}>Syncing with server...</Text>
        </View>
      )}
      
      {syncStatus === 'error' && (
        <View style={styles.errorBanner}>
          <Text style={styles.errorText}>Sync failed. Some changes may not be saved.</Text>
        </View>
      )}

      <FlatList
        data={habits}
        renderItem={renderHabitItem}
        keyExtractor={item => item.id}
        refreshing={refreshing}
        onRefresh={handleRefresh}
        contentContainerStyle={styles.listContainer}
        ListEmptyComponent={
          <View style={styles.emptyState}>
            <Text style={styles.emptyStateText}>You don't have any habits yet.</Text>
            <Text style={styles.emptyStateSubtext}>Create a new habit to get started!</Text>
          </View>
        }
      />
      
      <TouchableOpacity 
        style={styles.addButton}
        onPress={navigateToCreateHabit}
      >
        <Text style={styles.addButtonText}>+ New Habit</Text>
      </TouchableOpacity>
    </View>
  );
};

// Extend LocalHabitStore with a method to list local IDs since it's used in the component
declare module '../utils/habitStore' {
  interface LocalHabitStore {
    listLocalIDs(): Promise<string[]>;
  }
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    padding: 16,
    backgroundColor: '#ffffff',
    borderBottomWidth: 1,
    borderBottomColor: '#e1e4e8',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  syncButton: {
    backgroundColor: '#007bff',
    paddingHorizontal: 12,
    paddingVertical: 8,
    borderRadius: 4,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '500',
  },
  syncIndicator: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    padding: 8,
    backgroundColor: '#e6f7ff',
  },
  syncText: {
    marginLeft: 8,
    color: '#0366d6',
  },
  errorBanner: {
    padding: 8,
    backgroundColor: '#ffebee',
  },
  errorText: {
    color: '#d32f2f',
    textAlign: 'center',
  },
  listContainer: {
    padding: 16,
    paddingBottom: 80, // Space for add button
  },
  habitItem: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    marginBottom: 16,
    padding: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  habitContent: {
    marginBottom: 12,
  },
  habitTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 4,
  },
  habitDescription: {
    fontSize: 14,
    color: '#666',
    marginBottom: 8,
  },
  habitMeta: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  habitDates: {
    fontSize: 12,
    color: '#666',
  },
  privacyBadge: {
    fontSize: 12,
    backgroundColor: '#e1e4e8',
    paddingHorizontal: 8,
    paddingVertical: 2,
    borderRadius: 12,
  },
  habitActions: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  completeButton: {
    backgroundColor: '#4caf50',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginRight: 8,
    alignItems: 'center',
  },
  deleteButton: {
    backgroundColor: '#f44336',
    paddingVertical: 8,
    paddingHorizontal: 12,
    borderRadius: 4,
    flex: 1,
    marginLeft: 8,
    alignItems: 'center',
  },
  addButton: {
    position: 'absolute',
    bottom: 24,
    right: 24,
    backgroundColor: '#007bff',
    paddingVertical: 12,
    paddingHorizontal: 20,
    borderRadius: 24,
    elevation: 4,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
  },
  addButtonText: {
    color: '#ffffff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  emptyState: {
    alignItems: 'center',
    justifyContent: 'center',
    padding: 40,
  },
  emptyStateText: {
    fontSize: 18,
    fontWeight: '500',
    marginBottom: 8,
  },
  emptyStateSubtext: {
    fontSize: 14,
    color: '#666',
  },
});

export default HabitScreen;