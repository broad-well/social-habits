import React, { useState } from "react";
import { View } from "react-native";
import { Text, Button } from "react-native-paper";
import { useColorTheme } from "@/stores/useColorTheme";
import LightThemeColors from "@/constants/LightThemeColors.json";
import DarkThemeColors from "@/constants/DarkThemeColors.json";

// Component to render the monthly view
function MonthlyView({ streaks }: { streaks: string[] }) {
  const [currentDate, setCurrentDate] = useState(new Date());

  const currentMonth = currentDate.getMonth();
  const currentYear = currentDate.getFullYear();
  const daysInMonth = new Date(currentYear, currentMonth + 1, 0).getDate();
  const firstDayOfMonth = new Date(currentYear, currentMonth, 1).getDay();

  const { colorTheme } = useColorTheme();
  const theme = colorTheme === "light" ? LightThemeColors : DarkThemeColors;

  const isCompleted = (day: number) => {
    const dateStr = new Date(currentYear, currentMonth, day)
      .toISOString()
      .slice(0, 10);
    return streaks.includes(dateStr);
  };

  const handleMonthChange = (direction: number) => {
    const newDate = new Date(currentYear, currentMonth + direction, 1);
    setCurrentDate(newDate);
  };

  const styles = {
    calendarContainer: {
      padding: 10,
      backgroundColor: theme.colors.onPrimary,
      borderRadius: 10,
      marginVertical: 10, // Reduced margin to decrease gap
    },
    dateItem: {
      width: "13%" as const,
      aspectRatio: 1,
      justifyContent: "center" as const,
      alignItems: "center" as const,
      marginVertical: 5,
      borderRadius: 5,
      backgroundColor: theme.colors.primaryContainer,
      borderWidth: 1,
      borderColor: theme.colors.onPrimaryContainer,
    },
    completedDateItem: {
      backgroundColor: "lightgreen",
    },
    dayText: {
      fontSize: 14,
      color: theme.colors.primary,
    },
    dayHeader: {
      width: "13%" as const,
      textAlign: "center" as const,
      fontWeight: "bold" as const,
      color: theme.colors.primary,
    },
    weekRow: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      flexWrap: "wrap" as const,
    },
    monthHeader: {
      flexDirection: "row" as const,
      justifyContent: "space-between" as const,
      alignItems: "center" as const,
      marginBottom: 10,
    },
    monthText: {
      fontSize: 18,
      fontWeight: "bold" as const,
    },
  };

  const daysOfWeek = ["Sun", "Mon", "Tue", "Wed", "Thu", "Fri", "Sat"];
  const monthNames = [
    "January",
    "February",
    "March",
    "April",
    "May",
    "June",
    "July",
    "August",
    "September",
    "October",
    "November",
    "December",
  ];

  return (
    <View style={styles.calendarContainer}>
      <View style={styles.monthHeader}>
        <Button onPress={() => handleMonthChange(-1)}>{"<"}</Button>
        <Text style={styles.monthText}>
          {monthNames[currentMonth]} {currentYear}
        </Text>
        <Button onPress={() => handleMonthChange(1)}>{">"}</Button>
      </View>
      <View style={styles.weekRow}>
        {daysOfWeek.map((day) => (
          <Text key={day} style={styles.dayHeader}>
            {day}
          </Text>
        ))}
      </View>
      <View style={styles.weekRow}>
        {Array.from({ length: firstDayOfMonth }).map((_, i) => (
          <View key={`empty-start-${i}`} style={styles.dateItem} />
        ))}
        {Array.from({ length: daysInMonth }, (_, i) => i + 1).map((day) => (
          <View
            key={day}
            style={[
              styles.dateItem,
              isCompleted(day) && styles.completedDateItem,
            ]}
          >
            <Text style={styles.dayText}>{day}</Text>
          </View>
        ))}
        {Array.from({
          length: (7 - ((firstDayOfMonth + daysInMonth) % 7)) % 7,
        }).map((_, i) => (
          <View key={`empty-end-${i}`} style={styles.dateItem} />
        ))}
      </View>
    </View>
  );
}

export default MonthlyView;
