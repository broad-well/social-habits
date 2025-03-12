import React, { useEffect, useState, useCallback, useMemo } from "react";
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
import createStyles from "@/styles/NewHabitStyles";
import MultiSelectDropdown from "@/components/MultiSelectDropdown";

export default function HabitCreation() {
  const screenOptions = {
    headerShown: false,
  };

  const [loaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });
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

  const handleSave = useCallback(() => {
    // Logic to save the habit
    router.back();
  }, []);

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

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  const theme = useMemo(
    // eslint-disable-line
    () => ({
      ...DefaultTheme,
      colors:
        colorTheme === "light"
          ? LightThemeColors.colors
          : DarkThemeColors.colors,
    }),
    [colorTheme]
  );

  const styles = useMemo(() => createStyles(theme), [theme]); // eslint-disable-line

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
