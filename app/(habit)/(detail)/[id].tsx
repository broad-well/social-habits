import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View, Image } from "react-native";
import { Habit } from "@/utils/service";
import MonthlyView from "@/components/ui/MonthlyView";
import getHabitById from "@/utils/getHabitById";
import { useColorTheme } from "@/stores/useColorTheme";
import LightThemeColors from "@/constants/LightThemeColors.json";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import { Title, Paragraph, Button, Appbar } from "react-native-paper";

export default function Detail() {
  const { colorTheme } = useColorTheme();
  const theme = colorTheme === "light" ? LightThemeColors : DarkThemeColors;
  const screenOptions = {
    headerShown: false,
  };

  const { id } = useLocalSearchParams();
  const habit: Habit = getHabitById("1" as string);

  const streakCount = calculateStreak(habit.streaks);

  const handleGoBack = () => {
    router.back();
  };

  const getStreakImageUrl = (streakCount: number) => {
    if (streakCount === 0) {
      return {
        uri: Image.resolveAssetSource(require("@/assets/images/deadfire.jpg")) // eslint-disable-line
          .uri,
      };
    } else if (streakCount < 5) {
      return {
        uri: Image.resolveAssetSource(require("@/assets/images/smallfire.png")) // eslint-disable-line
          .uri,
      };
    } else {
      return {
        uri: Image.resolveAssetSource(require("@/assets/images/largefire.jpg")) // eslint-disable-line
          .uri,
      };
    }
  };

  const getStreakMessage = (streakCount: number) => {
    if (streakCount === 0) {
      return "Don't worry, every day is a new opportunity to start!";
    } else {
      return `You have kept doing this habit for ${streakCount} days! Keep it up!`;
    }
  };

  // Add styles for the Detail component
  const styles = StyleSheet.create({
    content: {
      borderRadius: 10,
      marginBottom: 60,
    },
    sectionTitle: {
      marginLeft: "auto",
      marginRight: "auto",
      fontSize: 30,
      fontWeight: "bold",
      marginBottom: 10,
    },
    streakContainer: {
      alignItems: "center",
      marginVertical: 5,
      zIndex: 1,
    },
    streakImage: {
      width: 150,
      height: 150,
      zIndex: 1,
    },
    streakTextContainer: {
      backgroundColor: theme.colors.onPrimary,
      paddingVertical: 10,
      paddingHorizontal: 20,
      borderRadius: 15,
      marginTop: 10,
      shadowColor: "#000",
      shadowOffset: { width: 0, height: 2 },
      shadowOpacity: 0.3,
      shadowRadius: 3.84,
      elevation: 5,
      alignItems: "center",
    },
    streakText: {
      lineHeight: 35,
      color: theme.colors.primary,
      fontSize: 24,
      fontWeight: "bold",
    },
    descriptionText: {
      color: theme.colors.primary,
      fontSize: 16,
      lineHeight: 24,
      marginVertical: 10,
      textAlign: "center",
    },
  });

  return (
    <>
      <Appbar.Header
        style={{
          backgroundColor: theme.colors.background,
          height: 40,
        }}
      >
        <Appbar.BackAction onPress={handleGoBack} />
        <Appbar.Content
          title="Detail"
          titleStyle={{
            fontSize: 18,
          }}
        />
      </Appbar.Header>
      <Stack.Screen options={screenOptions} />
      <ScrollView style={{ backgroundColor: "white", padding: 20 }}>
        <View style={styles.content}>
          <Title
            style={{
              ...styles.sectionTitle,
              color: theme.colors.primary,
            }}
          >
            {habit.title}
          </Title>
          <Paragraph style={styles.descriptionText}>
            {habit.description}
          </Paragraph>
          <View style={styles.streakContainer}>
            <Image
              source={getStreakImageUrl(streakCount)}
              style={styles.streakImage}
              resizeMode="contain"
            />
            <View style={styles.streakTextContainer}>
              <Paragraph style={styles.streakText}>
                {getStreakMessage(streakCount)}
              </Paragraph>
            </View>
          </View>
          <MonthlyView streaks={habit.streaks} />
          <Button mode="contained" onPress={() => {}} style={{ marginTop: 10 }}>
            Complete Habit!
          </Button>
          <Button
            mode="contained"
            onPress={() => navigateToUpdatePage(id as string)}
            style={{ marginTop: 10 }}
          >
            Update Habit
          </Button>
        </View>
      </ScrollView>
    </>
  );
}

// Helper function to calculate streak count
function calculateStreak(streaks: string[]): number {
  return streaks.length;
}

// Function to navigate to the update page
function navigateToUpdatePage(id: string) {
  router.push(`/(habit)/(detail)/${id}/update` as any); // eslint-disable-line
}
