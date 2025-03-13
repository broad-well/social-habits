import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, Text } from "react-native";
import { ActivityIndicator } from "react-native-paper";
import { useFonts } from "expo-font";
import useBackendStore, { isStoreInitialized } from "@/stores/useBackendStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

export default function RootLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="index" options={{ headerShown: false }} />
      <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
      <Stack.Screen name="(account)" options={{ headerShown: false }} />
      <Stack.Screen name="(friend)" options={{ headerShown: false }} />
      <Stack.Screen name="(habit)" options={{ headerShown: false }} />
    </Stack>
  );
}
