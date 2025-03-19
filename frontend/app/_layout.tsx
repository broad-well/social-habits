import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, Text, Alert } from "react-native";
import { useFonts } from "expo-font";
import useBackendStore, { isStoreInitialized } from "@/stores/useBackendStore";

SplashScreen.preventAutoHideAsync();
SplashScreen.setOptions({ duration: 500, fade: true });

export default function RootLayout() {
  const [fontsLoaded] = useFonts({
    Poppins: require("@/assets/fonts/Poppins/Poppins-Regular.ttf"), // eslint-disable-line
    PoppinsBold: require("@/assets/fonts/Poppins/Poppins-Bold.ttf"), // eslint-disable-line
  });
  const backendStore = useBackendStore();
  
  const initialize = React.useCallback(async () => {
    await backendStore.initHabitStore();
  }, [backendStore]);
  React.useEffect(() => {
    initialize()
      .catch((error) => Alert.alert("Failed to initialize!", `${error}`));
  }, []);

  React.useEffect(() => {
    if (fontsLoaded && isStoreInitialized(backendStore)) {
      SplashScreen.hide();
    }
  }, [fontsLoaded, backendStore]);

  // Prevent the screens from rendering if backendStore is not initialized
  // because they assume that it is initialized
  if (fontsLoaded && isStoreInitialized(backendStore)) {
    return (
      <Stack screenOptions={{ headerShown: false }}>
        <Stack.Screen name="index" options={{ headerShown: false }} />
        <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
        <Stack.Screen name="(account)" options={{ headerShown: false }} />
        <Stack.Screen name="(friend)" options={{ headerShown: false }} />
        <Stack.Screen name="(habit)" options={{ headerShown: false }} />
      </Stack>
    );
  } else {
    return <View>
      <Text>Loading...</Text>
    </View>;
  }
}
