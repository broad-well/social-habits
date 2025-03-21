import React, { useState, useEffect } from "react";
import { Alert, Text, View, StyleSheet, ActivityIndicator } from "react-native";
import {
  Button,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
  TextInput
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Stack, router } from "expo-router";
import Avatar from "@/components/accounts/Avatar";
import useEmailStore from "@/stores/useEmail";
import useBackendStore from "@/stores/useBackendStore";

export default function Account() {
  const { colorTheme } = useColorTheme();
  const { email } = useEmailStore();
  const backend = useBackendStore((u) => u.server);  // Access the backend service
  const [username, setUsername] = useState<string | null>(null);  // State for username
  const [loading, setLoading] = useState<boolean>(true);  // State to handle loading
  const [isEditing, setIsEditing] = useState<boolean>(false); // State to handle edit mode
  const [newName, setNewName] = useState<string>(""); // State for new name input

  const theme = {
    ...DefaultTheme,
    colors:
      colorTheme === "light" ? LightThemeColors.colors : DarkThemeColors.colors,
  };

  const styles = StyleSheet.create({
    container: {
      flex: 1,
      justifyContent: "center",
      alignItems: "center",
      padding: 30,
    },
    avatarContainer: {
      marginBottom: 10,
    },
    name: {
      fontSize: 20,
      fontFamily: "PoppinsBold",
      textAlign: "center",
      marginBottom: 20,
    },
    title: {
      fontSize: 26,
      fontFamily: "PoppinsBold",
      textAlign: "center",
      marginBottom: 30,
    },
    inputContainer: {
      width: "80%",
      marginBottom: 20,
    },
    userInput: {
      backgroundColor: "transparent",
      width: "100%",
      height: 40, // Set height to avoid excessive space
      paddingVertical: 8, // Reduce padding to make it more compact
    },
    button: {
      width: "80%",
      paddingVertical: 10,
      borderRadius: 8,
      elevation: 3,
      marginBottom: 20,
    },
    buttonLabel: {
      fontSize: 16,
      fontFamily: "Poppins",
      color: "#fff",
    },
    signupContainer: {
      marginTop: 10,
    },
    signupLink: {
      textDecorationLine: "underline",
      fontWeight: "bold",
    },
  });

  // Fetch user profile based on the email
  useEffect(() => {
    if (email) {
      backend.fetchProfileByEmail(email)
        .then((profile) => {
          if (profile) {
            setUsername(profile.name);  // Set username from profile
          }
        })
        .catch((error) => {
          console.error("Error fetching user profile:", error);
        })
        .finally(() => setLoading(false));  // Set loading to false when done
    }
  }, [email, backend]);

  // Delete account function
  const deleteAccount = async () => {
    Alert.alert(
      "Delete Account",
      "Are you sure you want to delete your account? This action cannot be undone.",
      [
        {
          text: "Cancel",
          style: "cancel",
        },
        {
          text: "Delete",
          style: "destructive",
          onPress: async () => {
            try {
              await backend.deleteUser();
              router.replace("/(account)/sign-in");
            } catch (error) {
              console.error("Error deleting account:", error);
              Alert.alert("Error", "Failed to delete account. Please try again.");
            }
          },
        },
      ]
    );
  };

  // Update the profile with the new name
  const updateProfile = async () => {
    if (newName === username) {
      return; // If name is not changed, do nothing
    }

    try {
      await backend.updateUser({ name: newName }); // Send updated name to backend
      setUsername(newName); // Update the frontend with the new name
      setIsEditing(false); // Exit edit mode
    } catch (error) {
      console.error("Error updating profile:", error);
    }
  };

  if (loading) {
    return (
      <PaperProvider theme={theme}>
        <View style={styles.container}>
          <ActivityIndicator size="large" animating />
        </View>
      </PaperProvider>
    );
  }

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen
        name="account"
        options={{
          headerShown: false,
          title: "Account",
        }}
      />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primaryContainer }]}
      >
        <View style={styles.avatarContainer}>
          <Avatar imageUrl="https://i.pinimg.com/originals/ae/c6/2f/aec62fe5319733b32fde1a6a3ff28e7b.jpg" />
        </View>

        <View>
        
          {isEditing ? (
            <TextInput
              mode="outlined"
              label="Username"
              value={newName}
              onChangeText={setNewName}
              inputMode="text"
              style={styles.userInput}
              theme={theme}
              autoCapitalize="none"
            />
          ) : (
            <Text style={[styles.name, { color: theme.colors.primary }]}>
            {username}
            </Text>
          )}
        
        </View>

        <Text style={[styles.title, { color: theme.colors.primary }]}>
          My Account
        </Text>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
          onPress={isEditing ? updateProfile : () => setIsEditing(true)}
        >
          {isEditing ? "Save Changes" : "Update Profile"}
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
          onPress={() => router.push("/(friend)/friend-list" as any)} // eslint-disable-line
        >
          Friend List
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#ff4444" }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            router.replace("/(account)/sign-in" as any); // eslint-disable-line
          }}
        >
          Sign Out
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#ff4444" }]}
          labelStyle={styles.buttonLabel}
          onPress={deleteAccount}
        >
          Delete Account
        </Button>
      </View>
    </PaperProvider>
  );
}
