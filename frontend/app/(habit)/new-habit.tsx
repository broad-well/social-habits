import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView, Alert } from "react-native";
import {
  Button,
  TextInput,
  Appbar,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  Portal,
  Dialog,
} from "react-native-paper";
import RadioButtonRN from "radio-buttons-react-native";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import createStyles from "@/styles/NewHabitStyles";
import { LocalHabit } from "@/utils/habitStore";
import useBackendQuery from "@/utils/useBackendQuery";
import useBackendStore from "@/stores/useBackendStore";

export default function HabitCreation() {
  const screenOptions = {
    headerShown: false,
  };

  const { colorTheme } = useColorTheme();

  const [habitName, setHabitName] = useState("");
  const [habitDescription, setHabitDescription] = useState("");
  const [frequency, setFrequency] = useState(0);
  const [startDate, setStartDate] = useState(new Date());
  const [endDate, setEndDate] = useState(new Date());
  const [timeType, setTimeType] = useState(0);
  const [startTime, setStartTime] = useState(new Date());
  const [endTime, setEndTime] = useState(new Date());
  const [privacy, setPrivacy] = useState("Public");

  const handleReset = () => {
    setHabitName("");
    setHabitDescription("");
    setFrequency(0);
    setStartDate(new Date());
    setEndDate(new Date());
    setTimeType(0);
    setStartTime(new Date());
    setEndTime(new Date());
    setPrivacy("Public");
  };

  const habitStore = useBackendStore((s) => s.getHabitStore());
  const handleSave = async () => {
    // Build the habit object
    const habit: Omit<LocalHabit, "id"> = {
      title: habitName,
      description: habitDescription,
      startDate: startDate.toISOString().slice(0, 10),
      endDate: endDate.toISOString().slice(0, 10),
      reminderTime: startTime.toISOString(),
      reminderDays: ["Mon", "Tue", "Wed", "Thu", "Fri", "Sat", "Sun"],
      lastModified: new Date(),
      streaks: [],
      privacy: privacy as typeof habit.privacy,
    };
    await habitStore.createHabit(habit);
    router.back();
  };
  const saver = useBackendQuery(handleSave);

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
                  onChange={(event, date) => setStartDate(date || startDate)}
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
                  onChange={(event, date) => setEndDate(date || endDate)}
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
                <Text style={{ color: theme.colors.onPrimaryContainer }}>
                  Start Time:
                </Text>
                <DateTimePicker
                  value={startTime}
                  mode="time"
                  display="default"
                  design="material"
                  themeVariant={colorTheme}
                  onChange={(event, time) => setStartTime(time || startTime)}
                />
              </View>
              <View
                style={{
                  flexDirection: "column",
                  alignItems: "center",
                }}
              >
                <Text style={{ color: theme.colors.onPrimaryContainer }}>
                  End Time:
                </Text>
                <DateTimePicker
                  value={endTime}
                  mode="time"
                  display="default"
                  design="material"
                  themeVariant={colorTheme}
                  minimumDate={startTime}
                  onChange={(event, time) => setEndTime(time || endTime)}
                />
              </View>
            </View>
          )}
          <View style={styles.divider} />
          <View style={styles.radioGroupContainer}>
            <Text style={styles.radioGroupLabel}>Privacy:</Text>
            <RadioButtonRN
              data={[
                { label: "Public", value: "Public" },
                { label: "Friend-Only", value: "Friend-Only" },
                { label: "Private", value: "Private" },
              ]}
              selectedBtn={(e: any) => handlePrivacyChange(e.value)} // eslint-disable-line
              box={false}
              initial={
                privacy === "Public" ? 1 : privacy === "Friend-Only" ? 2 : 3
              }
              textStyle={{ color: theme.colors.onPrimaryContainer }}
              activeColor={theme.colors.onPrimaryContainer}
              style={{ ...styles.radioButtonGroup, marginLeft: 40 }}
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
