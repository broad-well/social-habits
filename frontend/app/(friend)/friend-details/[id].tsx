import { useLocalSearchParams, router } from "expo-router";
import React, { useEffect, useState } from "react";
import { View, ActivityIndicator, FlatList, StyleSheet, ScrollView } from "react-native";
import { DefaultTheme, Appbar, PaperProvider, Text } from "react-native-paper";
import { useColorTheme } from "@/stores/useColorTheme";
import useBackendStore from "@/stores/useBackendStore";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { UserProfile } from "@/utils/service";
import HabitPanel from "@/components/HabitPanel";  // Import HabitPanel to render habits
import SimpleHabitPanel from "@/components/SimpleHabitPanel";

const UserProfileScreen = () => {
  const { colorTheme } = useColorTheme();
  const theme = {
    ...DefaultTheme,
    colors: colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

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
      fontSize: 24,
      fontWeight: "bold",
      marginBottom: 10,
    },
    subtitle: {
      fontSize: 16,
      marginBottom: 10,
      color: theme.colors.onBackground,
    },
    habitsContainer: {
      marginTop: 16,
    },
    errorContainer: {
      padding: 16,
      alignItems: "center",
    },
    sectionTitle: {
      fontSize: 19,
      fontWeight: "bold",
      marginBottom: 10,
    },
    listContainer: {
      paddingBottom: 130, // Adjust padding for the list
    },
  });

  const { id: friendId } = useLocalSearchParams(); // Get the friendId from the route
  const [userData, setUserData] = useState<UserProfile | null>(null);
  const backend = useBackendStore((u) => u.server);

  // Fetch user profile by ID
  const fetchUserProfile = async (friendId: string): Promise<UserProfile | null> => {
    const data = await backend.fetchProfileByName(friendId);
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

  const renderHeader = () => (
    <View>
      <Text style={stylesheet.name}>{userData?.name}'s Profile</Text>
      <Text style={stylesheet.subtitle}>Email: {userData?.email}</Text>
      <Text style={stylesheet.subtitle}>Friend Count: {userData?.friendCount}</Text>
    </View>
  );

  const renderHabits = () => {
    if (!userData) return null;

    return (
      <FlatList
        data={userData.visibleHabits}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => <SimpleHabitPanel habit={item} />}
        contentContainerStyle={stylesheet.listContainer}
      />
    );
  };

  return (
    <PaperProvider theme={theme}>
      <Appbar.Header>
        <Appbar.BackAction onPress={() => router.back()} />
        <Appbar.Content title="Friend's Profile" />
      </Appbar.Header>

      <ScrollView style={stylesheet.container}>
        {userData ? (
          <>
            {renderHeader()}

            <View style={stylesheet.habitsContainer}>
              <Text style={stylesheet.sectionTitle}>Habits:</Text>
              {renderHabits()}
            </View>
          </>
        ) : (
          <ActivityIndicator size="large" animating />
        )}
      </ScrollView>
    </PaperProvider>
  );
};

export default UserProfileScreen;
