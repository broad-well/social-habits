import React from "react";
import { Stack } from "expo-router";

export default function AccountTabLayout() {
  const screenOptions = {
    headerShown: false,
  };

  return (
    <Stack screenOptions={screenOptions}>
      <Stack.Screen name="index" options={{ title: "Account" }} />
    </Stack>
  );
}
