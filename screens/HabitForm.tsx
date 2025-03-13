import React, { useState, useEffect } from 'react';
import { 
  View, 
  Text, 
  TextInput, 
  TouchableOpacity, 
  StyleSheet, 
  ScrollView, 
  Switch, 
  Alert,
  ActivityIndicator
} from 'react-native';
import DateTimePicker from '@react-native-community/datetimepicker';
import { Habit } from '../utils/service';
import LocalHabitStore from '../utils/habitStore';
import CohabitServiceImpl from '../utils/service';
import useBackendQuery from '../utils/useBackendQuery';

// Define available privacy options
const PRIVACY_OPTIONS = ["Private", "Friends-Only", "Public"] as const;
type PrivacyOption = typeof PRIVACY_OPTIONS[number];

// Days of the week for reminder selection
const DAYS_OF_WEEK = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];

interface HabitFormProps {
  habitId?: string; // If provided, we're editing an existing habit
  navigation: any;
  route: any;
}

export const HabitForm: React.FC<HabitFormProps> = ({ navigation, route }) => {
  const habitId = route.params?.habitId;
  const isEditing = !!habitId;
  
  // Form state
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date(Date.now() + 30 * 24 * 60 * 60 * 1000)); // 30 days from now
  const [reminderTime, setReminderTime] = useState('08:00');
  const [reminderDays, setReminderDays] = useState<string[]>(['Mon', 'Wed', 'Fri']);
  const [privacy, setPrivacy] = useState<PrivacyOption>("Private");
  
  // UI state
  const [showStartDatePicker, setShowStartDatePicker] = useState(false);
  const [showEndDatePicker, setShowEndDatePicker] = useState(false);
  const [showTimePicker, setShowTimePicker] = useState(false);
  const [isLoading, setIsLoading] = useState(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [habitStore, setHabitStore] = useState<LocalHabitStore | null>(null);

  // Initialize services and load habit data if editing
  useEffect(() => {
    const initializeStore = async () => {
      try {
        const service = new CohabitServiceImpl();
        const store = await LocalHabitStore.init(service);
        setHabitStore(store);
        
        if (isEditing && habitId) {
          await loadHabitData(store, habitId);
        }
      } catch (error) {
        console.error('Failed to initialize:', error);
        Alert.alert('Error', 'Failed to initialize. Please try again.');
        navigation.goBack();
      }
    };
    
    initializeStore();
  }, [habitId, isEditing]);

  // Use the backend query hook for saving the habit
  const saveHabitQuery = useBackendQuery(async () => {
    if (!habitStore) throw new Error('Habit store not initialized');
    
    const habitData: Omit<Habit, "id"> & { id?: string } = {
      title,
      description,
      startDate: startDate.toISOString().split('T')[0],
      endDate: endDate.toISOString().split('T')[0],
      reminderTime,
      reminderDays,
      lastModified: new Date(),
      streaks: [], // Streaks will be managed by the backend
      privacy,
      email: '', // Will be set by the backend
    };
    
    if (isEditing && habitId) {
      habitData.id = habitId;
      const updatedHabit = await habitStore.updateHabit({
        ...habitData,
        id: habitId,
      } as Habit);
      return updatedHabit;
    } else {
      const newHabit = await habitStore.createHabit(habitData);
      return newHabit;
    }
  });

  const loadHabitData = async (store: LocalHabitStore, id: string) => {
    setIsLoading(true);
    try {
      const habit = await store.readHabit(id);
      if (!habit) {
        throw new Error(`Habit with ID ${id} not found`);
      }
      
      // Populate form with habit data
      setTitle(habit.title);
      setDescription(habit.description);
      setStartDate(new Date(habit.startDate));
      setEndDate(new Date(habit.endDate));
      setReminderTime(habit.reminderTime);
      setReminderDays(habit.reminderDays);
      setPrivacy(habit.privacy);
    } catch (error) {
      console.error('Failed to load habit:', error);
      Alert.alert('Error', 'Failed to load habit data. Please try again.');
      navigation.goBack();
    } finally {
      setIsLoading(false);
    }
  };

  const handleSave = async () => {
    // Validate inputs
    if (!title.trim()) {
      Alert.alert('Error', 'Please enter a title for your habit');
      return;
    }
    
    if (startDate > endDate) {
      Alert.alert('Error', 'End date must be after start date');
      return;
    }

    setIsSaving(true);
    try {
      await saveHabitQuery.send();
      navigation.goBack();
    } catch (error) {
      console.error('Failed to save habit:', error);
      Alert.alert('Error', 'Failed to save habit. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const toggleReminderDay = (day: string) => {
    if (reminderDays.includes(day)) {
      setReminderDays(reminderDays.filter(d => d !== day));
    } else {
      setReminderDays([...reminderDays, day]);
    }
  };

  if (isLoading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#0000ff" />
        <Text>Loading habit data...</Text>
      </View>
    );
  }

  return (
    <ScrollView style={styles.container}>
      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Basic Information</Text>
        
        <Text style={styles.label}>Title *</Text>
        <TextInput
          style={styles.input}
          value={title}
          onChangeText={setTitle}
          placeholder="Enter habit title"
        />
        
        <Text style={styles.label}>Description</Text>
        <TextInput
          style={[styles.input, styles.textArea]}
          value={description}
          onChangeText={setDescription}
          placeholder="Describe your habit"
          multiline
          numberOfLines={4}
        />
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Timeframe</Text>
        
        <Text style={styles.label}>Start Date</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowStartDatePicker(true)}
        >
          <Text>{startDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        
        {showStartDatePicker && (
          <DateTimePicker
            value={startDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowStartDatePicker(false);
              if (selectedDate) setStartDate(selectedDate);
            }}
          />
        )}
        
        <Text style={styles.label}>End Date</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowEndDatePicker(true)}
        >
          <Text>{endDate.toLocaleDateString()}</Text>
        </TouchableOpacity>
        
        {showEndDatePicker && (
          <DateTimePicker
            value={endDate}
            mode="date"
            display="default"
            onChange={(event, selectedDate) => {
              setShowEndDatePicker(false);
              if (selectedDate) setEndDate(selectedDate);
            }}
          />
        )}
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Reminders</Text>
        
        <Text style={styles.label}>Reminder Time</Text>
        <TouchableOpacity 
          style={styles.dateInput}
          onPress={() => setShowTimePicker(true)}
        >
          <Text>{reminderTime}</Text>
        </TouchableOpacity>
        
        {showTimePicker && (
          <DateTimePicker
            value={new Date(`2000-01-01T${reminderTime}:00`)}
            mode="time"
            display="default"
            onChange={(event, selectedTime) => {
              setShowTimePicker(false);
              if (selectedTime) {
                const hours = String(selectedTime.getHours()).padStart(2, '0');
                const minutes = String(selectedTime.getMinutes()).padStart(2, '0');
                setReminderTime(`${hours}:${minutes}`);
              }
            }}
          />
        )}
        
        <Text style={styles.label}>Reminder Days</Text>
        <View style={styles.dayPicker}>
          {DAYS_OF_WEEK.map(day => (
            <TouchableOpacity
              key={day}
              style={[
                styles.dayButton,
                reminderDays.includes(day) && styles.selectedDay
              ]}
              onPress={() => toggleReminderDay(day)}
            >
              <Text 
                style={[
                  styles.dayButtonText,
                  reminderDays.includes(day) && styles.selectedDayText
                ]}
              >
                {day}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.formSection}>
        <Text style={styles.sectionTitle}>Privacy</Text>
        
        <View style={styles.privacyContainer}>
          {PRIVACY_OPTIONS.map(option => (
            <TouchableOpacity
              key={option}
              style={[
                styles.privacyOption,
                privacy === option && styles.selectedPrivacy
              ]}
              onPress={() => setPrivacy(option)}
            >
              <Text 
                style={[
                  styles.privacyText,
                  privacy === option && styles.selectedPrivacyText
                ]}
              >
                {option}
              </Text>
            </TouchableOpacity>
          ))}
        </View>
      </View>

      <View style={styles.buttonContainer}>
        <TouchableOpacity 
          style={styles.cancelButton}
          onPress={() => navigation.goBack()}
          disabled={isSaving}
        >
          <Text style={styles.cancelButtonText}>Cancel</Text>
        </TouchableOpacity>
        
        <TouchableOpacity 
          style={styles.saveButton}
          onPress={handleSave}
          disabled={isSaving}
        >
          {isSaving ? (
            <ActivityIndicator size="small" color="#ffffff" />
          ) : (
            <Text style={styles.saveButtonText}>
              {isEditing ? 'Update Habit' : 'Create Habit'}
            </Text>
          )}
        </TouchableOpacity>
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
    padding: 20,
  },
  formSection: {
    backgroundColor: '#ffffff',
    borderRadius: 8,
    padding: 16,
    marginBottom: 16,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: 'bold',
    marginBottom: 16,
    color: '#333',
  },
  label: {
    fontSize: 14,
    fontWeight: '500',
    marginBottom: 8,
    color: '#555',
  },
  input: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 8,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  textArea: {
    height: 100,
    textAlignVertical: 'top',
  },
  dateInput: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingHorizontal: 12,
    paddingVertical: 12,
    marginBottom: 16,
    backgroundColor: '#fff',
  },
  dayPicker: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    marginBottom: 16,
  },
  dayButton: {
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 20,
    paddingHorizontal: 12,
    paddingVertical: 6,
    margin: 4,
    backgroundColor: '#fff',
  },
  selectedDay: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  dayButtonText: {
    color: '#333',
  },
  selectedDayText: {
    color: '#fff',
  },
  privacyContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
  },
  privacyOption: {
    flex: 1,
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    padding: 12,
    margin: 4,
    alignItems: 'center',
    backgroundColor: '#fff',
  },
  selectedPrivacy: {
    backgroundColor: '#007bff',
    borderColor: '#007bff',
  },
  privacyText: {
    color: '#333',
    fontWeight: '500',
  },
  selectedPrivacyText: {
    color: '#fff',
  },
  buttonContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    marginTop: 16,
    marginBottom: 32,
  },
  saveButton: {
    backgroundColor: '#007bff',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 2,
    alignItems: 'center',
    marginLeft: 8,
  },
  saveButtonText: {
    color: '#fff',
    fontWeight: 'bold',
    fontSize: 16,
  },
  cancelButton: {
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ddd',
    borderRadius: 4,
    paddingVertical: 12,
    paddingHorizontal: 24,
    flex: 1,
    alignItems: 'center',
    marginRight: 8,
  },
  cancelButtonText: {
    color: '#666',
    fontWeight: '500',
  },
});

export default HabitForm;