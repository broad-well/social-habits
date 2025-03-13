import React from "react";
import { Stack } from "expo-router";
import * as SplashScreen from "expo-splash-screen";
import { View, Text, Alert } from "react-native";
import { ActivityIndicator } from "react-native-paper";
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
    return <Stack screenOptions={{ headerShown: false }} />;
  } else {
    return <View>
      <Text>Loading...</Text>
    </View>;
  }
}
