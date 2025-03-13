import React, { useEffect, useState, useCallback } from "react";
import { Text, View, ScrollView } from "react-native";

import {
  Button,
  TextInput,
  Appbar,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import RadioGroup from "react-native-radio-buttons-group";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleHabitNotification, sendLocalNotification } from "../../../app/utils/notifications";
import useBackendStore from "@/stores/useBackendStore"
import createStyles from "@/styles/NewHabitStyles";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";

export default function HabitCreation() {
  const screenOptions = {
    headerShown: false,
  };

  const { colorTheme } = useColorTheme();

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [isEveryDay, setIsEveryDay] = useState(true);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [privacy, setPrivacy] = useState("2");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleReset = useCallback(() => {
    setHabitName("");
    setHabitDescription("");
    setIsEveryDay(true);
    setStartDate(new Date());
    setEndDate(new Date());
    setPrivacy("2");
    setReminderTime(new Date());
    setSelectedDays([]);
  }, []);

<<<<<<< HEAD
  const handleSave = async () => {

    const backendStore = useBackendStore.getState().getHabitStore();

    const habitData = await backendStore.createHabit({
        title: habitName,
        description: habitDescription,
        startDate: startDate,
        endDate: endDate,
        timeType: timeType,
        startTime: startTime,
        endTime: endTime,
        privacy: privacy,
    });

=======
  const handleSave = useCallback(() => {
>>>>>>> c28ff3bf3239368b6954fefbb0a53bb4bf4a931f
    // Logic to save the habit
    const notificationId = await scheduleHabitNotification(habitName, startTime);
    await backendStore.setHabitNotificationId(habitData.id, notificationId);

    const hour = startTime.getHours();
    const minute = startTime.getMinutes();
    const title = "Notification scheduled!";
    const body = `Daily reminders for ${habitName} will be sent at ${hour}:${minute}`;
    await sendLocalNotification(title, body);

    router.back();
<<<<<<< HEAD

  };
=======
  }, []);
>>>>>>> c28ff3bf3239368b6954fefbb0a53bb4bf4a931f

  const handlePrivacyChange = useCallback((value: string) => {
    setPrivacy(value);
  }, []);

  const handlePeriodChange = useCallback((e: string) => {
    setIsEveryDay(e === "0");
  }, []);

  const handleStartDateChange = useCallback(
    (event: any, date: Date) => setStartDate(date || startDate), // eslint-disable-line
    [startDate]
  );

  const handleEndDateChange = useCallback(
    (event: any, date: Date) => setEndDate(date || endDate), // eslint-disable-line
    [endDate]
  );

  const handleHabitNameChange = useCallback((text: string) => {
    setHabitName(text);
  }, []);

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
          height: 50,
          backgroundColor: theme.colors.primaryContainer,
        }}
      >
        <Appbar.BackAction
          color={theme.colors.onPrimaryContainer}
          onPress={() => router.back()}
        />
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
          { width: "100%", paddingTop: 20, paddingHorizontal: 35 },
        ]}
      >
        <View style={styles.formContainer}>
          <TextInput
            mode="outlined"
            label="Name of the Habit"
            value={habitName}
            onChangeText={handleHabitNameChange}
            inputMode="text"
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
            autoCapitalize="none"
          />
          <TextInput
            mode="outlined"
            label="Description"
            inputMode="text"
            value={habitDescription}
            onChangeText={(text) => {
              setHabitDescription(text);
            }}
            multiline
            numberOfLines={4}
            style={styles.input}
            textColor={theme.colors.onPrimaryContainer}
            theme={theme}
            autoCapitalize="none"
          />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Period:</Text>

            <RadioGroup
              radioButtons={[
                { id: "0", label: "Every day", value: "everyDay" },
                { id: "1", label: "Set Dates", value: "setDates" },
              ]}
              containerStyle={{
                width: "60%",
                alignItems: "flex-start",
              }}
              layout="column"
              onPress={handlePeriodChange}
              selectedId={isEveryDay ? "0" : "1"}
            />
          </View>
          {!isEveryDay && (
            <View style={styles.datePickerContainer}>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text
                  style={{
                    color: theme.colors.onPrimaryContainer,
                  }}
                >
                  Start Date:
                </Text>
                <DateTimePicker
                  value={startDate}
                  mode="date"
                  display="default"
                  design="material"
                  themeVariant={colorTheme}
                  minimumDate={new Date()}
                  onChange={handleStartDateChange}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.onPrimaryContainer }}>
                  End Date:
                </Text>
                <DateTimePicker
                  value={endDate}
                  mode="date"
                  display="default"
                  design="material"
                  themeVariant={colorTheme}
                  minimumDate={startDate}
                  onChange={handleEndDateChange}
                />
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.groupContainer}>
            <MultiSelectDropdown
              label="Days of the week:"
              options={[
                { value: "Monday", label: "Monday" },
                { value: "Tuesday", label: "Tuesday" },
                { value: "Wednesday", label: "Wednesday" },
                { value: "Thursday", label: "Thursday" },
                { value: "Friday", label: "Friday" },
                { value: "Saturday", label: "Saturday" },
                { value: "Sunday", label: "Sunday" },
              ]}
              value={selectedDays}
              onChange={setSelectedDays}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.groupContainer}>
            <Text style={styles.radioGroupLabel}>Reminder:</Text>
            <DateTimePicker
              value={reminderTime}
              mode="time"
              display="default"
              design="material"
              themeVariant={colorTheme}
              onChange={(event, time) => setReminderTime(time || reminderTime)}
            />
          </View>
          <View style={styles.divider} />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Privacy:</Text>
            <RadioGroup
              radioButtons={[
                { id: "0", label: "Public", value: "Public" },
                {
                  id: "1",
                  label: "Friend-Only",
                  value: "Friend-Only",
                },
                { id: "2", label: "Private", value: "Private" },
              ]}
              containerStyle={{
                width: "60%",
                alignItems: "flex-start",
              }}
              onPress={handlePrivacyChange}
              selectedId={privacy.toString()}
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
