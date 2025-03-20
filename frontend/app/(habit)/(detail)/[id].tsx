import React from "react";
import { router, Stack, useLocalSearchParams } from "expo-router";
import { ScrollView, StyleSheet, View, Image, Alert } from "react-native";
import MonthlyView from "@/components/ui/MonthlyView";
import { useColorTheme } from "@/stores/useColorTheme";
import LightThemeColors from "@/constants/LightThemeColors.json";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import { Title, Paragraph, Button, Appbar, ActivityIndicator, Text } from "react-native-paper";
import useBackendStore from "@/stores/useBackendStore";
import useBackendQuery from "@/utils/useBackendQuery";
import { LocalHabit } from "@/utils/habitStore";

export default function Detail() {
  const { colorTheme } = useColorTheme();
  const theme = colorTheme === "light" ? LightThemeColors : DarkThemeColors;
  const screenOptions = {
    headerShown: false,
  };

  const { id } = useLocalSearchParams();
  const store = useBackendStore((u) => u.getHabitStore());
  const habit = useBackendQuery(() => store.readHabit(id as string));
  React.useEffect(() => { habit.send(); }, []);

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

  const onPressComplete = React.useCallback(async () => {
    try {
      await store.markHabitCompletion(id as string, today(), true);
    } catch (e) {
      Alert.alert("Failed to mark habit complete", `${e}`);
    }
  }, [store]);

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
      {habit.loading && <ActivityIndicator size="large" animating />}
      {habit.error && <Text>Failed: {habit.error.message}</Text>}
      {habit.result && 
        <ScrollView style={{ backgroundColor: "white", padding: 20 }}>
          <View style={styles.content}>
            <Title
              style={{
                ...styles.sectionTitle,
                color: theme.colors.primary,
              }}
            >
              {habit.result.title}
            </Title>
            <Paragraph style={styles.descriptionText}>
              {habit.result.description}
            </Paragraph>
            <View style={styles.streakContainer}>
              <Image
                source={getStreakImageUrl(habit.result.streaks.length)}
                style={styles.streakImage}
                resizeMode="contain"
              />
              <View style={styles.streakTextContainer}>
                <Paragraph style={styles.streakText}>
                  {getStreakMessage(habit.result.streaks.length)}
                </Paragraph>
              </View>
            </View>
            <MonthlyView streaks={habit.result.streaks} />
            {canCompleteHabitToday(habit.result) &&
              <Button mode="contained" onPress={onPressComplete} style={{ marginTop: 10 }}>
              Complete Habit!
              </Button>
            }
            <Button
              mode="contained"
              onPress={() => navigateToUpdatePage(id as string)}
              style={{ marginTop: 10 }}
            >
              Update Habit
            </Button>
          </View>
        </ScrollView>}
    </>
  );
}

// Function to navigate to the update page
function navigateToUpdatePage(id: string) {
  router.push(`/(habit)/(update)/${id}`);
}

function canCompleteHabitToday(habit: LocalHabit) {
  const todaysDate = today();
  return !habit.streaks.includes(todaysDate) &&
    todaysDate >= habit.startDate.substring(0, 10) &&
    todaysDate <= habit.endDate.substring(0, 10);
}

function today() {
  return new Date().toLocaleDateString("sv");
}