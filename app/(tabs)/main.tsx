import React from "react";
import { Text, View, StyleSheet, ScrollView, Platform } from "react-native";
import { FAB } from "react-native-paper";
import {
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useEffect } from "react";
import { useFonts } from "expo-font";
import DarkThemeColors from "../../constants/DarkThemeColors.json";
import LightThemeColors from "../../constants/LightThemeColors.json";
import { useColorTheme } from "../../stores/useColorTheme";
import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";

export default function Main() {
  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { colorTheme } = useColorTheme();
  const insets = useSafeAreaInsets();

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
      backgroundColor: theme.colors.primary,
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

  // Helper function to get dates for calendar
  const getWeekDates = () => {
    const today = new Date();
    const dates = [];
    for (let i = -3; i <= 3; i++) {
      const date = new Date(today);
      date.setDate(today.getDate() + i);
      dates.push(date);
    }
    return dates;
  };

  return (
    <PaperProvider theme={theme}>
      <SafeAreaView style={styles.safeArea}>
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
                    style={[styles.dayText, { color: theme.colors.onPrimary }]}
                  >
                    {date.toLocaleDateString("en-US", { weekday: "short" })}
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
            onPress={() => {
              // Handle new habit creation
              router.push("/new-habit");
            }}
            small={false}
          />
        </View>
      </SafeAreaView>
    </PaperProvider>
  );
}
