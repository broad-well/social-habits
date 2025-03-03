import React, { useEffect, useState } from "react";
import { Text, View, ScrollView } from "react-native";
import {
  FAB,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { getDateLabel, getWeekDates } from "@/utils/dateConversion";
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
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
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
  const styles = createStyles(theme, insets);

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
      </SafeAreaView>
    </PaperProvider>
  );
}
