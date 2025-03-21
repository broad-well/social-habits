import { Stack } from "expo-router";
import React from "react";

export default function DetailLayout() {
  return (
    <Stack screenOptions={{ headerShown: false }}>
      <Stack.Screen name="[id]" options={{ headerShown: false }} />
    </Stack>
  );
}
