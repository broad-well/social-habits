import React, { useEffect, useState } from "react";
import { Text, View, StyleSheet, ScrollView } from "react-native";
import { Button, TextInput, Appbar ,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import RadioButtonRN from "radio-buttons-react-native";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
import DateTimePicker from "@react-native-community/datetimepicker";
import { scheduleHabitNotification, sendLocalNotification } from "./utils/notifications";
import { HabitStore } from "../utils/habitStore"

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

  const handleSave = async () => {
    // Logic to save the habit
    const notificationId = await scheduleHabitNotification(habitName, startTime);

    // Logic to save notification ID
    // await HabitStore.setHabitNotificationId(habitId, notificationId);

    const hour = startTime.getHours();
    const minute = startTime.getMinutes();
    const title = "Notification scheduled!"
    const body = `Daily reminders for ${habitName} will be sent at ${hour}:${minute}`
    await sendLocalNotification(title, body);

    router.back();
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

  const styles = StyleSheet.create({
    divider: {
      width: "100%",
      opacity: 0.3,
      height: 1,
      backgroundColor: theme.colors.primary,
      marginVertical: 10,
    },
    container: {
      paddingVertical: 40,
      alignItems: "center",
    },
    formContainer: {
      width: "100%",
      alignItems: "center",
    },
    title: {
      fontSize: 28,
      fontFamily: "PoppinsBold",
      textAlign: "center",
      marginBottom: 30,
    },
    input: {
      marginBottom: 20,
      backgroundColor: "transparent",
      width: "100%",
    },
    checkboxContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      marginBottom: 20,
    },
    checkboxItem: {
      flexDirection: "row",
      alignItems: "center",
    },
    checkboxLabel: {
      marginLeft: 8,
    },
    radioButtonContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-around",
      alignItems: "center",
      marginBottom: 20,
    },
    button: {
      width: "100%",
      paddingVertical: 10,
      borderRadius: 8,
      marginBottom: 20,
    },
    logo: {
      width: 150,
      height: 150,
      marginBottom: 30,
    },
    buttonLabel: {
      fontSize: 18,
      fontFamily: "Poppins",
      color: "#fff",
    },
    link: {
      textDecorationLine: "none",
      color: "#fff",
    },
    signupContainer: {
      marginTop: 10,
    },
    signupLink: {
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
    datePickerContainer: {
      display: "flex",
      justifyContent: "space-around",
      width: "110%",
      flexDirection: "row",
      alignItems: "center",
      paddingRight: 10,
      paddingLeft: 0,
      marginBottom: 20,
    },
    timePickerContainer: {
      width: "100%",
      flexDirection: "row",
      justifyContent: "space-between",
      alignItems: "center",
      marginTop: 0,
      marginBottom: 20,
    },
    radioGroupContainer: {
      display: "flex",
      justifyContent: "space-between",
      width: "100%",
      flexDirection: "row",
      alignItems: "center",
      marginBottom: 20,
    },
    radioGroupLabel: {
      marginRight: 10,
      color: theme.colors.onPrimaryContainer,
      fontSize: 16,
    },
    radioButtonGroup: {
      flex: 1,
      alignItems: "flex-end",
    },
  });

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
                <Text style={{ color: theme.colors.onPrimaryContainer }}>End Date:</Text>
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
                <Text style={{ color: theme.colors.onPrimaryContainer }}>End Time:</Text>
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
