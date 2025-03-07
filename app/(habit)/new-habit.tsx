import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import RadioButtonRN from "radio-buttons-react-native";
import {
  Button,
  TextInput,
  Appbar,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
// import DateTimePicker from "@react-native-community/datetimepicker";
import DateTimePickerModal from "react-native-modal-datetime-picker";
import { scheduleHabitNotification, sendLocalNotification } from "../utils/notifications";
import createStyles from "@/styles/NewHabitStyle";
import useEmailStore from "@/stores/useEmail";

export default function HabitCreation() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),  // eslint-disable-line
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });
  const { colorTheme } = useColorTheme();

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [reminderDays, setReminderDays] = useState(["Sun","Mon","Tue","Wed","Thu","Fri","Sat"]);
  const [timeType, setTimeType] = useState(0);
  const [reminderTime, setreminderTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [privacy, setPrivacy] = useState("Private");

  const [isreminderTimePickerVisible, setreminderTimePickerVisibility] = useState(false);
  const [isEndTimePickerVisible, setEndTimePickerVisibility] = useState(false);

  const [isStartDatePickerVisible, setStartDatePickerVisibility] = useState(false);
  const [isEndDatePickerVisible, setEndDatePickerVisibility] = useState(false);

  const showStartDatePicker = () => setStartDatePickerVisibility(true);
  const hideStartDatePicker = () => setStartDatePickerVisibility(false);
  const showEndDatePicker = () => setEndDatePickerVisibility(true);
  const hideEndDatePicker = () => setEndDatePickerVisibility(false);

  const showreminderTimePicker = () => setreminderTimePickerVisibility(true);
  const hidereminderTimePicker = () => setreminderTimePickerVisibility(false);
  const showEndTimePicker = () => setEndTimePickerVisibility(true);
  const hideEndTimePicker = () => setEndTimePickerVisibility(false);

  const handleStartDateConfirm = (date: Date) => {
    setStartDate(date);
    hideStartDatePicker();
  };

  const handleEndDateConfirm = (date: Date) => {
    setEndDate(date);
    hideEndDatePicker();
  };

  const handlereminderTimeConfirm = (time: Date) => {
    setreminderTime(time);
    hidereminderTimePicker();
  };

  const handleEndTimeConfirm = (time: Date) => {
    setEndTime(time);
    hideEndTimePicker();
  };



  const handleReset = () => {
    setHabitName("");
    setHabitDescription("");
    setFrequency(0);
    setStartDate(new Date());
    setEndDate(new Date());
    setTimeType(0);
    setreminderTime(new Date());
    setEndTime(new Date());
    setPrivacy("Private");
  };

  const handleSave = async () => {
    const email = useEmailStore.getState().email; // Get email from store
  
    if (!email) {
      alert("Error: No email found. Please log in again.");
      return;
    }
  
    if (!habitName.trim()) {
      alert("Habit name is required.");
      return;
    }
  
    try {
      const response = await fetch("https://cohabit-server.vercel.app/api/habits", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: email,
          title: habitName,
          description: habitDescription,
          startDate: startDate.toISOString(),
          endDate: endDate.toISOString(),
          reminderTime: reminderTime.toISOString(),
          reminderDays: reminderDays,
          streaks: [],
          privacy: privacy,
        }),
      });
  
      const result = await response.json();
  
      if (!response.ok) {
        throw new Error(result.error || "Failed to create habit.");
      }
  
      // Optional: Schedule local notifications
      await scheduleHabitNotification(habitName, reminderTime);
  
      alert("Habit saved successfully!");
      router.back();
    } catch (error) {
      console.error("Error creating habit:", error);
      alert("Failed to save habit. Please try again.");
    }
  };

  const handleEveryDayChange = (value: string) => {
    if (value === "everyDay") {
      setFrequency(0);
    } else {
      setFrequency(1);
    }
  };

  const handleAnyTimeChange = (value: string) => {
    if (value === "anyTime") {
      setTimeType(0);
    } else {
      setTimeType(1);
    }
  };

  const handlePrivacyChange = (value: string) => {
    setPrivacy(value);
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const styles = createStyles(theme);

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={screenOptions} />
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          height: 40
        }}
      >
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content
          title="New Habit"
          titleStyle={{
            fontSize: 18,
          }}
        />
      </Appbar.Header>
      <ScrollView
        style={{
          flex: 1,
          backgroundColor: theme.colors.primaryContainer,
          width: "100%",
        }}
        contentContainerStyle={[
          styles.container,
          { width: "100%", paddingTop: 20, paddingHorizontal: 35 },
        ]}
      >
        <View style={styles.formContainer}>
          <TextInput
            label="Name of the Habit"
            value={habitName}
            onChangeText={setHabitName}
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
          />
          <TextInput
            label="Description"
            value={habitDescription}
            onChangeText={setHabitDescription}
            multiline
            numberOfLines={4}
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
          />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Frequency:</Text>
            <RadioButtonRN
              data={[
                { label: "Every day", value: "everyDay" },
                { label: "Set Dates", value: "setDates" },
              ]}
              selectedBtn={(e: any) => handleEveryDayChange(e.value)} // eslint-disable-line
              box={false}
              initial={frequency === 0 ? 1 : 2}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              activeColor={theme.colors.onPrimaryContainer}
              style={{ ...styles.radioButtonGroup, marginLeft: 20 }}
            />
          </View>
          {frequency === 1 && (
            <View style={styles.datePickerContainer}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Text
                  style={{
                    color: theme.colors.onPrimaryContainer,
                  }}
                >
                  Start Date:
                </Text> */}
                {/* <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  design="default"
                  themeVariant={colorTheme}
                  minimumDate={new Date()}
                  onChange={(event, date) => setStartDate(date || startDate)}
                /> */}

              <Button onPress={showStartDatePicker}>Pick Start Date</Button>
              <Text>{startDate.toDateString()}</Text>
              <DateTimePickerModal
                isVisible={isStartDatePickerVisible}
                mode="date"
                onConfirm={handleStartDateConfirm}
                onCancel={hideStartDatePicker}
              />

              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Text style={{ color: theme.colors.onPrimaryContainer }}>End Date:</Text> */}
                {/* <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  design="default"
                  themeVariant={colorTheme}
                  minimumDate={startDate}
                  onChange={(event, date) => setEndDate(date || endDate)}
                /> */}
                <Button onPress={showEndDatePicker}>Pick End Date</Button>
              <Text>{endDate.toDateString()}</Text>
              <DateTimePickerModal
                isVisible={isEndDatePickerVisible}
                mode="date"
                onConfirm={handleEndDateConfirm}
                onCancel={hideEndDatePicker}
              />
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Time:</Text>
            <RadioButtonRN
              data={[
                { label: "Any", value: "anyTime" },
                { label: "Set time", value: "setTime" },
              ]}
              selectedBtn={(e: any) => handleAnyTimeChange(e.value)} // eslint-disable-line
              box={false}
              initial={timeType === 0 ? 1 : 2}
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              activeColor={theme.colors.onPrimaryContainer}
              style={{ ...styles.radioButtonGroup, marginLeft: 57 }}
            />
          </View>
          {timeType === 1 && (
            <View style={styles.timePickerContainer}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                {/* <Text style={{ color: theme.colors.onPrimaryContainer }}>
                  Start Time:
                </Text>
                <DateTimePicker
                  value={reminderTime}
                  mode="time"
                  display="default"
                  design="default"
                  themeVariant={colorTheme}
                  onChange={(event, time) => setreminderTime(time || reminderTime)}
                /> */}
                <Button onPress={showreminderTimePicker}>Pick Start Time</Button>
              <Text>{reminderTime.toTimeString()}</Text>
              <DateTimePickerModal
                isVisible={isreminderTimePickerVisible}
                mode="time"
                onConfirm={handlereminderTimeConfirm}
                onCancel={hidereminderTimePicker}
              />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.onPrimaryContainer }}>End Time:</Text>
                {/* <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  design="default"
                  themeVariant={colorTheme}
                  minimumDate={reminderTime}
                  onChange={(event, time) => setEndTime(time || endTime)}
                /> */}
                <Button onPress={showEndTimePicker}>Pick End Time</Button>
              <Text>{endTime.toTimeString()}</Text>
              <DateTimePickerModal
                isVisible={isEndTimePickerVisible}
                mode="time"
                onConfirm={handleEndTimeConfirm}
                onCancel={hideEndTimePicker}
              />
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Privacy:</Text>
            <RadioButtonRN
              data={[
                { label: "Private", value: "Private" },
                { label: "Friends-Only", value: "Friends-Only" },
                { label: "Public", value: "Public" },
              ]}
              selectedBtn={(e: any) => handlePrivacyChange(e.value)} // eslint-disable-line
              box={false}
              initial={
                privacy === "Private" ? 1 : privacy === "Friends-Only" ? 2 : 3
              }
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              activeColor={theme.colors.onPrimaryContainer }
              style={{ ...styles.radioButtonGroup, marginLeft: 40 }}
            />
          </View>
          <Button
            mode="outlined"
            onPress={handleReset}
            style={[styles.button, { borderColor: theme.colors.error }]}
            textColor={theme.colors.onErrorContainer}
          >
            Reset
          </Button>
          <Button
            mode="contained"
            onPress={handleSave}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Save
          </Button>
        </View>
      </ScrollView>
    </PaperProvider>
  );
}
