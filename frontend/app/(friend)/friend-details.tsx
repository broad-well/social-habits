import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, ScrollView } from "react-native";
import { DefaultTheme, Appbar, Card, Avatar, PaperProvider, Button, Text } from "react-native-paper";
import { useColorTheme } from "@/stores/useColorTheme";
import useBackendStore from "@/stores/useBackendStore";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { FriendListItem } from "@/utils/service";
import { UserProfile } from "@/utils/service";
import { Auth } from "firebase/auth";

const UserProfileScreen = ({ friendId }: { friendId: string }) => {

    const stylesheet = StyleSheet.create({
      container: {
        flex: 1,
        padding: 20,
      },
      profileCard: {
        marginBottom: 16,
        padding: 16,
      },
      name: {
        fontSize: 20,
        fontWeight: "bold",
      },
      habitsContainer: {
        marginTop: 16,
      },
      habitsHeader: {
        fontSize: 16,
        fontWeight: "bold",
        marginBottom: 8,
      },
      habitItem: {
        fontSize: 14,
        marginVertical: 4,
      },
      errorContainer: {
        padding: 16,
        alignItems: "center",
      },
    });

    const [userData, setUserData] = useState<UserProfile | null>(null);
    const backend = useBackendStore((u) => u.server);

    // Fetch user profile by ID (adjust based on your backend functions)
    const fetchUserProfile = async (friendId: string): Promise<UserProfile | null> => {
      const data = await backend.fetchProfileById(friendId);
      return data;
    };

    useEffect(() => {
      const loadProfileData = async () => {
        const data = await fetchUserProfile(friendId);
        if (data) {
          setUserData(data);
        }
      };

      loadProfileData();
    }, [friendId]);

    const renderHabits = () => {
      if (!userData) return null;

      return userData.visibleHabits.map((habit) => (
        <View key={habit.id} style={stylesheet.habitItem}>
          <Text style={stylesheet.habitsHeader}>{habit.title}</Text>
          <Text>{habit.description}</Text>
          <Text>Start Date: {habit.startDate}</Text>
          <Text>End Date: {habit.endDate}</Text>
          <Text>Reminder Time: {habit.reminderTime}</Text>
          <Text>Streaks: {habit.streaks.join(", ")}</Text>
        </View>
      ));
    };

    return (
      <ScrollView style={stylesheet.container}>
        {userData ? (
          <View style={stylesheet.profileCard}>
            <Text style={stylesheet.name}>{userData.name}'s Profile</Text>
            {renderHabits()}
          </View>
        ) : (
          <View style={stylesheet.errorContainer}>
            <Text>Loading...</Text>
          </View>
        )}
      </ScrollView>
    );
};

export default UserProfileScreen;
