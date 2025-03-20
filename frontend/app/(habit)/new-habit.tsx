import React, { useState } from "react";
import { View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Button,
  TextInput,
  Appbar,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Portal,
  Dialog,
  Text,
} from "react-native-paper";
import RadioButtonRN from "radio-buttons-react-native";
import RadioGroup from "react-native-radio-buttons-group";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleHabitNotification, sendLocalNotification } from "@/utils/notifications";
import useBackendStore from "@/stores/useBackendStore"
import createStyles from "@/styles/NewHabitStyles";
import useBackendQuery from "@/utils/useBackendQuery";
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
  const [privacy, setPrivacy] = useState("Private");
  const [reminderTime, setReminderTime] = useState(new Date());
  const [selectedDays, setSelectedDays] = useState<string[]>([]);

  const handleReset = React.useCallback(() => {
    setHabitName("");
    setHabitDescription("");
    setIsEveryDay(true);
    setStartDate(new Date());
    setEndDate(new Date());
    setPrivacy("Private");
    setReminderTime(new Date());
    setSelectedDays([]);
  }, []);

  const habitStore = useBackendStore((s) => s.getHabitStore());

  const handleSave = async () => {
    const habitData = await habitStore.createHabit({
      title: habitName,
      description: habitDescription,
      startDate: startDate.toISOString(),
      endDate: endDate.toISOString(),
      privacy: privacy as "Private" | "Friends-Only" | "Public",
      reminderTime: reminderTime.toISOString(),
      reminderDays: selectedDays,
      lastModified: new Date(),
      streaks: [],
    })

    // Logic to save the habit
    const notificationIds = await scheduleHabitNotification(habitName, reminderTime, selectedDays, startDate, endDate);
    await habitStore.setHabitNotificationId(habitData.id, notificationIds);

    const title = "Notification scheduled!";
    const body = `Reminders for ${habitName} have been scheduled!`;
    await sendLocalNotification(title, body);

    router.back();
  };

  const saver = useBackendQuery(handleSave);

  const handlePrivacyChange = React.useCallback((value: string) => {
    setPrivacy(value);
  }, []);

  const handlePeriodChange = React.useCallback((e: string) => {
    setIsEveryDay(e === "0");
  }, []);

  const handleStartDateChange = React.useCallback(
    (event: any, date?: Date) => setStartDate(date || startDate), // eslint-disable-line
    [startDate]
  );

  const handleEndDateChange = React.useCallback(
    (event: any, date?: Date) => setEndDate(date || endDate), // eslint-disable-line
    [endDate]
  );

  const handleHabitNameChange = React.useCallback((text: string) => {
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
            disabled={saver.loading}
            style={[styles.button, { borderColor: theme.colors.error }]}
            textColor={theme.colors.onErrorContainer}
          >
            Reset
          </Button>
          <Button
            mode="contained"
            onPress={saver.send}
            disabled={saver.loading}
            style={styles.button}
            buttonColor={theme.colors.primary}
            textColor={theme.colors.onPrimary}
          >
            Save
          </Button>
        </View>
      </ScrollView>
      <Portal>
        <Dialog visible={!!saver.error} onDismiss={saver.clear}>
          <Dialog.Title>Habit creation failed</Dialog.Title>
          <Dialog.Content>
            <Text variant="bodyMedium">{saver.error?.message}</Text>
          </Dialog.Content>
          <Dialog.Actions>
            <Button onPress={saver.clear}>Try again</Button>
            <Button onPress={router.back}>Return</Button>
          </Dialog.Actions>
        </Dialog>
      </Portal>
    </PaperProvider>
  );
}
