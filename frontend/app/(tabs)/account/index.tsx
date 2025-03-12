import React, { useEffect } from "react";
import { Text, View, StyleSheet } from "react-native";
import {
  Button,
  MD3LightTheme as DefaultTheme,
  PaperProvider,
} from "react-native-paper";
import * as SplashScreen from "expo-splash-screen";
import { useFonts } from "expo-font";
import DarkThemeColors from "@/constants/DarkThemeColors.json";
import LightThemeColors from "@/constants/LightThemeColors.json";
import { useColorTheme } from "@/stores/useColorTheme";
import { Stack, router } from "expo-router";
import Avatar from "@/components/accounts/Avatar";

export default function Account() {
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

  return (
    <PaperProvider theme={theme}>
      <Stack.Screen
        name="AccountScreen"
        options={{
          headerShown: false,
          title: "Account",
        }}
      />
      <View
        style={[
          styles.container,
          { backgroundColor: theme.colors.primaryContainer },
        ]}
      >
        <View style={styles.avatarContainer}>
          <Avatar imageUrl="https://i.pinimg.com/originals/ae/c6/2f/aec62fe5319733b32fde1a6a3ff28e7b.jpg" />
        </View>

        <Text style={[styles.title, { color: theme.colors.primary }]}>
          My Account
        </Text>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {}}
        >
          Update Profile
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={styles.buttonLabel}
          onPress={() => router.push("/(tabs)/account/friends" as any)} // eslint-disable-line
        >
          Friend List
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: theme.colors.primary }]}
          labelStyle={[styles.buttonLabel]}
          onPress={() => {}}
        >
          Share My Streaks
        </Button>

        <Button
          mode="contained"
          style={[styles.button, { backgroundColor: "#ff4444" }]}
          labelStyle={styles.buttonLabel}
          onPress={() => {
            router.replace("/(account)/login" as any); // eslint-disable-line
          }}
        >
          Sign Out
        </Button>
      </View>
    </PaperProvider>
  );
}
