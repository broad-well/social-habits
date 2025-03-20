import React, { useEffect, useState } from "react";
import { Text, View, ScrollView, Alert } from "react-native";
import {
  FAB,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  ActivityIndicator,
} from "react-native-paper";
import DarkThemeColors from "../../constants/DarkThemeColors.json";
import LightThemeColors from "../../constants/LightThemeColors.json";
import { useColorTheme } from "../../stores/useColorTheme";
import { router, Stack } from "expo-router";
import {
  SafeAreaView,
  useSafeAreaInsets,
} from "react-native-safe-area-context";
import createStyles from "@/styles/MainStyles";
import { getDateLabel, getWeekDates } from "@/utils/dateConversion";
import HabitList from "@/components/HabitList";
import useBackendStore from "@/stores/useBackendStore";
import { Habit } from "@/utils/service";
import { LocalHabit } from "@/utils/habitStore";

export default function Main() {
  const { colorTheme } = useColorTheme();
  const insets = useSafeAreaInsets();
  const [selectedDate, setSelectedDate] = useState(new Date());
  const habitStore = useBackendStore((s) => s.getHabitStore());
  const habitStoreLastUpdate = useBackendStore((s) => s.lastHabitUpdate);

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
              <Text style={[styles.dayText]}>{getDateLabel(date)}</Text>
              <Text style={[styles.dateText]}>{date.getDate()}</Text>
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

  const [currentDateHabits, setCurrentDateHabits] = React.useState<LocalHabit[] | null>(null);
  React.useEffect(() => {
    (async () => {
      const habits = await habitStore.listHabits(selectedDate.toISOString().slice(0, 10));
      setCurrentDateHabits(habits ?? []);
    })().catch(e => Alert.alert("Failed to list habits", `${e}`));
  }, [selectedDate, habitStoreLastUpdate]);

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={{ headerShown: false }} />
      <SafeAreaView style={styles.safeArea}>
        {renderHeader()}
        {currentDateHabits !== null ?
          <HabitList habits={currentDateHabits} /> :
          <ActivityIndicator animating size="large" />}
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
          color={theme.colors.onPrimary}
          onPress={() => {
            router.push("/(habit)/new-habit"); // eslint-disable-line
          }}
        />
      </SafeAreaView>
    </PaperProvider>
  );
}
