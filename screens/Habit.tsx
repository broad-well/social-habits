import React, { useState, useEffect } from 'react';
import {
  View,
  Text,
  StyleSheet,
  ScrollView,
  TouchableOpacity,
  ActivityIndicator,
  Alert,
} from 'react-native';
import { Habit } from '../utils/service';
import LocalHabitStore from '../utils/habitStore';
import CohabitServiceImpl from '../utils/service';

interface HabitDetailsProps {
  navigation: any;
  route: any;
}

interface DayStatus {
  date: Date;
  status: 'complete' | 'missed' | 'upcoming' | 'none';
}

export const HabitDetailsScreen: React.FC<HabitDetailsProps> = ({ navigation, route }) => {
  const { habitId } = route.params;
  const [habit, setHabit] = useState<Habit | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const [habitStore, setHabitStore] = useState<LocalHabitStore | null>(null);
  const [calendar, setCalendar] = useState<DayStatus[]>([]);
  const [completionRate, setCompletionRate] = useState(0);
  const [currentStreak, setCurrentStreak] = useState(0);
  const [longestStreak, setLongestStreak] = useState(0);

  // Initialize services
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const service = new CohabitServiceImpl();
        const store = await LocalHabitStore.init(service);
        setHabitStore(store);
        await loadHabitData(store);
      } catch (error) {
        console.error('Failed to initialize:', error);
        Alert.alert('Initialization Error', 'Failed to initialize habit store.');
      }
    };

    const loadHabitData = async (store: LocalHabitStore) => {
      try {
        const habitData = await store.readHabit(habitId);
        if (!habitData) {
          throw new Error('Habit not found');
        }
        console.log('Fetched habit data:', habitData); // Debug log
        setHabit(habitData);

        // Generate calendar data
        const calendarData = generateCalendar(habitData);
        setCalendar(calendarData);

        // Calculate streaks and completion rate
        const { currentStreak, longestStreak, completionRate } = calculateStreaks(habitData);
        setCurrentStreak(currentStreak);
        setLongestStreak(longestStreak);
        setCompletionRate(completionRate);
      } catch (error) {
        console.error('Failed to load habit data:', error); // Debug log
        Alert.alert('Data Load Error', 'Failed to load habit data.');
      } finally {
        setIsLoading(false);
      }
    };

    initializeStore();
  }, [habitId]);

  const generateCalendar = (habit: Habit): DayStatus[] => {
    const startDate = new Date(habit.startDate);
    const endDate = new Date(habit.endDate);
    const calendar: DayStatus[] = [];

    for (let date = new Date(startDate); date <= endDate; date.setDate(date.getDate() + 1)) {
      const dateString = date.toISOString().split('T')[0];
      const status: DayStatus['status'] = habit.streaks.includes(dateString)
        ? 'complete'
        : 'missed';
      calendar.push({ date: new Date(date), status });
    }

    return calendar;
  };

  const calculateStreaks = (habit: Habit) => {
    let currentStreak = 0;
    let longestStreak = 0;
    let completedDays = 0;

    const sortedStreaks = habit.streaks
      .map((date) => new Date(date).getTime())
      .sort((a, b) => a - b)
      .map((time) => new Date(time).toISOString().split('T')[0]);

    for (let i = 0; i < sortedStreaks.length; i++) {
      if (i > 0 && new Date(sortedStreaks[i]).getDate() === new Date(sortedStreaks[i - 1]).getDate() + 1) {
        currentStreak++;
      } else {
        currentStreak = 1;
      }

      if (currentStreak > longestStreak) {
        longestStreak = currentStreak;
      }

      completedDays++;
    }

    const totalDays = Math.ceil((new Date(habit.endDate).getTime() - new Date(habit.startDate).getTime()) / (1000 * 60 * 60 * 24));
    const completionRate = (completedDays / totalDays) * 100;

    return { currentStreak, longestStreak, completionRate };
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading habit details...</Text>
      </View>
    );
  }

  if (!habit) {
    return (
      <View style={styles.centered}>
        <Text>Habit not found.</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.header}>
        <Text style={styles.title}>{habit.title}</Text>
        <Text style={styles.description}>{habit.description}</Text>
      </View>

      <View style={styles.statsContainer}>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{completionRate.toFixed(1)}%</Text>
          <Text style={styles.statLabel}>Completion Rate</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{currentStreak}</Text>
          <Text style={styles.statLabel}>Current Streak</Text>
        </View>
        <View style={styles.statItem}>
          <Text style={styles.statValue}>{longestStreak}</Text>
          <Text style={styles.statLabel}>Longest Streak</Text>
        </View>
      </View>

      <View style={styles.calendarContainer}>
        <Text style={styles.sectionTitle}>Calendar</Text>
        <View style={styles.calendar}>
          {calendar.map((day, index) => (
            <View key={index} style={[styles.day, styles[day.status]]}>
              <Text style={styles.dayText}>{day.date.getDate()}</Text>
            </View>
          ))}
        </View>
      </View>
    </ScrollView>
  );
};

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
    padding: 16,
  },
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  header: {
    marginBottom: 24,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    marginBottom: 8,
  },
  description: {
    fontSize: 16,
    color: '#666',
  },
  statsContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginBottom: 24,
  },
  statItem: {
    alignItems: 'center',
  },
  statValue: {
    fontSize: 20,
    fontWeight: 'bold',
  },
  statLabel: {
    fontSize: 14,
    color: '#666',
  },
  calendarContainer: {
    marginBottom: 24,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
  },
  calendar: {
    flexDirection: 'row',
    flexWrap: 'wrap',
  },
  day: {
    width: 40,
    height: 40,
    justifyContent: 'center',
    alignItems: 'center',
    margin: 4,
    borderRadius: 8,
  },
  dayText: {
    fontSize: 14,
    fontWeight: '500',
  },
  complete: {
    backgroundColor: '#4caf50',
  },
  missed: {
    backgroundColor: '#f44336',
  },
  upcoming: {
    backgroundColor: '#e1e4e8',
  },
  none: {
    backgroundColor: '#ffffff',
  },
});

export default HabitDetailsScreen;