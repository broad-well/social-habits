<<<<<<< HEAD
import React, { useEffect } from "react";
import { Text, View, StyleSheet, ScrollView, Platform } from "react-native";
import { FAB ,
=======
import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import {
  FAB,
>>>>>>> 53416223fa03403dcfa11a8e3b21b3ac40123203
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
<<<<<<< HEAD
=======
import { getDateLabel, getWeekDates } from "@/utils/dateConversion";
>>>>>>> 53416223fa03403dcfa11a8e3b21b3ac40123203
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import createStyles from "@/styles/MainStyles";
import { getHabitByDay } from "@/utils/getHabitByDay";
import HabitList from "@/components/HabitList";

export default function Main() {
  const [loaded] = useFonts({
<<<<<<< HEAD
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"),  // eslint-disable-line
=======
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
>>>>>>> 53416223fa03403dcfa11a8e3b21b3ac40123203
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });

  const { colorTheme } = useColorTheme();
  const insets = useSafeAreaInsets();

  const [selectedDate, setSelectedDate] = useState(new Date());

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
<<<<<<< HEAD
  const styles = StyleSheet.create({
    safeArea: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    container: {
      flex: 1,
      position: "relative",
      backgroundColor: theme.colors.background,
    },
    calendarContainer: {
      paddingVertical: 15,
      borderBottomWidth: 1,
      borderBottomColor: theme.colors.onSurface,
    },
    dateItem: {
      width: 60,
      height: 80,
      justifyContent: "center",
      alignItems: "center",
      marginHorizontal: 5,
      borderRadius: 8,
      backgroundColor: theme.colors.surface,
    },
    todayDateItem: {
      backgroundColor: theme.colors.onPrimary,
    },
    dayText: {
      fontSize: 14,
      fontFamily: "Poppins",
      color: theme.colors.onSurface,
    },
    dateText: {
      fontSize: 18,
      fontFamily: "PoppinsBold",
      color: theme.colors.onSurface,
    },
    contentContainer: {
      flex: 1,
      backgroundColor: theme.colors.background,
    },
    habitsContainer: {
      padding: 20,
    },
    sectionTitle: {
      fontSize: 20,
      fontFamily: "PoppinsBold",
      marginBottom: 15,
      color: theme.colors.onBackground,
    },
    fab: {
      position: "absolute",
      right: 16,
      backgroundColor: theme.colors.primary,
      zIndex: 10,
      elevation: 6,
      shadowColor: "#000",
      shadowOffset: {
        width: 0,
        height: 2,
      },
      shadowOpacity: 0.25,
      shadowRadius: 3.84,
    },
  });
=======
  const styles = createStyles(theme, insets);
>>>>>>> 53416223fa03403dcfa11a8e3b21b3ac40123203

  const renderHeader = () => (
    <View style={styles.headerContainer}>
      {/* Calendar Section */}
      <View style={[styles.calendarContainer, { marginTop: insets.top - 50 }]}>
        <ScrollView horizontal showsHorizontalScrollIndicator={false}>
          {getWeekDates().map((date, index) => (
            <View
              key={index}
              style={[
                styles.dateItem,
                date.toDateString() === selectedDate.toDateString() &&
                  styles.todayDateItem,
              ]}
              onTouchEnd={() => setSelectedDate(date)}
            >
              <Text style={[styles.dayText, { color: theme.colors.onPrimary }]}>
                {getDateLabel(date)}
              </Text>
              <Text
                style={[styles.dateText, { color: theme.colors.onPrimary }]}
              >
                {date.getDate()}
              </Text>
            </View>
          ))}
        </ScrollView>
      </View>

      {/* Section Title */}
      <Text
        style={[
          styles.sectionTitle,
          { color: theme.colors.onBackground, marginTop: 10, fontSize: 19 },
        ]}
      >
        Habits for {getDateLabel(selectedDate, false)}
      </Text>
    </View>
  );

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
<<<<<<< HEAD
        <Stack.Screen options={{ headerShown: false }} />
        <View style={styles.container}>
          {/* Calendar Section */}
          <View
            style={[styles.calendarContainer, { marginTop: insets.top - 50 }]}
          >
            <ScrollView horizontal showsHorizontalScrollIndicator={false}>
              {getWeekDates().map((date, index) => (
                <View
                  key={index}
                  style={[styles.dateItem, index === 3 && styles.todayDateItem]}
                >
                  <Text
                    style={[styles.dayText, { color: theme.colors.primary }]}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
                  </Text>
                  <Text
                    style={[styles.dateText, { color: theme.colors.primary }]}
                  >
                    {date.getDate()}
                  </Text>
                </View>
              ))}
            </ScrollView>
          </View>

          {/* Scrollable Content */}
          <ScrollView style={styles.contentContainer}>
            <View style={styles.habitsContainer}>
              <Text
                style={[
                  styles.sectionTitle,
                  { color: theme.colors.onBackground },
                ]}
              >
                Today's Habits
              </Text>
              {/* Add your habit list items here */}
            </View>
          </ScrollView>

          {/* Add New Habit Button */}
          <FAB
            icon="plus"
            label="Add New Habit"
            style={[
              styles.fab,
              {
                bottom: insets.bottom + 30,
                backgroundColor: theme.colors.primary,
              },
            ]}
            color={theme.colors.onPrimary}
            onPress={() => {
              // Handle new habit creation
              router.push("/new-habit");
            }}
          />
        </View>
=======
        {renderHeader()}
        <HabitList
          habits={getHabitByDay(selectedDate.toISOString().slice(0, 10))}
        />
        <FAB
          icon="plus"
          label="Add New Habit"
          style={[
            styles.fab,
            {
              bottom: insets.bottom + 60,
              backgroundColor: theme.colors.primary,
            },
          ]}
          onPress={() => {
            router.push("/(habit)/new-habit");
          }}
          small={false}
        />
>>>>>>> 53416223fa03403dcfa11a8e3b21b3ac40123203
      </SafeAreaView>
    </PaperProvider>
  );
}
