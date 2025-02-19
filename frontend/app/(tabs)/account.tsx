import { Alert, Text, View, StyleSheet, Image } from "react-native";
import { Button, TextInput, IconButton } from "react-native-paper";
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
import { Stack, router } from "expo-router";
import { auth } from "@/config/firebaseConfig";

const handleDeleteAccount = async () => {
  try {
    const user = auth.currentUser;
    if (!user) {
      Alert.alert("Error", "No user is signed in.");
      return;
    }

    // Send request to backend
    const response = await fetch("https://your-backend.com/deleteUser", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ firebaseId: user.uid }),
    });

    const data = await response.json();
    if (response.ok) {
      Alert.alert("Success", data.message);
      await user.delete(); // Delete from client-side Firebase Auth
    } else {
      throw new Error(data.error || "Failed to delete account");
    }
  } catch (error) {
    Alert.alert("Error", error.message);
  }
};

export default function Account() {
  const [loaded] = useFonts({
    Poppins: require("../../assets/fonts/Poppins/Poppins-Regular.ttf"),
    PoppinsBold: require("../../assets/fonts/Poppins/Poppins-Bold.ttf"),
  });

  const { colorTheme } = useColorTheme();

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
    input: {
      backgroundColor: "transparent",
      fontFamily: "Poppins",
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

  const avatarStyle = {
    width: 120,
    height: 120,
    borderRadius: 60,
    borderWidth: 3,
    borderColor: theme.colors.onPrimary,
  };

  useEffect(() => {
    if (loaded) {
      SplashScreen.hideAsync();
    }
  }, [loaded]);

  if (!loaded) {
    return null;
  }

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen options={{ headerShown: false }} />
      <View
        style={[styles.container, { backgroundColor: theme.colors.primary }]}
      >
        <View style={styles.avatarContainer}>
          <Image
            source={{
              uri: "https://i.pinimg.com/originals/ae/c6/2f/aec62fe5319733b32fde1a6a3ff28e7b.jpg",
            }} // Placeholder image
            style={avatarStyle}
          />
        </View>

        <Text style={[styles.title, { color: theme.colors.onPrimary }]}>
          My Account
        </Text>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {}}
        >
          Update Profile
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {}}
        >
          Friend List
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.onPrimary }]}
          labelStyle={[styles.buttonLabel, { fontSize: 14 }]}
          onPress={() => {}}
        >
          Update My Courses
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#ff4444" }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            router.replace("/");
          }}
        >
          Sign Out
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#ff4444" }]}
          labelStyle={styles.buttonLabel}
          onPress={handleDeleteAccount}
        >
          Sign Out
        </Button>
      </View>
    </PaperProvider>
  );
}
